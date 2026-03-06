/**
 * Migration 0.0.65: Rename canvai → bryllen
 *
 * Catches consumers who had the intermediate CanvaiShell pattern
 * that wasn't detected by migration 0.0.25.
 */

export const version = '0.0.65'

export const description = 'Rename canvai imports to bryllen (CanvaiShell → BryllenShell)'

export const files = ['src/App.tsx', 'vite.config.ts']

export function applies(fileContents) {
  const app = fileContents['src/App.tsx']
  const viteConfig = fileContents['vite.config.ts']

  // Check for any canvai references
  if (app?.includes('canvai/runtime')) return true
  if (app?.includes('virtual:canvai-manifests')) return true
  if (app?.includes('CanvaiShell')) return true
  if (viteConfig?.includes('canvai/vite-plugin')) return true

  return false
}

export function migrate(fileContents) {
  const result = {}

  // Migrate App.tsx
  let app = fileContents['src/App.tsx']
  if (app) {
    // Replace CanvaiShell with BryllenShell
    app = app.replace(/CanvaiShell/g, 'BryllenShell')
    // Replace canvai/runtime with bryllen/runtime
    app = app.replace(/canvai\/runtime/g, 'bryllen/runtime')
    // Replace virtual:canvai-manifests with virtual:bryllen-manifests
    app = app.replace(/virtual:canvai-manifests/g, 'virtual:bryllen-manifests')
    result['src/App.tsx'] = app
  }

  // Migrate vite.config.ts
  let viteConfig = fileContents['vite.config.ts']
  if (viteConfig) {
    viteConfig = viteConfig.replace(/canvai\/vite-plugin/g, 'bryllen/vite-plugin')
    result['vite.config.ts'] = viteConfig
  }

  return result
}
