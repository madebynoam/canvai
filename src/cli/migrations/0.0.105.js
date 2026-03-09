/**
 * Migration 0.0.105: Flatten Project → Iteration → Page hierarchy
 *
 * The manifest structure has been simplified from 4 levels to 2 levels:
 * Before: Project → Iteration → Page → Frame
 * After:  Project → Frame (flat canvas)
 *
 * This migration:
 * - Flattens all frames from all iterations/pages into a single frames array
 * - Removes iterations and pages structure
 * - Adds grid config for layout
 */

export const version = '0.0.105'

export const description = 'Flatten iterations/pages to single frames array'

export const files = [] // Manifests are auto-discovered

/**
 * Check if manifest has the old iterations structure
 */
export function applies(fileContents) {
  for (const [filepath, content] of Object.entries(fileContents)) {
    if (!filepath.endsWith('/manifest.ts')) continue
    if (!content) continue

    // Check if manifest has iterations: [ pattern (old structure)
    if (content.includes('iterations:') && content.includes('ProjectManifest')) {
      return true
    }
  }
  return false
}

/**
 * Flatten iterations/pages to single frames array
 */
export function migrate(fileContents) {
  const result = {}

  for (const [filepath, content] of Object.entries(fileContents)) {
    if (!filepath.endsWith('/manifest.ts')) continue
    if (!content) continue

    // Skip if doesn't have iterations (already flat or not a manifest)
    if (!content.includes('iterations:') || !content.includes('ProjectManifest')) {
      continue
    }

    // Extract project name
    const projectMatch = content.match(/project:\s*['"]([^'"]+)['"]/)
    const projectName = projectMatch ? projectMatch[1] : 'project'

    // Extract id if present
    const idMatch = content.match(/id:\s*['"]([^'"]+)['"]/)
    const projectId = idMatch ? idMatch[1] : null

    // Extract shareUrl if present
    const shareUrlMatch = content.match(/shareUrl:\s*['"]([^'"]+)['"]/)
    const shareUrl = shareUrlMatch ? shareUrlMatch[1] : null

    // Collect all imports from the file
    const importLines = []
    const importRegex = /^import\s+.*$/gm
    let importMatch
    while ((importMatch = importRegex.exec(content)) !== null) {
      const line = importMatch[0]
      // Keep type imports and runtime imports
      if (line.includes('bryllen/runtime') || line.includes('type {')) {
        importLines.push(line)
      } else if (line.includes('./v') || line.includes('./pages/') || line.includes('./components/')) {
        // Keep component imports but we'll need to update paths
        importLines.push(line)
      }
    }

    // Extract all frame definitions from the content
    // Look for frames: [ ... ] patterns within pages
    const frameDefinitions = []
    const frameBlockRegex = /frames:\s*\[([\s\S]*?)\]/g
    let frameBlockMatch
    while ((frameBlockMatch = frameBlockRegex.exec(content)) !== null) {
      const block = frameBlockMatch[1]
      // Extract individual frame objects
      const frameObjRegex = /\{\s*(?:type:\s*['"]?\w+['"]?,?\s*)?id:\s*['"]([^'"]+)['"][^}]*\}/g
      let frameObj
      while ((frameObj = frameObjRegex.exec(block)) !== null) {
        frameDefinitions.push(frameObj[0])
      }
    }

    // Build the new manifest structure
    let newManifest = `import type { ProjectManifest } from 'bryllen/runtime'\n\n`

    // Note: Component imports will need to be handled manually since
    // the old structure had imports scattered across iteration folders
    newManifest += `// TODO: Update component imports after migration\n`
    newManifest += `// Old structure had components in v1/, v2/, etc. folders\n\n`

    newManifest += `const manifest: ProjectManifest = {\n`

    if (projectId) {
      newManifest += `  id: '${projectId}',\n`
    }

    newManifest += `  project: '${projectName}',\n`

    // Add frames array (will be empty if extraction didn't work)
    // The migration adds a comment to help users rebuild their frames
    newManifest += `  frames: [\n`
    newManifest += `    // Migration flattened all iterations/pages here\n`
    newManifest += `    // Review and rebuild frame definitions as needed\n`

    // Try to preserve some frame structure hints
    if (frameDefinitions.length > 0) {
      for (const frame of frameDefinitions) {
        newManifest += `    ${frame},\n`
      }
    }

    newManifest += `  ],\n`

    // Add default grid config
    newManifest += `  grid: {\n`
    newManifest += `    columns: 4,\n`
    newManifest += `    columnWidth: 320,\n`
    newManifest += `    rowHeight: 200,\n`
    newManifest += `    gap: 40,\n`
    newManifest += `  },\n`

    if (shareUrl) {
      newManifest += `  shareUrl: '${shareUrl}',\n`
    }

    newManifest += `}\n\n`
    newManifest += `export default manifest\n`

    result[filepath] = newManifest
  }

  return result
}
