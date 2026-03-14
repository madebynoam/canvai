/**
 * Migration 0.0.156: Repair broken manifest from 0.0.105 migration
 *
 * The original 0.0.105 migration dropped component imports and produced
 * an empty frames/components manifest even though page files existed.
 * This repair migration auto-discovers page files and rebuilds the
 * components map.
 *
 * Detects: manifest with empty `components: {}` or empty `frames: []`
 * (with TODO comments) AND page files exist in v*\/pages\/.
 */

export const version = '0.0.156'

export const description = 'Repair manifest emptied by 0.0.105 migration'

export const files = [] // Manifests + pages are auto-discovered

/** Convert PascalCase to kebab-case: DirA → dir-a, TokensPage → tokens-page */
function toKebab(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase()
}

/**
 * Detect broken manifests: has ProjectManifest but empty components/frames
 * AND page files with exported components exist nearby.
 */
export function applies(fileContents) {
  for (const [filepath, content] of Object.entries(fileContents)) {
    if (!filepath.endsWith('/manifest.ts')) continue
    if (!content || !content.includes('ProjectManifest')) continue

    // Check for empty components: {} or TODO comments from broken 0.0.105
    const hasEmptyComponents = /components:\s*\{\s*\}/.test(content)
    const hasTodoComments = content.includes('// TODO: Update component imports after migration')
    const hasEmptyFrames = /frames:\s*\[\s*(?:\/\/[^\n]*\s*)*\]/.test(content)

    if (!hasEmptyComponents && !hasTodoComments && !hasEmptyFrames) continue

    // Check if page files exist for this project
    const projectDir = filepath.replace(/\/manifest\.ts$/, '')
    for (const [pagePath] of Object.entries(fileContents)) {
      if (pagePath.startsWith(projectDir + '/') && /\/v\d+\/pages\/\w+\.tsx$/.test(pagePath)) {
        return true
      }
    }
  }
  return false
}

/**
 * Rebuild manifest components map from discovered page files.
 */
export function migrate(fileContents) {
  const result = {}

  for (const [filepath, content] of Object.entries(fileContents)) {
    if (!filepath.endsWith('/manifest.ts')) continue
    if (!content || !content.includes('ProjectManifest')) continue

    const hasEmptyComponents = /components:\s*\{\s*\}/.test(content)
    const hasTodoComments = content.includes('// TODO: Update component imports after migration')
    const hasEmptyFrames = /frames:\s*\[\s*(?:\/\/[^\n]*\s*)*\]/.test(content)

    if (!hasEmptyComponents && !hasTodoComments && !hasEmptyFrames) continue

    const projectDir = filepath.replace(/\/manifest\.ts$/, '')

    // Discover page files and their exported component names
    const discoveries = [] // { importPath, exportName }
    for (const [pagePath, pageContent] of Object.entries(fileContents)) {
      if (!pagePath.startsWith(projectDir + '/')) continue
      if (!/\/v\d+\/pages\/\w+\.tsx$/.test(pagePath)) continue
      if (!pageContent) continue

      // Find the exported function name
      const exportMatch = pageContent.match(/export\s+(?:default\s+)?function\s+(\w+)/)
      if (!exportMatch) continue

      const exportName = exportMatch[1]
      // Build relative import path from manifest location
      const relPath = './' + pagePath.replace(projectDir + '/', '').replace(/\.tsx$/, '')

      discoveries.push({ importPath: relPath, exportName })
    }

    if (discoveries.length === 0) continue

    // Extract project metadata from existing manifest
    const projectMatch = content.match(/project:\s*['"]([^'"]+)['"]/)
    const projectName = projectMatch ? projectMatch[1] : 'project'
    const idMatch = content.match(/id:\s*['"]([^'"]+)['"]/)
    const projectId = idMatch ? idMatch[1] : null
    const shareUrlMatch = content.match(/shareUrl:\s*['"]([^'"]+)['"]/)
    const shareUrl = shareUrlMatch ? shareUrlMatch[1] : null

    // Build new manifest
    let newManifest = `import type { ProjectManifest } from 'bryllen/runtime'\n`

    for (const { importPath, exportName } of discoveries) {
      newManifest += `import { ${exportName} } from '${importPath}'\n`
    }

    newManifest += `\n`
    newManifest += `const manifest: ProjectManifest = {\n`

    if (projectId) {
      newManifest += `  id: '${projectId}',\n`
    }

    newManifest += `  project: '${projectName}',\n`
    newManifest += `  components: {\n`

    for (const { exportName } of discoveries) {
      newManifest += `    '${toKebab(exportName)}': ${exportName},\n`
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
