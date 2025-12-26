'use client'

import { FC } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SoundLayer } from '@/types/sound'
import { Card } from '@/components/ui/Card'
import { VolumeSlider } from './VolumeSlider'
import { volumeToPercentage } from '@/lib/audio/MasterVolume'

interface ActiveLayersProps {
  layers: SoundLayer[]
  onRemove: (layerId: string) => void
  onVolumeChange: (layerId: string, volume: number) => void
}

export const ActiveLayers: FC<ActiveLayersProps> = ({
  layers,
  onRemove,
  onVolumeChange,
}) => {
  if (layers.length === 0) {
    return (
      <Card className="text-center py-12" glassmorphism={true}>
        <span className="material-symbols-outlined text-6xl text-text-muted mb-4 block">
          library_music
        </span>
        <p className="text-text-secondary">No sounds added yet</p>
        <p className="text-sm text-text-muted mt-2">
          Click on a sound below to add it to your mix
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-text-primary">
          Active Layers ({layers.length}/10)
        </h2>
      </div>

      <AnimatePresence mode="popLayout">
        {layers.map((layer) => (
          <motion.div
            key={layer.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.2 }}
          >
            <Card glassmorphism={true} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-text-primary">
                    {layer.soundName}
                  </h3>
                  <p className="text-sm text-text-muted">{layer.category}</p>
                </div>

                <button
                  onClick={() => onRemove(layer.id)}
                  className="text-text-muted hover:text-red-500 transition-colors"
                  aria-label="Remove layer"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <VolumeSlider
                volume={volumeToPercentage(layer.volume)}
                onChange={(percentage) =>
                  onVolumeChange(layer.id, percentage / 100)
                }
              />
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
