import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, ShieldCheck, Sparkles, BarChart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { BrandLogo } from '@/components/branding/BrandLogo'

const HeroSection = () => {
  const navigate = useNavigate()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  }

  const floatingAnimation = {
    y: [0, -15, 0],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-radial from-emerald-200/30 to-transparent rounded-full animate-pulse-soft" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-radial from-cyan-200/30 to-transparent rounded-full animate-pulse-soft" style={{ animationDelay: "1s" }} />

        {/* Floating Orbs */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-64 h-64 rounded-full bg-gradient-to-br from-emerald-300/20 to-cyan-300/20 blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              left: `${20 + i * 15}%`,
              top: `${20 + i * 10}%`
            }}
          />
        ))}

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-5xl mx-auto"
        >
          {/* Trust Badge */}
          <motion.div variants={itemVariants} className="mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-emerald-200/50 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700">FDIC Insured • Trusted by 2M+ Members</span>
            </span>
          </motion.div>

          {/* Brand Logo */}
          <motion.div variants={itemVariants} className="mb-6">
            <BrandLogo variant="hero" className="mx-auto" />
          </motion.div>

          {/* Main Headline */}
          <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Your Future.
            </span>
            <br />
            <span className="text-gray-900">Our Priority.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-6 max-w-3xl mx-auto leading-relaxed"
          >
            Welcome to OrbitPay Credit Union — where financial innovation meets community values.
            Experience banking designed for the way you live.
          </motion.p>

          {/* Featured Hero Video + Static Banner Fallback */}
          <motion.div variants={itemVariants} className="mb-8">
            <video
              className="mx-auto rounded-2xl shadow-2xl shadow-emerald-500/20 w-full max-w-4xl h-auto object-cover"
              style={{ maxHeight: '420px' }}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="/assets/images/corporate-banner.png"
              controls
              aria-label="OrbitPay Credit Union — Banking Without Borders"
            >
              <source src="/assets/videos/orbitpay-hero.mp4" type="video/mp4" />
              <img
                src="/assets/images/corporate-banner.png"
                alt="OrbitPay Credit Union - Banking Without Borders"
                className="mx-auto rounded-2xl w-full max-w-4xl h-auto"
                style={{ maxHeight: '420px' }}
              />
            </video>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              onClick={() => navigate('/app', { state: { openModal: 'onboarding' } })}
              className="h-14 px-8 text-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/30 rounded-2xl transition-all duration-300 group"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Get Started
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              className="h-14 px-8 text-lg border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-2xl transition-all duration-300"
            >
              Learn More
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { label: "Members", value: "2M+", icon: Sparkles },
              { label: "Assets", value: "$15B", icon: BarChart },
              { label: "Branches", value: "350+", icon: ShieldCheck },
              { label: "Rating", value: "4.9★", icon: ShieldCheck }
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                className="glass-card p-4 sm:p-6 rounded-2xl text-center"
              >
                <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600 mx-auto mb-2" />
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-emerald-400/50 flex justify-center">
          <motion.div
            className="w-1.5 h-3 bg-emerald-500 rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  )
}

export default HeroSection
