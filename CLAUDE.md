# Bryllen — Repo Development

Bryllen is an infinite canvas for Claude Code. Designers describe what they want, Claude generates multiple real React components, they compare side-by-side and ship the best one.

**Jobs to Be Done:**
1. **Explore** — See multiple directions at once → Canvas shows options
2. **Iterate** — Describe changes in words → Click → Type → Applied
3. **Decide** — Grab the file → Cmd+Shift+Click → Finder
4. **Share** — Get feedback → Share button → Link

The code was never a mockup. Explore → Decide → Ship. No handoff.

Two pieces: **npm package** (runtime, Vite plugin, CLI) and **Claude Code plugin** (skills, MCP, agent instructions in `plugin/plugins/bryllen/CLAUDE.md`).

## Project structure

```
src/
  runtime/            ← canvas platform (Canvas, Frame, layout, types)
  vite-plugin/        ← auto-discovers project manifests
  cli/                ← CLI commands (new, design, update)
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
  plugins/bryllen/     ← the plugin (skills, MCP, CLAUDE.md)
```

## Engineering rules

### Version bumps

All 5 fields across 4 files must be bumped together. Use `./scripts/bump-version.sh <version>`.

1. `package.json` → `version`
2. `plugin/.claude-plugin/marketplace.json` → `metadata.version` + `plugins[0].version`
3. `plugin/plugins/bryllen/.claude-plugin/plugin.json` → `version`
4. `.claude-plugin/marketplace.json` → `metadata.version` + `plugins[0].version`

### Export contract

If you remove/rename a runtime export: update template in `src/cli/templates.js`, add migration in `src/cli/migrations/`, run `npm test`.

### Scaffolded file changes (CRITICAL)

Files from `src/cli/templates.js` are **consumer-owned** — copied during `bryllen new`. Changing a template does NOT update existing consumers. If you change ANY scaffolded template:
1. Update template in `src/cli/templates.js`
2. Write migration in `src/cli/migrations/`
3. Bump version via `./scripts/bump-version.sh`

### Pre-push checklist

1. `npm test` passes
2. `npm run test:smoke` passes
3. All 5 version fields bumped
4. Breaking export changes have a migration
5. Root `CHANGELOG.md` updated

### Migration discipline

- Never delete old migration files — consumers could be on any version
- Every breaking change to scaffolded files requires a migration
- Prefer targeted transforms over whole-file replacement
- Migrations must be idempotent

### Breaking change coverage (CRITICAL)

1. Trace ALL consumer files that use a changed type/interface
2. Migrate every file type, not just `migration.files`
3. Write integration tests verifying migrated files work together
4. Use safe optional chaining (`?.[]`) during migration transitions
5. Test against a real consumer project before pushing

### Update command: stale code trap

`bryllen update` runs `npm install` then migrations, but migration code was loaded at startup (old version). The update command spawns `bryllen migrate` as a **new process** after npm install. Never call `runMigrations()` directly inside update.

### Self-healing migrations

The runner checks `applies()` on ALL migrations every run. A partially-applied migration will be re-applied next run. The marker only bumps after all migrations verify clean. `bryllen doctor` is the manual escape hatch.

### Deprecation before removal

First release: `console.warn('[bryllen] X is deprecated, use Y instead')`. Remove in next version with migration.

### Migration authoring

Each file in `src/cli/migrations/` exports: `version`, `description`, `files`, `applies(fileContents)`, `migrate(fileContents)`. Register in `src/cli/migrations/index.js`, sorted by version.

## Runtime shell design

The runtime shell (`src/runtime/`) follows a Dieter Rams / Jony Ive aesthetic. OKLCH-native, 4px grid, Lucide icons, spring physics for all motion. For full palette, spring presets, and motion rules, see `RUNTIME-DESIGN.md`.

Key rules: no pure white/black, `cursor: default` for all shell UI, `text-wrap: pretty`, components must be interactive.

### Dogfooding project (`src/projects/bryllen-ui/`)

Renders actual runtime UI components for visual testing. Imports from `../../runtime/`. When adding/removing runtime components, update `bryllen-ui/manifest.ts`.

## Commands

- `npm test` — export contract + migration tests
- `npm run test:smoke` — scaffold smoke test
- `./scripts/bump-version.sh <version>` — bump all version fields
- `npx bryllen new | design | update | doctor` — CLI commands

### Local plugin testing

1. `/plugin-local` — swaps marketplace to local `plugin/`
2. Edit skills/MCP in `plugin/plugins/bryllen/`
3. In consumer: `claude plugin update bryllen@bryllen` → restart → test
4. `/plugin-release` — swaps back to GitHub

## Skills

**Plugin (consumer-facing):** `/bryllen-new`, `/bryllen-design`, `/bryllen-share`, `/bryllen-close`, `/bryllen-update`
**Dev (repo-local):** `/plugin-local`, `/plugin-release`
