import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  Building2,
  Globe,
  Heart,
  Image,
  School,
  TreePine,
  Users
} from 'lucide-react';

const CommunitySection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const branchImages = [
    '/assets/images/building-global-hq.png',
    '/assets/images/poster-banner.png',
    '/assets/images/mobile-app-preview.png',
    '/assets/images/mobile-landing-1.png'
  ]

  const initiatives = [
    {
      icon: Heart,
      title: "Financial Literacy Programs",
      description: "Free financial education for schools and community centers",
      impact: "10,000+ students reached"
    },
    {
      icon: Users,
      title: "Community Development",
      description: "Supporting local businesses and economic growth",
      impact: "$50M+ in loans"
    },
    {
      icon: TreePine,
      title: "Environmental Initiatives",
      description: "Green banking and sustainable practices",
      impact: "100% carbon neutral"
    },
    {
      icon: School,
      title: "Scholarship Programs",
      description: "Helping students achieve their educational dreams",
      impact: "$2M+ awarded"
    }
  ]

  return (
    <section ref={ref} className="pt-20 pb-16 md:pt-24 md:pb-20 lg:pt-28 lg:pb-24 bg-white relative overflow-visible">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Branch Locations Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold mb-4">
            Our Locations
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Serving Communities Nationwide
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            With 350+ branches across the United States and Europe, we're always close to you.
            Visit us at any of our locations for personalized service.
          </p>
        </motion.div>

        {/* Branch Image Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {branchImages.map((img, index) => (
            <motion.div
              key={img}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`rounded-2xl overflow-hidden shadow-lg ${
                index === 0 ? 'col-span-2 row-span-2' : ''
              }`}
            >
              <img
                src={img}
                alt={`OrbitPay Branch Location ${index + 1}`}
                className={`w-full object-cover hover:scale-105 transition-transform duration-500 ${
                  index === 0 ? 'h-64 md:h-full' : 'h-32 md:h-40'
                }`}
              />
            </motion.div>
          ))}
        </div>

        {/* Community Initiatives */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold mb-4">
            Community Impact
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Giving Back to Our Community
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            At OrbitPay, we believe in supporting the communities that support us.
            Through various programs and initiatives, we're making a positive impact.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {initiatives.map((initiative, index) => (
            <motion.div
              key={initiative.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="glass-card p-8 h-full rounded-3xl transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10">
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <initiative.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{initiative.title}</h3>
                    <p className="text-gray-600 mb-4">{initiative.description}</p>
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold">
                      {initiative.impact}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CommunitySection
