import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import VideoCard, { VideoCardSkeleton } from './VideoCard'
import type { ContentItem } from '../types'

interface ContentRowProps {
  title: string
  contents: ContentItem[]
  icon?: React.ReactNode
  loading?: boolean
  onVideoSelect?: (content: ContentItem) => void
}

export default function ContentRow({ title, contents, icon, loading = false, onVideoSelect }: ContentRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null!)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setShowLeftArrow(scrollLeft > 0)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    handleScroll()
    window.addEventListener('resize', handleScroll)
    return () => window.removeEventListener('resize', handleScroll)
  }, [contents])

  return (
    <div className="relative group">
      <div className="flex items-center mb-4 px-4 md:px-8">
        {icon && <span className="mr-3">{icon}</span>}
        <h2 className="section-title mb-0">{title}</h2>
      </div>

      <div className="relative">
        <AnimatePresence>
          {showLeftArrow && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-obsidian-400/90 backdrop-blur-md flex items-center justify-center text-white hover:bg-gold-500 hover:text-obsidian-400 transition-all duration-300 shadow-lg"
              onClick={() => scroll('left')}
            >
              <ChevronLeft className="w-7 h-7" />
            </motion.button>
          )}
        </AnimatePresence>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex space-x-4 overflow-x-auto hide-scrollbar px-4 md:px-8 py-4 scroll-smooth"
        >
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <VideoCardSkeleton key={i} />
            ))
          ) : (
            contents?.map((content, index) => (
              <motion.div
                key={content.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <VideoCard content={content} onSelect={onVideoSelect} />
              </motion.div>
            ))
          )}
        </div>

        <AnimatePresence>
          {showRightArrow && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-obsidian-400/90 backdrop-blur-md flex items-center justify-center text-white hover:bg-gold-500 hover:text-obsidian-400 transition-all duration-300 shadow-lg"
              onClick={() => scroll('right')}
            >
              <ChevronRight className="w-7 h-7" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
