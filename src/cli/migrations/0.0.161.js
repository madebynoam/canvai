/**
 * Migration 0.0.161: (no-op, superseded by runtime fix)
 *
 * Originally removed overflow:hidden from index.css, but that broke
 * the canvas viewport. The fix is now in the runtime PreviewMode.
 */

export const version = '0.0.161'

export const description = 'No-op (preview scroll fixed in runtime)'

export const files = ['src/index.css']

export function applies() {
  return false
}

export function migrate(fileContents) {
  return {}
}
