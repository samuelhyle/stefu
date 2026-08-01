import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, ChevronRight, Crown, Mail, Volume2, VolumeX } from 'lucide-react'

interface WelcomePageProps {
  onEnter: () => void
  onLogin: () => void
  onRegister: () => void
}

export default function WelcomePage({ onEnter, onLogin, onRegister }: WelcomePageProps) {
  const [showContent, setShowContent] = useState(false)
  const [currentTagline, setCurrentTagline] = useState(0)
  const [isMuted, setIsMuted] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  
  const taglines = [
    "Welcome to Stefan Therman's World",
    "Where Legends Are Built",
    "Discipline. Power. Legacy.",
    "The Standard Has a Name"
  ]

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTagline((prev) => (prev + 1) % taglines.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (showContent && audioRef.current) {
      audioRef.current.volume = 0.5
    }
  }, [showContent])

  const enableSound = () => {
    if (audioRef.current) {
      audioRef.current.muted = false
      audioRef.current.play().catch(() => {})
      setIsMuted(false)
      setSoundEnabled(true)
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-obsidian-400 overflow-hidden">
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          src="/welcome-video.mp4"
          autoPlay
          muted={true}
          loop
          playsInline
          poster="/stefu_one.png"
          className="w-full h-full object-cover"
          style={{ zIndex: 1 }}
          onError={() => {}}
        />
        <div 
          className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90" 
          style={{ zIndex: 2 }}
        />
      </div>

      <audio
        ref={audioRef}
        src="/undertaker-theme.mp3"
        loop
        preload="auto"
      />

      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
        <AnimatePresence>
          {showContent && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="mb-8"
              >
                <div className="text-8xl md:text-9xl font-display font-bold text-gradient mb-2">
                  STEFU
                </div>
                <motion.div
                  key={currentTagline}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-xl md:text-2xl text-white/60 uppercase tracking-widest"
                >
                  {taglines[currentTagline]}
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mb-12"
              >
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-red-500/20 text-red-500 text-sm font-semibold">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse mr-2" />
                  LIVE NOW
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="space-y-4"
              >
                <motion.button
                  onClick={onEnter}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full max-w-md mx-auto flex items-center justify-center space-x-3 px-8 py-4 rounded-xl bg-gold-500 text-obsidian-400 font-bold text-lg shadow-lg shadow-gold-500/30 hover:bg-gold-400 transition-colors"
                >
                  <Play className="w-5 h-5" />
                  <span>Enter the Legend&apos;s World</span>
                  <ChevronRight className="w-5 h-5" />
                </motion.button>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
                  <button
                    onClick={onLogin}
                    className="flex items-center space-x-2 px-6 py-3 rounded-xl border border-white/20 text-white/80 hover:text-white hover:border-white/40 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Sign In</span>
                  </button>
                  <button
                    onClick={onRegister}
                    className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
                  >
                    <Crown className="w-4 h-4" />
                    <span>Join Inner Circle</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-0 right-0 text-center"
        >
          <p className="text-white/30 text-sm mb-4">
            Push it to the limit • Undertaker Remix
          </p>
          {!soundEnabled ? (
            <motion.button
              onClick={enableSound}
              whileTap={{ scale: 0.9 }}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gold-500/20 hover:bg-gold-500/30 text-gold-500 border border-gold-500/30 transition-colors"
            >
              <Volume2 className="w-4 h-4" />
              <span className="text-xs">Enable Sound</span>
            </motion.button>
          ) : (
            <motion.button
              onClick={toggleMute}
              whileTap={{ scale: 0.9 }}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-colors"
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span className="text-xs">Sound Off</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span className="text-xs">Sound On</span>
                </>
              )}
            </motion.button>
          )}
        </motion.div>
      </div>
    </div>
  )
}
