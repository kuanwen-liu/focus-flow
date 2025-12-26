'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import type { SoundLayer } from '@/types/sound'

interface LayerEditorProps {
  layer: SoundLayer
  onVolumeChange: (layerId: string, volume: number) => void
  onRemove: (layerId: string) => void
  onSolo: (layerId: string) => void
}

export function LayerEditor({ layer, onVolumeChange, onRemove, onSolo }: LayerEditorProps) {
  const [localVolume, setLocalVolume] = useState(Math.round(layer.volume * 100))
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false)

  // Sync local volume when layer volume changes
  useEffect(() => {
    setLocalVolume(Math.round(layer.volume * 100))
  }, [layer.volume])

  const handleVolumeInput = (value: number) => {
    setLocalVolume(value)
  }

  const handleVolumeCommit = () => {
    onVolumeChange(layer.id, localVolume / 100)
  }

  const handleRemove = () => {
    if (showRemoveConfirm) {
      onRemove(layer.id)
      setShowRemoveConfirm(false)
    } else {
      setShowRemoveConfirm(true)
      // Auto-hide confirmation after 3 seconds
      setTimeout(() => setShowRemoveConfirm(false), 3000)
    }
  }

  return (
    <motion.div
      className={`bg-card backdrop-blur-md rounded-xl p-4 border transition-all ${
        layer.solo
          ? 'border-primary shadow-[0_0_15px_rgba(19,182,236,0.2)]'
          : 'border-border'
      } ${!layer.enabled ? 'opacity-50' : ''}`}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-2xl text-primary">
            {layer.soundName.toLowerCase().includes('rain') ? 'rainy' :
             layer.soundName.toLowerCase().includes('thunder') ? 'thunderstorm' :
             layer.soundName.toLowerCase().includes('ocean') || layer.soundName.toLowerCase().includes('waves') ? 'waves' :
             layer.soundName.toLowerCase().includes('wind') ? 'air' :
             layer.soundName.toLowerCase().includes('fire') ? 'fireplace' :
             layer.soundName.toLowerCase().includes('bird') ? 'flutter_dash' :
             layer.soundName.toLowerCase().includes('cricket') ? 'bug_report' :
             layer.soundName.toLowerCase().includes('coffee') ? 'local_cafe' :
             layer.soundName.toLowerCase().includes('singing') || layer.soundName.toLowerCase().includes('bowl') ? 'graphic_eq' :
             layer.soundName.toLowerCase().includes('white') || layer.soundName.toLowerCase().includes('noise') ? 'waves' :
             'music_note'}
          </span>
          <div>
            <h3 className="font-medium text-text-primary">{layer.soundName}</h3>
            <p className="text-xs text-text-secondary">{layer.category}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Solo Button */}
          <motion.button
            onClick={() => onSolo(layer.id)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
              layer.solo
                ? 'bg-primary text-dark shadow-[0_0_10px_rgba(19,182,236,0.3)]'
                : 'bg-background text-text-secondary hover:text-primary hover:bg-primary/10'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Solo
          </motion.button>

          {/* Remove Button */}
          <motion.button
            onClick={handleRemove}
            className={`p-2 rounded-lg transition-all ${
              showRemoveConfirm
                ? 'bg-red-500/20 border border-red-500 text-red-500'
                : 'bg-background text-text-secondary hover:text-red-500 hover:bg-red-500/10'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="material-symbols-outlined text-xl">
              {showRemoveConfirm ? 'check' : 'delete'}
            </span>
          </motion.button>
        </div>
      </div>

      {/* Volume Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-medium text-text-secondary">
          <span>Volume</span>
          <span className="text-primary">{localVolume}%</span>
        </div>
        <div className="relative h-8 flex items-center w-full cursor-pointer group">
          <input
            type="range"
            min="0"
            max="100"
            value={localVolume}
            onInput={(e) => handleVolumeInput(parseInt(e.currentTarget.value))}
            onMouseUp={handleVolumeCommit}
            onTouchEnd={handleVolumeCommit}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            style={{
              WebkitAppearance: 'none',
              appearance: 'none',
              background: 'transparent',
              margin: 0,
              padding: 0,
            }}
          />
          <div className="h-3 w-full rounded-full bg-background overflow-hidden pointer-events-none border border-border">
            <motion.div
              className="h-full bg-gradient-to-r from-primary/80 to-primary transition-all"
              style={{ width: `${localVolume}%` }}
              animate={{ width: `${localVolume}%` }}
            />
          </div>
          {/* Slider Thumb */}
          <div
            className="absolute h-5 w-5 rounded-full bg-primary border-2 border-background shadow-md pointer-events-none transition-all group-hover:scale-110"
            style={{ left: `calc(${localVolume}% - 10px)` }}
          />
        </div>
      </div>
    </motion.div>
  )
}
