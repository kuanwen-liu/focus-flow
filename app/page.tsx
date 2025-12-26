'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ROUTES } from '@/lib/constants/routes'

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="container mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Hero Section */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-text-primary mb-4">
              Find Your Frequency
            </h1>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Layer ambient sounds to create the perfect environment for deep focus,
              meditation, or relaxation.
            </p>
          </div>

          {/* Sound Wave Visualization */}
          <div className="flex justify-center items-center gap-2 my-12">
            {[...Array(7)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 bg-primary rounded-full"
                animate={{
                  height: [20, 60, 20],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </div>

          {/* CTA Button */}
          <Link href={ROUTES.MIXER}>
            <Button
              variant="primary"
              size="lg"
              className="px-8 py-4 text-lg shadow-glow-primary"
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined">graphic_eq</span>
                Start Mixing
              </span>
            </Button>
          </Link>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <Card glassmorphism={true} className="p-6">
              <span className="material-symbols-outlined text-4xl text-primary mb-3 block">
                layers
              </span>
              <h3 className="font-semibold text-text-primary mb-2">
                Layer Sounds
              </h3>
              <p className="text-sm text-text-secondary">
                Mix up to 10 ambient sounds with individual volume control
              </p>
            </Card>

            <Card glassmorphism={true} className="p-6">
              <span className="material-symbols-outlined text-4xl text-primary mb-3 block">
                save
              </span>
              <h3 className="font-semibold text-text-primary mb-2">
                Save Your Mixes
              </h3>
              <p className="text-sm text-text-secondary">
                Create and save custom sound combinations for later
              </p>
            </Card>

            <Card glassmorphism={true} className="p-6">
              <span className="material-symbols-outlined text-4xl text-primary mb-3 block">
                psychology
              </span>
              <h3 className="font-semibold text-text-primary mb-2">
                Focus Modes
              </h3>
              <p className="text-sm text-text-secondary">
                Quick presets for deep work, reading, meditation, and more
              </p>
            </Card>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
