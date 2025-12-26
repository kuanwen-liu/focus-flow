'use client'

import { FC } from 'react'
import { Slider } from '@/components/ui/Slider'

interface VolumeSliderProps {
  volume: number
  onChange: (volume: number) => void
  label?: string
  className?: string
}

export const VolumeSlider: FC<VolumeSliderProps> = ({
  volume,
  onChange,
  label,
  className = '',
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-text-secondary">{label}</label>
      )}
      <Slider
        value={volume}
        onChange={onChange}
        min={0}
        max={100}
        step={1}
        showValue={true}
      />
    </div>
  )
}
