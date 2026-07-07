-- =============================================================================
-- OrbitPay Credit Union — Supabase Schema
-- Version: 1.0.0
-- Target: project oyghbtzxurjtlwpraqpo.supabase.co
-- =============================================================================
-- Conventions:
--   - All tables have `id uuid default gen_random_uuid() primary key`
--   - Timestamps: created_at, updated_at with default now()
--   - Money: numeric(20,4) — never float. Currency stored as 3-char ISO code.
--   - Soft deletes via deleted_at timestamptz where retention matters
--   - All audit-relevant tables have immutable insert-only triggers
-- =============================================================================

create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";
create extension if not exists "citext";

-- Supabase stub: in real Supabase the auth schema is provided. For local testing, create it.
create schema if not exists auth;
create table if not exists auth.users (
  id uuid primary key default gen_random_uuid(),
  email text,
  created_at timestamptz default now()
);
-- Stub auth.uid() for local testing. In real Supabase, this is provided.
-- Reads uid from a session GUC; defaults to all-zero UUID when unset.
create or replace function auth.uid() returns uuid language sql stable as $$
  select coalesce(
    nullif(current_setting('orbitpay.test_uid', true), '')::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid
  );
$$;

-- =============================================================================
-- ENUMS
-- =============================================================================
do $$ begin
  create type kyc_status as enum ('pending', 'in_review', 'approved', 'rejected', 'expired');
exception when duplicate_object then null; end $$;
do $$ begin
  create type account_type as enum ('checking', 'savings', 'credit', 'loan', 'investment');
exception when duplicate_object then null; end $$;
do $$ begin
  create type account_status as enum ('active', 'frozen', 'closed', 'dormant');
exception when duplicate_object then null; end $$;
do $$ begin
  create type txn_type as enum (
    'deposit', 'withdrawal', 'transfer', 'card_purchase',
    'card_refund', 'fee', 'interest', 'loan_disbursement',
    'loan_repayment', 'wire_in', 'wire_out', 'reversal'
  );
exception when duplicate_object then null; end $$;
do $$ begin
  create type txn_status as enum ('pending', 'posted', 'reversed', 'failed', 'cancelled');
exception when duplicate_object then null; end $$;
do $$ begin
  create type loan_status as enum ('pending', 'under_review', 'approved', 'rejected', 'disbursed', 'closed', 'defaulted');
exception when duplicate_object then null; end $$;
do $$ begin
  create type employee_role as enum ('teller', 'manager', 'compliance', 'super_admin', 'auditor');
exception when duplicate_object then null; end $$;
do $$ begin
  create type employee_status as enum ('active', 'inactive', 'locked', 'terminated');
exception when duplicate_object then null; end $$;

-- =============================================================================
-- CORE IDENTITY
-- =============================================================================

create table members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete cascade,  -- Supabase Auth link
  email citext unique,
  full_name text not null,
  phone_e164 text,
  date_of_birth date,
  address jsonb default '{}'::jsonb,
  kyc_status kyc_status not null default 'pending',
  kyc_submitted_at timestamptz,
  kyc_approved_at timestamptz,
  risk_score int default 0 check (risk_score between 0 and 100),
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index on members (email);
create index on members (kyc_status) where deleted_at is null;
create index on members (user_id);

-- =============================================================================
-- ACCOUNTS — every member can hold multiple accounts (multi-currency)
-- =============================================================================

create table accounts (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references members(id) on delete restrict,
  account_number text unique not null,
  account_type account_type not null,
  currency char(3) not null,                        -- ISO 4217
  balance numeric(20,4) not null default 0,         -- materialized; ledger is source of truth
  available_balance numeric(20,4) not null default 0,
  hold_balance numeric(20,4) not null default 0,     -- pending authorizations
  status account_status not null default 'active',
  opened_at timestamptz not null default now(),
  closed_at timestamptz,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint balance_non_negative_chk check (
    account_type not in ('checking', 'savings') or balance >= 0 or status = 'closed'
  )
);
create index on accounts (member_id) where deleted_at is null;
create index on accounts (status) where deleted_at is null;
create index on accounts (currency);

