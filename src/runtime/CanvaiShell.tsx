import { useState, useEffect, useCallback, useRef, memo } from 'react'
import { X } from 'lucide-react'
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
import { TourOverlay, isTourCompleted } from './TourOverlay'
import { useNavMemory } from './useNavMemory'
import { ZoomControl } from './ZoomControl'
import { CanvasColorPicker, DEFAULT_CANVAS_COLOR } from './CanvasColorPicker'
import { loadCanvasBg, saveCanvasBg } from './Canvas'
import { ActionButton } from './Menu'
import { N, D, E, S, T, R, FONT, DIM } from './tokens'
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

// URL routing: /:project/:iteration/:page
function parseUrl(manifests: ProjectManifest[]): { projectIdx: number; iterationIdx: number; pageIdx: number } | null {
  const path = window.location.pathname
  if (path === '/' || path === '') return null

  const parts = path.split('/').filter(Boolean)
  if (parts.length === 0) return null

  const projectName = decodeURIComponent(parts[0])
  const projectIdx = manifests.findIndex(m => m.project === projectName)
  if (projectIdx < 0) return null

  const project = manifests[projectIdx]
  let iterationIdx = (project.iterations?.length ?? 1) - 1 // default to latest
  let pageIdx = 0

  if (parts[1]) {
    const iterName = decodeURIComponent(parts[1])
    const idx = project.iterations?.findIndex(i => i.name.toLowerCase() === iterName.toLowerCase()) ?? -1
    if (idx >= 0) iterationIdx = idx
  }

  if (parts[2]) {
    const pageName = decodeURIComponent(parts[2])
    const iteration = project.iterations?.[iterationIdx]
    const idx = iteration?.pages?.findIndex(p => p.name.toLowerCase() === pageName.toLowerCase()) ?? -1
    if (idx >= 0) {
      pageIdx = idx
    } else if (import.meta.env.DEV && pageName.toLowerCase() === 'context') {
      // Context is a virtual DEV-only page, appended after manifest pages
      pageIdx = iteration?.pages?.length ?? 0
    }
  }

  return { projectIdx, iterationIdx, pageIdx }
}

function buildUrl(project: string, iteration: string, page: string): string {
  return `/${encodeURIComponent(project)}/${encodeURIComponent(iteration)}/${encodeURIComponent(page)}`
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
        color: D.text,
        borderRadius: R.pill,
        fontSize: T.ui,
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

/* ── Context image with hover delete ── */
const ContextImageContent = memo(function ContextImageContent({
  src,
  title,
  onDelete,
}: {
  src: string
  title: string
  onDelete: () => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      style={{ position: 'relative', width: '100%', height: '100%' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={src}
        alt={title}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          borderRadius: R.ui, cornerShape: 'squircle',
        }}
      />
      {hovered && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            onDelete()
          }}
          onPointerDown={(e) => {
            e.stopPropagation()
          }}
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 24,
            height: 24,
            borderRadius: R.ui, cornerShape: 'squircle',
            border: 'none',
            background: 'oklch(0.22 0.005 240 / 0.8)',
            color: D.text,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'default',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            zIndex: 99999,
            pointerEvents: 'auto',
          }}
        >
          <X size={14} strokeWidth={2} />
        </button>
      )}
    </div>
  )
})

