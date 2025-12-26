# Data Model: Focus Mixer Core Application

**Feature**: Focus Mixer Core Application
**Branch**: 001-core-mixer-app
**Date**: 2025-12-25
**Phase**: 1 - Design & Contracts

This document defines the data entities, their schemas, relationships, and validation rules for the Focus Mixer application.

---

## Entity Diagram

```
┌─────────────────────────┐
│   SoundDefinition       │
│  (static catalog)       │
├─────────────────────────┤
│ - id: string            │
│ - name: string          │
│ - category: Category    │
│ - icon: string          │
│ - color: string         │
│ - mainPath: string      │
│ - gluePath: string      │
└──────────┬──────────────┘
           │
           │ referenced by
           │
           ↓
┌─────────────────────────┐         ┌──────────────────────┐
│     SoundLayer          │  many   │        Mix           │
│   (runtime state)       │◄────────┤    (Coconut)         │
├─────────────────────────┤         │   (persisted)        │
│ - id: string            │         ├──────────────────────┤
│ - soundId: string       │         │ - id: string         │
│ - soundName: string     │         │ - name: string       │
│ - category: string      │         │ - layers: Layer[]    │
│ - volume: number        │         │ - createdAt: Date    │
│ - enabled: boolean      │         │ - updatedAt: Date    │
│ - solo: boolean         │         │ - tags: string[]     │
└─────────────────────────┘         └──────────────────────┘


┌─────────────────────────┐
│  FocusModePreset        │
│  (static catalog)       │
├─────────────────────────┤
│ - id: string            │
│ - name: string          │
│ - icon: string          │
│ - soundLayers: Layer[]  │
└─────────────────────────┘
```

---

## 1. Mix (Coconut)

**Description**: A saved ambient sound configuration created by the user. Stored in localStorage and represents a collection of sound layers with their volume settings.

### TypeScript Schema

```typescript
// types/mix.ts

export interface Mix {
  id: string              // Unique identifier (timestamp + random)
  name: string            // User-defined name (e.g., "Deep Work - Rainy")
  layers: MixLayer[]      // Array of sound layers in this mix
  createdAt: string       // ISO 8601 timestamp
  updatedAt: string       // ISO 8601 timestamp
  tags: string[]          // Category tags (e.g., ["Focus", "Nature"])
}

export interface MixLayer {
  soundId: string         // Reference to SoundDefinition.id
  soundName: string       // Cached name for display
  category: string        // Cached category for filtering
  volume: number          // 0-100 (percentage)
  enabled: boolean        // Whether this layer is active
}
```

### Validation Rules

```typescript
// lib/validation/mixValidation.ts

export function validateMix(mix: Mix): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  // Name validation
  if (!mix.name || mix.name.trim().length === 0) {
    errors.push('Mix name is required')
  }
  if (mix.name.length > 100) {
    errors.push('Mix name must be 100 characters or less')
  }

  // Layers validation
  if (!mix.layers || mix.layers.length === 0) {
    errors.push('Mix must have at least one layer')
  }
  if (mix.layers.length > 10) {
    errors.push('Mix cannot have more than 10 layers')
  }

  // Layer-specific validation
  mix.layers.forEach((layer, index) => {
    if (!layer.soundId) {
      errors.push(`Layer ${index + 1}: soundId is required`)
    }
    if (layer.volume < 0 || layer.volume > 100) {
      errors.push(`Layer ${index + 1}: volume must be between 0 and 100`)
    }
  })

  // Tags validation
  if (mix.tags && mix.tags.length > 10) {
    errors.push('Mix cannot have more than 10 tags')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}
```

### State Transitions

```
[New Mix] → [Draft]
   ↓
   Add layers, adjust volumes
   ↓
[Draft] → [Saved] (when user clicks "Save Mix")
   ↓
   User can edit
   ↓
[Saved] → [Updated] (when user saves changes)
   ↓
   User can delete
   ↓
[Updated] → [Deleted] (removed from localStorage)
```

