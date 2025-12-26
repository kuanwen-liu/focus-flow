'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { EditHeader } from '@/components/edit/EditHeader'
import { SoundSearch } from '@/components/edit/SoundSearch'
import { LayerEditor } from '@/components/edit/LayerEditor'
import { useMixStore } from '@/lib/state/useMixStore'
import { useAudioStore } from '@/lib/state/useAudioStore'
import { audioController } from '@/lib/audio/AudioController'
import { SOUND_CATALOG } from '@/lib/constants/sounds'
import type { Mix, MixLayer } from '@/types/mix'
import type { SoundLayer } from '@/types/sound'

export default function EditMixPage() {
  const router = useRouter()
  const params = useParams()
  const mixId = params.id as string

  const [mix, setMix] = useState<Mix | null>(null)
  const [mixName, setMixName] = useState('')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showDiscardDialog, setShowDiscardDialog] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const getMixById = useMixStore((state) => state.getMixById)
  const updateMix = useMixStore((state) => state.updateMix)
  const { activeLayers, addLayer, removeLayer, updateLayer, setIsPlaying } = useAudioStore()

  // Load mix on mount
  useEffect(() => {
    const loadedMix = getMixById(mixId)
    if (!loadedMix) {
      // Mix not found, redirect to library
      router.push('/library')
      return
    }

    setMix(loadedMix)
    setMixName(loadedMix.name)

    // Pre-populate AudioController with existing layers
    loadedMix.layers.forEach(async (layer) => {
      const sound = SOUND_CATALOG.find((s) => s.id === layer.soundId)
      if (sound) {
        try {
          await audioController.addLayer(layer.soundId, layer.volume / 100)
        } catch (error) {
          console.error('Failed to load layer:', error)
        }
      }
    })
  }, [mixId, getMixById, router])

  // Subscribe to audio controller events
  useEffect(() => {
    const handleLayerAdded = ({ layer }: any) => {
      addLayer(layer)
      setHasUnsavedChanges(true)
    }

    const handleLayerRemoved = ({ layerId }: any) => {
      removeLayer(layerId)
      setHasUnsavedChanges(true)
    }

    const handleVolumeChange = ({ type, layerId, volume }: any) => {
      if (type === 'layer' && layerId) {
        updateLayer(layerId, { volume })
        setHasUnsavedChanges(true)
      }
    }

    const handleSoloChange = ({ layerId, solo }: any) => {
      updateLayer(layerId, { solo })
      setHasUnsavedChanges(true)
    }

    audioController.on('layerAdded', handleLayerAdded)
    audioController.on('layerRemoved', handleLayerRemoved)
    audioController.on('volumeChange', handleVolumeChange)
    audioController.on('soloChange', handleSoloChange)

    return () => {
      audioController.off('layerAdded', handleLayerAdded)
      audioController.off('layerRemoved', handleLayerRemoved)
      audioController.off('volumeChange', handleVolumeChange)
      audioController.off('soloChange', handleSoloChange)
    }
  }, [addLayer, removeLayer, updateLayer])

  // Warn before leaving page with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])

  const handleNameChange = (name: string) => {
    setMixName(name)
    setHasUnsavedChanges(true)
  }

  const handleAddSound = async (soundId: string) => {
    try {
      await audioController.addLayer(soundId, 0.6)
    } catch (error) {
      console.error('Failed to add sound:', error)
      setErrorMessage('Failed to add sound')
      setTimeout(() => setErrorMessage(null), 3000)
    }
  }

  const handleVolumeChange = (layerId: string, volume: number) => {
    audioController.setLayerVolume(layerId, volume)
  }

  const handleRemoveLayer = (layerId: string) => {
    audioController.removeLayer(layerId)
  }

  const handleSoloLayer = (layerId: string) => {
    const layer = activeLayers.find((l) => l.id === layerId)
    if (layer) {
      audioController.toggleSolo(layerId)
    }
  }

  const handleSave = () => {
    if (!mix) return

    if (!mixName.trim()) {
      setErrorMessage('Mix name cannot be empty')
      setTimeout(() => setErrorMessage(null), 3000)
      return
    }

    if (activeLayers.length === 0) {
      setErrorMessage('Mix must have at least one layer')
      setTimeout(() => setErrorMessage(null), 3000)
      return
    }

    // Update mix
    const updatedLayers: MixLayer[] = activeLayers.map((layer) => ({
      soundId: layer.soundId,
      soundName: layer.soundName,
      category: layer.category,
      volume: Math.round(layer.volume * 100),
      enabled: layer.enabled
    }))

    updateMix(mixId, {
      name: mixName,
      layers: updatedLayers,
      updatedAt: new Date().toISOString()
    })

    setHasUnsavedChanges(false)
    setErrorMessage('Mix saved successfully!')
    setTimeout(() => {
      setErrorMessage(null)
      router.push('/library')
    }, 1500)
  }

  const handleDiscard = () => {
    if (hasUnsavedChanges) {
      setShowDiscardDialog(true)
    } else {
      router.push('/library')
    }
  }

  const confirmDiscard = () => {
    // Clear all layers
    activeLayers.forEach((layer) => {
      audioController.removeLayer(layer.id)
    })

    // Stop playback
    audioController.pauseAll()
    setIsPlaying(false)

    router.push('/library')
  }

  if (!mix) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-text-secondary">Loading mix...</div>
      </div>
    )
  }

  const popularSounds = [
    { id: 'fire-crackling', name: 'Fireplace' },
    { id: 'waves-ocean', name: 'Ocean Waves' },
    { id: 'wind-gentle', name: 'Wind' },
    { id: 'coffee-shop', name: 'Coffee Shop' }
  ]

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Error Toast */}
      {errorMessage && (
        <div className="fixed top-20 right-4 z-50 max-w-md">
          <motion.div
            className={`${
              errorMessage.includes('success')
                ? 'bg-green-500/10 border-green-500'
                : 'bg-red-500/10 border-red-500'
            } border p-4 rounded-xl backdrop-blur-md`}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
          >
            <div className="flex items-center gap-2">
              <span className={`material-symbols-outlined ${
                errorMessage.includes('success') ? 'text-green-500' : 'text-red-500'
              }`}>
                {errorMessage.includes('success') ? 'check_circle' : 'error'}
              </span>
              <p className={errorMessage.includes('success') ? 'text-green-500' : 'text-red-500'}>
                {errorMessage}
              </p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Discard Confirmation Dialog */}
      <AnimatePresence>
        {showDiscardDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDiscardDialog(false)}
            />
            <motion.div
              className="relative bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <h2 className="text-xl font-bold text-text-primary mb-2">Discard Changes?</h2>
              <p className="text-text-secondary mb-6">
                You have unsaved changes. Are you sure you want to discard them?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDiscardDialog(false)}
                  className="flex-1 px-6 py-3 bg-background border border-border rounded-lg text-text-primary font-medium hover:border-primary transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDiscard}
                  className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                >
                  Discard
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <EditHeader
          mixName={mixName}
          onNameChange={handleNameChange}
          hasUnsavedChanges={hasUnsavedChanges}
        />

        {/* Sound Search */}
        <div className="mb-6">
          <SoundSearch
            onAddSound={handleAddSound}
            activeSoundIds={activeLayers.map((l) => l.soundId)}
          />
        </div>

        {/* Popular Sound Suggestions */}
        <div className="mb-6">
          <p className="text-sm text-text-secondary mb-3">Quick add:</p>
          <div className="flex flex-wrap gap-2">
            {popularSounds.map((sound) => {
              const isAdded = activeLayers.some((l) => l.soundId === sound.id)
              return (
                <motion.button
                  key={sound.id}
                  onClick={() => !isAdded && handleAddSound(sound.id)}
                  disabled={isAdded}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isAdded
                      ? 'bg-primary/5 text-text-secondary cursor-not-allowed'
                      : 'bg-card border border-border text-text-primary hover:border-primary hover:bg-primary/10'
                  }`}
                  whileHover={!isAdded ? { scale: 1.05 } : {}}
                  whileTap={!isAdded ? { scale: 0.95 } : {}}
                >
                  {sound.name}
                  {isAdded && <span className="ml-2 text-xs">✓</span>}
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Active Layers */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            Active Layers ({activeLayers.length})
          </h2>

          {activeLayers.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <span className="material-symbols-outlined text-6xl text-text-secondary mb-3">
                music_off
              </span>
              <p className="text-text-secondary">
                No sounds added yet. Search above to add sounds to your mix.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {activeLayers.map((layer) => (
                  <LayerEditor
                    key={layer.id}
                    layer={layer}
                    onVolumeChange={handleVolumeChange}
                    onRemove={handleRemoveLayer}
                    onSolo={handleSoloLayer}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border p-4 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={handleDiscard}
            className="px-6 py-3 bg-background border border-border rounded-lg text-text-primary font-medium hover:border-red-500 hover:text-red-500 transition-colors"
          >
            Discard Changes
          </button>
          <div className="flex items-center gap-3">
            {hasUnsavedChanges && (
              <span className="text-sm text-orange-500 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                </span>
                Unsaved changes
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={!hasUnsavedChanges}
              className="px-8 py-3 bg-primary text-dark rounded-lg font-medium hover:shadow-[0_0_20px_rgba(19,182,236,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Save Mix
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
