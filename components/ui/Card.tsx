'use client'

import { FC, ReactNode } from 'react'
import { motion } from 'framer-motion'

interface CardProps {
  children: ReactNode
  className?: string
  glassmorphism?: boolean
  hover?: boolean
}

export const Card: FC<CardProps> = ({
  children,
  className = '',
  glassmorphism = true,
  hover = false,
}) => {
  const baseStyles = 'rounded-lg p-4'
  const glassStyles = glassmorphism ? 'glassmorphism' : 'bg-card border border-border'

  return (
    <motion.div
      className={`${baseStyles} ${glassStyles} ${className}`}
      whileHover={hover ? { scale: 1.02 } : {}}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  )
}
