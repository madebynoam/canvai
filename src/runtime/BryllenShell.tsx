import { useState, useEffect, useCallback, useRef, memo, useMemo } from 'react'
import { X, Star, Check, ChevronDown } from 'lucide-react'
import { Canvas } from './Canvas'
import { Frame } from './Frame'
import { useFrames } from './useFrames'
import { layoutFrames } from './layout'
import { TopBar } from './TopBar'
import { AnnotationOverlay } from './AnnotationOverlay'
import { CommentOverlay } from './CommentOverlay'
import { NewProjectDialog } from './NewProjectDialog'
import { TourOverlay, isTourCompleted } from './TourOverlay'
import { ZoomControl } from './ZoomControl'
import { CanvasColorPicker, DEFAULT_CANVAS_COLOR, lightPresets, darkPresets } from './CanvasColorPicker'
import { loadCanvasBgAsync, saveCanvasBgAsync } from './Canvas'
import { ActionButton } from './Menu'
import { UpdateDialog } from './UpdateDialog'
import { checkForUpdate, getDismissedVersion } from './versionCheck'
import { VERSION } from './version'
import { InfoButton } from './InfoButton'
import { A, D, E, S, T, R, FONT, DIM, V } from './tokens'
import { ThemeProvider, useTheme } from './useTheme'
import { TokenPanel, TokenPanelToggle } from './TokenPanel'
import type { ProjectManifest, CanvasImageFrame, FrameStatus, ManifestFrame, CanvasFrame } from './types'

interface BryllenShellProps {
  manifests: ProjectManifest[]
  annotationEndpoint?: string
}

const PROJECT_KEY = 'bryllen:active-project'

function filtersKey(project: string) { return `bryllen:filters:${project}` }

function loadFilters(project: string): Set<FrameStatus> {
  try {
    const saved = localStorage.getItem(filtersKey(project))
    if (saved) {
      const arr = JSON.parse(saved) as FrameStatus[]
      if (arr.length > 0) return new Set(arr)
    }
  } catch {}
  return new Set(['none', 'starred', 'approved', 'rejected'])
}

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

// URL routing: /:project
function parseUrl(manifests: ProjectManifest[]): { projectIdx: number } | null {
  const path = window.location.pathname
  if (path === '/' || path === '') return null

  const parts = path.split('/').filter(Boolean)
  if (parts.length === 0) return null

  const projectName = decodeURIComponent(parts[0])
  const projectIdx = manifests.findIndex(m => m.project === projectName)
  if (projectIdx < 0) return null

  return { projectIdx }
}

function buildUrl(project: string): string {
  return `/${encodeURIComponent(project)}`
}

/* ── Frame Status Filter (Dropdown with Checkboxes) ── */

interface StatusFilterProps {
  visibleStatuses: Set<FrameStatus>
  onToggle: (status: FrameStatus) => void
  counts: Record<FrameStatus, number>
}

const STATUS_OPTIONS: Array<{ value: FrameStatus; label: string; icon: typeof Star; fill: string; stroke: string }> = [
  { value: 'none', label: 'None', icon: Star, fill: 'none', stroke: '#999' },
  { value: 'starred', label: 'Starred', icon: Star, fill: '#F59E0B', stroke: '#F59E0B' },
  { value: 'approved', label: 'Approved', icon: Check, fill: 'none', stroke: '#10B981' },
  { value: 'rejected', label: 'Rejected', icon: X, fill: 'none', stroke: '#EF4444' },
]

