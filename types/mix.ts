// types/mix.ts

export interface Mix {
  id: string // Unique identifier (timestamp + random)
  name: string // User-defined name (e.g., "Deep Work - Rainy")
  layers: MixLayer[] // Array of sound layers in this mix
  createdAt: string // ISO 8601 timestamp
  updatedAt: string // ISO 8601 timestamp
  tags: string[] // Category tags (e.g., ["Focus", "Nature"])
}

export interface MixLayer {
  soundId: string // Reference to SoundDefinition.id
  soundName: string // Cached name for display
  category: string // Cached category for filtering
  volume: number // 0-100 (percentage)
  enabled: boolean // Whether this layer is active
}
