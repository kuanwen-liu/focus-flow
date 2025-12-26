<!--
Sync Impact Report:
- Version change: Initial → 1.0.0
- Added principles:
  1. Design Source of Truth
  2. Sound Asset Management
  3. Visual Theme Fidelity
  4. Future-Proofing Architecture
  5. Local-First Scope
- Added sections: Visual Theme System, Implementation Standards, Deferred Features
- Templates requiring updates:
  ✅ plan-template.md - Constitution Check section already flexible
  ✅ spec-template.md - Requirements section can accommodate new constraints
  ✅ tasks-template.md - Task categorization supports new principles
- Follow-up TODOs: None
-->

# Focus Mixer Constitution

## Core Principles

### I. Design Source of Truth

All UI and UX decisions MUST strictly align with the screenshots and HTML files located in the `/docs` folder. These reference materials are the authoritative source for:

- Layout and component structure
- Interaction patterns and user flows
- Visual hierarchy and spacing
- Component states (hover, active, disabled)
- Responsive behavior

**Rationale**: Maintaining design consistency requires a single source of truth. Deviation from reference designs creates inconsistency and undermines the user experience. The `/docs` folder contains the complete visual specification that all implementation must match.

### II. Sound Asset Management

All sound files MUST be sourced exclusively from the `/sounds` folder. The sound library structure is:

```
sounds/
├── [category]/
│   ├── main-[name].mp4
│   └── glue-[name].mp4
```

Sound categories include: rain, thunder, waves, wind, fire, birds, crickets, coffee-shop, singing-bowl, white-noise.

**Rationale**: The project's audio experience depends on pre-curated, high-quality sound files. All sounds are provided in the repository structure above. No external sound sources or procedural generation should be used. The main/glue pattern supports layered audio mixing.

### III. Visual Theme Fidelity

Implementation MUST use the colors and gradients extracted from the `/docs` HTML or screenshots. The canonical color system is:

**Primary Colors**:
- Primary: `#13b6ec` (cyan-blue for interactive elements, CTAs)
- Background Dark: `#101d22`
- Card Dark: `#1c292f`
- Accent borders/surfaces: `#283539`, `#3b4d54`

**Text Colors**:
- Dark mode text: `white`
- Light mode text: `#111618`
- Secondary text: gray-400/gray-500

**Component-Specific Colors** (extracted from design):
- Blue sounds: `blue-500/10` background, `blue-600` icons
- Green sounds: `green-500/10` background, `green-600` icons
- Cyan sounds: `cyan-500/10` background, `cyan-600` icons
- Amber sounds: `amber-500/10` background, `amber-600` icons
- Orange sounds: `orange-500/10` background, `orange-600` icons

**Typography**:
- Font family: `Manrope` (weights: 300, 400, 500, 600, 700)
- Icons: Material Symbols Outlined

**Effects**:
- Backdrop blur: `backdrop-blur-md` (80% opacity headers)
- Glow effects: `box-shadow: 0 0 10px 2px rgba(19, 182, 236, 0.3)` for sliders
- Primary button shadow: `0 0 20px rgba(19,182,236,0.4)`

**Rationale**: Visual consistency is non-negotiable. Using the exact color values and visual effects from the design ensures brand coherence and professional polish. Any deviation creates visual discord.

### IV. Future-Proofing Architecture

While building, use Tailwind CSS variables for colors to allow for a 'Light Mode' toggle in a future phase. However, DO NOT implement Light Mode now.

**Color Variable Strategy**:
```css
--color-primary: #13b6ec;
--color-background: #101d22;  /* dark mode value */
--color-card: #1c292f;        /* dark mode value */
--color-text: white;          /* dark mode value */
```

**Requirements**:
- All color references in components MUST use CSS variables
- CSS variables MUST be defined in a central theme configuration
- Current implementation MUST only support dark mode
- Architecture MUST enable future light mode toggle without refactoring components

**Rationale**: Planning for light mode now (through proper variable usage) prevents expensive refactoring later. However, implementing light mode before core functionality is premature. The architecture supports future enhancement without delaying current delivery.

### V. Local-First Scope

Focus on a high-fidelity, local-first functional mixer. User authentication and cloud sync are deferred to a later stage.

