# Tasks: Focus Mixer Core Application

**Input**: Design documents from `/specs/001-core-mixer-app/`
**Prerequisites**: plan.md, spec.md, data-model.md, research.md, contracts/

**Tests**: Not explicitly requested in spec - tasks focus on implementation only

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `app/` (Next.js App Router), `components/`, `lib/`, `types/` at repository root
- Paths shown below follow Next.js 16.1.1 App Router structure from plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Initialize Next.js 16.1.1 project with TypeScript and App Router in repository root
- [X] T002 [P] Install core dependencies: next@16.1.1, react@19, typescript@5.3+, tailwind@3.4+, framer-motion@11, zustand@4
- [X] T003 [P] Install dev dependencies: vitest, @testing-library/react, playwright, eslint, prettier
- [X] T004 Configure Tailwind CSS in tailwind.config.ts with custom color extensions
- [X] T005 Create app/globals.css with CSS variables for theme colors per constitution
- [X] T006 [P] Configure TypeScript in tsconfig.json with strict mode and path aliases
- [X] T007 [P] Create .env.local for environment configuration (currently empty, for future use)
- [X] T008 Create public/sounds symlink or copy pointing to /sounds folder
- [X] T009 Verify all 10 sound categories accessible in public/sounds with main/glue pattern
- [X] T010 Create Next.js root layout in app/layout.tsx with ThemeProvider wrapper
- [X] T011 [P] Configure ESLint in .eslintrc.json with Next.js and TypeScript rules
- [X] T012 [P] Configure Prettier in .prettierrc for code formatting

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T013 Create TypeScript types for Mix (Coconut) in types/mix.ts per data-model.md schema
- [X] T014 [P] Create TypeScript types for Sound and SoundLayer in types/sound.ts per data-model.md
- [X] T015 [P] Create TypeScript types for Audio state in types/audio.ts
- [X] T016 [P] Create TypeScript types for Theme in types/theme.ts
- [X] T017 Create sound catalog constant in lib/constants/sounds.ts with all 10 sounds from data-model.md
- [X] T018 [P] Create color constants in lib/constants/colors.ts with exact hex values from constitution
- [X] T019 [P] Create route constants in lib/constants/routes.ts for all 4 views
- [X] T020 Create AudioLayer class in lib/audio/AudioLayer.ts for individual sound management
- [X] T021 Create AudioController class in lib/audio/AudioController.ts with EventEmitter pattern per contracts/audio-events.md
- [X] T022 Create MasterVolume utility in lib/audio/MasterVolume.ts for volume multiplication
- [X] T023 Create Zustand mix store in lib/state/useMixStore.ts with persist middleware
- [X] T024 [P] Create Zustand audio store in lib/state/useAudioStore.ts for playback state
- [X] T025 [P] Create Zustand theme store in lib/state/useThemeStore.ts (dark mode only)
- [X] T026 Create localStorage abstraction in lib/storage/LocalStorage.ts with quota handling
- [X] T027 [P] Create mix serializer in lib/storage/MixSerializer.ts for JSON conversion
- [X] T028 Create mix validation in lib/validation/mixValidation.ts per data-model.md rules
- [X] T029 [P] Create layer validation in lib/validation/layerValidation.ts per data-model.md rules
- [X] T030 Create reusable Button component in components/ui/Button.tsx with Framer Motion
- [X] T031 [P] Create reusable Slider component in components/ui/Slider.tsx with touch support
- [X] T032 [P] Create reusable Card component in components/ui/Card.tsx with glassmorphism
- [X] T033 [P] Create reusable Input component in components/ui/Input.tsx with validation
- [X] T034 Create Header component in components/layout/Header.tsx with navigation links
- [X] T035 [P] Create Footer component in components/layout/Footer.tsx
- [X] T036 Create ThemeProvider component in components/layout/ThemeProvider.tsx wrapping Zustand theme store

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Create and Play First Mix (Priority: P1) 🎯 MVP

**Goal**: Users can immediately mix ambient sounds with individual volume controls and hear layered playback

**Independent Test**: Open landing page → Click "Start Mixing" → Add 2-3 sound layers → Adjust volumes → Click play → Hear layered audio

### Implementation for User Story 1

