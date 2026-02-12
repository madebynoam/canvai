import './App.css'
import { useState } from 'react'
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
  const [mode] = useState<'manual' | 'watch'>('manual')
  const [pendingCount, setPendingCount] = useState(0)

  const activeProject: ProjectManifest | undefined = manifests[activeProjectIndex]
  const activePage = activeProject?.iterations[activeIterationIndex]?.pages[activePageIndex]
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
        iterationCount={activeProject?.iterations.length ?? 0}
        pendingCount={pendingCount}
        mode={mode}
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
        />

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

      {import.meta.env.DEV && <AnnotationOverlay endpoint="http://localhost:4748" frames={frames} annotateMode={mode} onPendingChange={setPendingCount} />}
    </div>
  )
}

export default App
