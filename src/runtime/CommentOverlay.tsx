import { useState, useRef, useCallback, useEffect } from 'react'
import { MessageSquare, X, Check, Send, MoreHorizontal, Pencil, Trash2, Copy, Github } from 'lucide-react'
import { N, A, F, S, R, T, ICON, FONT } from './tokens'
import { MenuPanel, MenuRow } from './Menu'
import type { CanvasFrame } from './types'
import type { CommentThread, CommentMessage, CommentAuthor, CommentPin } from './comment-types'
import {
  getStoredUser,
  initiateDeviceFlow,
  pollForToken,
  fetchThreads,
  createThread,
  addReply,
  resolveThread,
  deleteThread,
} from './github-client'

// ── Types ────────────────────────────────────────────────────────────────────

type OverlayMode = 'idle' | 'targeting' | 'composing' | 'viewing'
type AuthPhase = 'idle' | 'signing-in' | 'code' | 'done'

interface TargetInfo {
  frameId: string
  componentName: string
  selector: string
  elementTag: string
  elementText: string
  computedStyles: Record<string, string>
  rect: DOMRect
}

interface CommentOverlayProps {
  endpoint: string
  frames: CanvasFrame[]
  /** GitHub repo in "owner/repo" format. Auto-detected from server in dev, or from manifest. */
  repo?: string
  onCommentCountChange?: (count: number) => void
}

// ── Helpers: selector + styles ───────────────────────────────────────────────

function buildSelector(el: Element, boundary: Element): string {
  const parts: string[] = []
  let current: Element | null = el
  while (current && current !== boundary) {
    const tag = current.tagName.toLowerCase()
    const parent = current.parentElement
    if (parent) {
      const siblings = Array.from(parent.children).filter(c => c.tagName === current!.tagName)
      if (siblings.length > 1) {
        const index = siblings.indexOf(current) + 1
        parts.unshift(`${tag}:nth-of-type(${index})`)
      } else {
        parts.unshift(tag)
      }
    } else {
      parts.unshift(tag)
    }
    current = parent
  }
  return parts.join(' > ')
}

