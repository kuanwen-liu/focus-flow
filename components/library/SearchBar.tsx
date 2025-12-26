'use client'

import { motion } from 'framer-motion'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchBar({ value, onChange, placeholder = 'Search mixes...' }: SearchBarProps) {
  return (
    <motion.div
      className="relative w-full"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-text-secondary text-xl">
        search
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-xl text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(19,182,236,0.2)] transition-all"
      />
      {value && (
        <motion.button
          onClick={() => onChange('')}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </motion.button>
      )}
    </motion.div>
  )
}
