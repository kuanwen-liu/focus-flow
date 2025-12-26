# Feature Specification: Focus Mixer Core Application

**Feature Branch**: `001-core-mixer-app`
**Created**: 2025-12-25
**Status**: Draft
**Input**: User description: "Complete Focus Mixer application with design token extraction, 4 core views (Landing Page, Mixer Interface, My Mixes, Edit Mix), HTML Audio Element implementation for layering and volume control, localStorage for saved mixes (Coconuts), and modular UI structure for future light mode and authentication features."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create and Play First Mix (Priority: P1)

A user visits Focus Mixer for the first time, wants to immediately start mixing ambient sounds to help them focus on work, and begins layering sounds with individual volume controls.

**Why this priority**: This is the core value proposition of the app. Users need to be able to create and play a mix immediately to experience the product's primary benefit. Without this, there is no viable product.

**Independent Test**: Can be fully tested by opening the landing page, clicking "Start Mixing", adding 2-3 sound layers, adjusting their volumes independently, and hearing the layered audio playback. Delivers immediate value as a functional ambient sound mixer.

**Acceptance Scenarios**:

1. **Given** a new user lands on the homepage, **When** they click "Start Mixing" button, **Then** they are taken to the Mixer Interface with access to all available sound categories
2. **Given** the user is on the Mixer Interface, **When** they browse sound categories (Nature Sounds, City & Ambience, White Noise & Focus), **Then** they see all available sounds organized by category with preview cards
3. **Given** the user selects a sound (e.g., "Heavy Rain"), **When** they add it to their mix, **Then** a new layer card appears in their active layers section with a volume slider set to a default level
4. **Given** the user has added multiple sound layers, **When** they adjust the volume slider for one layer, **Then** only that specific layer's volume changes while other layers maintain their volumes
5. **Given** the user has configured their desired mix, **When** they click the master play button, **Then** all active sound layers play simultaneously at their configured volumes
6. **Given** sounds are playing, **When** the user adjusts the master volume slider, **Then** the overall output volume changes proportionally for all layers
7. **Given** sounds are playing, **When** the user clicks pause, **Then** all sound layers stop playing and can be resumed from the same point

---

### User Story 2 - Save and Manage Mixes (Priority: P2)

A user has created a perfect mix and wants to save it with a custom name so they can quickly access it later without recreating the configuration.

**Why this priority**: Saving mixes adds significant value by allowing users to build a personal library of soundscapes. It enables repeat usage patterns and increases user retention. However, the app is still functional without this feature (users can create mixes on-demand).

**Independent Test**: Can be tested independently by creating a mix in the Mixer Interface, clicking "Save Mix", entering a name (e.g., "Deep Work - Rainy"), navigating to "My Mixes" page, and verifying the mix appears in the list with all layers and volumes preserved.

**Acceptance Scenarios**:

1. **Given** a user has created a mix with multiple layers, **When** they click the "Save Mix" button, **Then** a prompt appears asking for a mix name
2. **Given** the user enters a name for their mix, **When** they confirm the save action, **Then** the mix is stored locally with a unique identifier and timestamp
3. **Given** a user navigates to "My Mixes" page, **When** the page loads, **Then** they see all their saved mixes displayed as cards showing: mix name, component sounds, tags/categories, and last saved date
4. **Given** the user is viewing their saved mixes, **When** they use the search bar, **Then** mixes are filtered in real-time by name or sound components
5. **Given** the user is viewing their saved mixes, **When** they click a category filter (Focus, Sleep, Nature, Favorites), **Then** only mixes matching that category are displayed
6. **Given** the user selects a saved mix, **When** they click the "Play" button, **Then** the mix loads with all previously saved layers and volumes and begins playing
7. **Given** the user is viewing a saved mix card, **When** they click the "Delete" button, **Then** a confirmation prompt appears and upon confirmation the mix is permanently removed from local storage

---

### User Story 3 - Edit and Fine-Tune Saved Mixes (Priority: P3)

A user has a saved mix but wants to adjust it (add new sounds, remove layers, or tweak volumes) and save the updated version.

**Why this priority**: Editing allows users to refine their soundscapes over time, improving user satisfaction. However, users can still create new mixes from scratch or play existing ones without editing capability, making this a nice-to-have feature for the MVP.

**Independent Test**: Can be tested independently by navigating to "My Mixes", clicking "Edit" on a saved mix, being taken to the Edit Mix view with all layers pre-loaded, making changes (adding/removing layers, adjusting volumes), saving the updated mix, and verifying changes persist when reloading.

**Acceptance Scenarios**:

