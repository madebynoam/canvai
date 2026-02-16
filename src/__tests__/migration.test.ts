import { describe, it, expect } from 'vitest'
import { migrations } from '../cli/migrations/index.js'
import { compareSemver } from '../cli/migrate.js'
import { appTsx } from '../cli/templates.js'

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

// Old App.tsx template that used flat pages (pre-0.0.16)
const oldPagesAppTsx = `import { useState } from 'react'
import { Canvas, Frame, useFrames, layoutFrames, TopBar, IterationSidebar, AnnotationOverlay } from 'canvai/runtime'
import { manifests } from 'virtual:canvai-manifests'
import type { ProjectManifest } from 'canvai/runtime'

function App() {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0)
  const [activePageIndex, setActivePageIndex] = useState(0)
  const [mode] = useState<'manual' | 'watch'>('manual')
  const [pendingCount, setPendingCount] = useState(0)

  const activeProject: ProjectManifest | undefined = manifests[activeProjectIndex]
  const activePage = activeProject?.pages[activePageIndex]
  const layoutedFrames = activePage ? layoutFrames(activePage) : []

  const { frames, updateFrame, handleResize } = useFrames(layoutedFrames, activePage?.grid)

  return (
    <div id="canvai-root" style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopBar
        projects={manifests}
        activeProjectIndex={activeProjectIndex}
        onSelectProject={(i) => {
          setActiveProjectIndex(i)
          setActivePageIndex(0)
        }}
        iterationCount={activeProject?.pages.length ?? 0}
        pendingCount={pendingCount}
        mode={mode}
      />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <IterationSidebar
          iterations={activeProject?.pages ?? []}
          activeIndex={activePageIndex}
          onSelect={setActivePageIndex}
        />

        <div style={{ flex: 1 }}>
          <Canvas>
            {frames.map(frame => (
              <Frame
                key={frame.id}
                id={frame.id}
                title={frame.title}
                x={frame.x}
                y={frame.y}
                width={frame.width}
                height={frame.height}
                onMove={(id, newX, newY) => updateFrame(id, { x: newX, y: newY })}
                onResize={handleResize}
              >
                <frame.component {...(frame.props ?? {})} />
              </Frame>
            ))}
          </Canvas>
        </div>
      </div>

      {import.meta.env.DEV && <AnnotationOverlay endpoint="http://localhost:4748" frames={frames} annotateMode={mode} onPendingChange={setPendingCount} />}
    </div>
  )
}

export default App
`

// Old manifest format (pre-0.0.16) — flat pages at top level
const oldManifest = `import { MyComponent } from './MyComponent'
import type { ProjectManifest } from 'canvai/runtime'

const manifest: ProjectManifest = {
  project: 'my-project',
  pages: [
    {
      name: 'V1 — Initial',
      grid: { columns: 3, columnWidth: 300, rowHeight: 160, gap: 40 },
      frames: [
        { id: 'comp-short-default', title: 'Comp / Short / Default', component: MyComponent, props: { text: 'Click' } },
        { id: 'comp-short-hover', title: 'Comp / Short / Hover', component: MyComponent, props: { text: 'Click', state: 'hover' } },
      ],
    },
  ],
}

export default manifest
`

