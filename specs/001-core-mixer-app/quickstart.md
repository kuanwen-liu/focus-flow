# Quickstart Guide: Focus Mixer Core Application

**Feature**: Focus Mixer Core Application
**Branch**: 001-core-mixer-app
**Date**: 2025-12-25

This guide will help you get the Focus Mixer application running locally and understand the development workflow.

---

## Prerequisites

- **Node.js**: 18.17 or later
- **npm**: 9.x or later (or yarn/pnpm)
- **Git**: For version control
- **VS Code** (recommended): With ESLint and Prettier extensions

---

## Initial Setup

### 1. Install Dependencies

```bash
# From repository root
npm install
```

This will install:
- Next.js 14
- React 18
- TypeScript 5.3+
- Tailwind CSS 3.4+
- Framer Motion 11.x
- Zustand 4.x
- Dev dependencies (Vitest, Playwright, ESLint, Prettier)

### 2. Environment Configuration

Create `.env.local` in the repository root:

```bash
# .env.local
# Currently no environment variables needed for local-first app
# Add future API keys here when cloud sync is implemented
```

### 3. Sound Files Setup

The sound files are already in `/sounds` folder. Verify they're accessible:

```bash
ls -R sounds/

# Expected output:
# sounds/rain/main-rain.mp4
# sounds/rain/glue-rain.mp4
# sounds/thunder/main-thunder.mp4
# ... (all 10 categories)
```

If sounds are missing, they should be in the repository. Contact the team if files are not present.

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Expected**: You should see the Landing Page with "Find Your Frequency" hero section.

---

## Project Structure Overview

```
focus-flow3/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Landing page (/)
│   ├── mixer/             # Mixer interface (/mixer)
│   ├── library/           # My Mixes (/library)
│   ├── edit/[id]/         # Edit mix (/edit/[id])
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles + CSS variables
│
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── landing/          # Landing page components
│   ├── mixer/            # Mixer interface components
│   ├── library/          # My Mixes components
│   ├── edit/             # Edit mix components
│   └── layout/           # Layout components (Header, Footer)
│
├── lib/                   # Business logic
│   ├── audio/            # Audio controller and layers
│   ├── storage/          # localStorage abstraction
│   ├── state/            # Zustand stores
│   └── constants/        # Sound catalog, colors, routes
│
├── types/                 # TypeScript definitions
│   ├── mix.ts
│   ├── sound.ts
│   ├── audio.ts
│   └── theme.ts
│
├── public/
│   └── sounds/           # Symlink to /sounds folder
│
├── __tests__/            # Test files
│   ├── components/
│   ├── lib/
│   └── e2e/
│
└── specs/001-core-mixer-app/  # Feature documentation
    ├── spec.md
    ├── plan.md
    ├── research.md
    ├── data-model.md
    ├── quickstart.md
    └── contracts/
```

---

## Common Development Tasks

### Adding a New Sound

1. **Add sound files to `/sounds`**:

```bash
# Create category folder if needed
mkdir -p sounds/new-category

# Add main and glue files
cp /path/to/main-newsound.mp4 sounds/new-category/
cp /path/to/glue-newsound.mp4 sounds/new-category/
```

2. **Update sound catalog** in `lib/constants/sounds.ts`:

```typescript
export const SOUND_CATALOG: SoundDefinition[] = [
  // ... existing sounds
  {
    id: 'newsound-id',
    name: 'New Sound Name',
    category: 'Nature Sounds', // or appropriate category
    icon: 'icon_name', // Material Symbol icon
    color: 'blue-500', // Category color
    mainPath: '/sounds/new-category/main-newsound.mp4',
    gluePath: '/sounds/new-category/glue-newsound.mp4',
    description: 'Description of the sound'
  }
]
```

3. **Verify sound appears**:
   - Navigate to `/mixer`
   - Check if new sound card appears in the appropriate category
   - Click to add it to the mix and verify audio plays

---

### Creating a New Component

