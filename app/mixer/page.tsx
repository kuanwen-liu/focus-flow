'use client'

import { useState, useEffect } from 'react'
import { SoundCategories } from '@/components/mixer/SoundCategories'
import { ActiveLayers } from '@/components/mixer/ActiveLayers'
import { FloatingControls } from '@/components/mixer/FloatingControls'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { SOUND_CATALOG, FOCUS_MODE_PRESETS } from '@/lib/constants/sounds'
import { audioController } from '@/lib/audio/AudioController'
import { useAudioStore } from '@/lib/state/useAudioStore'
import { SoundDefinition } from '@/types/sound'
import { volumeToPercentage } from '@/lib/audio/MasterVolume'

export default function MixerPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})
  const [showAutoplayPrompt, setShowAutoplayPrompt] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { activeLayers, isPlaying, masterVolume, addLayer, removeLayer, updateLayer, setIsPlaying, setMasterVolume } = useAudioStore()

  // Subscribe to audio controller events
  useEffect(() => {
    const handleLayerAdded = ({ layer }: any) => {
      addLayer(layer)
      setLoadingStates((prev) => ({ ...prev, [layer.soundId]: false }))
    }

    const handleLayerRemoved = ({ layerId }: any) => {
      removeLayer(layerId)
    }

    const handlePlaybackStateChange = ({ isPlaying }: any) => {
      setIsPlaying(isPlaying)
    }

    const handleVolumeChange = ({ type, layerId, volume }: any) => {
      if (type === 'master') {
        setMasterVolume(volumeToPercentage(volume))
      }
    }

    const handleLoadingStateChange = ({ soundId, state }: any) => {
      setLoadingStates((prev) => ({ ...prev, [soundId]: state === 'loading' }))
    }

    const handleLoadError = ({ soundName, error }: any) => {
      setErrorMessage(`Failed to load ${soundName}: ${error.message}`)
      setTimeout(() => setErrorMessage(null), 5000)
    }

    const handleAutoplayBlocked = () => {
      setShowAutoplayPrompt(true)
    }

    audioController.on('layerAdded', handleLayerAdded)
    audioController.on('layerRemoved', handleLayerRemoved)
    audioController.on('playbackStateChange', handlePlaybackStateChange)
    audioController.on('volumeChange', handleVolumeChange)
    audioController.on('loadingStateChange', handleLoadingStateChange)
    audioController.on('loadError', handleLoadError)
    audioController.on('autoplayBlocked', handleAutoplayBlocked)

    return () => {
      audioController.off('layerAdded', handleLayerAdded)
      audioController.off('layerRemoved', handleLayerRemoved)
      audioController.off('playbackStateChange', handlePlaybackStateChange)
      audioController.off('volumeChange', handleVolumeChange)
      audioController.off('loadingStateChange', handleLoadingStateChange)
      audioController.off('loadError', handleLoadError)
      audioController.off('autoplayBlocked', handleAutoplayBlocked)
    }
  }, [addLayer, removeLayer, setIsPlaying, setMasterVolume])

  const handleAddSound = async (soundId: string) => {
    // Check layer limit
    if (activeLayers.length >= 10) {
      setErrorMessage('Maximum layer limit reached (10 layers)')
      setTimeout(() => setErrorMessage(null), 3000)
      return
    }

    setLoadingStates((prev) => ({ ...prev, [soundId]: true }))

    try {
      await audioController.addLayer(soundId, 0.8)
    } catch (error) {
      console.error('Failed to add layer:', error)
      setLoadingStates((prev) => ({ ...prev, [soundId]: false }))
    }
  }

  const handleRemoveSound = (layerId: string) => {
    audioController.removeLayer(layerId)
  }

  const handleLayerVolumeChange = (layerId: string, volume: number) => {
    audioController.setLayerVolume(layerId, volume)
    updateLayer(layerId, { volume })
  }

  const handleMasterVolumeChange = (percentage: number) => {
    const volume = percentage / 100
    audioController.setMasterVolume(volume)
    setMasterVolume(percentage)
  }

  const handlePlayPause = async () => {
    if (activeLayers.length === 0) {
      setErrorMessage('Add at least one sound to start playing')
      setTimeout(() => setErrorMessage(null), 3000)
      return
    }

    try {
      if (isPlaying) {
        audioController.pauseAll()
      } else {
        await audioController.playAll()
        setShowAutoplayPrompt(false)
      }
    } catch (error) {
      console.error('Playback error:', error)
    }
  }

  const handleLoadPreset = async (presetId: string) => {
    const preset = FOCUS_MODE_PRESETS.find((p) => p.id === presetId)
    if (!preset) return

    // Clear existing layers
    audioController.clearAll()

    // Add preset layers
    for (const layer of preset.soundLayers) {
      await handleAddSound(layer.soundId)
      // Set volume after layer is added
      setTimeout(() => {
        const addedLayer = activeLayers.find((l) => l.soundId === layer.soundId)
        if (addedLayer) {
          handleLayerVolumeChange(addedLayer.id, layer.volume / 100)
        }
      }, 100)
    }
  }

  const filteredSounds = SOUND_CATALOG.filter((sound) =>
    sound.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sound.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const disabledSounds = activeLayers.map((layer) => layer.soundId)

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="container mx-auto px-4 py-8">
        {/* Error Toast */}
        {errorMessage && (
          <div className="fixed top-20 right-4 z-50 max-w-md">
            <Card className="bg-red-500/10 border-red-500 p-4" glassmorphism={false}>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-red-500">error</span>
                <p className="text-red-500">{errorMessage}</p>
              </div>
            </Card>
          </div>
        )}

        {/* Autoplay Prompt */}
        {showAutoplayPrompt && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="max-w-md mx-4 p-6" glassmorphism={true}>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Audio Playback Blocked
              </h3>
              <p className="text-text-secondary mb-4">
                Your browser requires user interaction to play audio. Click the button below to start.
              </p>
              <Button
                onClick={handlePlayPause}
                variant="primary"
                className="w-full"
              >
                Start Playing
              </Button>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Active Layers */}
          <div className="lg:col-span-1">
            <ActiveLayers
              layers={activeLayers}
              onRemove={handleRemoveSound}
              onVolumeChange={handleLayerVolumeChange}
            />
          </div>

          {/* Right Column - Available Sounds */}
          <div className="lg:col-span-2 space-y-6">
            {/* Focus Mode Presets */}
            <div>
              <h2 className="text-lg font-semibold text-text-primary mb-3">
                Focus Mode Presets
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {FOCUS_MODE_PRESETS.map((preset) => (
                  <Button
                    key={preset.id}
                    onClick={() => handleLoadPreset(preset.id)}
                    variant="secondary"
                    className="flex flex-col items-center gap-2 py-4"
                  >
                    <span className="material-symbols-outlined text-2xl">
                      {preset.icon}
                    </span>
                    <span className="text-sm font-medium">{preset.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Search Bar */}
            <Input
              type="text"
              placeholder="Search sounds..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth
            />

            {/* Available Sounds */}
            <div>
              <h2 className="text-lg font-semibold text-text-primary mb-3">
                Available Sounds
              </h2>
              <SoundCategories
                sounds={filteredSounds}
                onAddSound={handleAddSound}
                loadingStates={loadingStates}
                disabledSounds={disabledSounds}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Controls */}
      <FloatingControls
        isPlaying={isPlaying}
        masterVolume={masterVolume}
        onPlayPause={handlePlayPause}
        onMasterVolumeChange={handleMasterVolumeChange}
        disabled={activeLayers.length === 0}
      />
    </div>
  )
}
