'use client'

import { FC } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { VolumeSlider } from './VolumeSlider'

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
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-2xl px-4"
    >
      <Card glassmorphism={true} className="p-6 shadow-2xl">
        <div className="flex items-center gap-6">
          <Button
            onClick={onPlayPause}
            disabled={disabled}
            variant="primary"
            size="lg"
            className="flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-3xl">
              {isPlaying ? 'pause' : 'play_arrow'}
            </span>
          </Button>

          <div className="flex-1">
            <VolumeSlider
              volume={masterVolume}
              onChange={onMasterVolumeChange}
              label="Master Volume"
            />
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
