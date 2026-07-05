import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  ArrowUpDown,
  Bell,
  Image,
  QrCode,
  Smartphone
} from 'lucide-react';

const MobileBankingSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const features = [
    { icon: Smartphone, title: "Deposit Checks", description: "Snap a photo to deposit" },
    { icon: QrCode, title: "Pay Bills", description: "One-tap payments" },
    { icon: ArrowUpDown, title: "Transfer Money", description: "Instant transfers" },
    { icon: Bell, title: "Alerts", description: "Real-time notifications" }
  ]

  return (
    <section ref={ref} className="py-24 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold mb-6">
              Mobile Banking
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Bank Anywhere,
              <br />
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Anytime
              </span>
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Take your banking to go with our powerful mobile app. Available on iOS and Android,
              with all the features you need to manage your finances on the move.
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100">
                <span className="text-2xl">🍎</span>
                <span className="font-medium text-gray-700">iOS App</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100">
                <span className="text-2xl">🤖</span>
                <span className="font-medium text-gray-700">Android App</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{feature.title}</div>
                    <div className="text-sm text-gray-500">{feature.description}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center"
          >
            {/* Mobile App Preview Images */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-[3rem] blur-2xl opacity-20" />

              {/* Featured App Preview Image */}
              <img
                src="/assets/images/mobile-app-preview.png"
                alt="OrbitPay Mobile Banking App Preview"
                className="rounded-3xl shadow-2xl shadow-emerald-500/30 max-w-md w-full"
              />

              {/* Secondary Mobile Landing Image */}
              <img
                src="/assets/images/mobile-landing-1.png"
                alt="OrbitPay Vision Mobile Experience"
                className="absolute -bottom-8 -right-8 rounded-2xl shadow-xl shadow-emerald-500/20 w-48 hidden lg:block"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default MobileBankingSection
