# Implementation Plan: Focus Mixer Core Application

**Branch**: `001-core-mixer-app` | **Date**: 2025-12-25 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-core-mixer-app/spec.md`

**Note**: This plan follows the `/speckit.plan` workflow with Phase 0 (Research) and Phase 1 (Design & Contracts) detailed below.

## Summary

Build a local-first ambient sound mixer web application with 4 core views (Landing Page, Mixer Interface, My Mixes Library, Edit Mix) that allows users to layer up to 10 ambient sounds with independent volume control, save mixes to localStorage as "Coconuts", and navigate between views seamlessly. The application will use Next.js with Tailwind CSS for the UI layer, HTML5 Audio API for multi-track playback and looping, Zustand with persist middleware for state management, and CSS variables for theme management to support future light mode implementation.

## Technical Context

**Language/Version**: TypeScript 5.3+ with Next.js 14 (App Router)
**Primary Dependencies**:
- Next.js 14.x (React 18+)
- Tailwind CSS 3.4+
- Framer Motion 11.x (animations and glassmorphism effects)
- Zustand 4.x with persist middleware (state management)
- TypeScript 5.3+ (type safety)

**Storage**: Browser localStorage (JSON serialization via Zustand persist middleware)
**Testing**: Vitest + React Testing Library (component tests), Playwright (E2E tests)
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge - last 2 versions), Desktop and Tablet primary (mobile-responsive but not optimized)
**Project Type**: Web application (Next.js single-page application with client-side routing)
**Performance Goals**:
- Page load <3s on broadband
- Audio playback start <2s (excluding network latency)
- Real-time slider updates <100ms
- Support 10 simultaneous audio layers without glitches

**Constraints**:
- Local-first: No backend services or network dependencies for core features
- Dark mode only (light mode architecture prepared but not implemented)
- No user authentication (UI placeholders for future auth)
- Audio files must be served from `/sounds` folder structure
- Visual design must match `/docs` reference files exactly

**Scale/Scope**:
- 4 distinct views (/, /mixer, /library, /edit/[id])
- 10 ambient sound categories with 10+ total sounds
- Support up to 50 saved mixes per user
- Mobile-responsive layouts for all views

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Design Source of Truth ✅ PASS

**Requirement**: All UI decisions must strictly align with `/docs` folder screenshots and HTML.

**Compliance**:
- Plan specifies Tailwind CSS matching the exact utility classes from `/docs` HTML files
- Design tokens extracted in spec (FR-001 through FR-007) will be implemented as CSS variables
- Framer Motion will replicate subtle animations seen in reference designs
- Visual validation required before task completion per constitution Quality Gates

**Status**: COMPLIANT - Implementation will reference `/docs` as source of truth.

---

### Principle II: Sound Asset Management ✅ PASS

**Requirement**: All sounds must be sourced exclusively from `/sounds` folder with main/glue pattern.

**Compliance**:
- Audio controller will load files from `/sounds/[category]/main-[name].mp4` and `glue-[name].mp4`
- Sound catalog (FR-060 to FR-064) maps to 10 folder categories: rain, thunder, waves, wind, fire, birds, crickets, coffee-shop, singing-bowl, white-noise
- No external audio sources or procedural generation

**Status**: COMPLIANT - `/sounds` folder is the exclusive audio source.

---

### Principle III: Visual Theme Fidelity ✅ PASS

**Requirement**: Use exact colors and gradients extracted from `/docs` HTML.

**Compliance**:
- CSS variables will be defined with exact hex values from constitution:
  - `--color-primary: #13b6ec`
  - `--color-background-dark: #101d22`
  - `--color-card-dark: #1c292f`
  - `--color-border: #283539, #3b4d54`
- Tailwind config will extend with these custom colors
- Typography: Manrope font family (weights 300-700)
- Icons: Material Symbols Outlined (Google Fonts)
- Effects: Glassmorphism (backdrop-blur-md), glow shadows (rgba(19, 182, 236, 0.3))

**Status**: COMPLIANT - Exact color palette will be implemented via CSS variables.

---

### Principle IV: Future-Proofing Architecture ✅ PASS

**Requirement**: Use CSS variables for all colors to enable future light mode toggle (but do NOT implement light mode now).

**Compliance**:
- All component color references will use CSS variables (e.g., `bg-[var(--color-background)]`)
- Theme provider pattern with Zustand store prepared for future light/dark toggle
- Current implementation: dark mode only, light mode values commented out
- No light mode UI toggle in initial release

**Status**: COMPLIANT - CSS variable architecture supports future light mode without refactoring.

---

### Principle V: Local-First Scope ✅ PASS

**Requirement**: Focus on local-first mixer, defer auth and cloud sync.

**Compliance**:
- Zustand persist middleware stores all mixes in localStorage (no API calls)
- No authentication logic or user management implemented
- No cloud sync or multi-device features
- Auth UI placeholders (profile avatar, user name) isolated in components for future activation

**Status**: COMPLIANT - Zero network dependencies for core features.

---

**Overall Constitution Compliance**: ✅ ALL PRINCIPLES PASS

No violations detected. Proceed to Phase 0 research.

## Project Structure

### Documentation (this feature)

```text
specs/001-core-mixer-app/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0: Technology decisions and best practices
├── data-model.md        # Phase 1: Entity schemas and state structure
├── quickstart.md        # Phase 1: Developer onboarding guide
├── contracts/           # Phase 1: API contracts (localStorage schema, audio events)
│   ├── storage-schema.json
│   └── audio-events.md
└── checklists/
    └── requirements.md  # Specification quality checklist
```

