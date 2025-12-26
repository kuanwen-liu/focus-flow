'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ROUTES } from '@/lib/constants/routes'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <motion.div
        className="max-w-md w-full text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 404 Illustration */}
        <div className="mb-8 relative">
          <motion.div
            className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary to-purple-500"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            404
          </motion.div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="material-symbols-outlined text-6xl text-text-secondary opacity-20">
              music_off
            </span>
          </div>
        </div>

        {/* Content */}
        <h1 className="text-3xl font-bold text-text-primary mb-3">
          Page Not Found
        </h1>
        <p className="text-text-secondary mb-8">
          This page seems to have wandered off into the sound waves. Let's get you back on track.
        </p>

        {/* Navigation Options */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href={ROUTES.HOME}>
            <motion.button
              className="w-full sm:w-auto px-6 py-3 bg-primary text-dark rounded-lg font-medium hover:shadow-[0_0_20px_rgba(19,182,236,0.4)] transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Go Home
            </motion.button>
          </Link>
          <Link href={ROUTES.MIXER}>
            <motion.button
              className="w-full sm:w-auto px-6 py-3 bg-background border border-border text-text-primary rounded-lg font-medium hover:border-primary transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Mixing
            </motion.button>
          </Link>
          <Link href={ROUTES.SAVED_MIXES}>
            <motion.button
              className="w-full sm:w-auto px-6 py-3 bg-background border border-border text-text-primary rounded-lg font-medium hover:border-primary transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Saved Mixes
            </motion.button>
          </Link>
        </div>

        {/* Decorative Element */}
        <div className="mt-12 flex justify-center gap-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="w-1 bg-primary/30 rounded-full"
              animate={{
                height: ['20px', '40px', '20px'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}
