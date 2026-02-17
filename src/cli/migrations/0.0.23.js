/**
 * Migration 0.0.23: Add ZoomControl + CanvasColorPicker to App.tsx
 *
 * Patches existing consumer App.tsx to include:
 * - ZoomControl (bottom-center of canvas)
 * - CanvasColorPicker (top-right of canvas)
 * - Canvas background color state with localStorage persistence
 */

export const version = '0.0.23'

export const description = 'Add ZoomControl + CanvasColorPicker to canvas'

export const files = ['src/App.tsx']

export function applies(fileContents) {
  const app = fileContents['src/App.tsx']
  if (!app) return false
  // Needs migration if it has Canvas but no ZoomControl
  if (app.includes('Canvas') && !app.includes('ZoomControl')) return true
  // Needs migration if ZoomControl exists but not via hud prop (broken placement)
  if (app.includes('ZoomControl') && !app.includes('hud=')) return true
  return false
}

export function migrate(fileContents) {
  const result = {}
  let app = fileContents['src/App.tsx']
  if (!app) return result

  // Already has ZoomControl via hud prop — fully migrated
  if (app.includes('ZoomControl') && app.includes('hud=')) {
    result['src/App.tsx'] = app
    return result
  }

  // 1. Add ZoomControl, CanvasColorPicker, loadCanvasBg, saveCanvasBg to the canvai/runtime import
  app = app.replace(
    /from 'canvai\/runtime'/,
    (match) => {
      // Find the import statement that contains this
      const importStart = app.lastIndexOf('import', app.indexOf(match))
      const importEnd = app.indexOf(match) + match.length
      const importLine = app.slice(importStart, importEnd)

      // Check what's missing
      const additions = []
      if (!importLine.includes('ZoomControl')) additions.push('ZoomControl')
      if (!importLine.includes('CanvasColorPicker')) additions.push('CanvasColorPicker')
      if (!importLine.includes('loadCanvasBg')) additions.push('loadCanvasBg')
      if (!importLine.includes('saveCanvasBg')) additions.push('saveCanvasBg')

      if (additions.length === 0) return match

      // Insert before the closing } of the import
      return match // We'll do this differently
    }
  )

  // More reliable approach: patch the import line directly
  // Find the main canvai/runtime import
  const importMatch = app.match(/import\s*\{([^}]+)\}\s*from\s*'canvai\/runtime'/)
  if (importMatch) {
    const existingImports = importMatch[1]
    const additions = []
    if (!existingImports.includes('ZoomControl')) additions.push('ZoomControl')
    if (!existingImports.includes('CanvasColorPicker')) additions.push('CanvasColorPicker')
    if (!existingImports.includes('loadCanvasBg')) additions.push('loadCanvasBg')
    if (!existingImports.includes('saveCanvasBg')) additions.push('saveCanvasBg')

    if (additions.length > 0) {
      const newImports = existingImports.trimEnd() + ', ' + additions.join(', ')
      app = app.replace(importMatch[0], `import {${newImports}} from 'canvai/runtime'`)
    }
  }

  // 2. Add useEffect to react import if missing
  if (!app.includes('useEffect')) {
    app = app.replace(
      /import\s*\{([^}]*)\}\s*from\s*'react'/,
      (match, imports) => `import {${imports}, useEffect} from 'react'`
    )
  }

  // 3. Add canvasBg state + persistence after the useFrames line
  if (!app.includes('canvasBg')) {
    const canvasBgBlock = `
  const projectKey = activeProject?.project ?? ''
  const [canvasBg, setCanvasBg] = useState(() => loadCanvasBg(projectKey) ?? N.canvas)
  useEffect(() => { setCanvasBg(loadCanvasBg(projectKey) ?? N.canvas) }, [projectKey])
  useEffect(() => { saveCanvasBg(projectKey, canvasBg) }, [projectKey, canvasBg])
`

    // Insert after useFrames
    const useFramesIdx = app.indexOf('useFrames(')
    if (useFramesIdx !== -1) {
      const lineEnd = app.indexOf('\n', useFramesIdx)
      if (lineEnd !== -1) {
        app = app.slice(0, lineEnd + 1) + canvasBgBlock + app.slice(lineEnd + 1)
      }
    }
  }

  // 4. Replace backgroundColor: N.canvas with backgroundColor: canvasBg on the canvas card wrapper
  // The card wrapper is the div with borderRadius: E.radius and backgroundColor: N.canvas
  app = app.replace(
    /backgroundColor:\s*N\.canvas,\s*\n(\s*)boxShadow:\s*E\.shadow,/,
    `backgroundColor: canvasBg,\n$1boxShadow: E.shadow,`
  )

  // 5. Add position: 'relative' to the card wrapper if missing
  // The card wrapper has borderRadius: E.radius
  if (!app.match(/borderRadius:\s*E\.radius[\s\S]*?position:\s*'relative'/)) {
    app = app.replace(
      /(borderRadius:\s*E\.radius,\s*\n\s*backgroundColor:\s*canvasBg,\s*\n\s*boxShadow:\s*E\.shadow,\s*\n\s*overflow:\s*'hidden',)/,
      `$1\n            position: 'relative',`
    )
  }

  // 6. Add ZoomControl and CanvasColorPicker via Canvas hud prop
  // Controls must be INSIDE Canvas (not siblings) so useCanvas() has access to the zoom context
  if (!app.includes('hud=')) {
    // Remove controls placed as siblings after </Canvas> (from broken 0.0.23 migration)
    app = app.replace(
      /(<\/Canvas>)\s*<div[^>]*>\s*<CanvasColorPicker[^/]*\/>\s*<\/div>\s*<div[^>]*>\s*<ZoomControl\s*\/>\s*<\/div>/,
      '$1'
    )

    // Add hud prop to <Canvas opening tag (insert before closing >)
    // Handles both single-line (<Canvas pageKey={`...`}>) and multi-line formats
    app = app.replace(
      /(pageKey=\{`[^`]*`\})(\s*)(>)/,
      function(match, prop, ws, bracket, offset) {
        // Detect <Canvas indentation for proper formatting
        const canvasIdx = app.lastIndexOf('<Canvas', offset)
        const lineStart = app.lastIndexOf('\n', canvasIdx) + 1
        const base = ' '.repeat(canvasIdx - lineStart)
        const pi = base + '  '

        return prop + '\n' +
          pi + 'hud={<>\n' +
          pi + '  <div style={{ position: \'absolute\', top: 12, right: 12, zIndex: 5 }}>\n' +
          pi + '    <CanvasColorPicker activeColor={canvasBg} onSelect={setCanvasBg} />\n' +
          pi + '  </div>\n' +
          pi + '  <div style={{ position: \'absolute\', bottom: 12, left: \'50%\', transform: \'translateX(-50%)\', zIndex: 5 }}>\n' +
          pi + '    <ZoomControl />\n' +
          pi + '  </div>\n' +
          pi + '</>}\n' +
          base + bracket
      }
    )
  }

  result['src/App.tsx'] = app
  return result
}
