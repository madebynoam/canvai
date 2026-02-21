/**
 * Migration 0.0.32: Add iteration description guidance to consumer CLAUDE.md
 *
 * The iteration picker is now a breadcrumb dropdown that shows an optional
 * `description` blurb per iteration. This migration updates the consumer's
 * CLAUDE.md to instruct the agent to write a description when creating
 * iterations.
 */

export const version = '0.0.32'

export const description = 'Add iteration description field guidance to CLAUDE.md'

export const files = ['CLAUDE.md']

export function applies(fileContents) {
  const claude = fileContents['CLAUDE.md']
  if (!claude) return false
  // Already has the description guidance
  if (claude.includes('include a `description`')) return false
  // Must have the iterations naming constraint to patch
  return claude.includes('Iterations named V1, V2, V3')
}

export function migrate(fileContents) {
  const claude = fileContents['CLAUDE.md']
  if (!claude) return {}

  const updated = claude.replace(
    '- **Iterations named V1, V2, V3.** Sequential, never descriptive.',
    '- **Iterations named V1, V2, V3.** Sequential, never descriptive. Each iteration should include a `description` — a one-line blurb shown in the iteration picker dropdown (e.g. `description: \'Revised spacing and color\'`).',
  )

  if (updated === claude) return {}
  return { 'CLAUDE.md': updated }
}
