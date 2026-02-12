/**
 * Migration 0.0.16: Flat pages → grouped iterations
 *
 * In v0.0.16, ProjectManifest.pages was replaced with
 * ProjectManifest.iterations (IterationManifest[]).
 * App.tsx needs dual-index state (activeIterationIndex + activePageIndex)
 * and the IterationSidebar props changed accordingly.
 */

export const version = '0.0.16'

export const description =
  'Migrate App.tsx from flat pages to grouped iterations with dual-index state'

export const files = ['src/App.tsx']

export function applies(fileContents) {
  const app = fileContents['src/App.tsx']
  if (!app) return false
  // Already migrated — has dual-index state
  if (app.includes('activeIterationIndex')) return false
  // Detect old pattern: accessing .pages directly on the project
  return (
    app.includes('.pages[activePageIndex]') ||
    app.includes('.pages.length') ||
    app.includes('activeIndex={activePageIndex}')
  )
}

export function migrate(fileContents) {
  let app = fileContents['src/App.tsx']
  if (!app) return {}

  // Already migrated — idempotent
  if (app.includes('activeIterationIndex')) return { 'src/App.tsx': app }

  // Add activeIterationIndex state after activeProjectIndex
  app = app.replace(
    /const \[activePageIndex, setActivePageIndex\] = useState\(0\)/,
    'const [activeIterationIndex, setActiveIterationIndex] = useState(0)\n  const [activePageIndex, setActivePageIndex] = useState(0)'
  )

  // Update activePage derivation
  app = app.replace(
    /activeProject\?\.pages\[activePageIndex\]/g,
    'activeProject?.iterations[activeIterationIndex]?.pages[activePageIndex]'
  )

  // Update iterationCount
  app = app.replace(
    /activeProject\?\.pages\.length/g,
    'activeProject?.iterations.length'
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

  return { 'src/App.tsx': app }
}
