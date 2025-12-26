'use client'

import { FC } from 'react'
import { motion } from 'framer-motion'
import { SoundDefinition } from '@/types/sound'
import { Card } from '@/components/ui/Card'

interface SoundCardProps {
  sound: SoundDefinition
  onAdd: (soundId: string) => void
  isLoading?: boolean
  disabled?: boolean
}

export const SoundCard: FC<SoundCardProps> = ({
  sound,
  onAdd,
  isLoading = false,
  disabled = false,
}) => {
  return (
    <Card
      className={`cursor-pointer transition-all ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary'
      }`}
      hover={!disabled}
      glassmorphism={true}
    >
      <button
        onClick={() => !disabled && onAdd(sound.id)}
        disabled={disabled || isLoading}
        className="w-full text-left"
      >
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-lg bg-${sound.color} flex items-center justify-center`}>
            <span className="material-symbols-outlined text-white text-2xl">
              {sound.icon}
            </span>
          </div>

          <div className="flex-1">
            <h3 className="font-semibold text-text-primary">{sound.name}</h3>
            <p className="text-sm text-text-muted">{sound.category}</p>
          </div>

          {isLoading && (
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          )}

          {!isLoading && !disabled && (
            <span className="material-symbols-outlined text-primary">add_circle</span>
          )}
        </div>

        {sound.description && (
          <p className="mt-2 text-sm text-text-secondary">{sound.description}</p>
        )}
      </button>
    </Card>
  )
}