1. **Create component file**:

```bash
# Example: Create a new mixer component
touch components/mixer/NewComponent.tsx
```

2. **Use component template**:

```tsx
// components/mixer/NewComponent.tsx
'use client' // If using hooks or browser APIs

import { FC } from 'react'

interface NewComponentProps {
  // Define props
}

export const NewComponent: FC<NewComponentProps> = ({ /* props */ }) => {
  return (
    <div className="bg-background text-text-primary">
      {/* Component JSX */}
    </div>
  )
}
```

3. **Import and use**:

```tsx
// app/mixer/page.tsx
import { NewComponent } from '@/components/mixer/NewComponent'

export default function MixerPage() {
  return <NewComponent />
}
```

---

### Adding a New Route

1. **Create route folder and page**:

```bash
mkdir -p app/new-route
touch app/new-route/page.tsx
```

2. **Define page component**:

```tsx
// app/new-route/page.tsx
export default function NewRoutePage() {
  return (
    <div>
      <h1>New Route</h1>
    </div>
  )
}
```

3. **Add navigation link** in `components/layout/Header.tsx`:

```tsx
<Link href="/new-route">New Route</Link>
```

---

### Working with Zustand State

1. **Access state in a component**:

```tsx
'use client'

import { useMixStore } from '@/lib/state/useMixStore'

export function MixList() {
  // Subscribe to specific state slice (prevents unnecessary re-renders)
  const mixes = useMixStore(state => state.mixes)
  const addMix = useMixStore(state => state.addMix)

  return (
    <div>
      {mixes.map(mix => (
        <div key={mix.id}>{mix.name}</div>
      ))}
      <button onClick={() => addMix(newMix)}>Add Mix</button>
    </div>
  )
}
```

2. **Update state**:

```tsx
// In a component
const updateMix = useMixStore(state => state.updateMix)

const handleSave = () => {
  updateMix(mixId, { name: newName })
  // Zustand persist middleware auto-saves to localStorage
}
```

---

### Using the Audio Controller

1. **Initialize audio controller**:

```tsx
'use client'

import { useEffect } from 'react'
import { audioController } from '@/lib/audio/AudioController'

export function MixerInterface() {
  useEffect(() => {
    // Subscribe to audio events
    const handlePlaybackChange = ({ isPlaying }) => {
      console.log('Playing:', isPlaying)
    }

    audioController.on('playbackStateChange', handlePlaybackChange)

    return () => {
      audioController.off('playbackStateChange', handlePlaybackChange)
    }
  }, [])

  const handlePlay = async () => {
    try {
      await audioController.playAll()
    } catch (error) {
      console.error('Playback failed:', error)
    }
  }

  return <button onClick={handlePlay}>Play</button>
}
```

2. **Add/remove layers**:

```tsx
// Add a sound layer
audioController.addLayer('rain-heavy', 0.8) // soundId, initial volume

// Remove a layer
audioController.removeLayer('layer-id')

// Set layer volume
audioController.setLayerVolume('layer-id', 0.5) // 0.0 to 1.0
```

---

## Styling Guidelines

### Using CSS Variables

Always use CSS variables for colors (never hard-code hex values):

```tsx
// ✅ Correct
<div className="bg-background text-text-primary border-border">

// ❌ Incorrect
<div className="bg-[#101d22] text-white">
```

### Tailwind Utility Classes

```tsx
// Responsive design
<div className="p-4 md:p-6 lg:p-8">

// Dark mode (default)
<div className="bg-card text-text-primary">

// Hover states
<button className="hover:bg-primary hover:scale-105 transition-all">
```

### Framer Motion Animations

```tsx
import { motion } from 'framer-motion'

<motion.div
  whileHover={{ scale: 1.02 }}
  transition={{ duration: 0.2 }}
>
  {/* Content */}
</motion.div>
```

---

## Testing

### Running Unit Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Running E2E Tests

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run E2E tests
npm run test:e2e

