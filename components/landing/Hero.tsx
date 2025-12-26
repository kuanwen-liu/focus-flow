'use client'

import Link from 'next/link'
import { useMemo } from 'react'

import { motion } from 'framer-motion'
import { ROUTES } from '@/lib/constants/routes'

export const Hero = () => {
    // Generate spectrogram bars (vertical bars like audio visualization)
    const spectrogramBars = useMemo(() => {
        const barCount = 80;
        const bars = [];

        for (let i = 0; i < barCount; i++) {
        // Create varied heights using sine waves for organic look
        const baseHeight = 0.3 + 0.4 * Math.sin(i * 0.15);
        const variation = 0.3 * Math.sin(i * 0.4) * Math.cos(i * 0.7);
        const height = Math.max(0.1, Math.min(0.95, baseHeight + variation));

        bars.push({
            id: i,
            height: height * 200,
            delay: i * 0.01,
        });
        }

        return bars;
    }, []);
  
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
            Version 2.0 Now Live
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
            <button className="flex items-center justify-center h-14 px-8 rounded-full bg-transparent border border-gray-300 dark:border-[#3b4d54] text-gray-900 dark:text-white text-lg font-medium hover:bg-gray-100 dark:hover:bg-[#1c2427] transition-all">
              <span className="material-symbols-outlined mr-2">play_circle</span>
              Listen Demo
            </button>
          </motion.div>

          {/* Sound Wave Visual */}
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
                {/* {[
                  { height: '40%', opacity: 0.8, duration: 1.5 },
                  { height: '70%', opacity: 0.6, duration: 1.2 },
                  { height: '50%', opacity: 0.9, duration: 1.8 },
                  { height: '30%', opacity: 0.5, duration: 2.1 },
                  { height: '80%', opacity: 0.7, duration: 1.4 },
                  { height: '45%', opacity: 0.4, duration: 1.9 },
                  { height: '60%', opacity: 0.8, duration: 1.6 },
                ].map((bar, i) => (
                  <motion.div
                    key={i}
                    className="w-3 bg-primary rounded-t-sm"
                    style={{
                      height: bar.height,
                      opacity: bar.opacity
                    }}
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: bar.duration,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                ))} */}
              </div>
            </div>
          </motion.div>
        </div>
      </section>   
    )
}