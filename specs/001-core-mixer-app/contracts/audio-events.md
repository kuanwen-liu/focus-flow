# Audio Events Contract

**Feature**: Focus Mixer Core Application
**Branch**: 001-core-mixer-app
**Date**: 2025-12-25

This document defines the event system for the AudioController and how components should interact with audio playback.

---

## Event Architecture

The AudioController uses a custom event system to notify components of audio state changes. This enables decoupled communication between the audio engine and UI components.

### Event Emitter Pattern

```typescript
// lib/audio/AudioController.ts
import { EventEmitter } from 'events'

export class AudioController extends EventEmitter {
  // Inherits emit(), on(), off() from EventEmitter
}
```

---

## Core Events

### 1. `playbackStateChange`

**Description**: Emitted when overall playback state changes (play/pause).

**Payload**:
```typescript
{
  isPlaying: boolean  // true = playing, false = paused
  timestamp: number   // Date.now() when event occurred
}
```

**When Emitted**:
- User clicks play button → `isPlaying: true`
- User clicks pause button → `isPlaying: false`
- All layers successfully start playing → `isPlaying: true`
- Any layer fails to play → `isPlaying: false`

**Usage Example**:
```typescript
audioController.on('playbackStateChange', ({ isPlaying }) => {
  console.log('Playback state:', isPlaying ? 'Playing' : 'Paused')
  // Update UI play/pause button icon
})
```

---

### 2. `volumeChange`

**Description**: Emitted when any volume control changes (layer or master).

**Payload**:
```typescript
{
  type: 'layer' | 'master'
  layerId?: string        // Only present if type === 'layer'
  volume: number          // 0.0 to 1.0
  timestamp: number
}
```

**When Emitted**:
- User drags layer volume slider
- User drags master volume slider
- Volume programmatically changed via code

**Usage Example**:
```typescript
audioController.on('volumeChange', ({ type, layerId, volume }) => {
  if (type === 'layer') {
    console.log(`Layer ${layerId} volume: ${volume * 100}%`)
    // Update slider UI position
  } else {
    console.log(`Master volume: ${volume * 100}%`)
    // Update master slider UI
  }
})
```

---

### 3. `layerAdded`

**Description**: Emitted when a new sound layer is added to the mix.

**Payload**:
```typescript
{
  layer: SoundLayer      // Full layer object
  timestamp: number
}
```

**When Emitted**:
- User clicks on a sound card to add it
- User loads a preset
- User loads a saved mix

**Usage Example**:
```typescript
audioController.on('layerAdded', ({ layer }) => {
  console.log(`Added layer: ${layer.soundName}`)
  // Add layer card to active layers UI
  // Update "X active" counter
})
```

---

### 4. `layerRemoved`

**Description**: Emitted when a sound layer is removed from the mix.

**Payload**:
```typescript
{
  layerId: string        // ID of removed layer
  soundName: string      // Name for logging/UI feedback
  timestamp: number
}
```

**When Emitted**:
- User clicks remove button on layer card
- User clears all layers

**Usage Example**:
```typescript
audioController.on('layerRemoved', ({ layerId, soundName }) => {
  console.log(`Removed layer: ${soundName}`)
  // Remove layer card from UI
  // Update "X active" counter
})
```

---

### 5. `loadError`

**Description**: Emitted when an audio file fails to load.

**Payload**:
```typescript
{
  soundId: string           // ID of sound that failed
  soundName: string         // Name for user-facing error
  error: {
    code: number            // MediaError code
    message: string         // Error description
  }
  timestamp: number
}
```

**Error Codes** (from MediaError API):
- `1`: MEDIA_ERR_ABORTED - User aborted load
- `2`: MEDIA_ERR_NETWORK - Network error
- `3`: MEDIA_ERR_DECODE - Decode error (corrupted file)
- `4`: MEDIA_ERR_SRC_NOT_SUPPORTED - Format not supported

**When Emitted**:
- Audio file 404 (not found)
- Network timeout during load
- Audio format not supported by browser
- File is corrupted

**Usage Example**:
```typescript
audioController.on('loadError', ({ soundName, error }) => {
  console.error(`Failed to load ${soundName}:`, error.message)
  // Show error toast notification
  // Display error state on sound card
  // Optionally remove layer from mix
})
```

---

### 6. `loadingStateChange`

**Description**: Emitted when an audio file's loading state changes.

**Payload**:
```typescript
{
  soundId: string
  state: 'loading' | 'ready' | 'error'
  timestamp: number
}
```

**When Emitted**:
- Audio starts loading → `state: 'loading'`
- Audio ready to play → `state: 'ready'`
- Audio fails to load → `state: 'error'`

**Usage Example**:
```typescript
audioController.on('loadingStateChange', ({ soundId, state }) => {
  if (state === 'loading') {
    // Show loading spinner on sound card
  } else if (state === 'ready') {
    // Remove spinner, enable play button
  } else if (state === 'error') {
    // Show error icon
  }
})
```

---

### 7. `soloChange`

**Description**: Emitted when a layer's solo state changes.

**Payload**:
```typescript
{
  layerId: string
  solo: boolean           // true = solo active, false = solo off
  timestamp: number
}
```

**When Emitted**:
- User clicks solo button on a layer
- Solo is disabled when another layer is soloed
- Solo is disabled when layer is removed

**Usage Example**:
```typescript
audioController.on('soloChange', ({ layerId, solo }) => {
  // Dim non-solo layers visually
  // Update solo button state (active/inactive)
})
```

---

### 8. `masterVolumeChange`

**Description**: Emitted when master volume changes (convenience event, same as volumeChange with type='master').

