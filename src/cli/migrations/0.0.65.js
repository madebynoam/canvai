/**
 * Migration 0.0.65: Rename canvai → bryllen
 *
 * Catches consumers who had the intermediate CanvaiShell pattern
 * that wasn't detected by migration 0.0.25.
 */

export const version = '0.0.65'

export const description = 'Rename canvai imports to bryllen (CanvaiShell → BryllenShell)'

export const files = ['src/App.tsx', 'vite.config.ts', 'index.html']

export function applies(fileContents) {
  // Check ALL files for any canvai references (including auto-discovered manifests/tokens)
  for (const content of Object.values(fileContents)) {
    if (content?.includes('canvai/runtime')) return true
    if (content?.includes('virtual:canvai-manifests')) return true
    if (content?.includes('CanvaiShell')) return true
    if (content?.includes('canvai/vite-plugin')) return true
    if (content?.includes('<title>Canvai</title>')) return true
  }
  return false
}

export function migrate(fileContents) {
  const result = {}

  // Process ALL files (including auto-discovered manifests and tokens)
  for (const [filepath, content] of Object.entries(fileContents)) {
    if (!content) continue

    let updated = content
    // Replace all canvai references
    updated = updated.replace(/CanvaiShell/g, 'BryllenShell')
    updated = updated.replace(/canvai\/runtime/g, 'bryllen/runtime')
    updated = updated.replace(/virtual:canvai-manifests/g, 'virtual:bryllen-manifests')
    updated = updated.replace(/canvai\/vite-plugin/g, 'bryllen/vite-plugin')
    updated = updated.replace(/<title>Canvai<\/title>/g, '<title>Bryllen</title>')

    // Only include if changed
    if (updated !== content) {
      result[filepath] = updated
    }
  }

  return result
}