-- =============================================================================
-- LEDGER — append-only, double-entry, immutable
-- =============================================================================
-- Each transaction has exactly TWO postings (debit + credit) that sum to zero.
-- `transactions` is the human-readable envelope; `ledger_entries` is the math.
-- =============================================================================

create table transactions (
  id uuid primary key default gen_random_uuid(),
  txn_type txn_type not null,
  status txn_status not null default 'pending',
  amount numeric(20,4) not null check (amount > 0),
  currency char(3) not null,
  description text,
  reference_id text,                          -- idempotency key from client
  initiated_by uuid references auth.users(id),
  approved_by uuid references auth.users(id),
  posted_at timestamptz,
  reversed_at timestamptz,
  reversal_reason text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (reference_id, currency)             -- idempotency: same key cannot post twice
);
create index on transactions (status);
create index on transactions (txn_type);
create index on transactions (initiated_by);
create index on transactions (created_at desc);

create table ledger_entries (
  id uuid primary key default gen_random_uuid(),
  transaction_id uuid not null references transactions(id) on delete restrict,
  account_id uuid not null references accounts(id) on delete restrict,
  direction char(1) not null check (direction in ('D', 'C')),  -- Debit or Credit
  amount numeric(20,4) not null check (amount > 0),
  currency char(3) not null,
  balance_after numeric(20,4) not null,       -- snapshot at posting time
  posted_at timestamptz not null default now()
);
create index on ledger_entries (account_id, posted_at desc);
create index on ledger_entries (transaction_id);

-- Enforce double-entry invariant: every transaction must sum to zero.
create or replace function check_double_entry() returns trigger as $$
declare
  total numeric(20,4);
begin
  select coalesce(sum(case when direction = 'D' then amount else -amount end), 0)
    into total
    from ledger_entries
   where transaction_id = NEW.transaction_id;
  if total <> 0 then
    raise exception 'Double-entry invariant violated for transaction %: net = %', NEW.transaction_id, total;
  end if;
  return NEW;
end;
$$ language plpgsql;

create trigger trg_check_double_entry
  after insert or update on ledger_entries
  for each row execute function check_double_entry();

-- Make ledger_entries truly immutable (no update, no delete).
create or replace function prevent_ledger_mutation() returns trigger as $$
begin
  raise exception 'Ledger entries are immutable. transaction=%', OLD.transaction_id;
end;
$$ language plpgsql;

create trigger trg_no_update_ledger before update on ledger_entries
  for each row execute function prevent_ledger_mutation();
create trigger trg_no_delete_ledger before delete on ledger_entries
  for each row execute function prevent_ledger_mutation();

