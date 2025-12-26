'use client'

import { FC, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SoundDefinition, SoundCategory } from '@/types/sound'
import { SoundCard } from './SoundCard'

interface SoundCategoriesProps {
  sounds: SoundDefinition[]
  onAddSound: (soundId: string) => void
  loadingStates: Record<string, boolean>
  disabledSounds: string[]
}

export const SoundCategories: FC<SoundCategoriesProps> = ({
  sounds,
  onAddSound,
  loadingStates,
  disabledSounds,
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<SoundCategory>>(
    new Set(['Nature Sounds', 'City & Ambience', 'White Noise & Focus'])
  )

  const categories: SoundCategory[] = ['Nature Sounds', 'City & Ambience', 'White Noise & Focus']

  const toggleCategory = (category: SoundCategory) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(category)) {
        newSet.delete(category)
      } else {
        newSet.add(category)
      }
      return newSet
    })
  }

  const getSoundsForCategory = (category: SoundCategory) => {
    return sounds.filter((sound) => sound.category === category)
  }

  return (
    <div className="space-y-4">
      {categories.map((category) => {
        const categorySounds = getSoundsForCategory(category)
        const isExpanded = expandedCategories.has(category)

        return (
          <div key={category} className="space-y-3">
            <button
              onClick={() => toggleCategory(category)}
              className="flex items-center justify-between w-full text-left group"
            >
              <h2 className="text-lg font-semibold text-text-primary group-hover:text-primary transition-colors">
                {category}
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-text-muted">
                  {categorySounds.length} sounds
                </span>
                <motion.span
                  className="material-symbols-outlined text-text-secondary"
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  expand_more
                </motion.span>
              </div>
            </button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {categorySounds.map((sound) => (
                      <SoundCard
                        key={sound.id}
                        sound={sound}
                        onAdd={onAddSound}
                        isLoading={loadingStates[sound.id]}
                        disabled={disabledSounds.includes(sound.id)}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
