# focus-flow Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-12-26

## Project Overview

Focus Flow is an ambient sound mixer web application that helps users create personalized soundscapes for focus and productivity. Users can layer multiple ambient sounds, control individual volumes, save custom mixes, and manage their sound library.

## Active Technologies

- **Framework**: TypeScript 5.3+ with Next.js 16.1.1 (App Router)
- **Styling**: Tailwind CSS 3.4
- **State**: Zustand 4.5
- **Animation**: Framer Motion 11.18
- **Audio**: HTML5 Audio API
- **Testing**: Vitest + Playwright + Testing Library

## Project Structure

```text
app/                    # Next.js App Router pages
├── page.tsx           # Landing page
├── mixer/             # Mixer interface
├── saved-mixes/       # Library of saved mixes
├── edit/[id]/         # Edit saved mix
└── layout.tsx         # Root layout

components/            # React components
├── landing/          # Landing page components
├── mixer/            # Mixer interface components
└── ui/               # Shared UI components

lib/                   # Utility libraries
├── audio/            # Audio engine and controllers
├── storage/          # localStorage utilities
└── constants/        # App constants and routes

types/                 # TypeScript type definitions
sounds/                # Audio files (main & glue loops)
docs/                  # Design references
```

## Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm test             # Run unit tests
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
npm run format       # Format with Prettier
npm run test:e2e     # Run E2E tests
```

## Code Style

### TypeScript
- Use strict mode
- Functional components with hooks
- Explicit return types for functions
- No `any` types (use `unknown` if necessary)

### React/Next.js
- Use App Router conventions
- Client components: `'use client'` directive
- Prefer server components when possible
- Use Next.js `<Link>` for navigation

### Styling
- Tailwind CSS utilities only (no inline styles)
- CSS variables for theme colors
- Responsive design with Tailwind breakpoints
- Glassmorphism effects with backdrop-blur

### Components
- One component per file
- Named exports for components
- Props interfaces defined inline or in types/
- Use Framer Motion for animations

### Audio
- HTML5 Audio Elements for playback
- Separate Audio instance per layer
- Progressive loading for sound files
- Handle loading/error states gracefully

### Storage
- Abstract localStorage in service layer
- Namespace keys: `focusMixer_*`
- Handle quota exceeded errors
- Validate availability before use

## Design Tokens

```css
--primary: #13b6ec
--background: #101d22
--card-bg: #1c292f
--border-light: #283539
--border-dark: #3b4d54
```

Font: Manrope (300, 400, 500, 600, 700)
Icons: Material Symbols Outlined

## Recent Changes

- 001-core-mixer-app: Initial implementation with core mixer, saved mixes, and edit functionality

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
