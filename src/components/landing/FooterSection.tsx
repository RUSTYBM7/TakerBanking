import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react'
import { BrandLogo } from '@/components/branding/BrandLogo'

const FooterSection = () => {
  const navigate = useNavigate()

  const footerLinks = {
    products: [
      { name: "Savings Accounts", href: "#" },
      { name: "Checking Accounts", href: "#" },
      { name: "Credit Cards", href: "#" },
      { name: "Loans", href: "#" },
      { name: "Investments", href: "#" },
      { name: "Insurance", href: "#" }
    ],
    company: [
      { name: "About Us", href: "#" },
      { name: "Careers", href: "#" },
      { name: "News & Blog", href: "#" },
      { name: "Press Room", href: "#" },
      { name: "Community", href: "#" }
    ],
    support: [
      { name: "Help Center", href: "#" },
      { name: "Contact Us", href: "#" },
      { name: "Find a Branch", href: "#" },
      { name: "ATM Locations", href: "#" },
      { name: "FAQs", href: "#" }
    ],
    legal: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Accessibility", href: "#" },
      { name: "FDIC Insurance", href: "#" },
      { name: "Security", href: "#" }
    ]
  }

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" }
  ]

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <BrandLogo variant="footer" className="max-w-[180px]" />
            </div>

            {/* Featured Poster Banner */}
            <img
              src="/assets/images/poster-banner.jpg"
              alt="OrbitPay Finance - Banking Without Borders"
              className="rounded-xl shadow-lg mb-6 w-full max-w-xs"
            />

            <p className="text-gray-400 mb-6 max-w-sm">
              Your trusted credit union partner for over 75 years. Building stronger
              communities through better banking.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-emerald-400" />
                <span>123 Financial Way, Suite 100</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-emerald-400" />
                <span>1-800-ORBITPAY</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-emerald-400" />
                <span>support@orbitpay.com</span>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="text-white font-semibold mb-4">Products</h4>
            <ul className="space-y-3">
              {footerLinks.products.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="hover:text-emerald-400 transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="hover:text-emerald-400 transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="hover:text-emerald-400 transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="hover:text-emerald-400 transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <p className="text-sm text-gray-400">
                © 2024 OrbitPay Credit Union. All rights reserved.
              </p>
              <div className="hidden md:flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-emerald-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">NCUA</span>
                </div>
                <span className="text-sm text-gray-400">FDIC Insured</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-emerald-500 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <div>© 2026 OrbitPay Credit Union. All rights reserved. Member NCUA. Insured by NCUA up to $250,000.</div>
          <div className="font-mono opacity-60">build {import.meta.env.VITE_BUILD_SHA || 'dev'} · {new Date().toISOString().slice(0,10)}</div>
        </div>
      </div>
    </footer>
  )
}

export default FooterSection
