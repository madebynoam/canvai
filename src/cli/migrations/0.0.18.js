/**
 * Migration 0.0.18: Canvas inset padding
 *
 * Changes canvas padding from `E.inset` (uniform 12px) to
 * `${E.insetTop}px ${E.inset}px ${E.inset}px` (6px top, 12px sides/bottom).
 */

export const version = '0.0.18'

export const description = 'Update canvas padding to use insetTop token'

export const files = ['src/App.tsx']

export function applies(fileContents) {
  const app = fileContents['src/App.tsx']
  if (!app) return false

  // Detect old uniform padding: `padding: E.inset` without insetTop
  if (app.includes('padding: E.inset') && !app.includes('E.insetTop')) return true

  return false
}

export function migrate(fileContents) {
  const result = {}
  let app = fileContents['src/App.tsx']
  if (!app) return result

  // Replace uniform padding with top/sides/bottom
  app = app.replace(
    /padding: E\.inset([^T])/,
    'padding: `${E.insetTop}px ${E.inset}px ${E.inset}px`$1'
  )

  result['src/App.tsx'] = app
  return result
}