---

## 2. SoundLayer

**Description**: Represents a single ambient sound added to a mix. Contains the sound reference and its current playback configuration.

### TypeScript Schema

```typescript
// types/sound.ts

export interface SoundLayer {
  id: string              // Unique layer instance ID
  soundId: string         // Reference to SoundDefinition
  soundName: string       // Display name (from SoundDefinition)
  category: string        // Category (from SoundDefinition)
  volume: number          // 0.0 to 1.0 (float for Audio API)
  enabled: boolean        // Whether this layer is currently active
  solo: boolean           // Whether this layer is in solo mode (mutes others)
}
```

### Validation Rules

```typescript
// lib/validation/layerValidation.ts

export function validateLayer(layer: SoundLayer): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!layer.soundId) {
    errors.push('Layer must reference a sound')
  }

  if (typeof layer.volume !== 'number' || layer.volume < 0 || layer.volume > 1) {
    errors.push('Layer volume must be a number between 0.0 and 1.0')
  }

  if (typeof layer.enabled !== 'boolean') {
    errors.push('Layer enabled must be boolean')
  }

  if (typeof layer.solo !== 'boolean') {
    errors.push('Layer solo must be boolean')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}
```

### Relationships

- **Belongs to**: Mix (one-to-many)
- **References**: SoundDefinition (by soundId)

---

## 3. SoundDefinition

**Description**: Represents an available ambient sound in the library. This is a static catalog defined in code, not persisted in localStorage.

### TypeScript Schema

```typescript
// types/sound.ts

export type SoundCategory =
  | 'Nature Sounds'
  | 'City & Ambience'
  | 'White Noise & Focus'

export interface SoundDefinition {
  id: string                 // Unique identifier (e.g., "rain-heavy")
  name: string               // Display name (e.g., "Heavy Rain")
  category: SoundCategory    // Category for organization
  icon: string               // Material Symbol icon name
  color: string              // CSS color for icon background
  mainPath: string           // Path to main audio file
  gluePath: string           // Path to glue audio file
  description?: string       // Optional description
}
```

### Example Catalog

```typescript
// lib/constants/sounds.ts

export const SOUND_CATALOG: SoundDefinition[] = [
  {
    id: 'rain-heavy',
    name: 'Heavy Rain',
    category: 'Nature Sounds',
    icon: 'rainy',
    color: 'blue-500',
    mainPath: '/sounds/rain/main-rain.mp4',
    gluePath: '/sounds/rain/glue-rain.mp4',
    description: 'Steady rainfall for deep focus'
  },
  {
    id: 'thunder-distant',
    name: 'Distant Thunder',
    category: 'Nature Sounds',
    icon: 'thunderstorm',
    color: 'purple-500',
    mainPath: '/sounds/thunder/main-thunder.mp4',
    gluePath: '/sounds/thunder/glue-thunder.mp4'
  },
  {
    id: 'waves-ocean',
    name: 'Ocean Waves',
    category: 'Nature Sounds',
    icon: 'waves',
    color: 'cyan-500',
    mainPath: '/sounds/waves/main-waves.mp4',
    gluePath: '/sounds/waves/glue-waves.mp4'
  },
  {
    id: 'wind-gentle',
    name: 'Ocean Wind',
    category: 'Nature Sounds',
    icon: 'air',
    color: 'cyan-500',
    mainPath: '/sounds/wind/main-wind.mp4',
    gluePath: '/sounds/wind/glue-wind.mp4'
  },
  {
    id: 'fire-crackling',
    name: 'Crackling Fire',
    category: 'City & Ambience',
    icon: 'fireplace',
    color: 'orange-500',
    mainPath: '/sounds/fire/main-fire.mp4',
    gluePath: '/sounds/fire/glue-fire.mp4'
  },
  {
    id: 'birds-forest',
    name: 'Forest Birds',
    category: 'Nature Sounds',
    icon: 'flutter_dash',
    color: 'green-500',
    mainPath: '/sounds/birds/main-birds.mp4',
    gluePath: '/sounds/birds/glue-birds.mp4'
  },
  {
    id: 'crickets-night',
    name: 'Night Crickets',
    category: 'Nature Sounds',
    icon: 'bug_report',
    color: 'green-500',
    mainPath: '/sounds/crickets/main-crickets.mp4',
    gluePath: '/sounds/crickets/glue-crickets.mp4'
  },
  {
    id: 'coffee-shop',
    name: 'Coffee Shop',
    category: 'City & Ambience',
    icon: 'local_cafe',
    color: 'amber-500',
    mainPath: '/sounds/coffee-shop/main-people.mp4',
    gluePath: '/sounds/coffee-shop/glue-people.mp4'
  },
  {
    id: 'singing-bowl',
    name: 'Singing Bowl',
    category: 'White Noise & Focus',
    icon: 'graphic_eq',
    color: 'purple-500',
    mainPath: '/sounds/singing-bowl/main-sbowl.mp4',
    gluePath: '/sounds/singing-bowl/glue-sbowl.mp4'
  },
  {
    id: 'white-noise',
    name: 'White Noise',
    category: 'White Noise & Focus',
    icon: 'waves',
    color: 'gray-400',
    mainPath: '/sounds/white-noise/main-whitenoise.mp4',
    gluePath: '/sounds/white-noise/glue-whitenoise.mp4'
  }
]
```