- [X] T037 [P] [US1] Create SoundCard component in components/mixer/SoundCard.tsx displaying sound name, icon, category
- [X] T038 [P] [US1] Create SoundCategories component in components/mixer/SoundCategories.tsx with collapsible categories
- [X] T039 [P] [US1] Create VolumeSlider component in components/mixer/VolumeSlider.tsx with real-time updates and glow effect
- [X] T040 [P] [US1] Create ActiveLayers component in components/mixer/ActiveLayers.tsx displaying added sounds
- [X] T041 [P] [US1] Create FloatingControls component in components/mixer/FloatingControls.tsx with play/pause and master volume
- [X] T042 [US1] Create Mixer Interface page in app/mixer/page.tsx integrating all mixer components
- [X] T043 [US1] Implement add sound layer logic in Mixer page connecting SoundCard clicks to AudioController
- [X] T044 [US1] Implement remove sound layer logic with delete button on ActiveLayers cards
- [X] T045 [US1] Wire up individual layer volume sliders to AudioController.setLayerVolume()
- [X] T046 [US1] Wire up master volume slider to AudioController.setMasterVolume()
- [X] T047 [US1] Implement play/pause button logic calling AudioController.playAll() and pauseAll()
- [X] T048 [US1] Add audio event listeners for playbackStateChange in Mixer page
- [X] T049 [US1] Add audio event listeners for volumeChange in Mixer page
- [X] T050 [US1] Add audio event listeners for loadError with error toast notifications
- [X] T051 [US1] Implement Focus Mode preset pills in Mixer page with click handlers
- [X] T052 [US1] Add search bar functionality in Mixer page to filter available sounds
- [X] T053 [US1] Implement layer limit validation (max 10 layers) with user notification
- [X] T054 [US1] Handle autoplay policy blocking with manual play button overlay per research.md
- [X] T055 [US1] Add loading states for audio files with spinner on sound cards
- [X] T056 [US1] Create minimal landing page in app/page.tsx with "Start Mixing" CTA linking to /mixer
- [X] T057 [US1] Style Mixer Interface matching /docs/ambient-mixer-interface.html colors and layout

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Save and Manage Mixes (Priority: P2)

**Goal**: Users can save their created mixes with custom names and view them in a personal library

**Independent Test**: Create mix → Click "Save Mix" → Enter name → Navigate to /library → Verify mix appears with correct layers

### Implementation for User Story 2

- [ ] T058 [P] [US2] Create MixCard component in components/library/MixCard.tsx displaying mix name, sounds, tags, timestamp
- [ ] T059 [P] [US2] Create SearchBar component in components/library/SearchBar.tsx for real-time filtering
- [ ] T060 [P] [US2] Create CategoryFilters component in components/library/CategoryFilters.tsx with active state
- [ ] T061 [US2] Create My Mixes page in app/library/page.tsx displaying all saved mixes
- [ ] T062 [US2] Implement save mix dialog/modal with name input and validation in Mixer page
- [ ] T063 [US2] Wire save button to create Mix object with unique ID (timestamp + random)
- [ ] T064 [US2] Call useMixStore.addMix() to persist to localStorage via Zustand persist
- [ ] T065 [US2] Implement search functionality filtering mixes by name or sound components
- [ ] T066 [US2] Implement category filter buttons (All, Focus, Sleep, Nature, Favorites)
- [ ] T067 [US2] Add play button to MixCard loading mix layers into AudioController
- [ ] T068 [US2] Add delete button to MixCard with confirmation dialog
- [ ] T069 [US2] Implement delete logic calling useMixStore.deleteMix() to remove from localStorage
- [ ] T070 [US2] Add visual distinction for currently playing mix (primary border, pulsing indicator)
- [ ] T071 [US2] Add "Now Playing" badge to active mix card
- [ ] T072 [US2] Implement "Create New Mix" CTA button navigating to /mixer
- [ ] T073 [US2] Handle localStorage quota exceeded errors with user notification to delete old mixes
- [ ] T074 [US2] Add hydration guard in Library page to prevent SSR mismatch per research.md
- [ ] T075 [US2] Style My Mixes page matching /docs/manage-saved-mixes.html layout and colors

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Edit and Fine-Tune Saved Mixes (Priority: P3)

**Goal**: Users can edit existing saved mixes by adding/removing layers and adjusting volumes

**Independent Test**: Navigate to /library → Click "Edit" on mix → Modify layers/volumes → Click "Save Mix" → Verify changes persist

### Implementation for User Story 3

