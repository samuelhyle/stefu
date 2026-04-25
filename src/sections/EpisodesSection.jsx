import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Zap, PlayCircle, Clock, TrendingUp, Flame } from 'lucide-react'
import ContentRow from '../components/ContentRow'
import FilterChips from '../components/FilterChips'
import { featuredContent, categoriesContent } from '../data/content'

const FILTER_OPTIONS = [
  { value: 'all', label: 'All', icon: null },
  { value: 'trending', label: 'Trending', icon: <TrendingUp className="w-4 h-4" /> },
  { value: 'exclusive', label: 'Exclusive', icon: <Flame className="w-4 h-4" /> },
  { value: 'lifestyle', label: 'Lifestyle', icon: null },
  { value: 'talks', label: 'Talks', icon: null },
]

const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'recent', label: 'Most Recent' },
  { value: 'duration', label: 'Duration' },
]

export default function EpisodesSection({ onVideoSelect }) {
  const [activeFilter, setActiveFilter] = useState('all')
  const [sortBy, setSortBy] = useState('popular')
  const [showSortMenu, setShowSortMenu] = useState(false)

  const filteredContent = useMemo(() => {
    let allContent = Object.entries(categoriesContent).flatMap(([cat, items]) => 
      items.map(item => ({ ...item, originalCategory: cat }))
    )

    if (activeFilter !== 'all') {
      const filterMap = {
        'trending': 'Trending Now',
        'exclusive': 'Exclusive Talks',
        'lifestyle': 'Lifestyle',
        'talks': 'Talks',
      }
      allContent = allContent.filter(item => 
        item.category?.toLowerCase() === activeFilter || 
        item.originalCategory === filterMap[activeFilter]
      )
    }

    const sortFunctions = {
      popular: (a, b) => (b.views || 0) - (a.views || 0),
      recent: (a, b) => (b.id || 0) - (a.id || 0),
      duration: (a, b) => (a.duration_seconds || 0) - (b.duration_seconds || 0),
    }

    return allContent.sort(sortFunctions[sortBy])
  }, [activeFilter, sortBy])

  const trendingContent = useMemo(() => {
    return [...featuredContent].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5)
  }, [])

  return (
    <section id="episodes" className="py-16 bg-obsidian-400">
      <div className="space-y-8">
        <div className="space-y-4">
          <FilterChips
            options={FILTER_OPTIONS}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
          
          <div className="flex items-center justify-between px-4 md:px-8">
            <div className="flex items-center space-x-2">
              <span className="text-white/40 text-sm">Sort by:</span>
              <div className="relative">
                <button
                  onClick={() => setShowSortMenu(!showSortMenu)}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 text-sm transition-colors"
                >
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{SORT_OPTIONS.find(o => o.value === sortBy)?.label}</span>
                </button>
                
                {showSortMenu && (
                  <div className="absolute top-full left-0 mt-1 bg-obsidian-300 rounded-lg shadow-xl border border-white/10 overflow-hidden z-20">
                    {SORT_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value)
                          setShowSortMenu(false)
                        }}
                        className={`w-full px-4 py-2 text-sm text-left hover:bg-white/10 transition-colors ${
                          sortBy === option.value ? 'text-gold-500' : 'text-white'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <span className="text-white/40 text-sm">
              {filteredContent.length} videos
            </span>
          </div>
        </div>

        {activeFilter === 'all' && (
          <ContentRow
            title="Trending Now"
            icon={<Zap className="w-6 h-6 text-gold-500" />}
            contents={trendingContent}
            onVideoSelect={onVideoSelect}
          />
        )}

        {activeFilter === 'all' ? (
          Object.entries(categoriesContent).slice(0, 3).map(([title, contents]) => (
            <ContentRow
              key={title}
              title={title}
              icon={<PlayCircle className="w-6 h-6 text-gold-500" />}
              contents={contents}
              onVideoSelect={onVideoSelect}
            />
          ))
        ) : (
          <div className="px-4 md:px-8">
            {filteredContent.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredContent.map((content, index) => (
                  <motion.div
                    key={content.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ContentRow
                      title=""
                      contents={[content]}
                      onVideoSelect={onVideoSelect}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <PlayCircle className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <p className="text-white/60">No content found in this category</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}