### Category Color Mapping

```typescript
// lib/constants/colors.ts

export const CATEGORY_COLORS: Record<string, string> = {
  'rain': 'blue',
  'thunder': 'purple',
  'waves': 'cyan',
  'wind': 'cyan',
  'fire': 'orange',
  'birds': 'green',
  'crickets': 'green',
  'coffee-shop': 'amber',
  'singing-bowl': 'purple',
  'white-noise': 'gray'
}
```

---

## 4. FocusModePreset

**Description**: Pre-configured mix template optimized for specific use cases. These are static presets that users can select to quickly start a mix.

### TypeScript Schema

```typescript
// types/preset.ts

export interface FocusModePreset {
  id: string              // Unique identifier (e.g., "deep-work")
  name: string            // Display name (e.g., "Deep Work")
  icon: string            // Material Symbol icon name
  description: string     // Short description
  soundLayers: PresetLayer[]  // Default sound configuration
}

export interface PresetLayer {
  soundId: string         // Reference to SoundDefinition
  volume: number          // Default volume (0-100)
}
```

### Example Presets

```typescript
// lib/constants/presets.ts

export const FOCUS_MODE_PRESETS: FocusModePreset[] = [
  {
    id: 'deep-work',
    name: 'Deep Work',
    icon: 'psychology',
    description: 'Intense focus with minimal distractions',
    soundLayers: [
      { soundId: 'rain-heavy', volume: 60 },
      { soundId: 'white-noise', volume: 30 }
    ]
  },
  {
    id: 'reading',
    name: 'Reading',
    icon: 'menu_book',
    description: 'Gentle background for reading',
    soundLayers: [
      { soundId: 'coffee-shop', volume: 40 },
      { soundId: 'rain-heavy', volume: 20 }
    ]
  },
  {
    id: 'meditation',
    name: 'Meditation',
    icon: 'self_improvement',
    description: 'Calm sounds for meditation',
    soundLayers: [
      { soundId: 'singing-bowl', volume: 50 },
      { soundId: 'wind-gentle', volume: 30 }
    ]
  },
  {
    id: 'nap',
    name: 'Nap',
    icon: 'bedtime',
    description: 'Soothing sounds for rest',
    soundLayers: [
      { soundId: 'waves-ocean', volume: 40 },
      { soundId: 'white-noise', volume: 20 }
    ]
  }
]
```

---

## 5. AudioState (Runtime)

**Description**: Runtime state for audio playback. Not persisted to localStorage.

### TypeScript Schema

