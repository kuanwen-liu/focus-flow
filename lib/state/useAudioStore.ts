// lib/state/useAudioStore.ts

import { create } from 'zustand'
import { SoundLayer } from '@/types/sound'
import { LoadingState } from '@/types/audio'

interface AudioStore {
  isPlaying: boolean
  masterVolume: number
  activeLayers: SoundLayer[]
  loadingStates: Record<string, LoadingState>
  setIsPlaying: (isPlaying: boolean) => void
  setMasterVolume: (volume: number) => void
  addLayer: (layer: SoundLayer) => void
  removeLayer: (layerId: string) => void
  updateLayer: (layerId: string, updates: Partial<SoundLayer>) => void
  setLoadingState: (soundId: string, state: LoadingState) => void
  clearLayers: () => void
}

export const useAudioStore = create<AudioStore>((set) => ({
  isPlaying: false,
  masterVolume: 0.8,
  activeLayers: [],
  loadingStates: {},

  setIsPlaying: (isPlaying: boolean) => {
    set({ isPlaying })
  },

  setMasterVolume: (volume: number) => {
    set({ masterVolume: Math.max(0, Math.min(1, volume)) })
  },

  addLayer: (layer: SoundLayer) => {
    set((state) => ({
      activeLayers: [...state.activeLayers, layer],
    }))
  },

  removeLayer: (layerId: string) => {
    set((state) => ({
      activeLayers: state.activeLayers.filter((l) => l.id !== layerId),
    }))
  },

  updateLayer: (layerId: string, updates: Partial<SoundLayer>) => {
    set((state) => ({
      activeLayers: state.activeLayers.map((layer) =>
        layer.id === layerId ? { ...layer, ...updates } : layer
      ),
    }))
  },

  setLoadingState: (soundId: string, state: LoadingState) => {
    set((prev) => ({
      loadingStates: {
        ...prev.loadingStates,
        [soundId]: state,
      },
    }))
  },

  clearLayers: () => {
    set({ activeLayers: [], isPlaying: false })
  },
}))
