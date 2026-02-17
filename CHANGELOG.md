# Changelog

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