- [ ] T076 [P] [US3] Create EditHeader component in components/edit/EditHeader.tsx with editable mix name field
- [ ] T077 [P] [US3] Create SoundSearch component in components/edit/SoundSearch.tsx for adding new sounds
- [ ] T078 [P] [US3] Create LayerEditor component in components/edit/LayerEditor.tsx with solo/remove buttons
- [ ] T079 [US3] Create Edit Mix page in app/edit/[id]/page.tsx with dynamic route parameter
- [ ] T080 [US3] Load mix from useMixStore by ID on Edit page mount
- [ ] T081 [US3] Pre-populate AudioController with existing layers and volumes from loaded mix
- [ ] T082 [US3] Implement editable mix name field updating in real-time
- [ ] T083 [US3] Implement add sound layer functionality from search results
- [ ] T084 [US3] Implement remove layer button on each layer card
- [ ] T085 [US3] Implement solo button toggling AudioController layer solo state per contracts/audio-events.md
- [ ] T086 [US3] Add volume adjustment with real-time preview during editing
- [ ] T087 [US3] Implement "Save Mix" button calling useMixStore.updateMix() with new timestamp
- [ ] T088 [US3] Implement "Discard Changes" button navigating back without saving
- [ ] T089 [US3] Add confirmation dialog if user tries to navigate away with unsaved changes
- [ ] T090 [US3] Add popular sound suggestions as quick-add pills (Fireplace, Ocean Waves, Wind, Lo-Fi Beats)
- [ ] T091 [US3] Create sticky footer with Discard/Save buttons per /docs/edit-saved-mix.html
- [ ] T092 [US3] Style Edit Mix page matching /docs/edit-saved-mix.html design and layout

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: User Story 4 - Discover and Explore Landing Page (Priority: P4)

**Goal**: First-time visitors understand the value proposition before trying the mixer

**Independent Test**: Visit root URL → See hero section → Read features → Click "Start Mixing" → Navigate to /mixer

### Implementation for User Story 4

- [ ] T093 [P] [US4] Create Hero component in components/landing/Hero.tsx with animated background blur
- [ ] T094 [P] [US4] Create Features component in components/landing/Features.tsx with 3 feature cards
- [ ] T095 [P] [US4] Create SoundWaveViz component in components/landing/SoundWaveViz.tsx with animated bars
- [ ] T096 [US4] Update Landing page in app/page.tsx with full hero, features, and CTA sections
- [ ] T097 [US4] Implement "Start Mixing" CTA button navigating to /mixer
- [ ] T098 [US4] Implement "Listen Demo" button playing sample preset mix
- [ ] T099 [US4] Implement "Skip Onboarding" button navigating to /mixer
- [ ] T100 [US4] Add tagline "Find Your Frequency" as main heading with gradient text effect
- [ ] T101 [US4] Add value proposition text explaining ambient sound mixing for focus
- [ ] T102 [US4] Create 3 feature cards: "Layer Sounds", "Discover Moods", "Save Your Mixes" with descriptions
- [ ] T103 [US4] Add abstract sound wave visualization with pulsing animation per /docs/landing-page.html
- [ ] T104 [US4] Add decorative gradient blur circles with pulse animation
- [ ] T105 [US4] Add "Version 2.0 Now Live" badge with ping animation
- [ ] T106 [US4] Style Landing page matching /docs/landing-page.html exactly with all effects

**Checkpoint**: All 4 user stories complete - application delivers full feature set

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T107 [P] Add responsive breakpoints for mobile (sm:, md:, lg:) across all components
- [ ] T108 [P] Add touch gesture handling for sliders on mobile devices per research.md
- [ ] T109 [P] Optimize Framer Motion animations for 60fps with transform/opacity only
- [ ] T110 [P] Add "Save Mix" button to Mixer Interface header for easy access
- [ ] T111 [P] Add "My Library" navigation link to Header component linking to /library
- [ ] T112 [P] Add "Return to Mixer" button in Library and Edit views
- [ ] T113 Add localStorage detection with graceful error message if unavailable
- [ ] T114 Add duplicate mix name handling (auto-append number or prompt for new name)
- [ ] T115 Add empty state messages for "No mixes saved yet" in Library
- [ ] T116 Add empty state for "No sounds in category" if filtering returns no results
- [ ] T117 [P] Add loading skeleton states for mix cards in Library page
- [ ] T118 [P] Add error boundary component wrapping app for global error handling
- [ ] T119 Add 404 page in app/not-found.tsx with navigation back to home
- [ ] T120 [P] Verify all colors use CSS variables (no hard-coded hex values)
- [ ] T121 [P] Verify visual design matches /docs reference screenshots (manual QA)
- [ ] T122 [P] Verify all sounds load correctly from /sounds folder (manual QA)
- [ ] T123 Add meta tags in app/layout.tsx for SEO (title, description, og:image)
- [ ] T124 [P] Add favicon and app icons in public/ folder
- [ ] T125 Test on Chrome, Firefox, Safari, Edge (last 2 versions) for compatibility
- [ ] T126 Test autoplay policy handling on iOS Safari and Android Chrome
- [ ] T127 Test localStorage persistence across page refreshes
- [ ] T128 Test maximum 10 layer limit with error notification
- [ ] T129 Test localStorage quota handling with 50+ saved mixes

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4)
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - No dependencies on US1, but builds on Mixer Interface
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Depends on US2 for saved mixes to exist, but independently testable
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - Completely independent, can be done anytime

