import './App.css'
import { useState, useEffect } from 'react'
import { Canvas } from './runtime/Canvas'
import { Frame } from './runtime/Frame'
import { useFrames } from './runtime/useFrames'
import { layoutFrames } from './runtime/layout'
import { TopBar } from './runtime/TopBar'
import { IterationSidebar } from './runtime/IterationSidebar'
import { AnnotationOverlay } from './runtime/AnnotationOverlay'
import { manifests } from 'virtual:canvai-manifests'
import type { ProjectManifest } from './runtime/types'

function App() {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0)
  const [activeIterationIndex, setActiveIterationIndex] = useState(0)
  const [activePageIndex, setActivePageIndex] = useState(0)
  const [mode, setMode] = useState<'manual' | 'watch'>('manual')
  const [pendingCount, setPendingCount] = useState(0)

  // Listen for agent mode changes via SSE
  useEffect(() => {
    if (!import.meta.env.DEV) return
    const es = new EventSource('http://localhost:4748/annotations/events')
    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data)
        if (data.type === 'mode') setMode(data.mode)
      } catch {}
    }
    // Fetch initial mode
    fetch('http://localhost:4748/mode').then(r => r.json()).then(d => setMode(d.mode)).catch(() => {})
    return () => es.close()
  }, [])
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const activeProject: ProjectManifest | undefined = manifests[activeProjectIndex]
  const activeIteration = activeProject?.iterations?.[activeIterationIndex]
  const iterClass = activeIteration ? `iter-${activeIteration.name.toLowerCase()}` : ''
  const activePage = activeIteration?.pages[activePageIndex]
  const layoutedFrames = activePage ? layoutFrames(activePage) : []

  const { frames, updateFrame, handleResize } = useFrames(layoutedFrames, activePage?.grid)

  return (
    <div id="canvai-root" style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar — full width */}
      <TopBar
        projects={manifests}
        activeProjectIndex={activeProjectIndex}
        onSelectProject={(i) => {
          setActiveProjectIndex(i)
          setActiveIterationIndex(0)
          setActivePageIndex(0)
        }}
        iterationCount={activeProject?.iterations?.length ?? 0}
        pendingCount={pendingCount}
        mode={mode}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(o => !o)}
      />

      {/* Main area — sidebar + canvas */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Iteration sidebar */}
        <IterationSidebar
          iterations={activeProject?.iterations ?? []}
          activeIterationIndex={activeIterationIndex}
          activePageIndex={activePageIndex}
          onSelect={(iterIdx, pageIdx) => {
            setActiveIterationIndex(iterIdx)
            setActivePageIndex(pageIdx)
          }}
          collapsed={!sidebarOpen}
        />

        {/* Canvas */}
        <div className={iterClass} style={{ flex: 1 }}>
          <Canvas pageKey={`${activeProjectIndex}-${activeIterationIndex}-${activePageIndex}`}>
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
