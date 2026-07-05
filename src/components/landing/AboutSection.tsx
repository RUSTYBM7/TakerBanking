import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Building2, Users, Calendar, Trophy } from 'lucide-react'

const AboutSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const milestones = [
    { year: "1952", title: "Founded", description: "Established by 12 community members" },
    { year: "1975", title: "1K Members", description: "Reached our first thousand members" },
    { year: "1998", title: "Digital Era", description: "Launched online banking services" },
    { year: "2024", title: "Today", description: "Serving 2.4M+ members nationwide" }
  ]

  const branchImages = [
    '/assets/images/building-global-hq.png',
    '/assets/images/mobile-app-preview.png',
    '/assets/images/poster-banner.png'
  ]

  return (
    <section ref={ref} className="pt-20 pb-16 md:pt-24 md:pb-20 lg:pt-28 lg:pb-24 bg-white relative overflow-visible">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold mb-6">
              About OrbitPay
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              A Legacy of Trust
              <br />
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Since 1952
              </span>
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              OrbitPay Credit Union was founded on the principle that financial services should
              benefit everyone, not just shareholders. For over 70 years, we've remained committed
              to our members, offering better rates, lower fees, and exceptional service.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              As a not-for-profit cooperative, any profits we make are returned to our members
              through better savings rates, lower loan rates, and reduced fees. That's the
              credit union difference.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: Users, value: "2.4M+", label: "Members" },
                { icon: Building2, value: "350+", label: "Branches" },
                { icon: Calendar, value: "70+", label: "Years" },
                { icon: Trophy, value: "50+", label: "Awards" }
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Branch Images Grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              {/* Main large image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="col-span-2 rounded-3xl overflow-hidden shadow-2xl shadow-emerald-500/20"
              >
                <img
                  src={branchImages[0]}
                  alt="OrbitPay Global Headquarters - Sacramento, California"
                  className="w-full h-64 object-cover"
                />
              </motion.div>

              {/* Two smaller images */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="rounded-3xl overflow-hidden shadow-xl shadow-emerald-500/10"
              >
                <img
                  src={branchImages[1]}
                  alt="OrbitPay Europe Headquarters - Frankfurt, Germany"
                  className="w-full h-40 object-cover"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="rounded-3xl overflow-hidden shadow-xl shadow-emerald-500/10"
              >
                <img
                  src={branchImages[2]}
                  alt="OrbitPay Reception Area"
                  className="w-full h-40 object-cover"
                />
              </motion.div>
            </div>

            {/* Location badges */}
            <div className="mt-4 flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                Sacramento, CA
              </span>
              <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                Frankfurt, Germany
              </span>
              <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                350+ Branches
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
