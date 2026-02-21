# Changelog

## V9 — Dark Mode Iteration

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
- No consumer migration needed (all changes internal to `CanvaiShell`)

## 0.0.28 — GitHub Comments

- Added full GitHub-backed comment system to the canvas
- New runtime component: `CommentOverlay` — FAB, targeting, compose card, thread card, avatar pins, auth flow
- New module: `src/mcp/github.js` — GitHub Issues/Comments/Reactions API wrapper (server-side)
- New module: `src/mcp/auth.js` — GitHub OAuth device flow + token storage in `~/.canvai/auth.json`
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

- Extracted `CanvaiShell` runtime component — all shell logic (state, hooks, SSE mode listener, layout, TopBar, sidebar, canvas, annotations) now lives in `canvai/runtime`
- Consumer `App.tsx` reduced from ~100 lines of boilerplate to a 6-line wrapper: `<CanvaiShell manifests={manifests} />`
- Shell changes now ship via `npm update` — no more fragile regex migrations to patch App.tsx
- SSE mode listener (watch/manual) now available to all consumers (previously repo-only)
- Migration 0.0.25: replaces existing consumer App.tsx boilerplate with the CanvaiShell import

## 0.0.24

- Added `rules-guard` PreToolUse hook — blocks writes violating the token → component → page hierarchy (hardcoded colors in components, direct token imports in pages, non-OKLCH values in tokens.css)
- Auto-commit after each design change — `/canvai-check`, `/canvai-watch`, and `/canvai-init` skills now commit after processing
- Added `/canvai-undo` skill — reverts the last commit to undo a bad design change
- Added commit discipline to guard protocol (step 6 in "Before any edit")
- Migration 0.0.24: patches existing consumer `.claude/settings.json` with rules-guard hook + adds commit step to `CLAUDE.md`

## 0.0.23

- Added `ZoomControl` runtime component — reads/writes zoom via `useCanvas()` context (zoomIn, zoomOut, fitToView)
- Added `CanvasColorPicker` runtime component — 5 OKLCH presets persisted in localStorage per project
- Extended `CanvasContext` with `zoomIn`, `zoomOut`, `fitToView` callbacks
- Added `saveCanvasBg` / `loadCanvasBg` localStorage helpers
- Updated App.tsx template with ZoomControl (bottom-center) and CanvasColorPicker (top-right)
- Migration 0.0.23: patches existing consumer App.tsx with both controls + canvas bg state

## canvai-ui-system V6

- Created V6 iteration from V5 (V5 frozen)
- Added `ZoomControl` component — compact +/- zoom with percentage display and fit-to-view
- Added `CanvasColorPicker` component — 5 canvas color presets (Default, Warm, Neutral, Dark, Midnight) for contrast control
- Shell page shows both controls stacked in the top-right corner of the canvas area
- Components page showcases all states: zoom levels, color selections, stacked layout

## 0.0.21

- Promoted `TokenSwatch` and `ColorPicker` to `canvai/runtime` — every project's Tokens page can now let designers click a swatch, pick an OKLCH color with live preview, and post an annotation
- Added `TokenOverrideContext` inside `Canvas` for live CSS custom property propagation during color editing
- Three swatch states: default, editing (live preview), pending (annotation queued for agent)
- Edit and discard support on pending swatches — designer can reopen the picker or trash the annotation before agent picks it up
- Added `colorUtils.ts` runtime module (OKLCH/sRGB/Hex/HSL conversions)
- Migration 0.0.21: patches consumer `CLAUDE.md` with TokenSwatch documentation
- Updated plugin CLAUDE.md and canvai-init skill with TokenSwatch guidance

## 0.0.16

- Grouped iterations: `ProjectManifest.pages` → `ProjectManifest.iterations` with nested pages
- Migration now covers both App.tsx and manifest files (was missing manifests)
- Fixed unsafe optional chaining in App.tsx template
- Fixed stale code bug: `canvai update` now spawns a new process for migrations
- Added `canvai migrate` subcommand
- Added `/plugin-local` and `/plugin-release` dev skills for local plugin testing
- Added development workflow docs to README and CLAUDE.md
- Added integration tests for migration coverage
- Added breaking change coverage rules to engineering guidelines

## 0.0.15

- Added export contract and migration tests (`npm test`)
- Added scaffold smoke test (`npm run test:smoke`)
- Added version bump script (`./scripts/bump-version.sh`)
- Built migration system with `.canvai` version marker
- Synced all version fields (package.json was stuck at 0.0.1)
- Added engineering rules to CLAUDE.md
- Separated repo dev vs consumer-facing CLAUDE.md

## 0.0.14

- Added changelog, markers, icon fix

## 0.0.13

- Run migrate on dev start

## 0.0.12

- Update skill uses `npx canvai update`

## 0.0.11

- Plugin bump

## 0.0.10

- Replaced PageTabs/ProjectSidebar with TopBar/IterationSidebar
- Added AnnotationOverlay annotateMode prop
