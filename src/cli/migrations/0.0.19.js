/**
 * Migration 0.0.19: Navigation memory
 *
 * Replaces manual iteration/page useState with useNavMemory hook.
 * Remembers iteration + page per project across sessions.
 * Defaults to latest iteration, first content page on fresh load.
 */

export const version = '0.0.19'

export const description = 'Add useNavMemory for iteration/page persistence'

export const files = ['src/App.tsx']

export function applies(fileContents) {
  const app = fileContents['src/App.tsx']
  if (!app) return false

  // Needs migration if it has manual iteration/page state without useNavMemory
  if (!app.includes('useNavMemory') && app.includes('activeIterationIndex')) return true

  return false
}

export function migrate(fileContents) {
  const result = {}
  let app = fileContents['src/App.tsx']
  if (!app) return result

  // 1. Add useNavMemory to import
  if (!app.includes('useNavMemory')) {
    app = app.replace(
      /import \{([^}]*)\} from 'canvai\/runtime'/,
      (match, imports) => {
        const importList = imports.split(',').map(s => s.trim()).filter(Boolean)
        if (!importList.includes('useNavMemory')) {
          const idx = importList.indexOf('useFrames')
          if (idx >= 0) {
            importList.splice(idx + 1, 0, 'useNavMemory')
          } else {
            importList.push('useNavMemory')
          }
        }
        return `import { ${importList.join(', ')} } from 'canvai/runtime'`
      }
    )
  }

  // 2. Remove old useState for iteration and page
  app = app.replace(/\s*const \[activeIterationIndex, setActiveIterationIndex\] = useState\(0\)\n?/, '\n')
  app = app.replace(/\s*const \[activePageIndex, setActivePageIndex\] = useState\(0\)\n?/, '\n')

  // 3. Add useNavMemory after activeProject derivation
  if (!app.includes('useNavMemory(')) {
    app = app.replace(
      /(const activeProject[^\n]+\n)/,
      `$1  const { iterationIndex: activeIterationIndex, pageIndex: activePageIndex, setIteration: setActiveIterationIndex, setPage: setActivePageIndex } = useNavMemory(\n    activeProject?.project ?? '',\n    activeProject?.iterations ?? [],\n  )\n\n`
    )
  }

  // 4. Simplify onSelectProject — useNavMemory handles defaults on project change
  app = app.replace(
    /onSelectProject=\{\(i\) => \{\s*setActiveProjectIndex\(i\)\s*setActiveIterationIndex\(0\)\s*setActivePageIndex\(0\)\s*\}\}/,
    'onSelectProject={setActiveProjectIndex}'
  )

  // 5. Simplify onSelectIteration — useNavMemory resets page on iteration change
  app = app.replace(
    /onSelectIteration=\{\(i\) => \{\s*setActiveIterationIndex\(i\)\s*setActivePageIndex\(0\)\s*\}\}/,
    'onSelectIteration={setActiveIterationIndex}'
  )

  result['src/App.tsx'] = app
  return result
}
