/**
 * Migration 0.0.22: Add standard frame widths to CLAUDE.md
 *
 * Adds the Desktop/Tablet/Mobile frame width table so
 * the agent uses correct widths for responsive designs.
 */

export const version = '0.0.22'

export const description = 'Add standard frame widths to CLAUDE.md'

export const files = ['CLAUDE.md']

export function applies(fileContents) {
  const claude = fileContents['CLAUDE.md']
  if (!claude) return false
  // Needs migration if it has hard constraints but no frame widths section
  if (claude.includes('Hard constraints') && !claude.includes('Standard frame widths')) return true
  return false
}

export function migrate(fileContents) {
  const result = {}
  let claude = fileContents['CLAUDE.md']
  if (!claude) return result

  const section = `\n## Standard frame widths

| Breakpoint | Width |
|---|---|
| Desktop | \`1440\` |
| Tablet | \`768\` |
| Mobile | \`390\` |

Set per-frame \`width\` in the manifest or \`grid.columnWidth\` on the page. Components pages typically use smaller widths (320–640).

`

  // Insert before "## Interactive navigation"
  const insertBefore = claude.indexOf('## Interactive navigation')
  if (insertBefore !== -1) {
    claude = claude.slice(0, insertBefore) + section + claude.slice(insertBefore)
  } else {
    // Fallback: insert before "## Before any edit"
    const altInsert = claude.indexOf('## Before any edit')
    if (altInsert !== -1) {
      claude = claude.slice(0, altInsert) + section + claude.slice(altInsert)
    }
  }

  result['CLAUDE.md'] = claude
  return result
}
