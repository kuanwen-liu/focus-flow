# Research: Focus Mixer Core Application

**Feature**: Focus Mixer Core Application
**Branch**: 001-core-mixer-app
**Date**: 2025-12-25
**Status**: Phase 0 Complete

This document captures research findings, technology decisions, and best practices for implementing the Focus Mixer application.

---

## 1. Next.js 16.1.1 App Router Best Practices

### Decision: Use App Router with Client Components for Audio

**Rationale**:
- Audio playback requires browser APIs only available on the client
- App Router provides modern routing with React Server Components by default
- Need to opt-in to client components for audio/state management

**Implementation**:

```typescript
// app/mixer/page.tsx - Mark as client component
'use client'

import { useAudioStore } from '@/lib/state/useAudioStore'

export default function MixerPage() {
  // Can now use hooks and browser APIs
}
```

**Best Practices**:
1. **Server components by default**: Keep layout.tsx and page.tsx as server components where possible
2. **Client components for interactivity**: Mark components with 'use client' only when they need:
   - React hooks (useState, useEffect)
   - Browser APIs (Audio, localStorage)
   - Event handlers
3. **Composition pattern**: Import client components into server components (not vice versa)

**Dynamic Routes**:
- `/edit/[id]` uses dynamic route segments
- Access mix ID via `params.id` in page component
- Type-safe params with TypeScript: `{ params: { id: string } }`

**Public Folder Asset Serving**:
- Place sound files in `public/sounds/`
- Reference in Audio elements as `/sounds/rain/main-rain.mp4`
- Next.js serves public folder at root URL
- No build processing for sound files (served as-is)

**Alternatives Considered**:
- Pages Router: Rejected due to older API, less modern routing
- Remix: Rejected to stay within Next.js ecosystem

---

## 2. HTML5 Audio API for Multi-Layer Playback

### Decision: Use Multiple Audio Element Instances with Volume Control

**Rationale**:
- HTML5 Audio API is built-in, no external dependencies
- Each Audio element can have independent volume and playback state
- Web Audio API is more powerful but overkill for simple layering

**Implementation Pattern**:

```typescript
// lib/audio/AudioLayer.ts
class AudioLayer {
  private audioElement: HTMLAudioElement
  private soundId: string
  private _volume: number = 0.5

  constructor(soundPath: string) {
    this.audioElement = new Audio(soundPath)
    this.audioElement.loop = true
    this.audioElement.volume = this._volume
  }

  play() {
    return this.audioElement.play() // Returns Promise
  }

  pause() {
    this.audioElement.pause()
  }

  setVolume(volume: number) {
    // Volume range 0.0 to 1.0
    this._volume = Math.max(0, Math.min(1, volume))
    this.audioElement.volume = this._volume
  }
}
```

**Synchronizing Play/Pause**:
```typescript
// lib/audio/AudioController.ts
class AudioController {
  private layers: Map<string, AudioLayer> = new Map()

  async playAll() {
    const playPromises = Array.from(this.layers.values()).map(layer =>
      layer.play()
    )
    await Promise.all(playPromises)
  }

  pauseAll() {
    this.layers.forEach(layer => layer.pause())
  }
}
```

**Master Volume Implementation**:
```typescript
setMasterVolume(master: number) {
  this.masterVolume = Math.max(0, Math.min(1, master))

  // Apply master to all layers
  this.layers.forEach((layer, id) => {
    const layerVolume = this.layerVolumes.get(id) || 0.5
    layer.setVolume(layerVolume * this.masterVolume)
  })
}
```

**Seamless Looping**:
- Set `audioElement.loop = true` on each Audio instance
- Browser handles loop transition automatically
- No gap between loop iterations for properly encoded files

**Error Handling**:
```typescript
audioElement.addEventListener('error', (e) => {
  const error = audioElement.error
  if (error) {
    switch (error.code) {
      case MediaError.MEDIA_ERR_ABORTED:
        console.error('Audio load aborted')
        break
      case MediaError.MEDIA_ERR_NETWORK:
        console.error('Network error loading audio')
        break
      case MediaError.MEDIA_ERR_DECODE:
        console.error('Audio decode error')
        break
      case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
        console.error('Audio format not supported')
        break
    }
  }
})
```

**Best Practices**:
1. Always handle play() promise rejection (autoplay policy)
2. Use `canplaythrough` event before playing to avoid glitches
3. Preload audio with `audioElement.load()` on component mount
4. Clean up Audio elements on unmount to prevent memory leaks

