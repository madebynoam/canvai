import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { appTsx, viteEnvDts } from '../cli/templates.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** Extract named imports from `import { X, Y } from '<module>'` and `import type { X } from '<module>'` */
function extractImports(source: string, module: string): string[] {
  const escaped = module.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(
    `import\\s+(?:type\\s+)?\\{([^}]+)\\}\\s+from\\s+['"]${escaped}['"]`,
    'g',
  )
  const symbols: string[] = []
  let match
  while ((match = regex.exec(source)) !== null) {
    symbols.push(...match[1].split(',').map(s => s.trim()).filter(Boolean))
  }
  return symbols
}

/** Extract all exported symbols from runtime/index.ts */
function extractExports(source: string): string[] {
  const regex = /export\s+(?:type\s+)?\{([^}]+)\}/g
  const symbols: string[] = []
  let match
  while ((match = regex.exec(source)) !== null) {
    symbols.push(...match[1].split(',').map(s => s.trim()).filter(Boolean))
  }
  return symbols
}

describe('export contract', () => {
  const runtimePath = join(__dirname, '..', 'runtime', 'index.ts')
  const runtimeSource = readFileSync(runtimePath, 'utf-8')
  const runtimeExports = extractExports(runtimeSource)

  it('appTsx template only imports symbols that runtime/index.ts exports', () => {
    const imports = extractImports(appTsx, 'canvai/runtime')
    expect(imports.length).toBeGreaterThan(0)

    for (const symbol of imports) {
      expect(
        runtimeExports,
        `appTsx imports "${symbol}" but runtime/index.ts does not export it`,
      ).toContain(symbol)
    }
  })

  it('viteEnvDts template only imports symbols that runtime/index.ts exports', () => {
    const imports = extractImports(viteEnvDts, 'canvai/runtime')
    expect(imports.length).toBeGreaterThan(0)

    for (const symbol of imports) {
      expect(
        runtimeExports,
        `viteEnvDts imports "${symbol}" but runtime/index.ts does not export it`,
      ).toContain(symbol)
    }
  })

  it('runtime/index.ts exports at least one value and one type', () => {
    const valueExports = runtimeSource
      .split('\n')
      .filter(line => line.startsWith('export {'))
    const typeExports = runtimeSource
      .split('\n')
      .filter(line => line.startsWith('export type {'))

    expect(valueExports.length).toBeGreaterThan(0)
    expect(typeExports.length).toBeGreaterThan(0)
  })
})
