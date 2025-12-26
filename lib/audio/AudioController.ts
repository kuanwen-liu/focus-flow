// lib/audio/AudioController.ts

import { AudioLayer } from './AudioLayer'
import { SoundLayer } from '@/types/sound'
import { SOUND_CATALOG } from '@/lib/constants/sounds'

type EventHandler = (...args: any[]) => void

export class AudioController {
  private layers: Map<string, AudioLayer> = new Map()
  private _masterVolume: number = 0.8
  private _isPlaying: boolean = false
  private eventHandlers: Map<string, EventHandler[]> = new Map()

  get masterVolume(): number {
    return this._masterVolume
  }

  get isPlaying(): boolean {
    return this._isPlaying
  }

  get activeLayers(): AudioLayer[] {
    return Array.from(this.layers.values())
  }

  // Event emitter pattern (simple implementation for browser)
  on(event: string, handler: EventHandler): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, [])
    }
    this.eventHandlers.get(event)!.push(handler)
  }

  off(event: string, handler: EventHandler): void {
    const handlers = this.eventHandlers.get(event)
    if (handlers) {
      const index = handlers.indexOf(handler)
      if (index > -1) {
        handlers.splice(index, 1)
      }
    }
  }

  private emit(event: string, data: any): void {
    const handlers = this.eventHandlers.get(event)
    if (handlers) {
      handlers.forEach((handler) => handler(data))
    }
  }

  async addLayer(soundId: string, volume: number = 0.8): Promise<string> {
    const sound = SOUND_CATALOG.find((s) => s.id === soundId)
    if (!sound) {
      throw new Error(`Sound ${soundId} not found in catalog`)
    }

    const layerId = `${soundId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const soundLayer: SoundLayer = {
      id: layerId,
      soundId: sound.id,
      soundName: sound.name,
      category: sound.category,
      volume,
      enabled: true,
      solo: false,
    }

    const audioLayer = new AudioLayer(soundLayer, sound.mainPath, sound.gluePath)

    try {
      this.emit('loadingStateChange', { soundId, state: 'loading', timestamp: Date.now() })
      await audioLayer.load()
      this.emit('loadingStateChange', { soundId, state: 'ready', timestamp: Date.now() })

      this.layers.set(layerId, audioLayer)

      this.emit('layerAdded', { layer: audioLayer.toJSON(), timestamp: Date.now() })

      // Auto-play if currently playing
      if (this._isPlaying) {
        await audioLayer.play()
      }

      return layerId
    } catch (error: any) {
      this.emit('loadingStateChange', { soundId, state: 'error', timestamp: Date.now() })
      this.emit('loadError', {
        soundId,
        soundName: sound.name,
        error: {
          code: error.code || 0,
          message: error.message || 'Unknown error',
        },
        timestamp: Date.now(),
      })
      throw error
    }
  }

  removeLayer(layerId: string): void {
    const layer = this.layers.get(layerId)
    if (layer) {
      layer.destroy()
      this.layers.delete(layerId)
      this.emit('layerRemoved', {
        layerId,
        soundName: layer.soundName,
        timestamp: Date.now(),
      })
    }
  }

  setLayerVolume(layerId: string, volume: number): void {
    const layer = this.layers.get(layerId)
    if (layer) {
      layer.volume = volume
      this.emit('volumeChange', {
        type: 'layer',
        layerId,
        volume,
        timestamp: Date.now(),
      })
    }
  }

  setMasterVolume(volume: number): void {
    this._masterVolume = Math.max(0, Math.min(1, volume))

    // Apply master volume to all layers
    this.layers.forEach((layer) => {
      // Store original volume and apply master multiplier
      const effectiveVolume = layer.volume * this._masterVolume
      layer.volume = effectiveVolume
    })

    this.emit('masterVolumeChange', {
      volume: this._masterVolume,
      timestamp: Date.now(),
    })

    this.emit('volumeChange', {
      type: 'master',
      volume: this._masterVolume,
      timestamp: Date.now(),
    })
  }

  async playAll(): Promise<void> {
    try {
      const playPromises = Array.from(this.layers.values()).map((layer) =>
        layer.play()
      )
      await Promise.all(playPromises)
      this._isPlaying = true
      this.emit('playbackStateChange', {
        isPlaying: true,
        timestamp: Date.now(),
      })
    } catch (error) {
      this._isPlaying = false
      this.emit('playbackStateChange', {
        isPlaying: false,
        timestamp: Date.now(),
      })
      this.emit('autoplayBlocked', {
        message: 'Autoplay blocked by browser. User interaction required.',
        timestamp: Date.now(),
      })
      throw error
    }
  }

  pauseAll(): void {
    this.layers.forEach((layer) => layer.pause())
    this._isPlaying = false
    this.emit('playbackStateChange', {
      isPlaying: false,
      timestamp: Date.now(),
    })
  }

  toggleSolo(layerId: string): void {
    const layer = this.layers.get(layerId)
    if (!layer) return

    const newSoloState = !layer.solo

    // If enabling solo, disable all other layers
    if (newSoloState) {
      this.layers.forEach((l) => {
        if (l.id !== layerId) {
          l.solo = false
          l.enabled = false
        }
      })
      layer.solo = true
      layer.enabled = true
    } else {
      // If disabling solo, enable all layers
      this.layers.forEach((l) => {
        l.enabled = true
        l.solo = false
      })
    }

    this.emit('soloChange', {
      layerId,
      solo: newSoloState,
      timestamp: Date.now(),
    })
  }

  clearAll(): void {
    this.layers.forEach((layer) => layer.destroy())
    this.layers.clear()
    this._isPlaying = false
    this.emit('playbackStateChange', {
      isPlaying: false,
      timestamp: Date.now(),
    })
  }

  getLayerCount(): number {
    return this.layers.size
  }
}

// Singleton instance
export const audioController = new AudioController()