**Alternatives Considered**:
- Web Audio API: More powerful but complex, unnecessary for basic mixing
- Howler.js library: Adds dependency when native API sufficient

---

## 3. Zustand Persist Middleware Configuration

### Decision: Use Zustand with Persist Middleware for localStorage

**Rationale**:
- Zustand is lightweight (1KB), simpler than Redux
- Persist middleware handles localStorage serialization automatically
- Built-in TypeScript support
- No provider wrapper needed (unlike Context API)

**Implementation**:

```typescript
// lib/state/useMixStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Mix } from '@/types/mix'

interface MixStore {
  mixes: Mix[]
  currentMixId: string | null
  addMix: (mix: Mix) => void
  updateMix: (id: string, updates: Partial<Mix>) => void
  deleteMix: (id: string) => void
  setCurrentMix: (id: string) => void
}

export const useMixStore = create<MixStore>()(
  persist(
    (set, get) => ({
      mixes: [],
      currentMixId: null,

      addMix: (mix) => set((state) => ({
        mixes: [...state.mixes, mix]
      })),

      updateMix: (id, updates) => set((state) => ({
        mixes: state.mixes.map(m =>
          m.id === id ? { ...m, ...updates } : m
        )
      })),

      deleteMix: (id) => set((state) => ({
        mixes: state.mixes.filter(m => m.id !== id)
      })),

      setCurrentMix: (id) => set({ currentMixId: id })
    }),
    {
      name: 'focus-mixer-mixes', // localStorage key
      version: 1,
      // Hydration happens automatically
    }
  )
)
```

**Avoiding SSR Hydration Mismatches**:

```typescript
// components/MixLibrary.tsx
'use client'

import { useMixStore } from '@/lib/state/useMixStore'
import { useEffect, useState } from 'react'

export function MixLibrary() {
  const [isHydrated, setIsHydrated] = useState(false)
  const mixes = useMixStore(state => state.mixes)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  if (!isHydrated) {
    return <div>Loading...</div>
  }

  return <div>{/* Render mixes */}</div>
}
```

**Performance Optimization for Large State**:

```typescript
// Selector pattern - only re-render when specific data changes
const mixCount = useMixStore(state => state.mixes.length) // ✅ Efficient
const allState = useMixStore() // ❌ Re-renders on any state change

// For 50 mixes, use pagination
const paginatedMixes = useMixStore(state =>
  state.mixes.slice(page * 10, (page + 1) * 10)
)
```

**Custom Storage Engine (for quota handling)**:

```typescript
import { PersistStorage } from 'zustand/middleware'

const localStorageWithQuotaHandling: PersistStorage<MixStore> = {
  getItem: (name) => {
    const value = localStorage.getItem(name)
    return value ? JSON.parse(value) : null
  },
  setItem: (name, value) => {
    try {
      localStorage.setItem(name, JSON.stringify(value))
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        // Notify user to delete old mixes
        console.error('localStorage quota exceeded')
      }
    }
  },
  removeItem: (name) => localStorage.removeItem(name)
}
```

**Best Practices**:
1. Use selectors to prevent unnecessary re-renders
2. Separate stores by concern (mixStore, audioStore, themeStore)
3. Add version number to persist config for migration support
4. Handle hydration client-side to avoid SSR mismatches

**Alternatives Considered**:
- Redux Toolkit: Too heavy for local-first app
- React Context: Performance issues with frequent updates
- Jotai/Recoil: Less mature ecosystem than Zustand

---

## 4. Framer Motion Glassmorphism and Glow Effects

### Decision: Use Framer Motion for Animations with Tailwind Utilities

**Rationale**:
- Framer Motion provides declarative animations
- Integrates seamlessly with React and Tailwind
- Performance-optimized (uses GPU acceleration)
- Matches the subtle effects in `/docs` designs

**Glassmorphism Implementation**:

```tsx
// components/ui/Card.tsx
import { motion } from 'framer-motion'

export function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  )
}
```

**CSS for Glassmorphism** (Tailwind utilities):
- `backdrop-blur-md`: 12px blur
- `bg-white/10`: 10% opacity background
- `border-white/20`: 20% opacity border

**Glow Effect on Hover**:

```tsx
// components/mixer/VolumeSlider.tsx
import { motion } from 'framer-motion'

export function VolumeSlider() {
  return (
    <motion.div
      className="relative cursor-pointer"
      whileHover={{
        boxShadow: '0 0 10px 2px rgba(19, 182, 236, 0.3)'
      }}
      transition={{ duration: 0.15 }}
    >
      {/* Slider thumb */}
    </motion.div>
  )
}
```

