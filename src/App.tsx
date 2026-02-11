import './App.css'
import { useState } from 'react'
import { Canvas } from './runtime/Canvas'
import { Frame } from './runtime/Frame'
import { useFrames } from './runtime/useFrames'
import { layoutFrames } from './runtime/layout'
import { PageTabs } from './runtime/PageTabs'
import { ProjectSidebar } from './runtime/ProjectSidebar'
import { AnnotationOverlay } from './runtime/AnnotationOverlay'
import { manifests } from 'virtual:canvai-manifests'
import type { ProjectManifest } from './runtime/types'

function App() {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0)
  const [activePageIndex, setActivePageIndex] = useState(0)

  const activeProject: ProjectManifest | undefined = manifests[activeProjectIndex]
  const activePage = activeProject?.pages[activePageIndex]
  const layoutedFrames = activePage ? layoutFrames(activePage) : []

  const { frames, updateFrame, handleResize } = useFrames(layoutedFrames, activePage?.grid)

  return (
    <div id="canvai-root" style={{ width: '100vw', height: '100vh', display: 'flex' }}>
      {/* Sidebar */}
      <ProjectSidebar
        projects={manifests}
        activeIndex={activeProjectIndex}
        onSelect={(i) => {
          setActiveProjectIndex(i)
          setActivePageIndex(0)
        }}
      />

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top bar: page tabs */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '8px 16px',
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#fff',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          flexShrink: 0,
          minHeight: 40,
        }}>
          {activeProject && (
            <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>
              {activeProject.project}
            </span>
          )}

          {activeProject && activeProject.pages.length > 1 && (
            <PageTabs
              pages={activeProject.pages}
              activeIndex={activePageIndex}
              onSelect={setActivePageIndex}
            />
          )}

          {activeProject && activeProject.pages.length === 1 && (
            <span style={{ fontSize: 12, color: '#9ca3af' }}>
              {activeProject.pages[0].name}
            </span>
          )}

          {!activeProject && (
            <span style={{ fontSize: 13, color: '#9ca3af' }}>
              No projects found. Run /canvai-init to create one.
            </span>
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
                onResize={handleResize}
              >
                <frame.component {...(frame.props ?? {})} />
              </Frame>
            ))}
          </Canvas>
        </div>
      </div>

      {import.meta.env.DEV && <AnnotationOverlay endpoint="http://localhost:4748" frames={frames} />}
    </div>
  )
}

export default App