function getStyleSubset(el: Element): Record<string, string> {
  const computed = window.getComputedStyle(el)
  const keys = ['color', 'backgroundColor', 'fontSize', 'fontWeight', 'fontFamily', 'padding', 'borderRadius']
  const styles: Record<string, string> = {}
  for (const k of keys) {
    const v = computed.getPropertyValue(k.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`))
    if (v && v !== 'none' && v !== 'normal' && v !== '0px') styles[k] = v
  }
  return styles
}

// ── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({ name, size = 28 }: { name: string; size?: number }) {
  const letter = name.charAt(0).toUpperCase()
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      backgroundColor: F.marker, color: 'oklch(1 0 0)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.4, fontWeight: 600, fontFamily: FONT,
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
    }}>
      {letter}
    </div>
  )
}

// ── HoverButton ───────────────────────────────────────────────────────────────

function HoverButton({ children, onClick, title, style }: {
  children: React.ReactNode
  onClick?: () => void
  title?: string
  style?: React.CSSProperties
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick} title={title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 24, height: 24, borderRadius: R.control, border: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: N.txtTer, backgroundColor: hovered ? 'rgba(0,0,0,0.06)' : 'transparent',
        cursor: 'default', fontFamily: FONT,
        ...style,
      }}
    >
      {children}
    </button>
  )
}

// ── ContextMenu ───────────────────────────────────────────────────────────────

interface DropdownItem {
  label: string
  icon: React.ReactNode
  accent?: boolean
  destructive?: boolean
  separator?: boolean
  onClick?: () => void
}

function ContextMenu({ items, onClose }: {
  items: DropdownItem[]
  onClose: () => void
}) {
  return (
    <MenuPanel
      width={208}
      align="right"
      zIndex={100000}
      backdrop
      onBackdropClick={onClose}
    >
      {items.map(item => (
        <MenuRow
          key={item.label}
          icon={item.icon}
          destructive={item.destructive}
          accent={item.accent}
          separator={item.separator}
          onClick={() => { item.onClick?.(); onClose() }}
          style={{
            padding: `${S.sm}px ${S.md}px`,
            fontSize: T.title,
            gap: S.sm,
          }}
        >
          {item.label}
        </MenuRow>
      ))}
    </MenuPanel>
  )
}

// ── ThreadMessage ─────────────────────────────────────────────────────────────

const QUICK_REACTIONS = ['👍', '🤔', '🔥']

function ThreadMessage({ message, menuItems, onReact }: {
  message: CommentMessage
  menuItems: DropdownItem[]
  onReact?: (emoji: string) => void
}) {
  const [hovered, setHovered] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const timeAgo = formatTimeAgo(message.createdAt)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setMenuOpen(false) }}
      style={{
        display: 'flex', gap: S.sm, alignItems: 'flex-start',
        padding: S.xs, margin: -S.xs, borderRadius: R.card,
        backgroundColor: hovered ? 'rgba(0,0,0,0.02)' : 'transparent',
      }}
    >
      <Avatar name={message.author.login} size={28} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: S.sm, marginBottom: 2 }}>
          <span style={{ fontSize: T.title, fontWeight: 600, color: N.txtPri }}>{message.author.name ?? message.author.login}</span>
          <span style={{ fontSize: T.caption, color: N.txtTer }}>{timeAgo}</span>
          <div style={{ flex: 1 }} />
          <div style={{
            opacity: hovered || menuOpen ? 1 : 0,
            display: 'flex', alignItems: 'center', gap: 2,
          }}>
            {QUICK_REACTIONS.map(emoji => (
              <HoverButton
                key={emoji}
                title={emoji}
                onClick={() => onReact?.(emoji)}
                style={{ width: 20, height: 20, fontSize: T.caption }}
              >
                {emoji}
              </HoverButton>
            ))}
            {menuItems.length > 0 && (
              <div style={{ position: 'relative' }}>
                <HoverButton onClick={() => setMenuOpen(o => !o)} title="More actions">
                  <MoreHorizontal size={ICON.lg} strokeWidth={1.5} />
                </HoverButton>
                {menuOpen && (
                  <ContextMenu
                    items={menuItems}
                    onClose={() => setMenuOpen(false)}
                  />
                )}
              </div>
            )}
          </div>
        </div>
        <div style={{ fontSize: T.title, color: N.txtPri, lineHeight: 1.5, textWrap: 'pretty' } as React.CSSProperties}>
          {message.body}
        </div>
        {message.reactions.length > 0 && (
          <div style={{ display: 'flex', gap: S.xs, marginTop: S.xs }}>
            {message.reactions.map(r => (
              <button
                key={r.emoji}
                onClick={() => onReact?.(r.emoji)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: S.xs,
                  padding: `2px ${S.sm}px`, borderRadius: R.panel,
                  border: `1px solid ${r.viewerHasReacted ? A.accent : N.border}`,
                  backgroundColor: r.viewerHasReacted ? A.muted : N.card,
                  fontSize: T.caption, color: r.viewerHasReacted ? A.accent : N.txtSec,
                  fontWeight: 500, fontFamily: FONT, cursor: 'default',
                }}
              >
                {r.emoji} {r.count}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function formatTimeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'just now'
  if (min < 60) return `${min}m ago`
  const h = Math.floor(min / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  return `${d}d ago`
}

// ── AvatarPin ─────────────────────────────────────────────────────────────────

function AvatarPin({ pin, onClick }: {
  pin: CommentPin & { rect: DOMRect }
  onClick: () => void
}) {
  const isResolved = pin.status === 'resolved'

  return (
    <div
      onClick={onClick}
      title={`${pin.author.login}${pin.replyCount > 0 ? ` · ${pin.replyCount} ${pin.replyCount === 1 ? 'reply' : 'replies'}` : ''}`}
      style={{
        position: 'fixed',
        left: pin.rect.left - S.sm,
        top: pin.rect.top - S.sm,
        zIndex: 99997,
        cursor: 'default',
        userSelect: 'none',
        opacity: isResolved ? 0.5 : 1,
      }}
    >
      {isResolved ? (
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          backgroundColor: F.resolved,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 1px 2px rgba(0,0,0,0.12)',
        }}>
          <Check size={ICON.md} strokeWidth={2} color="oklch(1 0 0)" />
        </div>
      ) : (
        <div style={{ position: 'relative' }}>
          <Avatar name={pin.author.login} size={28} />
          {/* Reply count badge */}
          {pin.replyCount > 0 && (
            <div style={{
              position: 'absolute', top: -4, right: -8,
              minWidth: S.lg, height: S.lg, borderRadius: R.card,
              backgroundColor: A.accent, color: 'oklch(1 0 0)',
              fontSize: 9, fontWeight: 700, fontFamily: FONT,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: `0 ${S.xs}px`, border: `2px solid rgba(0,0,0,0)`,
              boxSizing: 'border-box',
            }}>
              {pin.replyCount}
            </div>
          )}
          {/* Annotation dot */}
          {pin.hasAnnotation && (
            <div style={{
              position: 'absolute', bottom: -2, right: -2,
              width: 10, height: 10, borderRadius: '50%',
              backgroundColor: A.accent, border: `2px solid rgba(0,0,0,0)`,
            }} />
          )}
        </div>
      )}
    </div>
  )
}

// ── Auth card ─────────────────────────────────────────────────────────────────

function AuthCard({ onClose, onSuccess }: {
  onClose: () => void
  onSuccess: (user: CommentAuthor) => void
}) {
  const [phase, setPhase] = useState<AuthPhase>('signing-in')
  const [userCode, setUserCode] = useState('')
  const [deviceCode, setDeviceCode] = useState('')
  const [pollInterval, setPollInterval] = useState(5)
  const [error, setError] = useState<string | null>(null)
  const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const startDeviceFlow = useCallback(async () => {
    setError(null)
    try {
      const flow = await initiateDeviceFlow()
      setUserCode(flow.user_code)
      setDeviceCode(flow.device_code)
      setPollInterval(flow.interval)
      setPhase('code')

      // Copy code to clipboard
      navigator.clipboard.writeText(flow.user_code).catch(() => {})
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start sign-in')
    }
  }, [])

  // Poll for token once in 'code' phase
  useEffect(() => {
    if (phase !== 'code' || !deviceCode) return

    const doPoll = async () => {
      const result = await pollForToken(deviceCode)
      if (result.status === 'success') {
        setPhase('done')
        onSuccess(result.user)
        return
      }
      if (result.status === 'expired') {
        setPhase('signing-in')
        setError('Code expired. Please try again.')
        return
      }
      if (result.status === 'error') {
        setError(result.error)
        return
      }
      // 'pending' or 'slow_down' — keep polling
      const interval = result.status === 'slow_down' ? result.interval * 1000 : pollInterval * 1000
      pollRef.current = setTimeout(doPoll, interval)
    }

    pollRef.current = setTimeout(doPoll, pollInterval * 1000)
    return () => { if (pollRef.current) clearTimeout(pollRef.current) }
  }, [phase, deviceCode, pollInterval, onSuccess])

  const MONO = 'SF Mono, Monaco, Inconsolata, monospace'

  return (
    <div style={{
      width: 260, backgroundColor: N.card, borderRadius: R.panel, padding: S.lg,
      border: `1px solid ${N.border}`,
      boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: S.md,
      fontFamily: FONT,
    }}>
      {/* Header */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
        <HoverButton onClick={onClose} title="Cancel">
          <X size={ICON.sm} strokeWidth={1.5} />
        </HoverButton>
      </div>

      {phase === 'signing-in' && (
        <>
          <Github size={24} strokeWidth={1.5} color={N.txtPri} />
          <div style={{ fontSize: T.title, fontWeight: 600, color: N.txtPri, textAlign: 'center' }}>
            Sign in with GitHub
          </div>
          <div style={{ fontSize: T.body, color: N.txtSec, textAlign: 'center', lineHeight: 1.5, textWrap: 'pretty' } as React.CSSProperties}>
            Comments are backed by GitHub Issues. Sign in to post and reply.
          </div>
          {error && (
            <div style={{ fontSize: T.caption, color: F.danger, textAlign: 'center' }}>{error}</div>
          )}
          <button
            onClick={startDeviceFlow}
            style={{
              width: '100%', padding: `${S.sm}px ${S.lg}px`, borderRadius: R.card, border: 'none',
              backgroundColor: N.txtPri, color: 'oklch(1 0 0)',
              fontSize: T.title, fontWeight: 500, fontFamily: FONT, cursor: 'default',
            }}
          >
            Continue with GitHub
          </button>
        </>
      )}

      {phase === 'code' && (
        <>
          <div style={{ fontSize: T.body, color: N.txtSec, textAlign: 'center', lineHeight: 1.5, textWrap: 'pretty' } as React.CSSProperties}>
            Enter this code at{' '}
            <a
              href="https://github.com/login/device"
              target="_blank"
              rel="noreferrer"
              style={{ fontWeight: 600, color: N.txtPri, textDecoration: 'none' }}
            >
              github.com/login/device
            </a>
          </div>
          <div style={{
            padding: `${S.md}px ${S.xxl}px`, borderRadius: R.card,
            backgroundColor: N.canvas, border: `1px solid ${N.border}`,
            fontFamily: MONO, fontSize: 20, fontWeight: 700, color: N.txtPri,
            letterSpacing: '0.1em', textAlign: 'center',
          }}>
            {userCode}
          </div>
          <div style={{ fontSize: T.caption, color: N.txtTer, textAlign: 'center' }}>
            Waiting for authorization…
          </div>
        </>
      )}

      {phase === 'done' && (
        <div style={{ fontSize: T.body, color: F.success, textAlign: 'center', fontWeight: 500 }}>
          <Check size={ICON.lg} strokeWidth={2} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: S.xs }} />
          Signed in!
        </div>
      )}
    </div>
  )
}

// ── CommentOverlay ─────────────────────────────────────────────────────────────

export function CommentOverlay({ endpoint, frames, repo: repoProp, onCommentCountChange }: CommentOverlayProps) {
  const isDev = import.meta.env.DEV
  const [mode, setMode] = useState<OverlayMode>('idle')
  const [highlight, setHighlight] = useState<DOMRect | null>(null)
  const [target, setTarget] = useState<TargetInfo | null>(null)
  const [threads, setThreads] = useState<CommentThread[]>([])
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [commentText, setCommentText] = useState('')
  const [user, setUser] = useState<CommentAuthor | null>(null)
  const [repo, setRepo] = useState<string | null>(repoProp ?? null)
  const [showAuthCard, setShowAuthCard] = useState(false)
  const [buttonState, setButtonState] = useState<'idle' | 'hover' | 'pressed'>('idle')
  const [toast, setToast] = useState<string | null>(null)
  const [pinRects, setPinRects] = useState<Map<string, DOMRect>>(new Map())
  const [posting, setPosting] = useState(false)
  const [loadingThreads, setLoadingThreads] = useState(false)
  const [threadMenuOpen, setThreadMenuOpen] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const activeThread = threads.find(t => t.id === activeThreadId) ?? null

  // ── Restore auth state ──────────────────────────────────────────────────

  useEffect(() => {
    const storedUser = getStoredUser()
    if (storedUser) setUser(storedUser)

    // In dev mode, fetch user from server
    if (isDev) {
      fetch(`${endpoint}/auth/user`)
        .then(r => r.ok ? r.json() : null)
        .then(u => { if (u) setUser(u) })
        .catch(() => {})

      // Fetch repo from server
      fetch(`${endpoint}/comments`)
        .catch(() => {})
    }
  }, [endpoint, isDev])

  // ── Detect repo (dev mode: ask server; prod: parse current URL) ──────────

  useEffect(() => {
    if (repoProp) { setRepo(repoProp); return }
    if (isDev) {
      // The server knows the repo via git remote detection
      // We'll pass it through the comments API response header or just store it
      // For now, skip — the server handles repo detection internally
    } else {
      // On GitHub Pages, derive repo from the URL: owner.github.io/repo or custom domain
      // User can override via VITE_CANVAI_REPO env var
      const envRepo = (import.meta as Record<string, unknown> & { env: Record<string, string> }).env?.VITE_CANVAI_REPO
      if (envRepo) setRepo(envRepo)
    }
  }, [repoProp, isDev])

  // ── Load threads ─────────────────────────────────────────────────────────

  const loadThreads = useCallback(async () => {
    setLoadingThreads(true)
    try {
      let loaded: CommentThread[]
      if (isDev) {
        const res = await fetch(`${endpoint}/comments`)
        if (res.ok) loaded = await res.json()
        else loaded = []
      } else if (repo) {
        loaded = await fetchThreads(repo)
      } else {
        loaded = []
      }
      setThreads(loaded)
    } catch {
      // Silent fail — threads stay empty
    } finally {
      setLoadingThreads(false)
    }
  }, [endpoint, isDev, repo])

  useEffect(() => {
    loadThreads()
  }, [loadThreads])

  // ── Pin rects via rAF ─────────────────────────────────────────────────────

  useEffect(() => {
    if (threads.length === 0) return
    let rafId = 0
    function updateRects() {
      const rects = new Map<string, DOMRect>()
      for (const thread of threads) {
        if (!thread.selector || !thread.frameId) continue
        const frameEl = document.querySelector(`[data-frame-id="${thread.frameId}"]`)
        if (!frameEl) continue
        const contentEl = frameEl.hasAttribute('data-frame-content') ? frameEl : frameEl.querySelector('[data-frame-content]')
        if (!contentEl) continue
        try {
          const el = contentEl.querySelector(thread.selector) ?? contentEl
          rects.set(thread.id, el.getBoundingClientRect())
        } catch { /* selector may not match */ }
      }
      setPinRects(rects)
      rafId = requestAnimationFrame(updateRects)
    }
    rafId = requestAnimationFrame(updateRects)
    return () => cancelAnimationFrame(rafId)
  }, [threads])

  // ── Notify parent of open comment count ──────────────────────────────────

  useEffect(() => {
    const openCount = threads.filter(t => t.status === 'open').length
    onCommentCountChange?.(openCount)
  }, [threads, onCommentCountChange])

  // ── Toast ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2000)
    return () => clearTimeout(t)
  }, [toast])

  // ── SSE for real-time comment updates (dev mode) ──────────────────────────

  useEffect(() => {
    if (!isDev) return
    const source = new EventSource(`${endpoint}/comments/events`)
    source.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data)
        if (data.type === 'comment-created' && data.thread) {
          setThreads(prev => {
            const exists = prev.some(t => t.id === data.thread.id)
            return exists ? prev : [...prev, data.thread]
          })
        } else if (data.type === 'reply-added' && data.threadId && data.message) {
          setThreads(prev => prev.map(t =>
            t.id === data.threadId
              ? { ...t, messages: [...t.messages, data.message] }
              : t
          ))
        } else if (data.type === 'comment-resolved' && data.threadId) {
          setThreads(prev => prev.map(t =>
            t.id === data.threadId ? { ...t, status: 'resolved' } : t
          ))
        } else if (data.type === 'comment-reopened' && data.threadId) {
          setThreads(prev => prev.map(t =>
            t.id === data.threadId ? { ...t, status: 'open' } : t
          ))
        }
      } catch { /* ignore parse errors */ }
    }
    return () => source.close()
  }, [endpoint, isDev])

  // ── Deep link: ?comment={id} ──────────────────────────────────────────────

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const commentId = params.get('comment')
    if (commentId && threads.length > 0) {
      const thread = threads.find(t => t.id === commentId)
      if (thread) {
        setActiveThreadId(commentId)
        setMode('viewing')
      }
    }
  }, [threads])

  // ── Focus textarea when entering compose ─────────────────────────────────

  useEffect(() => {
    if (mode === 'composing' && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [mode])

  // ── Global Escape ─────────────────────────────────────────────────────────

  useEffect(() => {
    if (mode === 'idle') return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setMode('idle')
        setTarget(null)
        setHighlight(null)
        setActiveThreadId(null)
        setCommentText('')
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [mode])

  // ── Targeting ─────────────────────────────────────────────────────────────

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (mode !== 'targeting') return
    const overlay = overlayRef.current
    if (!overlay) return
    overlay.style.pointerEvents = 'none'
    const el = document.elementFromPoint(e.clientX, e.clientY)
    overlay.style.pointerEvents = 'auto'
    if (!el || !el.closest('[data-frame-id]')) { setHighlight(null); return }
    setHighlight(el.getBoundingClientRect())
  }, [mode])

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (mode !== 'targeting') return
    const overlay = overlayRef.current
    if (!overlay) return
    overlay.style.pointerEvents = 'none'
    const el = document.elementFromPoint(e.clientX, e.clientY)
    overlay.style.pointerEvents = 'auto'
    if (!el) return
    const frameEl = el.closest('[data-frame-id]')
    if (!frameEl) return

    const frameId = frameEl.getAttribute('data-frame-id') ?? ''
    const frame = frames.find(f => f.id === frameId)
    const componentName = frame?.component?.displayName ?? frame?.component?.name ?? 'Unknown'
    const boundary = frameEl.hasAttribute('data-frame-content') ? frameEl : frameEl.querySelector('[data-frame-content]')
    const selector = boundary ? buildSelector(el, boundary) : el.tagName.toLowerCase()

    setTarget({
      frameId,
      componentName,
      selector,
      elementTag: el.tagName.toLowerCase(),
      elementText: (el.textContent ?? '').trim().slice(0, 100),
      computedStyles: getStyleSubset(el),
      rect: el.getBoundingClientRect(),
    })
    setHighlight(null)
    setCommentText('')
    setMode('composing')
  }, [mode, frames])

  // ── Post comment ──────────────────────────────────────────────────────────

  const handlePost = useCallback(async () => {
    if (!target || !commentText.trim() || !user || posting) return
    setPosting(true)
    try {
      let thread: CommentThread
      if (isDev) {
        const res = await fetch(`${endpoint}/comments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            frameId: target.frameId,
            componentName: target.componentName,
            selector: target.selector,
            elementTag: target.elementTag,
            elementText: target.elementText,
            computedStyles: target.computedStyles,
            comment: commentText.trim(),
          }),
        })
        if (!res.ok) throw new Error(`Server error: ${res.status}`)
        thread = await res.json()
      } else if (repo) {
        thread = await createThread(repo, {
          frameId: target.frameId,
          componentName: target.componentName,
          selector: target.selector,
          elementTag: target.elementTag,
          elementText: target.elementText,
          computedStyles: target.computedStyles,
          comment: commentText.trim(),
        })
      } else {
        throw new Error('No GitHub repo configured')
      }

      // SSE will add it in dev; for prod, add manually
      if (!isDev) {
        setThreads(prev => [...prev, thread])
      }
      setMode('idle')
      setTarget(null)
      setCommentText('')
      setToast('Comment posted')
    } catch (err) {
      setToast(err instanceof Error ? err.message : 'Failed to post')
    } finally {
      setPosting(false)
    }
  }, [target, commentText, user, posting, isDev, endpoint, repo])

  // ── Reply ─────────────────────────────────────────────────────────────────

  const handleReply = useCallback(async () => {
    if (!activeThread || !replyText.trim() || !user) return
    const text = replyText.trim()
    setReplyText('')
    try {
      let message: CommentMessage
      if (isDev) {
        const res = await fetch(`${endpoint}/comments/${activeThread.ghIssueNumber}/replies`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ body: text }),
        })
        if (!res.ok) throw new Error(`Server error: ${res.status}`)
        message = await res.json()
      } else if (repo) {
        message = await addReply(repo, activeThread.ghIssueNumber, text)
      } else {
        throw new Error('No GitHub repo configured')
      }

      // Optimistic update (SSE handles it in dev, but add manually for both)
      setThreads(prev => prev.map(t =>
        t.id === activeThread.id
          ? { ...t, messages: [...t.messages, message] }
          : t
      ))
    } catch {
      setToast('Failed to send reply')
      setReplyText(text)  // restore text on failure
    }
  }, [activeThread, replyText, user, isDev, endpoint, repo])

  // ── Resolve ───────────────────────────────────────────────────────────────

  const handleResolve = useCallback(async () => {
    if (!activeThread) return
    try {
      if (isDev) {
        await fetch(`${endpoint}/comments/${activeThread.ghIssueNumber}/resolve`, { method: 'POST' })
      } else if (repo) {
        await resolveThread(repo, activeThread.ghIssueNumber)
      }
      setThreads(prev => prev.map(t =>
        t.id === activeThread.id ? { ...t, status: 'resolved' } : t
      ))
      setMode('idle')
      setActiveThreadId(null)
      setToast('Thread resolved')
    } catch {
      setToast('Failed to resolve')
    }
  }, [activeThread, isDev, endpoint, repo])

  // ── Delete thread ─────────────────────────────────────────────────────────

  const handleDeleteThread = useCallback(async () => {
    if (!activeThread) return
    try {
      if (isDev) {
        await fetch(`${endpoint}/comments/${activeThread.ghIssueNumber}`, { method: 'DELETE' })
      } else if (repo) {
        await deleteThread(repo, activeThread.ghIssueNumber)
      }
      setThreads(prev => prev.filter(t => t.id !== activeThread.id))
      setMode('idle')
      setActiveThreadId(null)
      setToast('Thread deleted')
    } catch {
      setToast('Failed to delete')
    }
  }, [activeThread, isDev, endpoint, repo])

  // ── React to message ──────────────────────────────────────────────────────

  const handleReact = useCallback(async (message: CommentMessage, emoji: string) => {
    if (!activeThread || !message.ghCommentId) return  // only replies have ghCommentId
    const existing = message.reactions.find(r => r.emoji === emoji)
    const isRemoving = existing?.viewerHasReacted

    // Optimistic update
    setThreads(prev => prev.map(t => {
      if (t.id !== activeThread.id) return t
      return {
        ...t,
        messages: t.messages.map(m => {
          if (m.id !== message.id) return m
          const reactions = [...m.reactions]
          const idx = reactions.findIndex(r => r.emoji === emoji)
          if (isRemoving) {
            if (idx === -1) return m
            const r = reactions[idx]
            if (r.count <= 1) reactions.splice(idx, 1)
            else reactions[idx] = { ...r, count: r.count - 1, viewerHasReacted: false }
          } else {
            if (idx === -1) reactions.push({ emoji, count: 1, viewerHasReacted: true })
            else reactions[idx] = { ...reactions[idx], count: reactions[idx].count + 1, viewerHasReacted: true }
          }
          return { ...m, reactions }
        }),
      }
    }))

    try {
      if (isDev) {
        await fetch(
          `${endpoint}/comments/${activeThread.ghIssueNumber}/messages/${message.id}/reactions`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              emoji,
              remove: isRemoving,
              reactionId: existing?.reactionIds?.[0],
            }),
          }
        )
      }
      // On GitHub Pages: reactions on comments require authenticated calls — no proxy
      // For now, reactions are optimistic-only on static builds (no server to proxy)
    } catch {
      // Revert optimistic update on failure by re-fetching the thread
    }
  }, [activeThread, isDev, endpoint])

  // ── Copy link ─────────────────────────────────────────────────────────────

  const handleCopyLink = useCallback(() => {
    if (!activeThread) return
    const url = new URL(window.location.href)
    url.searchParams.set('comment', activeThread.id)
    navigator.clipboard.writeText(url.toString()).catch(() => {})
    setToast('Link copied')
  }, [activeThread])

  // ── FAB button click ──────────────────────────────────────────────────────

  const handleFabClick = useCallback(() => {
    if (mode === 'targeting') {
      setMode('idle')
      setHighlight(null)
      return
    }
    if (!user) {
      setShowAuthCard(true)
      return
    }
    setMode('targeting')
  }, [mode, user])

  const cardVisible = mode === 'composing' && target !== null
  const threadVisible = mode === 'viewing' && activeThread !== null

  // ── Compose card position ─────────────────────────────────────────────────

  const getComposeCardPos = () => {
    if (!target) return { top: S.lg, left: S.lg }
    const cardWidth = 300
    const cardHeight = 200
    let top = target.rect.bottom + S.sm
    let left = target.rect.left
    if (top + cardHeight > window.innerHeight) top = target.rect.top - cardHeight - S.sm
    if (left + cardWidth > window.innerWidth - S.lg) left = window.innerWidth - cardWidth - S.lg
    if (left < S.lg) left = S.lg
    if (top < S.lg) top = S.lg
    return { top, left }
  }

  // ── Thread card position ──────────────────────────────────────────────────

  const getThreadCardPos = () => {
    if (!activeThread) return { top: '50%', left: '50%' }
    const rect = pinRects.get(activeThread.id)
    if (!rect) return { top: 80, right: S.lg }
    const cardWidth = 360
    const cardHeight = 500
    let top = rect.bottom + S.sm
    let left = rect.left
    if (top + cardHeight > window.innerHeight) top = Math.max(S.lg, rect.top - cardHeight - S.sm)
    if (left + cardWidth > window.innerWidth - S.lg) left = window.innerWidth - cardWidth - S.lg
    if (left < S.lg) left = S.lg
    if (top < S.lg) top = S.lg
    return { top, left }
  }


  // ── Pins ─────────────────────────────────────────────────────────────────

  const pins: Array<CommentPin & { rect: DOMRect }> = threads
    .filter(t => {
      const rect = pinRects.get(t.id)
      return !!rect
    })
    .map(t => ({
      threadId: t.id,
      frameId: t.frameId,
      selector: t.selector,
      author: t.author,
      replyCount: t.messages.length - 1,
      hasAnnotation: !!t.annotationId,
      status: t.status,
      rect: pinRects.get(t.id)!,
    }))

  // ── Thread menu items ─────────────────────────────────────────────────────

  const threadMenuItems: DropdownItem[] = [
    {
      label: 'Copy link',
      icon: <Copy size={ICON.lg} strokeWidth={1.5} />,
      onClick: handleCopyLink,
    },
    {
      label: 'Delete thread',
      icon: <Trash2 size={ICON.lg} strokeWidth={1.5} />,
      destructive: true,
      separator: true,
      onClick: handleDeleteThread,
    },
  ]

  // ── Message menu items ────────────────────────────────────────────────────

  const getMsgMenuItems = (message: CommentMessage): DropdownItem[] => {
    const items: DropdownItem[] = []
    // "Add as annotation" only in dev mode
    if (isDev && activeThread) {
      items.push({
        label: 'Add as annotation',
        icon: <Pencil size={ICON.lg} strokeWidth={1.5} />,
        accent: true,
        onClick: async () => {
          try {
            const res = await fetch(`${endpoint}/comments/${activeThread.ghIssueNumber}/annotate`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                frameId: activeThread.frameId,
                componentName: activeThread.componentName,
                selector: activeThread.selector,
                elementTag: activeThread.elementTag,
                elementText: activeThread.elementText,
                computedStyles: activeThread.computedStyles,
                comment: message.body,
              }),
            })
            if (res.ok) {
              const { annotationId } = await res.json()
              setThreads(prev => prev.map(t =>
                t.id === activeThread.id ? { ...t, annotationId } : t
              ))
              setToast(`Annotation #${annotationId} queued`)
            }
          } catch {
            setToast('Failed to create annotation')
          }
        },
      })
    }
    // Delete message (only replies, not original message)
    if (!message.isOriginal && message.ghCommentId && isDev) {
      items.push({
        label: 'Delete',
        icon: <Trash2 size={ICON.lg} strokeWidth={1.5} />,
        destructive: true,
        separator: items.length > 0,
        onClick: async () => {
          try {
            await fetch(`${endpoint}/comments/${activeThread?.ghIssueNumber}/messages/comment-${message.ghCommentId}`, {
              method: 'DELETE',
            })
            setThreads(prev => prev.map(t =>
              t.id === activeThread?.id
                ? { ...t, messages: t.messages.filter(m => m.id !== message.id) }
                : t
            ))
          } catch {
            setToast('Failed to delete')
          }
        },
      })
    }
    return items
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Targeting overlay */}
      {mode === 'targeting' && (
        <div
          ref={overlayRef}
          onPointerMove={handlePointerMove}
          onPointerDown={handlePointerDown}
          style={{ position: 'fixed', inset: 0, zIndex: 99998, cursor: 'crosshair' }}
        />
      )}

      {/* Highlight box */}
      {highlight && mode === 'targeting' && (
        <div style={{
          position: 'fixed',
          left: highlight.left - 2,
          top: highlight.top - 2,
          width: highlight.width + 4,
          height: highlight.height + 4,
          border: `2px solid ${A.accent}`,
          backgroundColor: `${A.muted}44`,
          borderRadius: R.control,
          pointerEvents: 'none',
          zIndex: 99999,
        }} />
      )}

      {/* Auth card */}
      {showAuthCard && (
        <div
          style={{
            position: 'fixed',
            bottom: S.lg + S.md + 40 + S.sm + 40 + S.sm,
            right: S.lg + S.md,
            zIndex: 99999,
          }}
        >
          <AuthCard
            onClose={() => setShowAuthCard(false)}
            onSuccess={(u) => {
              setUser(u)
              setShowAuthCard(false)
              setToast(`Signed in as ${u.login}`)
            }}
          />
        </div>
      )}

      {/* Compose card */}
      {cardVisible && target && (() => {
        const pos = getComposeCardPos()
        return (
          <div
            style={{
              position: 'fixed',
              ...pos,
              zIndex: 99999,
              width: 300,
              background: N.card,
              borderRadius: R.panel,
              padding: S.md,
              border: `1px solid ${N.border}`,
              boxShadow: `0 ${S.xs}px ${S.xxl}px rgba(0,0,0,0.08), 0 1px ${S.xs}px rgba(0,0,0,0.04)`,
              fontFamily: FONT,
              display: 'flex',
              flexDirection: 'column',
              gap: S.sm,
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: T.caption, color: N.txtTer, letterSpacing: '0.02em' }}>
                {target.componentName} &middot; {target.elementTag}
              </div>
              <HoverButton onClick={() => { setMode('idle'); setTarget(null); setCommentText('') }} title="Cancel">
                <X size={ICON.sm} strokeWidth={1.5} />
              </HoverButton>
            </div>

            {/* Avatar + textarea */}
            <div style={{ display: 'flex', gap: S.sm, alignItems: 'flex-start' }}>
              {user && <Avatar name={user.login} size={28} />}
              <textarea
                ref={textareaRef}
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handlePost()
                  if (e.key === 'Escape') { setMode('idle'); setTarget(null); setCommentText('') }
                }}
                placeholder="Add a comment..."
                style={{
                  flex: 1, minHeight: 64, padding: `${S.sm}px ${S.sm}px`, borderRadius: R.card,
                  backgroundColor: N.chromeSub, border: `1px solid ${N.border}`,
                  fontSize: T.body, color: commentText ? N.txtPri : N.txtTer,
                  fontFamily: FONT, resize: 'vertical', outline: 'none', lineHeight: 1.5,
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: S.sm }}>
              <button
                onClick={() => { setMode('idle'); setTarget(null); setCommentText('') }}
                style={{
                  padding: `${S.sm}px ${S.md}px`, borderRadius: R.card,
                  border: `1px solid ${N.border}`, backgroundColor: N.card,
                  fontSize: T.body, color: N.txtSec, fontFamily: FONT, cursor: 'default',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handlePost}
                disabled={!commentText.trim() || posting}
                style={{
                  padding: `${S.sm}px ${S.md}px`, borderRadius: R.card, border: 'none',
                  backgroundColor: commentText.trim() && !posting ? A.accent : A.muted,
                  color: commentText.trim() && !posting ? 'oklch(1 0 0)' : N.txtTer,
                  fontSize: T.body, fontWeight: 500, fontFamily: FONT, cursor: 'default',
                }}
              >
                {posting ? 'Posting…' : 'Post'}
              </button>
            </div>
          </div>
        )
      })()}

      {/* Thread card */}
      {threadVisible && activeThread && (() => {
        const pos = getThreadCardPos()
        return (
          <div
            style={{
              position: 'fixed',
              ...pos,
              zIndex: 99999,
              width: 360,
              maxHeight: '70vh',
              background: N.card,
              borderRadius: R.panel,
              padding: S.lg,
              border: `1px solid ${N.border}`,
              boxShadow: `0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)`,
              fontFamily: FONT,
              display: 'flex',
              flexDirection: 'column',
              gap: S.md,
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: S.sm }}>
                <span style={{ fontSize: T.title, fontWeight: 600, color: N.txtPri }}>Comment</span>
                <span style={{ fontSize: T.caption, color: N.txtTer }}>
                  {activeThread.messages.length > 1 ? `${activeThread.messages.length - 1} ${activeThread.messages.length - 1 === 1 ? 'reply' : 'replies'}` : ''}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: S.xs, position: 'relative' }}>
                <div style={{ position: 'relative' }}>
                  <HoverButton onClick={() => setThreadMenuOpen(o => !o)} title="Thread options">
                    <MoreHorizontal size={ICON.lg} strokeWidth={1.5} />
                  </HoverButton>
                  {threadMenuOpen && (
                    <ContextMenu
                      items={threadMenuItems}
                      onClose={() => setThreadMenuOpen(false)}
                    />
                  )}
                </div>
                {activeThread.status === 'open' && (
                  <HoverButton onClick={handleResolve} title="Resolve thread">
                    <Check size={ICON.md} strokeWidth={1.5} />
                  </HoverButton>
                )}
                <HoverButton onClick={() => { setMode('idle'); setActiveThreadId(null) }} title="Close">
                  <X size={ICON.md} strokeWidth={1.5} />
                </HoverButton>
              </div>
            </div>

            {/* Element context */}
            <div style={{
              fontSize: T.caption, color: N.txtTer, letterSpacing: '0.02em',
              padding: `${S.xs}px 0`, borderBottom: `1px solid ${N.border}`, flexShrink: 0,
            }}>
              {activeThread.componentName} &middot; {activeThread.elementTag}
            </div>

            {/* Annotation banner */}
            {activeThread.annotationId && (
              <div style={{
                padding: `${S.sm}px ${S.md}px`, borderRadius: R.card,
                backgroundColor: A.muted, border: `1px solid ${N.border}`,
                display: 'flex', alignItems: 'center', gap: S.sm, flexShrink: 0,
              }}>
                <Pencil size={ICON.sm} strokeWidth={1.5} color={A.accent} />
                <span style={{ fontSize: T.body, fontWeight: 500, color: A.accent }}>
                  Annotation #{activeThread.annotationId} — Queued
                </span>
              </div>
            )}

            {/* Resolved banner */}
            {activeThread.status === 'resolved' && (
              <div style={{
                padding: `${S.sm}px ${S.md}px`, borderRadius: R.card,
                backgroundColor: `${F.resolved}22`, border: `1px solid ${N.border}`,
                display: 'flex', alignItems: 'center', gap: S.sm, flexShrink: 0,
              }}>
                <Check size={ICON.sm} strokeWidth={2} color={F.resolved} />
                <span style={{ fontSize: T.body, color: N.txtTer }}>Thread resolved</span>
              </div>
            )}

            {/* Messages */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: S.md, overflowY: 'auto', flex: 1 }}>
              {activeThread.messages.map(message => (
                <ThreadMessage
                  key={message.id}
                  message={message}
                  menuItems={getMsgMenuItems(message)}
                  onReact={user ? (emoji) => handleReact(message, emoji) : undefined}
                />
              ))}
            </div>

            {/* Reply input */}
            {activeThread.status === 'open' && user && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: S.sm,
                padding: `${S.sm}px 0 0`, borderTop: `1px solid ${N.border}`, flexShrink: 0,
              }}>
                <Avatar name={user.login} size={24} />
                <input
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleReply() }}
                  placeholder="Reply…"
                  style={{
                    flex: 1, padding: `${S.sm}px ${S.md}px`, borderRadius: R.pill,
                    backgroundColor: N.chromeSub, fontSize: T.title, color: replyText ? N.txtPri : N.txtTer,
                    border: 'none', outline: 'none', fontFamily: FONT,
                  }}
                />
                <button
                  onClick={handleReply}
                  disabled={!replyText.trim()}
                  style={{
                    width: 28, height: 28, borderRadius: '50%', border: 'none',
                    backgroundColor: replyText.trim() ? A.accent : N.chromeSub,
                    color: replyText.trim() ? 'oklch(1 0 0)' : N.txtTer,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'default',
                  }}
                >
                  <Send size={ICON.md} strokeWidth={1.5} />
                </button>
              </div>
            )}
          </div>
        )
      })()}

      {/* FAB — stacked above annotation FAB */}
      {mode === 'idle' && !showAuthCard && (
        <div
          style={{
            position: 'fixed',
            bottom: S.lg + S.md + 40 + S.sm,  // annotation FAB height (40) + gap (S.sm) above it
            right: S.lg + S.md,
            zIndex: 99999,
          }}
        >
          <div style={{ position: 'relative' }}>
            <button
              onClick={handleFabClick}
              onPointerEnter={() => setButtonState('hover')}
              onPointerLeave={() => setButtonState('idle')}
              onPointerDown={() => setButtonState('pressed')}
              onPointerUp={() => setButtonState('hover')}
              title={loadingThreads ? 'Loading comments…' : mode === 'targeting' ? 'Cancel (Esc)' : 'Add comment'}
              style={{
                width: 40, height: 40, borderRadius: '50%',
                background: buttonState === 'pressed' ? A.strong : buttonState === 'hover' ? A.hover : A.accent,
                color: 'oklch(1 0 0)',
                border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: buttonState === 'pressed'
                  ? 'inset 0 1px 2px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.08)'
                  : 'inset 0 1px 0 rgba(255,255,255,0.08), 0 1px 3px rgba(0,0,0,0.12), 0 0 0 0.5px rgba(0,0,0,0.06)',
                cursor: 'default',
                opacity: loadingThreads ? 0.7 : 1,
              }}
            >
              <MessageSquare size={ICON.lg} strokeWidth={1.5} />
            </button>
            {/* Open thread count badge */}
            {!loadingThreads && threads.filter(t => t.status === 'open').length > 0 && !user && (
              <div style={{
                position: 'absolute', top: -4, left: -4,
                minWidth: S.lg, height: S.lg, borderRadius: R.card,
                backgroundColor: N.txtPri, color: 'oklch(1 0 0)',
                fontSize: 9, fontWeight: 700, fontFamily: FONT,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: `0 ${S.xs}px`, border: `2px solid oklch(1 0 0)`,
                pointerEvents: 'none',
              }}>
                {threads.filter(t => t.status === 'open').length}
              </div>
            )}
            {/* Avatar badge when signed in */}
            {user && (
              <div style={{
                position: 'absolute', bottom: -2, right: -2,
                width: S.lg, height: S.lg, borderRadius: '50%',
                border: '2px solid oklch(1 0 0)',
                backgroundColor: F.marker,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 8, fontWeight: 700, color: 'oklch(1 0 0)',
                fontFamily: FONT,
              }}>
                {user.login.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Avatar pins */}
      {pins.map(pin => (
        <AvatarPin
          key={pin.threadId}
          pin={pin}
          onClick={() => {
            setActiveThreadId(pin.threadId)
            setMode('viewing')
          }}
        />
      ))}

      {/* Toast */}
      {/* Toast */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: S.xxl,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 99999,
            padding: `${S.sm}px ${S.xxl}px`,
            background: N.txtPri,
            color: 'oklch(1 0 0)',
            borderRadius: R.pill,
            fontSize: T.title,
            fontWeight: 500,
            fontFamily: FONT,
            boxShadow: `0 2px ${S.md}px rgba(0,0,0,0.12)`,
            whiteSpace: 'nowrap',
          }}
        >
          {toast}
        </div>
      )}
    </>
  )
}