**Primary Button Shadow**:

```tsx
<motion.button
  className="bg-primary text-dark rounded-lg px-8 py-3"
  whileHover={{
    boxShadow: '0 0 20px rgba(19,182,236,0.4)',
    scale: 1.05
  }}
  whileTap={{ scale: 0.95 }}
  transition={{ duration: 0.2 }}
>
  Start Mixing
</motion.button>
```

**Performance Optimization**:

```tsx
// Use layout animations for size/position changes
<motion.div layout transition={{ type: 'spring', damping: 20 }}>

// Optimize with layoutId for shared element transitions
<motion.div layoutId="active-mix" />

// Reduce motion for accessibility
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const transition = prefersReducedMotion
  ? { duration: 0 }
  : { duration: 0.3 }
```

**60fps Animation Checklist**:
1. Animate transform and opacity only (GPU-accelerated)
2. Avoid animating width/height/top/left (causes layout reflow)
3. Use `will-change` sparingly for expensive animations
4. Test on lower-end devices (mobile, older laptops)

**Best Practices**:
1. Keep animations subtle (0.2-0.3s duration)
2. Use `transition={{ type: 'spring' }}` for natural feel
3. Respect `prefers-reduced-motion` user preference
4. Avoid animating more than 5-10 elements simultaneously

**Alternatives Considered**:
- CSS transitions: Less powerful, no declarative API
- React Spring: Steeper learning curve than Framer Motion
- GSAP: Heavier library, overkill for simple animations

---

## 5. Tailwind CSS Variable Integration

### Decision: Extend Tailwind Config with CSS Variables

**Rationale**:
- CSS variables enable runtime theme switching (for future light mode)
- Tailwind's `extend` preserves default utilities
- Matches constitution requirement for variable-based colors

**Implementation**:

```css
/* app/globals.css */
:root {
  /* Primary Colors */
  --color-primary: #13b6ec;
  --color-background-light: #f6f8f8;
  --color-background-dark: #101d22;
  --color-card-dark: #1c292f;
  --color-surface-dark: #1e2a2f;

  /* Borders */
  --color-border-light: #e5e7eb;
  --color-border-dark: #283539;
  --color-border-darker: #3b4d54;

  /* Text */
  --color-text-dark: #111618;
  --color-text-light: #ffffff;
  --color-text-secondary: #9db2b9;

  /* Sound category colors */
  --color-blue-sound: #3b82f6;
  --color-green-sound: #10b981;
  --color-cyan-sound: #06b6d4;
  --color-amber-sound: #f59e0b;
  --color-orange-sound: #f97316;
  --color-gray-sound: #6b7280;
}

/* Dark mode (default) */
.dark {
  --color-background: var(--color-background-dark);
  --color-card: var(--color-card-dark);
  --color-border: var(--color-border-dark);
  --color-text: var(--color-text-light);
}

/* Light mode (commented out for future) */
/*
.light {
  --color-background: var(--color-background-light);
  --color-card: var(--color-card-light);
  --color-border: var(--color-border-light);
  --color-text: var(--color-text-dark);
}
*/
```

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        background: 'var(--color-background)',
        card: 'var(--color-card)',
        border: 'var(--color-border)',
        'text-primary': 'var(--color-text)',
        'text-secondary': 'var(--color-text-secondary)',
      },
      fontFamily: {
        display: ['Manrope', 'sans-serif'],
      },
      backdropBlur: {
        md: '12px',
      },
    },
  },
  plugins: [],
}

export default config
```

**Usage in Components**:

```tsx
// ✅ Correct: Using Tailwind utility with variable
<div className="bg-background text-text-primary border border-border">

// ❌ Incorrect: Hard-coded color
<div className="bg-[#101d22]">
```

**Dynamic Theme Switching (for future light mode)**:

```typescript
// lib/state/useThemeStore.ts
import { create } from 'zustand'