# Run E2E tests in UI mode
npm run test:e2e:ui
```

### Writing a Component Test

```tsx
// __tests__/components/mixer/SoundCard.test.tsx
import { render, screen } from '@testing-library/react'
import { SoundCard } from '@/components/mixer/SoundCard'

describe('SoundCard', () => {
  it('renders sound name', () => {
    render(<SoundCard sound={mockSound} />)
    expect(screen.getByText('Heavy Rain')).toBeInTheDocument()
  })

  it('calls onAdd when clicked', () => {
    const onAdd = jest.fn()
    render(<SoundCard sound={mockSound} onAdd={onAdd} />)

    screen.getByText('Heavy Rain').click()
    expect(onAdd).toHaveBeenCalledWith(mockSound.id)
  })
})
```

---

## Debugging

### Browser DevTools

1. **Check audio loading**:
   - Open DevTools → Network tab
   - Filter by "media"
   - Verify sound files are loading (status 200)

2. **Inspect localStorage**:
   - Application tab → Local Storage → localhost:3000
   - Look for `focus-mixer-mixes` key
   - Expand to see saved mixes JSON

3. **Audio playback issues**:
   - Console tab → Check for autoplay blocking errors
   - Look for MediaError messages

### Common Issues

**Issue**: Sounds not playing
- **Check**: Browser autoplay policy (require user interaction)
- **Fix**: Click play button after page load

**Issue**: localStorage not persisting
- **Check**: Browser privacy settings (incognito mode blocks localStorage)
- **Fix**: Use normal browsing mode

**Issue**: Hydration mismatch errors
- **Check**: Using Zustand persist without hydration guard
- **Fix**: Use `isHydrated` pattern (see research.md)

---

## Code Quality

### Linting

```bash
# Run ESLint
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

### Formatting

```bash
# Format with Prettier
npm run format

# Check formatting
npm run format:check
```

### Type Checking

```bash
# Run TypeScript compiler
npm run type-check
```

---

## Building for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run start
```

Build output will be in `.next/` folder.

---

## Design System Reference

### Colors (from constitution)

- **Primary**: `#13b6ec` (cyan accent)
- **Background Dark**: `#101d22`
- **Card Dark**: `#1c292f`
- **Border Dark**: `#283539`, `#3b4d54`

### Typography

- **Font**: Manrope (300, 400, 500, 600, 700)
- **Headings**: font-bold, tracking-tight
- **Body**: font-normal, leading-normal

### Icons

- **Library**: Material Symbols Outlined (Google Fonts)
- **Usage**: `<span className="material-symbols-outlined">icon_name</span>`

---

## Getting Help

1. **Documentation**:
   - Feature spec: `specs/001-core-mixer-app/spec.md`
   - Architecture: `specs/001-core-mixer-app/plan.md`
   - Research: `specs/001-core-mixer-app/research.md`

2. **Reference Designs**:
   - `/docs/landing-page.html`
   - `/docs/ambient-mixer-interface.html`
   - `/docs/manage-saved-mixes.html`
   - `/docs/edit-saved-mix.html`

3. **Constitution**:
   - `.specify/memory/constitution.md` - Project principles and standards

4. **Ask Questions**:
   - Check existing components for patterns
   - Review test files for usage examples
   - Consult research.md for technology decisions

---

## Next Steps

1. **Familiarize yourself with the codebase**:
   - Read through main page components (`app/`)
   - Explore sound catalog (`lib/constants/sounds.ts`)
   - Review data model (`specs/001-core-mixer-app/data-model.md`)

2. **Try the app**:
   - Navigate through all 4 views
   - Create and save a mix
   - Edit an existing mix
   - Test on mobile device (responsive design)

3. **Make your first change**:
   - Add a new sound to the catalog
   - Create a simple UI component
   - Write a unit test

4. **Review design references**:
   - Compare running app with `/docs` screenshots
   - Verify color palette matches exactly
   - Check that animations feel smooth

Happy coding! 🎧
