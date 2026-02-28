import { useState, useEffect, useCallback, useRef } from 'react'
import { Canvas } from './Canvas'
import { Frame } from './Frame'
import { useFrames } from './useFrames'
import { layoutFrames } from './layout'
import { TopBar } from './TopBar'
import { IterationSidebar } from './IterationSidebar'
import { AnnotationOverlay } from './AnnotationOverlay'
import { CommentOverlay } from './CommentOverlay'
import { NewIterationDialog } from './NewIterationDialog'
import { NewProjectDialog } from './NewProjectDialog'
import { useNavMemory } from './useNavMemory'
import { ZoomControl } from './ZoomControl'
import { CanvasColorPicker } from './CanvasColorPicker'
import { loadCanvasBg, saveCanvasBg } from './Canvas'
import { ActionButton } from './Menu'
import { N, E, S, T, R, FONT } from './tokens'
import type { ProjectManifest, CanvasImageFrame } from './types'

interface CanvaiShellProps {
  manifests: ProjectManifest[]
  annotationEndpoint?: string
}

const PROJECT_KEY = 'canvai:active-project'

function loadProjectIndex(max: number): number {
  try {
    const saved = localStorage.getItem(PROJECT_KEY)
    if (saved !== null) {
      const idx = Number(saved)
      if (idx >= 0 && idx < max) return idx
    }
  } catch {}
  return 0
}

/* ── Toast with spring enter / fade exit ── */

const SPRING = 'cubic-bezier(0.34, 1.56, 0.64, 1)'
const TOAST_DURATION = 2000
const ENTER_MS = 400
const EXIT_MS = 250

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  const [phase, setPhase] = useState<'enter' | 'visible' | 'exit'>('enter')
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    // enter → visible
    const enterTimer = setTimeout(() => setPhase('visible'), ENTER_MS)
    return () => clearTimeout(enterTimer)
  }, [])

  useEffect(() => {
    // visible → exit after TOAST_DURATION
    if (phase !== 'enter') {
      timerRef.current = setTimeout(() => setPhase('exit'), TOAST_DURATION)
      return () => clearTimeout(timerRef.current)
    }
  }, [phase])

  useEffect(() => {
    // exit → unmount
    if (phase === 'exit') {
      const t = setTimeout(onDone, EXIT_MS)
      return () => clearTimeout(t)
    }
  }, [phase, onDone])

  const entering = phase === 'enter'
  const exiting = phase === 'exit'

  return (
    <div
      style={{
        position: 'fixed',
        bottom: S.xxl,
        left: '50%',
        zIndex: 99999,
        padding: `${S.sm}px ${S.xxl}px`,
        background: N.txtPri,
        color: 'oklch(1 0 0)',
        borderRadius: R.pill,
        fontSize: T.title,
        fontWeight: 500,
        fontFamily: FONT,
        boxShadow: `0 2px ${S.md}px rgba(0, 0, 0, 0.12)`,
        transform: `translateX(-50%) translateY(${entering ? '12px' : '0'})`,
        opacity: entering || exiting ? 0 : 1,
        transition: entering
          ? `transform ${ENTER_MS}ms ${SPRING}, opacity ${ENTER_MS}ms ease-out`
          : `opacity ${EXIT_MS}ms ease-in`,
        pointerEvents: 'none',
      }}
    >
      {message}
    </div>
  )
}

