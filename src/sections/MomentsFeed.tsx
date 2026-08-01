import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Play, Heart, Share2, X, ChevronUp, ChevronDown, Volume2, VolumeX } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Pagination, Autoplay } from 'swiper/modules'
import { useMoments } from '../hooks/useMoments'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { useToast } from '../components/Toast'
import VideoPlayer from '../components/VideoPlayer'

import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/pagination'

const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://stefu.com'

export default function MomentsFeed({ onVideoSelect }: { onVideoSelect?: (content: any) => void }) {
  const navigate = useNavigate()
  const toast = useToast()
  const { moments: momentsContent } = useMoments({ limit: 20 })
  const [activeIndex, setActiveIndex] = useState(0)
  const [showFullscreen, setShowFullscreen] = useState(false)
  const [selectedMoment, setSelectedMoment] = useState<any>(null)
  const [isMuted, setIsMuted] = useState(true)
  const [showHints, setShowHints] = useState(true)
  const selectedMomentRef = useRef(selectedMoment)
  const touchStartY = useRef<number | null>(null)
  const prefersReducedMotion = useReducedMotion()
  const fullscreenRef = useFocusTrap(showFullscreen)

  useEffect(() => {
    selectedMomentRef.current = selectedMoment
  }, [selectedMoment])

  useEffect(() => {
    if (showFullscreen && showHints) {
      const timer = setTimeout(() => setShowHints(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [showFullscreen, showHints])

  const openFullscreen = useCallback((moment: any) => {
    const index = momentsContent.findIndex(m => m.id === moment.id)
    setActiveIndex(index >= 0 ? index : 0)
    setSelectedMoment(moment)
    setShowFullscreen(true)
    setShowHints(true)
    document.body.style.overflow = 'hidden'
  }, [])

  const closeFullscreen = useCallback(() => {
    setShowFullscreen(false)
    setSelectedMoment(null)
    document.body.style.overflow = ''
  }, [])

  const goToPrevious = useCallback(() => {
    setActiveIndex(prev => {
      if (prev > 0) {
        const newIndex = prev - 1
        setSelectedMoment(momentsContent[newIndex])
        return newIndex
      }
      return prev
    })
  }, [])

  const goToNext = useCallback(() => {
    setActiveIndex(prev => {
      if (prev < momentsContent.length - 1) {
        const newIndex = prev + 1
        setSelectedMoment(momentsContent[newIndex])
        return newIndex
      }
      return prev
    })
  }, [])

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev)
  }, [])

  const handleShare = useCallback(async (moment: any) => {
    const shareUrl = `${SITE_URL}/watch/${moment.id}`
    const shareData = {
      title: moment.title,
      text: moment.description || `Watch on STEFU`,
      url: shareUrl,
    }
    if (navigator.share) {
      try {
        await navigator.share(shareData)
        return
      } catch (err) {
        if ((err as any).name === 'AbortError') return
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success('Link copied to clipboard')
    } catch {
      toast.error('Could not copy link')
    }
  }, [toast])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return
    
    const touchEndY = e.changedTouches[0].clientY
    const diff = touchStartY.current - touchEndY
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNext()
      } else {
        goToPrevious()
      }
    }
    
    touchStartY.current = null
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showFullscreen) return
      if (e.key === 'Escape') closeFullscreen()
      if (e.key === 'ArrowUp' || e.key === 'k') goToPrevious()
      if (e.key === 'ArrowDown' || e.key === 'j') goToNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showFullscreen, closeFullscreen, goToPrevious, goToNext])

  return (
    <section id="moments" className="py-20 bg-obsidian-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-gold-500/20 text-gold-500 text-sm font-semibold mb-4">
            <span className="text-xl mr-2">🔥</span>
            VIRAL MOMENTS
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Stefan&apos;s Moments
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Quick hits of wisdom, lifestyle, and unfiltered reality —
            engineered to share.
          </p>
        </motion.div>

        <div className="hidden md:block">
          <Swiper
            modules={[FreeMode, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={3}
            freeMode={{
              enabled: true,
              sticky: false,
            }}
            pagination={{
              clickable: true,
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: true,
            }}
            className="pb-12"
          >
            {momentsContent.map((moment, index) => (
              <SwiperSlide key={moment.id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative rounded-2xl overflow-hidden group cursor-pointer aspect-[9/16]"
                  onClick={() => openFullscreen(moment)}
                >
                  <div className="absolute inset-0">
                    <img
                      src={moment.thumbnail}
                      alt={moment.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian-400 via-obsidian-400/30 to-transparent" />
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30">
                    <motion.div
                      animate={prefersReducedMotion ? {} : { scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="w-16 h-16 rounded-full bg-gold-500 flex items-center justify-center shadow-xl shadow-gold-500/50"
                    >
                      <Play className="w-8 h-8 text-obsidian-400 ml-1" />
                    </motion.div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="px-2 py-0.5 rounded bg-white/20 backdrop-blur-sm text-white/90 text-xs font-medium">
                        {moment.duration}
                      </span>
                      <span className="flex items-center text-white/70 text-xs">
                        <Heart className="w-3 h-3 mr-1" />
                        {moment.likes}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">{moment.title}</h3>
                    <p className="text-white/60 text-sm line-clamp-2">{moment.description}</p>
                  </div>

                  <button
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-obsidian-400/80 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-gold-500 hover:text-obsidian-400"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleShare(moment)
                    }}
                    aria-label={`Share ${moment.title}`}
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="md:hidden grid grid-cols-2 gap-4">
          {momentsContent.map((moment, index) => (
            <motion.div
              key={moment.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative rounded-xl overflow-hidden group cursor-pointer aspect-[9/16]"
              onClick={() => openFullscreen(moment)}
            >
              <img
                src={moment.thumbnail}
                alt={moment.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian-400 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <span className="text-xs text-white/70 mb-1 block">{moment.duration}</span>
                <h3 className="text-sm font-bold text-white">{moment.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <motion.button
            onClick={() => navigate('/moments')}
            className="btn-outline text-lg px-10 py-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View All Moments
          </motion.button>
        </motion.div>
      </div>

      <AnimatePresence>
        {showFullscreen && selectedMoment && (
          <motion.div
            ref={fullscreenRef}
            role="dialog"
            aria-modal="true"
            aria-label={selectedMoment.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <button
              onClick={closeFullscreen}
              className="absolute top-4 right-4 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              aria-label="Close fullscreen"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors disabled:opacity-30"
              disabled={activeIndex === 0}
              aria-label="Previous moment"
            >
              <ChevronUp className="w-8 h-8" />
            </button>

            <button
              onClick={goToNext}
              className="absolute left-20 top-1/2 -translate-y-1/2 z-50 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors disabled:opacity-30"
              disabled={activeIndex === momentsContent.length - 1}
              aria-label="Next moment"
            >
              <ChevronDown className="w-8 h-8" />
            </button>

            {showHints && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 text-center pointer-events-none"
              >
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="text-white/50 text-sm flex flex-col items-center"
                >
                  <ChevronUp className="w-6 h-6 mb-2" />
                  <span>Swipe up for next</span>
                </motion.div>
              </motion.div>
            )}

            <div className="w-full max-w-lg aspect-[9/16]">
              <VideoPlayer
                key={selectedMoment.id}
                src={selectedMoment.video}
                poster={selectedMoment.thumbnail}
                autoPlay
                muted={isMuted}
                loop
                showControls
              />
            </div>

            <div className="absolute bottom-8 left-0 right-0 p-6 text-center">
              <h3 className="text-2xl font-bold text-white mb-2">{selectedMoment.title}</h3>
              <p className="text-white/70 mb-4">{selectedMoment.description}</p>
              <div className="flex items-center justify-center space-x-6">
                <button className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors">
                  <Heart className="w-5 h-5" />
                  <span>{selectedMoment.likes}</span>
                </button>
                <button
                  className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors"
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => handleShare(selectedMoment)}
                  className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors"
                  aria-label={`Share ${selectedMoment.title}`}
                >
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-1.5">
              {momentsContent.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === activeIndex ? 'bg-gold-500 w-4' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}