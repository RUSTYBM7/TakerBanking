import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  AlertTriangle,
  Bell,
  Briefcase,
  Building2,
  Calendar,
  Camera,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Crown,
  Eye,
  EyeOff,
  FileText,
  Fingerprint,
  Fuel,
  GraduationCap,
  Heart,
  Info,
  Loader2,
  Lock,
  MapPin,
  MessageSquare,
  Phone,
  PiggyBank,
  Save,
  Send,
  Shield,
  Smartphone,
  Sparkles,
  Star,
  Timer,
  TrendingUp,
  Upload,
  User,
  Users,
  Wallet,
  X
} from 'lucide-react';;
import { GlassButton, GlassInput } from '@/components/glass';
import {
  onboardingAPI,
  validateStepWelcome,
  validateStepPersonalInfo,
  validateStepContact,
  validateStepAddress,
  validateStepIDVerification,
  validateStepBusiness,
  validateStepJointPartner,
  validateEmail,
  validatePhone,
  validateDateOfBirth,
  validateSSN,
  validateAddress,
  validateZipCode,
  maskEmail,
  maskPhone,
  formatPhoneNumber,
  type OnboardingData
} from '@/lib/onboarding-api';

// Account type definitions
export type AccountType = 'savings' | 'checking' | 'student' | 'business' | 'joint' | 'youth' | 'premium' | 'retirement';

interface AccountTypeConfig {
  id: AccountType;
  name: string;
  tagline: string;
  color: string;
  bgGradient: string;
  minAge?: number;
  features: string[];
}

export const accountTypeConfigs: Record<AccountType, AccountTypeConfig> = {
  savings: {
    id: 'savings',
    name: 'Savings Account',
    tagline: 'Grow your wealth with competitive interest rates',
    color: 'from-green-500 to-emerald-500',
    bgGradient: 'bg-gradient-to-br from-green-50 to-emerald-50',
    features: ['4.50% APY', 'No minimum balance', 'FDIC insured', 'Easy transfers', 'Goal tracking'],
  },
  checking: {
    id: 'checking',
    name: 'Checking Account',
    tagline: 'Daily banking with unlimited flexibility',
    color: 'from-blue-500 to-cyan-500',
    bgGradient: 'bg-gradient-to-br from-blue-50 to-cyan-50',
    features: ['Free debit card', 'No monthly fees', 'Mobile deposits', '24/7 access', 'Overdraft protection'],
  },
  student: {
    id: 'student',
    name: 'Student Account',
    tagline: 'Designed for your education journey',
    color: 'from-purple-500 to-pink-500',
    bgGradient: 'bg-gradient-to-br from-purple-50 to-pink-50',
    minAge: 13,
    features: ['Zero fees', 'Financial education', 'Credit building', 'No cosigner required', 'Low limits'],
  },
  business: {
    id: 'business',
    name: 'Business Account',
    tagline: 'Fuel your business growth',
    color: 'from-amber-500 to-orange-500',
    bgGradient: 'bg-gradient-to-br from-amber-50 to-orange-50',
    features: ['Multi-user access', 'Merchant services', 'Tax tools', 'Payroll support', 'API access'],
  },
  joint: {
    id: 'joint',
    name: 'Joint Account',
    tagline: 'Shared banking for couples & partners',
    color: 'from-rose-500 to-red-500',
    bgGradient: 'bg-gradient-to-br from-rose-50 to-red-50',
    features: ['Equal access', 'Combined funds', 'Individual cards', 'Shared goals', 'Transparent'],
  },
  youth: {
    id: 'youth',
    name: 'Youth Account',
    tagline: 'Teaching smart money habits early',
    color: 'from-indigo-500 to-violet-500',
    bgGradient: 'bg-gradient-to-br from-indigo-50 to-violet-50',
    minAge: 13,
    features: ['Parental controls', 'Spending insights', 'Savings goals', 'No fees', 'Educational tools'],
  },
  premium: {
    id: 'premium',
    name: 'Premium Membership',
    tagline: 'Exclusive benefits & premium service',
    color: 'from-yellow-500 to-amber-500',
    bgGradient: 'bg-gradient-to-br from-yellow-50 to-amber-50',
    features: ['5.00% APY', 'Priority support', 'Concierge service', 'Travel perks', 'Premium card'],
  },
  retirement: {
    id: 'retirement',
    name: 'Retirement Account',
    tagline: 'Secure your future today',
    color: 'from-teal-500 to-cyan-500',
    bgGradient: 'bg-gradient-to-br from-teal-50 to-cyan-50',
    features: ['Tax advantages', 'IRA options', 'Investment tools', 'Financial planning', 'Compound growth'],
  },
};

// Wizard steps for each account type
interface Step {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  validate?: (data: Partial<OnboardingData>, accountType: string) => { valid: boolean; errors: Record<string, string> };
}

