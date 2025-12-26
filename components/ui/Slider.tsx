'use client'

import { FC, useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

interface SliderProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  showValue?: boolean
  className?: string
}

export const Slider: FC<SliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  showValue = true,
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)

  const percentage = ((value - min) / (max - min)) * 100

  const handleChange = (clientX: number) => {
    if (!sliderRef.current) return

    const rect = sliderRef.current.getBoundingClientRect()
    const percent = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))
    const newValue = min + (percent / 100) * (max - min)
    const steppedValue = Math.round(newValue / step) * step
    onChange(Math.max(min, Math.min(max, steppedValue)))
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    handleChange(e.clientX)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    handleChange(e.touches[0].clientX)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleChange(e.clientX)
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        handleChange(e.touches[0].clientX)
      }
    }

    const handleEnd = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('touchmove', handleTouchMove)
      document.addEventListener('mouseup', handleEnd)
      document.addEventListener('touchend', handleEnd)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('mouseup', handleEnd)
      document.removeEventListener('touchend', handleEnd)
    }
  }, [isDragging])

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        ref={sliderRef}
        className="relative flex-1 h-2 bg-card rounded-full cursor-pointer"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <motion.div
          className="absolute left-0 top-0 h-full bg-primary rounded-full"
          style={{ width: `${percentage}%` }}
          initial={false}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.1 }}
        />
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow-glow-primary cursor-grab active:cursor-grabbing"
          style={{ left: `${percentage}%`, x: '-50%' }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        />
      </div>
      {showValue && (
        <span className="text-sm text-text-secondary w-12 text-right">
          {Math.round(value)}%
        </span>
      )}
    </div>
  )
}
