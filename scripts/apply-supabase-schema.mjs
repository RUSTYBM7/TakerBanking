// scripts/apply-supabase-schema.mjs
// Runs the OrbitPay schema against the Supabase Postgres database.
// Triggered automatically by `npm run prebuild` if SUPABASE_DB_PASSWORD is set.
//
// Usage:
//   SUPABASE_DB_PASSWORD=<pwd> node scripts/apply-supabase-schema.mjs
//
// Or with full URL:
//   SUPABASE_DB_URL=postgresql://postgres:pwd@db.oyghbtzxurjtlwpraqpo.supabase.co:5432/postgres node scripts/apply-supabase-schema.mjs

import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// Supabase direct connection template
const PROJECT_REF = 'oyghbtzxurjtlwpraqpo';
const DB_HOST = `db.${PROJECT_REF}.supabase.co`;
const DB_PORT = 5432;
const DB_NAME = 'postgres';
const DB_USER = 'postgres';

import dns from 'node:dns/promises';

// Resolve hostname to IPv4 only (Vercel build env can't route IPv6 to Supabase)
async function resolveIPv4(host) {
  const addrs = await dns.lookup(host, { family: 4 });
  return addrs.address;
}

const SCHEMA_FILE = resolve(ROOT, 'supabase', 'schema.sql');

function buildConnectionString() {
  if (process.env.SUPABASE_DB_URL) return process.env.SUPABASE_DB_URL;
  const pwd = process.env.SUPABASE_DB_PASSWORD;
  if (!pwd) {
    console.error('[supabase-apply] ❌ SUPABASE_DB_PASSWORD or SUPABASE_DB_URL required');
    process.exit(1);
  }
  // Resolve to IPv4 first so pg doesn't try IPv6
  const ipv4 = await resolveIPv4(DB_HOST).catch(() => DB_HOST);
  return `postgresql://${DB_USER}:${encodeURIComponent(pwd)}@${ipv4}:${DB_PORT}/${DB_NAME}?sslmode=require`;
}

async function main() {
  const sql = readFileSync(SCHEMA_FILE, 'utf8');
  const connStr = buildConnectionString();

  console.log(`[supabase-apply] Connecting to ${DB_HOST}:${DB_PORT}/${DB_NAME}…`);
  const client = new pg.Client({
    connectionString: connStr,
    ssl: { rejectUnauthorized: false },
    // Force IPv4 — Vercel's build env doesn't always route IPv6 to Supabase
    family: 4,
    connectionTimeoutMillis: 15000,
  });

  try {
    await client.connect();
    console.log('[supabase-apply] ✅ Connected');
  } catch (err) {
    console.error('[supabase-apply] ❌ Connection failed:', err.message);
    process.exit(2);
  }

  console.log(`[supabase-apply] Applying schema (${(sql.length / 1024).toFixed(1)} KB)…`);

  try {
    await client.query(sql);
    console.log('[supabase-apply] ✅ Schema applied successfully');
  } catch (err) {
    console.error('[supabase-apply] ❌ Schema apply failed:', err.message);
    console.error('[supabase-apply] Hint: in production Supabase, comment out the');
    console.error('                auth.users stub and auth.uid() function before applying.');
    process.exit(3);
  }

  // Run smoke tests inline
  console.log('[supabase-apply] Running ledger invariant tests…');
  const SMOKE = `
    begin;
    insert into members (id, full_name, email) values ('00000000-0000-0000-0000-000000000001', 'Smoke User', 'smoke@orbitpay.local');
    insert into accounts (id, member_id, account_number, account_type, currency, balance) values
      ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000001', 'SMOKE-A', 'checking', 'USD', 1000),
      ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000001', 'SMOKE-B', 'savings', 'USD', 0);
    insert into transactions (id, txn_type, status, amount, currency, description, posted_at) values
      ('00000000-0000-0000-0000-000000000100', 'transfer', 'posted', 100, 'USD', 'smoke test', now());
    insert into ledger_entries (transaction_id, account_id, direction, amount, currency, balance_after) values
      ('00000000-0000-0000-0000-000000000100', '00000000-0000-0000-0000-000000000010', 'C', 100, 'USD', 900),
      ('00000000-0000-0000-0000-000000000100', '00000000-0000-0000-0000-000000000011', 'D', 100, 'USD', 100);
    rollback;
  `;
  try {
    await client.query(SMOKE);
    console.log('[supabase-apply] ✅ Smoke test passed (balanced entry accepted)');
  } catch (err) {
    console.error('[supabase-apply] ❌ Smoke test failed:', err.message);
    process.exit(4);
  }

  await client.end();
  console.log('[supabase-apply] 🎉 Done');
}

main().catch((err) => {
  console.error('[supabase-apply] Unexpected error:', err);
  process.exit(99);
});