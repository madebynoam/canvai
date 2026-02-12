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

## Skills

- **`/canvai-init <project-name>`** — Create a new design project and start designing
- **`/canvai-check`** — Check for pending annotations and process them
- **`/canvai-dev`** — Start (or restart) the dev server (chat mode)
- **`/canvai-watch`** — Enter watch mode for rapid annotation sessions
- **`/canvai-iterate`** — Create a new design iteration
- **`/canvai-share`** — Build and deploy to GitHub Pages for sharing
- **`/canvai-ship`** — Ship component to a production repo
- **`/canvai-update`** — Update canvai to the latest version
