# canvai-init Onboarding Overhaul Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make `/canvai-init` the single entry point — it handles git, npm, scaffold, MCP config, and `.gitignore` so consumers never need to read a README.

**Architecture:** The plugin skill orchestrates everything conversationally. The CLI scaffold (`canvai init`) gains two new output files — `.gitignore` and `.mcp.json`. A migration ensures existing consumers get `.mcp.json` on their next `canvai dev` or `canvai update`.

**Tech Stack:** Node.js (CJS-free ESM migrations), Claude Code plugin skills (Markdown), `./scripts/bump-version.sh`

---

## Task 1: Update the `canvai-init` skill

**Files:**
- Modify: `plugin/plugins/canvai/skills/canvai-init/SKILL.md`

**Step 1: Read the current skill**

Read `plugin/plugins/canvai/skills/canvai-init/SKILL.md` to have it in context.

**Step 2: Rewrite the Steps section**

Replace the Steps section with this ordering:

```markdown
## Steps

1. **Parse the project name** from the user's command (e.g. `/canvai-init button`). If no name is provided, ask for one.

2. **Initialize git** — check for a `.git` directory in the current folder.
   - If missing: run `git init`
   - If already a repo: continue

3. **Create `.gitignore`** — check if `.gitignore` exists.
   - If missing: create it with standard Node content (node_modules, dist, .DS_Store, *.local)
   - If exists: leave it alone

4. **Check if canvai is installed.** Look for `package.json` in the current directory.
   - If no `package.json`: run `npm init -y && npm install github:madebynoam/canvai`
   - If `package.json` exists but no canvai dependency: run `npm install github:madebynoam/canvai`
   - If already installed: continue

5. **Scaffold the project.** Run:
   ```bash
   npx canvai init
   ```
   This creates `index.html`, `vite.config.ts`, `src/App.tsx`, `src/main.tsx`, `CLAUDE.md` (project rules), `.claude/settings.json` (frozen guard hook), `.mcp.json` (annotation MCP config), `.gitignore`, tsconfigs, and installs peer dependencies. Files that already exist are skipped.

6. **Activate the annotation MCP.** The `.mcp.json` was just created. Tell the user:
   > "The annotation MCP has been configured. You'll need to **restart Claude Code** once before annotations work. We'll build the project first, then you restart."

7. **Create the project folder structure:**
   ```
   src/projects/<project-name>/
     v1/
       tokens.css             ← OKLCH custom properties (.iter-v1 + :root scope)
       components/
         index.ts             ← barrel export (empty initially)
       pages/                 ← empty initially
       spring.ts              ← if motion is needed (copy from canvai template)
     manifest.ts
     CHANGELOG.md
   ```

8. **Initial commit:** Create a git commit with the scaffolded project:
   ```bash
   git add . && git commit -m 'feat: init <project-name> project'
   ```

9. **Launch the dev server** in the background:
   ```bash
   npx canvai dev
   ```
   This starts both Vite and the annotation HTTP server in one command.

10. **Confirm and remind:**
    > "Project `<project-name>` is live at http://localhost:5173. **Restart Claude Code now** to activate the annotation MCP — then describe a component and I'll generate it on the canvas."
```

**Step 3: Commit**

```bash
git add plugin/plugins/canvai/skills/canvai-init/SKILL.md
git commit -m "feat: canvai-init handles git, gitignore, and mcp setup"
```

---

## Task 2: Add `.gitignore` and `.mcp.json` to scaffold templates

**Files:**
- Modify: `src/cli/templates.js`
- Modify: `src/cli/index.js`

**Step 1: Add templates to `templates.js`**

At the bottom of `src/cli/templates.js`, add two new exports:

```js
export const gitignore = `node_modules
dist
.DS_Store
*.local
.canvai
`

export const mcpJson = `{
  "mcpServers": {
    "canvai-annotations": {
      "command": "node",
      "args": ["node_modules/canvai/src/mcp/mcp-server.js"]
    }
  }
}
`
```

**Step 2: Import and register in `index.js`**

In `src/cli/index.js`, add `gitignore` and `mcpJson` to the import from `./templates.js`:

```js
import {
  indexHtml,
  viteConfig,
  mainTsx,
  appTsx,
  indexCss,
  viteEnvDts,
  tsconfigJson,
  tsconfigAppJson,
  tsconfigNodeJson,
  claudeSettingsJson,
  claudeMd,
  gitignore,
  mcpJson,
} from './templates.js'
```

Then add both to the `files` array in `scaffold()`:

