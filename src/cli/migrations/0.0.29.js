/**
 * Migration 0.0.29: Upgrade unfrozen Tokens pages to use TokenSwatch
 *
 * Replaces custom <Swatch> with <TokenSwatch> from canvai/runtime,
 * adding `oklch` and `tokenPath` props so the color picker works.
 * Only transforms unfrozen iterations (frozen iterations are skipped).
 *
 * Requires tokens.css in the same iteration to derive OKLCH values.
 * Swatches whose labels don't map to a CSS custom property are left as-is.
 */

export const version = '0.0.29'

export const description = 'Upgrade unfrozen Tokens pages to use TokenSwatch (enables color picker)'

export const files = [] // tokens.tsx and tokens.css are auto-discovered by migrate.js

function camelToKebab(str) {
  return str.replace(/([A-Z])/g, m => `-${m.toLowerCase()}`)
}

function parseTokensCss(css) {
  const map = {}
  const re = /--([a-z][a-z0-9-]*):\s*oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/g
  let m
  while ((m = re.exec(css)) !== null) {
    map[`--${m[1]}`] = { l: parseFloat(m[2]), c: parseFloat(m[3]), h: parseFloat(m[4]) }
  }
  return map
}

function isIterFrozen(manifestContent, verDir) {
  // verDir is 'v7', manifest has: name: 'V7', frozen: true/false
  const verName = verDir.replace('v', 'V')
  const re = new RegExp(`name:\\s*['"]${verName}['"][^{}]*?frozen:\\s*(true|false)`, 's')
  const match = manifestContent.match(re)
  if (!match) return false // no frozen field = not frozen
  return match[1] === 'true'
}

function transformTokensPage(content, tokenMap) {
  if (!content.includes('<Swatch') || content.includes('<TokenSwatch')) return content

  let result = content
  let transformed = false

  // [^>]* intentionally matches newlines — handles both single-line and multi-line Swatch tags
  result = result.replace(/<Swatch\s+([^>]*)\/>/g, (match, propsStr) => {
    const labelMatch = propsStr.match(/label="([^"]+)"/)
    if (!labelMatch) return match

    const label = labelMatch[1]

    // Derive tokenPath: prefer color="var(--xxx)", fall back to camelCase label
    let tokenPath
    const colorVarMatch = propsStr.match(/color="var\((--[^)]+)\)"/)
    if (colorVarMatch) {
      tokenPath = colorVarMatch[1]
    } else {
      tokenPath = '--' + camelToKebab(label)
    }

    const oklch = tokenMap[tokenPath]
    if (!oklch) return match // no OKLCH for this token, leave as-is

    const sublabelMatch = propsStr.match(/sublabel="([^"]+)"/)
    const sublabel = sublabelMatch ? ` sublabel="${sublabelMatch[1]}"` : ''

    transformed = true
    return `<TokenSwatch color="var(${tokenPath})" label="${label}"${sublabel} oklch={{ l: ${oklch.l}, c: ${oklch.c}, h: ${oklch.h} }} tokenPath="${tokenPath}" />`
  })

  if (!transformed) return content

  // Remove Swatch from any local (non-canvai) import
  result = result.replace(
    /import\s*\{([^}]*)\}\s*from\s*(['"])(?!canvai)[^'"]+\2/g,
    (match, imports, quote) => {
      if (!imports.includes('Swatch')) return match
      const parts = imports.split(',').map(s => s.trim()).filter(s => s && s !== 'Swatch')
      if (parts.length === 0) return '' // remove entire import line
      return match.replace(`{${imports}}`, `{ ${parts.join(', ')} }`)
    },
  )
  // Clean up blank lines left by a removed import
  result = result.replace(/^\n+/, '').replace(/\n{3,}/g, '\n\n')

  // Add TokenSwatch to existing canvai/runtime import, or create one
  if (result.includes("from 'canvai/runtime'")) {
    result = result.replace(
      /import\s*\{([^}]+)\}\s*from\s*'canvai\/runtime'/,
      (match, imports) => {
        if (imports.includes('TokenSwatch')) return match
        return `import { ${imports.trim()}, TokenSwatch } from 'canvai/runtime'`
      },
    )
  } else {
    result = `import { TokenSwatch } from 'canvai/runtime'\n` + result
  }

  return result
}

export function applies(fileContents) {
  for (const [path, content] of Object.entries(fileContents)) {
    const m = path.match(/^src\/projects\/(.+)\/(v\d+)\/pages\/tokens\.tsx$/)
    if (!m) continue
    if (!content.includes('<Swatch') || content.includes('<TokenSwatch')) continue

    const [, project, ver] = m
    const manifestPath = `src/projects/${project}/manifest.ts`
    const manifest = fileContents[manifestPath]
    if (!manifest || isIterFrozen(manifest, ver)) continue

    const cssPath = `src/projects/${project}/${ver}/tokens.css`
    const css = fileContents[cssPath]
    if (!css) continue

    // Only applies if at least one Swatch label maps to a token in tokens.css
    const tokenMap = parseTokensCss(css)
    const swatchLabels = [...content.matchAll(/label="([^"]+)"/g)].map(lm => lm[1])
    const hasConvertible = swatchLabels.some(label => {
      const colorVarMatch = content.match(new RegExp(`<Swatch[^>]*color="var\\((--[^)]+)\\)"[^>]*label="${label}"`))
      const tokenPath = colorVarMatch ? colorVarMatch[1] : '--' + camelToKebab(label)
      return !!tokenMap[tokenPath]
    })
    if (!hasConvertible) continue

    return true
  }
  return false
}

export function migrate(fileContents) {
  const result = {}

  for (const [path, content] of Object.entries(fileContents)) {
    const m = path.match(/^src\/projects\/(.+)\/(v\d+)\/pages\/tokens\.tsx$/)
    if (!m) continue
    if (!content.includes('<Swatch') || content.includes('<TokenSwatch')) continue

    const [, project, ver] = m
    const manifestPath = `src/projects/${project}/manifest.ts`
    const manifest = fileContents[manifestPath]
    if (!manifest || isIterFrozen(manifest, ver)) continue

    const cssPath = `src/projects/${project}/${ver}/tokens.css`
    const css = fileContents[cssPath]
    if (!css) continue

    const tokenMap = parseTokensCss(css)
    const transformed = transformTokensPage(content, tokenMap)
    if (transformed !== content) {
      result[path] = transformed
    }
  }

  return result
}