export function CanvaiShell({ manifests, annotationEndpoint = 'http://localhost:4748' }: CanvaiShellProps) {
  const [activeProjectIndex, setActiveProjectIndex] = useState(() => loadProjectIndex(manifests.length))
  // Persist active project selection
  useEffect(() => {
    try { localStorage.setItem(PROJECT_KEY, String(activeProjectIndex)) } catch {}
  }, [activeProjectIndex])

  const [commentCount, setCommentCount] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [iterDialogOpen, setIterDialogOpen] = useState(false)
  const [projectDialogOpen, setProjectDialogOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [contextImages, setContextImages] = useState<CanvasImageFrame[]>([])

  const showToast = useCallback((msg: string) => setToast(msg), [])

  const activeProject: ProjectManifest | undefined = manifests[activeProjectIndex]

  const handleNewProject = useCallback(async (payload: { name: string, description: string, prompt: string }) => {
    try {
      await fetch(`${annotationEndpoint}/annotations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'project', comment: JSON.stringify(payload) }),
      })
      showToast('Project submitted')
    } catch {
      showToast('Failed to submit')
    }
  }, [annotationEndpoint, showToast])

  const handleNewIteration = useCallback(async (prompt: string) => {
    const projectName = activeProject?.project ?? ''
    try {
      await fetch(`${annotationEndpoint}/annotations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'iteration', comment: prompt, project: projectName }),
      })
      showToast('Iteration submitted')
    } catch {
      showToast('Failed to submit')
    }
  }, [annotationEndpoint, showToast, activeProject])
  const { iterationIndex: activeIterationIndex, pageIndex: activePageIndex, setIteration: setActiveIterationIndex, setPage: setActivePageIndex } = useNavMemory(
    activeProject?.project ?? '',
    activeProject?.iterations ?? [],
  )

  const activeIteration = activeProject?.iterations?.[activeIterationIndex]
  const iterClass = activeIteration ? `iter-${activeIteration.name.toLowerCase()}` : ''
  const iterationName = activeIteration?.name ?? 'v1'

  // Build augmented pages array with Context page (DEV only)
  const augmentedPages = [
    ...(activeIteration?.pages ?? []),
    ...(import.meta.env.DEV && !activeIteration?.pages?.some(p => p.name === 'Context')
      ? [{ name: 'Context', frames: [] }]
      : []),
  ]
  const activePage = augmentedPages[activePageIndex]
  const isContextPage = activePage?.name === 'Context'
  const layoutedFrames = activePage && !isContextPage ? layoutFrames(activePage) : []

  const { frames, updateFrame, handleResize } = useFrames(layoutedFrames, activePage?.grid)

  // Load context images when iteration changes
  useEffect(() => {
    if (!activeProject?.project) return
    fetch(`${annotationEndpoint}/context?project=${encodeURIComponent(activeProject.project)}&iteration=${encodeURIComponent(iterationName)}`)
      .then(r => r.json())
      .then(data => {
        if (data.images && Array.isArray(data.images)) {
          setContextImages(data.images.map((img: { filename: string; path: string }, i: number) => ({
            type: 'image' as const,
            id: `context-${img.filename}`,
            title: img.filename,
            src: `${annotationEndpoint}/context-image?project=${encodeURIComponent(activeProject.project)}&iteration=${encodeURIComponent(iterationName)}&filename=${encodeURIComponent(img.filename)}`,
            x: 50 + (i % 4) * 320,
            y: 50 + Math.floor(i / 4) * 320,
            width: 300,
            height: 300,
          })))
        }
      })
      .catch(() => setContextImages([]))
  }, [activeProject?.project, iterationName, annotationEndpoint])

  // Handle image paste — save to server and add to context
  const handleImagePaste = useCallback(async (dataUrl: string, filename: string) => {
    if (!activeProject?.project) return

    try {
      const res = await fetch(`${annotationEndpoint}/context`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project: activeProject.project,
          iteration: iterationName,
          dataUrl,
          filename,
        }),
      })
      const result = await res.json()

      if (result.path) {
        // Add to local state immediately
        const newImage: CanvasImageFrame = {
          type: 'image',
          id: `context-${result.filename}`,
          title: result.filename,
          src: `${annotationEndpoint}/context-image?project=${encodeURIComponent(activeProject.project)}&iteration=${encodeURIComponent(iterationName)}&filename=${encodeURIComponent(result.filename)}`,
          x: 50 + (contextImages.length % 4) * 320,
          y: 50 + Math.floor(contextImages.length / 4) * 320,
          width: 300,
          height: 300,
        }
        setContextImages(prev => [...prev, newImage])
        showToast('Image added to context')
      }
    } catch {
      showToast('Failed to save image')
    }
  }, [activeProject?.project, iterationName, annotationEndpoint, contextImages.length, showToast])

  const projectKey = activeProject?.project ?? ''
  const [canvasBg, setCanvasBg] = useState(() => loadCanvasBg(projectKey) ?? N.canvas)
  useEffect(() => { setCanvasBg(loadCanvasBg(projectKey) ?? N.canvas) }, [projectKey])
  useEffect(() => { saveCanvasBg(projectKey, canvasBg) }, [projectKey, canvasBg])

  // Empty state — no projects yet
  if (manifests.length === 0) {
    return (
      <div id="canvai-root" style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: N.canvas,
        fontFamily: FONT,
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: S.lg,
          padding: S.xxl,
          background: N.card,
          border: `1px solid ${N.border}`,
          borderRadius: R.panel,
          maxWidth: 400,
          textAlign: 'center',
        }}>
          <h2 style={{
            fontSize: T.title,
            fontWeight: 600,
            color: N.txtPri,
            margin: 0,
            textWrap: 'pretty',
          }}>
            Start a new project
          </h2>
          <p style={{
            fontSize: T.body,
            color: N.txtSec,
            margin: 0,
            lineHeight: 1.5,
            textWrap: 'pretty',
          }}>
            Describe what you're designing and the agent will set it up
          </p>
          <ActionButton variant="primary" onClick={() => setProjectDialogOpen(true)}>
            New Project
          </ActionButton>
        </div>
        {import.meta.env.DEV && (
          <NewProjectDialog
            open={projectDialogOpen}
            onClose={() => setProjectDialogOpen(false)}
            onSubmit={handleNewProject}
          />
        )}
        {toast && <Toast message={toast} onDone={() => setToast(null)} />}
      </div>
    )
  }

  return (
    <div id="canvai-root" style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopBar
        projects={manifests}
        activeProjectIndex={activeProjectIndex}
        onSelectProject={setActiveProjectIndex}
        iterations={activeProject?.iterations ?? []}
        activeIterationIndex={activeIterationIndex}
        onSelectIteration={setActiveIterationIndex}
        annotationEndpoint={annotationEndpoint}
        commentCount={commentCount}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(o => !o)}
        onNewIteration={() => setIterDialogOpen(true)}
        onNewProject={() => setProjectDialogOpen(true)}
      />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <IterationSidebar
          iterationName={activeIteration?.name ?? ''}
          pages={augmentedPages}
          activePageIndex={activePageIndex}
          onSelectPage={setActivePageIndex}
          collapsed={!sidebarOpen}
        />

        <div className={iterClass} style={{ flex: 1, backgroundColor: N.chrome, padding: `${E.insetTop}px ${E.inset}px ${E.inset}px` }}>
          <div style={{
            width: '100%',
            height: '100%',
            borderRadius: 32,
            cornerShape: 'squircle',
            backgroundColor: canvasBg,
            boxShadow: E.shadow,
            overflow: 'hidden',
            position: 'relative',
          } as React.CSSProperties}>
            <Canvas
              pageKey={`${activeProject?.project ?? ''}-${activeIteration?.name ?? ''}-${activePage?.name ?? ''}`}
              onImagePaste={handleImagePaste}
              hud={<>
                <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 5 }}>
                  <CanvasColorPicker activeColor={canvasBg} onSelect={setCanvasBg} />
                </div>
                <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', zIndex: 5 }}>
                  <ZoomControl />
                </div>
              </>}
            >
              {/* Render component frames */}
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
                  {'component' in frame && <frame.component {...(frame.props ?? {})} />}
                </Frame>
              ))}
              {/* Render context images on Context page */}
              {isContextPage && contextImages.map(img => (
                <Frame
                  key={img.id}
                  id={img.id}
                  title={img.title}
                  x={img.x}
                  y={img.y}
                  width={img.width}
                  height={img.height}
                  onMove={(id, newX, newY) => {
                    setContextImages(prev => prev.map(ci =>
                      ci.id === id ? { ...ci, x: newX, y: newY } : ci
                    ))
                  }}
                >
                  <img
                    src={img.src}
                    alt={img.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      borderRadius: 8,
                    }}
                  />
                </Frame>
              ))}
            </Canvas>
          </div>
        </div>
      </div>

      {import.meta.env.DEV && <AnnotationOverlay endpoint={annotationEndpoint} frames={frames} showToast={showToast} project={projectKey} />}
      <CommentOverlay endpoint={annotationEndpoint} frames={frames} onCommentCountChange={setCommentCount} />
      {import.meta.env.DEV && (
        <NewIterationDialog
          open={iterDialogOpen}
          onClose={() => setIterDialogOpen(false)}
          onSubmit={handleNewIteration}
        />
      )}
      {import.meta.env.DEV && (
        <NewProjectDialog
          open={projectDialogOpen}
          onClose={() => setProjectDialogOpen(false)}
          onSubmit={handleNewProject}
        />
      )}

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  )
}
