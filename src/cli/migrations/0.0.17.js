/**
 * Migration 0.0.17: IterationPills + new TopBar/IterationSidebar props
 *
 * In v0.0.17, the runtime shell was updated:
 * 1. IterationPills added to TopBar center (new component)
 * 2. TopBar props changed: iterationCount → iterations[], added onSelectIteration
 * 3. IterationSidebar simplified: flat page list instead of expandable tree
 * 4. App.tsx needs sidebarOpen state and new prop wiring
 *
 * This migration updates App.tsx to use the new component APIs.
 */

export const version = '0.0.17'

export const description =
  'Update App.tsx for IterationPills, new TopBar/IterationSidebar props'

export const files = ['src/App.tsx']

export function applies(fileContents) {
  const app = fileContents['src/App.tsx']
  if (!app) return false

  // Detect old TopBar props (iterationCount instead of iterations)
  if (app.includes('iterationCount=')) return true

  // Detect old IterationSidebar props (iterations= with onSelect dual-index)
  if (app.includes('iterations={') && app.includes('onSelect={(iterIdx, pageIdx)')) return true

  // Detect missing IterationPills import
  if (app.includes('canvai/runtime') && !app.includes('IterationPills')) return true

  // Detect missing sidebarOpen state
  if (app.includes('TopBar') && !app.includes('sidebarOpen')) return true

  // Detect missing pageKey on Canvas
  if (app.includes('<Canvas>') && !app.includes('pageKey')) return true

  return false
}

export function migrate(fileContents) {
  const result = {}
  let app = fileContents['src/App.tsx']
  if (!app) return result

  // 1. Add IterationPills to import
  if (!app.includes('IterationPills')) {
    app = app.replace(
      /import \{([^}]*)\} from 'canvai\/runtime'/,
      (match, imports) => {
        const importList = imports.split(',').map(s => s.trim()).filter(Boolean)
        if (!importList.includes('IterationPills')) {
          // Insert after TopBar
          const topBarIdx = importList.indexOf('TopBar')
          if (topBarIdx >= 0) {
            importList.splice(topBarIdx + 1, 0, 'IterationPills')
          } else {
            importList.push('IterationPills')
          }
        }
        return `import { ${importList.join(', ')} } from 'canvai/runtime'`
      }
    )
  }

  // 2. Add sidebarOpen state if missing
  if (!app.includes('sidebarOpen')) {
    app = app.replace(
      /const \[activePageIndex, setActivePageIndex\] = useState\(0\)/,
      'const [activePageIndex, setActivePageIndex] = useState(0)\n  const [sidebarOpen, setSidebarOpen] = useState(true)'
    )
  }

  // 3. Add activeIteration derivation if missing
  if (!app.includes('activeIteration')) {
    app = app.replace(
      /const activePage = /,
      'const activeIteration = activeProject?.iterations?.[activeIterationIndex]\n  const activePage = '
    )
    // Update activePage to use activeIteration
    app = app.replace(
      /activeProject\?\.iterations\?\.\[activeIterationIndex\]\?\.pages\[activePageIndex\]/g,
      'activeIteration?.pages[activePageIndex]'
    )
  }

  // 4. Update TopBar props: iterationCount → iterations + onSelectIteration
  if (app.includes('iterationCount=')) {
    app = app.replace(
      /iterationCount=\{[^}]+\}/,
      `iterations={activeProject?.iterations ?? []}\n        activeIterationIndex={activeIterationIndex}\n        onSelectIteration={(i) => {\n          setActiveIterationIndex(i)\n          setActivePageIndex(0)\n        }}`
    )
  }

  // 5. Add sidebarOpen/onToggleSidebar to TopBar if missing
  if (app.includes('<TopBar') && !app.includes('sidebarOpen')) {
    app = app.replace(
      /mode=\{mode\}\s*\n\s*\/>/,
      `mode={mode}\n        sidebarOpen={sidebarOpen}\n        onToggleSidebar={() => setSidebarOpen(o => !o)}\n      />`
    )
  }

  // 6. Update IterationSidebar to new flat props
  if (app.includes('iterations={') && app.includes('onSelect={(iterIdx, pageIdx)')) {
    // Replace the old IterationSidebar block
    app = app.replace(
      /<IterationSidebar\s*\n\s*iterations=\{[^}]+\}\s*\n\s*activeIterationIndex=\{activeIterationIndex\}\s*\n\s*activePageIndex=\{activePageIndex\}\s*\n\s*onSelect=\{[^}]+\{[^}]*\}[^}]*\}[^/]*/,
      `<IterationSidebar\n          iterationName={activeIteration?.name ?? ''}\n          pages={activeIteration?.pages ?? []}\n          activePageIndex={activePageIndex}\n          onSelectPage={setActivePageIndex}\n          collapsed={!sidebarOpen}\n        `
    )
  }

  // 7. Add pageKey to Canvas for viewport persistence
  if (app.includes('<Canvas>') && !app.includes('pageKey')) {
    app = app.replace(
      '<Canvas>',
      '<Canvas pageKey={`${activeProject?.project ?? \'\'}-${activeIteration?.name ?? \'\'}-${activePage?.name ?? \'\'}`}>'
    )
  }

  result['src/App.tsx'] = app
  return result
}
