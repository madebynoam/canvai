# Changelog

## 0.0.152 — Fix option-drag duplicate flash

- Root cause: client created optimistic copy with `clientTempUUID`, server generated different `serverUUID`; SSE fired before fetch resolved → copy not found in state → repositioned to (0,0) by applyInitialLayout → flash
- Fix: client now sends its `newId` in the POST body; server uses it instead of generating a new UUID → IDs match → SSE merge finds existing copy → position preserved
- Fix: SSE handler preserves `existing.component` when new componentKey isn't in registry yet (Vite HMR pending) → no "missing component" flash during duplication

## 0.1.0 — Remove DB Mode Conditionals (Breaking Change)

**BREAKING:** Removed manifest mode support. All projects must use the component registry pattern (frames stored in SQLite).

**What changed:**
- Removed manifest mode code paths (~370-420 lines of code)
- Removed `ProjectManifest.frames` and `ProjectManifest.iterations` fields
- Removed `deleted_frames` and `cloned_frames` database tables
- Removed manifest-mode HTTP endpoints (`POST /frame-positions/clone`, `POST /frame-positions/delete`)
- Simplified `useFrames` hook signature (no `sourceFrames` parameter)
- Removed `layoutFrames()` and `layoutProject()` functions
- Removed `ManifestFrame`, `ComponentFrame`, `ImageFrame`, `PageManifest`, `IterationManifest` types

**Benefits:**
- Simpler codebase with single standard pattern
- Eliminated 8+ conditional branches
- Easier to understand and maintain
- Clearer documentation without "mode" concept

**Migration:**
Old manifest-based projects will not work with this version. The component registry pattern has been the standard since 0.0.119.

## 0.0.149 — Fix preview mode (Open In New Tab)

**Fixed "Open In New Tab" stuck on loading.** Preview mode was broken because the frame detection logic required a non-empty components object. Since migrated projects have `components: {}` (empty), frames weren't loading from the database.

- **Root cause:** Frame loading check required non-empty components object, but migrated manifests have empty `components: {}`
- **Fix:** Changed check to `activeProject?.components !== undefined` — any manifest with `components` key loads frames from SQLite
- **Impact:** Preview mode now works — clicking "Open In New Tab" from frame menu correctly loads and displays the frame

## 0.0.144 — Auto-register frames (no more invisible frames)

**Frames now auto-register.** Adding a component to `manifest.components` is all that's needed — the runtime auto-creates frame records in SQLite for any component missing one. No more `POST /frames` step.

- **Auto-registration:** `useFrames` compares registry keys vs stored frames on load, auto-POSTs any missing
- **Auto-layout:** New frames are positioned in a horizontal grid instead of stacking at (0,0). Incremental frames go right of the rightmost existing frame
- **Console warnings:** Frame resolution now logs when a frame is dropped due to componentKey mismatch
- **Killed AllDirectionsPage concept:** Each direction is its own canvas frame. The canvas IS the all-directions view
- **Updated skills:** Removed POST /frames from all agent instructions — manifest is the single source of truth

## 0.0.136 — Progress panel

**Annotation processing is now visible.** When Apply is clicked, a slide-in panel appears on the right edge of the canvas showing Claude's activity in real time:

- Progress messages as they're sent (`progress` endpoint)
- Frames as they're created (names appear with a green dot)
- Pulsing dots while Claude is active
- Auto-dismisses 2s after resolved

The panel uses SSE events already emitted by the server — no server changes needed. Pairs with new progress call instructions added to the agent CLAUDE.md so Claude sends frequent progress updates during annotation processing, ideation, and project creation.

## 0.0.118 — 20x faster CLI commands

**Performance fix:** Changed CLAUDE.md instructions from `npx bryllen` to `node node_modules/bryllen/src/cli/index.js`. `npx` adds 1.5s overhead per command. Direct node execution takes 0.07s.

For 3-4 commands per annotation, this saves 4+ seconds per annotation.

## 0.0.117 — Fix annotation CLI projectId mismatch

