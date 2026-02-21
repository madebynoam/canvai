/**
 * Scaffold templates for `canvai init`.
 * These are the consumer-project versions of each file,
 * importing from 'canvai/runtime' and 'canvai/vite-plugin'.
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
import { canvaiPlugin } from 'canvai/vite-plugin'

export default defineConfig({
  plugins: [react(), canvaiPlugin()],
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

export const appTsx = `import { CanvaiShell } from 'canvai/runtime'
import { manifests } from 'virtual:canvai-manifests'

export default function App() {
  return <CanvaiShell manifests={manifests} />
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

declare module 'virtual:canvai-manifests' {
  import type { ProjectManifest } from 'canvai/runtime'
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
            "command": "node node_modules/canvai/src/cli/hooks/frozen-guard.js"
          },
          {
            "type": "command",
            "command": "node node_modules/canvai/src/cli/hooks/rules-guard.js"
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

## Design directions (proliferate first)

When a designer first describes a component or feature, do NOT generate one design and ask for feedback. Generate **multiple distinct design directions** — different visual bets, not just different states of the same idea. Three directions minimum.

The designer is not a spec-writer. They are a reactor and curator. Your job is to give them things to react to.

### Layout: one page, one wall

All directions live on a **single manifest page** called "All Directions". Use a \\\`DirectionLabel\\\` component as the first frame in each row. The grid uses N+1 columns (1 label + N state/variation frames per direction):

\`\`\`ts
{
  name: 'All Directions',
  grid: { columns: 6, columnWidth: 960, rowHeight: 800, gap: 40 },
  frames: [
    // Row 1: Direction A
    { id: 'label-a', title: 'Direction A', component: DirectionLabel, props: { letter: 'A', title: 'Minimal', description: '...' } },
    { id: 'dir-a-default', title: 'Dir A / Default', component: DirA, props: { state: 'default' } },
    { id: 'dir-a-hover', title: 'Dir A / Hover', component: DirA, props: { state: 'hover' } },
    // Row 2: Direction B
    { id: 'label-b', title: 'Direction B', component: DirectionLabel, props: { letter: 'B', title: 'Structured', description: '...' } },
    // ... B frames
  ],
}
\`\`\`

Create \\\`DirectionLabel\\\` in \\\`components/\\\` — it follows the same token rules as any component. Each direction should make a genuinely different design bet. Let the designer react — "I like A's density with C's color" — then converge.

Once a direction is chosen, generate all meaningful **variations and states** as frames within that direction.

## Component hierarchy

\`\`\`
Tokens (v<N>/tokens.css)     → OKLCH custom properties, all visual values
  ↓
Components (v<N>/components/) → use ONLY var(--token), can compose each other
  ↓
Pages (v<N>/pages/)           → import ONLY from ../components/, no raw styled HTML
\`\`\`

**A page file defines exactly one function: the exported page component.** Nothing else. No local sub-components, no local helper components, no inline section functions. If you need \\\`TierLockedGate\\\`, \\\`DashboardSection\\\`, \\\`GroupContact\\\` — they are components. Create them in \\\`components/\\\`, export from \\\`components/index.ts\\\`, import in the page. A page that defines more than one function is wrong.

## Hard constraints

- **All colors in OKLCH.** No hex values. No rgb. No hsl.
- **All spacing multiples of 4.** 0, 4, 8, 12, 16, 20, 24… Font sizes exempt.
- **Components use only \\\`var(--token)\\\`.** No hardcoded colors, backgrounds, borders.
- **Pages define exactly one exported function.** Any named function returning JSX belongs in \\\`components/\\\`, not in the page file. This is not optional — a 1,000-line page file is a bug.
- **Pages import only from \\\`../components/\\\`.** No inline styled HTML, no local sub-components.
- **Components must be interactive.** Inputs typeable, buttons clickable, menus openable. No static mockups — the whole point is that everything works.
- **Iterations named V1, V2, V3.** Sequential, never descriptive. Each iteration should include a \\\`description\\\` — a one-line blurb shown in the iteration picker dropdown (e.g. \\\`description: 'Revised spacing and color'\\\`).

## Mandatory pages

Every project must include:
- **Tokens** — renders color swatches (using \\\`TokenSwatch\\\` from \\\`canvai/runtime\\\`), typography scale, spacing grid from \\\`tokens.css\\\`
- **Components** — shows all building blocks individually with variations and states

## Token swatches (runtime)

Canvai provides \\\`TokenSwatch\\\` and \\\`ColorPicker\\\` from \\\`canvai/runtime\\\` for the Tokens page. The designer clicks a swatch to open an OKLCH color picker, sees a live preview across the canvas, and posts an annotation to change the token value.

\\\`\\\`\\\`tsx
import { TokenSwatch } from 'canvai/runtime'

<TokenSwatch
  color="var(--chrome)"
  label="chrome"
  sublabel="oklch(0.952 0.003 80)"
  oklch={{ l: 0.952, c: 0.003, h: 80 }}
  tokenPath="--chrome"
/>
\\\`\\\`\\\`

Props:
- \\\`color\\\` — CSS color string for display
- \\\`label\\\` — Token name shown next to the swatch
- \\\`sublabel\\\` — Optional secondary text (e.g. the OKLCH value)
- \\\`oklch\\\` — If provided, swatch is clickable and opens the color picker (\\\`{ l, c, h }\\\`)
- \\\`tokenPath\\\` — CSS custom property name for the annotation (e.g. \\\`"--chrome"\\\`)

When the designer clicks Apply, \\\`TokenSwatch\\\` posts an annotation (frame ID is derived automatically from the DOM). The agent updates \\\`tokens.css\\\`. Use \\\`TokenSwatch\\\` for every color token on the Tokens page.

## Standard frame widths

| Breakpoint | Width |
|---|---|
| Desktop | \\\`1440\\\` |
| Tablet | \\\`768\\\` |
| Mobile | \\\`390\\\` |

Set per-frame \\\`width\\\` in the manifest or \\\`grid.columnWidth\\\` on the page. Components pages typically use smaller widths (320–640).

## Interactive navigation

If a component has internal navigation (tabs, sidebar nav, segmented sections), handle it with React state inside one component. Do not split navigable sections into separate frames — the point is that it works, not that it looks right in a screenshot.

## Before any edit

1. Read \\\`manifest.ts\\\` — is the iteration frozen? If yes, stop.
2. Check \\\`components/index.ts\\\` — does the component exist? If not, create it first.
3. When creating a new component — add to \\\`index.ts\\\` AND add a showcase entry to the Components page.
4. Hierarchy check — pages use components, components use tokens.
5. Log to \\\`CHANGELOG.md\\\`.
6. **Commit after each change** — After completing the requested changes, stage and commit project files:
   \\\`git add src/projects/ && git commit -m 'style: <brief description of change>'\\\`
   Every change gets its own commit so the designer can rewind with \\\`/canvai-undo\\\`.
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
