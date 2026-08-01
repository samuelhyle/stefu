import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import { Zap, PlayCircle, Flame, Headphones, Menu, X, Radio, ShoppingBag, Video, Mail, ChevronDown, User, Lightbulb, Users, LogOut } from 'lucide-react'
import SearchBar from './SearchBar'
import { useApp } from '../context/AppContext'
import type { ContentItem } from '../types'

interface NavbarProps {
  activeSection: string
  setActiveSection: (section: string) => void
  allContent: ContentItem[]
}

export default function Navbar({ activeSection, setActiveSection, allContent = [] }: NavbarProps) {
  const { user, openSignIn, openSignUp, signOut: handleSignOut, onVideoSelect } = useApp()
  const location = useLocation()
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [watchDropdownOpen, setWatchDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null!)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setWatchDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const watchItems = [
    { id: 'live', label: 'Live', icon: <Zap className="w-4 h-4" /> },
    { id: 'episodes', label: 'Episodes', icon: <PlayCircle className="w-4 h-4" /> },
    { id: 'moments', label: 'Moments', icon: <Flame className="w-4 h-4" /> },
  ]

  const navItems = [
    { id: 'bio', label: 'Bio', icon: <User className="w-4 h-4" /> },
    { id: 'podcasts', label: 'Podcasts', icon: <Headphones className="w-4 h-4" /> },
    { id: 'shop', label: 'Store', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'vlog', label: 'Vlog', icon: <Video className="w-4 h-4" /> },
    { id: 'music', label: 'Music / Radio', icon: <Radio className="w-4 h-4" /> },
    { id: 'tips', label: 'Tips', icon: <Lightbulb className="w-4 h-4" /> },
    { id: 'community', label: 'Community', icon: <Users className="w-4 h-4" /> },
    { id: 'contact', label: 'Contact', icon: <Mail className="w-4 h-4" /> },
  ]

  const scrollToSection = (id: string) => {
    setActiveSection(id)
    setMobileMenuOpen(false)
    if (location.pathname !== '/') {
      navigate(`/#${id}`)
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      })
      return
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-obsidian-400/95 backdrop-blur-lg shadow-2xl border-b border-white/5' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <motion.div
            className="flex items-center cursor-pointer"
            whileHover={{ scale: 1.02 }}
            onClick={() => {
              setMobileMenuOpen(false)
              if (location.pathname === '/') {
                window.scrollTo({ top: 0, behavior: 'smooth' })
              } else {
                navigate('/')
              }
            }}
          >
            <span className="text-3xl font-display font-bold text-gradient">STEFU</span>
            <span className="hidden sm:inline ml-3 text-gold-500 text-xs uppercase tracking-widest font-medium">
              | Live With Stefan
            </span>
          </motion.div>

          <div className="hidden lg:flex items-center space-x-2">
            <div ref={dropdownRef} className="relative">
              <motion.button
                onClick={() => setWatchDropdownOpen(!watchDropdownOpen)}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  watchItems.some(item => activeSection === item.id)
                    ? 'bg-gold-500 text-obsidian-400 shadow-lg shadow-gold-500/30'
                    : 'text-white/80 hover:text-gold-500 hover:bg-white/5'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <PlayCircle className="w-4 h-4" />
                <span>Watch</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${watchDropdownOpen ? 'rotate-180' : ''}`} />
              </motion.button>
              <AnimatePresence>
                {watchDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-48 bg-obsidian-400/95 backdrop-blur-lg rounded-xl shadow-xl border border-white/10 overflow-hidden"
                  >
                    {watchItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => { scrollToSection(item.id); setWatchDropdownOpen(false) }}
                        className={`flex items-center space-x-3 w-full px-4 py-3 text-left transition-colors ${
                          activeSection === item.id
                            ? 'bg-gold-500/20 text-gold-500'
                            : 'text-white/80 hover:text-gold-500 hover:bg-white/5'
                        }`}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeSection === item.id
                    ? 'bg-gold-500 text-obsidian-400 shadow-lg shadow-gold-500/30'
                    : 'text-white/80 hover:text-gold-500 hover:bg-white/5'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.icon}
                <span>{item.label}</span>
              </motion.button>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <SearchBar contents={allContent} onVideoSelect={onVideoSelect} />
            
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 px-3 py-2 rounded-full bg-white/10">
                  <User className="w-4 h-4 text-gold-500" />
                  <span className="text-white/80 text-sm">{user.email?.split('@')[0]}</span>
                </div>
                <motion.button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-colors text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </motion.button>
              </div>
            ) : (
              <>
                <motion.button
                  onClick={openSignIn}
                  className="btn-outline text-sm py-2 px-5"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign In
                </motion.button>
                <motion.button
                  onClick={openSignUp}
                  className="btn-gold text-sm py-2 px-5 shadow-lg shadow-gold-500/30"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Join Inner Circle
                </motion.button>
              </>
            )}
          </div>

          <button
            className="md:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-obsidian-300/95 backdrop-blur-lg border-t border-white/5 max-h-[calc(100dvh-5rem)] overflow-y-auto"
          >
            <div className="px-4 py-4 space-y-3">
              <div className="pb-3 border-b border-white/10">
                <SearchBar contents={allContent} onVideoSelect={onVideoSelect} />
              </div>
              
              <div className="space-y-1">
                <p className="px-4 py-2 text-xs uppercase tracking-wider text-white/40 font-semibold">Watch</p>
                {watchItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-left transition-colors ${
                      activeSection === item.id
                        ? 'bg-gold-500/20 text-gold-500'
                        : 'text-white/80 hover:text-gold-500 hover:bg-white/5'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              <div className="pt-3 space-y-1 border-t border-white/10">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-left transition-colors ${
                      activeSection === item.id
                        ? 'bg-gold-500/20 text-gold-500'
                        : 'text-white/80 hover:text-gold-500 hover:bg-white/5'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
              <div className="pt-4 space-y-3 border-t border-white/10">
                {user ? (
                  <button
                    onClick={() => { handleSignOut(); setMobileMenuOpen(false) }}
                    className="btn-outline w-full"
                  >
                    Sign Out
                  </button>
                ) : (
                  <button
                    onClick={() => { openSignIn(); setMobileMenuOpen(false) }}
                    className="btn-outline w-full"
                  >
                    Sign In
                  </button>
                )}
                <button
                  onClick={() => { openSignUp(); setMobileMenuOpen(false) }}
                  className="btn-gold w-full"
                >
                  Join Inner Circle
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
