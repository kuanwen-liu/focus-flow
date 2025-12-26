'use client'

import { motion } from 'framer-motion'
import { useMemo } from 'react'

export function SoundWaveViz() {
  // Generate spectrogram bars (vertical bars like audio visualization)
  const spectrogramBars = useMemo(() => {
    const barCount = 80
    const bars = []

    for (let i = 0; i < barCount; i++) {
      // Create varied heights using sine waves for organic look
      const baseHeight = 0.3 + 0.4 * Math.sin(i * 0.15)
      const variation = 0.3 * Math.sin(i * 0.4) * Math.cos(i * 0.7)
      const height = Math.max(0.1, Math.min(0.95, baseHeight + variation))

      bars.push({
        id: i,
        height: height * 200,
        delay: i * 0.01,
      })
    }

    return bars
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.6 }}
      className="mt-12 w-full max-w-4xl relative group"
    >
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />

      {/* Visual container */}
      <div className="relative flex items-center justify-center aspect-[21/9] w-full rounded-xl bg-gradient-to-b from-[#151f24] to-[#101d22] border border-gray-200 dark:border-[#283539] overflow-hidden">
        <div className="flex items-end justify-center gap-1 h-24 w-full px-20 opacity-80">
          {spectrogramBars.map((bar) => (
            <motion.div
              key={bar.id}
              initial={{ height: '10%', opacity: 0 }}
              animate={{
                height: [
                  '10%',
                  `${bar.height}%`,
                  `${bar.height * 0.7}%`,
                  `${bar.height * 0.9}%`,
                  `${bar.height * 0.6}%`,
                  `${bar.height}%`,
                ],
                opacity: [0, 1, 1, 1, 1, 1],
              }}
              transition={{
                duration: 3,
                delay: bar.delay,
                repeat: Infinity,
                ease: 'easeInOut',
                times: [0, 0.2, 0.4, 0.6, 0.8, 1],
              }}
              className="w-1.5 bg-gradient-to-t from-primary/60 via-primary to-primary/80 rounded-full shadow-[0_0_10px_var(--color-primary)]"
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