-- =============================================================================
-- CARDS — debit & credit cards linked to accounts
-- =============================================================================
create table cards (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts(id) on delete restrict,
  member_id uuid not null references members(id) on delete restrict,
  card_number_last4 char(4) not null,
  card_holder_name text not null,
  expiry_month int not null check (expiry_month between 1 and 12),
  expiry_year int not null check (expiry_year between 2024 and 2099),
  network text not null check (network in ('visa', 'mastercard', 'amex', 'discover')),
  status text not null default 'active' check (status in ('active','blocked','expired','cancelled')),
  daily_limit numeric(20,4) default 5000,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on cards (member_id);
create index on cards (account_id);

-- =============================================================================
-- LOANS
-- =============================================================================
create table loans (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references members(id) on delete restrict,
  account_id uuid references accounts(id),  -- disbursement account
  principal numeric(20,4) not null check (principal > 0),
  interest_rate numeric(6,4) not null,        -- annual %, e.g. 12.5000
  term_months int not null check (term_months > 0),
  currency char(3) not null,
  status loan_status not null default 'pending',
  risk_tier text check (risk_tier in ('low','medium','high')),
  approved_at timestamptz,
  disbursed_at timestamptz,
  outstanding_balance numeric(20,4) not null default 0,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on loans (member_id);
create index on loans (status);

-- =============================================================================
-- BRANCHES + EMPLOYEES
-- =============================================================================
create table if not exists branches (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address jsonb default '{}'::jsonb,
  phone text,
  status text not null default 'open' check (status in ('open','closed')),
  created_at timestamptz not null default now()
);

create table employees (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete cascade,
  email citext unique not null,
  full_name text not null,
  role employee_role not null,
  branch_id uuid references branches(id),
  mfa_enabled boolean not null default true,
  status employee_status not null default 'active',
  failed_login_attempts int not null default 0,
  locked_until timestamptz,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on employees (role);
create index on employees (branch_id);

-- =============================================================================
-- AUDIT LOG — every privileged action recorded immutably
-- =============================================================================
create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id),
  actor_role text,
  action text not null,
  resource_type text not null,
  resource_id uuid,
  before jsonb,
  after jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now()
);
create index on audit_logs (actor_id);
create index on audit_logs (resource_type, resource_id);
create index on audit_logs (created_at desc);

-- Audit logs: append-only
create trigger trg_no_update_audit before update on audit_logs
  for each row execute function prevent_ledger_mutation();
create trigger trg_no_delete_audit before delete on audit_logs
  for each row execute function prevent_ledger_mutation();

-- =============================================================================
-- KYC DOCUMENTS
-- =============================================================================
create table kyc_documents (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references members(id) on delete cascade,
  document_type text not null,    -- passport, drivers_license, utility_bill, etc.
  storage_path text not null,      -- supabase storage path, NOT the URL
  status kyc_status not null default 'pending',
  uploaded_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewer_id uuid references employees(id),
  notes text
);
create index on kyc_documents (member_id);

-- =============================================================================
-- FRAUD ALERTS
-- =============================================================================
create table fraud_alerts (
  id uuid primary key default gen_random_uuid(),
  transaction_id uuid references transactions(id),
  member_id uuid references members(id),
  risk_score int not null,
  reason text not null,
  status text not null default 'open' check (status in ('open','investigating','resolved','escalated')),
  assigned_to uuid references employees(id),
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);
create index on fraud_alerts (status);

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================
alter table members enable row level security;
alter table accounts enable row level security;
alter table transactions enable row level security;
alter table ledger_entries enable row level security;
alter table cards enable row level security;
alter table loans enable row level security;
alter table employees enable row level security;
alter table audit_logs enable row level security;
alter table kyc_documents enable row level security;
alter table fraud_alerts enable row level security;

-- Members can read their own profile
create policy "members_self_read" on members
  for select using (user_id = auth.uid());

-- Members can read their own accounts only
create policy "accounts_member_read" on accounts
  for select using (
    member_id in (select id from members where user_id = auth.uid())
  );

-- Members can read their own transactions
create policy "txn_member_read" on transactions
  for select using (
    initiated_by = auth.uid()
    or exists (
      select 1 from ledger_entries le
      join accounts a on a.id = le.account_id
      join members m on m.id = a.member_id
      where le.transaction_id = transactions.id and m.user_id = auth.uid()
    )
  );

-- Members can read their own card
create policy "cards_member_read" on cards
  for select using (
    member_id in (select id from members where user_id = auth.uid())
  );

-- Members can read their own loans
create policy "loans_member_read" on loans
  for select using (
    member_id in (select id from members where user_id = auth.uid())
  );

-- Audit logs: only compliance/auditor roles can read
create policy "audit_employee_read" on audit_logs
  for select using (
    exists (
      select 1 from employees
      where user_id = auth.uid()
        and role in ('compliance', 'auditor', 'super_admin')
        and status = 'active'
    )
  );

-- KYC docs: only owner + compliance
create policy "kyc_owner_or_compliance" on kyc_documents
  for select using (
    member_id in (select id from members where user_id = auth.uid())
    or exists (
      select 1 from employees
      where user_id = auth.uid()
        and role in ('compliance', 'super_admin')
        and status = 'active'
    )
  );

-- Employees table: only super_admin can write; self can read own profile
create policy "employees_self_read" on employees
  for select using (user_id = auth.uid());
create policy "employees_admin_write" on employees
  for all using (
    exists (
      select 1 from employees e
      where e.user_id = auth.uid() and e.role = 'super_admin' and e.status = 'active'
    )
  );

-- =============================================================================
-- HELPER VIEWS
-- =============================================================================

-- Member account summary (joins balances + last activity)
create view v_member_accounts as
  select
    m.id as member_id,
    m.full_name,
    count(a.id) as account_count,
    sum(a.balance) as total_balance
  from members m
  left join accounts a on a.member_id = m.id and a.deleted_at is null
  where m.deleted_at is null
  group by m.id, m.full_name;

-- Trial balance view — should always sum to zero per currency
create view v_trial_balance as
  select
    account_id,
    currency,
    sum(case when direction = 'D' then amount else -amount end) as net_balance
  from ledger_entries
  group by account_id, currency;

-- =============================================================================
-- RPC FUNCTIONS FOR BANKING OPERATIONS
-- =============================================================================

-- Transfer funds between accounts (atomic operation)
create or replace function transfer_funds(
  p_from_account_id uuid,
  p_to_account_id uuid,
  p_amount numeric(20,4),
  p_description text default 'Transfer'
) returns jsonb
language plpgsql
security definer
as $$
declare
  v_from_balance numeric(20,4);
  v_result jsonb;
begin
  -- Lock accounts for update to prevent race conditions
  select balance into v_from_balance
  from accounts
  where id = p_from_account_id
  for update;

  -- Check sufficient funds
  if v_from_balance < p_amount then
    return jsonb_build_object(
      'success', false,
      'error', 'Insufficient funds'
    );
  end if;

  -- Debit from source account
  update accounts
  set balance = balance - p_amount,
      available_balance = available_balance - p_amount,
      updated_at = now()
  where id = p_from_account_id;

  -- Credit to destination account
  update accounts
  set balance = balance + p_amount,
      available_balance = available_balance + p_amount,
      updated_at = now()
  where id = p_to_account_id;

  -- Record transactions
  insert into transactions (account_id, member_id, txn_type, amount, currency, description, status)
  select p_from_account_id, member_id, 'transfer', -p_amount, currency, p_description, 'posted'
  from accounts where id = p_from_account_id;

  insert into transactions (account_id, member_id, txn_type, amount, currency, description, status)
  select p_to_account_id, member_id, 'transfer', p_amount, currency, p_description, 'posted'
  from accounts where id = p_to_account_id;

  return jsonb_build_object(
    'success', true,
    'message', 'Transfer completed successfully'
  );
end;
$$;

-- Get account balance with real-time lock
create or replace function get_account_balance(p_account_id uuid)
returns numeric(20,4)
language plpgsql
security definer
as $$
declare
  v_balance numeric(20,4);
begin
  select balance into v_balance
  from accounts
  where id = p_account_id;
  return v_balance;
end;
$$;

-- Update KYC status with audit logging
create or replace function update_kyc_status(
  p_member_id uuid,
  p_status kyc_status,
  p_admin_id uuid
) returns jsonb
language plpgsql
security definer
as $$
begin
  -- Update member KYC status
  update members
  set kyc_status = p_status,
      kyc_approved_at = case when p_status = 'approved' then now() else kyc_approved_at end,
      updated_at = now()
  where id = p_member_id;

  -- Create audit log
  insert into audit_logs (actor_id, actor_type, action, resource_type, resource_id, diff)
  values (p_admin_id, 'employee', 'kyc_status_update', 'members', p_member_id, jsonb_build_object('new_status', p_status));

  return jsonb_build_object(
    'success', true,
    'message', 'KYC status updated'
  );
end;
$$;

-- Get real-time notification count
create or replace function get_unread_notification_count(p_member_id uuid)
returns integer
language plpgsql
security definer
as $$
declare
  v_count integer;
begin
  select count(*) into v_count
  from notifications
  where member_id = p_member_id and is_read = false;
  return v_count;
end;
$$;

-- =============================================================================
-- ENABLE REALTIME FOR TABLES
-- =============================================================================
alter publication supabase_realtime add table accounts;
alter publication supabase_realtime add table transactions;
alter publication supabase_realtime add table notifications;
alter publication supabase_realtime add table support_tickets;

-- =============================================================================
-- MIGRATION COMPLETE
-- =============================================================================