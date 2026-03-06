# Bryllen

> **Work in progress.** Bryllen is under active development. Things will break and change.

A design studio on an infinite canvas where every design is live React code. Describe what you want, the agent builds it on the canvas, annotate elements to iterate, and ship the final code to a production repo.

**Current version: 0.0.16**

## Quick start

### 1. Install the Claude Code plugin

In your **terminal**, add the bryllen marketplace:

```bash
claude plugin marketplace add madebynoam/bryllen
```

Then open **Claude Code** and install the plugin:

```
/plugin install bryllen@bryllen
```

Restart your Claude Code session for the plugin to activate.

### 2. Create a project

Open Claude Code in any directory and run:

```
/bryllen-new my-component
```

This will:
- Install bryllen and dependencies
- Scaffold the project files (`index.html`, `vite.config.ts`, `App.tsx`, etc.)
- Start the dev server with live canvas

### 3. Describe your component

Tell the agent what to build. It generates a React component with all meaningful variations and states laid out as a matrix on the canvas:

- **Columns** = states (Default, Hover, Active, Disabled)
- **Rows** = variations (Short text, Long text, With icon, Error)

### 4. Annotate and iterate

Click "Annotate" on the canvas, select an element, describe the change, and click "Apply". The agent receives the annotation automatically and updates the component live.

For rapid annotation sessions, run `/bryllen-watch` to enter watch mode — the agent processes every annotation as it arrives. Send any message to exit back to chat.

Run `/bryllen-iterate` to create a new version (page) while keeping previous iterations frozen.

### 5. Ship

Run `/bryllen-ship` to PR the finished component to a production repo.

## Updating

Run `/bryllen-update` inside a Claude Code session to update both the npm package and plugin.

## Skills

| Skill | Description |
|---|---|
| `/bryllen-new <name>` | Create a new design project |
| `/bryllen-design` | Start the dev server (chat mode) |
| `/bryllen-watch` | Enter watch mode for rapid annotations |
| `/bryllen-iterate` | Create a new design iteration |
| `/bryllen-share` | Build and deploy to GitHub Pages for sharing |
| `/bryllen-ship` | Ship component to a production repo |
| `/bryllen-update` | Update bryllen to latest version |

## CLI

```bash
npx bryllen new       # Scaffold project files and install dependencies
npx bryllen design    # Start Vite dev server + annotation HTTP server
npx bryllen update    # Update bryllen npm package to latest
```

## Project structure

Each design project lives in `src/projects/<name>/`:

```
src/projects/
  my-component/
    MyComponent.tsx   # The React component
    manifest.ts       # Pages and frames (auto-discovered by the canvas)
```

The manifest declares which component variations to render:

```ts
import { MyComponent } from './MyComponent'
import type { ProjectManifest } from 'bryllen/runtime'

const manifest: ProjectManifest = {
  project: 'my-component',
  pages: [
    {
      name: 'V1 — Initial',
      grid: { columns: 3, columnWidth: 300, rowHeight: 160, gap: 40 },
      frames: [
        { id: 'my-component-short-default', title: 'MyComponent / Short / Default', component: MyComponent, props: { text: 'Click' } },
        { id: 'my-component-short-hover', title: 'MyComponent / Short / Hover', component: MyComponent, props: { text: 'Click', state: 'hover' } },
      ],
    },
  ],
}

export default manifest
```

## Architecture

- **npm package** — canvas runtime, Vite plugin, and CLI (`bryllen new`, `bryllen design`)
- **Claude Code plugin** — skills, MCP config, and agent instructions

## Development

### Setup

```bash
git clone https://github.com/madebynoam/bryllen.git
cd bryllen
npm install
```

### Runtime & CLI changes

1. Edit files in `src/runtime/`, `src/cli/`, `src/vite-plugin/`
2. Run `npm test` to verify the export contract
3. Dogfood with `bryllen-ui` — run `npx bryllen design` from the repo root, changes reflect via HMR
4. Breaking export changes need a migration in `src/cli/migrations/` and a template update in `src/cli/templates.js`

### Plugin & skill changes

Plugin changes (skills, MCP, CLAUDE.md) can't be tested until installed. To test locally without pushing:

1. Run `/plugin-local` in the bryllen repo — swaps the marketplace to the local `plugin/` directory
2. In your consumer test folder: `claude plugin update bryllen@bryllen` then restart the session
3. Test the skills
4. Iterate: edit skill files → `claude plugin update bryllen@bryllen` → restart → test again
5. When done, run `/plugin-release` in the bryllen repo — swaps back to GitHub

The consumer folder always uses `bryllen@bryllen` and doesn't need to know whether the source is local or GitHub.

### Publishing

1. `npm test` — export contract + migration tests
2. `npm run test:smoke` — scaffold smoke test
3. `./scripts/bump-version.sh <version>` — bumps all 5 version fields across 4 files
4. Update `CHANGELOG.md`
5. Commit and push to main
6. `/plugin-release` — ensure marketplace points to GitHub
7. In the consumer folder: `claude plugin marketplace update bryllen` then `claude plugin update bryllen@bryllen`

### Commands

| Command | What it does |
|---|---|
| `npm test` | Export contract + migration tests |
| `npm run test:smoke` | Scaffold smoke test |
| `./scripts/bump-version.sh <version>` | Bump all version fields |
| `npx bryllen design` | Start dev server + annotation MCP |
| `npx bryllen new` | Scaffold consumer project files |
| `npx bryllen update` | Update consumer to latest bryllen |

### Dev skills

These skills are only available in the bryllen repo (not in consumer projects):

| Skill | Description |
|---|---|
| `/plugin-local` | Swap bryllen marketplace to local for testing |
| `/plugin-release` | Swap bryllen marketplace back to GitHub |

## License

MIT
