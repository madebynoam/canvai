/**
 * Migration 0.0.26: Remove frameId prop from TokenSwatch
 *
 * TokenSwatch now derives its frameId from the DOM via
 * closest('[data-frame-id]'). The frameId prop and the
 * FRAME_ID constants in token pages are no longer needed.
 *
 * This migration:
 * 1. Strips `frameId={FRAME_ID}` and `frameId="..."` from TokenSwatch usages
 * 2. Removes `const FRAME_ID = '...'` declarations
 * 3. Updates CLAUDE.md to remove frameId from TokenSwatch docs
 */

export const version = '0.0.26'

export const description = 'Remove frameId prop from TokenSwatch (now derived from DOM)'

export const files = ['CLAUDE.md']

// Token pages are auto-discovered by the migration runner

export function applies(fileContents) {
  // Check token pages for frameId usage
  for (const [path, content] of Object.entries(fileContents)) {
    if (path.includes('/pages/tokens.tsx') && content.includes('frameId')) return true
  }

  // Check CLAUDE.md for frameId in TokenSwatch docs
  const claude = fileContents['CLAUDE.md']
  if (claude && claude.includes('TokenSwatch') && claude.includes('frameId')) return true

  return false
}

export function migrate(fileContents) {
  const result = {}

  // 1. Clean up token pages
  for (const [path, content] of Object.entries(fileContents)) {
    if (!path.includes('/pages/tokens.tsx')) continue
    if (!content.includes('frameId')) continue

    let updated = content
    // Remove frameId={FRAME_ID} prop (with optional leading space)
    updated = updated.replace(/ frameId=\{FRAME_ID\}/g, '')
    // Remove frameId="..." string literal prop
    updated = updated.replace(/ frameId="[^"]*"/g, '')
    // Remove const FRAME_ID = '...' line (and any blank line after)
    updated = updated.replace(/const FRAME_ID = ['"][^'"]*['"]\n\n?/g, '')

    if (updated !== content) {
      result[path] = updated
    }
  }

  // 2. Update CLAUDE.md — remove frameId from TokenSwatch docs
  const claude = fileContents['CLAUDE.md']
  if (claude && claude.includes('frameId')) {
    let updated = claude
    // Remove the frameId line from the example code block
    updated = updated.replace(/\n\s*frameId="[^"]*"\n/g, '\n')
    // Remove the frameId prop description line
    updated = updated.replace(/\n- `frameId` — Frame ID from the manifest, used in the annotation payload\n/g, '\n')

    if (updated !== claude) {
      result['CLAUDE.md'] = updated
    }
  }

  return result
}