### Within Each User Story

**User Story 1**:
- Components (T037-T041) can be built in parallel
- Page integration (T042) depends on components
- Audio wiring (T043-T050) depends on page
- Styling (T057) can be done last

**User Story 2**:
- Components (T058-T060) can be built in parallel
- Page (T061) depends on components
- Save/delete logic (T062-T069) can be implemented sequentially
- Styling (T075) can be done last

**User Story 3**:
- Components (T076-T078) can be built in parallel
- Page (T079) depends on components
- Edit logic (T080-T089) depends on page
- Styling (T092) can be done last

**User Story 4**:
- Components (T093-T095) can be built in parallel
- Page update (T096) depends on components
- CTAs (T097-T099) can be implemented in parallel
- Styling (T106) can be done last

### Parallel Opportunities

- **Setup**: T002, T003, T006, T007, T011, T012 can run in parallel
- **Foundational**: T014-T016, T018-T019, T024-T025, T027, T029, T030-T033, T035 can run in parallel
- **US1**: T037-T041 (components) can run in parallel
- **US2**: T058-T060 (components) can run in parallel
- **US3**: T076-T078 (components) can run in parallel
- **US4**: T093-T095 (components) can run in parallel
- **Polish**: T107-T109, T110-T112, T117-T118, T120-T122, T124 can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all components for User Story 1 together:
Task: "Create SoundCard component in components/mixer/SoundCard.tsx"
Task: "Create SoundCategories component in components/mixer/SoundCategories.tsx"
Task: "Create VolumeSlider component in components/mixer/VolumeSlider.tsx"
Task: "Create ActiveLayers component in components/mixer/ActiveLayers.tsx"
Task: "Create FloatingControls component in components/mixer/FloatingControls.tsx"

# After components complete, integrate:
Task: "Create Mixer Interface page in app/mixer/page.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T012)
2. Complete Phase 2: Foundational (T013-T036) - CRITICAL
3. Complete Phase 3: User Story 1 (T037-T057)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

**MVP Delivers**: Functional ambient sound mixer with layer controls and playback. Users can immediately experience the core value proposition.

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready (36 tasks)
2. Add User Story 1 → Test independently → Deploy/Demo (21 tasks) - **MVP!**
3. Add User Story 2 → Test independently → Deploy/Demo (18 tasks)
4. Add User Story 3 → Test independently → Deploy/Demo (17 tasks)
5. Add User Story 4 → Test independently → Deploy/Demo (14 tasks)
6. Add Polish → Final release (23 tasks)
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (36 tasks)
2. Once Foundational is done:
   - Developer A: User Story 1 (21 tasks)
   - Developer B: User Story 2 (18 tasks) - can start in parallel
   - Developer C: User Story 4 (14 tasks) - completely independent
3. After US1 and US2 complete:
   - Developer A: User Story 3 (17 tasks) - needs saved mixes from US2
4. Team: Polish phase together (23 tasks)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Total: **129 tasks** across 7 phases
  - Setup: 12 tasks
  - Foundational: 24 tasks (BLOCKS all stories)
  - User Story 1 (P1): 21 tasks 🎯 MVP
  - User Story 2 (P2): 18 tasks
  - User Story 3 (P3): 17 tasks
  - User Story 4 (P4): 14 tasks
  - Polish: 23 tasks
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- All file paths follow Next.js 16.1.1 App Router structure from plan.md
- All colors must use CSS variables per constitution Principle IV
- All sounds must load from /sounds folder per constitution Principle II
- Visual design must match /docs reference files per constitution Principle I
