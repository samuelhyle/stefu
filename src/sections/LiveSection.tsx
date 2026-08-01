import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Zap, PictureInPicture2, X, ChevronRight, ChevronLeft } from 'lucide-react'
import { useLiveTimeline } from '../hooks/useLiveTimeline'
import VideoPlayer from '../components/VideoPlayer'

export default function LiveSection({ onVideoSelect }: { onVideoSelect?: (content: any) => void }) {
  const { currentTime, currentContent, timeOfDay, isTransitioning, getTimeUntilNext, timeline } = useLiveTimeline()
  const [isMiniPlayer, setIsMiniPlayer] = useState(false)
  const [showMiniPlayerExit, setShowMiniPlayerExit] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 800 && !isMiniPlayer) {
        setShowMiniPlayerExit(true)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMiniPlayer])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })
  }

  if (isMiniPlayer && currentContent) {
    return (
      <VideoPlayer
        src={currentContent.video}
        poster={currentContent.thumbnail}
        autoPlay
        muted
        loop
        isMiniPlayer
        onMiniPlayerExit={() => setIsMiniPlayer(false)}
      />
    )
  }

  return (
    <section id="live" className="py-20 bg-gradient-to-b from-obsidian-300 to-obsidian-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-red-500/20 text-red-500 text-sm font-semibold mb-4">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse mr-2" />
            LIVE STREAM
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Live with Stefan
          </h2>
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto">
            Experience Stefan&apos;s day in real-time — exclusive live content
            as it happens, all day, every day.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="relative rounded-2xl overflow-hidden bg-obsidian-200 shadow-2xl shadow-black/50">
              <AnimatePresence mode="wait">
                {currentContent && (
                  <motion.div
                    key={currentContent.time}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <VideoPlayer
                      src={currentContent.video}
                      poster={currentContent.thumbnail}
                      autoPlay
                      muted
                      loop
                      className="rounded-2xl"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="absolute top-4 left-4 flex items-center space-x-2 z-20">
                <span className="px-3 py-1.5 rounded-full bg-red-500 text-white text-sm font-bold flex items-center shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse mr-2" />
                  LIVE
                </span>
                {currentContent && (
                  <span className="px-3 py-1.5 rounded-full bg-obsidian-400/90 backdrop-blur-sm text-white/90 text-sm font-medium">
                    {currentContent.category}
                  </span>
                )}
              </div>

              {currentContent && (
                <div className="absolute bottom-0 left-0 right-0 p-6 gradient-overlay z-10">
                  <h3 className="text-2xl font-bold text-white mb-1">{currentContent.title}</h3>
                  <p className="text-white/70">{currentContent.description}</p>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="bg-obsidian-200/50 backdrop-blur-sm rounded-2xl p-6 border border-white/5">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-white/50 text-sm mb-1">Current Time</p>
                  <p className="text-4xl font-bold text-gold-500 font-mono">
                    {formatTime(currentTime)}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gold-500/20 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-gold-500" />
                </div>
              </div>

              <div className="bg-obsidian-300/50 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Time of Day</p>
                    <p className="text-xl font-semibold text-white">{timeOfDay}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-gold-500/20 text-gold-500 text-sm font-medium">
                    {getTimeUntilNext() || '--'} until next
                  </span>
                </div>
              </div>

              {showMiniPlayerExit && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full py-3 rounded-xl bg-gold-500 text-obsidian-400 font-semibold text-sm flex items-center justify-center space-x-2 hover:bg-gold-400 transition-colors shadow-lg shadow-gold-500/30"
                  onClick={() => setIsMiniPlayer(true)}
                >
                  <PictureInPicture2 className="w-4 h-4" />
                  <span>Picture in Picture</span>
                </motion.button>
              )}
            </div>

            <div className="bg-obsidian-200/50 backdrop-blur-sm rounded-2xl p-4 border border-white/5">
              <h4 className="text-white font-semibold mb-4 px-2">Today's Timeline</h4>
              <div className="space-y-2">
                {timeline.map((item, index) => {
                  const [hour] = item.time.split(':').map(Number)
                  const currentHour = currentTime.getHours()
                  const isActive = currentHour >= hour && (index === timeline.length - 1 || currentHour < (timeline[index + 1].time.split(':').map(Number)[0]))
                  
                  return (
                    <motion.div
                      key={index}
                      className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 ${
                        isActive 
                          ? 'bg-gold-500/20 border border-gold-500/30 shadow-lg shadow-gold-500/10' 
                          : 'bg-obsidian-300/50 hover:bg-obsidian-300/70'
                      }`}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className={`w-3 h-3 rounded-full ${
                        isActive 
                          ? 'bg-gold-500 shadow-lg shadow-gold-500/50' 
                          : 'bg-white/20'
                      }`} />
                      <span className={`text-sm font-semibold w-12 ${
                        isActive ? 'text-gold-500' : 'text-white/40'
                      }`}>
                        {item.time}
                      </span>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${
                          isActive ? 'text-white' : 'text-white/50'
                        }`}>
                          {item.title}
                        </p>
                      </div>
                      {isActive && (
                        <span className="flex items-center text-xs text-gold-500/70">
                          <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse mr-1" />
                          Now
                        </span>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}