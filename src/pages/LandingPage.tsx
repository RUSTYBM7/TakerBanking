import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { GlassSurface, GlassButton } from '@/components/glass';
import { EnterpriseModal } from '@/components/modals/EnterpriseModal';
import { useStore } from '@/store';
import {
  CreditCard, Shield, Zap, Globe, ArrowRight, Sparkles,
  Bot, TrendingUp, Lock, Smartphone, BarChart3, Layers, Users, Building2,
  Phone, Mail, MapPin, ChevronDown, Check, Eye, EyeOff, AlertCircle,
  Wallet, PiggyBank, TrendingDown, Star, Award, Clock, DollarSign,
  HeadphonesIcon, Accessibility, FileCheck, Fingerprint, Video, CheckCircle2,
  ArrowUpRight, ArrowDownRight, PieChart, Target, Calculator, Handshake,
  Building, Landmark, User, Send, Scan, Gift, FileText, Heart, Leaf,
  Cpu, Network, Cloud, Database, LineChart, WalletCards, Coins, Scale, Car,
  Download
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import AccountCreationWizard from '@/components/user/AccountCreationWizard';

// OrbitPay Brand Images - Using embedded SVG data URIs for reliability
const BRAND_IMAGES = {
  // OrbitPay Logo - Embedded SVG for maximum reliability
  logo: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMTYyNmI4Ii8+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnbG93IiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMTYyNmI4Ii8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMjYzYmFiYyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxwYXRoIGQ9Ik0gMjUgMjUgTCA1MCAyNSBMIDUwIDUwIEwgMjUgNTAgWiIgZmlsbD0idXJsKCNnbG93KSIgb3BhY2l0eT0iMC41Ii8+PHBhdGggZD0iTSAyNS41IDUgTCAgNS41IDI1IEwgMjUgMjUgUCAgMjUgNS41IFoiIGZpbGw9InVybCgjZ2xvdykgIiBvcGFjaXR5PSIwLjMiLz48dGV4dCB4PSI1MCUiIHk9IjY1JSIgZm9udC1zaXplPSIxOCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5PcmJpdHBheTwvdGV4dD48L3N2Zz4=',
  logoGlass: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMTYyNmI4Ii8+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnbG93IiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMTYyNmI4Ii8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMjYzYmFiYyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxwYXRoIGQ9Ik0gMjAgMjAgTCA1MCAyMCBMIDUwIDUwIEwgMjAgNTAgWiIgZmlsbD0idXJsKCNnbG93KSIgb3BhY2l0eT0iMC42Ii8+PHBhdGggZD0iTSAyMCA41IDUgTCAgNS41IDIwIEwgMjAgMjAgUCAgMjAgNS41IFoiIGZpbGw9InVybCgjZ2xvdykgIiBvcGFjaXR5PSIwLjQiLz48dGV4dCB4PSI1MCUiIHk9IjY1JSIgZm9udC1zaXplPSIxNSIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5PcmJpdHBheTwvdGV4dD48L3N2Zz4=',
  logo3D: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMTYyNmI4Ii8+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnbG93IiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMTYyNmI4Ii8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMjYzYmFiYyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxlbGxpcHNlIGN4PSI1MCIgY3k9IjUwIiByeD0iMzUiIHJ5PSIyNSIgZmlsbD0idXJsKCNnbG93KSIgb3BhY2l0eT0iMC43Ii8+PHBhdGggZD0iTSAyNSAyNSBMIDc1IDI1IEwgNzUgNzUgTCAyNSA3NSBaIiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiLz48dGV4dCB4PSI1MCUiIHk9IjU1JSIgZm9udC1zaXplPSIxOCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5PcmJpdHBheTwvdGV4dD48dGV4dCB4PSI1MCUiIHk9IjY1JSIgZm9udC1zaXplPSIxMCIgZm9udC13ZWlnaHQ9Im5vcm1hbCIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuNyIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VmlzaW9uPC90ZXh0Pjwvc3ZnPg==',
  // User's custom brand images - replacing Unsplash
  globalVision: '/images/orbitpay-global-vision.jpeg',      // Global Vision kiosk with headquarters info
  europaHQ: '/images/orbitpay-frankfurt-hq.jpeg',           // Frankfurt HQ billboard
  reception: '/images/orbitpay-office.jpeg',                 // Office/reception branding
  headquarters: '/images/orbitpay-global-vision.jpeg',       // Using custom image
  heroBanner: '/images/orbitpay-frankfurt-hq.jpeg',          // Using custom image
  frankfurtSkyline: '/images/orbitpay-frankfurt-hq.jpeg',   // Using custom image
  europaExterior: '/images/orbitpay-office.jpeg',            // Using custom image
  // Fallback Unsplash images for additional brand assets
  logoFull: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80',
  logoMetallic: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80'
};

// High-quality Unsplash images for banking content (with custom brand images where available)
const UNSPLASH_IMAGES = {
  hero: '/images/orbitpay-frankfurt-hq.jpeg',  // Using custom brand image for hero
  cityscape: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1600&q=90',
  team: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=90',
  community: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=1200&q=90',
  mobile: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&q=90',
  security: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=90',
  growth: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=1200&q=90',
  investment: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=90',
  family: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=1200&q=90',
  business: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=90',
  card: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1200&q=90',
  global: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=90',
};

export default function LandingPage() {
  const navigate = useNavigate();
  const { login } = useStore();

  // Modal states
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showAccountTypeModal, setShowAccountTypeModal] = useState(false);
  const [showPersonalInfoModal, setShowPersonalInfoModal] = useState(false);
  const [showIdentityModal, setShowIdentityModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showAccountWizard, setShowAccountWizard] = useState(false);

  // Login form state
  const [loginForm, setLoginForm] = useState({ email: '', password: '', rememberMe: false });
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Signup form state
  const [signupForm, setSignupForm] = useState({
    accountType: '' as 'checking' | 'savings' | 'joint' | '',
    firstName: '', lastName: '', dateOfBirth: '', ssn: '', phone: '', email: '', confirmEmail: '',
    streetAddress: '', apt: '', city: '', state: '', zipCode: '',
    idType: '' as 'drivers_license' | 'passport' | 'state_id' | '',
    idNumber: '', issueDate: '', expiryDate: '',
    agreedToTerms: false, agreedToPrivacy: false, agreedToCreditCheck: false
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, -100]);
  const y2 = useTransform(scrollY, [0, 500], [0, -200]);

  // Mouse tracking for parallax
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Close modals on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowLoginModal(false);
        setShowSignupModal(false);
        setShowAccountTypeModal(false);
        setShowPersonalInfoModal(false);
        setShowIdentityModal(false);
        setShowReviewModal(false);
        setShowSuccessModal(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    const anyModalOpen = showLoginModal || showSignupModal || showAccountTypeModal || showPersonalInfoModal || showIdentityModal || showReviewModal || showSuccessModal || showAccountWizard;
    if (anyModalOpen) { document.body.style.overflow = 'hidden'; } else { document.body.style.overflow = ''; }
    return () => { document.body.style.overflow = ''; };
  }, [showLoginModal, showSignupModal, showAccountTypeModal, showPersonalInfoModal, showIdentityModal, showReviewModal, showSuccessModal, showAccountWizard]);

  const handleLogin = async () => {
    setLoginError('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginForm.email)) { setLoginError('Please enter a valid email address'); return; }
    if (loginForm.password.length < 8) { setLoginError('Password must be at least 8 characters'); return; }
    setIsLoggingIn(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const demoUser = { id: 'u1', email: loginForm.email, phone: '+1-555-0101', fullName: 'Demo User', avatar: 'https://i.pravatar.cc/150?u=sarah', kycStatus: 'verified' as const, accountStatus: 'active' as const, tier: 'premium' as const, dailyLimit: 50000, weeklyLimit: 200000, monthlyLimit: 500000, balanceUsd: 26887.09, balanceEur: 22150.50, balanceGbp: 18920.75, balanceBtc: 0.45, btcPrice: 67540.20, address: '123 Market St, San Francisco, CA 94105', dateOfBirth: '1990-03-15', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), lastActive: new Date().toISOString(), isOnline: true };
    login(demoUser);
    setIsLoggingIn(false);
    setShowLoginModal(false);
    navigate('/app');
  };

  const handleDemoLogin = () => {
    const demoUser = { id: 'u1', email: 'demo@orbitpay.com', phone: '+1-555-0101', fullName: 'Sarah Chen', avatar: 'https://i.pravatar.cc/150?u=sarah', kycStatus: 'verified' as const, accountStatus: 'active' as const, tier: 'premium' as const, dailyLimit: 50000, weeklyLimit: 200000, monthlyLimit: 500000, balanceUsd: 26887.09, balanceEur: 22150.50, balanceGbp: 18920.75, balanceBtc: 0.45, btcPrice: 67540.20, address: '123 Market St, San Francisco, CA 94105', dateOfBirth: '1990-03-15', createdAt: '2024-01-10T08:00:00Z', updatedAt: '2024-12-15T14:30:00Z', lastActive: '2024-12-20T10:15:00Z', isOnline: true };
    login(demoUser);
    navigate('/app');
  };

  const handleSelectAccountType = (type: 'checking' | 'savings' | 'joint') => {
    setSignupForm(prev => ({ ...prev, accountType: type }));
    setShowAccountTypeModal(false);
    setShowPersonalInfoModal(true);
  };

  const handlePersonalInfoSubmit = () => {
    if (!signupForm.firstName || !signupForm.lastName || !signupForm.dateOfBirth || !signupForm.ssn || !signupForm.phone || !signupForm.email || !signupForm.confirmEmail) return;
    if (signupForm.email !== signupForm.confirmEmail) return;
    setShowPersonalInfoModal(false);
    setShowIdentityModal(true);
  };

  const handleIdentitySubmit = () => {
    if (!signupForm.idType || !signupForm.idNumber || !signupForm.issueDate || !signupForm.expiryDate) return;
    setShowIdentityModal(false);
    setShowReviewModal(true);
  };

  const handleFinalSubmit = () => {
    if (!signupForm.agreedToTerms || !signupForm.agreedToPrivacy || !signupForm.agreedToCreditCheck) return;
    setShowReviewModal(false);
    setShowSuccessModal(true);
  };

  const handleModalBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowLoginModal(false);
      setShowSignupModal(false);
      setShowAccountTypeModal(false);
      setShowPersonalInfoModal(false);
      setShowIdentityModal(false);
      setShowReviewModal(false);
      setShowSuccessModal(false);
    }
  };

  // Enhanced data
  const stats = [
    { value: '2.4M+', label: 'Happy Members', icon: Users, desc: 'Growing stronger together' },
    { value: '$12B+', label: 'Assets Managed', icon: DollarSign, desc: 'Your trust, our priority' },
    { value: '99.99%', label: 'Uptime Guaranteed', icon: Shield, desc: 'Always available' },
    { value: '4.9★', label: 'Customer Rating', icon: Star, desc: 'Excellence recognized' },
  ];

  const coreFeatures = [
    { icon: Zap, title: 'Instant Transfers', desc: 'Send money anywhere in seconds with zero hidden fees. Real-time processing, 24/7 availability.', color: 'from-emerald-400 to-teal-500' },
    { icon: Shield, title: 'Bank-Grade Security', desc: '256-bit encryption, biometric auth, and 24/7 fraud monitoring protecting every transaction.', color: 'from-teal-400 to-cyan-500' },
    { icon: Wallet, title: 'Smart Savings', desc: 'Automatic savings rules and competitive APY up to 5.25%. Watch your wealth grow effortlessly.', color: 'from-green-400 to-emerald-500' },
    { icon: BarChart3, title: 'Financial Insights', desc: 'AI-powered spending analysis and personalized recommendations tailored to your habits.', color: 'from-emerald-500 to-green-600' },
    { icon: Globe, title: 'Global Banking', desc: 'Multi-currency support with live exchange rates in 50+ countries. Bank without borders.', color: 'from-teal-500 to-emerald-600' },
    { icon: Smartphone, title: 'Mobile First', desc: 'Full-featured mobile app with Face ID and Apple Pay. Banking at your fingertips.', color: 'from-cyan-400 to-teal-500' },
  ];

  const accountTypes = [
    { type: 'checking', name: 'Primary Checking', icon: Building2, desc: 'Everyday banking with no monthly fees', features: ['Free transfers', 'Debit card', 'Overdraft protection', 'Mobile deposits'], highlight: 'Most Popular' },
    { type: 'savings', name: 'High-Yield Savings', icon: PiggyBank, desc: 'Grow your money with competitive rates', features: ['Up to 5.25% APY', 'Automatic savings', 'No minimum balance', 'FDIC insured'], highlight: 'Best Returns' },
    { type: 'joint', name: 'Joint Account', icon: Users, desc: 'Share finances with a partner or family', features: ['Equal access', 'Shared goals', 'Transaction visibility', 'Easy management'], highlight: 'Family Focus' },
  ];

  const testimonials = [
    { name: 'Maria Santos', role: 'Small Business Owner', text: 'OrbitPay transformed how I manage my business finances. The instant transfers save me hours every week. My cash flow has improved dramatically since switching.', avatar: 'https://i.pravatar.cc/150?u=maria', rating: 5 },
    { name: 'James Wilson', role: 'Software Engineer', text: 'The AI insights helped me save $3,000 last year. Best banking experience I\'ve ever had. The financial planning tools are incredibly intuitive.', avatar: 'https://i.pravatar.cc/150?u=james', rating: 5 },
    { name: 'Emily Chen', role: 'Freelance Designer', text: 'Multi-currency support is a game-changer for my international clients. Highly recommend! Managing global payments has never been this seamless.', avatar: 'https://i.pravatar.cc/150?u=emily', rating: 5 },
  ];

  const securityFeatures = [
    { icon: Fingerprint, title: 'Biometric Authentication', desc: 'Face ID, Touch ID, and fingerprint scanning for secure access' },
    { icon: Lock, title: '256-bit Encryption', desc: 'Military-grade encryption for all transactions and data' },
    { icon: Shield, title: 'FDIC Insured', desc: 'Your deposits are protected up to $250,000' },
    { icon: AlertCircle, title: 'Real-time Alerts', desc: 'Instant notifications for every transaction' },
    { icon: Eye, title: 'Privacy Controls', desc: 'Granular permissions for account access' },
    { icon: Phone, title: '24/7 Support', desc: 'Dedicated support team available around the clock' },
  ];

  const products = [
    { icon: Wallet, title: 'Savings Accounts', desc: 'Competitive rates, flexible access', color: 'emerald' },
    { icon: Building2, title: 'Checking Accounts', desc: 'No fees, unlimited transfers', color: 'teal' },
    { icon: CreditCard, title: 'Credit Cards', desc: 'Cash back, low rates', color: 'cyan' },
    { icon: Building, title: 'Mortgages', desc: 'Home loans with great terms', color: 'emerald' },
    { icon: Car, title: 'Auto Loans', desc: 'Quick approval, competitive rates', color: 'teal' },
    { icon: Coins, title: 'Student Loans', desc: 'Education financing solutions', color: 'cyan' },
    { icon: LineChart, title: 'Investments', desc: 'Grow your wealth strategically', color: 'emerald' },
    { icon: Shield, title: 'Insurance', desc: 'Protect what matters most', color: 'teal' },
  ];

  const whyChooseUs = [
    { icon: Heart, title: 'Member-Owned', desc: 'As a credit union, we\'re owned by our members. Profits go back to you in better rates and lower fees.' },
    { icon: Leaf, title: 'Sustainable Focus', desc: 'Committed to environmental responsibility with green banking initiatives and carbon-neutral operations.' },
    { icon: Globe, title: 'Community Impact', desc: 'Local lending, community development, and financial education programs in underserved areas.' },
    { icon: Award, title: 'Award Winning', desc: 'Recognized by industry experts for excellence in customer service and digital innovation.' },
  ];

  const faqs = [
    { q: 'How long does account opening take?', a: 'Most accounts are approved within minutes. Identity verification may take up to 24 hours for additional review.' },
    { q: 'Is there a minimum deposit required?', a: 'No! You can open an account with $0 and start saving immediately. No minimum balance requirements.' },
    { q: 'Are my deposits FDIC insured?', a: 'Yes, all deposits are FDIC insured up to $250,000 through our partner banks.' },
    { q: 'Can I access my account internationally?', a: 'Yes! Use your card in 190+ countries and manage 50+ currencies through our mobile app.' },
    { q: 'What fees should I expect?', a: 'We believe in transparent banking. No monthly fees, no overdraft fees, and no minimum balance fees.' },
    { q: 'How does the AI financial advisor work?', a: 'Our AI analyzes your spending patterns and provides personalized insights, savings recommendations, and investment opportunities tailored to your goals.' },
    { q: 'Can I open a business account?', a: 'Absolutely! We offer comprehensive business banking solutions including checking, savings, merchant services, and business loans with dedicated support.' },
  ];

  const partners = ['Microsoft', 'Apple', 'Google', 'Amazon', 'Tesla', 'Meta'];

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 overflow-x-hidden text-white">
      {/* Dynamic 3D Background with Green & Black */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Animated gradient mesh */}
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at ${mousePosition.x}% ${mousePosition.y}%, rgba(16, 185, 129, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(20, 184, 166, 0.1) 0%, transparent 40%)` }} />

        {/* Floating 3D orbs with green glow */}
        <motion.div animate={{ x: [0, 100, 0], y: [0, 50, 0], rotate: [0, 180, 360] }} transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-transparent blur-3xl" />
        <motion.div animate={{ x: [0, -80, 0], y: [0, -60, 0], rotate: [360, 180, 0] }} transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }} className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-teal-500/15 via-cyan-500/10 to-transparent blur-3xl" />
        <motion.div animate={{ x: [0, 50, 0], y: [0, -30, 0] }} transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-1/2 right-1/3 w-[400px] h-[400px] rounded-full bg-gradient-to-bl from-emerald-600/10 to-black/20 blur-3xl" />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.3) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
      </div>

      {/* Header with Brand Logo */}
      <header className="fixed top-0 left-0 right-0 z-[100] bg-slate-950/90 backdrop-blur-2xl border-b border-emerald-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo with Brand Image */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
              <div className="relative group">
                {/* Brand Logo Image */}
                <img
                  src={BRAND_IMAGES.logo3D}
                  alt="OrbitPay Finance"
                  className="h-12 lg:h-14 w-auto object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              </div>
              <div className="hidden md:block">
                <span className="font-bold text-white text-xl tracking-tight">OrbitPay</span>
                <span className="block text-xs text-emerald-400 font-medium">Credit Union</span>
              </div>
            </motion.div>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {['Personal', 'Business', 'Invest', 'Insurance', 'About', 'Support'].map((item, i) => (
                <motion.a key={item} href="#" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors relative group">
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 group-hover:w-full transition-all duration-300" />
                </motion.a>
              ))}
            </nav>

            {/* CTA Buttons */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
              <button onClick={() => setShowLoginModal(true)} className="hidden sm:block text-sm font-medium text-slate-300 hover:text-emerald-400 px-4 py-2 transition-colors">
                Sign In
              </button>
              <button onClick={() => { setShowAccountWizard(true); }} className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 hover:scale-105">
                Get Started
              </button>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Hero Section - Using Brand Image */}
      <section className="relative pt-28 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center lg:text-left relative z-10">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-6 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm font-medium text-emerald-400">Now serving 2.4 million members</span>
              </motion.div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6">
                <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">Banking built for</span>
                <br />
                <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">your future</span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-400 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Join the modern credit union that puts you first. Earn up to <span className="text-emerald-400 font-semibold">5.25% APY</span>, enjoy fee-free banking, and get AI-powered financial insights that help you build generational wealth.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
                <button onClick={() => { setShowAccountWizard(true); }} className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white font-bold px-8 py-4 rounded-full hover:shadow-2xl hover:shadow-emerald-500/40 transition-all duration-500 hover:scale-105">
                  Open Free Account
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button onClick={() => setShowLoginModal(true)} className="inline-flex items-center justify-center gap-2 bg-slate-800/50 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-full border border-slate-700 hover:border-emerald-500/50 hover:bg-slate-800 transition-all duration-300">
                  Sign In
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-slate-500">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500" /><span className="text-slate-300">FDIC Insured</span></div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500" /><span className="text-slate-300">No Monthly Fees</span></div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500" /><span className="text-slate-300">256-bit Encryption</span></div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative">
              {/* Main visual using professional brand hero image */}
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl shadow-emerald-500/20 border border-emerald-500/20">
                <img src={BRAND_IMAGES.heroBanner} alt="OrbitPay Finance - Banking Evolved" className="w-full h-auto object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

                {/* Floating dashboard card */}
                <motion.div animate={{ y: [-10, 10, -10] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} className="absolute bottom-8 left-8 right-8 glass-card p-6 backdrop-blur-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-white">OrbitPay Checking</p>
                        <p className="text-sm text-slate-400">**** 4829</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                      <Shield className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-medium text-emerald-400">Secure</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 mb-1">Total Balance</p>
                  <p className="text-4xl font-bold text-white mb-4">$24,891.50</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-emerald-400">+12.5% this month</span>
                    <span className="text-sm text-slate-400">5 active cards</span>
                  </div>
                </motion.div>
              </div>

              {/* Floating accent cards */}
              <motion.div animate={{ y: [-10, 10, -10] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} className="absolute -top-4 -right-4 z-20">
                <div className="glass-card p-4 backdrop-blur-xl border border-emerald-500/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">+12.5%</p>
                      <p className="text-xs text-slate-400">Savings this month</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div animate={{ y: [10, -10, 10] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} className="absolute -bottom-4 -left-4 z-20">
                <div className="glass-card p-4 backdrop-blur-xl border border-cyan-500/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">AI Insight</p>
                      <p className="text-xs text-slate-400">Save $320 this month</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section - Dark Glass Cards */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative glass-card p-6 lg:p-8 text-center border border-emerald-500/20 hover:border-emerald-500/40 transition-all">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 mb-4">
                    <stat.icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <p className="text-3xl lg:text-4xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-sm text-emerald-400 font-medium mb-1">{stat.label}</p>
                  <p className="text-xs text-slate-500">{stat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Brand Section - Using User's Images */}
      <section className="py-20 lg:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden shadow-2xl border border-emerald-500/20">
                    <img src={UNSPLASH_IMAGES.headquarters} alt="OrbitPay Headquarters" className="w-full h-64 object-cover" />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-2xl border border-emerald-500/20">
                    <img src={UNSPLASH_IMAGES.team} alt="OrbitPay Team" className="w-full h-48 object-cover" />
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="rounded-2xl overflow-hidden shadow-2xl border border-emerald-500/20">
                    <img src={UNSPLASH_IMAGES.community} alt="OrbitPay Community" className="w-full h-48 object-cover" />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-2xl border border-emerald-500/20">
                    <img src={UNSPLASH_IMAGES.growth} alt="OrbitPay Growth" className="w-full h-64 object-cover" />
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 glass-card p-4 backdrop-blur-xl border border-emerald-500/30">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Building className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-bold text-white">Est. 1952</p>
                    <p className="text-sm text-slate-400">Serving communities for 70+ years</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-4 border border-emerald-500/20">
                <Landmark className="w-4 h-4" />
                About OrbitPay
              </span>
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight">
                A Credit Union Built on <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Trust & Community</span>
              </h2>
              <p className="text-lg text-slate-400 mb-6 leading-relaxed">
                For over seven decades, OrbitPay Credit Union has been the financial partner of choice for millions of families and businesses. As a not-for-profit cooperative, we return value to our members through better rates, lower fees, and personalized service.
              </p>
              <p className="text-slate-400 mb-8 leading-relaxed">
                Our mission is simple: to help you achieve financial success. Whether you're buying your first home, saving for retirement, or growing your business, we're here to support your journey every step of the way.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[{ icon: Award, label: '70+ Years of Service' }, { icon: Users, label: '2.4M+ Members' }, { icon: Building, label: '250+ Branches' }, { icon: Globe, label: '19 Countries' }].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/50 border border-emerald-500/20">
                    <item.icon className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm font-medium text-white">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 lg:py-28 bg-gradient-to-b from-transparent via-emerald-950/50 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-4 border border-emerald-500/20">
              <Star className="w-4 h-4" />
              Why Choose Us
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">The OrbitPay Difference</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">We're not just another bank. We're your financial partner committed to your success.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -8, transition: { duration: 0.3 } }} className="group glass-card p-6 lg:p-8 border border-emerald-500/20 hover:border-emerald-500/40">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <item.icon className="w-7 h-7 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Account Types Section */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-4 border border-emerald-500/20">
              <Wallet className="w-4 h-4" />
              Account Options
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Choose Your Account</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">Whether you're saving for a rainy day or managing daily finances, we have the perfect account for your needs.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {accountTypes.map((account, i) => (
              <motion.div key={account.type} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -8, transition: { duration: 0.3 } }} className="relative overflow-visible glass-card p-8 border border-emerald-500/20 hover:border-emerald-500/40">
                {account.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-xs font-bold text-white shadow-lg shadow-emerald-500/30 z-10">
                    {account.highlight}
                  </div>
                )}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-6">
                  <account.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{account.name}</h3>
                <p className="text-slate-400 mb-6">{account.desc}</p>
                <ul className="space-y-3 mb-8">
                  {account.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm text-slate-300">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button onClick={() => { setShowAccountWizard(true); }} className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all">
                  Open {account.name}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products & Services Grid */}
      <section className="py-20 lg:py-28 bg-gradient-to-b from-transparent via-teal-950/30 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-4 border border-emerald-500/20">
              <Sparkles className="w-4 h-4" />
              Products & Services
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Everything You Need</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">Comprehensive financial solutions tailored for every stage of your journey.</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} whileHover={{ y: -5, scale: 1.02 }} className="group glass-card p-6 text-center border border-emerald-500/20 hover:border-emerald-500/40 cursor-pointer">
                <div className={`w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center ${product.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-400' : product.color === 'teal' ? 'bg-teal-500/20 text-teal-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
                  <product.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-white mb-1 group-hover:text-emerald-400 transition-colors">{product.title}</h3>
                <p className="text-xs text-slate-500">{product.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-4 border border-emerald-500/20">
              <Sparkles className="w-4 h-4" />
              Premium Features
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Everything You Need in One App</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">Powerful features designed to make your financial life easier, safer, and more rewarding.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreFeatures.map((feature, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -5 }} className="group glass-card p-6 lg:p-8 border border-emerald-500/20 hover:border-emerald-500/40">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-b from-transparent via-emerald-950/50 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">Your Money, <span className="text-emerald-400">Our Priority</span></h2>
              <p className="text-lg text-slate-400 mb-8 leading-relaxed">We use industry-leading security measures to protect your money and personal information. Rest easy knowing your deposits are FDIC insured and your data is encrypted.</p>

              <div className="grid sm:grid-cols-2 gap-6">
                {securityFeatures.map((feature, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0 border border-emerald-500/30">
                      <feature.icon className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">{feature.title}</h4>
                      <p className="text-sm text-slate-500">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
              <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur">
                      <Shield className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">FDIC Insured</p>
                      <p className="text-emerald-100">Up to $250,000</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl backdrop-blur">
                      <span className="text-emerald-100">Encryption Level</span>
                      <span className="font-bold">256-bit AES</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl backdrop-blur">
                      <span className="text-emerald-100">Security Score</span>
                      <span className="font-bold">98/100</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl backdrop-blur">
                      <span className="text-emerald-100">24/7 Monitoring</span>
                      <span className="font-bold">Active</span>
                    </div>
                  </div>
                </div>
              </div>

              <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -bottom-6 -right-6 glass-card p-4 backdrop-blur-xl border border-emerald-500/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Verified Safe</p>
                    <p className="text-xs text-slate-400">Last scan: 2 min ago</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950 text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6 backdrop-blur">
              <Bot className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-medium text-emerald-400">Powered by Advanced AI</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Smarter Banking with AI</h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">Get personalized insights, automated savings, and intelligent recommendations that adapt to your financial habits.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[{ icon: TrendingUp, title: 'Spending Analysis', desc: 'Understand where your money goes with AI-powered categorization' }, { icon: Target, title: 'Savings Goals', desc: 'Set goals and let AI automatically save for you' }, { icon: Calculator, title: 'Budget Planning', desc: 'Get personalized budgets based on your income and habits' }, { icon: Handshake, title: 'Investment Tips', desc: 'Receive tailored investment suggestions aligned with your goals' }].map((feature, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile App Section with iPhone Mockup */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* iPhone Mockup */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="order-2 lg:order-1 flex justify-center">
              <div className="relative">
                {/* iPhone Frame */}
                <div className="relative w-[280px] sm:w-[320px] h-[560px] sm:h-[640px] bg-slate-900 rounded-[3rem] p-2 shadow-2xl shadow-emerald-500/20 border border-slate-700">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-900 rounded-b-2xl z-20" />

                  {/* Screen */}
                  <div className="relative w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-[2.5rem] overflow-hidden">
                    {/* Status Bar */}
                    <div className="flex items-center justify-between px-6 pt-8 pb-2 text-white text-xs">
                      <span>9:41</span>
                      <div className="flex items-center gap-1">
                        <div className="flex gap-0.5">
                          <div className="w-1 h-2 bg-white rounded-sm" />
                          <div className="w-1 h-3 bg-white rounded-sm" />
                          <div className="w-1 h-4 bg-white rounded-sm" />
                          <div className="w-1 h-3 bg-white/40 rounded-sm" />
                        </div>
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3C7.46 3 3.34 4.78.29 7.67c-.18.18-.29.43-.29.71 0 .28.11.53.29.71l11.42 11.42c.39.39 1.02.39 1.41 0l11.42-11.42c.18-.18.29-.43.29-.71 0-.28-.11-.53-.29-.71C20.66 4.78 16.54 3 12 3z"/></svg>
                      </div>
                    </div>

                    {/* App Content */}
                    <div className="p-4 pt-2">
                      {/* OrbitPay Logo */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-white text-sm">OrbitPay</span>
                      </div>

                      {/* Balance Card */}
                      <div className="glass-card p-4 mb-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/30">
                        <p className="text-emerald-300/60 text-xs mb-1">Total Balance</p>
                        <p className="text-white text-2xl font-bold">$26,887.09</p>
                      </div>

                      {/* Quick Actions */}
                      <div className="grid grid-cols-4 gap-2 mb-4">
                        {[{ icon: Send, label: 'Send' }, { icon: Download, label: 'Receive' }, { icon: CreditCard, label: 'Cards' }, { icon: BarChart3, label: 'Stats' }].map((action, i) => (
                          <div key={i} className="text-center">
                            <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-500/20 flex items-center justify-center mb-1 border border-emerald-500/30">
                              <action.icon className="w-5 h-5 text-emerald-400" />
                            </div>
                            <span className="text-white/60 text-[10px]">{action.label}</span>
                          </div>
                        ))}
                      </div>

                      {/* Recent Transactions */}
                      <div className="space-y-2">
                        <p className="text-white/60 text-xs font-medium mb-2">Recent</p>
                        {[{ name: 'Netflix', amount: '-$15.99', icon: 'N' }, { name: 'Salary', amount: '+$4,250.00', icon: 'S' }].map((tx, i) => (
                          <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-white/5">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold">
                                {tx.icon}
                              </div>
                              <span className="text-white text-xs">{tx.name}</span>
                            </div>
                            <span className={`text-xs font-medium ${tx.amount.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>{tx.amount}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 3, repeat: Infinity }} className="absolute -top-4 -right-4 glass-card p-3 backdrop-blur-xl border border-emerald-500/30 shadow-xl">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="text-white text-xs font-medium">Secured</span>
                  </div>
                </motion.div>

                <motion.div animate={{ y: [5, -5, 5] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -bottom-4 -left-4 glass-card p-3 backdrop-blur-xl border border-emerald-500/30 shadow-xl">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-400" />
                    <span className="text-white text-xs font-medium">256-bit</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="order-1 lg:order-2">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-4 border border-emerald-500/20">
                <Smartphone className="w-4 h-4" />
                Mobile Banking
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">Banking on the Go</h2>
              <p className="text-lg text-slate-400 mb-8 leading-relaxed">Manage your finances from anywhere with our award-winning mobile app. Deposit checks, pay bills, transfer money, and track your spending - all from the palm of your hand.</p>
              <div className="space-y-4 mb-8">
                {[{ icon: Scan, label: 'Mobile Check Deposit' }, { icon: Send, label: 'Instant Transfers' }, { icon: Fingerprint, label: 'Face ID & Touch ID' }, { icon: CreditCard, label: 'Apple Pay & Google Pay' }].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                      <item.icon className="w-5 h-5 text-emerald-400" />
                    </div>
                    <span className="text-slate-300 font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4">
                <button className="px-6 py-3 rounded-xl bg-white text-slate-900 font-medium flex items-center gap-2 hover:bg-slate-100 transition-colors">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                  App Store
                </button>
                <button className="px-6 py-3 rounded-xl bg-white text-slate-900 font-medium flex items-center gap-2 hover:bg-slate-100 transition-colors">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/></svg>
                  Google Play
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 bg-slate-950/50 border-y border-emerald-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-4 border border-emerald-500/20">
              <Handshake className="w-4 h-4" />
              Trusted Partners
            </span>
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">Built on Excellence</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Partnering with industry leaders to deliver world-class financial services</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {[
              {
                name: 'Visa',
                logo: (
                  <svg viewBox="0 0 48 32" className="w-full h-full">
                    <rect fill="#1A1F71" width="48" height="32" rx="4"/>
                    <text x="24" y="21" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontFamily="Arial, sans-serif">VISA</text>
                  </svg>
                )
              },
              {
                name: 'Mastercard',
                logo: (
                  <svg viewBox="0 0 48 32" className="w-full h-full">
                    <rect fill="#000000" width="48" height="32" rx="4"/>
                    <circle cx="18" cy="16" r="10" fill="#EB001B"/>
                    <circle cx="30" cy="16" r="10" fill="#F79E1B"/>
                    <path d="M24 8.5c2.5 2 4 5 4 7.5s-1.5 5.5-4 7.5c-2.5-2-4-5-4-7.5s1.5-5.5 4-7.5" fill="#FF5F00"/>
                  </svg>
                )
              },
              {
                name: 'SWIFT',
                logo: (
                  <svg viewBox="0 0 48 32" className="w-full h-full">
                    <rect fill="#003366" width="48" height="32" rx="4"/>
                    <text x="24" y="20" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" fontFamily="Arial, sans-serif">SWIFT</text>
                  </svg>
                )
              },
              {
                name: 'FedNow',
                logo: (
                  <svg viewBox="0 0 48 32" className="w-full h-full">
                    <rect fill="#003087" width="48" height="32" rx="4"/>
                    <text x="24" y="20" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" fontFamily="Arial, sans-serif">FedNow</text>
                  </svg>
                )
              },
              {
                name: 'Stripe',
                logo: (
                  <svg viewBox="0 0 48 32" className="w-full h-full">
                    <rect fill="#635BFF" width="48" height="32" rx="4"/>
                    <text x="24" y="20" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="Arial, sans-serif">stripe</text>
                  </svg>
                )
              },
              {
                name: 'Plaid',
                logo: (
                  <svg viewBox="0 0 48 32" className="w-full h-full">
                    <rect fill="#111111" width="48" height="32" rx="4"/>
                    <text x="24" y="20" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="Arial, sans-serif">Plaid</text>
                  </svg>
                )
              }
            ].map((partner, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-emerald-500/30 transition-all duration-300 cursor-pointer"
              >
                <div className="w-12 h-8 rounded-lg overflow-hidden flex items-center justify-center">
                  {partner.logo}
                </div>
                <span className="text-sm font-medium text-slate-400">{partner.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-b from-transparent via-emerald-950/30 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-4 border border-emerald-500/20">
              <Star className="w-4 h-4" />
              Member Stories
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Loved by Members</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">Join thousands of happy members who trust OrbitPay with their financial future.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-card p-8 border border-emerald-500/20 hover:border-emerald-500/40">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (<Star key={j} className="w-5 h-5 text-amber-400 fill-amber-400" />))}
                </div>
                <p className="text-slate-300 mb-6 leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center gap-4">
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full border-2 border-emerald-500/30" />
                  <div>
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="text-sm text-slate-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Fintech Widgets & Plugins Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-b from-transparent via-emerald-950/30 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-4 border border-emerald-500/20">
              <Cpu className="w-4 h-4" />
              Fintech Ecosystem
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Seamless Integrations</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">Connect with your favorite fintech tools and platforms through our open banking API ecosystem.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Trading Widget */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="glass-card p-6 border border-emerald-500/20 hover:border-emerald-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <LineChart className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-white mb-2">Trading APIs</h3>
              <p className="text-sm text-slate-400 mb-4">Connect to major stock exchanges and crypto platforms with real-time data.</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs">E*Trade</span>
                <span className="px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs">Robinhood</span>
              </div>
            </motion.div>

            {/* Payment Widget */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="glass-card p-6 border border-emerald-500/20 hover:border-emerald-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-white mb-2">Payment Gateways</h3>
              <p className="text-sm text-slate-400 mb-4">Accept payments globally with 150+ currencies and instant settlements.</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs">Stripe</span>
                <span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs">Square</span>
              </div>
            </motion.div>

            {/* Analytics Widget */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="glass-card p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <PieChart className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-white mb-2">Analytics Tools</h3>
              <p className="text-sm text-slate-400 mb-4">AI-powered insights and automated reporting for smarter decisions.</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs">QuickBooks</span>
                <span className="px-2 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs">Mint</span>
              </div>
            </motion.div>

            {/* Security Widget */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="glass-card p-6 border border-amber-500/20 hover:border-amber-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-white mb-2">Security Suite</h3>
              <p className="text-sm text-slate-400 mb-4">Enterprise-grade fraud detection and identity verification built-in.</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs">Plaid</span>
                <span className="px-2 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs">MFA</span>
              </div>
            </motion.div>
          </div>

          {/* API Status Widget */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }} className="mt-8 glass-card p-6 border border-cyan-500/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div>
                  <p className="font-semibold text-white">API Status: All Systems Operational</p>
                  <p className="text-sm text-slate-400">99.99% uptime over the last 365 days</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-lg font-bold text-emerald-400">2.4M+</p>
                  <p className="text-xs text-slate-400">API Calls/Day</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-cyan-400">&lt;50ms</p>
                  <p className="text-xs text-slate-400">Avg Response</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-purple-400">256-bit</p>
                  <p className="text-xs text-slate-400">Encryption</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-4 border border-emerald-500/20">
              <FileText className="w-4 h-4" />
              Help Center
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-slate-400">Everything you need to know about our banking services.</p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-card overflow-hidden border border-emerald-500/20">
                <details className="group">
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                    <span className="font-semibold text-white">{faq.q}</span>
                    <ChevronDown className="w-5 h-5 text-emerald-400 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="px-6 pb-6 pt-0">
                    <p className="text-slate-400 leading-relaxed">{faq.a}</p>
                  </div>
                </details>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Presence Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-b from-transparent via-emerald-950/30 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-4 border border-emerald-500/20">
              <Globe className="w-4 h-4" />
              Global Presence
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">OrbitPay Finance Worldwide</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">Serving members across continents with trusted financial services. Banking Without Borders.</p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl shadow-emerald-500/20 border border-emerald-500/20">
                <img src={BRAND_IMAGES.globalVision} alt="OrbitPay Finance Global Vision - Banking Without Borders" className="w-full h-auto object-cover" />
              </div>
              <div className="absolute -bottom-4 -right-4 glass-card p-4 backdrop-blur-xl border border-emerald-500/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                    <Building className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">40+ Countries</p>
                    <p className="text-xs text-slate-400">Worldwide Branches</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6">
              <div className="glass-card p-6 border border-emerald-500/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <Landmark className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Global Headquarters</h3>
                    <p className="text-sm text-slate-400">Sacramento, California, USA</p>
                  </div>
                </div>
                <p className="text-slate-400 text-sm">500 Capitol Mall, Suite 1800, Sacramento, CA 95814, USA</p>
              </div>

              <div className="glass-card p-6 border border-emerald-500/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Europa Headquarters</h3>
                    <p className="text-sm text-slate-400">Frankfurt, Germany</p>
                  </div>
                </div>
                <p className="text-slate-400 text-sm">Serving Europe, Middle East & Africa with dedicated financial services.</p>
              </div>

              {/* Asia-Pacific Headquarters */}
              <div className="glass-card p-6 border border-amber-500/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                    <Globe className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Asia-Pacific HQ</h3>
                    <p className="text-sm text-slate-400">Singapore</p>
                  </div>
                </div>
                <p className="text-slate-400 text-sm">Serving Greater China, Japan, South Korea, Southeast Asia & Oceania markets.</p>
              </div>

              {/* Middle East & Arabian Headquarters */}
              <div className="glass-card p-6 border border-purple-500/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                    <Building className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Arabian HQ</h3>
                    <p className="text-sm text-slate-400">Dubai, UAE</p>
                  </div>
                </div>
                <p className="text-slate-400 text-sm">Serving GCC countries, Middle East & North Africa with Sharia-compliant banking.</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="glass-card p-4 border border-emerald-500/20 text-center">
                  <p className="text-2xl font-bold text-emerald-400">2.4M+</p>
                  <p className="text-xs text-slate-400">Members Worldwide</p>
                </div>
                <div className="glass-card p-4 border border-emerald-500/20 text-center">
                  <p className="text-2xl font-bold text-cyan-400">$48B+</p>
                  <p className="text-xs text-slate-400">Assets Under Management</p>
                </div>
                <div className="glass-card p-4 border border-emerald-500/20 text-center">
                  <p className="text-2xl font-bold text-amber-400">4</p>
                  <p className="text-xs text-slate-400">Global HQ</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-8 lg:p-16 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Ready to Start Banking Better?</h2>
              <p className="text-lg text-emerald-100 mb-8 max-w-2xl mx-auto">Open your free account in minutes. No credit check required, no monthly fees, and start earning up to 5.25% APY today.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={() => { setShowSignupModal(true); setShowAccountTypeModal(true); }} className="inline-flex items-center justify-center gap-2 bg-white text-emerald-600 font-bold px-8 py-4 rounded-full hover:bg-emerald-50 transition-colors">
                  Open Free Account
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-semibold px-8 py-4 rounded-full border border-white/30 hover:bg-white/20 transition-colors">
                  Schedule a Call
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Accessibility Section */}
      <section className="py-16 bg-slate-900/50 border-y border-emerald-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                <Accessibility className="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Accessibility First</h3>
                <p className="text-slate-400">Built with inclusive design principles for everyone</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              {['WCAG 2.1 AAA Compliant', 'Screen Reader Support', 'High Contrast Mode', 'Keyboard Navigation'].map((tag, i) => (
                <span key={i} className="px-4 py-2 rounded-full bg-slate-800 text-sm font-medium text-slate-300 border border-slate-700">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-emerald-500/20 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <img src={BRAND_IMAGES.logo} alt="OrbitPay Finance" className="h-12 w-auto" />
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">OrbitPay Finance - Banking Without Borders. Serving 2.4 million members worldwide with trusted financial services.</p>
              <div className="flex items-center gap-4">
                {['twitter', 'instagram', 'linkedin'].map((social, i) => (
                  <a key={i} href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-600 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                  </a>
                ))}
              </div>
            </div>

            {[{ title: 'Products', links: ['Checking', 'Savings', 'Investments', 'Insurance', 'Credit Cards'] }, { title: 'Company', links: ['About Us', 'Careers', 'Press', 'Blog', 'Partners'] }, { title: 'Support', links: ['Help Center', 'Contact Us', 'FAQs', 'Security', 'Community'] }, { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Disclosures'] }].map((column, i) => (
              <div key={i}>
                <h4 className="font-semibold mb-4 text-white">{column.title}</h4>
                <ul className="space-y-2">
                  {column.links.map((link, j) => (
                    <li key={j}><a href="#" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-400">© 2025 OrbitPay Finance. All rights reserved. | www.orbitpayfinance.com</p>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <span>FDIC Insured</span>
              <span>Equal Housing Lender</span>
              <span>Regulated Financial Institution</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Login Modal - Fixed Responsive */}
      {/* Login Modal - Using EnterpriseModal for Production Readiness */}
      <EnterpriseModal
        open={showLoginModal}
        onOpenChange={setShowLoginModal}
        title="Welcome Back"
        subtitle="Sign in to your OrbitPay account"
        size="lg"
        position="center"
      >
        {/* Modal Header Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Landmark className="w-7 h-7 text-white" />
          </div>
        </div>

        {/* Error Alert */}
        {loginError && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-400">{loginError}</p>
          </div>
        )}

        {/* Login Form */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                placeholder="Enter your password"
                className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-white placeholder:text-slate-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={loginForm.rememberMe}
                onChange={(e) => setLoginForm({ ...loginForm, rememberMe: e.target.checked })}
                className="w-4 h-4 rounded border-slate-600 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm text-slate-400">Remember me</span>
            </label>
            <a href="#" className="text-sm font-medium text-emerald-400 hover:text-emerald-300">Forgot password?</a>
          </div>

          <p className="text-center text-sm text-slate-400">
            Don't have an account?{' '}
            <button
              onClick={() => { setShowLoginModal(false); setShowSignupModal(true); setShowAccountTypeModal(true); }}
              className="font-semibold text-emerald-400 hover:text-emerald-300"
            >
              Open Account
            </button>
          </p>
        </div>
      </EnterpriseModal>

      {/* Signup Flow Modal - Using EnterpriseModal for Production Readiness */}
      <EnterpriseModal
        open={showSignupModal}
        onOpenChange={(open) => {
          if (!open) {
            setShowSignupModal(false);
            setShowAccountTypeModal(false);
            setShowPersonalInfoModal(false);
            setShowIdentityModal(false);
            setShowReviewModal(false);
          }
        }}
        title="Open Your Account"
        subtitle={`Step ${showReviewModal ? 4 : showIdentityModal ? 3 : showPersonalInfoModal ? 2 : 1} of 4`}
        size="lg"
        position="center"
        showScrollNav={false}
      >
        {/* Progress Bar */}
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex-1 h-1 rounded-full bg-slate-700">
              <div
                className={`h-full rounded-full transition-all duration-300 ${step <= (showReviewModal ? 4 : showIdentityModal ? 3 : showPersonalInfoModal ? 2 : 1) ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : ''}`}
                style={{ width: step <= (showReviewModal ? 4 : showIdentityModal ? 3 : showPersonalInfoModal ? 2 : 1) ? '100%' : '0%' }}
              />
            </div>
          ))}
        </div>

        {/* Step 1: Account Type Selection */}
        {showAccountTypeModal && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Select Account Type</h3>
            <div className="space-y-3">
              {accountTypes.map((account) => (
                <button
                  key={account.type}
                  onClick={() => handleSelectAccountType(account.type as 'checking' | 'savings' | 'joint')}
                  className="w-full p-4 rounded-xl border-2 border-slate-700 hover:border-emerald-500 transition-colors text-left bg-slate-800/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                      <account.icon className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-white">{account.name}</p>
                      <p className="text-sm text-slate-400">{account.desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Personal Information */}
        {showPersonalInfoModal && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">First Name *</label>
                  <input
                    type="text"
                    value={signupForm.firstName}
                    onChange={(e) => setSignupForm({ ...signupForm, firstName: e.target.value })}
                    placeholder="John"
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder:text-slate-500 outline-none focus:border-emerald-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Last Name *</label>
                  <input
                    type="text"
                    value={signupForm.lastName}
                    onChange={(e) => setSignupForm({ ...signupForm, lastName: e.target.value })}
                    placeholder="Doe"
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder:text-slate-500 outline-none focus:border-emerald-500 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Date of Birth *</label>
                <input
                  type="date"
                  value={signupForm.dateOfBirth}
                  onChange={(e) => setSignupForm({ ...signupForm, dateOfBirth: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white outline-none focus:border-emerald-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">SSN (Last 4 digits) *</label>
                <input
                  type="text"
                  value={signupForm.ssn}
                  onChange={(e) => setSignupForm({ ...signupForm, ssn: e.target.value })}
                  placeholder="1234"
                  maxLength={4}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder:text-slate-500 outline-none focus:border-emerald-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  value={signupForm.phone}
                  onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder:text-slate-500 outline-none focus:border-emerald-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Email Address *</label>
                <input
                  type="email"
                  value={signupForm.email}
                  onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder:text-slate-500 outline-none focus:border-emerald-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Confirm Email *</label>
                <input
                  type="email"
                  value={signupForm.confirmEmail}
                  onChange={(e) => setSignupForm({ ...signupForm, confirmEmail: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder:text-slate-500 outline-none focus:border-emerald-500 text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Identity Verification */}
        {showIdentityModal && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Identity Verification</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">ID Type *</label>
                <select
                  value={signupForm.idType}
                  onChange={(e) => setSignupForm({ ...signupForm, idType: e.target.value as any })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white outline-none focus:border-emerald-500 text-sm"
                >
                  <option value="">Select ID type</option>
                  <option value="drivers_license">Driver's License</option>
                  <option value="passport">Passport</option>
                  <option value="state_id">State ID</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">ID Number *</label>
                <input
                  type="text"
                  value={signupForm.idNumber}
                  onChange={(e) => setSignupForm({ ...signupForm, idNumber: e.target.value })}
                  placeholder="Enter ID number"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder:text-slate-500 outline-none focus:border-emerald-500 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Issue Date *</label>
                  <input
                    type="date"
                    value={signupForm.issueDate}
                    onChange={(e) => setSignupForm({ ...signupForm, issueDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white outline-none focus:border-emerald-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Expiry Date *</label>
                  <input
                    type="date"
                    value={signupForm.expiryDate}
                    onChange={(e) => setSignupForm({ ...signupForm, expiryDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white outline-none focus:border-emerald-500 text-sm"
                  />
                </div>
              </div>
              <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20 flex items-start gap-3">
                <FileCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-emerald-400">Your information is encrypted and secure. We use bank-level security to protect your personal data.</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Review & Agree */}
        {showReviewModal && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Review & Agree</h3>
            <div className="space-y-4">
              <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                <h4 className="font-medium text-white text-sm mb-2">Account Summary</h4>
                <div className="space-y-2 text-sm text-slate-300">
                  <p><span className="font-medium">Account Type:</span> {signupForm.accountType === 'checking' ? 'Primary Checking' : signupForm.accountType === 'savings' ? 'High-Yield Savings' : 'Joint Account'}</p>
                  <p><span className="font-medium">Name:</span> {signupForm.firstName} {signupForm.lastName}</p>
                  <p><span className="font-medium">Email:</span> {signupForm.email}</p>
                  <p><span className="font-medium">Phone:</span> {signupForm.phone}</p>
                </div>
              </div>
              <label className="flex items-start gap-3 p-4 rounded-xl border border-slate-700 cursor-pointer hover:bg-slate-800/50">
                <input
                  type="checkbox"
                  checked={signupForm.agreedToTerms}
                  onChange={(e) => setSignupForm({ ...signupForm, agreedToTerms: e.target.checked })}
                  className="w-5 h-5 rounded border-slate-600 text-emerald-600 focus:ring-emerald-500 mt-0.5 flex-shrink-0"
                />
                <span className="text-sm text-slate-300">
                  I agree to the <a href="#" className="text-emerald-400 hover:underline">Terms of Service</a> and <a href="#" className="text-emerald-400 hover:underline">Electronic Disclosure</a> *
                </span>
              </label>
              <label className="flex items-start gap-3 p-4 rounded-xl border border-slate-700 cursor-pointer hover:bg-slate-800/50">
                <input
                  type="checkbox"
                  checked={signupForm.agreedToPrivacy}
                  onChange={(e) => setSignupForm({ ...signupForm, agreedToPrivacy: e.target.checked })}
                  className="w-5 h-5 rounded border-slate-600 text-emerald-600 focus:ring-emerald-500 mt-0.5 flex-shrink-0"
                />
                <span className="text-sm text-slate-300">
                  I have read and agree to the <a href="#" className="text-emerald-400 hover:underline">Privacy Policy</a> *
                </span>
              </label>
              <label className="flex items-start gap-3 p-4 rounded-xl border border-slate-700 cursor-pointer hover:bg-slate-800/50">
                <input
                  type="checkbox"
                  checked={signupForm.agreedToCreditCheck}
                  onChange={(e) => setSignupForm({ ...signupForm, agreedToCreditCheck: e.target.checked })}
                  className="w-5 h-5 rounded border-slate-600 text-emerald-600 focus:ring-emerald-500 mt-0.5 flex-shrink-0"
                />
                <span className="text-sm text-slate-300">
                  I consent to a soft credit check for account opening purposes *
                </span>
              </label>
            </div>
          </div>
        )}
      </EnterpriseModal>

      {/* Success Modal - Using EnterpriseModal for Production Readiness */}
      <EnterpriseModal
        open={showSuccessModal}
        onOpenChange={(open) => {
          if (!open) {
            setShowSuccessModal(false);
            setShowSignupModal(false);
          }
        }}
        size="md"
        position="center"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-2">Application Received!</h2>
          <p className="text-slate-400 mb-6 text-sm">
            Thank you for choosing OrbitPay. We've sent a verification email to {signupForm.email}. Your account will be activated once you verify your email address.
          </p>
          <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/20 text-left">
            <p className="text-sm text-slate-400 mb-2">What's next?</p>
            <ul className="text-sm text-slate-300 space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Check your email for verification link
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Complete identity verification
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Make your first deposit
              </li>
            </ul>
          </div>
        </div>
      </EnterpriseModal>

      {/* Account Creation Wizard - Full Screen with Proper Modal Container */}
      {showAccountWizard && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md overflow-auto">
          <AccountCreationWizard
            onComplete={() => {
              setShowAccountWizard(false);
              setShowLoginModal(true);
            }}
            onCancel={() => setShowAccountWizard(false)}
          />
        </div>
      )}
    </div>
  );
}
