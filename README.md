# Focus Flow

> Mix ambient layers to block out the world and deepen your focus. Your personal cocoon of sound awaits.

Focus Flow is a web-based ambient sound mixer that helps users create personalized soundscapes for improved focus, relaxation, and productivity. Layer multiple ambient sounds, adjust volumes individually, and save your favorite mixes for quick access.

## Features

- **Layer Multiple Sounds**: Combine nature sounds, city ambience, and white noise to create your perfect soundscape
- **Individual Volume Control**: Fine-tune each sound layer independently with real-time audio adjustment
- **Save & Manage Mixes**: Create a personal library of sound mixes with custom names and categories
- **Focus Mode Presets**: Quick-start templates optimized for Deep Work, Reading, Meditation, and Nap
- **Edit Saved Mixes**: Modify existing mixes by adding/removing layers or adjusting volumes
- **Real-time Playback**: Seamless audio playback with synchronized multi-layer mixing
- **Local Storage**: All your mixes are saved locally in your browser for instant access

## Tech Stack

- **Framework**: Next.js 16.1.1 (App Router)
- **Language**: TypeScript 5.3+
- **Styling**: Tailwind CSS 3.4
- **Animations**: Framer Motion 11.18
- **State Management**: Zustand 4.5
- **Audio**: HTML5 Audio API
- **Icons**: Material Symbols Outlined
- **Testing**: Vitest + Playwright + Testing Library

## Getting Started

### Prerequisites

- Node.js 20+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd focus-flow

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Available Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
npm run format       # Format code with Prettier
npm test             # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:e2e     # Run end-to-end tests
```

## Project Structure

```
focus-flow/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Landing page
│   ├── mixer/             # Mixer interface
│   ├── saved-mixes/       # Library of saved mixes
│   ├── edit/[id]/         # Edit saved mix
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── landing/          # Landing page components
│   ├── mixer/            # Mixer interface components
│   └── ui/               # Shared UI components
├── lib/                   # Utility libraries
│   ├── audio/            # Audio engine and controllers
│   ├── storage/          # localStorage utilities
│   └── constants/        # App constants and routes
├── types/                 # TypeScript type definitions
├── public/                # Static assets
├── sounds/                # Audio files (main & glue loops)
└── docs/                  # Design references and mockups
```

## Sound Library

Focus Flow includes ambient sounds across multiple categories:

- **Nature Sounds**: Rain, Thunder, Ocean Waves, Wind, Fire, Birds, Crickets
- **City & Ambience**: Coffee Shop, Singing Bowl
- **White Noise & Focus**: White Noise, Pink Noise, Brown Noise

Each sound includes two audio files:
- `main-[name].mp4`: Primary audio loop
- `glue-[name].mp4`: Seamless transition loop

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

Requires HTML5 Audio API support and localStorage.

## Development

### Code Style

- TypeScript with strict mode enabled
- Functional React components with hooks
- Tailwind CSS for styling (no inline styles)
- CSS variables for theming
- Material Symbols Outlined for icons

### Testing

```bash
# Run unit tests
npm test

# Run with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

## Design System

Focus Flow uses a custom dark theme with the following color palette:

- **Primary**: `#13b6ec` (Cyan)
- **Background**: `#101d22` (Dark)
- **Cards**: `#1c292f` (Dark Gray)
- **Borders**: `#283539`, `#3b4d54` (Muted Gray)
- **Typography**: Manrope font family

All colors are defined as CSS variables for future theming support.

## Roadmap

- [ ] Light mode theme
- [ ] User authentication
- [ ] Cloud sync for saved mixes
- [ ] Mobile app (iOS/Android)
- [ ] Audio effects (reverb, EQ)
- [ ] Community mix sharing
- [ ] Pomodoro timer integration

## License

MIT