**Fixed annotations not being processed by agent:** CLI commands (`watch`, `pending`, `list`, `progress`, `resolve`) were not passing `projectId` to the HTTP server, causing them to query a global fallback database instead of the project-specific database where annotations were actually saved.

- **Root cause:** Frontend saved annotations with `projectId` to project-specific SQLite, but CLI commands queried without `projectId` → different database
- **Fix:** All annotation CLI commands now auto-detect the project (or accept `--project` flag) and pass `projectId` to the HTTP server
- **Impact:** Designer can add multiple annotations and agent will see ALL of them, not just one

## 0.0.108 — Fix frame position persistence

**Fixed overlapping frames bug:** Saved positions were being applied to ALL frames, even those not manually positioned. This caused stale/incorrect positions to persist across sessions.

- **Root cause:** `useFrames.ts` loaded saved positions for all frames regardless of `manuallyPositioned` flag
- **Fix:** Only apply saved positions for frames where `manuallyPositioned: true` — non-manual frames use calculated layout positions
- **Impact:** Fixes overlapping frames, fixes duplicate-looking frames caused by incorrect positions

## 0.0.105 — Flatten to Project → Canvas

Simplified hierarchy from 4 levels (Project → Iteration → Page → Frame) to 2 levels (Project → Canvas with Frames).

**Backwards compatible**: Old manifests with `iterations` structure still work — BryllenShell flattens them automatically.

- **Fixed frame status dropdown**: Click star to pick star/check/x (was clipped by overflow:hidden, now uses portal)
- **Flat manifest structure**: `ProjectManifest` now has direct `frames[]` array instead of nested `iterations[].pages[].frames[]`
- **Removed iterations and pages**: No more iteration picker, no page sidebar — all frames on one infinite canvas
- **Removed Pick mode**: Frame status dropdown (starred/approved/rejected) will replace Pick for marking decisions
- **Added GridConfig**: Configurable layout with `columns`, `columnWidth`, `rowHeight`, `gap`
- **Added frame_status table**: SQLite storage for frame status (none/starred/approved/rejected)
- **Added /frame-status API**: GET and PUT endpoints for frame status
- **Migration 0.0.105**: Flattens old iteration/page structure to flat frames array
- **Deleted files**: IterationSidebar.tsx, NewIterationDialog.tsx, useNavMemory.ts
- **Simplified BryllenShell**: Removed iteration/page state, simplified URL routing to just `/:project`
- **Updated TopBar**: Removed iteration picker, kept project picker
- **Updated AnnotationOverlay**: Removed Pick from annotation modes (now just Refine/Ideate)
- **Updated layout.ts**: `layoutFrames(frames, grid)` signature, added `layoutProject(manifest)` helper
- **Updated templates.js**: New projects get flat `frames[]` manifest

## 0.0.103 — Per-Project SQLite Annotation Storage

- **Breaking**: Annotations now stored in per-project SQLite databases (`src/projects/<name>/.bryllen/annotations.db`)
- Projects now have unique IDs (UUID) generated at creation time
- Switching projects no longer mixes annotations — each project is fully isolated
- Annotations persist across server restarts
- Migration 0.0.103: adds `id` field to existing project manifests
- Old `annotations.json` files are cleaned up on server startup
- Added `projectId` query param to all annotation API endpoints
- SSE events scoped to project for better multi-project support
- Added `projectManifest` template function with UUID generation
- Added per-project annotation database functions to `src/server/db.js`

## 0.0.87

- **fix: persistence race condition** — canvas color and frame positions were being overwritten on mount before the saved values could load. Added load-complete guards to prevent saving until initial fetch completes.

## 0.0.86

- fix: annotations label now uses primary text color for better dark mode contrast

## 0.0.79 — SQLite Persistence

