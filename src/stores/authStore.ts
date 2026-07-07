import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase, getCurrentUser, Database } from '../lib/supabase';

type Member = Database['public']['Tables']['members']['Row'];

interface AuthState {
  user: Member | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;

  // Actions
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  updateProfile: (updates: Partial<Member>) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: true,
      isAuthenticated: false,
      error: null,

      initialize: async () => {
        try {
          set({ isLoading: true, error: null });

          // Check if there's a current session
          const { data: { session } } = await supabase.auth.getSession();

          if (session?.user) {
            // Fetch member data
            const { data: member, error } = await supabase
              .from('members')
              .select('*')
              .eq('user_id', session.user.id)
              .single();

            if (error && error.code !== 'PGRST116') {
              throw error;
            }

            set({
              user: member,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            set({ isLoading: false });
          }

          // Listen for auth changes
          supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
              const { data: member } = await supabase
                .from('members')
                .select('*')
                .eq('user_id', session.user.id)
                .single();

              set({ user: member, isAuthenticated: true });
            } else if (event === 'SIGNED_OUT') {
              set({ user: null, isAuthenticated: false });
            }
          });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });

          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw error;

          if (data.user) {
            const { data: member } = await supabase
              .from('members')
              .select('*')
              .eq('user_id', data.user.id)
              .single();

            set({
              user: member,
              isAuthenticated: true,
              isLoading: false,
            });
          }
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true, error: null });

          const { error } = await supabase.auth.signOut();
          if (error) throw error;

          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          throw error;
        }
      },

      register: async (email: string, password: string, fullName: string) => {
        try {
          set({ isLoading: true, error: null });

          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { full_name: fullName },
            },
          });

          if (error) throw error;

          if (data.user) {
            // Create member record
            const { data: member, error: memberError } = await supabase
              .from('members')
              .insert({
                user_id: data.user.id,
                email,
                full_name: fullName,
                kyc_status: 'pending',
              })
              .select()
              .single();

            if (memberError) throw memberError;

            set({
              user: member,
              isAuthenticated: true,
              isLoading: false,
            });
          }
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          throw error;
        }
      },

      updateProfile: async (updates: Partial<Member>) => {
        try {
          set({ isLoading: true, error: null });

          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error('Not authenticated');

          const { data: updated, error } = await supabase
            .from('members')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('user_id', user.id)
            .select()
            .single();

          if (error) throw error;

          set({ user: updated, isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          throw error;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'orbitpay-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
