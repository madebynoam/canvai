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
    // The template uses useNavMemory for iteration/page state
    expect(appTsx).toContain('useNavMemory')
    expect(appTsx).toContain('iterations?.[activeIterationIndex]')
    expect(appTsx).toContain('.pages?.[activePageIndex]')
    // TopBar receives iterations array directly
    expect(appTsx).toContain('iterations={activeProject?.iterations')
    // Iteration CSS scoping
    expect(appTsx).toContain('iterClass')
    expect(appTsx).toContain('className={iterClass}')
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

// --- Migration 0.0.21: TokenSwatch docs in CLAUDE.md ---

const oldClaudeMd = `# Project Rules

These rules are enforced by the agent. Do not remove this file.

## Component hierarchy

Tokens → Components → Pages

## Mandatory pages

Every project must include:
- **Tokens** — renders color swatches, typography scale, spacing grid from \`tokens.css\`
- **Components** — shows all building blocks individually with variations and states

## Interactive navigation

Handle navigation with React state inside one component.

## Before any edit

1. Read manifest.ts
`

describe('migration 0.0.21', () => {
  const migration = migrations.find(m => m.version === '0.0.21')!

  it('exists in the registry', () => {
    expect(migration).toBeDefined()
    expect(migration.version).toBe('0.0.21')
  })

  it('applies to CLAUDE.md without TokenSwatch', () => {
    expect(migration.applies({ 'CLAUDE.md': oldClaudeMd })).toBe(true)
  })

  it('does not apply when CLAUDE.md already has TokenSwatch', () => {
    const updated = oldClaudeMd + '\nTokenSwatch\n'
    expect(migration.applies({ 'CLAUDE.md': updated })).toBe(false)
  })

  it('does not apply when CLAUDE.md is missing', () => {
    expect(migration.applies({})).toBe(false)
  })

  it('does not apply when CLAUDE.md has no Mandatory pages section', () => {
    expect(migration.applies({ 'CLAUDE.md': '# Custom rules\nNo mandatory pages here.' })).toBe(false)
  })

  it('adds TokenSwatch section to CLAUDE.md', () => {
    const result = migration.migrate({ 'CLAUDE.md': oldClaudeMd })
    expect(result['CLAUDE.md']).toContain('TokenSwatch')
    expect(result['CLAUDE.md']).toContain('ColorPicker')
    expect(result['CLAUDE.md']).toContain('tokenPath')
    expect(result['CLAUDE.md']).toContain('frameId')
  })

  it('updates Tokens bullet to mention TokenSwatch', () => {
    const result = migration.migrate({ 'CLAUDE.md': oldClaudeMd })
    expect(result['CLAUDE.md']).toContain('using `TokenSwatch` from `canvai/runtime`')
  })

  it('inserts section before Interactive navigation', () => {
    const result = migration.migrate({ 'CLAUDE.md': oldClaudeMd })
    const swatchIdx = result['CLAUDE.md'].indexOf('## Token swatches')
    const navIdx = result['CLAUDE.md'].indexOf('## Interactive navigation')
    expect(swatchIdx).toBeGreaterThan(-1)
    expect(navIdx).toBeGreaterThan(swatchIdx)
  })

  it('is idempotent', () => {
    const first = migration.migrate({ 'CLAUDE.md': oldClaudeMd })
    expect(migration.applies({ 'CLAUDE.md': first['CLAUDE.md'] })).toBe(false)
  })
})

// --- Migration 0.0.22: Frame width standards in CLAUDE.md ---

const claudeMdWithTokenSwatch = `# Project Rules

These rules are enforced by the agent. Do not remove this file.

## Hard constraints

- **All colors in OKLCH.** No hex values.
- **All spacing multiples of 4.**
- **Components use only \`var(--token)\`.**

## Mandatory pages

Every project must include:
- **Tokens** — renders color swatches (using \`TokenSwatch\` from \`canvai/runtime\`)
- **Components** — shows all building blocks

## Token swatches (runtime)

TokenSwatch docs here.

## Interactive navigation

Handle navigation with React state inside one component.

## Before any edit

1. Read manifest.ts
`