const getStepsForAccountType = (type: AccountType): Step[] => {
  const baseSteps: Step[] = [
    { id: 'welcome', title: 'Welcome', subtitle: 'Review terms', icon: Star },
    { id: 'personal_info', title: 'Personal Info', subtitle: 'Your details', icon: User, validate: validateStepPersonalInfo },
    { id: 'contact', title: 'Contact', subtitle: 'Reach you', icon: Smartphone, validate: validateStepContact },
    { id: 'address', title: 'Address', subtitle: 'Your location', icon: MapPin, validate: validateStepAddress },
    { id: 'verification', title: 'Verify', subtitle: 'Identity check', icon: Shield },
    { id: 'id_upload', title: 'ID Upload', subtitle: 'Document check', icon: CreditCard, validate: validateStepIDVerification },
    { id: 'review', title: 'Review', subtitle: 'Confirm details', icon: FileText },
    { id: 'complete', title: 'Complete', subtitle: 'All done', icon: Check },
  ];

  switch (type) {
    case 'business':
      return [
        ...baseSteps.slice(0, 2),
        { id: 'business_info', title: 'Business', subtitle: 'Company details', icon: Briefcase, validate: validateStepBusiness },
        ...baseSteps.slice(2),
      ];
    case 'joint':
      return [
        ...baseSteps.slice(0, 2),
        { id: 'joint_partner', title: 'Partner', subtitle: 'Second holder', icon: Users, validate: validateStepJointPartner },
        ...baseSteps.slice(2),
      ];
    case 'student':
      return [
        ...baseSteps.slice(0, 2),
        { id: 'student_info', title: 'Student', subtitle: 'Education details', icon: GraduationCap },
        ...baseSteps.slice(2),
      ];
    case 'youth':
      return [
        ...baseSteps.slice(0, 2),
        { id: 'guardian_info', title: 'Guardian', subtitle: 'Parent info', icon: Users },
        ...baseSteps.slice(2),
      ];
    case 'premium':
      return [
        ...baseSteps.slice(0, 2),
        { id: 'premium_info', title: 'Premium', subtitle: 'Membership tier', icon: Crown },
        ...baseSteps.slice(2),
      ];
    case 'retirement':
      return [
        ...baseSteps.slice(0, 2),
        { id: 'retirement_info', title: 'Retirement', subtitle: 'Plan details', icon: TrendingUp },
        ...baseSteps.slice(2),
      ];
    default:
      return baseSteps;
  }
};

interface AccountCreationWizardProps {
  onComplete?: () => void;
  onCancel?: () => void;
}

