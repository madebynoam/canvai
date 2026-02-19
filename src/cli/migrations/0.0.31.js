/**
 * Migration 0.0.31: Update design directions to "one page, one wall" layout
 *
 * Changes the directions section in CLAUDE.md from "separate pages per direction"
 * to the new "All Directions" single-page layout with DirectionLabel + N state
 * frames per row. Everything visible at a glance — like pinning printouts on a
 * studio wall.
 */

export const version = '0.0.31'

export const description = 'Update design directions to one-page wall layout with DirectionLabel'

export const files = ['CLAUDE.md']

export function applies(fileContents) {
  const claude = fileContents['CLAUDE.md']
  if (!claude) return false
  // Old pattern uses "as separate pages" — new pattern doesn't
  return claude.includes('as separate pages')
}

export function migrate(fileContents) {
  const claude = fileContents['CLAUDE.md']
  if (!claude) return {}

  // Replace the entire Design directions section up to the next ## heading
  const old = /## Design directions \(proliferate first\)\n[\s\S]*?(?=\n## (?:Component hierarchy|Hard constraints))/

  const replacement = `## Design directions (proliferate first)

When a designer first describes a component or feature, do NOT generate one design and ask for feedback. Generate **multiple distinct design directions** — different visual bets, not just different states of the same idea. Three directions minimum.

The designer is not a spec-writer. They are a reactor and curator. Your job is to give them things to react to.

### Layout: one page, one wall

All directions live on a **single manifest page** called "All Directions". Use a \`DirectionLabel\` component as the first frame in each row. The grid uses N+1 columns (1 label + N state/variation frames per direction):

\`\`\`ts
{
  name: 'All Directions',
  grid: { columns: 6, columnWidth: 960, rowHeight: 800, gap: 40 },
  frames: [
    // Row 1: Direction A
    { id: 'label-a', title: 'Direction A', component: DirectionLabel, props: { letter: 'A', title: 'Minimal', description: '...' } },
    { id: 'dir-a-default', title: 'Dir A / Default', component: DirA, props: { state: 'default' } },
    { id: 'dir-a-hover', title: 'Dir A / Hover', component: DirA, props: { state: 'hover' } },
    // Row 2: Direction B
    { id: 'label-b', title: 'Direction B', component: DirectionLabel, props: { letter: 'B', title: 'Structured', description: '...' } },
    // ... B frames
  ],
}
\`\`\`

Create \`DirectionLabel\` in \`components/\` — it follows the same token rules as any component. Each direction should make a genuinely different design bet. Let the designer react — "I like A's density with C's color" — then converge.

Once a direction is chosen, generate all meaningful **variations and states** as frames within that direction.
`

  const updated = claude.replace(old, replacement)
  if (updated === claude) return {}
  return { 'CLAUDE.md': updated }
}
