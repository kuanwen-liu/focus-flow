// lib/audio/AudioLayer.ts

import { SoundLayer } from '@/types/sound'
import { LoadingState } from '@/types/audio'

export class AudioLayer {
  private mainAudio: HTMLAudioElement
  private glueAudio: HTMLAudioElement | null = null
  private _volume: number
  private _enabled: boolean
  private _solo: boolean
  private _loadingState: LoadingState = 'idle'

  public readonly id: string
  public readonly soundId: string
  public readonly soundName: string
  public readonly category: string

  constructor(
    layer: SoundLayer,
    mainPath: string,
    gluePath: string
  ) {
    this.id = layer.id
    this.soundId = layer.soundId
    this.soundName = layer.soundName
    this.category = layer.category
    this._volume = layer.volume
    this._enabled = layer.enabled
    this._solo = layer.solo

    // Create main audio element
    this.mainAudio = new Audio(mainPath)
    this.mainAudio.loop = true
    this.mainAudio.volume = this._volume

    // Create glue audio element for seamless looping
    if (gluePath) {
      this.glueAudio = new Audio(gluePath)
      this.glueAudio.loop = false
      this.glueAudio.volume = this._volume
    }
  }

  get volume(): number {
    return this._volume
  }

  set volume(value: number) {
    this._volume = Math.max(0, Math.min(1, value))
    this.mainAudio.volume = this._volume
    if (this.glueAudio) {
      this.glueAudio.volume = this._volume
    }
  }

  get enabled(): boolean {
    return this._enabled
  }

  set enabled(value: boolean) {
    this._enabled = value
    if (!value) {
      this.pause()
    }
  }

  get solo(): boolean {
    return this._solo
  }

  set solo(value: boolean) {
    this._solo = value
  }

  get loadingState(): LoadingState {
    return this._loadingState
  }

  async load(): Promise<void> {
    this._loadingState = 'loading'

    try {
      // Wait for main audio to be ready
      await new Promise<void>((resolve, reject) => {
        this.mainAudio.addEventListener('canplaythrough', () => resolve(), { once: true })
        this.mainAudio.addEventListener('error', (e) => reject(e), { once: true })
        this.mainAudio.load()
      })

      // Load glue audio if present
      if (this.glueAudio) {
        await new Promise<void>((resolve, reject) => {
          this.glueAudio!.addEventListener('canplaythrough', () => resolve(), { once: true })
          this.glueAudio!.addEventListener('error', (e) => reject(e), { once: true })
          this.glueAudio!.load()
        })
      }

      this._loadingState = 'ready'
    } catch (error) {
      this._loadingState = 'error'
      throw error
    }
  }

  async play(): Promise<void> {
    if (!this._enabled) return

    try {
      await this.mainAudio.play()
    } catch (error) {
      console.error(`Failed to play ${this.soundName}:`, error)
      throw error
    }
  }

  pause(): void {
    this.mainAudio.pause()
    if (this.glueAudio) {
      this.glueAudio.pause()
    }
  }

  stop(): void {
    this.pause()
    this.mainAudio.currentTime = 0
    if (this.glueAudio) {
      this.glueAudio.currentTime = 0
    }
  }

  destroy(): void {
    this.stop()
    this.mainAudio.src = ''
    if (this.glueAudio) {
      this.glueAudio.src = ''
    }
  }

  toJSON(): SoundLayer {
    return {
      id: this.id,
      soundId: this.soundId,
      soundName: this.soundName,
      category: this.category,
      volume: this._volume,
      enabled: this._enabled,
      solo: this._solo,
    }
  }
}
