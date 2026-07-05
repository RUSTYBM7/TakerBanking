import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard, GlassBadge } from '@/components/glass';
import { useStore } from '@/store';
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bot,
  Building2,
  Car,
  Check,
  ChevronRight,
  Clock,
  Coffee,
  Copy,
  CreditCard,
  Download,
  Eye,
  EyeOff,
  Filter,
  Fuel,
  Globe,
  MapPin,
  Music,
  Plus,
  Save,
  Settings,
  Shield,
  ShoppingCart,
  Smartphone,
  Snowflake,
  Sparkles,
  Trash2,
  TrendingUp,
  Tv,
  Utensils,
  X,
  Zap
} from 'lucide-react';;

const aiSpendingInsights = [
  { icon: TrendingUp, text: "You've spent 15% less on dining this month", color: 'emerald' },
  { icon: AlertTriangle, text: "Unusual activity detected on Card ending 4242", color: 'amber' },
  { icon: Zap, text: "Tap-to-pay usage increased by 40%", color: 'cyan' },
  { icon: Shield, text: "Your cards are fully secured with AI monitoring", color: 'emerald' },
];

export default function CardsScreen() {
  const navigate = useNavigate();
  const { cards, user, freezeCard, unfreezeCard, blockCard } = useStore();
  const [showCVV, setShowCVV] = useState<string | null>(null);
  const [showCardNumber, setShowCardNumber] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'debit' | 'credit'>('all');
  const [showCardMenu, setShowCardMenu] = useState<string | null>(null);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [showCardDetail, setShowCardDetail] = useState<string | null>(null);
  const [showLimitsModal, setShowLimitsModal] = useState<string | null>(null);
  const [travelMode, setTravelMode] = useState<Record<string, boolean>>({});
  const [currentInsight, setCurrentInsight] = useState(0);
  const [aiTypingText, setAiTypingText] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // AI typing effect for spending insights
  useEffect(() => {
    const insight = aiSpendingInsights[currentInsight];
    let charIndex = 0;
    const typeInterval = setInterval(() => {
      if (charIndex <= insight.text.length) {
        setAiTypingText(insight.text.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typeInterval);
      }
    }, 30);

    const switchInterval = setInterval(() => {
      setCurrentInsight((prev) => (prev + 1) % aiSpendingInsights.length);
    }, 8000);

    return () => {
      clearInterval(typeInterval);
      clearInterval(switchInterval);
    };
  }, [currentInsight]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Normalize card data so the screen can read either old or new field names
  const normalizeCard = (card: any) => ({
    ...card,
    lastFourDigits: card.lastFourDigits || card.cardNumberLast4 || card.last4 || '****',
    name: card.name || card.cardHolderName || user?.fullName || 'Cardholder',
    type: card.type || card.cardType || 'debit',
    cardNetwork: card.cardNetwork || (card.network ? (card.network.charAt(0).toUpperCase() + card.network.slice(1)) : 'Visa'),
    expiryMonth: card.expiryMonth || 12,
    expiryYear: card.expiryYear || new Date().getFullYear() + 3,
    cvv: card.cvv || '•••',
    color: card.color || card.design || 'navy',
    isVirtual: card.isVirtual ?? false,
    status: card.status || 'active',
  });

  const userCards = cards.filter((c) => c.userId === user?.id).map(normalizeCard);
  const filteredCards = activeTab === 'all'
    ? userCards
    : userCards.filter((c) => c.type === activeTab);

  const getCardGradient = (card: any) => {
    const gradients: Record<string, string> = {
      mint: 'from-[#A8E6CF] to-[#88D4AB]',
      purple: 'from-[#DDA0DD] to-[#C48BC4]',
      gold: 'from-[#F4F7C0] to-[#E5EB8A]',
      navy: 'from-[#1a1a2e] to-[#16213e]',
      coral: 'from-[#FF6B6B] to-[#EE5A5A]',
      platinum: 'from-[#E5E4E2] to-[#BBBABE]',
      emerald: 'from-[#50C878] to-[#0FAB7F]',
      lavender: 'from-[#B57EDC] to-[#967BB6]',
    };
    return gradients[card.color] || gradients.navy;
  };

  const handleFreeze = (cardId: string) => {
    const card = cards.find((c) => c.id === cardId);
    if (card?.status === 'frozen') {
      unfreezeCard(cardId);
      showToast('Card unfrozen successfully', 'success');
    } else {
      freezeCard(cardId);
      showToast('Card frozen successfully', 'success');
    }
    setShowCardMenu(null);
  };

  const handleBlock = (cardId: string) => {
    blockCard(cardId);
    showToast('Card blocked. Please contact support to unblock.', 'error');
    setShowCardMenu(null);
  };

  const handleTravelMode = (cardId: string) => {
    setTravelMode((prev) => ({ ...prev, [cardId]: !prev[cardId] }));
    showToast(
      travelMode[cardId] ? 'Travel mode disabled' : 'Travel mode enabled for international use',
      'success'
    );
  };

  const copyCardInfo = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard', 'success');
  };

  const currentInsightData = aiSpendingInsights[currentInsight];

  // Sample spending history
  const spendingHistory = [
    { id: 1, merchant: 'Apple Store', category: 'Electronics', amount: -249.99, date: 'Today', icon: Smartphone },
    { id: 2, merchant: 'Whole Foods', category: 'Groceries', amount: -87.32, date: 'Yesterday', icon: ShoppingCart },
    { id: 3, merchant: 'Uber', category: 'Transportation', amount: -24.50, date: 'Jul 3', icon: Car },
    { id: 4, merchant: 'Netflix', category: 'Entertainment', amount: -15.99, date: 'Jul 1', icon: Tv },
  ];

  return (
    <div className="p-5 space-y-5 animate-fade-in pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-emerald-800">My Cards</h1>
          <p className="text-sm text-emerald-800/50">
            {userCards.length} card{userCards.length !== 1 ? 's' : ''} linked
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddCardModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full text-sm font-medium shadow-lg shadow-emerald-500/30"
        >
          <Plus className="w-4 h-4" />
          Add Card
        </motion.button>
      </div>

      {/* AI Spending Insights Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-sm border border-cyan-200/30 p-4 rounded-2xl"
      >
        <div className="flex items-center gap-3">
          <motion.div
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center flex-shrink-0 shadow-lg"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Bot className="w-5 h-5 text-white" />
          </motion.div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-xs font-semibold text-cyan-600">AI Insights</p>
              <motion.div
                className="w-2 h-2 rounded-full bg-emerald-500"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
            <div className="flex items-center gap-2">
              <currentInsightData.icon className={`w-4 h-4 ${
                currentInsightData.color === 'emerald' ? 'text-emerald-500' :
                currentInsightData.color === 'amber' ? 'text-amber-500' :
                'text-cyan-500'
              }`} />
              <p className="text-sm text-emerald-800 flex-1">
                {aiTypingText}
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="ml-1"
                >
                  |
                </motion.span>
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tab Filter */}
      <div className="flex gap-2 p-1 bg-white/50 backdrop-blur-sm rounded-full border border-white/30">
        {(['all', 'debit', 'credit'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${
              activeTab === tab
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                : 'text-emerald-800/60 hover:text-emerald-800'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Cards List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredCards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Card */}
              <div
                className={`relative h-52 rounded-3xl bg-gradient-to-br ${getCardGradient(card)} p-5 overflow-hidden cursor-pointer shadow-xl`}
                onClick={() => setShowCardDetail(card.id)}
              >
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
                </div>

                {/* Floating Elements */}
                <motion.div
                  className="absolute top-4 right-4 w-16 h-16 border border-white/20 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div
                  className="absolute bottom-8 left-8 w-12 h-12 border border-white/10 rounded-full"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                />

                {/* Card Content */}
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {card.isVirtual && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-white/20 rounded-full">
                          <Smartphone className="w-3 h-3" />
                          <span className="text-xs text-white">Virtual</span>
                        </div>
                      )}
                      <span className="text-white/80 text-xs uppercase tracking-wider font-medium">
                        {card.cardNetwork}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                          <Building2 className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-white/90 text-xs font-semibold tracking-tight">OrbitPay</span>
                      </div>
                      <motion.div
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          card.status === 'active' ? 'bg-emerald-500/80 text-white' :
                          card.status === 'frozen' ? 'bg-blue-500/80 text-white' :
                          'bg-red-500/80 text-white'
                        }`}
                        animate={card.status === 'active' ? { scale: [1, 1.05, 1] } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {card.status.charAt(0).toUpperCase() + card.status.slice(1)}
                      </motion.div>
                    </div>
                  </div>

                  <div>
                    <p className="text-white/60 text-xs mb-1 font-medium">Card Number</p>
                    <p className="text-white text-xl font-mono tracking-wider">
                      {showCardNumber === card.id ? `•••• •••• •••• ${card.lastFourDigits}` : '•••• •••••••• ••••'}
                    </p>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-white/60 text-xs font-medium">Card Holder</p>
                      <p className="text-white text-sm font-semibold">{card.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/60 text-xs font-medium">Expires</p>
                      <p className="text-white text-sm font-semibold">
                        {String(card.expiryMonth).padStart(2, '0')}/{card.expiryYear}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Frozen Overlay */}
                {card.status === 'frozen' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center z-20 backdrop-blur-sm"
                  >
                    <div className="text-center text-white">
                      <Snowflake className="w-16 h-16 mx-auto mb-2 animate-pulse" />
                      <p className="font-bold text-lg">CARD FROZEN</p>
                      <p className="text-xs opacity-75 mt-1">Tap to unfreeze</p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Quick Actions Bar */}
              <div className="mt-3 flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleFreeze(card.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${
                    card.status === 'frozen'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-600'
                      : 'border-white/30 bg-white/50 text-emerald-800 hover:bg-emerald-50'
                  }`}
                >
                  {card.status === 'frozen' ? (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span className="text-sm font-medium">Unfreeze</span>
                    </>
                  ) : (
                    <>
                      <Snowflake className="w-4 h-4" />
                      <span className="text-sm font-medium">Freeze</span>
                    </>
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCVV(showCVV === card.id ? null : card.id)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-white/30 bg-white/50 text-emerald-800 hover:bg-emerald-50 transition-all"
                >
                  {showCVV === card.id ? (
                    <>
                      <EyeOff className="w-4 h-4" />
                      <span className="text-sm font-medium">Hide CVV</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" />
                      <span className="text-sm font-medium">Show CVV</span>
                    </>
                  )}
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCardMenu(showCardMenu === card.id ? null : card.id)}
                  className="w-12 flex items-center justify-center py-3 rounded-xl border border-white/30 bg-white/50 text-emerald-800 hover:bg-emerald-50 transition-all"
                >
                  <Settings className="w-4 h-4" />
                </motion.button>
              </div>

              {/* CVV Display */}
              <AnimatePresence>
                {showCVV === card.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    className="absolute left-1/2 -translate-x-1/2 -top-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-sm font-mono shadow-lg z-30"
                  >
                    CVV: {card.cvv}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Card Menu Dropdown */}
              <AnimatePresence>
                {showCardMenu === card.id && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-emerald-100/50 overflow-hidden z-40 w-56"
                  >
                    <div className="p-3 border-b border-emerald-100">
                      <p className="text-xs text-emerald-800/50">Card ending in {card.lastFourDigits}</p>
                    </div>
                    <button
                      onClick={() => { copyCardInfo(`•••• •••• •••• ${card.lastFourDigits}`); setShowCardMenu(null); }}
                      className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-emerald-50 transition-colors"
                    >
                      <Copy className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm text-emerald-800">Copy Card Number</span>
                    </button>
                    <button
                      onClick={() => { handleTravelMode(card.id); setShowCardMenu(null); }}
                      className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-emerald-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Globe className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm text-emerald-800">Travel Mode</span>
                      </div>
                      <div className={`w-8 h-5 rounded-full p-0.5 ${travelMode[card.id] ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${travelMode[card.id] ? 'translate-x-3' : ''}`} />
                      </div>
                    </button>
                    <button
                      onClick={() => { setShowLimitsModal(card.id); setShowCardMenu(null); }}
                      className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-emerald-50 transition-colors"
                    >
                      <Shield className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm text-emerald-800">Set Spending Limits</span>
                    </button>
                    <button
                      onClick={() => { setShowCardDetail(card.id); setShowCardMenu(null); }}
                      className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-emerald-50 transition-colors"
                    >
                      <BarChart3 className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm text-emerald-800">View Spending</span>
                    </button>
                    <button
                      onClick={() => { handleBlock(card.id); setShowCardMenu(null); }}
                      className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-red-500">Block Card</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredCards.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-10 h-10 text-emerald-400" />
            </div>
            <p className="text-emerald-800/50 mb-4">No {activeTab === 'all' ? '' : activeTab} cards found</p>
            <button
              onClick={() => setShowAddCardModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full text-sm font-medium shadow-lg"
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Request a Card
            </button>
          </motion.div>
        )}
      </div>

      {/* Spending Summary */}
      {userCards.length > 0 && (
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-emerald-800">Spending This Month</h3>
            <button className="text-sm text-emerald-600 flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-4 bg-red-50 rounded-xl">
              <p className="text-xs text-red-600/70 mb-1">Total Spent</p>
              <p className="text-xl font-bold text-red-500">
                ${userCards.reduce((sum, c) => sum + Math.abs(c.balance), 0).toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-emerald-50 rounded-xl">
              <p className="text-xs text-emerald-600/70 mb-1">Available</p>
              <p className="text-xl font-bold text-emerald-500">
                ${userCards.reduce((sum, c) => sum + (c.availableCredit || c.balance), 0).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {spendingHistory.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-white/50 rounded-xl">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-emerald-800">{item.merchant}</p>
                  <p className="text-xs text-emerald-800/50">{item.category} • {item.date}</p>
                </div>
                <p className="text-sm font-semibold text-red-500">
                  ${Math.abs(item.amount).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Card Benefits */}
      <GlassCard className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-emerald-500" />
          <h3 className="font-semibold text-emerald-800">Card Benefits</h3>
        </div>
        <div className="space-y-3">
          {[
            { icon: Shield, title: 'Zero Liability Protection', desc: 'Protected against unauthorized transactions' },
            { icon: Smartphone, title: 'Contactless Payments', desc: 'Secure tap-to-pay anywhere' },
            { icon: Globe, title: 'Global Acceptance', desc: 'Accepted in 200+ countries' },
          ].map((benefit, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-3 p-3 bg-emerald-50/50 rounded-xl"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <benefit.icon className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-800">{benefit.title}</p>
                <p className="text-xs text-emerald-800/60">{benefit.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Add Card Modal - Fixed Footer */}
      <AnimatePresence>
        {showAddCardModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/50 flex items-end"
            onClick={() => setShowAddCardModal(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="w-full bg-white rounded-t-3xl flex flex-col"
              style={{ maxHeight: '92vh' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex-shrink-0 px-5 pt-4 pb-3 border-b border-emerald-100/50">
                <div className="w-12 h-1 bg-emerald-200 rounded-full mx-auto mb-4" />
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-emerald-800">Add New Card</h2>
                  <button onClick={() => setShowAddCardModal(false)} className="p-2 -mr-2">
                    <X className="w-5 h-5 text-emerald-800/40" />
                  </button>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4" style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 16px)' }}>
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-emerald-800 mb-3 block">Card Type</label>
                    <div className="grid grid-cols-2 gap-4">
                      {['debit', 'credit'].map((type) => (
                        <button
                          key={type}
                          className="p-4 rounded-2xl border-2 border-emerald-200 bg-emerald-50 text-center hover:border-emerald-500 transition-colors"
                        >
                          <CreditCard className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
                          <span className="text-sm font-medium text-emerald-800 capitalize">{type} Card</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-emerald-800 mb-3 block">Card Color</label>
                    <div className="flex gap-3 justify-center">
                      {['mint', 'purple', 'gold', 'navy', 'coral'].map((color) => (
                        <button
                          key={color}
                          className={`w-12 h-12 rounded-full bg-gradient-to-br ${
                            color === 'mint' ? 'from-[#A8E6CF] to-[#88D4AB]' :
                            color === 'purple' ? 'from-[#DDA0DD] to-[#C48BC4]' :
                            color === 'gold' ? 'from-[#F4F7C0] to-[#E5EB8A]' :
                            color === 'navy' ? 'from-[#1a1a2e] to-[#16213e]' :
                            'from-[#FF6B6B] to-[#EE5A5A]'
                          } border-4 border-white shadow-lg`}
                        />
                      ))}
                    </div>
                  </div>

                  <label className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl cursor-pointer">
                    <input type="checkbox" className="w-5 h-5 rounded border-emerald-300" />
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-5 h-5 text-emerald-600" />
                      <span className="text-sm text-emerald-800">Create Virtual Card (Instant)</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Fixed Footer - ALWAYS VISIBLE */}
              <div
                className="flex-shrink-0 px-5 py-4 border-t border-emerald-100/50 bg-white"
                style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 16px), 24px)' }}
              >
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowAddCardModal(false)}
                    className="flex-1 py-3.5 px-4 rounded-xl border-2 border-emerald-200 text-emerald-800 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => { setShowAddCardModal(false); showToast('Card request submitted!', 'success'); }}
                    className="flex-1 py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold shadow-lg shadow-emerald-500/30"
                  >
                    Request Card
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card Detail Modal - Fixed Footer */}
      <AnimatePresence>
        {showCardDetail && (() => {
          const card = cards.find(c => c.id === showCardDetail);
          if (!card) return null;
          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/50 flex items-end"
              onClick={() => setShowCardDetail(null)}
            >
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25 }}
                className="w-full bg-white rounded-t-3xl flex flex-col"
                style={{ maxHeight: '92vh' }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex-shrink-0 px-5 pt-4 pb-3 border-b border-emerald-100/50">
                  <div className="w-12 h-1 bg-emerald-200 rounded-full mx-auto mb-4" />
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-emerald-800">Card Details</h2>
                    <button onClick={() => setShowCardDetail(null)} className="p-2 -mr-2">
                      <X className="w-5 h-5 text-emerald-800/40" />
                    </button>
                  </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4" style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 16px)' }}>
                  <div className={`w-full h-48 rounded-2xl bg-gradient-to-br ${getCardGradient(card)} p-5 mb-6 shadow-xl`}>
                    <div className="flex justify-between items-start mb-8">
                      <span className="text-white/80 text-xs uppercase tracking-wider font-medium">{card.cardNetwork}</span>
                      <span className="text-white font-bold">OrbitPay</span>
                    </div>
                    <p className="text-white text-2xl font-mono tracking-wider mb-4">•••• •••• •••• {card.lastFourDigits}</p>
                    <div className="flex justify-between">
                      <div>
                        <p className="text-white/60 text-xs">Card Holder</p>
                        <p className="text-white text-sm font-semibold">{card.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white/60 text-xs">Expires</p>
                        <p className="text-white text-sm font-semibold">{String(card.expiryMonth).padStart(2, '0')}/{card.expiryYear}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-emerald-50 rounded-xl">
                        <p className="text-xs text-emerald-800/60 mb-1">Daily Limit</p>
                        <p className="text-lg font-bold text-emerald-800">${card.dailyLimit.toLocaleString()}</p>
                      </div>
                      <div className="p-4 bg-emerald-50 rounded-xl">
                        <p className="text-xs text-emerald-800/60 mb-1">Monthly Limit</p>
                        <p className="text-lg font-bold text-emerald-800">${card.monthlyLimit.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <button
                        onClick={() => handleFreeze(card.id)}
                        className={`w-full flex items-center justify-between p-4 rounded-xl ${
                          card.status === 'frozen' ? 'bg-emerald-100' : 'bg-slate-100'
                        }`}
                      >
                        <span className="text-sm font-medium text-emerald-800">
                          {card.status === 'frozen' ? 'Unfreeze Card' : 'Freeze Card'}
                        </span>
                        {card.status === 'frozen' ? <Sparkles className="w-5 h-5 text-emerald-600" /> : <Snowflake className="w-5 h-5 text-emerald-600" />}
                      </button>
                      <button
                        onClick={() => copyCardInfo(`•••• •••• •••• ${card.lastFourDigits}`)}
                        className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-100"
                      >
                        <span className="text-sm font-medium text-emerald-800">Copy Card Number</span>
                        <Copy className="w-5 h-5 text-emerald-600" />
                      </button>
                      <button
                        onClick={() => setShowLimitsModal(card.id)}
                        className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-100"
                      >
                        <span className="text-sm font-medium text-emerald-800">Manage Limits</span>
                        <ChevronRight className="w-5 h-5 text-emerald-600" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Fixed Footer - Close Button */}
                <div
                  className="flex-shrink-0 px-5 py-4 border-t border-emerald-100/50 bg-white"
                  style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 16px), 24px)' }}
                >
                  <button
                    onClick={() => setShowCardDetail(null)}
                    className="w-full py-3.5 rounded-xl border-2 border-emerald-200 text-emerald-800 font-semibold"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* Limits Modal - Fixed Footer */}
      <AnimatePresence>
        {showLimitsModal && (() => {
          const card = cards.find(c => c.id === showLimitsModal);
          if (!card) return null;
          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/50 flex items-end"
              onClick={() => setShowLimitsModal(null)}
            >
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25 }}
                className="w-full bg-white rounded-t-3xl flex flex-col"
                style={{ maxHeight: '92vh' }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex-shrink-0 px-5 pt-4 pb-3 border-b border-emerald-100/50">
                  <div className="w-12 h-1 bg-emerald-200 rounded-full mx-auto mb-4" />
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-emerald-800">Spending Limits</h2>
                    <button onClick={() => setShowLimitsModal(null)} className="p-2 -mr-2">
                      <X className="w-5 h-5 text-emerald-800/40" />
                    </button>
                  </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4" style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 16px)' }}>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium text-emerald-800">Daily Limit</label>
                        <span className="text-sm font-bold text-emerald-600">${card.dailyLimit.toLocaleString()}</span>
                      </div>
                      <input
                        type="range"
                        min="100"
                        max="10000"
                        step="100"
                        defaultValue={card.dailyLimit}
                        className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium text-emerald-800">Monthly Limit</label>
                        <span className="text-sm font-bold text-emerald-600">${card.monthlyLimit.toLocaleString()}</span>
                      </div>
                      <input
                        type="range"
                        min="1000"
                        max="100000"
                        step="500"
                        defaultValue={card.monthlyLimit}
                        className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Fixed Footer - ALWAYS VISIBLE */}
                <div
                  className="flex-shrink-0 px-5 py-4 border-t border-emerald-100/50 bg-white"
                  style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 16px), 24px)' }}
                >
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowLimitsModal(null)}
                      className="flex-1 py-3.5 px-4 rounded-xl border-2 border-emerald-200 text-emerald-800 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => { setShowLimitsModal(null); showToast('Limits updated successfully', 'success'); }}
                      className="flex-1 py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold shadow-lg shadow-emerald-500/30"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-28 left-4 right-4 z-[200] p-4 rounded-2xl shadow-xl flex items-center gap-3 ${
              toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
            }`}
          >
            {toast.type === 'success' ? <Check className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            <span className="text-sm font-medium flex-1">{toast.message}</span>
            <button onClick={() => setToast(null)} className="p-1">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
