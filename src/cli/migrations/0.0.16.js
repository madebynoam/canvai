/**
 * Migration 0.0.16: Flat pages → grouped iterations
 *
 * In v0.0.16, ProjectManifest.pages was replaced with
 * ProjectManifest.iterations (IterationManifest[]).
 *
 * Two things need migrating:
 * 1. App.tsx — dual-index state (activeIterationIndex + activePageIndex)
 * 2. Manifest files — wrap top-level `pages: [...]` in `iterations: [{ name: 'V1', pages: [...] }]`
 */

export const version = '0.0.16'

export const description =
  'Migrate App.tsx and manifests from flat pages to grouped iterations'

export const files = ['src/App.tsx']

export function applies(fileContents) {
  // Check App.tsx for old pattern
  const app = fileContents['src/App.tsx']
  if (app && !app.includes('activeIterationIndex') && (
    app.includes('.pages[activePageIndex]') ||
    app.includes('.pages.length') ||
    app.includes('activeIndex={activePageIndex}')
  )) return true

  // Check any manifest for old format (has `pages:` at top level, no `iterations:`)
  for (const [filepath, content] of Object.entries(fileContents)) {
    if (filepath.includes('manifest.ts') && filepath !== 'src/App.tsx') {
      if (content.includes('pages:') && !content.includes('iterations:')) {
        return true
      }
    }
  }

  return false
}

/**
 * Wrap top-level `pages: [...]` in a manifest with `iterations: [{ name: 'V1', pages: [...] }]`.
 * Uses bracket counting to find the matching `]` for the pages array.
 */
function wrapPagesInIterations(content) {
  if (content.includes('iterations:')) return content

  const pagesMatch = content.match(/(\s*)pages:\s*\[/)
  if (!pagesMatch) return content

  const indent = pagesMatch[1]
  const startIdx = pagesMatch.index
  const bracketStart = content.indexOf('[', startIdx)

  // Count brackets to find the matching ]
  let depth = 0
  let endIdx = -1
  for (let i = bracketStart; i < content.length; i++) {
    if (content[i] === '[') depth++
    if (content[i] === ']') {
      depth--
      if (depth === 0) {
        endIdx = i
        break
      }
    }
  }

  if (endIdx === -1) return content

  // Extract the pages array content (between [ and ])
  const pagesArrayContent = content.slice(bracketStart + 1, endIdx)

  const before = content.slice(0, startIdx)
  // Skip past the `],` or `]` and any trailing comma/whitespace
  let afterIdx = endIdx + 1
  if (content[afterIdx] === ',') afterIdx++
  const after = content.slice(afterIdx)

  return before +
    `${indent}iterations: [\n` +
    `${indent}  {\n` +
    `${indent}    name: 'V1',\n` +
    `${indent}    pages: [${pagesArrayContent}],\n` +
    `${indent}  },\n` +
    `${indent}],` +
    after
}

export function migrate(fileContents) {
  const result = {}

  // --- Migrate App.tsx ---
  let app = fileContents['src/App.tsx']
  if (app && !app.includes('activeIterationIndex')) {
    // Add activeIterationIndex state after activeProjectIndex
    app = app.replace(
      /const \[activePageIndex, setActivePageIndex\] = useState\(0\)/,
      'const [activeIterationIndex, setActiveIterationIndex] = useState(0)\n  const [activePageIndex, setActivePageIndex] = useState(0)'
    )

    // Update activePage derivation (with safe optional chaining)
    app = app.replace(
      /activeProject\?\.pages\[activePageIndex\]/g,
      'activeProject?.iterations?.[activeIterationIndex]?.pages[activePageIndex]'
    )

    // Update iterationCount
    app = app.replace(
      /activeProject\?\.pages\.length/g,
      'activeProject?.iterations?.length'
    )

    // Update onSelectProject to reset both indices
    app = app.replace(
      /setActiveProjectIndex\(i\)\s*\n\s*setActivePageIndex\(0\)/,
      'setActiveProjectIndex(i)\n          setActiveIterationIndex(0)\n          setActivePageIndex(0)'
    )

    // Update IterationSidebar props — old format
    app = app.replace(
      /iterations=\{activeProject\?\.pages \?\? \[\]\}\s*\n\s*activeIndex=\{activePageIndex\}\s*\n\s*onSelect=\{setActivePageIndex\}/,
      `iterations={activeProject?.iterations ?? []}\n          activeIterationIndex={activeIterationIndex}\n          activePageIndex={activePageIndex}\n          onSelect={(iterIdx, pageIdx) => {\n            setActiveIterationIndex(iterIdx)\n            setActivePageIndex(pageIdx)\n          }}`
    )

    result['src/App.tsx'] = app
  } else if (app) {
    result['src/App.tsx'] = app
  }

  // --- Migrate manifest files ---
  for (const [filepath, content] of Object.entries(fileContents)) {
    if (!filepath.includes('manifest.ts') || filepath === 'src/App.tsx') continue
    result[filepath] = wrapPagesInIterations(content)
  }

  return result
}