describe('migration 0.0.16', () => {
  const migration = migrations.find(m => m.version === '0.0.16')!

  it('exists in the registry', () => {
    expect(migration).toBeDefined()
    expect(migration.version).toBe('0.0.16')
  })

  // --- App.tsx tests ---

  it('applies to old template with flat pages', () => {
    expect(migration.applies({ 'src/App.tsx': oldPagesAppTsx })).toBe(true)
  })

  it('does not apply to current template', () => {
    const currentApp = `const activePage = activeProject?.iterations?.[activeIterationIndex]?.pages[activePageIndex]`
    expect(migration.applies({ 'src/App.tsx': currentApp })).toBe(false)
  })

  it('does not apply when file is missing', () => {
    expect(migration.applies({})).toBe(false)
  })

  it('adds activeIterationIndex state', () => {
    const result = migration.migrate({ 'src/App.tsx': oldPagesAppTsx })
    expect(result['src/App.tsx']).toContain('activeIterationIndex')
    expect(result['src/App.tsx']).toContain('setActiveIterationIndex')
  })

  it('replaces .pages[activePageIndex] with .iterations?.[activeIterationIndex]?.pages[activePageIndex]', () => {
    const result = migration.migrate({ 'src/App.tsx': oldPagesAppTsx })
    expect(result['src/App.tsx']).toContain('iterations?.[activeIterationIndex]?.pages[activePageIndex]')
    expect(result['src/App.tsx']).not.toMatch(/activeProject\?\.pages\[activePageIndex\]/)
  })

  it('replaces .pages.length with .iterations?.length', () => {
    const result = migration.migrate({ 'src/App.tsx': oldPagesAppTsx })
    expect(result['src/App.tsx']).toContain('.iterations?.length')
    expect(result['src/App.tsx']).not.toContain('.pages.length')
  })

  it('updates IterationSidebar props', () => {
    const result = migration.migrate({ 'src/App.tsx': oldPagesAppTsx })
    expect(result['src/App.tsx']).toContain('activeIterationIndex={activeIterationIndex}')
    expect(result['src/App.tsx']).toContain('activePageIndex={activePageIndex}')
    expect(result['src/App.tsx']).not.toContain('activeIndex={activePageIndex}')
  })

  it('resets both indices on project switch', () => {
    const result = migration.migrate({ 'src/App.tsx': oldPagesAppTsx })
    expect(result['src/App.tsx']).toContain('setActiveIterationIndex(0)')
  })

  it('is idempotent — running twice produces the same result', () => {
    const first = migration.migrate({ 'src/App.tsx': oldPagesAppTsx })
    const second = migration.migrate({ 'src/App.tsx': first['src/App.tsx'] })
    expect(second['src/App.tsx']).toBe(first['src/App.tsx'])
  })

  // --- Half-migrated App.tsx (unsafe optional chaining from old migration) ---

  it('applies to half-migrated App.tsx with unsafe optional chaining', () => {
    const halfMigrated = `const activePage = activeProject?.iterations[activeIterationIndex]?.pages[activePageIndex]`
    expect(migration.applies({ 'src/App.tsx': halfMigrated })).toBe(true)
  })

  it('fixes unsafe ?.iterations[ to ?.iterations?.[', () => {
    const halfMigrated = `const activePage = activeProject?.iterations[activeIterationIndex]?.pages[activePageIndex]
        iterationCount={activeProject?.iterations.length ?? 0}`
    const result = migration.migrate({ 'src/App.tsx': halfMigrated })
    expect(result['src/App.tsx']).toContain('?.iterations?.[activeIterationIndex]')
    expect(result['src/App.tsx']).toContain('?.iterations?.length')
    expect(result['src/App.tsx']).not.toContain('?.iterations[')
    expect(result['src/App.tsx']).not.toContain('?.iterations.length')
  })

  // --- Manifest tests ---

  it('applies when manifest has old pages format', () => {
    expect(migration.applies({
      'src/App.tsx': appTsx, // already migrated
      'src/projects/foo/manifest.ts': oldManifest,
    })).toBe(true)
  })

  it('does not apply when manifest already has iterations', () => {
    const newManifest = oldManifest.replace('pages:', 'iterations:')
    expect(migration.applies({
      'src/App.tsx': appTsx,
      'src/projects/foo/manifest.ts': newManifest,
    })).toBe(false)
  })

  it('wraps manifest pages in iterations', () => {
    const result = migration.migrate({
      'src/App.tsx': appTsx,
      'src/projects/foo/manifest.ts': oldManifest,
    })
    const migrated = result['src/projects/foo/manifest.ts']
    expect(migrated).toContain('iterations:')
    expect(migrated).toContain("name: 'V1'")
    expect(migrated).toContain('pages:')
    // Should still have the frames inside
    expect(migrated).toContain('comp-short-default')
    expect(migrated).toContain('comp-short-hover')
  })

  it('manifest migration is idempotent', () => {
    const first = migration.migrate({
      'src/App.tsx': appTsx,
      'src/projects/foo/manifest.ts': oldManifest,
    })
    const second = migration.migrate({
      'src/App.tsx': appTsx,
      'src/projects/foo/manifest.ts': first['src/projects/foo/manifest.ts'],
    })
    expect(second['src/projects/foo/manifest.ts']).toBe(first['src/projects/foo/manifest.ts'])
  })
})

// --- Integration test: migrated files work together ---

