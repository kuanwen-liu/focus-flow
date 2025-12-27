'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ROUTES } from '@/lib/constants/routes'
import { SoundWaveViz } from './SoundWaveViz'
import { audioController } from '@/lib/audio/AudioController'

export const Hero = () => {
    const [isDemoPlaying, setIsDemoPlaying] = useState(false)

    const handleListenDemo = async () => {
      if (isDemoPlaying) {
        audioController.pauseAll()
        setIsDemoPlaying(false)
        return
      }

      try {
        // Add demo preset layers (Deep Work preset)
        await audioController.addLayer('rain-heavy', 0.6)
        await audioController.addLayer('white-noise', 0.3)

        // Play the demo
        await audioController.playAll()
        setIsDemoPlaying(true)

        // Auto-stop after 15 seconds
        setTimeout(() => {
          audioController.pauseAll()
          // Remove demo layers
          audioController.activeLayers.forEach(layer => {
            audioController.removeLayer(layer.id)
          })
          setIsDemoPlaying(false)
        }, 15000)
      } catch (error) {
        console.error('Failed to play demo:', error)
      }
    }
  
    return (
     <section className="relative w-full flex flex-col items-center justify-center min-h-[90vh] px-6 py-20 overflow-hidden">
        {/* Background glow effect */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] opacity-40 animate-pulse" />
        </div>

        <div className="layout-content-container flex flex-col max-w-[960px] w-full z-10 relative items-center text-center gap-8">
          {/* Version Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
            Version 1.0 Now Live
          </motion.div>

          {/* Hero Title and Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col gap-4"
          >
            <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-[-0.033em] text-transparent bg-clip-text bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-gray-500">
              Find Your <br className="hidden md:block" />
              Frequency
            </h1>
            <p className="text-xl md:text-2xl font-light text-gray-600 dark:text-[#9db2b9] max-w-[640px] mx-auto leading-relaxed">
              Mix ambient layers to block out the world and deepen your focus. Your personal cocoon of sound awaits.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 mt-4 w-full justify-center"
          >
            <Link href={ROUTES.MIXER}>
              <button className="flex items-center justify-center h-14 px-8 rounded-full bg-primary text-[#101d22] text-lg font-bold hover:bg-primary/90 hover:scale-105 transition-all shadow-[0_0_20px_rgba(19,182,236,0.3)]">
                Start Mixing
              </button>
            </Link>
            <button
              onClick={handleListenDemo}
              className="flex items-center justify-center h-14 px-8 rounded-full bg-transparent border border-gray-300 dark:border-[#3b4d54] text-gray-900 dark:text-white text-lg font-medium hover:bg-gray-100 dark:hover:bg-[#1c2427] transition-all"
            >
              <span className="material-symbols-outlined mr-2">
                {isDemoPlaying ? 'stop_circle' : 'play_circle'}
              </span>
              {isDemoPlaying ? 'Stop Demo' : 'Listen Demo'}
            </button>
          </motion.div>

          {/* Sound Wave Visual */}
          <SoundWaveViz />
        </div>
      </section>   
    )
}