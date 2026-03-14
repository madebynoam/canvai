import { useState, useEffect, useCallback, useRef, memo, useMemo } from 'react'
import { X, Star, Check, ChevronDown, StickyNote } from 'lucide-react'
import { Canvas } from './Canvas'
import { Frame } from './Frame'
import { useFrames } from './useFrames'
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
import { Sticky } from './Sticky'
import { ProgressPanel } from './ProgressPanel'
import { FrameErrorBoundary } from './FrameErrorBoundary'
import type { ProjectManifest, CanvasImageFrame, FrameStatus, CanvasFrame, CanvasSticky } from './types'

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

function stickiesVisibleKey(project: string) { return `bryllen:stickies-visible:${project}` }

function loadStickiesVisible(project: string): boolean {
  try {
    const saved = localStorage.getItem(stickiesVisibleKey(project))
    if (saved !== null) return saved !== 'false'
  } catch {}
  return true
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
  stickiesVisible: boolean
  onToggleStickies: () => void
  stickyCount: number
}

const STATUS_OPTIONS: Array<{ value: FrameStatus; label: string; icon: typeof Star; fill: string; stroke: string }> = [
  { value: 'none', label: 'None', icon: Star, fill: 'none', stroke: '#999' },
  { value: 'starred', label: 'Starred', icon: Star, fill: '#F59E0B', stroke: '#F59E0B' },
  { value: 'approved', label: 'Approved', icon: Check, fill: 'none', stroke: '#10B981' },
  { value: 'rejected', label: 'Rejected', icon: X, fill: 'none', stroke: '#EF4444' },
]

