import { motion } from 'framer-motion'
import { Home, Zap, PlayCircle, Flame, ShoppingBag } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'live', label: 'Live', icon: Zap },
  { id: 'episodes', label: 'Episodes', icon: PlayCircle },
  { id: 'moments', label: 'Moments', icon: Flame },
  { id: 'shop', label: 'Store', icon: ShoppingBag },
]

const SECTION_IDS = ['live', 'episodes', 'moments', 'shop']

export default function BottomNav() {
  const [activeTab, setActiveTab] = useState('home')
  const [showNav, setShowNav] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        setShowNav(false)
      } else {
        setShowNav(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible.length > 0) {
          setActiveTab(visible[0].target.id)
        }
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    )

    SECTION_IDS.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const scrollToSection = useCallback((id: string) => {
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: showNav ? 0 : 100 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-obsidian-300/95 backdrop-blur-lg border-t border-white/10 safe-area-inset-bottom"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id

          return (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`flex flex-col items-center justify-center w-16 h-14 rounded-xl transition-colors ${
                isActive ? 'text-gold-500' : 'text-white/50'
              }`}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <motion.div
                whileTap={{ scale: 0.85 }}
                className={`relative`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gold-500"
                  />
                )}
                <Icon className={`w-6 h-6 ${isActive ? '' : ''}`} />
              </motion.div>
              <span className={`text-xs mt-1 ${isActive ? 'font-semibold' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </motion.div>
  )
}
