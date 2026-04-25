import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Share2, Heart, Clock, Eye, Lock, Check } from 'lucide-react'
import VideoPlayer from './VideoPlayer'
import { useFocusTrap } from '../hooks/useFocusTrap'

export default function VideoModal({ 
  video, 
  isOpen, 
  onClose, 
  isPremium = false,
  onAuthRequired 
}) {
  const [showCopyNotification, setShowCopyNotification] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const dialogRef = useFocusTrap(isOpen)

  const handleShare = useCallback(async () => {
    const shareUrl = `${window.location.origin}/watch/${video?.id}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: video?.title,
          text: video?.description || `Watch ${video?.title} on stefu.com`,
          url: shareUrl,
        })
      } catch (err) {
        if (err.name !== 'AbortError') {
          copyToClipboard(shareUrl)
        }
      }
    } else {
      copyToClipboard(shareUrl)
    }
  }, [video])

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setShowCopyNotification(true)
    setTimeout(() => setShowCopyNotification(false), 2000)
  }

  const handleLike = () => {
    if (!isLiked) {
      setIsLiked(true)
    }
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!video) return null

  const formatDuration = (seconds) => {
    if (!seconds) return ''
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={video.title || 'Video'}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-5xl bg-obsidian-300 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              aria-label="Close video"
              className="absolute top-4 right-4 z-50 w-12 h-12 rounded-full bg-obsidian-400/80 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="aspect-video bg-black">
              {isPremium ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="w-20 h-20 rounded-full bg-gold-500/20 flex items-center justify-center mb-6">
                    <Lock className="w-10 h-10 text-gold-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Premium Content</h3>
                  <p className="text-white/60 mb-6 max-w-md">
                    This content is exclusive to Inner Circle members. Join today to unlock full access.
                  </p>
                  <div className="flex space-x-4">
                    <button
                      onClick={onAuthRequired}
                      className="btn-gold px-8 py-3"
                    >
                      Join Inner Circle
                    </button>
                    <button
                      onClick={onClose}
                      className="btn-outline px-8 py-3"
                    >
                      Maybe Later
                    </button>
                  </div>
                </div>
              ) : (
                <VideoPlayer
                  src={video.streamUrl || video.video}
                  poster={video.thumbnail}
                  autoPlay
                  muted={false}
                  loop={false}
                  showControls
                  className="rounded-none"
                />
              )}
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="px-3 py-1 rounded-full bg-gold-500/20 text-gold-500 text-sm font-medium">
                      {video.category}
                    </span>
                    {video.is_premium && (
                      <span className="px-3 py-1 rounded-full bg-white/10 text-white/70 text-sm font-medium">
                        Premium
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">{video.title}</h2>
                  <div className="flex items-center space-x-4 text-white/50 text-sm">
                    {video.views && (
                      <span className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {video.views >= 1000000 
                          ? `${(video.views / 1000000).toFixed(1)}M` 
                          : video.views >= 1000 
                            ? `${(video.views / 1000).toFixed(1)}K` 
                            : video.views}
                      </span>
                    )}
                    {video.duration && (
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatDuration(video.duration)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleLike}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                      isLiked 
                        ? 'bg-red-500 text-white' 
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleShare}
                    className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors relative"
                  >
                    <Share2 className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {video.description && (
                <p className="text-white/70 leading-relaxed">{video.description}</p>
              )}

              {showCopyNotification && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute bottom-24 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-green-500 text-white text-sm font-medium flex items-center space-x-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Link copied to clipboard</span>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}