function StatusFilter({ visibleStatuses, onToggle, counts, stickiesVisible, onToggleStickies, stickyCount }: StatusFilterProps) {
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
                  borderRadius: R.ui, cornerShape: 'squircle',
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
          {/* Divider */}
          <div style={{ height: 1, background: V.border, margin: '4px 0' }} />
          {/* Notes toggle */}
          <label
            onClick={onToggleStickies}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 8px',
              borderRadius: R.ui, cornerShape: 'squircle',
              cursor: 'default',
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
                border: `1px solid ${stickiesVisible ? A.accent : V.border}`,
                background: stickiesVisible ? A.accent : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'background 0.1s, border-color 0.1s',
              }}
            >
              {stickiesVisible && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5L4 7L8 3" stroke={D.text} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <StickyNote size={14} strokeWidth={1.5} style={{ color: V.txtSec }} />
            <span style={{ flex: 1 }}>Notes</span>
            <span style={{ color: V.txtSec }}>({stickyCount})</span>
          </label>
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
  const [creatingProject, setCreatingProject] = useState<{ name: string; annotationId: string } | null>(null)
  const [panelAnnotationId, setPanelAnnotationId] = useState<string | null>(null)
  const [panelOpen, setPanelOpen] = useState(false)
  const panelCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showPanel = (id: string) => {
    if (panelCloseTimerRef.current) clearTimeout(panelCloseTimerRef.current)
    setPanelAnnotationId(id)
    setPanelOpen(true)
  }
  const closePanel = () => {
    setPanelOpen(false)
    if (panelCloseTimerRef.current) clearTimeout(panelCloseTimerRef.current)
    panelCloseTimerRef.current = setTimeout(() => setPanelAnnotationId(null), 420)
  }

  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)
  // Images stored per-page: { "pageName": CanvasImageFrame[] }
  const [pageImages, setPageImages] = useState<Record<string, CanvasImageFrame[]>>({})
  const [showTour, setShowTour] = useState(() => !isTourCompleted())
  // Pending prompt request from agent (when /bryllen-new is called without a prompt)
  const [promptRequest, setPromptRequest] = useState<{ id: string; projectName: string } | null>(null)
  // Update checker state
  const [updateInfo, setUpdateInfo] = useState<{ available: boolean; latestVersion: string | null }>({ available: false, latestVersion: null })
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateResult, setUpdateResult] = useState<{ claudeMdChanged: boolean; version: string } | null>(null)
  const [showReloadFallback, setShowReloadFallback] = useState(false)

  const showToast = useCallback((msg: string) => setToast(msg), [])

  // Show "Click to reload" fallback if auto-reload hasn't fired after 8s
  useEffect(() => {
    if (!isUpdating) { setShowReloadFallback(false); return }
    const timer = setTimeout(() => setShowReloadFallback(true), 8000)
    return () => clearTimeout(timer)
  }, [isUpdating])

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

  // Clear creating state once manifests appear (project was created, HMR picked it up)
  useEffect(() => {
    if (creatingProject && manifests.length > 0) {
      setCreatingProject(null)
    }
  }, [manifests.length, creatingProject])

  const handleNewProject = useCallback(async (payload: { name: string; description: string; prompt: string; images?: Array<{ id: string; dataUrl: string; filename: string }> }) => {
    try {
      // Upload inspiration images to context/canvas so they appear on the canvas
      if (payload.images && payload.images.length > 0) {
        for (const img of payload.images) {
          await fetch(`${annotationEndpoint}/context`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              project: payload.name,
              iteration: 'v1',
              page: 'canvas',
              dataUrl: img.dataUrl,
              filename: img.filename,
            }),
          })
        }
      }

      // Create project annotation (without images in payload)
      // Store in active project's db so the agent can find it with --project and the spinner shows
      const { images: _, ...projectPayload } = payload
      const projectParam = activeProject?.project ? `?projectId=${encodeURIComponent(activeProject.project)}` : ''
      const res = await fetch(`${annotationEndpoint}/annotations${projectParam}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'project', comment: JSON.stringify(projectPayload) }),
      })
      if (!res.ok) throw new Error('Failed to create annotation')
      const annotation = await res.json()
      setProjectDialogOpen(false)
      setCreatingProject({ name: payload.name, annotationId: String(annotation.id) })
    } catch {
      showToast('Failed to submit')
    }
  }, [annotationEndpoint, activeProject?.project])


  // Handle prompt request submission (from agent's /bryllen-new without prompt)
  const handlePromptRequestSubmit = useCallback(async (payload: { name: string; description: string; prompt: string; images?: Array<{ id: string; dataUrl: string; filename: string }> }) => {
    if (!promptRequest) return

    try {
      // Upload inspiration images to context/canvas so they appear on the canvas
      if (payload.images && payload.images.length > 0) {
        for (const img of payload.images) {
          await fetch(`${annotationEndpoint}/context`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              project: payload.name,
              iteration: 'v1',
              page: 'canvas',
              dataUrl: img.dataUrl,
              filename: img.filename,
            }),
          })
        }
      }

      // Create the actual project annotation with the prompt (without images)
      const { images: _, ...projectPayload } = payload
      const projectParam = activeProject?.project ? `?projectId=${encodeURIComponent(activeProject.project)}` : ''
      await fetch(`${annotationEndpoint}/annotations${projectParam}`, {
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

  // SSE listener for annotation events, sticky events, and update events
  // Reconnects when the active project changes so events are scoped correctly
  const activeProjectId = activeProject?.project ?? ''
  useEffect(() => {
    if (typeof window === 'undefined') return

    const params = new URLSearchParams()
    if (activeProjectId) params.set('projectId', activeProjectId)
    const source = new EventSource(`${annotationEndpoint}/annotations/events?${params}`)
    source.onmessage = async (e) => {
      try {
        const data = JSON.parse(e.data)
        if (data.type === 'update-started') {
          setIsUpdating(true)
          setUpdateDialogOpen(false)
          return
        }
        if (data.type === 'update-complete') {
          // New server is up — reload to pick up fresh code
          window.location.reload()
          return
        }
        if (data.type === 'sticky-created' || data.type === 'sticky-deleted') {
          const project = activeProjectNameRef.current
          if (project) {
            fetch(`${annotationEndpoint}/stickies?project=${encodeURIComponent(project)}`)
              .then(r => r.json())
              .then(d => setStickies(Array.isArray(d) ? d : []))
              .catch(() => {})
          }
          return
        }
        if (data.type === 'applied' && data.id) {
          showPanel(String(data.id))
        }
        if (data.type === 'prompt-requested' && data.id) {
          // Fetch the annotation to get the project name
          const pid = activeProjectId
          const fetchParams = new URLSearchParams()
          if (pid) fetchParams.set('projectId', pid)
          const res = await fetch(`${annotationEndpoint}/annotations?${fetchParams}`)
          const annotations = await res.json()
          const annotation = annotations.find((a: { id: string }) => String(a.id) === String(data.id))
          if (annotation) {
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
  }, [annotationEndpoint, activeProjectId])

  // Restore progress panel on refresh — if an annotation is still pending, show the panel
  useEffect(() => {
    if (!activeProject?.project) return
    const params = new URLSearchParams()
    params.set('projectId', activeProject.project)
    fetch(`${annotationEndpoint}/annotations?${params}`)
      .then(r => r.json())
      .then((annotations: Array<{ id: string; status: string }>) => {
        const pending = annotations.find(a => a.status === 'pending')
        if (pending) {
          if (panelCloseTimerRef.current) clearTimeout(panelCloseTimerRef.current)
          setPanelAnnotationId(String(pending.id))
          setPanelOpen(true)
        }
      })
      .catch(() => {})
  }, [activeProject?.project, annotationEndpoint])

  // Check for update result on mount — show toast + "Restart Claude Code" notice if needed
  useEffect(() => {
    fetch(`${annotationEndpoint}/update-result`)
      .then(r => r.json())
      .then(result => {
        if (result?.version) {
          showToast(`Updated to ${result.version}`)
          if (result.claudeMdChanged) {
            setUpdateResult({ claudeMdChanged: true, version: result.version })
          }
        }
      })
      .catch(() => {})
  }, [annotationEndpoint, showToast])

  // Sync URL when project changes
  useEffect(() => {
    if (activeProject?.project) {
      const newUrl = buildUrl(activeProject.project)
      if (window.location.pathname !== newUrl) {
        window.history.replaceState(null, '', newUrl)
      }
    }
  }, [activeProject?.project])

  // Preview mode: detect ?preview=<id> on mount
  const previewFrameId = useMemo(() => new URLSearchParams(window.location.search).get('preview'), [])

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

  // Stickies state
  const [stickies, setStickies] = useState<CanvasSticky[]>([])
  const [selectedStickyIds, setSelectedStickyIds] = useState<Set<string>>(new Set())
  const [stickiesVisible, setStickiesVisible] = useState<boolean>(() =>
    loadStickiesVisible(activeProject?.project ?? '')
  )

  // Reload stickiesVisible when project changes
  useEffect(() => {
    setStickiesVisible(loadStickiesVisible(activeProject?.project ?? ''))
  }, [activeProject?.project])

  // Persist stickiesVisible whenever it changes
  useEffect(() => {
    if (!activeProject?.project) return
    try {
      localStorage.setItem(stickiesVisibleKey(activeProject.project), String(stickiesVisible))
    } catch {}
  }, [stickiesVisible, activeProject?.project])

  // Load stickies when project changes
  useEffect(() => {
    if (!activeProject?.project) return
    fetch(`${annotationEndpoint}/stickies?project=${encodeURIComponent(activeProject.project)}`)
      .then(r => r.json())
      .then(data => setStickies(Array.isArray(data) ? data : []))
      .catch(() => setStickies([]))
  }, [activeProject?.project, annotationEndpoint])

  // Ref to track current project name for SSE handler (avoids stale closure)
  const activeProjectNameRef = useRef(activeProject?.project ?? '')
  useEffect(() => {
    activeProjectNameRef.current = activeProject?.project ?? ''
  }, [activeProject?.project])

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

  // Handle sticky selection (shift+click toggles)
  const handleStickySelect = useCallback((id: string, shiftKey: boolean) => {
    if (shiftKey) {
      setSelectedStickyIds(prev => {
        const next = new Set(prev)
        if (next.has(id)) { next.delete(id) } else { next.add(id) }
        return next
      })
    } else {
      setSelectedStickyIds(new Set([id]))
      setSelectedFrameIds(new Set()) // clear frame selection
    }
  }, [])

  // Clear selection when clicking canvas background
  const handleCanvasClick = useCallback(() => {
    setSelectedFrameIds(new Set())
    setSelectedStickyIds(new Set())
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

  const persistConfig = activeProject?.project
    ? { project: activeProject.project, page: 'canvas' }
    : undefined
  const { frames, addFrame, updateFrame, removeFrame, duplicateFrame, handleResize } = useFrames(
    activeProject?.grid,
    persistConfig,
    activeProject?.components,
  )

  // Duplicate from `...` menu: places copy to the right of the original
  const handleDuplicateFromMenu = useCallback((id: string) => {
    const source = frames.find(f => f.id === id)
    if (!source) return
    const newX = source.x + (source.width ?? 320) + 40
    duplicateFrame(source, newX, source.y)
  }, [frames, duplicateFrame])

  // Open frame in new tab (preview mode)
  const handleOpenInNewTab = useCallback((id: string) => {
    if (!activeProject?.project) return
    const url = `${buildUrl(activeProject.project)}?preview=${encodeURIComponent(id)}`
    window.open(url, '_blank')
  }, [activeProject?.project])

  // Option+drag: stamp a copy at the origin while the dragged frame moves away.
  // The copy is persisted at the origin; the dragged frame keeps moving.
  // The copy gets a new ID and component file (POSTed to server).
  const handleFrameDuplicate = useCallback((id: string, origX: number, origY: number): string => {
    const source = frames.find(f => f.id === id)
    if (!source) return id
    // Stamp a copy at origin; dragged frame keeps its ID
    duplicateFrame(source, origX, origY)
    return id
  }, [frames, duplicateFrame])

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

      if (e.key === 'Escape' && (selectedFrameIds.size > 0 || selectedStickyIds.size > 0)) {
        setSelectedFrameIds(new Set())
        setSelectedStickyIds(new Set())
        return
      }

      // Delete selected stickies with Backspace or Delete
      if ((e.key === 'Backspace' || e.key === 'Delete') && selectedStickyIds.size > 0) {
        e.preventDefault()
        const project = activeProjectNameRef.current
        for (const stickyId of selectedStickyIds) {
          fetch(`${annotationEndpoint}/stickies/${encodeURIComponent(stickyId)}?project=${encodeURIComponent(project)}`, {
            method: 'DELETE',
          }).catch(() => {})
        }
        setSelectedStickyIds(new Set())
        return
      }

      // Actions requiring frame selection
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
  }, [selectedFrameIds, selectedStickyIds, handleFrameStatusChange, removeFrame, annotationEndpoint])

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

  // Frames currently visible (pass status filter)
  const visibleFrames = useMemo(() =>
    frames.filter(f => visibleStatuses.has(frameStatuses[f.id] || 'none')),
    [frames, frameStatuses, visibleStatuses]
  )

  // Compute absolute positions for visible stickies
  const visibleStickyItems = useMemo(() => {
    if (!stickiesVisible) return []
    const visibleFrameIds = new Set(visibleFrames.map(f => f.id))
    return stickies
      .filter(s => visibleFrameIds.has(s.parentFrameId))
      .map(s => {
        const parent = frames.find(f => f.id === s.parentFrameId)
        if (!parent) return null
        return { sticky: s, x: parent.x + s.offsetX, y: parent.y + s.offsetY }
      })
      .filter((item): item is { sticky: CanvasSticky; x: number; y: number } => item !== null)
  }, [stickies, stickiesVisible, visibleFrames, frames])

  // Toggle notes visibility
  const toggleStickiesVisible = useCallback(() => {
    setStickiesVisible(prev => !prev)
  }, [])

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
      let bg = color || DEFAULT_CANVAS_COLOR
      // If stored color doesn't match current theme, map to equivalent preset
      const match = bg.match(/oklch\(\s*([\d.]+)/)
      if (match) {
        const lightness = parseFloat(match[1])
        const isLightColor = lightness > 0.5
        if ((currentTheme === 'dark' && isLightColor) || (currentTheme === 'light' && !isLightColor)) {
          const fromPresets = isLightColor ? lightPresets : darkPresets
          const toPresets = isLightColor ? darkPresets : lightPresets
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
          bg = toPresets[closestIdx].value
        }
      }
      setCanvasBg(bg)
      canvasBgLoadedRef.current = true
    })
  }, [projectKey, currentTheme])
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
        {creatingProject ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: S.lg,
            maxWidth: 320,
            textAlign: 'center',
          }}>
            {/* Spinner */}
            <div style={{
              width: 32,
              height: 32,
              border: `2.5px solid ${V.border}`,
              borderTopColor: V.txtPri,
              borderRadius: '50%',
              animation: 'bryllen-spin 0.8s linear infinite',
            }} />
            <style>{`@keyframes bryllen-spin { to { transform: rotate(360deg) } }`}</style>
            <h2 style={{
              fontSize: T.ui,
              fontWeight: 600,
              color: V.txtPri,
              margin: 0,
            }}>
              Creating {creatingProject.name}
            </h2>
            <p style={{
              fontSize: T.ui,
              color: V.txtSec,
              margin: 0,
              lineHeight: 1.5,
            }}>
              Waiting for Claude to set up the project...
            </p>
            <div style={{ width: 280, marginTop: S.md }}>
              <ProgressPanel
                annotationId={creatingProject.annotationId}
                endpoint={annotationEndpoint}
                project={creatingProject.name}
                projectId={creatingProject.name}
                onDismiss={() => {}}
              />
            </div>
          </div>
        ) : (
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
        )}
        <NewProjectDialog
          open={projectDialogOpen}
          onClose={() => setProjectDialogOpen(false)}
          onSubmit={handleNewProject}
        />
        {toast && <Toast message={toast} onDone={() => setToast(null)} />}
      </div>
    )
  }

  // Preview mode: render frame in isolation (after all hooks)
  if (previewFrameId) {
    const previewFrame = frames.find(f => f.id === previewFrameId)
    if (!previewFrame) return <div>Loading…</div>

    const isWide = (previewFrame.width ?? 0) >= 1200
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: isWide ? 'flex-start' : 'center',
        justifyContent: isWide ? 'flex-start' : 'center',
        background: isWide ? 'transparent' : 'oklch(94% 0.003 80)',
        overflow: 'auto',
      }}>
        {'component' in previewFrame && (
          <previewFrame.component {...(previewFrame.props ?? {})} />
        )}
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
        projectId={activeProject?.project}
      />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', backgroundColor: V.chrome }}>
        <div style={{ flex: 1, padding: `${E.insetTop}px ${E.inset}px ${E.inset}px` }}>
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
                  <StatusFilter
                    visibleStatuses={visibleStatuses}
                    onToggle={toggleStatusVisibility}
                    counts={statusCounts}
                    stickiesVisible={stickiesVisible}
                    onToggleStickies={toggleStickiesVisible}
                    stickyCount={stickies.length}
                  />
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
              {visibleFrames.map(frame => (
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
                  onDelete={removeFrame}
                  onDuplicateClick={handleDuplicateFromMenu}
                  onOpenInNewTab={handleOpenInNewTab}
                >
                  <FrameErrorBoundary frameId={frame.id} title={frame.title}>
                    {'component' in frame && <frame.component {...(frame.props ?? {})} />}
                  </FrameErrorBoundary>
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
              {/* Render sticky notes */}
              {visibleStickyItems.map(({ sticky, x, y }) => (
                <Sticky
                  key={sticky.id}
                  sticky={sticky}
                  x={x}
                  y={y}
                  zoom={1}
                  selected={selectedStickyIds.has(sticky.id)}
                  onSelect={handleStickySelect}
                />
              ))}
            </Canvas>
          </div>
        </div>

        {/* ── Progress panel slot — slides in beside canvas ── */}
        <div
          style={{
            flexShrink: 0,
            width: panelOpen ? 248 : 0,
            overflow: 'hidden',
            transition: `width 380ms ${panelOpen ? 'cubic-bezier(0.32, 0.72, 0, 1)' : 'cubic-bezier(0.25, 0.1, 0.25, 1)'}`,
          }}
        >
          <div
            style={{
              width: 248,
              height: '100%',
              padding: `${E.insetTop}px ${E.inset}px ${E.inset}px 0`,
              boxSizing: 'border-box',
            }}
          >
            {panelAnnotationId && (
              <ProgressPanel
                annotationId={panelAnnotationId}
                endpoint={annotationEndpoint}
                project={activeProject?.project}
                projectId={activeProject?.project}
                onDismiss={closePanel}
              />
            )}
          </div>
        </div>
      </div>

      {import.meta.env.DEV && <AnnotationOverlay endpoint={annotationEndpoint} frames={[...frames, ...currentPageImages]} showToast={showToast} project={projectKey} projectId={activeProject?.project} />}
      {/* Comment overlay hidden for now */}
      {/* <CommentOverlay endpoint={annotationEndpoint} frames={frames} onCommentCountChange={setCommentCount} /> */}
      <NewProjectDialog
        open={projectDialogOpen}
        onClose={() => setProjectDialogOpen(false)}
        onSubmit={handleNewProject}
      />

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
        endpoint={annotationEndpoint}
      />

      {/* Full-screen updating overlay — shown while update is running */}
      {isUpdating && (
        <>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
          background: 'oklch(0.1 0.005 250 / 0.85)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: S.md,
          fontFamily: FONT,
        }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: R.pill,
            background: 'oklch(0.55 0.14 250)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: D.text,
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          </div>
          <div style={{ fontSize: T.ui, fontWeight: 600, color: D.text }}>Updating Bryllen...</div>
          <div style={{ fontSize: 12, color: 'oklch(0.65 0 0)' }}>
            {showReloadFallback
              ? <span
                  onClick={() => window.location.reload()}
                  style={{ textDecoration: 'underline', cursor: 'default', color: 'oklch(0.75 0.1 250)' }}
                >
                  Click to reload
                </span>
              : 'The canvas will reload automatically'
            }
          </div>
        </div>
        </>
      )}

      {/* "Restart Claude Code" notice — shown after update if CLAUDE.md changed */}
      {updateResult?.claudeMdChanged && (
        <div style={{
          position: 'fixed',
          bottom: S.xxl,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 99998,
          display: 'flex',
          alignItems: 'center',
          gap: S.sm,
          padding: `${S.sm}px ${S.md}px`,
          background: V.card,
          border: `1px solid ${V.border}`,
          borderRadius: R.pill,
          boxShadow: V.shadow,
          fontFamily: FONT,
          fontSize: T.ui,
          color: V.txtPri,
          whiteSpace: 'nowrap',
        }}>
          <span>Restart Claude Code to get the latest agent instructions</span>
          <button
            onClick={() => setUpdateResult(null)}
            style={{
              width: 20,
              height: 20,
              border: 'none',
              borderRadius: R.pill,
              background: V.active,
              color: V.txtSec,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'default',
              flexShrink: 0,
            }}
          >
            <X size={12} strokeWidth={2} />
          </button>
        </div>
      )}

      {/* First-use onboarding tour */}
      {showTour && manifests.length > 0 && (
        <TourOverlay onComplete={() => setShowTour(false)} />
      )}

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  )
}
