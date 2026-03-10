/**
 * Scaffold templates for `bryllen new`.
 * These are the consumer-project versions of each file,
 * importing from 'bryllen/runtime' and 'bryllen/vite-plugin'.
 */

export const indexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Canvai</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`

export const viteConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { bryllenPlugin } from 'bryllen/vite-plugin'

export default defineConfig({
  plugins: [react(), bryllenPlugin()],
})
`

export const mainTsx = `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
`

export const appTsx = `import { BryllenShell } from 'bryllen/runtime'
import { manifests } from 'virtual:bryllen-manifests'

export default function App() {
  return <BryllenShell manifests={manifests} />
}
`

export const indexCss = `*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body, #root {
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  background: #F0F0F0;
  color: #1F2937;
}
`

export const viteEnvDts = `/// <reference types="vite/client" />

declare module 'virtual:bryllen-manifests' {
  import type { ProjectManifest } from 'bryllen/runtime'
  export const manifests: ProjectManifest[]
}
`

export const claudeSettingsJson = `{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "node node_modules/bryllen/src/cli/hooks/frozen-guard.js"
          },
          {
            "type": "command",
            "command": "node node_modules/bryllen/src/cli/hooks/rules-guard.js"
          }
        ]
      }
    ]
  }
}
`

export const tsconfigJson = `{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
`

export const tsconfigAppJson = `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"]
}
`

export const claudeMd = `# Project Rules

These rules are enforced by the agent. Do not remove this file.

## What Canvai Is For

Canvai is hired for four jobs:
1. **Explore** — See multiple directions at once (canvas shows options)
2. **Iterate** — Describe changes in words (click → type → applied)
3. **Decide** — Pick the best direction (ship the code)
4. **Share** — Get feedback (share button → link)

The code was never a mockup. Explore → Decide → Ship. No handoff.

## Design directions (proliferate first)

Generate **3+ distinct design directions** as frames on the canvas — different visual bets, not variations of one idea. Let the designer react and converge.

## Component hierarchy

\\\`\\\`\\\`
Tokens (tokens.css)     → OKLCH custom properties, all visual values
  ↓
Components (components/) → use ONLY var(--token), can compose each other
  ↓
Pages (pages/)           → import ONLY from ../components/
\\\`\\\`\\\`

A page defines exactly one exported function. Any sub-component belongs in \\\`components/\\\`.

## Hard constraints

- **OKLCH only.** No hex, rgb, hsl.
- **4px spacing grid.** Font sizes exempt.
- **Components use \\\`var(--token)\\\` only.** No hardcoded visual values.
- **Pages import only from \\\`../components/\\\`.** No inline styled HTML.
- **Components must be interactive.** Inputs typeable, buttons clickable, menus openable.

## Mandatory frames

- **Tokens** — color swatches (\\\`TokenSwatch\\\` from \\\`bryllen/runtime\\\`), typography, spacing
- **Components** — all building blocks with variations and states

### TokenSwatch

\\\`\\\`\\\`tsx
import { TokenSwatch } from 'bryllen/runtime'
<TokenSwatch color="var(--chrome)" label="chrome" sublabel="oklch(0.952 0.003 80)"
  oklch={{ l: 0.952, c: 0.003, h: 80 }} tokenPath="--chrome" />
\\\`\\\`\\\`

## Standard frame widths

Desktop: \\\`1440\\\` · Tablet: \\\`768\\\` · Mobile: \\\`390\\\`

## Interactive navigation

Components with internal navigation (tabs, sidebar) use React state in one component. Don't split into separate frames — navigation must work.

## Before any edit

1. Read \\\`manifest.ts\\\`.
2. Check \\\`components/index.ts\\\` — component exists? If not, create first.
3. New components: add to barrel AND Components showcase frame.
4. Hierarchy check — pages use components, components use tokens.
5. Log to \\\`CHANGELOG.md\\\`.
6. **Commit after each change:** \\\`git add src/projects/ && git commit -m 'style: <description>'\\\`
`

export const tsconfigNodeJson = `{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["vite.config.ts"]
}
`

export const gitignore = `node_modules
dist
.DS_Store
*.local
.bryllen
.bryllen-ports.json
.bryllen-active-project
.bryllen-update-requested
.bryllen-update-result.json
`

// MCP removed in favor of CLI commands — no .mcp.json needed

/**
 * Generate a UUID v4.
 * Uses crypto.randomUUID if available, otherwise fallback.
 */
function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  // Fallback for older Node.js versions
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
}

/**
 * Project manifest template.
 * Creates the initial manifest.ts for a new project with a unique ID.
 */
export function projectManifest({ name }) {
  const id = generateUUID()
  return `import type { ProjectManifest } from 'bryllen/runtime'

const manifest: ProjectManifest = {
  id: '${id}',
  project: '${name}',
  components: {},
}

export default manifest
`
}

/**
 * Project-level CLAUDE.md template.
 * Created in src/projects/<name>/CLAUDE.md when a new project is made.
 * The agent should read this before generating designs.
 */
export function projectClaudeMd({ name, description, prompt }) {
  return `# ${name}

${description || 'A design project on Canvai.'}

## Project Brief

${prompt ? `**Initial prompt:** ${prompt}\n\n` : ''}**Purpose:** [What is this project for?]

**Target Audience:** [Who will use this?]

**Tone:** [Minimal, playful, technical, warm, etc.]

**Key Messages:**
- [Main value proposition]
- [Secondary message]

## Copy Guidelines

When generating designs for this project:
- [Guidelines for headlines]
- [Guidelines for body copy]
- [What NOT to include]
`
}