**In Scope**:
- Local storage of user mixes (localStorage, IndexedDB, or local files)
- Full mixer functionality (volume control, sound layering, presets)
- Mix saving and loading from local storage
- No network dependencies for core features

**Explicitly Deferred**:
- User authentication (login, signup, password reset)
- Cloud synchronization of mixes
- User profiles or account management
- Multi-device sync
- Social features (sharing, public mixes)

**Rationale**: Building local-first ensures the core product delivers value immediately without backend complexity. User auth and cloud sync introduce significant architectural complexity (security, infrastructure, costs) that would delay the MVP. The local-first approach enables rapid iteration and testing of core features before adding distributed system concerns.

## Visual Theme System

**Reference Files**: All visual decisions defer to:
- `/docs/ambient-mixer-interface.html` and `.png`
- `/docs/edit-saved-mix.html` and `.png`
- `/docs/landing-page.html` and `.png`
- `/docs/manage-saved-mixes.html` and `.png`

**Extraction Process**:
1. Identify component in reference design
2. Extract exact color values from HTML style or Tailwind classes
3. Extract spacing, sizing, and border-radius values
4. Match typography (size, weight, line-height)
5. Implement using CSS variables for colors

**Validation**:
- Visual comparison against reference screenshots REQUIRED before task completion
- Pixel-perfect matching is NOT required, but proportions, colors, and spacing must align
- When in doubt, reference design wins over interpretation

## Implementation Standards

### Technology Stack

**Required**:
- Tailwind CSS (for styling with utility classes)
- CSS Variables (for theme color management)
- HTML5 Audio API or Web Audio API (for sound playback and mixing)

**Recommended**:
- React or similar component framework (for UI state management)
- TypeScript (for type safety in complex audio state)

**Constraints**:
- No external CSS frameworks beyond Tailwind
- No sound processing libraries that require network access
- No authentication libraries (feature deferred)

### File Organization

```
src/
├── components/     # UI components matching /docs designs
├── sounds/         # Audio playback and mixing logic
├── storage/        # Local persistence (mixes, presets)
├── theme/          # CSS variables and theme configuration
└── types/          # TypeScript definitions

public/
└── sounds/         # Symlink or copy of /sounds folder
```

### Quality Gates

**Before any commit**:
1. Visual comparison with reference design
2. Color values verified against extracted palette
3. Sound paths verified against `/sounds` structure
4. No hard-coded colors (only CSS variables)
5. No network requests in core features
6. Local storage functioning for mix persistence

**Before any feature completion**:
1. All acceptance scenarios from spec pass
2. Visual design matches reference screenshots
3. All sounds play correctly from `/sounds` folder
4. Mixes can be saved and loaded locally
5. No console errors or warnings

## Deferred Features

The following are explicitly OUT OF SCOPE for initial implementation:

1. **Light Mode**: Architecture supports it, do not implement
2. **User Authentication**: No login, signup, or user management
3. **Cloud Sync**: All data stored locally only
4. **Multi-Device**: No cross-device synchronization
5. **Social Features**: No sharing, discovery, or public mixes
6. **Backend Services**: No API servers or databases

**Justification**: These features add complexity without improving the core mixer experience. They will be reconsidered after the local-first MVP proves the product concept.

## Governance

This constitution supersedes all other development practices and decisions. When conflicts arise between:
- Implementation preference vs. constitution → constitution wins
- Developer judgment vs. reference design → reference design wins
- Convenience vs. future-proofing → future-proofing wins (when specified)
- Feature scope vs. deferred features → deferred features remain deferred

**Amendment Process**:
1. Proposed amendments must document justification
2. Amendments require approval before implementation
3. Version must increment (MAJOR for breaking changes, MINOR for additions, PATCH for clarifications)
4. All dependent templates must be reviewed and updated

**Compliance Review**:
- Constitution check MUST pass before Phase 0 research in plan.md
- Constitution check MUST be re-verified after Phase 1 design
- Any violations must be explicitly justified in Complexity Tracking table
- Pull requests must reference constitution compliance

**Versioning Policy**:
- MAJOR (X.0.0): Backward incompatible governance changes or principle removals
- MINOR (0.X.0): New principles added or material expansions
- PATCH (0.0.X): Clarifications, wording fixes, non-semantic refinements

**Version**: 1.0.0 | **Ratified**: 2025-12-25 | **Last Amended**: 2025-12-25