```typescript
// types/audio.ts

export interface AudioState {
  isPlaying: boolean          // Global play/pause state
  masterVolume: number        // 0.0 to 1.0
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
```

---

## 6. ThemeState (Runtime & Persisted)

**Description**: Theme configuration for future light mode support. Currently only dark mode is active.

### TypeScript Schema

```typescript
// types/theme.ts

export type ThemeMode = 'dark' | 'light'

export interface ThemeState {
  mode: ThemeMode           // Current theme mode
  primaryColor: string      // Customizable primary color (future)
}
```

---

## Storage Schema (localStorage)

### Key Structure

```
focus-mixer-mixes          → Array of Mix objects
focus-mixer-theme          → ThemeState object (future)
focus-mixer-audio-prefs    → Audio preferences (future)
```

### Example localStorage Data

```json
{
  "focus-mixer-mixes": {
    "state": {
      "mixes": [
        {
          "id": "1703518800000-abc123",
          "name": "Deep Work - Rainy",
          "layers": [
            {
              "soundId": "rain-heavy",
              "soundName": "Heavy Rain",
              "category": "Nature Sounds",
              "volume": 80,
              "enabled": true
            },
            {
              "soundId": "white-noise",
              "soundName": "White Noise",
              "category": "White Noise & Focus",
              "volume": 40,
              "enabled": true
            }
          ],
          "createdAt": "2025-12-25T10:00:00.000Z",
          "updatedAt": "2025-12-25T14:30:00.000Z",
          "tags": ["Focus", "Rain"]
        }
      ],
      "currentMixId": "1703518800000-abc123"
    },
    "version": 1
  }
}
```

---

## Data Flow

### Creating a New Mix

```
1. User clicks "Start Mixing" → Navigate to /mixer
2. User adds sounds → SoundLayer objects created in AudioState
3. User adjusts volumes → SoundLayer.volume updated
4. User clicks "Save Mix" → Prompt for name
5. Generate Mix object:
   - id: `${Date.now()}-${randomString()}`
   - name: user input
   - layers: serialize from AudioState
   - timestamps: current ISO date
6. Validate Mix → validateMix()
7. If valid → Add to useMixStore → Auto-persist to localStorage
8. Navigate to /library
```

### Playing a Saved Mix

```
1. User navigates to /library
2. User clicks "Play" on mix card
3. Load Mix from useMixStore
4. Create AudioController with layers from Mix
5. For each layer:
   - Load SoundDefinition from SOUND_CATALOG
   - Create Audio element with mainPath
   - Set volume from layer.volume / 100
6. Call audioController.playAll()
7. Update AudioState.isPlaying = true
```

### Editing a Mix

```
1. User clicks "Edit" on mix card
2. Navigate to /edit/[mixId]
3. Load Mix from useMixStore by ID
4. Populate AudioState with layers from Mix
5. User makes changes → Update AudioState
6. User clicks "Save Mix" → Update Mix in useMixStore
7. Zustand persist auto-saves to localStorage
```

---

## Migration Strategy

For future schema changes, Zustand persist middleware supports versioning:

```typescript
{
  name: 'focus-mixer-mixes',
  version: 2,
  migrate: (persistedState: any, version: number) => {
    if (version === 1) {
      // Migrate from v1 to v2
      // Example: rename field, add new field with default
      return {
        ...persistedState,
        newField: defaultValue
      }
    }
    return persistedState
  }
}
```

---

## Summary

All entities align with the feature specification requirements and constitution principles:

- **Mix (Coconut)**: User's saved sound configuration (FR-051 to FR-059)
- **SoundLayer**: Individual sound in a mix with volume control (FR-042 to FR-046)
- **SoundDefinition**: Static catalog of available sounds (FR-060 to FR-064)
- **FocusModePreset**: Quick-start templates (FR-021)
- **AudioState**: Runtime playback state
- **ThemeState**: Future light mode support (FR-071 to FR-075)

Data model supports all user stories (P1-P4) and enables independent implementation of each feature.
