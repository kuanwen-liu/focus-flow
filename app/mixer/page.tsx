'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FocusModePresets } from '@/components/mixer/FocusModePresets'
import { SoundCategoriesCollapsible } from '@/components/mixer/SoundCategoriesCollapsible'
import { FloatingControls } from '@/components/mixer/FloatingControls'
import { SaveMixDialog } from '@/components/mixer/SaveMixDialog'
import { SOUND_CATALOG, FOCUS_MODE_PRESETS } from '@/lib/constants/sounds'
import { audioController } from '@/lib/audio/AudioController'
import { useAudioStore } from '@/lib/state/useAudioStore'
import { useMixStore } from '@/lib/state/useMixStore'
import { volumeToPercentage } from '@/lib/audio/MasterVolume'
import type { Mix } from '@/types/mix'

function MixerContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [activePresetId, setActivePresetId] = useState<string | null>(null)
  const [showAutoplayPrompt, setShowAutoplayPrompt] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showSaveDialog, setShowSaveDialog] = useState(false)

  const { activeLayers, isPlaying, masterVolume, addLayer, removeLayer, updateLayer, setIsPlaying, setMasterVolume } = useAudioStore()
  const { addMix, updateMix, getMixById } = useMixStore()

  // Load mix from query params (if coming from library)
  useEffect(() => {
    const mixId = searchParams.get('mixId')
    if (mixId) {
      const mix = getMixById(mixId)
      if (mix) {
        // Load the mix layers
        mix.layers.forEach(async (layer) => {
          await handleVolumeChange(layer.soundId, layer.volume / 100)
        })
      }
    }
  }, [searchParams])

  // Subscribe to audio controller events
  useEffect(() => {
    const handleLayerAdded = ({ layer }: any) => {
      addLayer(layer)
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
      } else if (type === 'layer' && layerId) {
        updateLayer(layerId, { volume })
      }
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
    audioController.on('loadError', handleLoadError)
    audioController.on('autoplayBlocked', handleAutoplayBlocked)

    return () => {
      audioController.off('layerAdded', handleLayerAdded)
      audioController.off('layerRemoved', handleLayerRemoved)
      audioController.off('playbackStateChange', handlePlaybackStateChange)
      audioController.off('volumeChange', handleVolumeChange)
      audioController.off('loadError', handleLoadError)
      audioController.off('autoplayBlocked', handleAutoplayBlocked)
    }
  }, [addLayer, removeLayer, updateLayer, setIsPlaying, setMasterVolume])

  const handleVolumeChange = async (soundId: string, volume: number) => {
    const existingLayer = activeLayers.find((layer) => layer.soundId === soundId)

    if (volume === 0 && existingLayer) {
      // Remove layer when volume is set to 0
      audioController.removeLayer(existingLayer.id)
      removeLayer(existingLayer.id)
    } else if (volume > 0 && !existingLayer) {
      // Add layer if it doesn't exist
      try {
        await audioController.addLayer(soundId, volume)
      } catch (error) {
        console.error('Failed to add layer:', error)
        setErrorMessage(`Failed to load sound`)
        setTimeout(() => setErrorMessage(null), 3000)
      }
    } else if (existingLayer) {
      // Update existing layer volume
      audioController.setLayerVolume(existingLayer.id, volume)
      updateLayer(existingLayer.id, { volume })
    }
  }

  const handleToggleMute = (soundId: string) => {
    const existingLayer = activeLayers.find((layer) => layer.soundId === soundId)

    if (existingLayer) {
      // Mute by setting volume to 0
      handleVolumeChange(soundId, 0)
    } else {
      // Unmute by setting volume to 0.6 (default)
      handleVolumeChange(soundId, 0.6)
    }
  }

  const handleMasterVolumeChange = (percentage: number) => {
    const volume = percentage / 100
    audioController.setMasterVolume(volume)
    setMasterVolume(percentage)
  }

  const handlePlayPause = async () => {
    const hasActiveSounds = activeLayers.some((layer) => layer.volume > 0)

    if (!hasActiveSounds) {
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

  const handleSelectPreset = async (presetId: string) => {
    const preset = FOCUS_MODE_PRESETS.find((p) => p.id === presetId)
    if (!preset) return

    setActivePresetId(presetId)

    // Clear all existing layers
    activeLayers.forEach((layer) => {
      audioController.removeLayer(layer.id)
    })

    // Add preset layers
    for (const presetLayer of preset.soundLayers) {
      await handleVolumeChange(presetLayer.soundId, presetLayer.volume / 100)
    }

    // Auto-play if not already playing
    if (!isPlaying && preset.soundLayers.length > 0) {
      setTimeout(() => {
        handlePlayPause()
      }, 500)
    }
  }

  const handleSaveMix = (name: string, tags: string[]) => {
    if (activeLayers.length === 0) {
      setErrorMessage('Add at least one sound to save a mix')
      setTimeout(() => setErrorMessage(null), 3000)
      return
    }

    try {
      // Check for duplicate name and auto-append number if needed
      const existingMixes = useMixStore.getState().mixes
      let finalName = name
      let counter = 1

      while (existingMixes.some(m => m.name === finalName)) {
        finalName = `${name} (${counter})`
        counter++
      }

      // Generate unique ID
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
      const now = new Date().toISOString()

      // Create mix object
      const mix: Mix = {
        id,
        name: finalName,
        layers: activeLayers.map((layer) => ({
          soundId: layer.soundId,
          soundName: layer.soundName,
          category: layer.category,
          volume: Math.round(layer.volume * 100),
          enabled: layer.enabled
        })),
        createdAt: now,
        updatedAt: now,
        tags
      }

      // Save to store (will auto-persist to localStorage)
      addMix(mix)

      // Close dialog
      setShowSaveDialog(false)

      // Show success message
      const message = finalName !== name
        ? `Mix saved as "${finalName}" (name was already in use)`
        : `Mix "${finalName}" saved successfully!`
      setErrorMessage(message)
      setTimeout(() => setErrorMessage(null), 3000)
    } catch (error: any) {
      // Handle localStorage quota error
      if (error.name === 'QuotaExceededError') {
        setErrorMessage('Storage quota exceeded. Please delete some old mixes.')
      } else {
        setErrorMessage('Failed to save mix. Please try again.')
      }
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const handleOpenSaveDialog = () => {
    if (activeLayers.length === 0) {
      setErrorMessage('Add at least one sound to save a mix')
      setTimeout(() => setErrorMessage(null), 3000)
      return
    }
    setShowSaveDialog(true)
  }

  const filteredSounds = SOUND_CATALOG.filter((sound) =>
    sound.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sound.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background pb-32">
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-10 py-8 pb-32">
        {/* Error Toast */}
        {errorMessage && (
          <div className="fixed top-20 right-4 z-50 max-w-md">
            <div className="bg-red-500/10 border border-red-500 p-4 rounded-xl backdrop-blur-md">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-red-500">error</span>
                <p className="text-red-500">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Autoplay Prompt */}
        {showAutoplayPrompt && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card-light dark:bg-card-dark max-w-md mx-4 p-6 rounded-xl border border-border backdrop-blur-md">
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Audio Playback Blocked
              </h3>
              <p className="text-text-secondary mb-4">
                Your browser requires user interaction to play audio. Click the button below to start.
              </p>
              <button
                onClick={handlePlayPause}
                className="w-full px-4 py-2 bg-primary text-white dark:text-[#111618] font-bold rounded-lg hover:bg-primary/90 transition-colors"
              >
                Start Playing
              </button>
            </div>
          </div>
        )}

        {/* Focus Mode Presets */}
        <FocusModePresets
          presets={FOCUS_MODE_PRESETS}
          activePresetId={activePresetId}
          onSelectPreset={handleSelectPreset}
        />

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <h3 className="text-xl font-bold text-text-primary">Sound Layers</h3>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64 group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-gray-400 !text-[20px] group-focus-within:text-primary transition-colors">
                  search
                </span>
              </div>
              <input
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-border rounded-lg leading-5 bg-white dark:bg-card text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-all shadow-sm"
                placeholder="Find new sounds..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              className="hidden sm:flex items-center justify-center size-10 shrink-0 rounded-lg border border-gray-200 dark:border-border bg-white dark:bg-card text-gray-500 hover:text-primary hover:border-primary/50 transition-colors"
              title="Filter Categories"
            >
              <span className="material-symbols-outlined !text-[20px]">tune</span>
            </button>
          </div>
        </div>

        {/* Sound Categories */}
        <SoundCategoriesCollapsible
          sounds={filteredSounds}
          activeLayers={activeLayers}
          onVolumeChange={handleVolumeChange}
          onToggleMute={handleToggleMute}
        />
      </main>

      {/* Floating Controls */}
      <FloatingControls
        isPlaying={isPlaying}
        masterVolume={masterVolume}
        onPlayPause={handlePlayPause}
        onMasterVolumeChange={handleMasterVolumeChange}
        onSaveMix={handleOpenSaveDialog}
        disabled={!activeLayers.some((layer) => layer.volume > 0)}
      />

      {/* Save Mix Dialog */}
      <SaveMixDialog
        isOpen={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        onSave={handleSaveMix}
        defaultName={`Mix ${new Date().toLocaleDateString()}`}
      />
    </div>
  )
}

export default function MixerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-text-secondary">Loading mixer...</div>
      </div>
    }>
      <MixerContent />
    </Suspense>
  )
}
