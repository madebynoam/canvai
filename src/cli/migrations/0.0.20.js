/**
 * Migration 0.0.20: Iteration CSS class scoping
 *
 * Adds iterClass derivation and className={iterClass} to the canvas
 * wrapper div so iteration-scoped tokens (.iter-v1, .iter-v2) apply.
 * Without this, all iterations fall back to :root tokens.
 */

export const version = '0.0.20'

export const description = 'Add iterClass for iteration-scoped CSS tokens'

export const files = ['src/App.tsx']

export function applies(fileContents) {
  const app = fileContents['src/App.tsx']
  if (!app) return false

  // Needs migration if it has activeIteration but no iterClass
  if (app.includes('activeIteration') && !app.includes('iterClass')) return true

  return false
}

export function migrate(fileContents) {
  const result = {}
  let app = fileContents['src/App.tsx']
  if (!app) return result

  // 1. Add iterClass derivation after activeIteration
  if (!app.includes('iterClass')) {
    app = app.replace(
      /(const activeIteration = [^\n]+\n)/,
      `$1  const iterClass = activeIteration ? \`iter-\${activeIteration.name.toLowerCase()}\` : ''\n`
    )
  }

  // 2. Add className={iterClass} to the canvas wrapper div
  if (app.includes('iterClass') && !app.includes('className={iterClass}')) {
    app = app.replace(
      /<div style=\{\{ flex: 1, backgroundColor: N\.chrome/,
      '<div className={iterClass} style={{ flex: 1, backgroundColor: N.chrome'
    )
  }

  result['src/App.tsx'] = app
  return result
}
