// lib/storage/MixSerializer.ts

import { Mix, MixLayer } from '@/types/mix'
import { SoundLayer } from '@/types/sound'

export function serializeMix(
  name: string,
  layers: SoundLayer[],
  tags: string[] = []
): Mix {
  const now = new Date().toISOString()
  const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  const mixLayers: MixLayer[] = layers.map((layer) => ({
    soundId: layer.soundId,
    soundName: layer.soundName,
    category: layer.category,
    volume: Math.round(layer.volume * 100), // Convert 0.0-1.0 to 0-100
    enabled: layer.enabled,
  }))

  return {
    id,
    name,
    layers: mixLayers,
    createdAt: now,
    updatedAt: now,
    tags,
  }
}

export function deserializeMixLayers(mixLayers: MixLayer[]): SoundLayer[] {
  return mixLayers.map((mixLayer, index) => ({
    id: `layer-${index}-${Date.now()}`,
    soundId: mixLayer.soundId,
    soundName: mixLayer.soundName,
    category: mixLayer.category,
    volume: mixLayer.volume / 100, // Convert 0-100 to 0.0-1.0
    enabled: mixLayer.enabled,
    solo: false,
  }))
}

export function updateMixTimestamp(mix: Mix): Mix {
  return {
    ...mix,
    updatedAt: new Date().toISOString(),
  }
}
