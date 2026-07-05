import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  BarChart,
  Building,
  CreditCard,
  Home,
  Image,
  ShieldCheck,
  Smartphone,
  User,
  Wallet
} from 'lucide-react';

const ProductsSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const products = [
    {
      icon: Wallet,
      title: "Savings Accounts",
      description: "Grow your wealth with competitive rates and no minimum balance requirements.",
      features: ["High-yield savings", "Automatic savings", "Goal tracking"]
    },
    {
      icon: Building,
      title: "Checking Accounts",
      description: "Easy access to your money with free checking and overdraft protection.",
      features: ["Free ATM access", "Direct deposit", "Online bill pay"]
    },
    {
      icon: CreditCard,
      title: "Credit Cards",
      description: "Earn rewards, build credit, and enjoy premium benefits.",
      features: ["Cash back", "Travel rewards", "Zero liability"]
    },
    {
      icon: BarChart,
      title: "Investments",
      description: "Build your portfolio with our expert guidance and diverse options.",
      features: ["Robo-advisory", "Managed portfolios", "Retirement planning"]
    },
    {
      icon: ShieldCheck,
      title: "Insurance",
      description: "Protect what matters most with comprehensive coverage.",
      features: ["Life insurance", "Auto insurance", "Home insurance"]
    },
    {
      icon: Smartphone,
      title: "Digital Banking",
      description: "Bank anytime, anywhere with our award-winning mobile app.",
      features: ["Mobile deposit", "Instant transfers", "Budget tools"]
    }
  ]

  return (
    <section ref={ref} className="pt-24 pb-16 md:pt-28 md:pb-20 lg:pt-32 lg:pb-24 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-visible">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold mb-4">
            Our Products
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Complete Financial Solutions
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            From everyday banking to long-term wealth building, we offer a comprehensive suite of
            financial products designed to help you achieve your goals.
          </p>
        </motion.div>

        {/* Featured Product Card with User Image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="glass-card rounded-3xl overflow-visible">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold mb-4 w-fit">
                  Most Popular
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Primary Checking</h3>
                <p className="text-gray-600 mb-6">
                  Everyday banking with no monthly fees. Get free access to 30,000+ ATMs,
                  direct deposit, and overdraft protection up to $200.
                </p>
                <ul className="space-y-2 mb-6">
                  {['Free transfers', 'Free debit card', 'Overdraft protection', 'Mobile deposits'].map((feature) => (
                    <li key={feature} className="flex items-center text-sm text-gray-600">
                      <svg className="w-5 h-5 text-emerald-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all"
                  >
                    Open Primary Checking
                  </motion.button>
                  <span className="text-sm text-emerald-600 font-medium">4.25% APY</span>
                </div>
              </div>
              <div className="relative h-64 md:h-auto">
                <img
                  src="/assets/images/mobile-app-preview.png"
                  alt="OrbitPay Mobile Banking App"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-emerald-50/90 md:block hidden" />
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="glass-card p-8 h-full rounded-3xl transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <product.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{product.title}</h3>
                <p className="text-gray-600 mb-6">{product.description}</p>
                <ul className="space-y-2">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm text-gray-500">
                      <svg className="w-5 h-5 text-emerald-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProductsSection
