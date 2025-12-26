'use client'

import { useEffect, ReactNode } from 'react'
import { useThemeStore } from '@/lib/state/useThemeStore'

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { mode, primaryColor } = useThemeStore()

  useEffect(() => {
    // Apply theme mode to document
    document.documentElement.classList.toggle('dark', mode === 'dark')
    document.documentElement.classList.toggle('light', mode === 'light')

    // Apply primary color
    document.documentElement.style.setProperty('--color-primary', primaryColor)
  }, [mode, primaryColor])

  return <>{children}</>
}