1. **Given** a user is viewing their saved mixes, **When** they click the "Edit" button on a mix card, **Then** they are navigated to the Edit Mix view with all existing layers pre-loaded at their saved volumes
2. **Given** the user is in Edit Mix view, **When** they update the mix name, **Then** the new name is reflected in the header and will be saved with the mix
3. **Given** the user is editing a mix, **When** they search for and add a new sound layer, **Then** the new layer appears in the active layers list with a default volume
4. **Given** the user is editing a mix, **When** they click "Remove Layer" on an existing sound, **Then** that layer is removed from the active layers and will not be included when saved
5. **Given** the user is editing a mix, **When** they adjust volume sliders for any layer, **Then** the changes are reflected in the preview playback
6. **Given** the user has made changes to a mix, **When** they click "Save Mix", **Then** the updated configuration overwrites the previous version in local storage with a new timestamp
7. **Given** the user has made changes but wants to abandon them, **When** they click "Discard Changes", **Then** they are returned to the previous view without saving and the original mix remains unchanged

---

### User Story 4 - Discover and Explore Landing Page (Priority: P4)

A first-time visitor wants to understand what Focus Mixer is and what benefits it offers before committing to use it.

**Why this priority**: The landing page provides important context and onboarding, but motivated users will skip directly to the mixer. This is the lowest priority for MVP since users can access core functionality without it.

**Independent Test**: Can be tested independently by visiting the root URL, seeing the landing page with hero section, feature descriptions, and CTAs, clicking "Start Mixing" to navigate to the Mixer Interface, or clicking "Listen Demo" to preview sample audio.

**Acceptance Scenarios**:

1. **Given** a user visits the Focus Mixer URL for the first time, **When** the page loads, **Then** they see a landing page with hero section, tagline "Find Your Frequency", and primary CTA "Start Mixing"
2. **Given** the user is on the landing page, **When** they read the hero section, **Then** they see a clear value proposition explaining ambient sound mixing for focus
3. **Given** the user is viewing the landing page, **When** they scroll to the features section, **Then** they see three key features: "Layer Sounds", "Discover Moods", and "Save Your Mixes" with descriptions
4. **Given** the user wants to try the app, **When** they click "Start Mixing", **Then** they are immediately taken to the Mixer Interface
5. **Given** the user wants a preview, **When** they click "Listen Demo", **Then** a sample mix plays demonstrating the app's audio capabilities
6. **Given** the user wants to skip onboarding, **When** they click "Skip Onboarding", **Then** they are taken directly to the Mixer Interface

---

### Edge Cases

- What happens when a user tries to save a mix without any active layers? System should display a validation message requiring at least one layer.
- What happens when a user tries to save a mix with a duplicate name? System should either auto-append a number (e.g., "My Mix (2)") or prompt the user to choose a different name.
- What happens when a user's browser doesn't support localStorage? System should detect this and display a graceful error message explaining that mix saving won't work, but playback still functions.
- What happens when audio files fail to load (network error, missing file)? System should display an error state on the affected sound card and allow the user to continue with other sounds.
- What happens when a user has too many active layers causing performance issues? System should set a reasonable limit (e.g., 10 active layers maximum) and display a message when reached.
- What happens when localStorage quota is exceeded? System should detect the quota error and prompt the user to delete old mixes to free up space.
- What happens when a user tries to play multiple mixes simultaneously? Only one mix should play at a time - starting a new mix should stop the currently playing mix.
- What happens when a user refreshes the page during playback? Playback stops but saved mixes persist. The user can reload their last mix from "My Mixes".

## Requirements *(mandatory)*

### Functional Requirements

#### Design & Visual Theme

- **FR-001**: System MUST use the exact color palette extracted from `/docs` HTML files: Primary `#13b6ec`, Background Dark `#101d22`, Card Dark `#1c292f`, Surface borders `#283539` and `#3b4d54`
- **FR-002**: System MUST use Manrope font family (weights 300, 400, 500, 600, 700) for all text
- **FR-003**: System MUST use Material Symbols Outlined icons for all iconography
- **FR-004**: System MUST implement glassmorphism card styles with backdrop blur (`backdrop-blur-md`) and 80% opacity on sticky headers
- **FR-005**: System MUST use CSS variables for all color values to enable future theming capability
- **FR-006**: System MUST apply the primary cyan glow effect (`box-shadow: 0 0 10px 2px rgba(19, 182, 236, 0.3)`) to active sliders and primary CTAs
- **FR-007**: System MUST match the visual design of all four reference views: landing page, mixer interface, my mixes, and edit mix

#### Landing Page

- **FR-008**: Landing page MUST display a hero section with animated background gradient blur effect in primary color
- **FR-009**: Landing page MUST show the tagline "Find Your Frequency" as the main heading
- **FR-010**: Landing page MUST include two primary CTAs: "Start Mixing" (primary button) and "Listen Demo" (secondary button)
- **FR-011**: Landing page MUST display a features section with three feature cards: "Layer Sounds", "Discover Moods", "Save Your Mixes"
- **FR-012**: Landing page MUST include an abstract visualization of sound waves with animated bars
- **FR-013**: Landing page MUST have a sticky header with logo, app name, and navigation elements