function StatusFilter({ visibleStatuses, onToggle, counts }: StatusFilterProps) {
  const [open, setOpen] = useState(false)
  const activeCount = visibleStatuses.size
  const totalVisible = Array.from(visibleStatuses).reduce((sum, s) => sum + counts[s], 0)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handleClick = () => setOpen(false)
    const timer = setTimeout(() => window.addEventListener('click', handleClick), 0)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('click', handleClick)
    }
  }, [open])

  return (
    <div style={{ position: 'relative', pointerEvents: 'auto' }}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(o => !o) }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 10px',
          background: V.card,
          border: `1px solid ${V.border}`,
          borderRadius: R.ui, cornerShape: 'squircle',
          fontSize: T.ui,
          fontFamily: FONT,
          color: V.txtPri,
          cursor: 'default',
          boxShadow: V.shadow,
        } as React.CSSProperties}
      >
        <span>Filter</span>
        <span style={{ color: V.txtSec }}>({totalVisible})</span>
        <ChevronDown size={12} style={{ marginLeft: 2, color: V.txtSec }} />
      </button>
      {open && (
        <div
          onClick={e => e.stopPropagation()}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: 4,
            background: V.card,
            border: `1px solid ${V.border}`,
            borderRadius: R.ui, cornerShape: 'squircle',
            boxShadow: V.shadow,
            padding: 4,
            zIndex: 1000,
            minWidth: 160,
          } as React.CSSProperties}
        >
          {STATUS_OPTIONS.map(opt => {
            const checked = visibleStatuses.has(opt.value)
            const disabled = checked && activeCount === 1
            return (
              <label
                key={opt.value}
                onClick={() => !disabled && onToggle(opt.value)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 8px',
                  borderRadius: 4,
                  cursor: disabled ? 'not-allowed' : 'default',
                  opacity: disabled ? 0.5 : 1,
                  fontSize: T.ui,
                  fontFamily: FONT,
                  color: V.txtPri,
                }}
              >
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 3,
                    border: `1px solid ${checked ? A.accent : V.border}`,
                    background: checked ? A.accent : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    cursor: disabled ? 'not-allowed' : 'default',
                    transition: 'background 0.1s, border-color 0.1s',
                  }}
                >
                  {checked && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5L4 7L8 3" stroke={D.text} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <opt.icon size={14} fill={opt.fill} stroke={opt.stroke} strokeWidth={2} />
                <span style={{ flex: 1 }}>{opt.label}</span>
                <span style={{ color: V.txtSec }}>({counts[opt.value]})</span>
              </label>
            )
          })}
        </div>
      )}
    </div>
  )
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
        background: V.txtPri,
        color: V.card,
        borderRadius: R.pill,
        fontSize: T.ui,
        fontWeight: 500,
        fontFamily: FONT,
        boxShadow: V.shadow,
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

export function BryllenShell({ manifests, annotationEndpoint = 'http://localhost:4748' }: BryllenShellProps) {
  // URL routing takes precedence, then localStorage fallback
  const urlState = parseUrl(manifests)
  const initialProjectIndex = urlState?.projectIdx ?? loadProjectIndex(manifests.length)
  const initialProject = manifests[initialProjectIndex]?.project ?? ''

  return (
    <ThemeProvider project={initialProject} endpoint={annotationEndpoint}>
      <BryllenShellInner manifests={manifests} annotationEndpoint={annotationEndpoint} urlState={urlState} />
    </ThemeProvider>
  )
}

interface BryllenShellInnerProps {
  manifests: ProjectManifest[]
  annotationEndpoint: string
  urlState: { projectIdx: number } | null
}

