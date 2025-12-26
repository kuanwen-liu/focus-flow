'use client'

import { motion } from 'framer-motion'

export function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <motion.div
          key={i}
          className="bg-card backdrop-blur-md rounded-xl p-6 border border-border"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
        >
          {/* Title skeleton */}
          <div className="h-6 bg-background rounded mb-3 animate-pulse" style={{ width: '70%' }} />

          {/* Tags skeleton */}
          <div className="flex gap-2 mb-4">
            <div className="h-6 w-16 bg-background rounded-full animate-pulse" />
            <div className="h-6 w-20 bg-background rounded-full animate-pulse" />
          </div>

          {/* Layers skeleton */}
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="h-7 w-24 bg-background rounded-full animate-pulse" />
            <div className="h-7 w-28 bg-background rounded-full animate-pulse" />
            <div className="h-7 w-20 bg-background rounded-full animate-pulse" />
          </div>

          {/* Date skeleton */}
          <div className="h-4 bg-background rounded mb-4 animate-pulse" style={{ width: '50%' }} />

          {/* Buttons skeleton */}
          <div className="flex gap-2">
            <div className="flex-1 h-10 bg-background rounded-lg animate-pulse" />
            <div className="h-10 w-10 bg-background rounded-lg animate-pulse" />
            <div className="h-10 w-10 bg-background rounded-lg animate-pulse" />
          </div>
        </motion.div>
      ))}
    </div>
  )
}