#### Mixer Interface

- **FR-014**: Mixer Interface MUST display all available sounds organized into collapsible categories: "Nature Sounds", "City & Ambience", "White Noise & Focus"
- **FR-015**: Each sound card MUST show: sound name, category label, icon with color-coded background, and current volume percentage
- **FR-016**: System MUST allow users to add sounds to active layers by clicking on sound cards
- **FR-017**: Active layers section MUST display all currently added sounds with individual volume sliders (0-100%)
- **FR-018**: Volume sliders MUST update in real-time as the user drags, showing current percentage value
- **FR-019**: Volume sliders MUST have visual feedback: custom thumb with primary color, glow effect on hover, and filled track bar showing current level
- **FR-020**: Mixer Interface MUST include a search bar to filter available sounds by name or category
- **FR-021**: Mixer Interface MUST display Focus Mode preset pills (Deep Work, Reading, Meditation, Nap) with one active state
- **FR-022**: System MUST provide a floating control bar with master play/pause button and master volume control
- **FR-023**: Floating control bar MUST be fixed at the bottom of viewport and visible at all times during mixing

#### My Mixes (Saved Mixes Library)

- **FR-024**: My Mixes page MUST display all saved mixes as cards in a grid or list layout
- **FR-025**: Each mix card MUST show: mix name, component sounds list, visual thumbnail or gradient, category tags, and last saved timestamp
- **FR-026**: Currently playing mix MUST be visually distinguished with primary color border, pulsing indicator, and "Now Playing" badge
- **FR-027**: My Mixes page MUST include a search bar to filter mixes by name or component sounds
- **FR-028**: My Mixes page MUST include category filter buttons (All, Focus, Sleep, Nature, Favorites) with active state styling
- **FR-029**: Each mix card MUST have action buttons: Play/Pause, Edit, and Delete
- **FR-030**: Delete action MUST show a confirmation dialog before permanently removing a mix
- **FR-031**: My Mixes page MUST have a "Create New Mix" CTA button that navigates to the Mixer Interface

#### Edit Mix View

- **FR-032**: Edit Mix view MUST pre-load all layers from the selected saved mix with their saved volumes
- **FR-033**: Edit Mix view MUST display an editable mix name field with the current name pre-filled
- **FR-034**: Edit Mix view MUST show "Add Sound Layer" search functionality to add new sounds to the mix
- **FR-035**: Edit Mix view MUST display popular sound suggestions as quick-add pills (Fireplace, Ocean Waves, Wind, Lo-Fi Beats)
- **FR-036**: Active layers section MUST allow users to remove individual layers via delete button
- **FR-037**: Each layer MUST have a "Solo" button to temporarily mute all other layers for isolated listening
- **FR-038**: Edit Mix view MUST have a preview play button to test changes before saving
- **FR-039**: Edit Mix view MUST have a sticky footer with "Discard Changes" and "Save Mix" buttons
- **FR-040**: Save action MUST overwrite the existing mix with updated configuration and timestamp

#### Audio Engine

- **FR-041**: System MUST use HTML5 Audio Elements to play sound files from the `/sounds` folder
- **FR-042**: Each sound layer MUST be controlled by a separate Audio Element instance to enable independent playback
- **FR-043**: System MUST support simultaneous playback of multiple audio layers
- **FR-044**: Each Audio Element MUST loop continuously (`loop` attribute set to true)
- **FR-045**: System MUST allow independent volume control for each layer using the Audio Element's `volume` property (0.0 to 1.0)
- **FR-046**: Master volume control MUST multiply each layer's individual volume by the master volume value
- **FR-047**: System MUST load audio files progressively to minimize initial load time
- **FR-048**: System MUST handle audio loading states (loading, ready, error) and display appropriate UI feedback
- **FR-049**: Play/pause controls MUST synchronously start/stop all active Audio Elements
- **FR-050**: System MUST support the main/glue sound pattern: each sound has a `main-[name].mp4` and `glue-[name].mp4` file

#### Data Storage (Coconuts)

- **FR-051**: System MUST store all saved mixes in browser localStorage under a namespaced key (e.g., `focusMixer_mixes`)
- **FR-052**: Each saved mix (Coconut) MUST be stored as a JSON object with properties: id (unique), name, layers (array), timestamp, tags (array)
- **FR-053**: Each layer in a mix MUST store: soundId, soundName, category, volume (0-100), enabled (boolean)
- **FR-054**: System MUST generate a unique ID for each mix using timestamp + random string or UUID
- **FR-055**: System MUST serialize the mixes array to JSON before storing in localStorage
- **FR-056**: System MUST deserialize mixes from localStorage on app load and handle parse errors gracefully
- **FR-057**: System MUST validate localStorage availability before attempting to save and show error if unavailable
- **FR-058**: System MUST automatically save mix metadata (timestamp) whenever a mix is updated
- **FR-059**: System MUST handle localStorage quota exceeded errors and prompt user to free space

