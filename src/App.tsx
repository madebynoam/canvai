import './App.css'
import { useState } from 'react'
import { Canvas } from './runtime/Canvas'
import { Frame } from './runtime/Frame'
import { useFrames } from './runtime/useFrames'
import { layoutFrames } from './runtime/layout'
import { Agentation } from 'agentation'
import { manifests } from 'virtual:canvai-manifests'
import type { ProjectManifest } from './runtime/types'

function App() {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0)
  const [activePageIndex, setActivePageIndex] = useState(0)

  const activeProject: ProjectManifest | undefined = manifests[activeProjectIndex]
  const activePage = activeProject?.pages[activePageIndex]
  const layoutedFrames = activePage ? layoutFrames(activePage) : []

  const { frames, updateFrame } = useFrames(layoutedFrames)

  return (
    <div id="canvai-root" style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar: project selector + page tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 16px',
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: '#fff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: 13,
        flexShrink: 0,
      }}>
        {/* Project selector */}
        {manifests.length > 1 && (
          <select
            value={activeProjectIndex}
            onChange={e => {
              setActiveProjectIndex(Number(e.target.value))
              setActivePageIndex(0)
            }}
            style={{
              fontSize: 13,
              padding: '4px 8px',
              border: '1px solid #d1d5db',
              borderRadius: 6,
              backgroundColor: '#fff',
              cursor: 'pointer',
            }}
          >
            {manifests.map((m: ProjectManifest, i: number) => (
              <option key={m.project} value={i}>{m.project}</option>
            ))}
          </select>
        )}

        {manifests.length === 1 && (
          <span style={{ fontWeight: 600, color: '#374151' }}>{activeProject?.project}</span>
        )}

        {/* Divider */}
        {activeProject && activeProject.pages.length > 0 && (
          <span style={{ color: '#d1d5db' }}>|</span>
        )}

        {/* Page tabs */}
        {activeProject?.pages.map((page, i) => (
          <button
            key={page.name}
            onClick={() => setActivePageIndex(i)}
            style={{
              fontSize: 13,
              padding: '4px 12px',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              backgroundColor: i === activePageIndex ? '#f3f4f6' : 'transparent',
              color: i === activePageIndex ? '#111827' : '#6b7280',
              fontWeight: i === activePageIndex ? 500 : 400,
            }}
          >
            {page.name}
          </button>
        ))}

        {manifests.length === 0 && (
          <span style={{ color: '#9ca3af' }}>No projects found. Run /canvai-init to create one.</span>
        )}
      </div>

      {/* Canvas */}
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
            >
              <frame.component {...(frame.props ?? {})} />
            </Frame>
          ))}
        </Canvas>
      </div>

      {import.meta.env.DEV && <Agentation endpoint="http://localhost:4747" />}
    </div>
  )
}

export default App
