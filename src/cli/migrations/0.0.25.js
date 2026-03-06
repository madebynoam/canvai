/**
 * Migration 0.0.25: Replace App.tsx boilerplate with BryllenShell
 *
 * All shell logic (state, hooks, SSE, layout) now lives in BryllenShell,
 * a runtime component. Consumer App.tsx becomes a 6-line wrapper.
 */

export const version = '0.0.25'

export const description = 'Replace App.tsx boilerplate with BryllenShell component'

export const files = ['src/App.tsx']

export function applies(fileContents) {
  const app = fileContents['src/App.tsx']
  if (!app) return false
  // Already migrated
  if (app.includes('BryllenShell')) return false
  // Detect current boilerplate by shell component signatures
  if (app.includes('TopBar') && app.includes('IterationSidebar') && app.includes('<Canvas')) return true
  // Catch pre-0.0.10 patterns
  if (app.includes('PageTabs') || app.includes('ProjectSidebar')) return true
  return false
}

export function migrate(fileContents) {
  const app = fileContents['src/App.tsx']
  if (!app) return {}
  if (app.includes('BryllenShell')) return { 'src/App.tsx': app }

  return {
    'src/App.tsx': `import { BryllenShell } from 'bryllen/runtime'
import { manifests } from 'virtual:bryllen-manifests'

export default function App() {
  return <BryllenShell manifests={manifests} />
}
`,
  }
}
