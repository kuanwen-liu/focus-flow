// types/audio.ts

import { SoundLayer } from './sound'

export interface AudioState {
  isPlaying: boolean // Global play/pause state
  masterVolume: number // 0.0 to 1.0
  currentMixId: string | null // ID of currently playing mix
  activeLayers: Map<string, SoundLayer> // Currently active sound layers
  loadingStates: Map<string, LoadingState> // Audio loading status per sound
}

export type LoadingState = 'idle' | 'loading' | 'ready' | 'error'

export interface AudioError {
  soundId: string
  code: number
  message: string
}
