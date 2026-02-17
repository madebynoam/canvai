/**
 * Migration 0.0.21: Add TokenSwatch documentation to CLAUDE.md
 *
 * Adds the TokenSwatch + ColorPicker runtime feature docs so
 * the agent knows to use TokenSwatch on Tokens pages.
 */

export const version = '0.0.21'

export const description = 'Add TokenSwatch documentation to CLAUDE.md'

export const files = ['CLAUDE.md']

export function applies(fileContents) {
  const claude = fileContents['CLAUDE.md']
  if (!claude) return false
  // Needs migration if it has the mandatory pages section but no TokenSwatch
  if (claude.includes('Mandatory pages') && !claude.includes('TokenSwatch')) return true
  return false
}

export function migrate(fileContents) {
  const result = {}
  let claude = fileContents['CLAUDE.md']
  if (!claude) return result

  // 1. Update the Tokens bullet to mention TokenSwatch
  claude = claude.replace(
    /- \*\*Tokens\*\* — renders color swatches,/,
    '- **Tokens** — renders color swatches (using `TokenSwatch` from `canvai/runtime`),'
  )

  // 2. Insert Token swatches section before "## Interactive navigation"
  const tokenSwatchSection = `\n## Token swatches (runtime)

Canvai provides \`TokenSwatch\` and \`ColorPicker\` from \`canvai/runtime\` for the Tokens page. The designer clicks a swatch to open an OKLCH color picker, sees a live preview across the canvas, and posts an annotation to change the token value.

\`\`\`tsx
import { TokenSwatch } from 'canvai/runtime'

<TokenSwatch
  color="var(--chrome)"
  label="chrome"
  sublabel="oklch(0.952 0.003 80)"
  oklch={{ l: 0.952, c: 0.003, h: 80 }}
  tokenPath="--chrome"
  frameId="v1-tok-colors"
/>
\`\`\`

Props:
- \`color\` — CSS color string for display
- \`label\` — Token name shown next to the swatch
- \`sublabel\` — Optional secondary text (e.g. the OKLCH value)
- \`oklch\` — If provided, swatch is clickable and opens the color picker (\`{ l, c, h }\`)
- \`tokenPath\` — CSS custom property name for the annotation (e.g. \`"--chrome"\`)
- \`frameId\` — Frame ID from the manifest, used in the annotation payload

When the designer clicks Apply, \`TokenSwatch\` posts an annotation. The agent updates \`tokens.css\`. Use \`TokenSwatch\` for every color token on the Tokens page.

`

  const insertBefore = claude.indexOf('## Interactive navigation')
  if (insertBefore !== -1) {
    claude = claude.slice(0, insertBefore) + tokenSwatchSection + claude.slice(insertBefore)
  } else {
    // Fallback: insert before "## Before any edit"
    const altInsert = claude.indexOf('## Before any edit')
    if (altInsert !== -1) {
      claude = claude.slice(0, altInsert) + tokenSwatchSection + claude.slice(altInsert)
    }
  }

  result['CLAUDE.md'] = claude
  return result
}
