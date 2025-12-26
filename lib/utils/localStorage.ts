/**
 * Check if localStorage is available in the current environment
 */
export function isLocalStorageAvailable(): boolean {
  try {
    const test = '__localStorage_test__'
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch (e) {
    return false
  }
}

/**
 * Get localStorage item with error handling
 */
export function getLocalStorageItem(key: string): string | null {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage is not available')
    return null
  }

  try {
    return localStorage.getItem(key)
  } catch (error) {
    console.error('Error reading from localStorage:', error)
    return null
  }
}

/**
 * Set localStorage item with error handling
 */
export function setLocalStorageItem(key: string, value: string): boolean {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage is not available')
    return false
  }

  try {
    localStorage.setItem(key, value)
    return true
  } catch (error) {
    console.error('Error writing to localStorage:', error)
    return false
  }
}

/**
 * Check if localStorage has enough quota
 */
export function checkLocalStorageQuota(): { available: boolean; error?: string } {
  if (!isLocalStorageAvailable()) {
    return { available: false, error: 'localStorage is not available in this browser' }
  }

  try {
    // Try to write a test string
    const testKey = '__quota_test__'
    const testData = 'x'.repeat(1024 * 100) // 100KB test
    localStorage.setItem(testKey, testData)
    localStorage.removeItem(testKey)
    return { available: true }
  } catch (error: any) {
    if (error.name === 'QuotaExceededError') {
      return { available: false, error: 'Storage quota exceeded. Please delete some old mixes.' }
    }
    return { available: false, error: 'Unable to access storage' }
  }
}
