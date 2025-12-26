// types/sound.ts

export type SoundCategory =
  | 'Nature Sounds'
  | 'City & Ambience'
  | 'White Noise & Focus'

export interface SoundDefinition {
  id: string // Unique identifier (e.g., "rain-heavy")
  name: string // Display name (e.g., "Heavy Rain")
  category: SoundCategory // Category for organization
  icon: string // Material Symbol icon name
  color: string // CSS color for icon background
  mainPath: string // Path to main audio file
  gluePath: string // Path to glue audio file
  description?: string // Optional description
}

export interface SoundLayer {
  id: string // Unique layer instance ID
  soundId: string // Reference to SoundDefinition
  soundName: string // Display name (from SoundDefinition)
  category: string // Category (from SoundDefinition)
  volume: number // 0.0 to 1.0 (float for Audio API)
  enabled: boolean // Whether this layer is currently active
  solo: boolean // Whether this layer is in solo mode (mutes others)
}

export interface FocusModePreset {
  id: string // Unique identifier (e.g., "deep-work")
  name: string // Display name (e.g., "Deep Work")
  icon: string // Material Symbol icon name
  description: string // Short description
  soundLayers: PresetLayer[] // Default sound configuration
}

export interface PresetLayer {
  soundId: string // Reference to SoundDefinition
  volume: number // Default volume (0-100)
}