describe('migration 0.0.22', () => {
  const migration = migrations.find(m => m.version === '0.0.22')!

  it('exists in the registry', () => {
    expect(migration).toBeDefined()
    expect(migration.version).toBe('0.0.22')
  })

  it('applies to CLAUDE.md without frame widths', () => {
    expect(migration.applies({ 'CLAUDE.md': claudeMdWithTokenSwatch })).toBe(true)
  })

  it('does not apply when CLAUDE.md already has Standard frame widths', () => {
    const updated = claudeMdWithTokenSwatch + '\n## Standard frame widths\n'
    expect(migration.applies({ 'CLAUDE.md': updated })).toBe(false)
  })

  it('does not apply when CLAUDE.md is missing', () => {
    expect(migration.applies({})).toBe(false)
  })

  it('does not apply when CLAUDE.md has no Hard constraints', () => {
    expect(migration.applies({ 'CLAUDE.md': '# Custom rules\nNo hard constraints here.' })).toBe(false)
  })

  it('adds frame widths table to CLAUDE.md', () => {
    const result = migration.migrate({ 'CLAUDE.md': claudeMdWithTokenSwatch })
    expect(result['CLAUDE.md']).toContain('Standard frame widths')
    expect(result['CLAUDE.md']).toContain('1440')
    expect(result['CLAUDE.md']).toContain('768')
    expect(result['CLAUDE.md']).toContain('390')
  })

  it('inserts section before Interactive navigation', () => {
    const result = migration.migrate({ 'CLAUDE.md': claudeMdWithTokenSwatch })
    const widthIdx = result['CLAUDE.md'].indexOf('## Standard frame widths')
    const navIdx = result['CLAUDE.md'].indexOf('## Interactive navigation')
    expect(widthIdx).toBeGreaterThan(-1)
    expect(navIdx).toBeGreaterThan(widthIdx)
  })

  it('is idempotent', () => {
    const first = migration.migrate({ 'CLAUDE.md': claudeMdWithTokenSwatch })
    expect(migration.applies({ 'CLAUDE.md': first['CLAUDE.md'] })).toBe(false)
  })
})

// --- Migration 0.0.23: ZoomControl + CanvasColorPicker ---

const pre023AppTsx = `import { useState } from 'react'
import { Canvas, Frame, useFrames, useNavMemory, layoutFrames, TopBar, IterationPills, IterationSidebar, AnnotationOverlay, N, E } from 'canvai/runtime'
import { manifests } from 'virtual:canvai-manifests'
import type { ProjectManifest } from 'canvai/runtime'

function App() {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mode] = useState<'manual' | 'watch'>('manual')
  const [pendingCount, setPendingCount] = useState(0)

  const activeProject: ProjectManifest | undefined = manifests[activeProjectIndex]
  const { iterationIndex: activeIterationIndex, pageIndex: activePageIndex, setIteration: setActiveIterationIndex, setPage: setActivePageIndex } = useNavMemory(
    activeProject?.project ?? '',
    activeProject?.iterations ?? [],
  )

  const activeIteration = activeProject?.iterations?.[activeIterationIndex]
  const iterClass = activeIteration ? \`iter-\${activeIteration.name.toLowerCase()}\` : ''
  const activePage = activeIteration?.pages?.[activePageIndex]
  const layoutedFrames = activePage ? layoutFrames(activePage) : []

  const { frames, updateFrame, handleResize } = useFrames(layoutedFrames, activePage?.grid)

  return (
    <div id="canvai-root" style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopBar
        projects={manifests}
        activeProjectIndex={activeProjectIndex}
        onSelectProject={setActiveProjectIndex}
        iterations={activeProject?.iterations ?? []}
        activeIterationIndex={activeIterationIndex}
        onSelectIteration={setActiveIterationIndex}
        pendingCount={pendingCount}
        mode={mode}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(o => !o)}
      />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <IterationSidebar
          iterationName={activeIteration?.name ?? ''}
          pages={activeIteration?.pages ?? []}
          activePageIndex={activePageIndex}
          onSelectPage={setActivePageIndex}
          collapsed={!sidebarOpen}
        />

        <div className={iterClass} style={{ flex: 1, backgroundColor: N.chrome, padding: \`\${E.insetTop}px \${E.inset}px \${E.inset}px\` }}>
          <div style={{
            width: '100%', height: '100%',
            borderRadius: E.radius,
            backgroundColor: N.canvas,
            boxShadow: E.shadow,
            overflow: 'hidden',
          }}>
            <Canvas pageKey={\`\${activeProject?.project ?? ''}-\${activeIteration?.name ?? ''}-\${activePage?.name ?? ''}\`}>
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
      </div>

      {import.meta.env.DEV && <AnnotationOverlay endpoint="http://localhost:4748" frames={frames} annotateMode={mode} onPendingChange={setPendingCount} />}
    </div>
  )
}

export default App
`

