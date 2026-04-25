import { motion } from 'framer-motion'
import { useCallback } from 'react'

export default function FilterChips({ options = [], activeFilter, onFilterChange, label }) {
  return (
    <div className="flex items-center space-x-2 px-4 md:px-8 overflow-x-auto hide-scrollbar py-2">
      {label && (
        <span className="text-white/40 text-sm font-medium whitespace-nowrap">{label}</span>
      )}
      {options.map((option) => {
        const isActive = activeFilter === option.value
        return (
          <motion.button
            key={option.value}
            onClick={() => onFilterChange(option.value)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              isActive
                ? 'bg-gold-500 text-obsidian-400 shadow-lg shadow-gold-500/30'
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
            }`}
            aria-pressed={isActive}
          >
            {option.icon && <span className="mr-2">{option.icon}</span>}
            {option.label}
          </motion.button>
        )
      })}
    </div>
  )
}