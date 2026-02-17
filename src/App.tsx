import './App.css'
import { useState, useEffect } from 'react'
import { Canvas } from './runtime/Canvas'
import { Frame } from './runtime/Frame'
import { useFrames } from './runtime/useFrames'
import { layoutFrames } from './runtime/layout'
import { TopBar } from './runtime/TopBar'
import { IterationSidebar } from './runtime/IterationSidebar'
import { AnnotationOverlay } from './runtime/AnnotationOverlay'
import { useNavMemory } from './runtime/useNavMemory'
import { ZoomControl } from './runtime/ZoomControl'
import { CanvasColorPicker } from './runtime/CanvasColorPicker'
import { loadCanvasBg, saveCanvasBg } from './runtime/Canvas'
import { N, E } from './runtime/tokens'
import { manifests } from 'virtual:canvai-manifests'
import type { ProjectManifest } from './runtime/types'

function App() {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0)
  const [mode, setMode] = useState<'manual' | 'watch'>('manual')
  const [pendingCount, setPendingCount] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const activeProject: ProjectManifest | undefined = manifests[activeProjectIndex]
  const { iterationIndex: activeIterationIndex, pageIndex: activePageIndex, setIteration: setActiveIterationIndex, setPage: setActivePageIndex } = useNavMemory(
    activeProject?.project ?? '',
    activeProject?.iterations ?? [],
  )

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

  const activeIteration = activeProject?.iterations?.[activeIterationIndex]
  const iterClass = activeIteration ? `iter-${activeIteration.name.toLowerCase()}` : ''
  const activePage = activeIteration?.pages?.[activePageIndex]
  const layoutedFrames = activePage ? layoutFrames(activePage) : []

  const { frames, updateFrame, handleResize } = useFrames(layoutedFrames, activePage?.grid)

  const projectKey = activeProject?.project ?? ''
  const [canvasBg, setCanvasBg] = useState(() => loadCanvasBg(projectKey) ?? N.canvas)
  useEffect(() => { setCanvasBg(loadCanvasBg(projectKey) ?? N.canvas) }, [projectKey])
  useEffect(() => { saveCanvasBg(projectKey, canvasBg) }, [projectKey, canvasBg])

  return (
    <div id="canvai-root" style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar — full width */}
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

      {/* Main area — sidebar + canvas */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Iteration sidebar — shows pages for active iteration */}
        <IterationSidebar
          iterationName={activeIteration?.name ?? ''}
          pages={activeIteration?.pages ?? []}
          activePageIndex={activePageIndex}
          onSelectPage={setActivePageIndex}
          collapsed={!sidebarOpen}
        />

        {/* Canvas — elevated, inset from chrome base */}
        <div className={iterClass} style={{ flex: 1, backgroundColor: N.chrome, padding: `${E.insetTop}px ${E.inset}px ${E.inset}px` }}>
          <div style={{
            width: '100%',
            height: '100%',
            borderRadius: E.radius,
            backgroundColor: canvasBg,
            boxShadow: E.shadow,
            overflow: 'hidden',
            position: 'relative',
          }}>
            <Canvas
              pageKey={`${activeProject?.project ?? ''}-${activeIteration?.name ?? ''}-${activePage?.name ?? ''}`}
              hud={<>
                <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 5 }}>
                  <CanvasColorPicker activeColor={canvasBg} onSelect={setCanvasBg} />
                </div>
                <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', zIndex: 5 }}>
                  <ZoomControl />
                </div>
              </>}
            >
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
