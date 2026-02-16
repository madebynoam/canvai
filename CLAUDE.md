# Canvai — Repo Development

Canvai is a design studio. A Figma-like infinite canvas where every design is live React code.

## Architecture

Canvai has two pieces:
- **npm package** — the canvas runtime, Vite plugin, and CLI (`canvai init`, `canvai dev`)
- **Claude Code plugin** — skills, MCP config, and agent instructions (marketplace in `plugin/`, plugin at `plugin/plugins/canvai/`)

Consumer-facing instructions (design workflow, annotation flow, manifest format, component matrix, design language) live in `plugin/plugins/canvai/CLAUDE.md` — not here.

## Project structure

```
src/
  runtime/            ← canvas platform (Canvas, Frame, layout, types)
  vite-plugin/        ← auto-discovers project manifests
  cli/                ← CLI commands (init, dev, update)
    migrations/       ← versioned migration files
    migrate.js        ← migration runner
    templates.js      ← scaffold templates
  mcp/                ← annotation MCP + HTTP server
  projects/           ← design projects (one folder per project)
  __tests__/          ← export contract + migration tests
scripts/
  bump-version.sh     ← version bump helper
  smoke-test.sh       ← scaffold smoke test
plugin/               ← Claude Code plugin marketplace
  .claude-plugin/     ← marketplace manifest
  plugins/canvai/     ← the plugin (skills, MCP, CLAUDE.md)
```

## Engineering rules

### Version bumps

All 5 fields across 4 files must be bumped together. Use `./scripts/bump-version.sh <version>`.

1. `package.json` → `version`
2. `plugin/.claude-plugin/marketplace.json` → `metadata.version` + `plugins[0].version`
3. `plugin/plugins/canvai/.claude-plugin/plugin.json` → `version`
4. `.claude-plugin/marketplace.json` → `metadata.version` + `plugins[0].version`

### Export contract

If you remove/rename a runtime export, you MUST:
1. Update the template in `src/cli/templates.js`
2. Add a migration in `src/cli/migrations/`
3. Run `npm test` to verify the contract holds

### Pre-push checklist

1. `npm test` passes (export contract + migration tests)
2. `npm run test:smoke` passes (scaffold a fresh project)
3. All 5 version fields bumped via `./scripts/bump-version.sh`
4. Breaking export changes have a migration in `src/cli/migrations/`
5. Root `CHANGELOG.md` updated

### Migration discipline

- Never delete old migration files — consumers could be on any version
- Every breaking change to any scaffolded file requires a migration
- Prefer targeted transforms over whole-file replacement
- Migrations must be idempotent
- Test migrations with `npm test`

### Breaking change coverage (CRITICAL)

When changing a type, interface, or data format:
1. **Trace ALL consumer files** that use it — not just App.tsx but also manifest files, config files, and any agent-generated files
2. **Migrate every file type**, not just the ones in `migration.files`. The runner auto-discovers `src/projects/*/manifest.ts`
3. **Write integration tests** that verify migrated files work together (e.g. migrated App.tsx + migrated manifest)
4. **Use safe optional chaining** (`?.[]`) when accessing properties that may not exist during migration transitions
5. **Test the migration against a real consumer project** before pushing — don't rely only on unit tests

### Update command: stale code trap

`canvai update` runs `npm install` then migrations. But the migration code was loaded at process startup (old version). The new code is on disk but not in memory. The update command handles this by spawning `canvai migrate` as a **new process** after npm install. Never call `runMigrations()` directly inside the update function — it will use stale code.

### Self-healing migrations

The migration runner checks `applies()` on ALL migrations every run, not just ones newer than the marker. This means:
- A migration that partially ran (stale code, bugs) will be re-applied on next run
- The marker is only bumped after ALL migrations verify clean (`applies()` returns false)
- `canvai doctor` is the manual escape hatch — same logic, explicit invocation
- Every migration's `applies()` must detect ALL broken states, including half-migrated files
- Recovery tests must simulate the half-migrated scenario and verify full recovery

### Runtime shell aesthetic (Dieter Rams / Jony Ive)

