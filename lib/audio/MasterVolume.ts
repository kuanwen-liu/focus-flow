// lib/audio/MasterVolume.ts

/**
 * Utility functions for master volume calculations
 */

export function applyMasterVolume(layerVolume: number, masterVolume: number): number {
  return Math.max(0, Math.min(1, layerVolume * masterVolume))
}

export function volumeToPercentage(volume: number): number {
  return Math.round(volume * 100)
}

export function percentageToVolume(percentage: number): number {
  return Math.max(0, Math.min(100, percentage)) / 100
}

export function volumeToDecibels(volume: number): number {
  if (volume === 0) return -Infinity
  return 20 * Math.log10(volume)
}

export function decibelsToVolume(decibels: number): number {
  if (decibels === -Infinity) return 0
  return Math.pow(10, decibels / 20)
}
