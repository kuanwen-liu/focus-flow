// lib/state/useThemeStore.ts

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ThemeMode } from '@/types/theme'

interface ThemeStore {
  mode: ThemeMode
  primaryColor: string
  setMode: (mode: ThemeMode) => void
  setPrimaryColor: (color: string) => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      mode: 'dark', // Default to dark mode
      primaryColor: '#13b6ec', // Default primary color from constitution

      setMode: (mode: ThemeMode) => {
        set({ mode })
        // Apply theme to document
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', mode === 'dark')
          document.documentElement.classList.toggle('light', mode === 'light')
        }
      },

      setPrimaryColor: (color: string) => {
        set({ primaryColor: color })
        // Update CSS variable
        if (typeof document !== 'undefined') {
          document.documentElement.style.setProperty('--color-primary', color)
        }
      },
    }),
    {
      name: 'focus-mixer-theme',
      version: 1,
    }
  )
)