The runtime shell (`src/runtime/` — TopBar, IterationSidebar, ProjectPicker, AnnotationOverlay) follows a **Dieter Rams / Jony Ive** aesthetic. This does NOT apply to designer projects in `src/projects/` — those are the designer's sandbox.

> "Good design is as little design as possible."

**Principles:**
1. **Honest** — No decoration. Every element earns its place.
2. **Unobtrusive** — The shell disappears; the designer's work is the hero.
3. **Thorough** — Every detail matters: spacing, alignment, color, cursor.
4. **As little as possible** — Remove until it breaks, then add one thing back.

**OKLCH color system (CRITICAL):**

All colors MUST be defined in OKLCH. No random hex values. Every color is part of a cohesive perceptual system with intentional lightness (L), chroma (C), and hue (H) relationships. The OKLCH exploration lives in `src/projects/canvai-ui/OklchPalettes.tsx`.

**Shell palette — warm neutrals (h=80, c=0.003 — Rams palette):**

| Token | OKLCH | Role |
|---|---|---|
| Chrome | `oklch(0.952 0.003 80)` | Sidebar + topbar surface |
| Chrome active | `oklch(0.935 0.003 80)` | Hover/active on chrome |
| Canvas | `oklch(0.972 0.003 80)` | Workspace — lighter than chrome |
| Card | `oklch(0.993 0.003 80)` | Cards on canvas — near-white |
| Border | `oklch(0.895 0.005 80)` | Chrome borders |
| Border soft | `oklch(0.915 0.003 80)` | Card borders (softer) |
| Text primary | `oklch(0.180 0.005 80)` | Primary text |
| Text secondary | `oklch(0.380 0.005 80)` | Secondary text |
| Text tertiary | `oklch(0.540 0.005 80)` | Tertiary text |
| Text faint | `oklch(0.660 0.003 80)` | Ghost / placeholder |

**Accent** — the ONE color. Braun indicator green (SK 4 power light) at `oklch(0.52 0.14 155)`. Everything else is warm neutral.

**Rules:**
- **All colors in OKLCH.** Never introduce a raw hex value. Derive every color from the OKLCH system — adjust L (lightness), C (chroma), or H (hue) intentionally. Hex values like `#E5E7EB` are legacy; new code uses `oklch()`.
- **Achromatic shell (c ≤ 0.003).** The shell has no hue. Chrome, canvas, borders, and text are pure perceptual grays. The accent is the only color.
- One accent hue. Everything else is grayscale.
- **4px spacing grid.** Every value (padding, margin, gap, width, height, indent, border-radius) must be a multiple of 4. Font sizes are exempt.
- Allowed: 0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 48, 64…
- Border-radius tiers: 4px controls, 8px cards/dropdowns, 12-20px pills.
- Hover: `rgba(0,0,0,0.03)`. Active: `rgba(0,0,0,0.06)`. No flashy transitions.
- `cursor: default` for all shell UI. Never `cursor: pointer` — reserve it for designer sandboxes.
- **`text-wrap: pretty`** on all text elements. No widows (single words on the last line).
- **Icons: Lucide React** (`lucide-react`). No hand-drawn SVGs. Size tiers: 16px primary actions (menu items, FAB), 14px secondary (close, trash, checks, sidebar toggle), 12px decorative (chevrons in triggers). Always `strokeWidth={1.5}`.
- **Components must be interactive.** This is a live canvas, not Figma. Text inputs should be typeable, menus should open on click, buttons should have hover/active states. No static mockups — the whole point is that everything works without prototyping.

### Motion language (Rams restraint + Matas physics)

Every transition uses spring physics — no CSS durations, no `ease-in-out`. Objects have mass, momentum, and friction.

> "As little design as possible" — but the little that remains should feel like physics.

**Spring presets:**

| Preset | Tension | Friction | Use for |
|---|---|---|---|
| `snappy` | 300 | 20 | Buttons, toggles, micro-feedback |
| `gentle` | 170 | 18 | Cards, panels, modals |
| `soft` | 120 | 14 | Tooltips, toasts, page transitions |

