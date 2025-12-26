'use client'

import { FC } from 'react'
import { motion } from 'framer-motion'

interface FloatingControlsProps {
  isPlaying: boolean
  masterVolume: number
  onPlayPause: () => void
  onMasterVolumeChange: (volume: number) => void
  disabled?: boolean
}

export const FloatingControls: FC<FloatingControlsProps> = ({
  isPlaying,
  masterVolume,
  onPlayPause,
  onMasterVolumeChange,
  disabled = false,
}) => {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-[500px]"
    >
      <div className="bg-card-light/90 dark:bg-card/90 backdrop-blur-xl border border-gray-200 dark:border-border-light p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-6">
        {/* Play/Pause Button */}
        <button
          onClick={onPlayPause}
          disabled={disabled}
          className={`size-12 shrink-0 rounded-full bg-primary hover:bg-primary/90 text-[#111618] flex items-center justify-center transition-transform hover:scale-105 ${
            isPlaying ? 'shadow-[0_0_20px_rgba(19,182,236,0.4)]' : ''
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span className="material-symbols-outlined !text-[32px] ml-1">
            {isPlaying ? 'pause' : 'play_arrow'}
          </span>
        </button>

        {/* Master Volume Slider */}
        <div className="flex-1 flex flex-col justify-center gap-1.5">
          <div className="flex items-center justify-between text-xs font-bold uppercase text-gray-400 tracking-wider">
            <span>Master Volume</span>
            <span>{Math.round(masterVolume)}%</span>
          </div>
          <div className="relative h-6 flex items-center w-full cursor-pointer group/master">
            <input
              type="range"
              min="0"
              max="100"
              value={masterVolume}
              onChange={(e) => onMasterVolumeChange(parseInt(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-background overflow-hidden pointer-events-none">
              <div
                className="h-full bg-white transition-all duration-150"
                style={{ width: `${masterVolume}%` }}
              />
            </div>
          </div>
        </div>

        {/* Timer Button (future feature) */}
        <div className="flex items-center gap-2">
          <button className="size-10 rounded-full hover:bg-gray-100 dark:hover:bg-border text-gray-500 dark:text-gray-400 flex items-center justify-center transition-colors">
            <span className="material-symbols-outlined">timer</span>
          </button>
        </div>
      </div>
    </motion.div>
  )
}