- **Breaking**: Frame positions, viewports, and canvas background colors now stored in SQLite (`.bryllen/bryllen.db`) instead of scattered JSON files and localStorage
- Added `better-sqlite3` dependency for reliable persistence
- Created `src/server/db.js` with schema for `frame_positions`, `context_positions`, `viewports`, and `preferences`
- Migrated all HTTP server endpoints to use SQLite:
  - `GET/PUT /frame-positions` — frame position persistence
  - `PUT /context-positions` — context image positions
  - `GET/PUT /preferences/:key` — canvas bg, viewports
- Removed localStorage fallback from `useFrames.ts` — single source of truth
- Added async `loadCanvasBgAsync`/`saveCanvasBgAsync` and `loadViewportAsync` functions
- Auto-migration: on server startup, imports existing `.bryllen/frame-positions/*.json` into SQLite and deletes old files
- Renamed `src/mcp/` to `src/server/` (it was never MCP, just HTTP)

## 0.0.45 — Pick a Direction

- Added "Pick" mode to annotation toggle — designers can now designate a frame as the "winner" from multiple directions
- Three-way toggle in annotation dialog: Refine | Ideate | Pick
- Pick mode uses green accent color (matches Share button "Shared" state)
- Pick option only shows when targeting frames (hidden for connections and canvas notes)
- AnnotationPanel shows Trophy icon and "Picked this direction" for pick annotations
- Added `pickedFrameId` field to IterationManifest type
- Frame component supports `faded` prop — picked frame renders normally, others show 40% opacity and 50% saturation
- Agent creates new iteration from picked direction with all states built out
- Updated bryllen-design skill with "Pick request arrives" documentation

## 0.0.44 — Paste Anywhere

- Images can now be pasted on any page, not just Context
- Pasted images stay on the page where you put them (physicality)
- Per-page image storage in `context/<pageName>/` subfolders
- Multi-select and connections work with images on any page
- Annotation markers now show sequential numbers (1, 2, 3) instead of server IDs
- Smaller font (10px) in marker dots for better fit with multi-digit numbers
- Context page icon added to sidebar (Images icon)

## 0.0.43 — Share Button

- Added `ShareButton` runtime component — allows designers to trigger `/bryllen-share` directly from the canvas UI
- Added `SharePopover` runtime component — shows GitHub auth flow, deploy status, and shareable URL
- Integrated GitHub OAuth device flow into the Share UI (reuses `~/.bryllen/auth.json` token)
- ShareButton states: checking auth, needs-auth, idle (ready to deploy), sharing (in progress), shared (shows URL)
- SharePopover modes: login prompt, deploy button, URL display with copy/open actions, re-deploy option
- Added `type: 'share'` annotation type to http-server.js for immediate processing
- TopBar now includes ShareButton in right section (DEV mode only)
- Updated bryllen-design skill documentation with share request handling

## V10 — Live App Mirror

- New iteration matching the actual running Bryllen app (light mode)
- Shell page: faithful replica of the live shell — TopBar, sidebar, canvas with frames, ZoomControl, CanvasColorPicker, and FAB
- Components page: expanded to catalog every runtime UI component with multiple instances/states
  - Added FAB (idle/hover/pressed), MarkerDot, ActionButton (primary/ghost/disabled), MenuPanel, DialogCard (empty/filled), InfoButton, Overlay, Frame title
- Tokens page: updated to show the real runtime light-mode values (L=0.985 chrome, L=0.300 accent, etc.)
- Carried forward all V9 pages: GitHub Comments Flow, Annotation Panel

## 0.0.33 — Playwright Visual Review

- Added `screenshot_canvas` MCP tool — agent can screenshot the canvas after applying changes for visual self-review
- Two modes: frame-specific (`frameId` param) or full-canvas (fit-to-view)
- Exposed `window.__bryllen` bridge on Canvas component (`fitToView`, `getFrameBounds`, `getCanvasElement`)
- Added `data-canvas-content` attribute to canvas transform container for Playwright targeting
- Lazy Playwright browser — launched on first screenshot, graceful 503 if not installed
- Added `playwright` as optional dependency
- Removed `/bryllen-check` skill (redundant — `/bryllen-dev` drains backlog on startup)
- Added fast file lookup hint to `/bryllen-dev` — parse annotation `frameId` directly instead of searching

