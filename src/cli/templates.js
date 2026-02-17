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

export const appTsx = `import { useState } from 'react'
import { Canvas, Frame, useFrames, useNavMemory, layoutFrames, TopBar, IterationPills, IterationSidebar, AnnotationOverlay, N, E } from 'canvai/runtime'
import { manifests } from 'virtual:canvai-manifests'
import type { ProjectManifest } from 'canvai/runtime'

function App() {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mode] = useState<'manual' | 'watch'>('manual')
  const [pendingCount, setPendingCount] = useState(0)

  const activeProject: ProjectManifest | undefined = manifests[activeProjectIndex]
  const { iterationIndex: activeIterationIndex, pageIndex: activePageIndex, setIteration: setActiveIterationIndex, setPage: setActivePageIndex } = useNavMemory(
    activeProject?.project ?? '',
    activeProject?.iterations ?? [],
  )

  const activeIteration = activeProject?.iterations?.[activeIterationIndex]
  const iterClass = activeIteration ? \`iter-\${activeIteration.name.toLowerCase()}\` : ''
  const activePage = activeIteration?.pages?.[activePageIndex]
  const layoutedFrames = activePage ? layoutFrames(activePage) : []

  const { frames, updateFrame, handleResize } = useFrames(layoutedFrames, activePage?.grid)

  return (
    <div id="canvai-root" style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopBar
        projects={manifests}
        activeProjectIndex={activeProjectIndex}
        onSelectProject={setActiveProjectIndex}
        iterations={activeProject?.iterations ?? []}
        activeIterationIndex={activeIterationIndex}
        onSelectIteration={setActiveIterationIndex}
        pendingCount={pendingCount}
        mode={mode}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(o => !o)}
      />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <IterationSidebar
          iterationName={activeIteration?.name ?? ''}
          pages={activeIteration?.pages ?? []}
          activePageIndex={activePageIndex}
          onSelectPage={setActivePageIndex}
          collapsed={!sidebarOpen}
        />

        <div className={iterClass} style={{ flex: 1, backgroundColor: N.chrome, padding: \`\${E.insetTop}px \${E.inset}px \${E.inset}px\` }}>
          <div style={{
            width: '100%', height: '100%',
            borderRadius: E.radius,
            backgroundColor: N.canvas,
            boxShadow: E.shadow,
            overflow: 'hidden',
          }}>
            <Canvas pageKey={\`\${activeProject?.project ?? ''}-\${activeIteration?.name ?? ''}-\${activePage?.name ?? ''}\`}>
              {frames.map(frame => (
                <Frame
                  key={frame.id}
                  id={frame.id}
                  title={frame.title}
                  x={frame.x}
                  y={frame.y}
                  width={frame.width}
                  height={frame.height}
                  onMove={(id, newX, newY) => updateFrame(id, { x: newX, y: newY })}
                  onResize={handleResize}
                >
                  <frame.component {...(frame.props ?? {})} />
                </Frame>
              ))}
            </Canvas>
          </div>
        </div>
      </div>

      {import.meta.env.DEV && <AnnotationOverlay endpoint="http://localhost:4748" frames={frames} annotateMode={mode} onPendingChange={setPendingCount} />}
    </div>
  )
}

export default App
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

## Component hierarchy

\`\`\`
Tokens (v<N>/tokens.css)     → OKLCH custom properties, all visual values
  ↓
Components (v<N>/components/) → use ONLY var(--token), can compose each other
  ↓
Pages (v<N>/pages/)           → import ONLY from ../components/, no raw styled HTML
\`\`\`

## Hard constraints

- **All colors in OKLCH.** No hex values. No rgb. No hsl.
- **All spacing multiples of 4.** 0, 4, 8, 12, 16, 20, 24… Font sizes exempt.
- **Components use only \\\`var(--token)\\\`.** No hardcoded colors, backgrounds, borders.
- **Pages import only from \\\`../components/\\\`.** Never inline styled HTML in pages.
- **Components must be interactive.** Inputs typeable, buttons clickable, menus openable. No static mockups — the whole point is that everything works.
- **Iterations named V1, V2, V3.** Sequential, never descriptive.

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
  frameId="v1-tok-colors"
/>
\\\`\\\`\\\`

Props:
- \\\`color\\\` — CSS color string for display
- \\\`label\\\` — Token name shown next to the swatch
- \\\`sublabel\\\` — Optional secondary text (e.g. the OKLCH value)
- \\\`oklch\\\` — If provided, swatch is clickable and opens the color picker (\\\`{ l, c, h }\\\`)
- \\\`tokenPath\\\` — CSS custom property name for the annotation (e.g. \\\`"--chrome"\\\`)
- \\\`frameId\\\` — Frame ID from the manifest, used in the annotation payload

When the designer clicks Apply, \\\`TokenSwatch\\\` posts an annotation. The agent updates \\\`tokens.css\\\`. Use \\\`TokenSwatch\\\` for every color token on the Tokens page.

## Interactive navigation

If a component has internal navigation (tabs, sidebar nav, segmented sections), handle it with React state inside one component. Do not split navigable sections into separate frames — the point is that it works, not that it looks right in a screenshot.

## Before any edit

1. Read \\\`manifest.ts\\\` — is the iteration frozen? If yes, stop.
2. Check \\\`components/index.ts\\\` — does the component exist? If not, create it first.
3. When creating a new component — add to \\\`index.ts\\\` AND add a showcase entry to the Components page.
4. Hierarchy check — pages use components, components use tokens.
5. Log to \\\`CHANGELOG.md\\\`.
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