describe('migration 0.0.16 integration', () => {
  const migration = migrations.find(m => m.version === '0.0.16')!

  it('migrated App.tsx accesses iterations, migrated manifest provides iterations', () => {
    const result = migration.migrate({
      'src/App.tsx': oldPagesAppTsx,
      'src/projects/foo/manifest.ts': oldManifest,
    })

    const migratedApp = result['src/App.tsx']
    const migratedManifest = result['src/projects/foo/manifest.ts']

    // App.tsx expects .iterations — manifest must provide it
    expect(migratedApp).toContain('.iterations?.')
    expect(migratedManifest).toContain('iterations:')

    // App.tsx expects .iterations[i].pages — manifest must have pages inside iterations
    expect(migratedApp).toContain('.pages[activePageIndex]')
    expect(migratedManifest).toContain('pages:')
    // pages must be INSIDE iterations, not at top level
    const iterationsIdx = migratedManifest.indexOf('iterations:')
    const pagesIdx = migratedManifest.indexOf('pages:', iterationsIdx)
    expect(pagesIdx).toBeGreaterThan(iterationsIdx)
  })

  it('current template and current manifest format are compatible', () => {
    // The template uses .iterations?.[i]?.pages[j]
    // Manifests should have iterations: [{ pages: [...] }]
    expect(appTsx).toContain('iterations?.[activeIterationIndex]')
    expect(appTsx).toContain('.pages[activePageIndex]')
    // TopBar receives iterations array directly
    expect(appTsx).toContain('iterations={activeProject?.iterations')
  })
})

// --- Recovery scenario: the exact bug consumers hit ---

describe('migration 0.0.16 recovery', () => {
  const migration = migrations.find(m => m.version === '0.0.16')!

  // Simulates what happened: old migration ran on App.tsx (unsafe chaining),
  // manifest was never touched, marker was bumped to 0.0.16
  const halfMigratedApp = `import { useState } from 'react'
import { Canvas, Frame, useFrames, layoutFrames, TopBar, IterationSidebar, AnnotationOverlay } from 'canvai/runtime'
import { manifests } from 'virtual:canvai-manifests'
import type { ProjectManifest } from 'canvai/runtime'

function App() {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0)
  const [activeIterationIndex, setActiveIterationIndex] = useState(0)
  const [activePageIndex, setActivePageIndex] = useState(0)

  const activeProject: ProjectManifest | undefined = manifests[activeProjectIndex]
  const activePage = activeProject?.iterations[activeIterationIndex]?.pages[activePageIndex]

  return (
    <div>
      <TopBar iterationCount={activeProject?.iterations.length ?? 0} />
      <IterationSidebar
        iterations={activeProject?.iterations ?? []}
        activeIterationIndex={activeIterationIndex}
        activePageIndex={activePageIndex}
        onSelect={(iterIdx, pageIdx) => {
          setActiveIterationIndex(iterIdx)
          setActivePageIndex(pageIdx)
        }}
      />
    </div>
  )
}

export default App
`

  it('applies to half-migrated state (marker at 0.0.16 but files broken)', () => {
    // This is the exact scenario: App.tsx was half-migrated, manifest untouched
    expect(migration.applies({
      'src/App.tsx': halfMigratedApp,
      'src/projects/foo/manifest.ts': oldManifest,
    })).toBe(true)
  })

  it('fixes both App.tsx chaining AND manifest in one pass', () => {
    const result = migration.migrate({
      'src/App.tsx': halfMigratedApp,
      'src/projects/foo/manifest.ts': oldManifest,
    })

    // App.tsx should have safe chaining
    expect(result['src/App.tsx']).toContain('?.iterations?.[')
    expect(result['src/App.tsx']).toContain('?.iterations?.length')
    expect(result['src/App.tsx']).not.toContain('?.iterations[')
    expect(result['src/App.tsx']).not.toContain('?.iterations.length')

    // Manifest should be wrapped in iterations
    expect(result['src/projects/foo/manifest.ts']).toContain('iterations:')
  })

  it('applies returns false after recovery (verified clean)', () => {
    const result = migration.migrate({
      'src/App.tsx': halfMigratedApp,
      'src/projects/foo/manifest.ts': oldManifest,
    })

    expect(migration.applies({
      'src/App.tsx': result['src/App.tsx'],
      'src/projects/foo/manifest.ts': result['src/projects/foo/manifest.ts'],
    })).toBe(false)
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
