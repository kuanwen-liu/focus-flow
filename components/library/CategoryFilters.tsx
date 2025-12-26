'use client'

import { motion } from 'framer-motion'

export type FilterCategory = 'All' | 'Focus' | 'Sleep' | 'Nature' | 'Favorites'

interface CategoryFiltersProps {
  activeCategory: FilterCategory
  onCategoryChange: (category: FilterCategory) => void
}

const categories: FilterCategory[] = ['All', 'Focus', 'Sleep', 'Nature', 'Favorites']

const categoryIcons: Record<FilterCategory, string> = {
  All: 'grid_view',
  Focus: 'psychology',
  Sleep: 'bedtime',
  Nature: 'forest',
  Favorites: 'favorite'
}

export function CategoryFilters({ activeCategory, onCategoryChange }: CategoryFiltersProps) {
  return (
    <motion.div
      className="flex flex-wrap gap-2"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      {categories.map((category) => {
        const isActive = activeCategory === category

        return (
          <motion.button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              isActive
                ? 'bg-primary text-dark shadow-[0_0_15px_rgba(19,182,236,0.3)]'
                : 'bg-card border border-border text-text-secondary hover:border-primary hover:text-primary'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="material-symbols-outlined text-lg">
              {categoryIcons[category]}
            </span>
            <span className="text-sm">{category}</span>
          </motion.button>
        )
      })}
    </motion.div>
  )
}
