// lib/storage/LocalStorage.ts

export class LocalStorageManager {
  private storageAvailable: boolean

  constructor() {
    this.storageAvailable = this.checkStorageAvailable()
  }

  private checkStorageAvailable(): boolean {
    try {
      const test = '__storage_test__'
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return true
    } catch (e) {
      return false
    }
  }

  setItem<T>(key: string, value: T): boolean {
    if (!this.storageAvailable) {
      console.warn('localStorage is not available')
      return false
    }

    try {
      const serialized = JSON.stringify(value)
      localStorage.setItem(key, serialized)
      return true
    } catch (e: any) {
      if (e.name === 'QuotaExceededError') {
        console.error('localStorage quota exceeded')
      } else {
        console.error('Failed to save to localStorage:', e)
      }
      return false
    }
  }

  getItem<T>(key: string): T | null {
    if (!this.storageAvailable) {
      return null
    }

    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (e) {
      console.error('Failed to read from localStorage:', e)
      return null
    }
  }

  removeItem(key: string): void {
    if (!this.storageAvailable) return
    localStorage.removeItem(key)
  }

  clear(): void {
    if (!this.storageAvailable) return
    localStorage.clear()
  }

  getStorageSize(): number {
    if (!this.storageAvailable) return 0

    let total = 0
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length
      }
    }
    return total
  }

  isQuotaExceeding(threshold: number = 0.9): boolean {
    const maxSize = 5 * 1024 * 1024 // 5MB typical limit
    const currentSize = this.getStorageSize()
    return currentSize / maxSize > threshold
  }
}

export const localStorageManager = new LocalStorageManager()
