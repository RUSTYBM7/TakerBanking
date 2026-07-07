import { create } from 'zustand';
import { supabase, Database } from '../lib/supabase';

type Account = Database['public']['Tables']['accounts']['Row'];
type Transaction = Database['public']['Tables']['transactions']['Row'];

interface AccountsState {
  accounts: Account[];
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchAccounts: (memberId: string) => Promise<void>;
  fetchTransactions: (accountId: string) => Promise<void>;
  createAccount: (account: Omit<Account, 'id' | 'created_at' | 'updated_at'>) => Promise<Account>;
  updateAccountStatus: (accountId: string, status: Account['status']) => Promise<void>;
  transfer: (fromAccountId: string, toAccountId: string, amount: number, description?: string) => Promise<void>;
  clearError: () => void;
}

export const useAccountsStore = create<AccountsState>((set, get) => ({
  accounts: [],
  transactions: [],
  isLoading: false,
  error: null,

  fetchAccounts: async (memberId: string) => {
    try {
      set({ isLoading: true, error: null });

      const { data: accounts, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('member_id', memberId)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({ accounts: accounts || [], isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchTransactions: async (accountId: string) => {
    try {
      set({ isLoading: true, error: null });

      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('account_id', accountId)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      set({ transactions: transactions || [], isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createAccount: async (account) => {
    try {
      set({ isLoading: true, error: null });

      const { data, error } = await supabase
        .from('accounts')
        .insert(account)
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        accounts: [data, ...state.accounts],
        isLoading: false,
      }));

      return data;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  updateAccountStatus: async (accountId: string, status: Account['status']) => {
    try {
      set({ isLoading: true, error: null });

      const { error } = await supabase
        .from('accounts')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', accountId);

      if (error) throw error;

      set((state) => ({
        accounts: state.accounts.map((acc) =>
          acc.id === accountId ? { ...acc, status } : acc
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  transfer: async (fromAccountId: string, toAccountId: string, amount: number, description?: string) => {
    try {
      set({ isLoading: true, error: null });

      // Call the RPC function for atomic transfer
      const { error } = await supabase.rpc('transfer_funds', {
        p_from_account_id: fromAccountId,
        p_to_account_id: toAccountId,
        p_amount: amount,
        p_description: description || 'Transfer',
      });

      if (error) throw error;

      // Refresh accounts and transactions
      const fromAccount = get().accounts.find((a) => a.id === fromAccountId);
      if (fromAccount) {
        await get().fetchAccounts(fromAccount.member_id);
        await get().fetchTransactions(fromAccountId);
      }

      set({ isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
