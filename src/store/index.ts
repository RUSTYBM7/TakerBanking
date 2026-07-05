import { create } from 'zustand';
import type {
  User, AdminUser, Transaction, ChatRoom, ChatMessage,
  AdminAction, KycDocument, Notification, CurrencyRate, AppConfig,
  AccountStatus, BankAccount, Card, Loan, LoanPayment,
  OnboardingData, ScheduledTransfer, BillPayment, OnboardingStep
} from '@/types';

interface AppState {
  // Auth
  user: User | null;
  admin: AdminUser | null;
  isAuthenticated: boolean;
  isAdminAuthenticated: boolean;

  // Data
  transactions: Transaction[];
  chatRooms: ChatRoom[];
  chatMessages: ChatMessage[];
  adminActions: AdminAction[];
  kycDocuments: KycDocument[];
  notifications: Notification[];
  users: User[];
  adminUsers: AdminUser[];
  currencyRates: CurrencyRate[];
  config: AppConfig;
  bankAccounts: BankAccount[];
  cards: Card[];
  loans: Loan[];
  loanPayments: LoanPayment[];
  scheduledTransfers: ScheduledTransfer[];
  billPayments: BillPayment[];
  onboardingData: OnboardingData | null;

  // UI State
  activeChatRoom: string | null;
  selectedUserId: string | null;
  darkMode: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setAdmin: (admin: AdminUser | null) => void;
  login: (user: User) => void;
  loginAdmin: (admin: AdminUser) => void;
  logout: () => void;
  logoutAdmin: () => void;
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  setChatRooms: (rooms: ChatRoom[]) => void;
  addChatMessage: (message: ChatMessage) => void;
  setChatMessages: (messages: ChatMessage[]) => void;
  markRoomRead: (roomId: string) => void;
  setActiveChatRoom: (roomId: string | null) => void;
  setAdminActions: (actions: AdminAction[]) => void;
  addAdminAction: (action: AdminAction) => void;
  setKycDocuments: (docs: KycDocument[]) => void;
  updateKycDocument: (id: string, updates: Partial<KycDocument>) => void;
  setNotifications: (notifications: Notification[]) => void;
  markNotificationRead: (id: string) => void;
  setUsers: (users: User[]) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  setAdminUsers: (admins: AdminUser[]) => void;
  setSelectedUserId: (id: string | null) => void;
  toggleDarkMode: () => void;
  setLoading: (loading: boolean) => void;
  setConfig: (config: Partial<AppConfig>) => void;
  addFunds: (userId: string, amount: number, currency: string, adminId: string, note?: string) => void;
  debitUser: (userId: string, amount: number, currency: string, adminId: string, reason: string) => void;
  suspendUser: (userId: string) => void;
  activateUser: (userId: string) => void;
  impersonateUser: (userId: string) => void;
  stopImpersonation: () => void;

  // Bank Account Actions
  setBankAccounts: (accounts: BankAccount[]) => void;
  addBankAccount: (account: BankAccount) => void;
  updateBankAccount: (id: string, updates: Partial<BankAccount>) => void;
  deleteBankAccount: (id: string) => void;
  setPrimaryAccount: (id: string) => void;

  // Card Actions
  setCards: (cards: Card[]) => void;
  addCard: (card: Card) => void;
  updateCard: (id: string, updates: Partial<Card>) => void;
  freezeCard: (id: string) => void;
  unfreezeCard: (id: string) => void;
  blockCard: (id: string) => void;

  // Loan Actions
  setLoans: (loans: Loan[]) => void;
  addLoan: (loan: Loan) => void;
  updateLoan: (id: string, updates: Partial<Loan>) => void;
  setLoanPayments: (payments: LoanPayment[]) => void;
  addLoanPayment: (payment: LoanPayment) => void;

  // Onboarding Actions
  setOnboardingData: (data: OnboardingData | null) => void;
  updateOnboardingData: (updates: Partial<OnboardingData>) => void;
  nextOnboardingStep: () => void;
  prevOnboardingStep: () => void;
  resetOnboarding: () => void;