function BryllenShellInner({ manifests, annotationEndpoint, urlState }: BryllenShellInnerProps) {
  const { cssVars, resolved: currentTheme } = useTheme()

  // Apply CSS vars to document root so portals inherit them
  useEffect(() => {
    const root = document.documentElement
    Object.entries(cssVars).forEach(([key, value]) => {
      root.style.setProperty(key, value)
    })
  }, [cssVars])

  const [activeProjectIndex, setActiveProjectIndex] = useState(() => urlState?.projectIdx ?? loadProjectIndex(manifests.length))

  // Persist active project selection
  useEffect(() => {
    try { localStorage.setItem(PROJECT_KEY, String(activeProjectIndex)) } catch {}
  }, [activeProjectIndex])

  const [commentCount, setCommentCount] = useState(0)
  const [projectDialogOpen, setProjectDialogOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)
  // Images stored per-page: { "pageName": CanvasImageFrame[] }
  const [pageImages, setPageImages] = useState<Record<string, CanvasImageFrame[]>>({})
  const [showTour, setShowTour] = useState(() => !isTourCompleted())
  // Pending prompt request from agent (when /bryllen-new is called without a prompt)
  const [promptRequest, setPromptRequest] = useState<{ id: string; projectName: string } | null>(null)
  // Update checker state
  const [updateInfo, setUpdateInfo] = useState<{ available: boolean; latestVersion: string | null }>({ available: false, latestVersion: null })
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false)

  const showToast = useCallback((msg: string) => setToast(msg), [])

  // Check for updates on mount
  useEffect(() => {
    checkForUpdate(VERSION).then(result => {
      if (result.updateAvailable && result.latestVersion) {
        // Don't show if user dismissed this version
        const dismissed = getDismissedVersion()
        if (dismissed !== result.latestVersion) {
          setUpdateInfo({ available: true, latestVersion: result.latestVersion })
        }
      }
    })
  }, [])

  const activeProject: ProjectManifest | undefined = manifests[activeProjectIndex]

  const handleNewProject = useCallback(async (payload: { name: string; description: string; prompt: string; images?: Array<{ id: string; dataUrl: string; filename: string }> }) => {
    try {
      // Upload inspiration images to context folder
      if (payload.images && payload.images.length > 0) {
        for (const img of payload.images) {
          await fetch(`${annotationEndpoint}/context`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              project: payload.name,
              iteration: 'v1',
              dataUrl: img.dataUrl,
              filename: img.filename,
            }),
          })
        }
      }

      // Create project annotation (without images in payload)
      const { images: _, ...projectPayload } = payload
      await fetch(`${annotationEndpoint}/annotations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'project', comment: JSON.stringify(projectPayload) }),
      })
      showToast('Project submitted')
    } catch {
      showToast('Failed to submit')
    }
  }, [annotationEndpoint, showToast])


  // Handle prompt request submission (from agent's /bryllen-new without prompt)
  const handlePromptRequestSubmit = useCallback(async (payload: { name: string; description: string; prompt: string; images?: Array<{ id: string; dataUrl: string; filename: string }> }) => {
    if (!promptRequest) return

    try {
      // Upload inspiration images to context folder
      if (payload.images && payload.images.length > 0) {
        for (const img of payload.images) {
          await fetch(`${annotationEndpoint}/context`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              project: payload.name,
              iteration: 'v1',
              dataUrl: img.dataUrl,
              filename: img.filename,
            }),
          })
        }
      }

      // Create the actual project annotation with the prompt (without images)
      const { images: _, ...projectPayload } = payload
      await fetch(`${annotationEndpoint}/annotations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'project', comment: JSON.stringify(projectPayload) }),
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

  // SSE listener for prompt-requested events
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

  // Sync URL when project changes
  useEffect(() => {
    if (activeProject?.project) {
      const newUrl = buildUrl(activeProject.project)
      if (window.location.pathname !== newUrl) {
        window.history.replaceState(null, '', newUrl)
      }
    }
  }, [activeProject?.project])

  // Get frames from either flat structure or legacy iterations structure
  const getLayoutedProjectFrames = (project: ProjectManifest | undefined): CanvasFrame[] => {
    if (!project) return []

    // New flat structure
    if (project.frames && project.frames.length > 0) {
      return layoutFrames(project.frames, project.grid)
    }

    // Legacy iterations structure - layout iterations HORIZONTALLY, pages within each VERTICALLY
    if (project.iterations && project.iterations.length > 0) {
      const allFrames: CanvasFrame[] = []
      const ORIGIN_X = 100
      const ORIGIN_Y = 100
      const ITERATION_GAP = 200 // Gap between iterations (horizontal)
      const PAGE_GAP = 100 // Gap between pages within iteration (vertical)

      let currentX = ORIGIN_X

      for (const iteration of project.iterations) {
        let currentY = ORIGIN_Y
        let iterationMaxX = currentX // Track the rightmost edge of this iteration

        for (const page of iteration.pages ?? []) {
          if (!page.frames || page.frames.length === 0) continue

          // Layout this page's frames
          const pageFrames = layoutFrames(page.frames, page.grid)

          // Offset frames to current position
          const offsetFrames = pageFrames.map(f => ({
            ...f,
            x: f.x - ORIGIN_X + currentX, // Offset X by iteration column
            y: f.y - ORIGIN_Y + currentY, // Offset Y within iteration
          }))

          allFrames.push(...offsetFrames)

          // Track the rightmost edge of this page
          const pageMaxX = Math.max(...offsetFrames.map(f => f.x + f.width))
          if (pageMaxX > iterationMaxX) iterationMaxX = pageMaxX

          // Move Y down for next page
          const pageMaxY = Math.max(...offsetFrames.map(f => f.y + f.height))
          currentY = pageMaxY + PAGE_GAP
        }

        // Move X right for next iteration
        currentX = iterationMaxX + ITERATION_GAP
      }
      return allFrames
    }
    return []
  }

  // Layout frames from the project
  const layoutedFrames = activeProject ? getLayoutedProjectFrames(activeProject) : []

  // Token panel state
  const [tokenPanelOpen, setTokenPanelOpen] = useState(false)

  // Frame status state
  const [frameStatuses, setFrameStatuses] = useState<Record<string, FrameStatus>>({})
  const [visibleStatuses, setVisibleStatuses] = useState<Set<FrameStatus>>(() =>
    loadFilters(activeProject?.project ?? '')
  )

  // Reload filters when project changes
  useEffect(() => {
    setVisibleStatuses(loadFilters(activeProject?.project ?? ''))
  }, [activeProject?.project])

  // Persist filters whenever they change
  useEffect(() => {
    if (!activeProject?.project) return
    try {
      localStorage.setItem(filtersKey(activeProject.project), JSON.stringify(Array.from(visibleStatuses)))
    } catch {}
  }, [visibleStatuses, activeProject?.project])

  // Frame selection state (multi-select)
  const [selectedFrameIds, setSelectedFrameIds] = useState<Set<string>>(new Set())

  // Handle frame status change
  const handleFrameStatusChange = useCallback((frameId: string, status: FrameStatus) => {
    if (!activeProject?.project) return
    setFrameStatuses(prev => ({ ...prev, [frameId]: status }))
    // Save to backend
    fetch(`${annotationEndpoint}/frame-status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        project: activeProject.project,
        frameId,
        status,
      }),
    }).catch(() => {})
  }, [activeProject?.project, annotationEndpoint])

  // Handle frame selection (shift+click toggles)
  const handleFrameSelect = useCallback((frameId: string, shiftKey: boolean) => {
    if (shiftKey) {
      setSelectedFrameIds(prev => {
        const next = new Set(prev)
        if (next.has(frameId)) {
          next.delete(frameId)
        } else {
          next.add(frameId)
        }
        return next
      })
    } else {
      // Regular click clears selection
      setSelectedFrameIds(new Set())
    }
  }, [])

  // Clear selection when clicking canvas background
  const handleCanvasClick = useCallback(() => {
    setSelectedFrameIds(new Set())
  }, [])

  // Multi-select drag state: tracks the starting positions when a drag begins
  const dragStartStateRef = useRef<{
    draggedFrameId: string
    startPositions: Record<string, { x: number; y: number }>
  } | null>(null)

  // Toggle a status in the visible set
  const toggleStatusVisibility = useCallback((status: FrameStatus) => {
    setVisibleStatuses(prev => {
      const next = new Set(prev)
      if (next.has(status)) {
        // Don't allow unchecking the last one
        if (next.size > 1) {
          next.delete(status)
        }
      } else {
        next.add(status)
      }
      return next
    })
  }, [])

  // Load frame statuses when project changes
  useEffect(() => {
    if (!activeProject?.project) return
    fetch(`${annotationEndpoint}/frame-status?project=${encodeURIComponent(activeProject.project)}`)
      .then(r => r.json())
      .then(data => setFrameStatuses(data.statuses || {}))
      .catch(() => setFrameStatuses({}))
  }, [activeProject?.project, annotationEndpoint])

  const isDbMode = !!(activeProject?.components)
  const persistConfig = activeProject?.project
    ? { project: activeProject.project, page: 'canvas' }
    : undefined
  // DB mode: pass undefined so useFrames fetches from /frames API
  // Manifest mode: pass layoutedFrames as before
  const { frames, addFrame, updateFrame, removeFrame, handleResize } = useFrames(
    isDbMode ? undefined : layoutedFrames,
    activeProject?.grid,
    persistConfig,
    isDbMode ? activeProject.components : undefined,
  )

  // Option+drag: stamp a copy at the origin so it stays behind while the dragged frame becomes the duplicate
  const handleFrameDuplicate = useCallback((id: string, origX: number, origY: number) => {
    const source = frames.find(f => f.id === id)
    if (!source) return
    addFrame({ ...source, id: crypto.randomUUID(), x: origX, y: origY, manuallyPositioned: true })
  }, [frames, addFrame])

  // Handle frame move with multi-select support
  const handleFrameMove = useCallback((id: string, newX: number, newY: number) => {
    if (selectedFrameIds.has(id) && selectedFrameIds.size > 1) {
      // Check if this is the start of a new drag
      if (!dragStartStateRef.current || dragStartStateRef.current.draggedFrameId !== id) {
        // Record starting positions for all selected frames
        const startPositions: Record<string, { x: number; y: number }> = {}
        for (const frame of frames) {
          if (selectedFrameIds.has(frame.id)) {
            startPositions[frame.id] = { x: frame.x, y: frame.y }
          }
        }
        dragStartStateRef.current = { draggedFrameId: id, startPositions }
      }

      // Calculate delta from the dragged frame's original position
      const dragState = dragStartStateRef.current
      const originalPos = dragState.startPositions[id]
      if (originalPos) {
        const dx = newX - originalPos.x
        const dy = newY - originalPos.y
        // Move all selected frames by the same delta from their start positions
        for (const frameId of selectedFrameIds) {
          const startPos = dragState.startPositions[frameId]
          if (startPos) {
            updateFrame(frameId, { x: startPos.x + dx, y: startPos.y + dy })
          }
        }
      }
    } else {
      // Single frame move (normal behavior)
      dragStartStateRef.current = null // Clear multi-select drag state
      updateFrame(id, { x: newX, y: newY })
    }
  }, [selectedFrameIds, frames, updateFrame])

  // Clear drag state when pointer up (via Frame's onSelect which fires after drag)
  // Also clear when selection changes
  useEffect(() => {
    dragStartStateRef.current = null
  }, [selectedFrameIds])

  // Keyboard shortcuts: Escape to clear selection, S/A/R/N for batch status change, Backspace/Delete to remove
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      if (e.key === 'Escape' && selectedFrameIds.size > 0) {
        setSelectedFrameIds(new Set())
        return
      }

      // Actions requiring selection
      if (selectedFrameIds.size === 0) return

      // Delete selected frames with Backspace or Delete
      if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault()
        for (const frameId of selectedFrameIds) {
          removeFrame(frameId)
        }
        setSelectedFrameIds(new Set())
        return
      }

      // Batch status change shortcuts
      const statusMap: Record<string, FrameStatus> = {
        's': 'starred',
        'a': 'approved',
        'r': 'rejected',
        'n': 'none',
      }
      const status = statusMap[e.key.toLowerCase()]
      if (status) {
        e.preventDefault()
        for (const frameId of selectedFrameIds) {
          handleFrameStatusChange(frameId, status)
        }
        setSelectedFrameIds(new Set()) // Clear selection after action
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedFrameIds, handleFrameStatusChange, removeFrame])

  // Calculate status counts for filter
  const statusCounts = useMemo(() => {
    const counts: Record<FrameStatus, number> = {
      none: 0,
      starred: 0,
      approved: 0,
      rejected: 0,
    }
    for (const frame of frames) {
      const status = frameStatuses[frame.id] || 'none'
      counts[status]++
    }
    return counts
  }, [frames, frameStatuses])

  // Get pasted images for the canvas
  const currentPageImages = pageImages['canvas'] ?? []

  // Load pasted images when project changes
  useEffect(() => {
    if (!activeProject?.project) return

    const url = `${annotationEndpoint}/context?project=${encodeURIComponent(activeProject.project)}&iteration=v1&page=canvas`

    fetch(url)
      .then(r => r.json())
      .then(data => {
        if (data.images && Array.isArray(data.images)) {
          const positions = data.positions || {}
          const images = data.images.map((img: { filename: string; path: string }, i: number) => {
            const saved = positions[img.filename]
            return {
              type: 'image' as const,
              id: `canvas-${img.filename}`,
              title: img.filename,
              src: `${annotationEndpoint}/context-image?project=${encodeURIComponent(activeProject.project)}&iteration=v1&page=canvas&filename=${encodeURIComponent(img.filename)}`,
              x: saved?.x ?? 50 + (i % 4) * 320,
              y: saved?.y ?? 50 + Math.floor(i / 4) * 320,
              width: saved?.width ?? 300,
              height: saved?.height ?? 300,
            }
          })
          setPageImages(prev => ({ ...prev, ['canvas']: images }))
        } else {
          setPageImages(prev => ({ ...prev, ['canvas']: [] }))
        }
      })
      .catch(() => setPageImages(prev => ({ ...prev, ['canvas']: [] })))
  }, [activeProject?.project, annotationEndpoint])

  // Save image positions (debounced)
  const savePositionsRef = useRef<ReturnType<typeof setTimeout>>()
  useEffect(() => {
    if (!activeProject?.project || currentPageImages.length === 0) return
    clearTimeout(savePositionsRef.current)
    savePositionsRef.current = setTimeout(() => {
      const positions: Record<string, { x: number; y: number; width: number; height: number }> = {}
      for (const img of currentPageImages) {
        const filename = img.title
        positions[filename] = { x: img.x, y: img.y, width: img.width, height: img.height }
      }
      fetch(`${annotationEndpoint}/context-positions`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project: activeProject.project, iteration: 'v1', page: 'canvas', positions }),
      }).catch(() => {})
    }, 300)
  }, [currentPageImages, activeProject?.project, annotationEndpoint])

  // Handle image paste — save to server and add to canvas
  const handleImagePaste = useCallback(async (dataUrl: string, filename: string, viewportCenter: { x: number; y: number }) => {
    if (!activeProject?.project) return

    try {
      const res = await fetch(`${annotationEndpoint}/context`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project: activeProject.project,
          iteration: 'v1',
          page: 'canvas',
          dataUrl,
          filename,
        }),
      })
      const result = await res.json()

      if (result.path) {
        // Add to local state immediately — position near viewport center with slight offset for each image
        const currentImages = pageImages['canvas'] ?? []
        // Offset each subsequent image slightly so they don't stack exactly
        const offsetIndex = currentImages.length % 5
        const newImage: CanvasImageFrame = {
          type: 'image',
          id: `canvas-${result.filename}`,
          title: result.filename,
          src: `${annotationEndpoint}/context-image?project=${encodeURIComponent(activeProject.project)}&iteration=v1&page=canvas&filename=${encodeURIComponent(result.filename)}`,
          x: viewportCenter.x - 150 + offsetIndex * 30,  // Center minus half width, plus cascade offset
          y: viewportCenter.y - 150 + offsetIndex * 30,  // Center minus half height, plus cascade offset
          width: 300,
          height: 300,
        }
        setPageImages(prev => ({ ...prev, ['canvas']: [...(prev['canvas'] ?? []), newImage] }))
        showToast('Image added')
      }
    } catch {
      showToast('Failed to save image')
    }
  }, [activeProject?.project, pageImages, annotationEndpoint, showToast])

  // Handle image deletion from canvas
  const handleDeletePageImage = useCallback(async (imageId: string, filename: string) => {
    if (!activeProject?.project) return

    try {
      const res = await fetch(`${annotationEndpoint}/context?project=${encodeURIComponent(activeProject.project)}&iteration=v1&page=canvas&filename=${encodeURIComponent(filename)}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setPageImages(prev => ({
          ...prev,
          ['canvas']: (prev['canvas'] ?? []).filter(img => img.id !== imageId)
        }))
        showToast('Image deleted')
      } else {
        showToast('Failed to delete image')
      }
    } catch {
      showToast('Failed to delete image')
    }
  }, [activeProject?.project, annotationEndpoint, showToast])

  const projectKey = activeProject?.project ?? ''
  const [canvasBg, setCanvasBg] = useState(DEFAULT_CANVAS_COLOR)
  const canvasBgLoadedRef = useRef(false)
  useEffect(() => {
    canvasBgLoadedRef.current = false
    loadCanvasBgAsync(projectKey).then(color => {
      if (color) setCanvasBg(color)
      else setCanvasBg(DEFAULT_CANVAS_COLOR)
      canvasBgLoadedRef.current = true
    })
  }, [projectKey])
  useEffect(() => {
    // Don't save on initial mount — wait until load completes
    if (!canvasBgLoadedRef.current) return
    saveCanvasBgAsync(projectKey, canvasBg)
  }, [projectKey, canvasBg])

  // Map canvas color to equivalent index when theme changes
  const prevThemeRef = useRef(currentTheme)
  useEffect(() => {
    if (prevThemeRef.current === currentTheme) return
    prevThemeRef.current = currentTheme

    // Parse lightness from current canvasBg (oklch(L C H) format)
    const match = canvasBg.match(/oklch\(\s*([\d.]+)/)
    if (!match) return
    const lightness = parseFloat(match[1])

    // Determine which preset index is closest in the OLD theme
    const fromPresets = currentTheme === 'dark' ? lightPresets : darkPresets
    const toPresets = currentTheme === 'dark' ? darkPresets : lightPresets

    let closestIdx = 0
    let closestDist = Infinity
    for (let i = 0; i < fromPresets.length; i++) {
      const presetL = parseFloat(fromPresets[i].value.match(/oklch\(\s*([\d.]+)/)?.[1] ?? '0')
      const dist = Math.abs(presetL - lightness)
      if (dist < closestDist) {
        closestDist = dist
        closestIdx = i
      }
    }

    setCanvasBg(toPresets[closestIdx].value)
  }, [currentTheme, canvasBg])

  // Empty state — no projects yet
  if (manifests.length === 0) {
    return (
      <div id="bryllen-root" style={{
        ...cssVars,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: V.canvas,
        fontFamily: FONT,
      } as React.CSSProperties}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: S.lg,
          padding: S.xxl,
          background: V.card,
          border: `1px solid ${V.border}`,
          borderRadius: R.ui, cornerShape: 'squircle',
          maxWidth: 400,
          textAlign: 'center',
        } as React.CSSProperties}>
          <h2 style={{
            fontSize: T.ui,
            fontWeight: 600,
            color: V.txtPri,
            margin: 0,
            textWrap: 'pretty',
          } as React.CSSProperties}>
            Start a new project
          </h2>
          <p style={{
            fontSize: T.ui,
            color: V.txtSec,
            margin: 0,
            lineHeight: 1.5,
            textWrap: 'pretty',
          } as React.CSSProperties}>
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
    <div id="bryllen-root" style={{ ...cssVars, width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' } as React.CSSProperties}>
      <TopBar
        projects={manifests}
        activeProjectIndex={activeProjectIndex}
        onSelectProject={setActiveProjectIndex}
        annotationEndpoint={annotationEndpoint}
        commentCount={commentCount}
        onNewProject={() => setProjectDialogOpen(true)}
        shareUrl={activeProject?.shareUrl}
        projectName={activeProject?.project ?? ''}
        updateAvailable={updateInfo.available}
        onUpdateClick={() => setUpdateDialogOpen(true)}
        projectId={activeProject?.id}
      />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div style={{ flex: 1, backgroundColor: V.chrome, padding: `${E.insetTop}px ${E.inset}px ${E.inset}px` }}>
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
              pageKey={`${activeProject?.project ?? ''}-canvas`}
              onImagePaste={handleImagePaste}
              onCanvasClick={handleCanvasClick}
              hud={<>
                <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 5 }}>
                  <StatusFilter visibleStatuses={visibleStatuses} onToggle={toggleStatusVisibility} counts={statusCounts} />
                </div>
                <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 5, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <CanvasColorPicker activeColor={canvasBg} onSelect={setCanvasBg} />
                </div>
                <div style={{ position: 'absolute', bottom: 12, left: 12, zIndex: 5 }}>
                  <InfoButton />
                </div>
                <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', zIndex: 5 }}>
                  <ZoomControl />
                </div>
              </>}
            >
              {/* Render component frames */}
              {frames
                .filter(frame => visibleStatuses.has(frameStatuses[frame.id] || 'none'))
                .map(frame => (
                <Frame
                  key={frame.id}
                  id={frame.id}
                  title={frame.title}
                  x={frame.x}
                  y={frame.y}
                  width={frame.width}
                  height={frame.height}
                  onMove={handleFrameMove}
                  onDuplicate={handleFrameDuplicate}
                  onResize={handleResize}
                  status={frameStatuses[frame.id] || 'none'}
                  onStatusChange={handleFrameStatusChange}
                  selected={selectedFrameIds.has(frame.id)}
                  onSelect={handleFrameSelect}
                >
                  {'component' in frame && <frame.component {...(frame.props ?? {})} />}
                </Frame>
              ))}
              {/* Render pasted images */}
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
                      ['canvas']: (prev['canvas'] ?? []).map(ci =>
                        ci.id === id ? { ...ci, x: newX, y: newY } : ci
                      )
                    }))
                  }}
                >
                  <ContextImageContent
                    src={img.src}
                    title={img.title}
                    onDelete={() => {
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

      {import.meta.env.DEV && <AnnotationOverlay endpoint={annotationEndpoint} frames={[...frames, ...currentPageImages]} showToast={showToast} project={projectKey} projectId={activeProject?.id} />}
      {/* Comment overlay hidden for now */}
      {/* <CommentOverlay endpoint={annotationEndpoint} frames={frames} onCommentCountChange={setCommentCount} /> */}
      {import.meta.env.DEV && (
        <NewProjectDialog
          open={projectDialogOpen}
          onClose={() => setProjectDialogOpen(false)}
          onSubmit={handleNewProject}
        />
      )}

      {/* Prompt request dialog (from agent's /bryllen-new without prompt) */}
      {promptRequest && (
        <NewProjectDialog
          open={true}
          onClose={() => setPromptRequest(null)}
          onSubmit={handlePromptRequestSubmit}
          defaultName={promptRequest.projectName}
        />
      )}

      {/* Update dialog */}
      <UpdateDialog
        open={updateDialogOpen}
        onClose={() => setUpdateDialogOpen(false)}
        currentVersion={VERSION}
        latestVersion={updateInfo.latestVersion ?? ''}
      />

      {/* First-use onboarding tour */}
      {showTour && manifests.length > 0 && (
        <TourOverlay onComplete={() => setShowTour(false)} />
      )}

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  )
}