export default function AccountCreationWizard({ onComplete, onCancel }: AccountCreationWizardProps) {
  const [selectedType, setSelectedType] = useState<AccountType | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState<Partial<OnboardingData>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  const [otpMaskedTarget, setOtpMaskedTarget] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [idFrontPreview, setIdFrontPreview] = useState<string | null>(null);
  const [idBackPreview, setIdBackPreview] = useState<string | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const idFrontRef = useRef<HTMLInputElement>(null);
  const idBackRef = useRef<HTMLInputElement>(null);
  const selfieRef = useRef<HTMLInputElement>(null);

  const steps = selectedType ? getStepsForAccountType(selectedType) : [];
  const currentStep = steps[currentStepIndex];
  const progress = steps.length > 0 ? ((currentStepIndex + 1) / steps.length) * 100 : 0;
  const config = selectedType ? accountTypeConfigs[selectedType] : null;

  // OTP Timer
  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpTimer]);

  // Initialize session when account type is selected
  const handleSelectAccountType = async (type: AccountType) => {
    setSelectedType(type);
    setCurrentStepIndex(0);
    setFormData({});
    setErrors({});

    try {
      const session = await onboardingAPI.createSession(type);
      setSessionId(session.session_id);
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  // Update form data and clear field errors
  const updateFormData = (key: keyof OnboardingData, value: unknown) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  // Validate current step
  const validateCurrentStep = useCallback((): boolean => {
    if (!currentStep?.validate) return true;

    const result = currentStep.validate(formData, selectedType || '');
    if (!result.valid) {
      setErrors(result.errors);
      return false;
    }
    return true;
  }, [currentStep, formData, selectedType]);

  // Check if can proceed
  const canProceed = (): boolean => {
    if (!currentStep) return false;

    switch (currentStep.id) {
      case 'welcome':
        return formData.agreed_to_terms && formData.agreed_to_privacy && formData.agreed_to_membership;
      case 'personal_info':
        return !!(formData.first_name && formData.last_name && formData.date_of_birth && formData.ssn_last4);
      case 'contact':
        return !!(formData.email && formData.phone);
      case 'address':
        return !!(formData.street_address && formData.city && formData.state && formData.zip_code);
      case 'verification':
        return otp.join('').length === 6;
      case 'id_upload':
        return !!(formData.id_type && formData.id_number);
      case 'business_info':
        return !!(formData.business_name && formData.business_type && formData.ein);
      case 'joint_partner':
        return !!(formData.partner_first_name && formData.partner_last_name && formData.partner_email);
      case 'review':
        return formData.agreed_to_terms === true;
      default:
        return true;
    }
  };

  // Handle next step
  const handleNext = async () => {
    // Validate before proceeding
    if (!validateCurrentStep()) {
      return;
    }

    // Special handling for verification step - send OTP
    if (currentStep.id === 'contact' && !otpSent) {
      try {
        await handleSendOTP();
        return;
      } catch (error) {
        console.error('Error sending OTP:', error);
      }
    }

    // Save current step data
    if (sessionId) {
      await onboardingAPI.updateSession(sessionId, formData, currentStepIndex + 1);
    }

    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setErrors({});
    }
  };

  // Handle back - NO GOING BACK from verification/security steps
  const handleBack = () => {
    const restrictedSteps = ['verification', 'id_upload', 'review'];
    if (restrictedSteps.includes(currentStep.id)) {
      return; // Cannot go back from security steps
    }

    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      setErrors({});
    } else {
      setSelectedType(null);
      setCurrentStepIndex(0);
    }
  };

  // Send OTP
  const handleSendOTP = async () => {
    if (!sessionId) return;

    const type = formData.phone ? 'phone' : 'email';
    const result = await onboardingAPI.sendOTP(sessionId, type);

    if (result.success) {
      setOtpSent(true);
      setOtpMaskedTarget(result.masked_target);
      setOtpTimer(300); // 5 minutes
      setCurrentStepIndex(prev => prev + 1); // Move to verification step
    }
  };

  // Verify OTP
  const handleVerifyOTP = async () => {
    if (!sessionId || otp.join('').length !== 6) return;

    setIsSubmitting(true);
    const result = await onboardingAPI.verifyOTP(sessionId, otp.join(''));
    setIsSubmitting(false);

    if (result.success) {
      if (currentStepIndex < steps.length - 1) {
        setCurrentStepIndex(prev => prev + 1);
        setOtp(['', '', '', '', '', '']);
      }
    } else {
      setErrors({ otp: result.error || 'Invalid code' });
      setOtp(['', '', '', '', '', '']);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (otpTimer > 0) return;
    await handleSendOTP();
  };

  // OTP input handlers
  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }

    // Auto-verify when complete
    if (newOtp.every(digit => digit) && newOtp.join('').length === 6) {
      setTimeout(handleVerifyOTP, 100);
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  // File upload handlers
  const handleFileUpload = (type: 'id_front' | 'id_back' | 'selfie') => {
    if (type === 'id_front') idFrontRef.current?.click();
    if (type === 'id_back') idBackRef.current?.click();
    if (type === 'selfie') selfieRef.current?.click();
  };

  const handleFileChange = async (type: 'id_front' | 'id_back' | 'selfie', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !sessionId) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      setErrors({ [type]: 'Please upload an image file' });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrors({ [type]: 'File size must be less than 10MB' });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      if (type === 'id_front') setIdFrontPreview(event.target?.result as string);
      if (type === 'id_back') setIdBackPreview(event.target?.result as string);
      if (type === 'selfie') setSelfiePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to backend
    try {
      const result = await onboardingAPI.uploadDocument(sessionId, type, file);
      if (!result.success) {
        setErrors({ [type]: result.error || 'Upload failed' });
      }
    } catch (error) {
      setErrors({ [type]: 'Upload failed. Please try again.' });
    }
  };

  // Submit application
  const handleSubmit = async () => {
    if (!sessionId) return;

    setIsSubmitting(true);
    try {
      const result = await onboardingAPI.submitApplication(sessionId);
      if (result.success) {
        setCurrentStepIndex(steps.length - 1); // Go to complete step
      } else {
        setErrors({ submit: result.error || 'Submission failed' });
      }
    } catch (error) {
      setErrors({ submit: 'An error occurred. Please try again.' });
    }
    setIsSubmitting(false);
  };

  // Handle completion
  const handleComplete = () => {
    localStorage.removeItem(`onboarding_${sessionId}`);
    if (onComplete) onComplete();
  };

  // Real-time validation
  const validateFieldLive = (field: string, value: string): string | null => {
    switch (field) {
      case 'first_name':
      case 'last_name':
        if (value && value.length < 2) return 'Must be at least 2 characters';
        if (value && !/^[a-zA-Z\s'-]+$/.test(value)) return 'Letters only';
        return null;
      case 'email':
        return validateEmail(value);
      case 'phone':
        return validatePhone(value);
      case 'date_of_birth':
        return validateDateOfBirth(value, selectedType === 'youth' ? 13 : 18);
      case 'ssn_last4':
        return validateSSN(value);
      case 'street_address':
        return validateAddress(value);
      case 'city':
        return value && value.length < 2 ? 'Required' : null;
      case 'state':
        return value && value.length < 2 ? 'Required' : null;
      case 'zip_code':
        return validateZipCode(value);
      case 'id_number':
        return value && !/^[A-Z0-9]{5,20}$/i.test(value) ? 'Invalid ID format' : null;
      case 'business_name':
        return value && value.length < 3 ? 'Must be at least 3 characters' : null;
      case 'ein':
        return value && !/^[0-9]{2}-[0-9]{7}$/.test(value) ? 'Format: XX-XXXXXXX' : null;
      case 'partner_email':
        return value ? validateEmail(value) : null;
      default:
        return null;
    }
  };

  // Render step content
  const renderStepContent = () => {
    if (!currentStep) return null;

    switch (currentStep.id) {
      case 'welcome':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${config?.color} mx-auto mb-6 flex items-center justify-center`}>
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{config?.name}</h2>
            <p className="text-gray-600 mb-6">{config?.tagline}</p>

            {/* Features */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {config?.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2 p-3 bg-white rounded-xl border border-gray-100">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            {/* Terms Agreement */}
            <div className="space-y-3 text-left">
              <label className="flex items-start gap-3 p-4 bg-white rounded-xl border cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.agreed_to_terms || false}
                  onChange={(e) => updateFormData('agreed_to_terms', e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-700">
                  I agree to the <span className="text-emerald-600 font-medium">Terms of Service</span>
                </span>
              </label>
              <label className="flex items-start gap-3 p-4 bg-white rounded-xl border cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.agreed_to_privacy || false}
                  onChange={(e) => updateFormData('agreed_to_privacy', e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-700">
                  I agree to the <span className="text-emerald-600 font-medium">Privacy Policy</span>
                </span>
              </label>
              <label className="flex items-start gap-3 p-4 bg-white rounded-xl border cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.agreed_to_membership || false}
                  onChange={(e) => updateFormData('agreed_to_membership', e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-700">
                  I agree to the <span className="text-emerald-600 font-medium">Membership Agreement</span> and <span className="text-emerald-600 font-medium">Fee Schedule</span>
                </span>
              </label>
            </div>

            {errors.agreed_to_terms && (
              <p className="text-red-500 text-sm mt-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                You must agree to all terms to continue
              </p>
            )}
          </motion.div>
        );

      case 'personal_info':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-center mb-6">
              <User className="w-12 h-12 mx-auto text-emerald-600 mb-3" />
              <h2 className="text-xl font-bold text-gray-900 mb-1">Personal Information</h2>
              <p className="text-gray-600 text-sm">Enter your legal name as shown on your government-issued ID</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name *</label>
                  <input
                    type="text"
                    value={formData.first_name || ''}
                    onChange={(e) => {
                      updateFormData('first_name', e.target.value);
                      const err = validateFieldLive('first_name', e.target.value);
                      if (err) setErrors(prev => ({ ...prev, first_name: err }));
                    }}
                    onBlur={(e) => {
                      const err = validateFieldLive('first_name', e.target.value);
                      if (err) setErrors(prev => ({ ...prev, first_name: err }));
                      else setErrors(prev => { const ne = {...prev}; delete ne.first_name; return ne; });
                    }}
                    placeholder="John"
                    autoComplete="given-name"
                    className={`w-full px-4 py-3 bg-white rounded-xl border ${errors.first_name ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
                  />
                  {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name *</label>
                  <input
                    type="text"
                    value={formData.last_name || ''}
                    onChange={(e) => {
                      updateFormData('last_name', e.target.value);
                    }}
                    placeholder="Doe"
                    autoComplete="family-name"
                    className={`w-full px-4 py-3 bg-white rounded-xl border ${errors.last_name ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
                  />
                  {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Middle Name (Optional)</label>
                <input
                  type="text"
                  value={formData.middle_name || ''}
                  onChange={(e) => updateFormData('middle_name', e.target.value)}
                  placeholder="William"
                  autoComplete="additional-name"
                  className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Date of Birth *</label>
                <input
                  type="date"
                  value={formData.date_of_birth || ''}
                  onChange={(e) => updateFormData('date_of_birth', e.target.value)}
                  autoComplete="bday"
                  className={`w-full px-4 py-3 bg-white rounded-xl border ${errors.date_of_birth ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
                />
                {errors.date_of_birth && <p className="text-red-500 text-xs mt-1">{errors.date_of_birth}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">SSN (Last 4 Digits) *</label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    value={formData.ssn_last4 || ''}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                      updateFormData('ssn_last4', value);
                    }}
                    placeholder="1234"
                    autoComplete="off"
                    className={`w-full px-4 py-3 bg-white rounded-xl border ${errors.ssn_last4 ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all pr-12`}
                  />
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Your SSN is encrypted and secure
                </p>
                {errors.ssn_last4 && <p className="text-red-500 text-xs mt-1">{errors.ssn_last4}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nationality *</label>
                <select
                  value={formData.nationality || 'US'}
                  onChange={(e) => updateFormData('nationality', e.target.value)}
                  className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>
          </motion.div>
        );

      case 'contact':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-center mb-6">
              <Smartphone className="w-12 h-12 mx-auto text-emerald-600 mb-3" />
              <h2 className="text-xl font-bold text-gray-900 mb-1">Contact Information</h2>
              <p className="text-gray-600 text-sm">We'll send a verification code to this contact</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
                <input
                  type="email"
                  inputMode="email"
                  value={formData.email || ''}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  placeholder="john.doe@example.com"
                  autoComplete="email"
                  className={`w-full px-4 py-3 bg-white rounded-xl border ${errors.email ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number *</label>
                <input
                  type="tel"
                  inputMode="tel"
                  value={formData.phone || ''}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, '');
                    if (value.length > 10) value = value.slice(0, 10);
                    if (!value.startsWith('1') && value.length === 10) value = '1' + value;
                    if (value.length > 0 && !value.startsWith('1')) value = '';
                    if (value.length > 0) value = '+' + value;
                    updateFormData('phone', value);
                  }}
                  placeholder="+1 (555) 123-4567"
                  autoComplete="tel"
                  className={`w-full px-4 py-3 bg-white rounded-xl border ${errors.phone ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                <p className="text-xs text-gray-500 mt-1">Enter a valid US phone number for SMS verification</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-800 font-medium">Verification Required</p>
                  <p className="text-xs text-blue-700 mt-1">We'll send a 6-digit code to your phone number to verify your identity. This helps protect your account from unauthorized access.</p>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'verification':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 relative">
                <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping" />
                <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Verify Your Identity</h2>
              <p className="text-gray-600 text-sm">
                Enter the 6-digit code sent to<br />
                <span className="font-semibold text-gray-900">{otpMaskedTarget || maskPhone(formData.phone || '')}</span>
              </p>
            </div>

            <div className="flex justify-center gap-3 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  onKeyDown={(e) => handleOtpKeyDown(e, index)}
                  autoFocus={index === 0}
                  className={`w-12 h-14 text-center text-xl font-bold bg-white border-2 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.otp ? 'border-red-500' : 'border-gray-200 focus:border-emerald-500'}`}
                />
              ))}
            </div>

            {errors.otp && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-sm text-red-700">{errors.otp}</p>
              </div>
            )}

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Code expires in <span className="font-semibold text-emerald-600">{Math.floor(otpTimer / 60)}:{String(otpTimer % 60).padStart(2, '0')}</span>
              </p>
              <button
                onClick={handleResendOTP}
                disabled={otpTimer > 0}
                className={`text-emerald-600 font-medium text-sm ${otpTimer > 0 ? 'opacity-50 cursor-not-allowed' : 'hover:underline'}`}
              >
                {otpTimer > 0 ? `Resend code in ${otpTimer}s` : "Didn't receive a code? Resend"}
              </button>
            </div>
          </motion.div>
        );

      case 'address':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-center mb-6">
              <MapPin className="w-12 h-12 mx-auto text-emerald-600 mb-3" />
              <h2 className="text-xl font-bold text-gray-900 mb-1">Residential Address</h2>
              <p className="text-gray-600 text-sm">Your current address for account verification</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Street Address *</label>
                <input
                  type="text"
                  value={formData.street_address || ''}
                  onChange={(e) => updateFormData('street_address', e.target.value)}
                  placeholder="123 Main Street"
                  autoComplete="address-line1"
                  className={`w-full px-4 py-3 bg-white rounded-xl border ${errors.street_address ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
                />
                {errors.street_address && <p className="text-red-500 text-xs mt-1">{errors.street_address}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Apartment, Suite, etc. (Optional)</label>
                <input
                  type="text"
                  value={formData.address_line2 || ''}
                  onChange={(e) => updateFormData('address_line2', e.target.value)}
                  placeholder="Apt 4B"
                  autoComplete="address-line2"
                  className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">City *</label>
                  <input
                    type="text"
                    value={formData.city || ''}
                    onChange={(e) => updateFormData('city', e.target.value)}
                    placeholder="San Francisco"
                    autoComplete="address-level2"
                    className={`w-full px-4 py-3 bg-white rounded-xl border ${errors.city ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
                  />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">State *</label>
                  <select
                    value={formData.state || ''}
                    onChange={(e) => updateFormData('state', e.target.value)}
                    autoComplete="address-level1"
                    className={`w-full px-4 py-3 bg-white rounded-xl border ${errors.state ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
                  >
                    <option value="">Select</option>
                    <option value="CA">California</option>
                    <option value="NY">New York</option>
                    <option value="TX">Texas</option>
                    <option value="FL">Florida</option>
                    <option value="IL">Illinois</option>
                    <option value="PA">Pennsylvania</option>
                    <option value="OH">Ohio</option>
                    <option value="GA">Georgia</option>
                    <option value="NC">North Carolina</option>
                    <option value="MI">Michigan</option>
                  </select>
                  {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">ZIP Code *</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={10}
                    value={formData.zip_code || ''}
                    onChange={(e) => updateFormData('zip_code', e.target.value)}
                    placeholder="94105"
                    autoComplete="postal-code"
                    className={`w-full px-4 py-3 bg-white rounded-xl border ${errors.zip_code ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
                  />
                  {errors.zip_code && <p className="text-red-500 text-xs mt-1">{errors.zip_code}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Country</label>
                  <select
                    value={formData.country || 'US'}
                    onChange={(e) => updateFormData('country', e.target.value)}
                    className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'id_upload':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-center mb-6">
              <CreditCard className="w-12 h-12 mx-auto text-emerald-600 mb-3" />
              <h2 className="text-xl font-bold text-gray-900 mb-1">Upload Your ID</h2>
              <p className="text-gray-600 text-sm">We accept government-issued photo IDs</p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">ID Type *</label>
                <select
                  value={formData.id_type || ''}
                  onChange={(e) => updateFormData('id_type', e.target.value)}
                  className={`w-full px-4 py-3 bg-white rounded-xl border ${errors.id_type ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
                >
                  <option value="">Select ID type</option>
                  <option value="drivers_license">Driver's License</option>
                  <option value="passport">Passport</option>
                  <option value="state_id">State ID</option>
                  <option value="military_id">Military ID</option>
                </select>
                {errors.id_type && <p className="text-red-500 text-xs mt-1">{errors.id_type}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">ID Number *</label>
                <input
                  type="text"
                  value={formData.id_number || ''}
                  onChange={(e) => updateFormData('id_number', e.target.value.toUpperCase())}
                  placeholder="ABC1234567890"
                  className={`w-full px-4 py-3 bg-white rounded-xl border ${errors.id_number ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
                />
                {errors.id_number && <p className="text-red-500 text-xs mt-1">{errors.id_number}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Front of ID *</label>
                <div
                  onClick={() => handleFileUpload('id_front')}
                  className={`aspect-[3/2] rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
                    idFrontPreview
                      ? 'border-emerald-500 bg-emerald-50'
                      : errors.id_front
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 bg-gray-50 hover:border-emerald-500 hover:bg-emerald-50'
                  }`}
                >
                  {idFrontPreview ? (
                    <img src={idFrontPreview} alt="ID Front" className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">Tap to upload</span>
                    </>
                  )}
                </div>
                <input
                  ref={idFrontRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => handleFileChange('id_front', e)}
                  className="hidden"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Back of ID *</label>
                <div
                  onClick={() => handleFileUpload('id_back')}
                  className={`aspect-[3/2] rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
                    idBackPreview
                      ? 'border-emerald-500 bg-emerald-50'
                      : errors.id_back
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 bg-gray-50 hover:border-emerald-500 hover:bg-emerald-50'
                  }`}
                >
                  {idBackPreview ? (
                    <img src={idBackPreview} alt="ID Back" className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">Tap to upload</span>
                    </>
                  )}
                </div>
                <input
                  ref={idBackRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => handleFileChange('id_back', e)}
                  className="hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Selfie Verification *</label>
              <div
                onClick={() => handleFileUpload('selfie')}
                className={`aspect-[3/4] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
                  selfiePreview
                    ? 'border-emerald-500 bg-emerald-50'
                    : errors.selfie
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300 bg-gray-50 hover:border-emerald-500 hover:bg-emerald-50'
                }`}
              >
                {selfiePreview ? (
                  <img src={selfiePreview} alt="Selfie" className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  <>
                    <Camera className="w-12 h-12 text-gray-400 mb-3" />
                    <span className="text-sm text-gray-500">Take a selfie</span>
                    <span className="text-xs text-gray-400 mt-1">Make sure your face is clearly visible</span>
                  </>
                )}
              </div>
              <input
                ref={selfieRef}
                type="file"
                accept="image/*"
                capture="user"
                onChange={(e) => handleFileChange('selfie', e)}
                className="hidden"
              />
            </div>
          </motion.div>
        );

      case 'business_info':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-center mb-6">
              <Briefcase className="w-12 h-12 mx-auto text-emerald-600 mb-3" />
              <h2 className="text-xl font-bold text-gray-900 mb-1">Business Information</h2>
              <p className="text-gray-600 text-sm">Tell us about your business</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Legal Business Name *</label>
                <input
                  type="text"
                  value={formData.business_name || ''}
                  onChange={(e) => updateFormData('business_name', e.target.value)}
                  placeholder="Acme Corporation"
                  className={`w-full px-4 py-3 bg-white rounded-xl border ${errors.business_name ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
                />
                {errors.business_name && <p className="text-red-500 text-xs mt-1">{errors.business_name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Business Type *</label>
                <select
                  value={formData.business_type || ''}
                  onChange={(e) => updateFormData('business_type', e.target.value)}
                  className={`w-full px-4 py-3 bg-white rounded-xl border ${errors.business_type ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
                >
                  <option value="">Select type</option>
                  <option value="llc">LLC</option>
                  <option value="corporation">Corporation</option>
                  <option value="partnership">Partnership</option>
                  <option value="sole_proprietorship">Sole Proprietorship</option>
                </select>
                {errors.business_type && <p className="text-red-500 text-xs mt-1">{errors.business_type}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">EIN (Employer ID Number) *</label>
                <input
                  type="text"
                  value={formData.ein || ''}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, '');
                    if (value.length > 9) value = value.slice(0, 9);
                    if (value.length > 2) value = value.slice(0, 2) + '-' + value.slice(2);
                    updateFormData('ein', value);
                  }}
                  placeholder="12-3456789"
                  className={`w-full px-4 py-3 bg-white rounded-xl border ${errors.ein ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
                />
                {errors.ein && <p className="text-red-500 text-xs mt-1">{errors.ein}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Industry</label>
                <select
                  value={formData.industry || ''}
                  onChange={(e) => updateFormData('industry', e.target.value)}
                  className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                >
                  <option value="">Select industry</option>
                  <option value="technology">Technology</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="finance">Finance</option>
                  <option value="retail">Retail</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </motion.div>
        );

      case 'joint_partner':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-center mb-6">
              <Users className="w-12 h-12 mx-auto text-emerald-600 mb-3" />
              <h2 className="text-xl font-bold text-gray-900 mb-1">Joint Account Partner</h2>
              <p className="text-gray-600 text-sm">Enter the second account holder's information</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Partner First Name *</label>
                  <input
                    type="text"
                    value={formData.partner_first_name || ''}
                    onChange={(e) => updateFormData('partner_first_name', e.target.value)}
                    placeholder="Jane"
                    className={`w-full px-4 py-3 bg-white rounded-xl border ${errors.partner_first_name ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
                  />
                  {errors.partner_first_name && <p className="text-red-500 text-xs mt-1">{errors.partner_first_name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Partner Last Name *</label>
                  <input
                    type="text"
                    value={formData.partner_last_name || ''}
                    onChange={(e) => updateFormData('partner_last_name', e.target.value)}
                    placeholder="Doe"
                    className={`w-full px-4 py-3 bg-white rounded-xl border ${errors.partner_last_name ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
                  />
                  {errors.partner_last_name && <p className="text-red-500 text-xs mt-1">{errors.partner_last_name}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Partner Email *</label>
                <input
                  type="email"
                  value={formData.partner_email || ''}
                  onChange={(e) => updateFormData('partner_email', e.target.value)}
                  placeholder="jane.doe@example.com"
                  className={`w-full px-4 py-3 bg-white rounded-xl border ${errors.partner_email ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
                />
                {errors.partner_email && <p className="text-red-500 text-xs mt-1">{errors.partner_email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Partner Phone *</label>
                <input
                  type="tel"
                  value={formData.partner_phone || ''}
                  onChange={(e) => updateFormData('partner_phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className={`w-full px-4 py-3 bg-white rounded-xl border ${errors.partner_phone ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
                />
                {errors.partner_phone && <p className="text-red-500 text-xs mt-1">{errors.partner_phone}</p>}
              </div>
            </div>
          </motion.div>
        );

      case 'review':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-center mb-6">
              <FileText className="w-12 h-12 mx-auto text-emerald-600 mb-3" />
              <h2 className="text-xl font-bold text-gray-900 mb-1">Review Your Application</h2>
              <p className="text-gray-600 text-sm">Please verify all information is correct</p>
            </div>

            <div className="space-y-4">
              {/* Account Type */}
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config?.color} flex items-center justify-center`}>
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{config?.name}</p>
                    <p className="text-sm text-gray-600">{config?.tagline}</p>
                  </div>
                </div>
              </div>

              {/* Personal Info */}
              <div className="p-4 bg-white rounded-xl border">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Personal Information</h4>
                <p className="text-gray-900">{formData.first_name} {formData.last_name}</p>
                <p className="text-sm text-gray-600">DOB: {formData.date_of_birth}</p>
                <p className="text-xs text-gray-400">SSN: ***-**-{formData.ssn_last4}</p>
              </div>

              {/* Contact */}
              <div className="p-4 bg-white rounded-xl border">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Contact Information</h4>
                <p className="text-gray-900">{formData.email}</p>
                <p className="text-sm text-gray-600">{formData.phone}</p>
              </div>

              {/* Address */}
              <div className="p-4 bg-white rounded-xl border">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Address</h4>
                <p className="text-gray-900">{formData.street_address}</p>
                <p className="text-sm text-gray-600">{formData.city}, {formData.state} {formData.zip_code}</p>
              </div>

              {/* ID */}
              <div className="p-4 bg-white rounded-xl border">
                <h4 className="text-sm font-medium text-gray-500 mb-2">ID Verification</h4>
                <p className="text-gray-900 capitalize">{formData.id_type?.replace('_', ' ')}</p>
                <p className="text-sm text-gray-600">ID Number: {formData.id_number}</p>
              </div>

              {formData.business_name && (
                <div className="p-4 bg-white rounded-xl border">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Business Information</h4>
                  <p className="text-gray-900">{formData.business_name}</p>
                  <p className="text-sm text-gray-600 capitalize">{formData.business_type?.replace('_', ' ')}</p>
                  <p className="text-xs text-gray-400">EIN: {formData.ein}</p>
                </div>
              )}

              {formData.partner_first_name && (
                <div className="p-4 bg-white rounded-xl border">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Joint Partner</h4>
                  <p className="text-gray-900">{formData.partner_first_name} {formData.partner_last_name}</p>
                  <p className="text-sm text-gray-600">{formData.partner_email}</p>
                </div>
              )}
            </div>

            <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer border border-gray-200 mt-6 hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                checked={formData.agreed_to_terms}
                onChange={(e) => updateFormData('agreed_to_terms', e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm text-gray-700 text-left">
                I confirm that all information provided is accurate and complete. I understand that providing false information may result in account closure and legal consequences.
              </span>
            </label>

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-sm text-red-700">{errors.submit}</p>
              </div>
            )}
          </motion.div>
        );

      case 'complete':
        return (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 mx-auto mb-6 flex items-center justify-center"
            >
              <CheckCircle2 className="w-12 h-12 text-white" />
            </motion.div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">Application Submitted!</h2>
            <p className="text-gray-600 mb-6 max-w-sm mx-auto">
              Thank you for choosing OrbitPay Credit Union. Your application is being reviewed.
            </p>

            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 mb-6 text-left">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <span className="font-medium text-gray-900">Processing Time</span>
              </div>
              <p className="text-sm text-gray-700">24-48 hours for standard applications</p>
              <p className="text-xs text-gray-500 mt-1">Premium applications processed within 4 hours</p>
            </div>

            <div className="p-4 bg-gray-100 rounded-xl">
              <p className="text-sm text-gray-700">
                <strong>Application ID:</strong>{' '}
                <span className="font-mono text-emerald-600">{sessionId?.split('_')[1] || 'OP-' + Date.now().toString(36).toUpperCase()}</span>
              </p>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Bell className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-900">What's Next?</span>
              </div>
              <ul className="text-sm text-blue-800 text-left space-y-1">
                <li className="flex items-center gap-2"><Check className="w-4 h-4" /> Check your email for confirmation</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4" /> You'll receive SMS updates</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4" /> Your account will be activated upon approval</li>
              </ul>
            </div>
          </motion.div>
        );

      default:
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 mx-auto mb-6 flex items-center justify-center">
              <currentStep.icon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{currentStep.title}</h2>
            <p className="text-gray-600">{currentStep.subtitle}</p>
          </motion.div>
        );
    }
  };

  // Account Type Selection Screen
  if (!selectedType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="max-w-lg mx-auto px-5 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 mx-auto mb-4 flex items-center justify-center">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Open Your Account</h1>
            <p className="text-gray-600">Select the account type that best fits your needs</p>
          </div>

          {/* Account Types Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {Object.values(accountTypeConfigs).map((typeConfig) => (
              <motion.button
                key={typeConfig.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleSelectAccountType(typeConfig.id)}
                className={`p-4 rounded-2xl border-2 text-left transition-all hover:border-emerald-500 ${typeConfig.bgGradient}`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${typeConfig.color} flex items-center justify-center mb-3`}>
                  {typeConfig.id === 'savings' && <PiggyBank className="w-6 h-6 text-white" />}
                  {typeConfig.id === 'checking' && <Wallet className="w-6 h-6 text-white" />}
                  {typeConfig.id === 'student' && <GraduationCap className="w-6 h-6 text-white" />}
                  {typeConfig.id === 'business' && <Briefcase className="w-6 h-6 text-white" />}
                  {typeConfig.id === 'joint' && <Users className="w-6 h-6 text-white" />}
                  {typeConfig.id === 'youth' && <Heart className="w-6 h-6 text-white" />}
                  {typeConfig.id === 'premium' && <Crown className="w-6 h-6 text-white" />}
                  {typeConfig.id === 'retirement' && <TrendingUp className="w-6 h-6 text-white" />}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{typeConfig.name}</h3>
                <p className="text-xs text-gray-600 line-clamp-2">{typeConfig.tagline}</p>
              </motion.button>
            ))}
          </div>

          {/* Cancel Button */}
          <button
            onClick={onCancel}
            className="w-full py-3 text-gray-600 font-medium hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  const restrictedBackSteps = ['verification', 'id_upload', 'review'];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header - Hidden on welcome and complete */}
      {currentStep.id !== 'welcome' && currentStep.id !== 'complete' && (
        <div className="flex-none sticky top-0 bg-white/90 backdrop-blur-lg z-40 border-b border-gray-100">
          <div className="max-w-lg mx-auto px-5 py-3">
            <div className="flex items-center justify-between mb-3">
              {/* Back Button - Hidden on restricted steps */}
              {!restrictedBackSteps.includes(currentStep.id) ? (
                <button
                  onClick={handleBack}
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
              ) : (
                <div className="w-10 h-10 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-gray-400" />
                </div>
              )}

              {/* Account Type Badge */}
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${config?.color} flex items-center justify-center`}>
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium text-gray-900 text-sm">{config?.name}</span>
              </div>

              <span className="text-sm text-gray-500">
                {currentStepIndex + 1}/{steps.length}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
              />
            </div>

            {/* Step Label */}
            <p className="text-center text-xs text-gray-500 mt-2">
              {currentStep.title}
              {restrictedBackSteps.includes(currentStep.id) && (
                <span className="ml-2 inline-flex items-center gap-1 text-emerald-600">
                  <Lock className="w-3 h-3" /> Secure step
                </span>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Content - flex-1 with overflow so footer can be sticky at bottom */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-5 py-6">
          <AnimatePresence mode="wait">
            {renderStepContent()}
          </AnimatePresence>
        </div>
      </div>

      {/* Sticky Bottom Navigation - inside flex container, never overlaps content */}
      {currentStep.id !== 'complete' ? (
        <div className="flex-none bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.06)] z-10">
          <div className="max-w-lg mx-auto px-5 py-4">
            <button
              className={`w-full py-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 ${
                canProceed()
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
              disabled={!canProceed() || isSubmitting}
              onClick={currentStep.id === 'review' ? handleSubmit : handleNext}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {currentStep.id === 'review' ? 'Submit Application' : 'Continue'}
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-none bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.06)] z-10">
          <div className="max-w-lg mx-auto px-5 py-4">
            <button
              className="w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center justify-center gap-2"
              onClick={handleComplete}
            >
              Go to Login
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
