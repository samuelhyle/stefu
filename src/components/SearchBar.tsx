import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Clock, TrendingUp } from 'lucide-react'
import type { ContentItem } from '../types'

const SEARCH_HISTORY_KEY = 'stefu_search_history'
const MAX_HISTORY = 5

interface SearchBarProps {
  contents?: ContentItem[]
  onVideoSelect?: (item: ContentItem) => void
}

export default function SearchBar({ contents = [], onVideoSelect }: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ContentItem[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null!)
  const containerRef = useRef<HTMLDivElement>(null!)

  useEffect(() => {
    const saved = localStorage.getItem(SEARCH_HISTORY_KEY)
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const searchContent = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    const lower = searchQuery.toLowerCase()
    const matches = (contents as ContentItem[])
      .filter(content => 
        content.title?.toLowerCase().includes(lower) ||
        content.description?.toLowerCase().includes(lower) ||
        content.category?.toLowerCase().includes(lower)
      )
      .slice(0, 6)
    
    setResults(matches)
    setSelectedIndex(-1)
  }, [contents])

  useEffect(() => {
    const timer = setTimeout(() => {
      searchContent(query)
    }, 150)
    return () => clearTimeout(timer)
  }, [query, searchContent])

  const saveSearch = (term: string) => {
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, MAX_HISTORY)
    setRecentSearches(updated)
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated))
  }

  const handleSelect = (item: ContentItem | { type: string; term: string }) => {
    if ('type' in item && item.type === 'history') {
      setQuery(item.term)
      searchContent(item.term)
    } else {
      saveSearch(query)
      setIsOpen(false)
      setQuery('')
      onVideoSelect?.(item as ContentItem)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const historyMatches = recentSearches.filter(s => s.includes(query))
    const totalItems = results.length + historyMatches.length
    
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => (prev + 1) % Math.max(totalItems, 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => (prev - 1 + Math.max(totalItems, 1)) % Math.max(totalItems, 1))
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault()
      const historyIndex = selectedIndex - results.length
      if (historyIndex >= 0 && historyMatches[historyIndex]) {
        handleSelect({ type: 'history', term: historyMatches[historyIndex] })
      } else if (results[selectedIndex]) {
        handleSelect(results[selectedIndex])
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }

  const clearHistory = () => {
    setRecentSearches([])
    localStorage.removeItem(SEARCH_HISTORY_KEY)
  }

  const showDropdown = isOpen && (query.length > 0 || recentSearches.length > 0)
  const filteredHistory = recentSearches.filter(s => s.toLowerCase().includes(query.toLowerCase()))

  return (
    <div ref={containerRef} className="relative">
      <div className={`flex items-center rounded-full transition-all duration-300 ${
        isFocused ? 'bg-obsidian-200 ring-2 ring-gold-500/50' : 'bg-obsidian-300/50'
      }`}>
        <Search className="w-5 h-5 text-white/40 ml-4" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { setIsFocused(true); setIsOpen(true) }}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder="Search videos, moments..."
          className="w-48 md:w-64 lg:w-80 px-4 py-2.5 bg-transparent text-white placeholder-white/40 focus:outline-none text-sm"
          aria-label="Search content"
          aria-expanded={showDropdown}
          aria-controls="search-results"
          role="combobox"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); inputRef.current?.focus() }}
            className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white mr-1"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            id="search-results"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-obsidian-300 rounded-xl shadow-2xl border border-white/10 overflow-hidden z-50"
            role="listbox"
          >
            {results.length > 0 && (
              <div className="p-2">
                <div className="text-xs text-white/40 px-3 py-1 uppercase tracking-wider">
                  Results
                </div>
                {results.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                      selectedIndex === index ? 'bg-gold-500/20 text-gold-500' : 'text-white hover:bg-white/5'
                    }`}
                    role="option"
                    aria-selected={selectedIndex === index}
                  >
                    <Search className="w-4 h-4 text-white/30 flex-shrink-0" />
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-sm font-medium truncate">{item.title}</p>
                      <p className="text-xs text-white/50">{item.category} • {item.duration}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {filteredHistory.length > 0 && query && (
              <div className="p-2 border-t border-white/5">
                <div className="flex items-center justify-between px-3 py-1">
                  <div className="text-xs text-white/40 uppercase tracking-wider flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    Recent
                  </div>
                  <button
                    onClick={clearHistory}
                    className="text-xs text-white/30 hover:text-white/60"
                  >
                    Clear
                  </button>
                </div>
                {filteredHistory.map((term, index) => (
                  <button
                    key={term}
                    onClick={() => handleSelect({ type: 'history', term })}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      selectedIndex === results.length + index ? 'bg-gold-500/20 text-gold-500' : 'text-white hover:bg-white/5'
                    }`}
                    role="option"
                  >
                    <TrendingUp className="w-4 h-4 text-white/30 flex-shrink-0" />
                    <span className="text-sm">{term}</span>
                  </button>
                ))}
              </div>
            )}

            {query && results.length === 0 && filteredHistory.length === 0 && (
              <div className="p-6 text-center">
                <p className="text-white/50 text-sm">No results for "{query}"</p>
                <p className="text-white/30 text-xs mt-1">Try searching for something else</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
