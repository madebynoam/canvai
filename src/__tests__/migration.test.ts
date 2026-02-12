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

describe('migration 0.0.16', () => {
  const migration = migrations.find(m => m.version === '0.0.16')!

  it('exists in the registry', () => {
    expect(migration).toBeDefined()
    expect(migration.version).toBe('0.0.16')
  })

  it('applies to old template with flat pages', () => {
    expect(migration.applies({ 'src/App.tsx': oldPagesAppTsx })).toBe(true)
  })

  it('does not apply to current template', () => {
    const currentApp = `const activePage = activeProject?.iterations[activeIterationIndex]?.pages[activePageIndex]`
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

  it('replaces .pages[activePageIndex] with .iterations[activeIterationIndex]?.pages[activePageIndex]', () => {
    const result = migration.migrate({ 'src/App.tsx': oldPagesAppTsx })
    expect(result['src/App.tsx']).toContain('iterations[activeIterationIndex]?.pages[activePageIndex]')
    expect(result['src/App.tsx']).not.toMatch(/activeProject\?\.pages\[activePageIndex\]/)
  })

  it('replaces .pages.length with .iterations.length', () => {
    const result = migration.migrate({ 'src/App.tsx': oldPagesAppTsx })
    expect(result['src/App.tsx']).toContain('.iterations.length')
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
    expect(migration.applies({ 'src/App.tsx': first['src/App.tsx'] })).toBe(false)
    const second = migration.migrate({ 'src/App.tsx': first['src/App.tsx'] })
    expect(second['src/App.tsx']).toBe(first['src/App.tsx'])
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
