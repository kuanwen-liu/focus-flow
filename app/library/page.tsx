'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useMixStore } from '@/lib/state/useMixStore'
import { useAudioStore } from '@/lib/state/useAudioStore'
import { MixCard } from '@/components/library/MixCard'
import { SearchBar } from '@/components/library/SearchBar'
import { CategoryFilters, FilterCategory } from '@/components/library/CategoryFilters'
import type { Mix } from '@/types/mix'

export default function LibraryPage() {
  const router = useRouter()
  const [isHydrated, setIsHydrated] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('All')

  const mixes = useMixStore((state) => state.mixes)
  const currentMixId = useMixStore((state) => state.currentMixId)
  const deleteMix = useMixStore((state) => state.deleteMix)
  const setCurrentMix = useMixStore((state) => state.setCurrentMix)

  // Audio state (to check if playing)
  const isPlaying = useAudioStore((state) => state.isPlaying)

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Filter mixes based on search and category
  const filteredMixes = isHydrated
    ? mixes.filter((mix) => {
        // Search filter
        const matchesSearch =
          searchQuery === '' ||
          mix.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          mix.layers.some((layer) =>
            layer.soundName.toLowerCase().includes(searchQuery.toLowerCase())
          )

        // Category filter
        const matchesCategory =
          activeCategory === 'All' ||
          mix.tags.some((tag) => tag.toLowerCase() === activeCategory.toLowerCase())

        return matchesSearch && matchesCategory
      })
    : []

  const handlePlay = (mixId: string) => {
    // Set as current mix
    setCurrentMix(mixId)

    // Navigate to mixer with the mix loaded
    router.push(`/mixer?mixId=${mixId}`)
  }

  const handleEdit = (mixId: string) => {
    router.push(`/edit/${mixId}`)
  }

  const handleDelete = (mixId: string) => {
    deleteMix(mixId)
  }

  const handleCreateNew = () => {
    router.push('/mixer')
  }

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-text-secondary">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-text-primary mb-2">My Mixes</h1>
          <p className="text-text-secondary mb-8">
            Your saved ambient sound mixes
          </p>
        </motion.div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search mixes by name or sounds..."
          />
          <CategoryFilters
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>

        {/* Action Buttons */}
        <div className="mb-8 flex flex-wrap gap-3">
          <motion.button
            onClick={handleCreateNew}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-dark rounded-xl font-medium hover:shadow-[0_0_20px_rgba(19,182,236,0.4)]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <span className="material-symbols-outlined text-xl">add</span>
            Create New Mix
          </motion.button>
          <motion.button
            onClick={() => router.push('/mixer')}
            className="flex items-center gap-2 px-6 py-3 bg-background border border-border text-text-primary rounded-xl font-medium hover:border-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.25 }}
          >
            <span className="material-symbols-outlined text-xl">arrow_back</span>
            Return to Mixer
          </motion.button>
        </div>

        {/* Mixes Grid */}
        {filteredMixes.length === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <span className="material-symbols-outlined text-6xl text-text-secondary mb-4">
              library_music
            </span>
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              {searchQuery || activeCategory !== 'All'
                ? 'No mixes found'
                : 'No mixes saved yet'}
            </h3>
            <p className="text-text-secondary mb-6 text-center max-w-md">
              {searchQuery || activeCategory !== 'All'
                ? 'Try adjusting your search or filters'
                : 'Create your first ambient sound mix to get started'}
            </p>
            {!searchQuery && activeCategory === 'All' && (
              <motion.button
                onClick={handleCreateNew}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-dark rounded-xl font-medium hover:shadow-[0_0_20px_rgba(19,182,236,0.4)]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="material-symbols-outlined text-xl">add</span>
                Create Your First Mix
              </motion.button>
            )}
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {filteredMixes.map((mix, index) => (
              <motion.div
                key={mix.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
              >
                <MixCard
                  mix={mix}
                  isPlaying={currentMixId === mix.id && isPlaying}
                  onPlay={handlePlay}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