## V9 — Dark Mode Iteration

- InfoButton icon changed from `Info` (circle-in-circle) to `SlidersHorizontal` (settings sliders)
- Canvas corners now use `corner-shape: squircle` with 20px radius (was 12px round)
- Added `ThemeToggle` component — segmented System/Light/Dark toggle with Monitor/Sun/Moon icons
- Shell page: side-by-side dark vs light comparison with per-mode canvas color presets
- Canvas color presets tuned per mode — dark: Seamless/Subtle/Soft/Medium/Cool; light: Default/Warm/Neutral/Cool/Cream
- Dropped sidebar section divider and shell preview borders — borderless chrome, matching light mode
- Created V9 from V8 — full dark mode exploration
- Inverted OKLCH lightness values: chrome L=0.130, canvas L=0.100, text L=0.930
- Accent flipped to light charcoal (L=0.800) with dark text-on-accent
- Hover states use `rgba(255,255,255,...)` instead of `rgba(0,0,0,...)`
- Deeper box shadows for dark surfaces (3x opacity boost)
- Watch mode and functional tokens adjusted for dark backgrounds
- All pages carried forward: Tokens, Components, Shell, GitHub Comments Flow, Annotation Panel

## 0.0.32 — Iteration Picker Breadcrumb

- Replaced `IterationPills` pill strip with a breadcrumb dropdown: `Project › Iteration`
- New `PickerDropdown` generic dropdown component — shared by `ProjectPicker` and iteration picker
- `ProjectPicker` refactored to use `PickerDropdown` internally
- TopBar layout: sidebar toggle → ProjectPicker → ChevronRight separator → iteration PickerDropdown (left-aligned, no more center-absolute section)
- Iteration dropdown rows show name + optional description blurb, newest on top
- Added `description?: string` to `IterationManifest` type
- Trigger icon changed from `ChevronDown` to `ChevronsUpDown` for both pickers
- `IterationPills` deprecated with `console.warn` — will be removed in a future version
- No consumer migration needed (all changes internal to `BryllenShell`)

## 0.0.28 — GitHub Comments

- Added full GitHub-backed comment system to the canvas
- New runtime component: `CommentOverlay` — FAB, targeting, compose card, thread card, avatar pins, auth flow
- New module: `src/mcp/github.js` — GitHub Issues/Comments/Reactions API wrapper (server-side)
- New module: `src/mcp/auth.js` — GitHub OAuth device flow + token storage in `~/.bryllen/auth.json`
- New module: `src/runtime/github-client.ts` — browser-side GitHub API client for static builds
- Extended `http-server.js` with `/auth/*` and `/comments/*` routes + `/comments/events` SSE stream
- New types in `src/runtime/comment-types.ts`: `CommentThread`, `CommentMessage`, `CommentAuthor`, `CommentReaction`, `CommentPin`
- TopBar now shows open comment count badge
- Comment FAB stacks above annotation FAB in bottom-right corner
- Avatar pins track element positions via rAF (same pattern as annotation markers)
- All 3 phases implemented: auth + threading, reactions + menus + annotation promotion + SSE + deep links, polish
- `prefers-reduced-motion` respected, Cmd+Enter to post, Escape to dismiss
- GitHub Pages (static builds): browser authenticates and posts directly to GitHub API
- Local dev: browser routes through localhost:4748 server proxy
- Requires a registered GitHub OAuth App (Client ID hardcoded — register at github.com/settings/applications/new)

## 0.0.25

- Extracted `BryllenShell` runtime component — all shell logic (state, hooks, SSE mode listener, layout, TopBar, sidebar, canvas, annotations) now lives in `bryllen/runtime`
- Consumer `App.tsx` reduced from ~100 lines of boilerplate to a 6-line wrapper: `<BryllenShell manifests={manifests} />`
- Shell changes now ship via `npm update` — no more fragile regex migrations to patch App.tsx
- SSE mode listener (watch/manual) now available to all consumers (previously repo-only)
- Migration 0.0.25: replaces existing consumer App.tsx boilerplate with the BryllenShell import

