/**
 * Migration 0.0.103: Add UUID to project manifests
 *
 * Projects now have unique IDs for per-project annotation storage.
 * This migration adds an `id` field to existing manifests.
 */

export const version = '0.0.103'

export const description = 'Add unique ID to project manifests for per-project annotation storage'

export const files = [] // Manifests are auto-discovered

/**
 * Generate a UUID v4.
 */
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
}

export function applies(fileContents) {
  // Check all manifest files for missing id field
  for (const [filepath, content] of Object.entries(fileContents)) {
    if (!filepath.endsWith('/manifest.ts')) continue
    if (!content) continue

    // Check if manifest has ProjectManifest type and is missing id field
    // Look for the manifest object definition pattern
    const hasManifestDef = content.includes('ProjectManifest') &&
      (content.includes('const manifest:') || content.includes('const manifest ='))

    if (hasManifestDef) {
      // Check if id field is already present
      // Look for id: 'uuid' pattern after the opening brace
      const manifestMatch = content.match(/const\s+manifest[^=]*=\s*\{([^}]*project:\s*['"][^'"]+['"])/s)
      if (manifestMatch) {
        const beforeProject = manifestMatch[1]
        // If there's no id: field before the project: field, migration applies
        if (!beforeProject.includes('id:')) {
          return true
        }
      }
    }
  }
  return false
}

export function migrate(fileContents) {
  const result = {}

  for (const [filepath, content] of Object.entries(fileContents)) {
    if (!filepath.endsWith('/manifest.ts')) continue
    if (!content) continue

    // Check if this manifest needs an id field
    const hasManifestDef = content.includes('ProjectManifest') &&
      (content.includes('const manifest:') || content.includes('const manifest ='))

    if (!hasManifestDef) continue

    // Check if id field is already present
    const manifestMatch = content.match(/const\s+manifest[^=]*=\s*\{([^}]*project:\s*['"][^'"]+['"])/s)
    if (!manifestMatch) continue

    const beforeProject = manifestMatch[1]
    if (beforeProject.includes('id:')) continue

    // Add id field before project field
    const uuid = generateUUID()
    let updated = content

    // Pattern: { project: 'name' or { \n  project: 'name'
    // Insert id: 'uuid', \n before project:
    updated = updated.replace(
      /(\{\s*)(project:\s*['"])/,
      `$1id: '${uuid}',\n  $2`
    )

    if (updated !== content) {
      result[filepath] = updated
    }
  }

  return result
}
