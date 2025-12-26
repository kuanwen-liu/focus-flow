'use client'

import { FC, useState, useEffect } from 'react'
import { SoundDefinition } from '@/types/sound'

interface SoundLayerCardProps {
  sound: SoundDefinition
  volume: number
  isActive: boolean
  onVolumeChange: (volume: number) => void
  onToggleMute: () => void
}

// Map color strings to background and text color classes
const getColorClasses = (color: string) => {
  const colorMap: Record<string, { bg: string; bgDark: string; text: string; textDark: string; slider: string }> = {
    'blue-500': {
      bg: 'bg-blue-500/10',
      bgDark: 'dark:bg-blue-500/20',
      text: 'text-blue-600',
      textDark: 'dark:text-blue-400',
      slider: 'bg-blue-500'
    },
    'purple-500': {
      bg: 'bg-purple-500/10',
      bgDark: 'dark:bg-purple-500/20',
      text: 'text-purple-600',
      textDark: 'dark:text-purple-400',
      slider: 'bg-purple-500'
    },
    'cyan-500': {
      bg: 'bg-cyan-500/10',
      bgDark: 'dark:bg-cyan-500/20',
      text: 'text-cyan-600',
      textDark: 'dark:text-cyan-400',
      slider: 'bg-cyan-500'
    },
    'orange-500': {
      bg: 'bg-orange-500/10',
      bgDark: 'dark:bg-orange-500/20',
      text: 'text-orange-600',
      textDark: 'dark:text-orange-400',
      slider: 'bg-orange-500'
    },
    'green-500': {
      bg: 'bg-green-500/10',
      bgDark: 'dark:bg-green-500/20',
      text: 'text-green-600',
      textDark: 'dark:text-green-400',
      slider: 'bg-green-500'
    },
    'amber-500': {
      bg: 'bg-amber-500/10',
      bgDark: 'dark:bg-amber-500/20',
      text: 'text-amber-600',
      textDark: 'dark:text-amber-400',
      slider: 'bg-amber-500'
    },
    'gray-400': {
      bg: 'bg-gray-200',
      bgDark: 'dark:bg-gray-700',
      text: 'text-gray-600',
      textDark: 'dark:text-gray-300',
      slider: 'bg-gray-400'
    },
  }
  return colorMap[color] || {
    bg: 'bg-primary/10',
    bgDark: 'dark:bg-primary/20',
    text: 'text-primary',
    textDark: 'dark:text-primary',
    slider: 'bg-primary'
  }
}

export const SoundLayerCard: FC<SoundLayerCardProps> = ({
  sound,
  volume,
  isActive,
  onVolumeChange,
  onToggleMute,
}) => {
  const colors = getColorClasses(sound.color)
  const [localVolume, setLocalVolume] = useState(volume)
  const volumePercent = Math.round(localVolume * 100)

  // Sync local volume when prop changes (e.g., from preset load)
  useEffect(() => {
    setLocalVolume(volume)
  }, [volume])

  const handleVolumeInput = (newVolume: number) => {
    setLocalVolume(newVolume)
  }

  const handleVolumeCommit = () => {
    if (localVolume !== volume) {
      onVolumeChange(localVolume)
    }
  }

  return (
    <div
      className={`bg-card-light dark:bg-card-dark p-5 rounded-xl shadow-sm border border-gray-100 dark:border-border group hover:border-primary/50 transition-all relative overflow-hidden ${
        !isActive ? 'opacity-70 hover:opacity-100' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className={`size-12 rounded-lg ${colors.bg} ${colors.bgDark} flex items-center justify-center ${colors.text} ${colors.textDark}`}>
            <span className="material-symbols-outlined !text-[28px]">
              {sound.icon}
            </span>
          </div>
          <div>
            <h4 className="font-bold text-lg text-text-primary">{sound.name}</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">{sound.category}</p>
          </div>
        </div>
        <button
          onClick={onToggleMute}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined !text-[20px]">
            {isActive ? 'volume_up' : 'volume_off'}
          </span>
        </button>
      </div>

      {/* Volume Control */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          <span>Volume</span>
          <span>{volumePercent}%</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 !text-[20px]">
            {sound.icon}
          </span>
          <div className="relative h-8 flex items-center flex-1 cursor-pointer group/slider">
            <div className="h-1.5 flex-1 rounded-full bg-gray-200 dark:bg-border-light overflow-hidden pointer-events-none">
              <div
                className={`h-full ${colors.slider} transition-all duration-150`}
                style={{ width: `${volumePercent}%` }}
              />
            </div>
            <div
              className={`absolute -translate-x-1/2 size-5 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center transform transition-transform group-hover/slider:scale-110 pointer-events-none ${
                isActive ? 'slider-thumb-glow' : ''
              }`}
              style={{ left: `${volumePercent}%` }}
            >
              {isActive && <div className={`size-1.5 rounded-full ${colors.slider}`} />}
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={volumePercent}
              onInput={(e) => handleVolumeInput(parseInt(e.currentTarget.value) / 100)}
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
          </div>
        </div>
      </div>

      {/* Decorative glow effect for active sounds */}
      {isActive && (
        <div className="absolute -right-10 -bottom-10 size-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
      )}
    </div>
  )
}
