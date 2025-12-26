'use client'

import { FC } from 'react'
import { SoundDefinition, SoundLayer } from '@/types/sound'
import { SoundLayerCard } from './SoundLayerCard'

interface SoundCategoriesCollapsibleProps {
  sounds: SoundDefinition[]
  activeLayers: SoundLayer[]
  onVolumeChange: (soundId: string, volume: number) => void
  onToggleMute: (soundId: string) => void
}

export const SoundCategoriesCollapsible: FC<SoundCategoriesCollapsibleProps> = ({
  sounds,
  activeLayers,
  onVolumeChange,
  onToggleMute,
}) => {
  // Group sounds by category
  const categories = sounds.reduce((acc, sound) => {
    if (!acc[sound.category]) {
      acc[sound.category] = []
    }
    acc[sound.category].push(sound)
    return acc
  }, {} as Record<string, SoundDefinition[]>)

  const getCategoryActiveCount = (category: string) => {
    const categoryActiveLayers = activeLayers.filter((layer) =>
      categories[category].some((sound) => sound.id === layer.soundId && layer.volume > 0)
    )
    return categoryActiveLayers.length
  }

  const getLayerForSound = (soundId: string) => {
    return activeLayers.find((layer) => layer.soundId === soundId)
  }

  return (
    <div className="space-y-8">
      {Object.entries(categories).map(([category, categorySounds]) => {
        const activeCount = getCategoryActiveCount(category)

        return (
          <details key={category} className="group/category" open>
            <summary className="flex items-center gap-3 cursor-pointer mb-4 select-none outline-none">
              <span className="material-symbols-outlined text-gray-400 group-open/category:rotate-90 transition-transform duration-200">
                chevron_right
              </span>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-gray-600 dark:text-gray-300">
                  {category}
                </h4>
                {activeCount > 0 && (
                  <div className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-border text-xs font-medium text-gray-500">
                    {activeCount} active
                  </div>
                )}
              </div>
              <div className="flex-1 h-px bg-gray-200 dark:bg-border ml-2" />
            </summary>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pl-2 sm:pl-8">
              {categorySounds.map((sound) => {
                const layer = getLayerForSound(sound.id)
                const volume = layer?.volume || 0
                const isActive = volume > 0

                return (
                  <SoundLayerCard
                    key={sound.id}
                    sound={sound}
                    volume={volume}
                    isActive={isActive}
                    onVolumeChange={(newVolume) => onVolumeChange(sound.id, newVolume)}
                    onToggleMute={() => onToggleMute(sound.id)}
                  />
                )
              })}

              {/* "Discover More" card placeholder */}
              {categorySounds.length < 10 && (
                <div className="bg-card-light/50 dark:bg-card-dark/50 p-5 rounded-xl border-2 border-dashed border-gray-200 dark:border-border hover:border-primary/50 hover:bg-white dark:hover:bg-card-dark transition-all relative group cursor-pointer flex flex-col items-center justify-center text-center h-full min-h-[160px]">
                  <div className="size-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform duration-300">
                    <span className="material-symbols-outlined !text-[28px]">
                      {category.includes('Nature') ? 'nature' : category.includes('City') ? 'add_location' : 'library_add'}
                    </span>
                  </div>
                  <h4 className="font-bold text-lg text-gray-700 dark:text-gray-200">
                    {category.includes('Nature') ? 'More Nature' : category.includes('City') ? 'More Places' : 'Discover Sounds'}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-[200px]">
                    Find more {category.toLowerCase()} sounds
                  </p>
                </div>
              )}
            </div>
          </details>
        )
      })}
    </div>
  )
}
