import { motion } from 'framer-motion'
import { Play, Eye, X } from 'lucide-react'
import { useState } from 'react'

interface VideoCardProps {
  content: any
  size?: 'small' | 'normal' | 'large' | 'featured'
  onSelect?: (content: any) => void
}

export default function VideoCard({ content, size = 'normal', onSelect }: VideoCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const sizeClasses = {
    small: 'w-40 sm:w-48 flex-shrink-0',
    normal: 'w-52 sm:w-64 flex-shrink-0',
    large: 'w-72 sm:w-80 flex-shrink-0',
    featured: 'flex-1 min-w-96',
  }

  return (
    <motion.div
      className={`${sizeClasses[size]} group cursor-pointer`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
      onClick={() => onSelect?.(content)}
    >
      <div className="relative rounded-xl overflow-hidden bg-obsidian-200">
        <div className="aspect-video relative">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-obsidian-200 animate-pulse" />
          )}
          <img
            src={content.thumbnail}
            alt={content.title}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              isHovered ? 'scale-110' : ''
            } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
          
          <div className={`absolute inset-0 bg-obsidian-400/60 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="w-16 h-16 rounded-full bg-gold-500 flex items-center justify-center shadow-lg shadow-gold-500/50"
              >
                <Play className="w-8 h-8 text-obsidian-400 ml-1" />
              </motion.div>
            </div>
          </div>

          <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-obsidian-400/90 backdrop-blur-sm text-xs text-white/80 font-medium">
            {content.duration}
          </div>
          
          <div className="absolute top-2 left-2 px-2 py-1 rounded bg-gold-500/90 text-xs text-obsidian-400 font-semibold uppercase tracking-wide">
            {content.category}
          </div>
        </div>

        <div className="p-4 bg-obsidian-300">
          <h3 className="text-white font-semibold text-sm mb-1 truncate group-hover:text-gold-500 transition-colors">
            {content.title}
          </h3>
          <div className="flex items-center space-x-3 text-white/50 text-xs">
            <span className="flex items-center">
              <Eye className="w-3 h-3 mr-1" />
              {content.views}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function VideoCardSkeleton({ size = 'normal' }) {
  const sizeClasses: Record<string, string> = {
    small: 'w-40 sm:w-48 flex-shrink-0',
    normal: 'w-52 sm:w-64 flex-shrink-0',
    large: 'w-72 sm:w-80 flex-shrink-0',
    featured: 'flex-1 min-w-96',
  }

  return (
    <div className={`${sizeClasses[size]}`}>
      <div className="rounded-xl overflow-hidden bg-obsidian-200">
        <div className="aspect-video bg-obsidian-200 animate-pulse" />
        <div className="p-4 bg-obsidian-300 space-y-2">
          <div className="h-4 bg-obsidian-200 rounded animate-pulse w-3/4" />
          <div className="h-3 bg-obsidian-200 rounded animate-pulse w-1/2" />
        </div>
      </div>
    </div>
  )
}