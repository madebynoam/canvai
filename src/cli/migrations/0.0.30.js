/**
 * Migration 0.0.30: Tighten page hierarchy rule in CLAUDE.md
 *
 * Adds the explicit "one function per page file" constraint to close the
 * loophole where agents define inline sub-components (named functions) in
 * page files instead of extracting them to components/. The old rule said
 * "Never inline styled HTML" — agents worked around it by defining named
 * functions. The new rule explicitly prohibits any function in a page file
 * other than the single exported page component.
 */

export const version = '0.0.30'

export const description = 'Tighten page hierarchy rule — one function per page file'

export const files = ['CLAUDE.md']

export function applies(fileContents) {
  const claude = fileContents['CLAUDE.md']
  if (!claude) return false
  // Needs migration if it has the hierarchy section but not the one-function rule
  if (claude.includes('Component hierarchy') && !claude.includes('exactly one function')) return true
  return false
}

export function migrate(fileContents) {
  const result = {}
  let claude = fileContents['CLAUDE.md']
  if (!claude) return result

  // 1. Insert the one-function rule after the hierarchy code block
  const hierarchyBlock = '```\n\n## Hard constraints'
  const oneFunction = `\`\`\`

**A page file defines exactly one function: the exported page component.** Nothing else. No local sub-components, no local helper components, no inline section functions. If you need \`TierLockedGate\`, \`DashboardSection\`, \`GroupContact\` — they are components. Create them in \`components/\`, export from \`components/index.ts\`, import in the page. A page that defines more than one function is wrong.

## Hard constraints`

  claude = claude.replace(hierarchyBlock, oneFunction)

  // 2. Replace the old pages constraint line with the two new ones
  claude = claude.replace(
    /- \*\*Pages import only from `\.\.\/components\/`\.\*\* Never inline styled HTML in pages\./,
    `- **Pages define exactly one exported function.** Any named function returning JSX belongs in \`components/\`, not in the page file. This is not optional — a 1,000-line page file is a bug.\n- **Pages import only from \`../components/\`.** No inline styled HTML, no local sub-components.`,
  )

  if (claude !== fileContents['CLAUDE.md']) {
    result['CLAUDE.md'] = claude
  }

  return result
}