describe('migration 0.0.23', () => {
  const migration = migrations.find(m => m.version === '0.0.23')!

  it('exists in the registry', () => {
    expect(migration).toBeDefined()
    expect(migration.version).toBe('0.0.23')
  })

  it('applies to App.tsx without ZoomControl', () => {
    expect(migration.applies({ 'src/App.tsx': pre023AppTsx })).toBe(true)
  })

  it('does not apply to current template', () => {
    expect(migration.applies({ 'src/App.tsx': appTsx })).toBe(false)
  })

  it('does not apply when file is missing', () => {
    expect(migration.applies({})).toBe(false)
  })

  it('adds ZoomControl to imports', () => {
    const result = migration.migrate({ 'src/App.tsx': pre023AppTsx })
    expect(result['src/App.tsx']).toContain('ZoomControl')
  })

  it('adds CanvasColorPicker to imports', () => {
    const result = migration.migrate({ 'src/App.tsx': pre023AppTsx })
    expect(result['src/App.tsx']).toContain('CanvasColorPicker')
  })

  it('adds loadCanvasBg and saveCanvasBg to imports', () => {
    const result = migration.migrate({ 'src/App.tsx': pre023AppTsx })
    expect(result['src/App.tsx']).toContain('loadCanvasBg')
    expect(result['src/App.tsx']).toContain('saveCanvasBg')
  })

  it('adds useEffect import', () => {
    const result = migration.migrate({ 'src/App.tsx': pre023AppTsx })
    expect(result['src/App.tsx']).toContain('useEffect')
  })

  it('adds canvasBg state', () => {
    const result = migration.migrate({ 'src/App.tsx': pre023AppTsx })
    expect(result['src/App.tsx']).toContain('canvasBg')
    expect(result['src/App.tsx']).toContain('setCanvasBg')
  })

  it('replaces N.canvas with canvasBg in card wrapper', () => {
    const result = migration.migrate({ 'src/App.tsx': pre023AppTsx })
    expect(result['src/App.tsx']).toContain('backgroundColor: canvasBg')
    // N.canvas should still exist in fallback, but not as the card background
    expect(result['src/App.tsx']).not.toMatch(/borderRadius:.*\n.*backgroundColor:\s*N\.canvas/)
  })

  it('adds position relative to card wrapper', () => {
    const result = migration.migrate({ 'src/App.tsx': pre023AppTsx })
    expect(result['src/App.tsx']).toContain("position: 'relative'")
  })

  it('inserts ZoomControl component', () => {
    const result = migration.migrate({ 'src/App.tsx': pre023AppTsx })
    expect(result['src/App.tsx']).toContain('<ZoomControl')
  })

  it('inserts CanvasColorPicker component', () => {
    const result = migration.migrate({ 'src/App.tsx': pre023AppTsx })
    expect(result['src/App.tsx']).toContain('<CanvasColorPicker')
  })

  it('is idempotent', () => {
    const first = migration.migrate({ 'src/App.tsx': pre023AppTsx })
    expect(migration.applies({ 'src/App.tsx': first['src/App.tsx'] })).toBe(false)
    const second = migration.migrate({ 'src/App.tsx': first['src/App.tsx'] })
    expect(second['src/App.tsx']).toBe(first['src/App.tsx'])
  })
})

// --- Migration 0.0.24: Rules-guard hook + commit discipline ---

const settingsWithoutRulesGuard = `{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "node node_modules/canvai/src/cli/hooks/frozen-guard.js"
          }
        ]
      }
    ]
  }
}
`