### Source Code (repository root)

```text
app/                     # Next.js App Router pages
├── page.tsx             # Landing page (/)
├── mixer/
│   └── page.tsx         # Mixer interface (/mixer)
├── library/
│   └── page.tsx         # My Mixes (/library)
├── edit/
│   └── [id]/
│       └── page.tsx     # Edit mix (/edit/[id])
├── layout.tsx           # Root layout with theme provider
└── globals.css          # Tailwind + CSS variables

components/              # React components
├── ui/                  # Reusable UI components
│   ├── Button.tsx
│   ├── Slider.tsx
│   ├── Card.tsx
│   └── Input.tsx
├── landing/             # Landing page components
│   ├── Hero.tsx
│   ├── Features.tsx
│   └── SoundWaveViz.tsx
├── mixer/               # Mixer interface components
│   ├── SoundCategories.tsx
│   ├── SoundCard.tsx
│   ├── ActiveLayers.tsx
│   ├── VolumeSlider.tsx
│   └── FloatingControls.tsx
├── library/             # My Mixes components
│   ├── MixCard.tsx
│   ├── SearchBar.tsx
│   └── CategoryFilters.tsx
├── edit/                # Edit mix components
│   ├── EditHeader.tsx
│   ├── SoundSearch.tsx
│   └── LayerEditor.tsx
└── layout/              # Layout components
    ├── Header.tsx
    ├── Footer.tsx
    └── ThemeProvider.tsx

lib/                     # Business logic and utilities
├── audio/
│   ├── AudioController.ts    # HTML5 Audio management
│   ├── AudioLayer.ts          # Individual audio layer
│   └── MasterVolume.ts        # Master volume control
├── storage/
│   ├── LocalStorage.ts        # localStorage abstraction
│   └── MixSerializer.ts       # JSON serialization
├── state/
│   ├── useMixStore.ts         # Zustand store with persist
│   ├── useAudioStore.ts       # Audio playback state
│   └── useThemeStore.ts       # Theme state (future light mode)
└── constants/
    ├── sounds.ts              # Sound catalog
    ├── colors.ts              # Design tokens
    └── routes.ts              # Route constants

types/                   # TypeScript definitions
├── mix.ts               # Mix (Coconut) types
├── sound.ts             # Sound definition types
├── audio.ts             # Audio engine types
└── theme.ts             # Theme types

public/
├── sounds/              # Symlink to /sounds folder
│   ├── rain/
│   │   ├── main-rain.mp4
│   │   └── glue-rain.mp4
│   └── [other categories...]
└── fonts/
    └── [Manrope font files]

__tests__/               # Test files
├── components/
├── lib/
└── e2e/
```

**Structure Decision**: Web application structure selected because this is a Next.js single-page application with client-side routing. The App Router structure separates pages, reusable components, business logic (lib/), and types for clear separation of concerns. Audio controller and state management are centralized in `lib/` to ensure consistency across all views.

## Complexity Tracking

> **No violations detected - table intentionally left empty**

All constitution principles pass without exceptions. No complexity justifications required.

---

## Phase 0: Research & Technology Decisions

**Status**: PENDING (will be generated in research.md)

### Research Tasks

1. **Next.js 14 App Router best practices**
   - Client vs server component patterns for audio playback
   - Route handling for dynamic mix IDs (`/edit/[id]`)
   - Public folder asset serving for sound files

2. **HTML5 Audio API for multi-layer playback**
   - Creating and managing multiple Audio Element instances
   - Synchronizing play/pause across layers
   - Volume control implementation (0.0-1.0 range)
   - Loop functionality and seamless looping
   - Error handling for failed audio loads

3. **Zustand persist middleware configuration**
   - localStorage serialization for complex nested state
   - Hydration patterns to avoid SSR mismatches
   - Performance optimization for large state objects (50 mixes)

4. **Framer Motion glassmorphism and glow effects**
   - Backdrop blur animations
   - Shadow glow on hover/active states
   - Performance optimization for 60fps animations

5. **Tailwind CSS variable integration**
   - Extending Tailwind config with custom CSS variables
   - Dynamic theme switching architecture (for future light mode)
   - Best practices for responsive design with Tailwind

6. **Mobile-responsive audio playback**
   - Browser autoplay policies (iOS Safari, Android Chrome)
   - Touch gesture handling for sliders
   - Performance optimization for simultaneous audio on mobile

**Output**: `research.md` documenting decisions, rationale, and best practices for each technology choice.

---

## Phase 1: Design & Contracts

**Status**: PENDING (artifacts will be generated after research)

### Deliverables

1. **data-model.md**: Entity schemas for Mix (Coconut), Sound Layer, Sound Definition, Focus Mode Preset

2. **contracts/storage-schema.json**: localStorage JSON structure for persisted mixes

3. **contracts/audio-events.md**: Audio controller event system (play, pause, volumeChange, loadError)

4. **quickstart.md**: Developer setup guide (install dependencies, run dev server, add new sounds, create components)

5. **Agent context update**: Add Next.js, Zustand, Framer Motion to `.specify/agent-context.md`

**Post-Phase 1 Gate**: Re-validate Constitution Check after design artifacts are complete.

---

## Next Steps

1. Run Phase 0 research to resolve all technology implementation details
2. Generate Phase 1 design artifacts (data-model, contracts, quickstart)
3. Update agent context with selected technologies
4. Re-validate constitution compliance
5. Proceed to `/speckit.tasks` for task generation