export function CanvaiShell({ manifests, annotationEndpoint = 'http://localhost:4748' }: CanvaiShellProps) {
  // URL routing takes precedence, then localStorage fallback
  const urlState = parseUrl(manifests)
  const [activeProjectIndex, setActiveProjectIndex] = useState(() => urlState?.projectIdx ?? loadProjectIndex(manifests.length))
  const [urlIterationIdx] = useState(() => urlState?.iterationIdx)
  const [urlPageIdx] = useState(() => urlState?.pageIdx)

  // Persist active project selection
  useEffect(() => {
    try { localStorage.setItem(PROJECT_KEY, String(activeProjectIndex)) } catch {}
  }, [activeProjectIndex])

  const [commentCount, setCommentCount] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [iterDialogOpen, setIterDialogOpen] = useState(false)
  const [projectDialogOpen, setProjectDialogOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  // Images stored per-page: { "pageName": CanvasImageFrame[] }
  const [pageImages, setPageImages] = useState<Record<string, CanvasImageFrame[]>>({})
  const [showTour, setShowTour] = useState(() => !isTourCompleted())
  // Pending prompt request from agent (when /canvai-new is called without a prompt)
  const [promptRequest, setPromptRequest] = useState<{ id: string; projectName: string } | null>(null)

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

  // Handle prompt request submission (from agent's /canvai-new without prompt)
  const handlePromptRequestSubmit = useCallback(async (payload: { name: string; description: string; prompt: string }) => {
    if (!promptRequest) return

    try {
      // Create the actual project annotation with the prompt
      await fetch(`${annotationEndpoint}/annotations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'project', comment: JSON.stringify(payload) }),
      })
      // Resolve the original prompt-request annotation
      await fetch(`${annotationEndpoint}/annotations/${promptRequest.id}/resolve`, { method: 'POST' })
      showToast('Project submitted')
    } catch {
      showToast('Failed to submit')
    } finally {
      setPromptRequest(null)
    }
  }, [annotationEndpoint, showToast, promptRequest])

  // SSE listener for prompt-requested events (from agent's /canvai-new without prompt)
  useEffect(() => {
    if (typeof window === 'undefined') return

    const source = new EventSource(`${annotationEndpoint}/annotations/events`)
    source.onmessage = async (e) => {
      try {
        const data = JSON.parse(e.data)
        if (data.type === 'prompt-requested' && data.id) {
          // Fetch the annotation to get the project name
          const res = await fetch(`${annotationEndpoint}/annotations`)
          const annotations = await res.json()
          const annotation = annotations.find((a: { id: string }) => String(a.id) === String(data.id))
          if (annotation) {
            // Parse project name from comment (it's JSON: { name: "project-name" })
            let projectName = ''
            try {
              const parsed = JSON.parse(annotation.comment)
              projectName = parsed.name || ''
            } catch {
              projectName = annotation.comment || ''
            }
            setPromptRequest({ id: String(data.id), projectName })
          }
        }
      } catch { /* ignore parse errors */ }
    }
    return () => source.close()
  }, [annotationEndpoint])

  const { iterationIndex: activeIterationIndex, pageIndex: activePageIndex, setIteration: setActiveIterationIndex, setPage: setActivePageIndex } = useNavMemory(
    activeProject?.project ?? '',
    activeProject?.iterations ?? [],
    { iterationIdx: urlIterationIdx, pageIdx: urlPageIdx },
  )

  const activeIteration = activeProject?.iterations?.[activeIterationIndex]
  const iterClass = activeIteration ? `iter-${activeIteration.name.toLowerCase()}` : ''
  const iterationName = activeIteration?.name ?? 'v1'

  // Sync URL when navigation changes
  const augmentedPagesForUrl = [
    ...(activeIteration?.pages ?? []),
    ...(import.meta.env.DEV && !activeIteration?.pages?.some(p => p.name === 'Context')
      ? [{ name: 'Context', frames: [] }]
      : []),
  ]
  const activePageForUrl = augmentedPagesForUrl[activePageIndex]
  useEffect(() => {
    if (activeProject?.project && activeIteration?.name && activePageForUrl?.name) {
      const newUrl = buildUrl(activeProject.project, activeIteration.name, activePageForUrl.name)
      if (window.location.pathname !== newUrl) {
        window.history.replaceState(null, '', newUrl)
      }
    }
  }, [activeProject?.project, activeIteration?.name, activePageForUrl?.name])

  // Build augmented pages array with Context page (DEV only)
  const augmentedPages = [
    ...(activeIteration?.pages ?? []),
    ...(import.meta.env.DEV && !activeIteration?.pages?.some(p => p.name === 'Context')
      ? [{ name: 'Context', frames: [] }]
      : []),
  ]
  const activePage = augmentedPages[activePageIndex]
  const pageName = activePage?.name ?? ''
  const isContextPage = pageName === 'Context'
  const layoutedFrames = activePage && !isContextPage ? layoutFrames(activePage) : []

  const { frames, updateFrame, handleResize } = useFrames(layoutedFrames, activePage?.grid)

  // Get images for current page
  const currentPageImages = pageImages[pageName] ?? []

  // Load images for current page when page/iteration changes
  useEffect(() => {
    if (!activeProject?.project || !pageName) return

    // Build URL with page param (Context page uses root context folder for backwards compat)
    const pageParam = isContextPage ? '' : `&page=${encodeURIComponent(pageName)}`
    const url = `${annotationEndpoint}/context?project=${encodeURIComponent(activeProject.project)}&iteration=${encodeURIComponent(iterationName)}${pageParam}`

    fetch(url)
      .then(r => r.json())
      .then(data => {
        if (data.images && Array.isArray(data.images)) {
          const positions = data.positions || {}
          const images = data.images.map((img: { filename: string; path: string }, i: number) => {
            const saved = positions[img.filename]
            const pageQueryParam = isContextPage ? '' : `&page=${encodeURIComponent(pageName)}`
            return {
              type: 'image' as const,
              id: `${pageName}-${img.filename}`,
              title: img.filename,
              src: `${annotationEndpoint}/context-image?project=${encodeURIComponent(activeProject.project)}&iteration=${encodeURIComponent(iterationName)}${pageQueryParam}&filename=${encodeURIComponent(img.filename)}`,
              x: saved?.x ?? 50 + (i % 4) * 320,
              y: saved?.y ?? 50 + Math.floor(i / 4) * 320,
              width: saved?.width ?? 300,
              height: saved?.height ?? 300,
            }
          })
          setPageImages(prev => ({ ...prev, [pageName]: images }))
        } else {
          setPageImages(prev => ({ ...prev, [pageName]: [] }))
        }
      })
      .catch(() => setPageImages(prev => ({ ...prev, [pageName]: [] })))
  }, [activeProject?.project, iterationName, pageName, isContextPage, annotationEndpoint])

  // Save image positions per-page (debounced)
  const savePositionsRef = useRef<ReturnType<typeof setTimeout>>()
  useEffect(() => {
    if (!activeProject?.project || !pageName || currentPageImages.length === 0) return
    clearTimeout(savePositionsRef.current)
    savePositionsRef.current = setTimeout(() => {
      const positions: Record<string, { x: number; y: number; width: number; height: number }> = {}
      for (const img of currentPageImages) {
        const filename = img.title
        positions[filename] = { x: img.x, y: img.y, width: img.width, height: img.height }
      }
      // Context page uses root context folder, other pages use subfolders
      const pageParam = isContextPage ? undefined : pageName
      fetch(`${annotationEndpoint}/context-positions`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project: activeProject.project, iteration: iterationName, page: pageParam, positions }),
      }).catch(() => {})
    }, 300)
  }, [currentPageImages, activeProject?.project, iterationName, pageName, isContextPage, annotationEndpoint])

  // Handle image paste — save to server and add to current page
  const handleImagePaste = useCallback(async (dataUrl: string, filename: string, viewportCenter: { x: number; y: number }) => {
    if (!activeProject?.project || !pageName) return

    try {
      // Context page uses root context folder, other pages use subfolders
      const pageParam = isContextPage ? undefined : pageName
      const res = await fetch(`${annotationEndpoint}/context`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project: activeProject.project,
          iteration: iterationName,
          page: pageParam,
          dataUrl,
          filename,
        }),
      })
      const result = await res.json()

      if (result.path) {
        // Add to local state immediately — position near viewport center with slight offset for each image
        const pageQueryParam = isContextPage ? '' : `&page=${encodeURIComponent(pageName)}`
        const currentImages = pageImages[pageName] ?? []
        // Offset each subsequent image slightly so they don't stack exactly
        const offsetIndex = currentImages.length % 5
        const newImage: CanvasImageFrame = {
          type: 'image',
          id: `${pageName}-${result.filename}`,
          title: result.filename,
          src: `${annotationEndpoint}/context-image?project=${encodeURIComponent(activeProject.project)}&iteration=${encodeURIComponent(iterationName)}${pageQueryParam}&filename=${encodeURIComponent(result.filename)}`,
          x: viewportCenter.x - 150 + offsetIndex * 30,  // Center minus half width, plus cascade offset
          y: viewportCenter.y - 150 + offsetIndex * 30,  // Center minus half height, plus cascade offset
          width: 300,
          height: 300,
        }
        setPageImages(prev => ({ ...prev, [pageName]: [...(prev[pageName] ?? []), newImage] }))
        showToast('Image added')
      }
    } catch {
      showToast('Failed to save image')
    }
  }, [activeProject?.project, iterationName, pageName, isContextPage, pageImages, annotationEndpoint, showToast])

  // Handle image deletion from current page
  const handleDeletePageImage = useCallback(async (imageId: string, filename: string) => {
    if (!activeProject?.project || !pageName) return

    try {
      // Context page uses root context folder, other pages use subfolders
      const pageParam = isContextPage ? '' : `&page=${encodeURIComponent(pageName)}`
      const res = await fetch(`${annotationEndpoint}/context?project=${encodeURIComponent(activeProject.project)}&iteration=${encodeURIComponent(iterationName)}${pageParam}&filename=${encodeURIComponent(filename)}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setPageImages(prev => ({
          ...prev,
          [pageName]: (prev[pageName] ?? []).filter(img => img.id !== imageId)
        }))
        showToast('Image deleted')
      } else {
        showToast('Failed to delete image')
      }
    } catch {
      showToast('Failed to delete image')
    }
  }, [activeProject?.project, iterationName, pageName, isContextPage, annotationEndpoint, showToast])

  const projectKey = activeProject?.project ?? ''
  const [canvasBg, setCanvasBg] = useState(() => loadCanvasBg(projectKey) ?? DEFAULT_CANVAS_COLOR)
  useEffect(() => { setCanvasBg(loadCanvasBg(projectKey) ?? DEFAULT_CANVAS_COLOR) }, [projectKey])
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
          borderRadius: R.ui, cornerShape: 'squircle',
          maxWidth: 400,
          textAlign: 'center',
        }}>
          <h2 style={{
            fontSize: T.ui,
            fontWeight: 600,
            color: N.txtPri,
            margin: 0,
            textWrap: 'pretty',
          }}>
            Start a new project
          </h2>
          <p style={{
            fontSize: T.ui,
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
        shareUrl={activeProject?.shareUrl}
        projectName={activeProject?.project ?? ''}
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
            borderRadius: R.ui, cornerShape: 'squircle',
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
              {frames.map(frame => {
                const pickedFrameId = activeIteration?.pickedFrameId
                const isFaded = pickedFrameId ? frame.id !== pickedFrameId : false
                return (
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
                    faded={isFaded}
                  >
                    {'component' in frame && <frame.component {...(frame.props ?? {})} />}
                  </Frame>
                )
              })}
              {/* Render pasted images on current page */}
              {currentPageImages.map(img => (
                <Frame
                  key={img.id}
                  id={img.id}
                  title={img.title}
                  x={img.x}
                  y={img.y}
                  width={img.width}
                  height={img.height}
                  onMove={(id, newX, newY) => {
                    setPageImages(prev => ({
                      ...prev,
                      [pageName]: (prev[pageName] ?? []).map(ci =>
                        ci.id === id ? { ...ci, x: newX, y: newY } : ci
                      )
                    }))
                  }}
                >
                  <ContextImageContent
                    src={img.src}
                    title={img.title}
                    onDelete={() => {
                      // Extract filename from id (format: "pageName-filename")
                      const filename = img.title
                      handleDeletePageImage(img.id, filename)
                    }}
                  />
                </Frame>
              ))}
            </Canvas>
          </div>
        </div>
      </div>

      {import.meta.env.DEV && <AnnotationOverlay endpoint={annotationEndpoint} frames={[...frames, ...currentPageImages]} showToast={showToast} project={projectKey} />}
      {/* Comment overlay hidden for now */}
      {/* <CommentOverlay endpoint={annotationEndpoint} frames={frames} onCommentCountChange={setCommentCount} /> */}
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

      {/* Prompt request dialog (from agent's /canvai-new without prompt) */}
      {promptRequest && (
        <NewProjectDialog
          open={true}
          onClose={() => setPromptRequest(null)}
          onSubmit={handlePromptRequestSubmit}
          defaultName={promptRequest.projectName}
        />
      )}

      {/* First-use onboarding tour */}
      {showTour && manifests.length > 0 && (
        <TourOverlay onComplete={() => setShowTour(false)} />
      )}

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  )
}
