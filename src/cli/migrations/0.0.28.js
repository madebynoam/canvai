/**
 * Migration 0.0.28: Add design directions section to CLAUDE.md
 *
 * Consumers who ran `canvai init` before 0.0.28 don't have the
 * "proliferate before converging" guidance in their project CLAUDE.md.
 * Without it, the agent generates a single design when invoked via chat
 * (not via a skill), missing the multi-direction workflow.
 */

export const version = '0.0.28'

export const description = 'Add design directions (proliferate first) section to CLAUDE.md'

export const files = ['CLAUDE.md']

const SECTION = `## Design directions (proliferate first)

When a designer first describes a component or feature, do NOT generate one design and ask for feedback. Generate **multiple distinct design directions** as separate pages — different visual bets, not just different states of the same idea:

- **Direction A** — e.g. minimal / type-driven / restrained
- **Direction B** — e.g. structured / geometric / grid-anchored
- **Direction C** — e.g. expressive / token-forward / higher contrast

Each direction should make a genuinely different design bet. Show all of them on the canvas simultaneously. Let the designer react — "I like A's density with C's color" — then converge. Three directions minimum. The designer is a reactor and curator, not a spec-writer.

Once a direction is chosen, generate all meaningful **variations and states** as frames within that direction.

`

const ANCHOR = '## Component hierarchy'

export function applies(fileContents) {
  const claude = fileContents['CLAUDE.md']
  if (!claude) return false
  return claude.includes(ANCHOR) && !claude.includes('## Design directions')
}

export function migrate(fileContents) {
  const claude = fileContents['CLAUDE.md']
  if (!claude) return {}
  return { 'CLAUDE.md': claude.replace(ANCHOR, SECTION + ANCHOR) }
}
