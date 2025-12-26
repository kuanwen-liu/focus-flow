'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { SOUND_CATALOG } from '@/lib/constants/sounds'
import type { SoundDefinition } from '@/types/sound'

interface SoundSearchProps {
  onAddSound: (soundId: string) => void
  activeSoundIds: string[]
}

export function SoundSearch({ onAddSound, activeSoundIds }: SoundSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showResults, setShowResults] = useState(false)

  const filteredSounds = searchQuery
    ? SOUND_CATALOG.filter((sound) =>
        sound.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sound.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []

  const handleAddSound = (soundId: string) => {
    onAddSound(soundId)
    setSearchQuery('')
    setShowResults(false)
  }

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-text-secondary text-xl">
          search
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setShowResults(e.target.value.length > 0)
          }}
          onFocus={() => setShowResults(searchQuery.length > 0)}
          placeholder="Search sounds to add..."
          className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-xl text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(19,182,236,0.2)] transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('')
              setShowResults(false)
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && filteredSounds.length > 0 && (
        <motion.div
          className="absolute z-10 w-full mt-2 bg-card border border-border rounded-xl shadow-xl max-h-96 overflow-y-auto"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {filteredSounds.map((sound, index) => {
            const isActive = activeSoundIds.includes(sound.id)

            return (
              <motion.button
                key={sound.id}
                onClick={() => !isActive && handleAddSound(sound.id)}
                className={`w-full px-4 py-3 flex items-center gap-3 border-b border-border last:border-b-0 transition-colors ${
                  isActive
                    ? 'bg-primary/5 cursor-not-allowed'
                    : 'hover:bg-primary/10 cursor-pointer'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                disabled={isActive}
              >
                <span className={`material-symbols-outlined text-2xl ${
                  isActive ? 'text-text-secondary' : 'text-primary'
                }`}>
                  {sound.icon}
                </span>
                <div className="flex-1 text-left">
                  <div className={`font-medium ${
                    isActive ? 'text-text-secondary' : 'text-text-primary'
                  }`}>
                    {sound.name}
                  </div>
                  <div className="text-xs text-text-secondary">{sound.category}</div>
                </div>
                {isActive && (
                  <span className="text-xs text-text-secondary">Already added</span>
                )}
                {!isActive && (
                  <span className="material-symbols-outlined text-primary">add</span>
                )}
              </motion.button>
            )
          })}
        </motion.div>
      )}

      {/* No Results */}
      {showResults && searchQuery && filteredSounds.length === 0 && (
        <motion.div
          className="absolute z-10 w-full mt-2 bg-card border border-border rounded-xl p-4 text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="material-symbols-outlined text-4xl text-text-secondary mb-2">
            search_off
          </span>
          <p className="text-text-secondary">No sounds found</p>
        </motion.div>
      )}
    </div>
  )
}
