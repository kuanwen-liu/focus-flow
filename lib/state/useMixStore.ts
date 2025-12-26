// lib/state/useMixStore.ts

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Mix } from '@/types/mix'

interface MixStore {
  mixes: Mix[]
  currentMixId: string | null
  addMix: (mix: Mix) => void
  updateMix: (id: string, updates: Partial<Mix>) => void
  deleteMix: (id: string) => void
  getMixById: (id: string) => Mix | undefined
  setCurrentMix: (id: string | null) => void
}

export const useMixStore = create<MixStore>()(
  persist(
    (set, get) => ({
      mixes: [],
      currentMixId: null,

      addMix: (mix: Mix) => {
        set((state) => ({
          mixes: [...state.mixes, mix],
        }))
      },

      updateMix: (id: string, updates: Partial<Mix>) => {
        set((state) => ({
          mixes: state.mixes.map((mix) =>
            mix.id === id
              ? { ...mix, ...updates, updatedAt: new Date().toISOString() }
              : mix
          ),
        }))
      },

      deleteMix: (id: string) => {
        set((state) => ({
          mixes: state.mixes.filter((mix) => mix.id !== id),
          currentMixId: state.currentMixId === id ? null : state.currentMixId,
        }))
      },

      getMixById: (id: string) => {
        return get().mixes.find((mix) => mix.id === id)
      },

      setCurrentMix: (id: string | null) => {
        set({ currentMixId: id })
      },
    }),
    {
      name: 'focus-mixer-mixes',
      version: 1,
    }
  )
)