  // Scheduled Transfer Actions
  setScheduledTransfers: (transfers: ScheduledTransfer[]) => void;
  addScheduledTransfer: (transfer: ScheduledTransfer) => void;
  updateScheduledTransfer: (id: string, updates: Partial<ScheduledTransfer>) => void;
  deleteScheduledTransfer: (id: string) => void;

  // Bill Payment Actions
  setBillPayments: (payments: BillPayment[]) => void;
  addBillPayment: (payment: BillPayment) => void;
}

const defaultConfig: AppConfig = {
  brandName: 'OrbitPay Credit Union',
  brandColors: {
    mint: '#A8E6CF',
    lavender: '#DDA0DD',
    yellow: '#F4F7C0',
    black: '#0A0A0A',
  },
  glassOpacity: 0.15,
  transferFee: 0.5,
  withdrawalFee: 1.0,
  investmentFee: 0.75,
  enabledCurrencies: ['USD', 'EUR', 'GBP', 'BTC'],
};

export const useStore = create<AppState>((set, get) => ({
  // Initial state
  user: {
    id: 'demo-user',
    fullName: 'Aisha Okoro',
    email: 'aisha.okoro@orbitpay.demo',
    phone: '+15551234567',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AishaOkoro',
    kycStatus: 'approved',
    memberSince: '2023-01-15',
    role: 'member',
  },
  admin: null,
  isAuthenticated: false,
  isAdminAuthenticated: false,
  transactions: [],
  chatRooms: [],
  chatMessages: [],
  adminActions: [],
  kycDocuments: [],
  notifications: [],
  users: [],
  adminUsers: [],
  currencyRates: [
    { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1, change: 0 },
    { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.92, change: 0.15 },
    { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.79, change: -0.08 },
    { code: 'BTC', name: 'Bitcoin', symbol: '₿', rate: 0.000015, change: 2.34 },
  ],
  config: defaultConfig,
  bankAccounts: [
    {
      id: 'acc-default-1',
      memberId: 'demo-user',
      accountNumber: '****1234',
      accountType: 'checking',
      currency: 'USD',
      balance: 24580.50,
      availableBalance: 24380.50,
      holdBalance: 200,
      status: 'active',
      openedAt: '2023-01-15T10:00:00Z',
      createdAt: '2023-01-15T10:00:00Z',
    },
    {
      id: 'acc-default-2',
      memberId: 'demo-user',
      accountNumber: '****5678',
      accountType: 'savings',
      currency: 'USD',
      balance: 52340.00,
      availableBalance: 52340.00,
      holdBalance: 0,
      status: 'active',
      openedAt: '2023-01-15T10:00:00Z',
      createdAt: '2023-01-15T10:00:00Z',
    },
    {
      id: 'acc-default-3',
      memberId: 'demo-user',
      accountNumber: '****9012',
      accountType: 'investment',
      currency: 'USD',
      balance: 125000.00,
      availableBalance: 125000.00,
      holdBalance: 0,
      status: 'active',
      openedAt: '2023-02-01T10:00:00Z',
      createdAt: '2023-02-01T10:00:00Z',
    },
  ],
  transactions: [
    { id: 'tx-1', userId: 'demo-user', type: 'deposit', amount: 3200, currency: 'USD', description: 'Salary deposit', status: 'completed', createdAt: new Date().toISOString(), date: new Date().toISOString() },
    { id: 'tx-2', userId: 'demo-user', type: 'card_purchase', amount: -149.99, currency: 'USD', description: 'Amazon', status: 'completed', createdAt: new Date(Date.now()-86400000).toISOString(), date: new Date(Date.now()-86400000).toISOString(), recipientAvatar: null, merchant: 'Amazon' },
    { id: 'tx-3', userId: 'demo-user', type: 'card_purchase', amount: -42.50, currency: 'USD', description: 'Uber', status: 'completed', createdAt: new Date(Date.now()-172800000).toISOString(), date: new Date(Date.now()-172800000).toISOString(), recipientAvatar: null, merchant: 'Uber' },
    { id: 'tx-4', userId: 'demo-user', type: 'transfer', amount: -500, currency: 'USD', description: 'Transfer to Savings', status: 'completed', createdAt: new Date(Date.now()-259200000).toISOString(), date: new Date(Date.now()-259200000).toISOString(), recipientAvatar: null },
    { id: 'tx-5', userId: 'demo-user', type: 'card_purchase', amount: -89.00, currency: 'USD', description: 'Starbucks', status: 'completed', createdAt: new Date(Date.now()-345600000).toISOString(), date: new Date(Date.now()-345600000).toISOString(), recipientAvatar: null, merchant: 'Starbucks' },
    { id: 'tx-6', userId: 'demo-user', type: 'deposit', amount: 1500, currency: 'USD', description: 'Freelance payment', status: 'completed', createdAt: new Date(Date.now()-432000000).toISOString(), date: new Date(Date.now()-432000000).toISOString() },
  ],
  cards: [
    {
      id: 'card-default-1',
      userId: 'demo-user',
      accountId: 'acc-default-1',
      cardNumberLast4: '4729',
      cardHolderName: 'Aisha Okoro',
      expiryMonth: 8,
      expiryYear: 2028,
      network: 'visa',
      status: 'active',
      cardType: 'debit',
      dailyLimit: 5000,
      monthlyLimit: 25000,
      balance: 24580.50,
      currency: 'USD',
      createdAt: '2024-01-15T10:00:00Z',
      design: 'platinum',
    },
    {
      id: 'card-default-2',
      userId: 'demo-user',
      accountId: 'acc-default-2',
      cardNumberLast4: '8193',
      cardHolderName: 'Aisha Okoro',
      expiryMonth: 11,
      expiryYear: 2027,
      network: 'mastercard',
      status: 'active',
      cardType: 'credit',
      dailyLimit: 10000,
      monthlyLimit: 50000,
      balance: 1240.75,
      currency: 'USD',
      createdAt: '2024-03-22T14:30:00Z',
      design: 'emerald',
    },
    {
      id: 'card-default-3',
      userId: 'demo-user',
      accountId: 'acc-default-1',
      cardNumberLast4: '2056',
      cardHolderName: 'Aisha Okoro',
      expiryMonth: 4,
      expiryYear: 2026,
      network: 'visa',
      status: 'frozen',
      cardType: 'debit',
      dailyLimit: 2000,
      monthlyLimit: 10000,
      balance: 0,
      currency: 'USD',
      createdAt: '2023-08-10T09:15:00Z',
      design: 'lavender',
    },
  ],
  loans: [
    {
      id: 'loan-1',
      userId: 'demo-user',
      loanType: 'personal',
      principal: 25000,
      outstandingBalance: 12450.00,
      interestRate: 8.5,
      termMonths: 36,
      startDate: '2024-06-15',
      endDate: '2027-06-15',
      monthlyPayment: 786.50,
      nextPaymentDate: '2026-08-15',
      status: 'active',
      purpose: 'Home renovation',
      createdAt: '2024-06-15',
    }
  ],
  loanPayments: [
    { id: 'lp-1', loanId: 'loan-1', amount: 786.50, paidAt: '2026-07-15', principal: 600, interest: 186.50 },
    { id: 'lp-2', loanId: 'loan-1', amount: 786.50, paidAt: '2026-06-15', principal: 595, interest: 191.50 },
    { id: 'lp-3', loanId: 'loan-1', amount: 786.50, paidAt: '2026-05-15', principal: 590, interest: 196.50 },
  ],
  scheduledTransfers: [
    { id: 'st-1', userId: 'demo-user', fromAccountId: 'acc-default-1', toAccountId: 'acc-default-2', amount: 500, frequency: 'monthly', nextRun: '2026-08-01', status: 'active', description: 'Auto-save transfer', createdAt: '2024-01-01' }
  ],
  billPayments: [
    { id: 'bp-1', userId: 'demo-user', payee: 'ConEd Electricity', amount: 142.30, dueDate: '2026-08-05', status: 'scheduled', createdAt: '2026-07-01' },
    { id: 'bp-2', userId: 'demo-user', payee: 'Verizon Wireless', amount: 85.00, dueDate: '2026-08-12', status: 'scheduled', createdAt: '2026-07-01' },
  ],
  onboardingData: null,
  activeChatRoom: null,
  selectedUserId: null,
  darkMode: false,
  isLoading: false,

  // Auth actions
  setUser: (user) => set({ user }),
  setAdmin: (admin) => set({ admin }),

  login: (user) => set({ user, isAuthenticated: true }),

  loginAdmin: (admin) => set({ admin, isAdminAuthenticated: true }),

  logout: () => set({ user: null, isAuthenticated: false }),

  logoutAdmin: () => set({ admin: null, isAdminAuthenticated: false }),

  // Transaction actions
  setTransactions: (transactions) => set({ transactions }),

  addTransaction: (transaction) =>
    set((state) => ({ transactions: [transaction, ...state.transactions] })),

  updateTransaction: (id, updates) =>
    set((state) => ({
      transactions: state.transactions.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      ),
    })),

  // Chat actions
  setChatRooms: (chatRooms) => set({ chatRooms }),

  addChatMessage: (message) =>
    set((state) => {
      const messages = [...state.chatMessages, message];
      const rooms = state.chatRooms.map((r) =>
        r.id === message.roomId
          ? {
              ...r,
              lastMessage: message.content,
              lastMessageAt: message.createdAt,
              unreadCount:
                message.senderType === 'user'
                  ? r.unreadCount + 1
                  : r.unreadCount,
              updatedAt: message.createdAt,
            }
          : r
      );
      return { chatMessages: messages, chatRooms: rooms };
    }),

  setChatMessages: (messages) => set({ chatMessages: messages }),

  markRoomRead: (roomId) =>
    set((state) => ({
      chatRooms: state.chatRooms.map((r) =>
        r.id === roomId ? { ...r, unreadCount: 0 } : r
      ),
    })),

  setActiveChatRoom: (roomId) => set({ activeChatRoom: roomId }),

  // Admin actions
  setAdminActions: (actions) => set({ adminActions: actions }),

  addAdminAction: (action) =>
    set((state) => ({ adminActions: [action, ...state.adminActions] })),

  // KYC actions
  setKycDocuments: (docs) => set({ kycDocuments: docs }),

  updateKycDocument: (id, updates) =>
    set((state) => ({
      kycDocuments: state.kycDocuments.map((d) =>
        d.id === id ? { ...d, ...updates } : d
      ),
    })),

  // Notification actions
  setNotifications: (notifications) => set({ notifications }),

  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),

  // User management
  setUsers: (users) => set({ users }),

  updateUser: (id, updates) =>
    set((state) => {
      const newUsers = state.users.map((u) =>
        u.id === id ? { ...u, ...updates } : u
      );
      const newState: Partial<AppState> = { users: newUsers };
      if (state.user?.id === id) {
        newState.user = { ...state.user, ...updates };
      }
      return newState;
    }),

  setAdminUsers: (admins) => set({ adminUsers: admins }),

  setSelectedUserId: (id) => set({ selectedUserId: id }),

  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

  setLoading: (loading) => set({ isLoading: loading }),

  setConfig: (config) =>
    set((state) => ({ config: { ...state.config, ...config } })),

  // Admin user management
  addFunds: (userId, amount, currency, adminId, note) => {
    const state = get();
    const user = state.users.find((u) => u.id === userId);
    if (!user) return;

    const balanceKey = `balance${currency.charAt(0) + currency.slice(1).toLowerCase()}` as keyof User;
    const currentBalance = (user[balanceKey] as number) || 0;

    const transaction: Transaction = {
      id: `txn_${Date.now()}`,
      userId,
      type: 'credit',
      amount,
      currency: currency as any,
      status: 'completed',
      description: note || `Admin credit: +${amount} ${currency}`,
      adminId,
      adminAction: 'add_funds',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const adminAction: AdminAction = {
      id: `act_${Date.now()}`,
      adminId,
      adminName: state.admin?.fullName || 'Admin',
      actionType: 'add_funds',
      targetUserId: userId,
      targetUserName: user.fullName,
      amount,
      reason: note,
      ipAddress: '127.0.0.1',
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      transactions: [transaction, ...state.transactions],
      adminActions: [adminAction, ...state.adminActions],
      users: state.users.map((u) =>
        u.id === userId ? { ...u, [balanceKey]: currentBalance + amount } : u
      ),
      user:
        state.user?.id === userId
          ? { ...state.user, [balanceKey]: currentBalance + amount }
          : state.user,
    }));
  },

  debitUser: (userId, amount, currency, adminId, reason) => {
    const state = get();
    const user = state.users.find((u) => u.id === userId);
    if (!user) return;

    const balanceKey = `balance${currency.charAt(0) + currency.slice(1).toLowerCase()}` as keyof User;
    const currentBalance = (user[balanceKey] as number) || 0;
    if (currentBalance < amount) return;

    const transaction: Transaction = {
      id: `txn_${Date.now()}`,
      userId,
      type: 'debit',
      amount: -amount,
      currency: currency as any,
      status: 'completed',
      description: `Admin debit: ${reason}`,
      adminId,
      adminAction: 'debit_user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const adminAction: AdminAction = {
      id: `act_${Date.now()}`,
      adminId,
      adminName: state.admin?.fullName || 'Admin',
      actionType: 'debit_user',
      targetUserId: userId,
      targetUserName: user.fullName,
      amount: -amount,
      reason,
      ipAddress: '127.0.0.1',
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      transactions: [transaction, ...state.transactions],
      adminActions: [adminAction, ...state.adminActions],
      users: state.users.map((u) =>
        u.id === userId ? { ...u, [balanceKey]: currentBalance - amount } : u
      ),
      user:
        state.user?.id === userId
          ? { ...state.user, [balanceKey]: currentBalance - amount }
          : state.user,
    }));
  },

  suspendUser: (userId) =>
    set((state) => ({
      users: state.users.map((u) =>
        u.id === userId ? { ...u, accountStatus: 'suspended' as AccountStatus } : u
      ),
      user:
        state.user?.id === userId
          ? { ...state.user, accountStatus: 'suspended' as AccountStatus }
          : state.user,
    })),

  activateUser: (userId) =>
    set((state) => ({
      users: state.users.map((u) =>
        u.id === userId ? { ...u, accountStatus: 'active' as AccountStatus } : u
      ),
      user:
        state.user?.id === userId
          ? { ...state.user, accountStatus: 'active' as AccountStatus }
          : state.user,
    })),

  impersonateUser: (userId) => {
    const state = get();
    const targetUser = state.users.find((u) => u.id === userId);
    if (targetUser) {
      set({
        user: targetUser,
        isAuthenticated: true,
      });
    }
  },

  stopImpersonation: () => {
    set({ user: null, isAuthenticated: false });
  },

  // Bank Account Actions
  setBankAccounts: (accounts) => set({ bankAccounts: accounts }),

  addBankAccount: (account) =>
    set((state) => ({ bankAccounts: [...state.bankAccounts, account] })),

  updateBankAccount: (id, updates) =>
    set((state) => ({
      bankAccounts: state.bankAccounts.map((a) =>
        a.id === id ? { ...a, ...updates } : a
      ),
    })),

  deleteBankAccount: (id) =>
    set((state) => ({
      bankAccounts: state.bankAccounts.filter((a) => a.id !== id),
    })),

  setPrimaryAccount: (id) =>
    set((state) => ({
      bankAccounts: state.bankAccounts.map((a) =>
        a.id === id ? { ...a, isPrimary: true } : { ...a, isPrimary: false }
      ),
    })),

  // Card Actions
  setCards: (cards) => set({ cards: cards }),

  addCard: (card) =>
    set((state) => ({ cards: [...state.cards, card] })),

  updateCard: (id, updates) =>
    set((state) => ({
      cards: state.cards.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    })),

  freezeCard: (id) =>
    set((state) => ({
      cards: state.cards.map((c) =>
        c.id === id ? { ...c, status: 'frozen' as const } : c
      ),
    })),

  unfreezeCard: (id) =>
    set((state) => ({
      cards: state.cards.map((c) =>
        c.id === id ? { ...c, status: 'active' as const } : c
      ),
    })),

  blockCard: (id) =>
    set((state) => ({
      cards: state.cards.map((c) =>
        c.id === id ? { ...c, status: 'blocked' as const } : c
      ),
    })),

  // Loan Actions
  setLoans: (loans) => set({ loans: loans }),

  addLoan: (loan) =>
    set((state) => ({ loans: [...state.loans, loan] })),

  updateLoan: (id, updates) =>
    set((state) => ({
      loans: state.loans.map((l) =>
        l.id === id ? { ...l, ...updates } : l
      ),
    })),

  setLoanPayments: (payments) => set({ loanPayments: payments }),

  addLoanPayment: (payment) =>
    set((state) => ({ loanPayments: [...state.loanPayments, payment] })),

  // Onboarding Actions
  setOnboardingData: (data) => set({ onboardingData: data }),

  updateOnboardingData: (updates) =>
    set((state) => ({
      onboardingData: state.onboardingData
        ? { ...state.onboardingData, ...updates }
        : null,
    })),

  nextOnboardingStep: () => {
    const steps: OnboardingStep[] = [
      'welcome', 'phone', 'otp', 'personal_info', 'id_verification',
      'selfie', 'address', 'account_type', 'review', 'complete'
    ];
    set((state) => {
      if (!state.onboardingData) return state;
      const currentIndex = steps.indexOf(state.onboardingData.step);
      if (currentIndex < steps.length - 1) {
        return {
          onboardingData: {
            ...state.onboardingData,
            step: steps[currentIndex + 1],
          },
        };
      }
      return state;
    });
  },

  prevOnboardingStep: () => {
    const steps: OnboardingStep[] = [
      'welcome', 'phone', 'otp', 'personal_info', 'id_verification',
      'selfie', 'address', 'account_type', 'review', 'complete'
    ];
    set((state) => {
      if (!state.onboardingData) return state;
      const currentIndex = steps.indexOf(state.onboardingData.step);
      if (currentIndex > 0) {
        return {
          onboardingData: {
            ...state.onboardingData,
            step: steps[currentIndex - 1],
          },
        };
      }
      return state;
    });
  },

  resetOnboarding: () =>
    set({
      onboardingData: {
        step: 'welcome',
        agreedToTerms: false,
      },
    }),

  // Scheduled Transfer Actions
  setScheduledTransfers: (transfers) => set({ scheduledTransfers: transfers }),

  addScheduledTransfer: (transfer) =>
    set((state) => ({ scheduledTransfers: [...state.scheduledTransfers, transfer] })),

  updateScheduledTransfer: (id, updates) =>
    set((state) => ({
      scheduledTransfers: state.scheduledTransfers.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      ),
    })),

  deleteScheduledTransfer: (id) =>
    set((state) => ({
      scheduledTransfers: state.scheduledTransfers.filter((t) => t.id !== id),
    })),

  // Bill Payment Actions
  setBillPayments: (payments) => set({ billPayments: payments }),

  addBillPayment: (payment) =>
    set((state) => ({ billPayments: [...state.billPayments, payment] })),
}));