**Payload**:
```typescript
{
  volume: number          // 0.0 to 1.0
  timestamp: number
}
```

**Usage Example**:
```typescript
audioController.on('masterVolumeChange', ({ volume }) => {
  // Update master volume slider
  // Update volume percentage display
})
```

---

## Event Subscription Patterns

### Component Lifecycle

```typescript
// components/mixer/ActiveLayers.tsx
'use client'

import { useEffect } from 'react'
import { audioController } from '@/lib/audio/AudioController'

export function ActiveLayers() {
  useEffect(() => {
    // Subscribe to events on mount
    const handleLayerAdded = ({ layer }) => {
      // Update UI
    }

    const handleLayerRemoved = ({ layerId }) => {
      // Update UI
    }

    audioController.on('layerAdded', handleLayerAdded)
    audioController.on('layerRemoved', handleLayerRemoved)

    // Cleanup on unmount
    return () => {
      audioController.off('layerAdded', handleLayerAdded)
      audioController.off('layerRemoved', handleLayerRemoved)
    }
  }, [])

  return <div>{/* Render layers */}</div>
}
```

### Zustand Integration

```typescript
// lib/state/useAudioStore.ts
import { create } from 'zustand'
import { audioController } from '@/lib/audio/AudioController'

interface AudioStore {
  isPlaying: boolean
  masterVolume: number
  layers: Map<string, SoundLayer>
}

export const useAudioStore = create<AudioStore>((set) => {
  // Subscribe to AudioController events
  audioController.on('playbackStateChange', ({ isPlaying }) => {
    set({ isPlaying })
  })

  audioController.on('volumeChange', ({ type, volume }) => {
    if (type === 'master') {
      set({ masterVolume: volume })
    }
  })

  audioController.on('layerAdded', ({ layer }) => {
    set((state) => ({
      layers: new Map(state.layers).set(layer.id, layer)
    }))
  })

  audioController.on('layerRemoved', ({ layerId }) => {
    set((state) => {
      const newLayers = new Map(state.layers)
      newLayers.delete(layerId)
      return { layers: newLayers }
    })
  })

  return {
    isPlaying: false,
    masterVolume: 0.8,
    layers: new Map()
  }
})
```

---

## Error Handling Contract

### Error State UI Requirements

When `loadError` is emitted:

1. **Sound Card in Available Sounds**:
   - Display red error icon overlay
   - Show tooltip: "Failed to load audio file"
   - Disable "Add to Mix" button

2. **Layer Card in Active Layers**:
   - Change border color to red
   - Display error icon next to sound name
   - Show "Retry" and "Remove" buttons
   - Optionally auto-remove after 10 seconds

3. **Global Error Notification**:
   - Toast notification: "Unable to load [Sound Name]"
   - Include retry option
   - Log error to console for debugging

### Retry Logic

```typescript
audioController.on('loadError', async ({ soundId, error }) => {
  // Retry once after 2 seconds
  setTimeout(async () => {
    try {
      await audioController.retryLoad(soundId)
      console.log(`Successfully loaded ${soundId} on retry`)
    } catch (retryError) {
      console.error(`Retry failed for ${soundId}`)
      // Show final error to user
    }
  }, 2000)
})
```

---

## Autoplay Policy Handling

### Event: `autoplayBlocked`

**Description**: Emitted when browser blocks autoplay due to user interaction policy.

**Payload**:
```typescript
{
  message: string
  timestamp: number
}
```

**When Emitted**:
- User loads page and audio attempts to autoplay
- iOS Safari blocks play() without user gesture
- Chrome blocks autoplay on unmuted audio

**UI Response**:
```typescript
audioController.on('autoplayBlocked', () => {
  // Show prominent play button overlay
  // Display message: "Tap to start audio"
  // Disable automatic playback until user interaction
})
```

---

## Performance Monitoring

### Event: `performanceWarning`

**Description**: Emitted when audio playback performance degrades.

**Payload**:
```typescript
{
  issue: 'layerLimit' | 'memoryHigh' | 'lagDetected'
  details: string
  timestamp: number
}
```

**When Emitted**:
- More than 10 layers active → `issue: 'layerLimit'`
- Memory usage exceeds threshold → `issue: 'memoryHigh'`
- Audio dropouts detected → `issue: 'lagDetected'`

**UI Response**:
```typescript
audioController.on('performanceWarning', ({ issue, details }) => {
  if (issue === 'layerLimit') {
    // Show warning: "Maximum layers reached (10)"
    // Disable adding more layers
  } else if (issue === 'lagDetected') {
    // Suggest reducing layer count
    // Offer to disable some layers
  }
})
```

---

## Testing Events

### Unit Test Example

```typescript
// __tests__/lib/audio/AudioController.test.ts
import { AudioController } from '@/lib/audio/AudioController'

describe('AudioController Events', () => {
  it('emits playbackStateChange when playing', (done) => {
    const controller = new AudioController()

    controller.on('playbackStateChange', ({ isPlaying }) => {
      expect(isPlaying).toBe(true)
      done()
    })

    controller.playAll()
  })

  it('emits volumeChange when layer volume changes', (done) => {
    const controller = new AudioController()

    controller.on('volumeChange', ({ type, volume }) => {
      expect(type).toBe('layer')
      expect(volume).toBe(0.75)
      done()
    })

    controller.setLayerVolume('rain-heavy', 0.75)
  })
})
```

---

## Summary

All events follow a consistent pattern:
- Payload includes `timestamp` for debugging
- Events are asynchronous and non-blocking
- Components should handle cleanup on unmount
- Errors are propagated via events, not thrown exceptions
- Performance events help maintain 60fps playback

This event contract ensures decoupled architecture and enables easy testing of audio/UI interactions.
