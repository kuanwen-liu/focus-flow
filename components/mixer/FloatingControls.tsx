'use client'

import { FC, useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface FloatingControlsProps {
  isPlaying: boolean
  masterVolume: number
  onPlayPause: () => void
  onMasterVolumeChange: (volume: number) => void
  onSaveMix?: () => void
  disabled?: boolean
}

export const FloatingControls: FC<FloatingControlsProps> = ({
  isPlaying,
  masterVolume,
  onPlayPause,
  onMasterVolumeChange,
  onSaveMix,
  disabled = false,
}) => {
  const [localVolume, setLocalVolume] = useState(masterVolume)

  // Sync local volume when prop changes
  useEffect(() => {
    setLocalVolume(masterVolume)
  }, [masterVolume])

  const handleVolumeInput = (newVolume: number) => {
    setLocalVolume(newVolume)
  }

  const handleVolumeCommit = () => {
    if (localVolume !== masterVolume) {
      onMasterVolumeChange(localVolume)
    }
  }

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-6 left-0 right-0 mx-auto z-50 w-[95%] max-w-[500px]"
    >
      <div className="bg-white/90 dark:bg-[#1c292f]/90 backdrop-blur-xl border border-gray-200 dark:border-[#3b4d54] p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-6">
        {/* Play/Pause Button */}
        <button
          onClick={onPlayPause}
          disabled={disabled}
          className={`size-12 shrink-0 rounded-full bg-primary hover:bg-primary/90 flex items-center justify-center transition-transform hover:scale-105 shadow-[0_0_20px_rgba(19,182,236,0.4)] ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <span className="material-symbols-outlined !text-[32px] ml-1">
            {isPlaying ? 'pause' : 'play_arrow'}
          </span>
        </button>

        {/* Master Volume Slider */}
        <div className="flex-1 flex flex-col justify-center gap-1.5">
          <div className="flex items-center justify-between text-xs font-bold uppercase text-gray-400 tracking-wider">
            <span>Master Volume</span>
            <span>{Math.round(localVolume)}%</span>
          </div>
          <div className="relative h-6 flex items-center w-full cursor-pointer group/master">
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
            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-[#111618] overflow-hidden pointer-events-none">
              <div
                className="h-full rounded-full bg-primary transition-all duration-150"
                style={{ width: `${localVolume}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {onSaveMix && (
            <button
              onClick={onSaveMix}
              disabled={disabled}
              className="size-10 rounded-full hover:bg-primary/10 text-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
              title="Save Mix"
            >
              <span className="material-symbols-outlined">save</span>
            </button>
          )}
          <button
            className="size-10 rounded-full hover:bg-gray-100 dark:hover:bg-[#283539] text-gray-500 dark:text-gray-400 flex items-center justify-center transition-colors"
            title="Timer (Coming Soon)"
          >
            <span className="material-symbols-outlined">timer</span>
          </button>
        </div>
      </div>
    </motion.div>
  )
}
