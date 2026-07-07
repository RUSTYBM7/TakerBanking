import { create } from 'zustand';
import { supabase, Database } from '../lib/supabase';

type Notification = Database['public']['Tables']['notifications']['Row'];

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchNotifications: (memberId: string) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: (memberId: string) => Promise<void>;
  addNotification: (notification: Omit<Notification, 'id' | 'created_at'>) => Promise<void>;
  clearError: () => void;
}

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  fetchNotifications: async (memberId: string) => {
    try {
      set({ isLoading: true, error: null });

      const { data: notifications, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('member_id', memberId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const unreadCount = notifications?.filter((n) => !n.is_read).length || 0;

      set({ notifications: notifications || [], unreadCount, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  markAsRead: async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;

      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === notificationId ? { ...n, is_read: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  markAllAsRead: async (memberId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('member_id', memberId)
        .eq('is_read', false);

      if (error) throw error;

      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, is_read: true })),
        unreadCount: 0,
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  addNotification: async (notification) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert(notification)
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        notifications: [data, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  clearError: () => set({ error: null }),
}));

// Real-time subscription for new notifications
export const subscribeToNotifications = (memberId: string, callback: (notification: Notification) => void) => {
  const subscription = supabase
    .channel('notifications')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `member_id=eq.${memberId}`,
      },
      (payload) => {
        callback(payload.new as Notification);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
};
