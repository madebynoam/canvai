# Changelog

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
