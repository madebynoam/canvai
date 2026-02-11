import { describe, it, expect } from 'vitest'
import { migrations } from '../cli/migrations/index.js'
import { compareSemver } from '../cli/migrate.js'

// Old App.tsx template that used PageTabs + ProjectSidebar (pre-0.0.10)
const oldAppTsx = `import { useState } from 'react'
import { Canvas, Frame, useFrames, layoutFrames, PageTabs, ProjectSidebar, AnnotationOverlay } from 'canvai/runtime'
import { manifests } from 'virtual:canvai-manifests'
import type { ProjectManifest } from 'canvai/runtime'

function App() {
  const activeProject: ProjectManifest | undefined = manifests[0]
  return (
    <div>
      <PageTabs />
      <ProjectSidebar />
      <Canvas>{/* ... */}</Canvas>
    </div>
  )
}

export default App
`

describe('migration 0.0.10', () => {
  const migration = migrations.find(m => m.version === '0.0.10')!

  it('exists in the registry', () => {
    expect(migration).toBeDefined()
    expect(migration.version).toBe('0.0.10')
  })

  it('applies to old template with PageTabs', () => {
    expect(migration.applies({ 'src/App.tsx': oldAppTsx })).toBe(true)
  })

  it('does not apply to current template', () => {
    // Current template has TopBar/IterationSidebar — migration should not apply
    const currentApp = `import { TopBar, IterationSidebar } from 'canvai/runtime'`
    expect(migration.applies({ 'src/App.tsx': currentApp })).toBe(false)
  })

  it('does not apply when file is missing', () => {
    expect(migration.applies({})).toBe(false)
  })

  it('replaces PageTabs with TopBar', () => {
    const result = migration.migrate({ 'src/App.tsx': oldAppTsx })
    expect(result['src/App.tsx']).toContain('TopBar')
    expect(result['src/App.tsx']).not.toContain('PageTabs')
  })

  it('replaces ProjectSidebar with IterationSidebar', () => {
    const result = migration.migrate({ 'src/App.tsx': oldAppTsx })
    expect(result['src/App.tsx']).toContain('IterationSidebar')
    expect(result['src/App.tsx']).not.toContain('ProjectSidebar')
  })

  it('is idempotent — running twice produces the same result', () => {
    const first = migration.migrate({ 'src/App.tsx': oldAppTsx })
    const second = migration.migrate({ 'src/App.tsx': first['src/App.tsx'] })
    // Second run should not apply (no PageTabs/ProjectSidebar left)
    expect(migration.applies({ 'src/App.tsx': first['src/App.tsx'] })).toBe(false)
    // But if we force-run it, output should be identical
    expect(second['src/App.tsx']).toBe(first['src/App.tsx'])
  })
})

describe('migration registry', () => {
  it('is sorted by version ascending', () => {
    for (let i = 1; i < migrations.length; i++) {
      expect(
        compareSemver(migrations[i - 1].version, migrations[i].version),
        `${migrations[i - 1].version} should come before ${migrations[i].version}`,
      ).toBe(-1)
    }
  })

  it('every migration has required exports', () => {
    for (const m of migrations) {
      expect(m.version).toMatch(/^\d+\.\d+\.\d+$/)
      expect(typeof m.description).toBe('string')
      expect(Array.isArray(m.files)).toBe(true)
      expect(typeof m.applies).toBe('function')
      expect(typeof m.migrate).toBe('function')
    }
  })
})

describe('compareSemver', () => {
  it('handles equal versions', () => {
    expect(compareSemver('0.0.10', '0.0.10')).toBe(0)
  })

  it('handles less-than', () => {
    expect(compareSemver('0.0.9', '0.0.10')).toBe(-1)
    expect(compareSemver('0.0.1', '0.1.0')).toBe(-1)
  })

  it('handles greater-than', () => {
    expect(compareSemver('0.0.10', '0.0.9')).toBe(1)
    expect(compareSemver('1.0.0', '0.9.9')).toBe(1)
  })
})
