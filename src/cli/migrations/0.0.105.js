/**
 * Migration 0.0.105: Flatten Project → Iteration → Page hierarchy
 *
 * The manifest structure has been simplified:
 * Before: Project → Iteration → Page (with component refs)
 * After:  Project → components map (DB-driven frames)
 *
 * This migration:
 * - Extracts component imports and references from iterations/pages
 * - Builds a flat components: {} map
 * - Removes iterations and pages structure
 */

export const version = '0.0.105'

export const description = 'Flatten iterations/pages to components registry'

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

/** Convert PascalCase to kebab-case: DirA → dir-a, TokensPage → tokens-page */
function toKebab(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase()
}

/**
 * Flatten iterations/pages to components registry
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

    // Collect component imports (from ./v*, ./pages/, ./components/)
    const componentImports = []
    const importRegex = /^import\s+.*$/gm
    let importMatch
    while ((importMatch = importRegex.exec(content)) !== null) {
      const line = importMatch[0]
      if (line.includes('./v') || line.includes('./pages/') || line.includes('./components/')) {
        componentImports.push(line)
      }
    }

    // Extract component variable names from `component: VarName` in pages
    const componentRefs = []
    const componentRefRegex = /component:\s*([A-Z]\w+)/g
    let refMatch
    while ((refMatch = componentRefRegex.exec(content)) !== null) {
      componentRefs.push(refMatch[1])
    }

    // Build the new manifest
    let newManifest = `import type { ProjectManifest } from 'bryllen/runtime'\n`

    // Preserve component imports
    for (const imp of componentImports) {
      newManifest += `${imp}\n`
    }

    newManifest += `\n`
    newManifest += `const manifest: ProjectManifest = {\n`

    if (projectId) {
      newManifest += `  id: '${projectId}',\n`
    }

    newManifest += `  project: '${projectName}',\n`

    // Build components map from extracted component references
    newManifest += `  components: {\n`
    for (const name of componentRefs) {
      newManifest += `    '${toKebab(name)}': ${name},\n`
    }
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
