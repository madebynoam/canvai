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