**Principles:**
- **Mass** — Heavier elements move slower. A modal has more mass than a tooltip.
- **Momentum** — Objects in motion stay in motion. Swipe gestures carry velocity.
- **Friction** — Everything decelerates naturally. Nothing stops abruptly.
- **Restraint** — If it doesn't help the user, it doesn't move. No gratuitous animation.

**Rules:**
- No `transition: 0.3s ease`. Use spring physics (tension/friction/mass) — motion is emergent, not scripted.
- Reveals: scale from 0.8→1 + translateY with spring overshoot. Opacity fades in parallel.
- Dismissals: reverse the reveal with slightly higher friction for a controlled exit.
- Button press: spring squish (scale 0.92) then bounce-back. No duration.
- Dropdowns: scaleY from transform-origin top. Spring snappy preset.
- Panels: translateX slide with gentle preset.
- Toasts: translateY spring up from bottom, auto-dismiss after 2-3s with fade.
- For prototyping, CSS `cubic-bezier(0.34, 1.56, 0.64, 1)` approximates spring overshoot. Production should use a spring library.

### Dogfooding project (`src/projects/canvai-ui/`)

The `canvai-ui` project renders the actual runtime UI components (TopBar, ProjectPicker, IterationSidebar, etc.) so we can visually test the canvas itself. It imports directly from `../../runtime/`, so existing component changes are reflected instantly via HMR.

When you modify runtime UI components:
- **Change props/appearance** — automatically reflected, nothing to do
- **Add a new UI component** — add a preview wrapper + frame to `canvai-ui/manifest.ts`
- **Remove a UI component** — remove its frame from `canvai-ui/manifest.ts`
- **Change a component's props interface** — update the corresponding preview wrapper

### Deprecation before removal

When removing a runtime export:
1. First release a version that logs `console.warn('[canvai] X is deprecated, use Y instead')`
2. Remove in the next version with a migration

### Migration authoring

Each migration file in `src/cli/migrations/` exports:
- `version` — semver string (e.g. `'0.0.10'`)
- `description` — what it does
- `files` — array of file paths this migration can touch
- `applies(fileContents)` — returns true if migration is needed
- `migrate(fileContents)` — returns `{ filepath: newContent }` map

Register new migrations in `src/cli/migrations/index.js`. Keep them sorted by version.

## Commands

- `npm test` — run export contract + migration tests
- `npm run test:smoke` — scaffold smoke test
- `./scripts/bump-version.sh <version>` — bump all version fields
- `npx canvai init` — scaffold consumer project files
- `npx canvai dev` — start dev server + annotation MCP
- `npx canvai update` — update canvai to latest from GitHub
- `npx canvai doctor` — check and fix project files (self-healing migrations)

### Local plugin testing

Plugin skills and MCP changes can't be tested until the plugin is installed. To avoid pushing untested changes:

1. **`/plugin-local`** — Swaps the canvai marketplace from GitHub to the local `plugin/` directory
2. Edit skills/MCP/CLAUDE.md in `plugin/plugins/canvai/`
3. In the consumer folder: `claude plugin update canvai@canvai` → restart session → test
4. **`/plugin-release`** — Swaps the marketplace back to GitHub after pushing

The consumer folder always uses `canvai@canvai` — it doesn't need to know whether the source is local or GitHub.

## Skills

### Plugin skills (consumer-facing, in `plugin/plugins/canvai/skills/`)

- **`/canvai-init <project-name>`** — Create a new design project and start designing
- **`/canvai-check`** — Check for pending annotations and process them
- **`/canvai-dev`** — Start (or restart) the dev server (chat mode)
- **`/canvai-watch`** — Enter watch mode for rapid annotation sessions
- **`/canvai-iterate`** — Create a new design iteration
- **`/canvai-share`** — Build and deploy to GitHub Pages for sharing
- **`/canvai-ship`** — Ship component to a production repo
- **`/canvai-update`** — Update canvai to the latest version

### Dev skills (repo-local, in `.claude/skills/`)

- **`/plugin-local`** — Swap canvai marketplace to local for testing
- **`/plugin-release`** — Swap canvai marketplace back to GitHub
