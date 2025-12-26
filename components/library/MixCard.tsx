'use client'

import { Mix } from '@/types/mix'
import { motion } from 'framer-motion'
import { useState } from 'react'

interface MixCardProps {
  mix: Mix
  isPlaying?: boolean
  onPlay?: (mixId: string) => void
  onDelete?: (mixId: string) => void
  onEdit?: (mixId: string) => void
}

export function MixCard({ mix, isPlaying = false, onPlay, onDelete, onEdit }: MixCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleDelete = () => {
    if (showDeleteConfirm && onDelete) {
      onDelete(mix.id)
      setShowDeleteConfirm(false)
    } else {
      setShowDeleteConfirm(true)
      // Auto-hide confirmation after 3 seconds
      setTimeout(() => setShowDeleteConfirm(false), 3000)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <motion.div
      className={`relative bg-card backdrop-blur-md rounded-xl p-6 border transition-colors ${
        isPlaying
          ? 'border-primary shadow-[0_0_20px_rgba(19,182,236,0.3)]'
          : 'border-border hover:border-border-darker'
      }`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* Now Playing Badge */}
      {isPlaying && (
        <div className="absolute top-3 right-3 flex items-center gap-2 bg-primary/20 backdrop-blur-sm px-3 py-1 rounded-full">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span className="text-primary text-xs font-medium">Now Playing</span>
        </div>
      )}

      {/* Mix Name */}
      <h3 className="text-lg font-semibold text-text-primary mb-2">{mix.name}</h3>

      {/* Sound Layers */}
      <div className="flex flex-wrap gap-2 mb-4">
        {mix.layers.slice(0, 5).map((layer, index) => (
          <span
            key={index}
            className="text-xs px-2 py-1 rounded-full bg-background/50 text-text-secondary border border-border"
          >
            {layer.soundName}
          </span>
        ))}
        {mix.layers.length > 5 && (
          <span className="text-xs px-2 py-1 rounded-full bg-background/50 text-text-secondary border border-border">
            +{mix.layers.length - 5} more
          </span>
        )}
      </div>

      {/* Tags */}
      {mix.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {mix.tags.map((tag, index) => (
            <span
              key={index}
              className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Timestamp */}
      <div className="text-xs text-text-secondary mb-4">
        {mix.createdAt === mix.updatedAt
          ? `Created ${formatDate(mix.createdAt)}`
          : `Updated ${formatDate(mix.updatedAt)}`
        }
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {onPlay && (
          <motion.button
            onClick={() => onPlay(mix.id)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-dark rounded-lg font-medium hover:shadow-[0_0_15px_rgba(19,182,236,0.4)]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="material-symbols-outlined text-xl">
              {isPlaying ? 'pause' : 'play_arrow'}
            </span>
            {isPlaying ? 'Pause' : 'Play'}
          </motion.button>
        )}

        {onEdit && (
          <motion.button
            onClick={() => onEdit(mix.id)}
            className="px-4 py-2 bg-card border border-border rounded-lg text-text-primary hover:border-primary transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="material-symbols-outlined text-xl">edit</span>
          </motion.button>
        )}

        {onDelete && (
          <motion.button
            onClick={handleDelete}
            className={`px-4 py-2 rounded-lg transition-colors ${
              showDeleteConfirm
                ? 'bg-red-500/20 border border-red-500 text-red-500'
                : 'bg-card border border-border text-text-secondary hover:border-red-500 hover:text-red-500'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="material-symbols-outlined text-xl">
              {showDeleteConfirm ? 'check' : 'delete'}
            </span>
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}