#### Sound Library

- **FR-060**: System MUST load sound metadata from a structured catalog defining all available sounds
- **FR-061**: Sound catalog MUST include for each sound: id, name, category, icon, color, main audio path, glue audio path
- **FR-062**: System MUST map sound categories to the folder structure in `/sounds`: rain, thunder, waves, wind, fire, birds, crickets, coffee-shop, singing-bowl, white-noise
- **FR-063**: Each sound MUST have a category-specific color theme matching the reference design (blue for rain, green for birds, cyan for wind, amber for coffee-shop, orange for fire, gray for white-noise)
- **FR-064**: System MUST support at least 10 distinct ambient sounds at launch

#### Navigation & Routing

- **FR-065**: Application MUST have four distinct routes/views: Landing (`/`), Mixer Interface (`/mixer`), My Mixes (`/library`), Edit Mix (`/edit/:mixId`)
- **FR-066**: Navigation between views MUST be handled with client-side routing (no full page reloads)
- **FR-067**: Header MUST be persistent across all views with appropriate navigation links
- **FR-068**: "Start Mixing" CTAs MUST navigate to `/mixer` route
- **FR-069**: "My Library" navigation link MUST navigate to `/library` route
- **FR-070**: Edit button on mix cards MUST navigate to `/edit/:mixId` with the specific mix ID

#### Modular Architecture for Future Features

- **FR-071**: All color values MUST be defined as CSS variables in a central theme file (not hard-coded)
- **FR-072**: Component structure MUST separate UI presentation from business logic (audio engine, storage)
- **FR-073**: Authentication-related UI elements (profile avatar, user name) MUST be placed in isolated components that can be easily enabled/disabled
- **FR-074**: Theme switching logic MUST be implemented as a provider/context pattern that currently only supports dark mode
- **FR-075**: All localStorage operations MUST be abstracted into a storage service layer that can be swapped for API calls later

### Key Entities

- **Mix (Coconut)**: Represents a saved ambient sound configuration created by the user. Contains: unique identifier, user-defined name, array of sound layers with volumes, creation/update timestamps, optional category tags. Stored in localStorage as JSON.

- **Sound Layer**: Represents a single ambient sound added to a mix. Contains: reference to sound definition, current volume level (0-100), enabled/disabled state, solo state. Multiple layers combine to create the final mixed audio output.

- **Sound Definition**: Represents an available ambient sound in the library. Contains: unique identifier, display name, category classification, icon identifier, color theme, file paths for main and glue audio files. Defines the catalog of all sounds users can add to mixes.

- **Focus Mode Preset**: Represents a pre-configured mix template optimized for specific use cases (Deep Work, Reading, Meditation, Nap). Contains: name, icon, recommended sound combinations with default volumes. Can be used as starting point for creating new mixes.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can create their first functional mix (with at least 2 sound layers) within 60 seconds of landing on the mixer interface
- **SC-002**: Users can hear layered audio playback with independent volume control for each sound within 5 seconds of adding layers
- **SC-003**: Users can save a mix and retrieve it from "My Mixes" library with all layers and volumes intact
- **SC-004**: Application loads the landing page in under 3 seconds on a standard broadband connection
- **SC-005**: Audio playback begins within 2 seconds of clicking the play button (excluding network latency for first-time file downloads)
- **SC-006**: Users can successfully adjust individual layer volumes in real-time during playback without audio glitches or lag
- **SC-007**: Visual design matches reference screenshots with correct colors, typography, spacing, and component styling
- **SC-008**: All interactive elements (buttons, sliders, cards) provide visual feedback (hover states, active states) within 100ms
- **SC-009**: Application functions correctly on modern browsers (Chrome, Firefox, Safari, Edge - last 2 versions)
- **SC-010**: Users can manage up to 50 saved mixes without performance degradation in the "My Mixes" library
- **SC-011**: Application remains functional when localStorage is disabled (with graceful degradation: playback works, saving shows error)
- **SC-012**: Users can layer up to 10 simultaneous sounds without audio performance issues

### Assumptions

- Users have modern browsers with HTML5 Audio API support
- Users have functional speakers or headphones
- Sound files in `/sounds` folder are pre-optimized for web playback (reasonable file sizes, appropriate bitrates)
- Users have sufficient localStorage quota (approximately 5MB minimum)
- Desktop and tablet are primary target devices (mobile optimization is out of scope for MVP)
- No user authentication is required (all data is local to the browser)
- Light mode implementation is deferred (CSS variables are prepared but only dark mode is active)