```js
const files = [
  ['index.html', indexHtml],
  ['vite.config.ts', viteConfig],
  ['tsconfig.json', tsconfigJson],
  ['tsconfig.app.json', tsconfigAppJson],
  ['tsconfig.node.json', tsconfigNodeJson],
  ['src/main.tsx', mainTsx],
  ['src/App.tsx', appTsx],
  ['src/index.css', indexCss],
  ['src/vite-env.d.ts', viteEnvDts],
  ['.claude/settings.json', claudeSettingsJson],
  ['CLAUDE.md', claudeMd],
  ['.gitignore', gitignore],
  ['.mcp.json', mcpJson],
]
```

**Step 3: Verify scaffold output manually**

Run: `node src/cli/index.js init` in a temp directory and confirm `.gitignore` and `.mcp.json` are created.

**Step 4: Commit**

```bash
git add src/cli/templates.js src/cli/index.js
git commit -m "feat: scaffold .gitignore and .mcp.json on canvai init"
```

---

## Task 3: Migration 0.0.27 — add `.mcp.json` for existing consumers

Existing consumers who already ran `canvai init` don't have `.mcp.json`. This migration creates it for them on their next `canvai dev` or `canvai update`.

**Files:**
- Create: `src/cli/migrations/0.0.27.js`
- Modify: `src/cli/migrations/index.js`

**Step 1: Write the migration**

Create `src/cli/migrations/0.0.27.js`:

```js
/**
 * Migration 0.0.27: Add .mcp.json for annotation MCP
 *
 * Early consumers who ran `canvai init` before 0.0.27 don't have .mcp.json.
 * Without it, the annotation MCP tools (watch_annotations, get_pending_annotations)
 * are not available in Claude Code.
 *
 * This migration creates .mcp.json if it doesn't exist, or adds the
 * canvai-annotations entry if it exists but is missing the entry.
 */

export const version = '0.0.27'

export const description = 'Add .mcp.json for annotation MCP (canvai-annotations server)'

export const files = ['.mcp.json']

const ENTRY = {
  command: 'node',
  args: ['node_modules/canvai/src/mcp/mcp-server.js'],
}

export function applies(fileContents) {
  const content = fileContents['.mcp.json']
  // Missing file
  if (!content) return true
  // File exists but missing canvai-annotations entry
  try {
    const parsed = JSON.parse(content)
    return !parsed?.mcpServers?.['canvai-annotations']
  } catch {
    return false // malformed — don't touch
  }
}

export function migrate(fileContents) {
  const content = fileContents['.mcp.json']

  if (!content) {
    // Create from scratch
    return {
      '.mcp.json': JSON.stringify(
        { mcpServers: { 'canvai-annotations': ENTRY } },
        null,
        2,
      ) + '\n',
    }
  }

  // Merge the entry in
  try {
    const parsed = JSON.parse(content)
    parsed.mcpServers = parsed.mcpServers ?? {}
    parsed.mcpServers['canvai-annotations'] = ENTRY
    return { '.mcp.json': JSON.stringify(parsed, null, 2) + '\n' }
  } catch {
    return {}
  }
}
```

**Step 2: Register in `index.js`**

Add to `src/cli/migrations/index.js`:

```js
import * as m0027 from './0.0.27.js'

export const migrations = [m0010, m0016, m0017, m0018, m0019, m0020, m0021, m0022, m0023, m0024, m0025, m0026, m0027]
```

**Step 3: Run existing tests to make sure nothing regresses**

Run: `npm test`
Expected: all tests pass

**Step 4: Commit**

```bash
git add src/cli/migrations/0.0.27.js src/cli/migrations/index.js
git commit -m "feat: migration 0.0.27 — create .mcp.json for existing consumers"
```

---

## Task 4: Bump version to 0.0.27

**Step 1: Run the bump script**

```bash
./scripts/bump-version.sh 0.0.27
```

This updates all 5 version fields across 4 files simultaneously.

**Step 2: Verify**

```bash
grep '"version"' package.json plugin/.claude-plugin/marketplace.json plugin/plugins/canvai/.claude-plugin/plugin.json .claude-plugin/marketplace.json
```

All should show `0.0.27`.

**Step 3: Run tests**

```bash
npm test
```

Expected: pass.

**Step 4: Commit**

```bash
git add package.json plugin/.claude-plugin/marketplace.json plugin/plugins/canvai/.claude-plugin/plugin.json .claude-plugin/marketplace.json
git commit -m "chore: bump to 0.0.27"
```

---

## Done

The consumer onboarding path is now:

1. `claude plugin marketplace add canvai` (one-time, adds the plugin)
2. `/canvai-init my-project` (everything else — git, npm, scaffold, MCP, first commit, dev server)
3. Restart Claude Code (to activate annotation MCP)
4. Describe a component

No README required.