const claudeMdWithoutCommit = `# Project Rules

These rules are enforced by the agent. Do not remove this file.

## Component hierarchy

\`\`\`
Tokens (v<N>/tokens.css)     → OKLCH custom properties, all visual values
  ↓
Components (v<N>/components/) → use ONLY var(--token), can compose each other
  ↓
Pages (v<N>/pages/)           → import ONLY from ../components/, no raw styled HTML
\`\`\`

## Before any edit

1. Read \`manifest.ts\` — is the iteration frozen? If yes, stop.
2. Check \`components/index.ts\` — does the component exist? If not, create it first.
3. When creating a new component — add to \`index.ts\` AND add a showcase entry to the Components page.
4. Hierarchy check — pages use components, components use tokens.
5. Log to \`CHANGELOG.md\`.
`

describe('migration 0.0.24', () => {
  const migration = migrations.find(m => m.version === '0.0.24')!

  it('exists in the registry', () => {
    expect(migration).toBeDefined()
    expect(migration.version).toBe('0.0.24')
  })

  // --- settings.json tests ---

  it('applies when settings.json has no rules-guard', () => {
    expect(migration.applies({ '.claude/settings.json': settingsWithoutRulesGuard })).toBe(true)
  })

  it('does not apply when settings.json already has rules-guard', () => {
    const updated = settingsWithoutRulesGuard.replace('frozen-guard', 'frozen-guard.js"},{"type":"command","command":"node node_modules/canvai/src/cli/hooks/rules-guard')
    expect(migration.applies({ '.claude/settings.json': updated })).toBe(false)
  })

  it('does not apply when both files are missing', () => {
    expect(migration.applies({})).toBe(false)
  })

  it('adds rules-guard hook to settings.json', () => {
    const result = migration.migrate({ '.claude/settings.json': settingsWithoutRulesGuard })
    expect(result['.claude/settings.json']).toContain('rules-guard')
    expect(result['.claude/settings.json']).toContain('frozen-guard')
  })

  it('preserves existing frozen-guard hook', () => {
    const result = migration.migrate({ '.claude/settings.json': settingsWithoutRulesGuard })
    const parsed = JSON.parse(result['.claude/settings.json'])
    const hooks = parsed.hooks.PreToolUse[0].hooks
    expect(hooks).toHaveLength(2)
    expect(hooks[0].command).toContain('frozen-guard')
    expect(hooks[1].command).toContain('rules-guard')
  })

  it('is idempotent for settings.json', () => {
    const first = migration.migrate({ '.claude/settings.json': settingsWithoutRulesGuard })
    expect(migration.applies({ '.claude/settings.json': first['.claude/settings.json'] })).toBe(false)
  })

  // --- CLAUDE.md tests ---

  it('applies when CLAUDE.md has no commit step', () => {
    expect(migration.applies({ 'CLAUDE.md': claudeMdWithoutCommit })).toBe(true)
  })

  it('does not apply when CLAUDE.md already has commit step', () => {
    const updated = claudeMdWithoutCommit + '\n6. **Commit after each change**\n'
    expect(migration.applies({ 'CLAUDE.md': updated })).toBe(false)
  })

  it('adds commit discipline to CLAUDE.md', () => {
    const result = migration.migrate({ 'CLAUDE.md': claudeMdWithoutCommit })
    expect(result['CLAUDE.md']).toContain('Commit after each change')
    expect(result['CLAUDE.md']).toContain('git add src/projects/')
    expect(result['CLAUDE.md']).toContain('/canvai-undo')
  })

  it('is idempotent for CLAUDE.md', () => {
    const first = migration.migrate({ 'CLAUDE.md': claudeMdWithoutCommit })
    expect(migration.applies({ 'CLAUDE.md': first['CLAUDE.md'] })).toBe(false)
  })

  // --- Both files together ---

  it('migrates both files in one pass', () => {
    const result = migration.migrate({
      '.claude/settings.json': settingsWithoutRulesGuard,
      'CLAUDE.md': claudeMdWithoutCommit,
    })
    expect(result['.claude/settings.json']).toContain('rules-guard')
    expect(result['CLAUDE.md']).toContain('Commit after each change')
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
