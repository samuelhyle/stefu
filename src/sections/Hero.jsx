import { motion } from 'framer-motion'
import { Play, PlayCircle } from 'lucide-react'

export default function Hero({ onWatchLive, onExplore }) {
  return (
    <section className="relative h-screen overflow-hidden" id="hero">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-obsidian-400/60 to-obsidian-400 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian-400/80 via-transparent to-obsidian-400/50 z-10" />
        <div className="absolute inset-0 bg-obsidian-400" />
        <img
          src="https://images.unsplash.com/photo-1517963626746-2e20b1a1a63c?w=1920&q=80"
          alt="Stefan Therman"
          className="w-full h-full object-cover opacity-60"
        />
      </div>

      <div className="relative z-20 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-6"
            >
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-gold-500/20 text-gold-500 text-sm font-semibold backdrop-blur-sm border border-gold-500/30 shadow-lg shadow-gold-500/20">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse mr-2" />
                LIVE NOW
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl md:text-8xl font-display font-bold mb-6 leading-none tracking-tight"
            >
              <span className="text-white">STEFAN</span>
              <br />
              <span className="text-gradient">THERMAN</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-white/70 mb-4 font-light"
            >
              Power. Presence. Lifestyle.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-lg text-white/50 mb-10 max-w-xl leading-relaxed"
            >
              Experience the life of Finland's legendary figure. Exclusive content, 
              unfiltered moments, and an inside look at the legend himself.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <motion.button
                className="btn-gold text-lg px-8 py-4 flex items-center space-x-3 shadow-xl shadow-gold-500/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onWatchLive}
              >
                <Play className="w-5 h-5" />
                <span>Watch Live</span>
              </motion.button>
              <motion.button
                className="btn-outline text-lg px-8 py-4 flex items-center space-x-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onExplore}
              >
                <PlayCircle className="w-5 h-5" />
                <span>Explore Content</span>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="w-8 h-14 rounded-full border-2 border-white/30 flex items-start justify-center p-2"
        >
          <div className="w-1.5 h-3 bg-white/60 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  )
}