interface ThemeStore {
  theme: 'dark' | 'light'
  setTheme: (theme: 'dark' | 'light') => void
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: 'dark',
  setTheme: (theme) => {
    document.documentElement.classList.remove('dark', 'light')
    document.documentElement.classList.add(theme)
    set({ theme })
  }
}))
```

**Responsive Design Best Practices**:
1. Mobile-first breakpoints: `sm:`, `md:`, `lg:`, `xl:`
2. Container queries for component-level responsive (`@container`)
3. Responsive typography: `text-base md:text-lg lg:text-xl`
4. Responsive spacing: `p-4 md:p-6 lg:p-8`

**Alternatives Considered**:
- CSS-in-JS (styled-components, Emotion): Adds runtime overhead, Tailwind more performant
- SASS variables: Not runtime switchable like CSS variables

---

## 6. Mobile-Responsive Audio Playback

### Decision: Handle Autoplay Policies with User Interaction

**Rationale**:
- iOS Safari and mobile Chrome block autoplay without user gesture
- Must wait for user interaction (click, tap) before calling play()
- Touch gestures require different handling than mouse events

**Autoplay Policy Handling**:

```typescript
// lib/audio/AudioController.ts
async playAll() {
  try {
    const playPromises = Array.from(this.layers.values()).map(layer =>
      layer.play()
    )
    await Promise.all(playPromises)
  } catch (error) {
    if (error.name === 'NotAllowedError') {
      // User hasn't interacted yet
      console.warn('Autoplay blocked. Waiting for user interaction.')
      this.showPlayButton() // Show manual play button
    } else {
      console.error('Audio playback error:', error)
    }
  }
}
```

**Touch Gesture Handling for Sliders**:

```tsx
// components/mixer/VolumeSlider.tsx
import { useRef, useEffect } from 'react'

export function VolumeSlider({ onChange }: { onChange: (value: number) => void }) {
  const sliderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const slider = sliderRef.current
    if (!slider) return

    const handleTouch = (e: TouchEvent) => {
      e.preventDefault() // Prevent scroll on touch
      const touch = e.touches[0]
      const rect = slider.getBoundingClientRect()
      const percent = (touch.clientX - rect.left) / rect.width
      onChange(Math.max(0, Math.min(1, percent)))
    }

    slider.addEventListener('touchmove', handleTouch)
    slider.addEventListener('touchstart', handleTouch)

    return () => {
      slider.removeEventListener('touchmove', handleTouch)
      slider.removeEventListener('touchstart', handleTouch)
    }
  }, [onChange])

  return <div ref={sliderRef} className="touch-none" />
}
```

**Performance Optimization for Mobile**:

```typescript
// Limit simultaneous audio layers on mobile
const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent)
const MAX_LAYERS = isMobile ? 5 : 10

// Use lower quality audio on mobile (if needed)
const audioPath = isMobile
  ? `/sounds/${category}/mobile-${name}.mp4`
  : `/sounds/${category}/main-${name}.mp4`

// Preload only essential sounds
if (!isMobile) {
  audioElement.preload = 'auto'
} else {
  audioElement.preload = 'metadata' // Load metadata only
}
```

**Browser Compatibility Matrix**:

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| HTML5 Audio | ✅ | ✅ | ✅ | ✅ |
| Multiple instances | ✅ | ✅ | ✅ | ✅ |
| Autoplay policy | 🟡 Gesture required | ✅ | 🟡 Gesture required | 🟡 Gesture required |
| Loop seamless | ✅ | ✅ | ✅ | ✅ |
| Volume control | ✅ | ✅ | ✅ | ✅ |

**Best Practices**:
1. Always require user interaction before first play()
2. Use `touch-action: none` CSS to prevent scroll during slider drag
3. Test on real devices (iOS Safari, Android Chrome)
4. Provide visual feedback when autoplay is blocked
5. Optimize audio file sizes for mobile bandwidth

**Alternatives Considered**:
- Web Audio API: Better for advanced audio processing, overkill here
- Howler.js: Abstracts browser differences but adds dependency

---

## Summary of Decisions

| Technology | Decision | Rationale |
|-----------|----------|-----------|
| Framework | Next.js 16.1.1 App Router | Modern routing, React Server Components, TypeScript support |
| Audio | HTML5 Audio API (multiple instances) | Native, no dependencies, sufficient for layering |
| State | Zustand with persist middleware | Lightweight, TypeScript-first, automatic localStorage sync |
| Animations | Framer Motion | Declarative, performant, integrates with Tailwind |
| Styling | Tailwind CSS + CSS Variables | Utility-first, runtime theme switching, matches `/docs` |
| Mobile | Touch gestures + autoplay handling | Required for iOS/Android compatibility |
| Testing | Vitest + Playwright | Fast unit tests, reliable E2E |
| Type Safety | TypeScript 5.3+ | Catches errors early, better DX |

All decisions align with constitution principles and support the feature requirements without unnecessary complexity.