## 0.0.24

- Added `rules-guard` PreToolUse hook — blocks writes violating the token → component → page hierarchy (hardcoded colors in components, direct token imports in pages, non-OKLCH values in tokens.css)
- Auto-commit after each design change — `/bryllen-check`, `/bryllen-watch`, and `/bryllen-init` skills now commit after processing
- Added `/bryllen-undo` skill — reverts the last commit to undo a bad design change
- Added commit discipline to guard protocol (step 6 in "Before any edit")
- Migration 0.0.24: patches existing consumer `.claude/settings.json` with rules-guard hook + adds commit step to `CLAUDE.md`

## 0.0.23

- Added `ZoomControl` runtime component — reads/writes zoom via `useCanvas()` context (zoomIn, zoomOut, fitToView)
- Added `CanvasColorPicker` runtime component — 5 OKLCH presets persisted in localStorage per project
- Extended `CanvasContext` with `zoomIn`, `zoomOut`, `fitToView` callbacks
- Added `saveCanvasBg` / `loadCanvasBg` localStorage helpers
- Updated App.tsx template with ZoomControl (bottom-center) and CanvasColorPicker (top-right)
- Migration 0.0.23: patches existing consumer App.tsx with both controls + canvas bg state

## bryllen-ui-system V6

- Created V6 iteration from V5 (V5 frozen)
- Added `ZoomControl` component — compact +/- zoom with percentage display and fit-to-view
- Added `CanvasColorPicker` component — 5 canvas color presets (Default, Warm, Neutral, Dark, Midnight) for contrast control
- Shell page shows both controls stacked in the top-right corner of the canvas area
- Components page showcases all states: zoom levels, color selections, stacked layout

## 0.0.21

- Promoted `TokenSwatch` and `ColorPicker` to `bryllen/runtime` — every project's Tokens page can now let designers click a swatch, pick an OKLCH color with live preview, and post an annotation
- Added `TokenOverrideContext` inside `Canvas` for live CSS custom property propagation during color editing
- Three swatch states: default, editing (live preview), pending (annotation queued for agent)
- Edit and discard support on pending swatches — designer can reopen the picker or trash the annotation before agent picks it up
- Added `colorUtils.ts` runtime module (OKLCH/sRGB/Hex/HSL conversions)
- Migration 0.0.21: patches consumer `CLAUDE.md` with TokenSwatch documentation
- Updated plugin CLAUDE.md and bryllen-init skill with TokenSwatch guidance

## 0.0.16

- Grouped iterations: `ProjectManifest.pages` → `ProjectManifest.iterations` with nested pages
- Migration now covers both App.tsx and manifest files (was missing manifests)
- Fixed unsafe optional chaining in App.tsx template
- Fixed stale code bug: `bryllen update` now spawns a new process for migrations
- Added `bryllen migrate` subcommand
- Added `/plugin-local` and `/plugin-release` dev skills for local plugin testing
- Added development workflow docs to README and CLAUDE.md
- Added integration tests for migration coverage
- Added breaking change coverage rules to engineering guidelines

## 0.0.15

- Added export contract and migration tests (`npm test`)
- Added scaffold smoke test (`npm run test:smoke`)
- Added version bump script (`./scripts/bump-version.sh`)
- Built migration system with `.bryllen` version marker
- Synced all version fields (package.json was stuck at 0.0.1)
- Added engineering rules to CLAUDE.md
- Separated repo dev vs consumer-facing CLAUDE.md

## 0.0.14

- Added changelog, markers, icon fix

## 0.0.13

- Run migrate on dev start

## 0.0.12

- Update skill uses `npx bryllen update`

## 0.0.11

- Plugin bump

## 0.0.10

- Replaced PageTabs/ProjectSidebar with TopBar/IterationSidebar
- Added AnnotationOverlay annotateMode prop
