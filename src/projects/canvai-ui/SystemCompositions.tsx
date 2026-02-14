import { useState, useRef, useEffect, useCallback } from 'react'
import { MoreHorizontal, Check, X, Send, Pencil, Trash2, ChevronDown, PanelLeft, MessageSquare, Link } from 'lucide-react'
import { ACCENT, SURFACE, BORDER, TEXT, TEXT_SEC, TEXT_TER, FONT } from './tokens'
import { SPRING, useSpring } from './spring'

/* ── Shared Primitives ────────────────────────────── */

function Avatar({ name, size = 28 }: { name: string; size?: number }) {
  const colors: Record<string, string> = { G: '#6366F1', N: ACCENT, S: '#0EA5E9', M: '#8B5CF6', A: '#10B981' }
  const letter = name.charAt(0).toUpperCase()
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      backgroundColor: colors[letter] || TEXT_SEC, color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.4, fontWeight: 600, fontFamily: FONT,
    }}>
      {letter}
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 11, color: TEXT_TER, marginBottom: 8, textWrap: 'pretty' } as React.CSSProperties}>{children}</div>
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 10, color: TEXT_TER, fontStyle: 'italic',
      padding: '4px 8px', borderLeft: `2px solid ${BORDER}`, marginTop: 4, textWrap: 'pretty',
    } as React.CSSProperties}>
      {children}
    </div>
  )
}

function HoverButton({ children, onClick, title, style }: {
  children: React.ReactNode; onClick?: () => void; title?: string; style?: React.CSSProperties
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick} title={title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 24, height: 24, borderRadius: 4, border: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: TEXT_TER, backgroundColor: hovered ? 'rgba(0,0,0,0.06)' : 'transparent',
        transition: 'background-color 0.1s ease', fontFamily: FONT,
        cursor: 'default',
        ...style,
      }}
    >
      {children}
    </button>
  )
}

/* ═══════════════════════════════════════════════════════
   EXPORT 1: CompositionThread
   ═══════════════════════════════════════════════════════ */

const QUICK_REACTIONS = ['👍', '🤔', '🔥']

const MSG_MENU_ITEMS = [
  { label: 'Add as annotation', icon: <Pencil size={16} strokeWidth={1.5} />, accent: true },
  { label: 'Delete', icon: <Trash2 size={16} strokeWidth={1.5} />, destructive: true, separator: true },
]

const THREAD_MENU_ITEMS = [
  { label: 'Copy link', icon: <Link size={16} strokeWidth={1.5} /> },
  { label: 'Delete', icon: <Trash2 size={16} strokeWidth={1.5} />, destructive: true, separator: true },
]

function SpringDropdown({ items, onClose, anchorRef }: {
  items: { label: string; icon: React.ReactNode; accent?: boolean; destructive?: boolean; separator?: boolean }[]
  onClose: () => void
  anchorRef?: React.RefObject<HTMLDivElement | null>
}) {
  const dropRef = useRef<HTMLDivElement>(null)
  const spring = useSpring(SPRING.snappy)

  useEffect(() => {
    spring.set(1, (v) => {
      if (dropRef.current) {
        dropRef.current.style.transform = `scaleY(${Math.max(0, v)})`
        dropRef.current.style.opacity = `${Math.max(0, v)}`
      }
    })
  }, [])

  return (
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={onClose} />
      <div
        ref={dropRef}
        style={{
          position: 'absolute', top: '100%', right: 0, marginTop: 4, zIndex: 100,
          width: 208, background: SURFACE, borderRadius: 8,
          border: `1px solid ${BORDER}`,
          boxShadow: '0 4px 16px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
          padding: 4, fontFamily: FONT,
          transformOrigin: 'top right',
          transform: 'scaleY(0)', opacity: 0,
        }}
      >
        {items.map(item => (
          <DropdownRow key={item.label} item={item} onClose={onClose} />
        ))}
      </div>
    </>
  )
}

function DropdownRow({ item, onClose }: {
  item: { label: string; icon: React.ReactNode; accent?: boolean; destructive?: boolean; separator?: boolean }
  onClose: () => void
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClose}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%', padding: '8px 12px', borderRadius: 4, border: 'none',
        fontSize: 13,
        color: item.destructive
          ? (hovered ? '#DC2626' : TEXT_SEC)
          : item.accent ? ACCENT : TEXT,
        fontWeight: item.accent ? 500 : 400,
        backgroundColor: item.destructive && hovered
          ? 'rgba(220,38,38,0.06)'
          : hovered ? 'rgba(0,0,0,0.04)' : 'transparent',
        display: 'flex', alignItems: 'center', gap: 8,
        borderTop: item.separator ? `1px solid ${BORDER}` : 'none',
        marginTop: item.separator ? 4 : 0,
        fontFamily: FONT, textAlign: 'left',
        transition: 'all 0.1s ease',
        cursor: 'default',
      }}
    >
      <span style={{ width: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {item.icon}
      </span>
      {item.label}
    </button>
  )
}

function Reaction({ label, count }: { label: string; count: number }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '2px 8px', borderRadius: 12, border: `1px solid ${hovered ? '#D1D5DB' : BORDER}`,
        backgroundColor: hovered ? '#F3F4F6' : '#FAFAFA',
        fontSize: 11, color: TEXT_SEC, fontWeight: 500, fontFamily: FONT,
        transition: 'all 0.1s ease', cursor: 'default',
      }}
    >
      {label} {count}
    </button>
  )
}

function ThreadMessage({ name, time, children, reactions }: {
  name: string; time: string; children: React.ReactNode; reactions?: { label: string; count: number }[]
}) {
  const [hovered, setHovered] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); if (!menuOpen) setMenuOpen(false) }}
      style={{
        display: 'flex', gap: 8, alignItems: 'flex-start',
        padding: 4, margin: -4, borderRadius: 8,
        backgroundColor: hovered ? 'rgba(0,0,0,0.02)' : 'transparent',
        transition: 'background-color 0.1s ease',
      }}
    >
      <Avatar name={name} size={28} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>{name}</span>
          <span style={{ fontSize: 11, color: TEXT_TER }}>{time}</span>
          <div style={{ flex: 1 }} />
          <div style={{
            opacity: hovered || menuOpen ? 1 : 0,
            transition: 'opacity 0.1s ease',
            display: 'flex', alignItems: 'center', gap: 2,
          }}>
            {QUICK_REACTIONS.map(emoji => (
              <HoverButton key={emoji} title={emoji} style={{ width: 20, height: 20, fontSize: 11 }}>
                {emoji}
              </HoverButton>
            ))}
            <div style={{ position: 'relative' }}>
              <HoverButton onClick={() => setMenuOpen(o => !o)} title="More actions">
                <MoreHorizontal size={16} strokeWidth={1.5} />
              </HoverButton>
              {menuOpen && <SpringDropdown items={MSG_MENU_ITEMS} onClose={() => setMenuOpen(false)} />}
            </div>
          </div>
        </div>
        <div style={{ fontSize: 13, color: TEXT, lineHeight: 1.5, textWrap: 'pretty' } as React.CSSProperties}>
          {children}
        </div>
        {reactions && reactions.length > 0 && (
          <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
            {reactions.map(r => <Reaction key={r.label} label={r.label} count={r.count} />)}
          </div>
        )}
      </div>
    </div>
  )
}

export function CompositionThread() {
  const [threadMenuOpen, setThreadMenuOpen] = useState(false)
  const [replyText, setReplyText] = useState('')
  const sendRef = useRef<HTMLButtonElement>(null)
  const sendSpring = useSpring(SPRING.snappy)

  const handleSend = useCallback(() => {
    if (!replyText.trim()) return
    sendSpring.state.value = 0.85
    sendSpring.state.velocity = -3
    sendSpring.set(1, (v) => {
      if (sendRef.current) sendRef.current.style.transform = `scale(${v})`
    })
    setReplyText('')
  }, [replyText, sendSpring])

  return (
    <div style={{ fontFamily: FONT, display: 'flex', flexDirection: 'column', gap: 20, padding: 8 }}>
      <div style={{
        fontSize: 13, fontWeight: 600, color: TEXT_TER,
        textTransform: 'uppercase', letterSpacing: '0.05em',
      }}>
        Composition: Comment Thread
      </div>

      <div style={{
        width: 380, background: SURFACE, borderRadius: 10, padding: 16,
        boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
        border: `1px solid ${BORDER}`, fontFamily: FONT,
        display: 'flex', flexDirection: 'column', gap: 12,
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>Comment</span>
            <span style={{ fontSize: 11, color: TEXT_TER }}>2 replies</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, position: 'relative' }}>
            <div style={{ position: 'relative' }}>
              <HoverButton onClick={() => setThreadMenuOpen(o => !o)} title="Thread actions">
                <MoreHorizontal size={16} strokeWidth={1.5} />
              </HoverButton>
              {threadMenuOpen && <SpringDropdown items={THREAD_MENU_ITEMS} onClose={() => setThreadMenuOpen(false)} />}
            </div>
            <HoverButton title="Resolve thread">
              <Check size={14} strokeWidth={1.5} />
            </HoverButton>
            <HoverButton title="Close panel">
              <X size={14} strokeWidth={1.5} />
            </HoverButton>
          </div>
        </div>

        {/* Element context */}
        <div style={{
          fontSize: 11, color: TEXT_TER, letterSpacing: '0.02em',
          padding: '4px 0', borderBottom: `1px solid ${BORDER}`,
        }}>
          TopBar &middot; div
        </div>

        {/* Messages */}
        <ThreadMessage name="Gustav" time="5 min ago">
          The padding on the left side feels too tight. Should be 16px to match the right.
        </ThreadMessage>

        <ThreadMessage name="Noam" time="3 min ago" reactions={[{ label: '👍', count: 2 }, { label: '🔥', count: 1 }]}>
          Good catch. I also think the border-radius should be 8 instead of 6 for consistency with the rest of the system.
        </ThreadMessage>

        <ThreadMessage name="Sarah" time="1 min ago">
          Agreed on both. The spacing tokens doc says 16px for panel gutters.
        </ThreadMessage>

        {/* Reply input */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '8px 0 0', borderTop: `1px solid ${BORDER}`,
        }}>
          <Avatar name="Noam" size={24} />
          <input
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            placeholder="Reply"
            style={{
              flex: 1, padding: '8px 12px', borderRadius: 20,
              backgroundColor: '#F3F4F6', fontSize: 13, color: replyText ? TEXT : TEXT_TER,
              border: 'none', outline: 'none', fontFamily: FONT,
            }}
          />
          <button
            ref={sendRef}
            onClick={handleSend}
            title="Send"
            style={{
              width: 28, height: 28, borderRadius: '50%', border: 'none',
              backgroundColor: replyText.trim() ? ACCENT : '#F3F4F6',
              color: replyText.trim() ? '#fff' : TEXT_TER,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'default', transition: 'background-color 0.1s ease, color 0.1s ease',
            }}
          >
            <Send size={14} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <Note>
        Menus open with spring scaleY animation. Quick reactions appear on message hover. Reply input is fully typeable with spring press on Send.
      </Note>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   EXPORT 2: CompositionAnnotation
   ═══════════════════════════════════════════════════════ */

function MiniCanvas({ children, style }: { children?: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      width: 160, height: 100, backgroundColor: '#F3F4F6', borderRadius: 8,
      position: 'relative', overflow: 'hidden',
      border: `1px solid ${BORDER}`,
      ...style,
    }}>
      {/* Fake frames */}
      <div style={{
        position: 'absolute', top: 16, left: 12,
        width: 52, height: 32, borderRadius: 4,
        backgroundColor: SURFACE, border: `1px solid ${BORDER}`,
      }} />
      <div style={{
        position: 'absolute', top: 24, left: 76,
        width: 60, height: 40, borderRadius: 4,
        backgroundColor: SURFACE, border: `1px solid ${BORDER}`,
      }} />
      {children}
    </div>
  )
}

function AnnotationMarker({ number, style, dimmed, pulse }: {
  number: number; style?: React.CSSProperties; dimmed?: boolean; pulse?: boolean
}) {
  return (
    <div style={{
      width: 18, height: 18, borderRadius: '50%',
      backgroundColor: ACCENT, color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 9, fontWeight: 700, fontFamily: FONT,
      boxShadow: pulse ? `0 0 0 3px rgba(232,89,12,0.2), 0 1px 4px rgba(232,89,12,0.25)` : `0 1px 4px rgba(232,89,12,0.25)`,
      opacity: dimmed ? 0.4 : 1,
      cursor: 'default', userSelect: 'none',
      position: 'absolute',
      ...style,
    }}>
      {number}
    </div>
  )
}

export function CompositionAnnotation() {
  const [annotationText, setAnnotationText] = useState('')

  return (
    <div style={{ fontFamily: FONT, display: 'flex', flexDirection: 'column', gap: 20, padding: 8 }}>
      <div style={{
        fontSize: 13, fontWeight: 600, color: TEXT_TER,
        textTransform: 'uppercase', letterSpacing: '0.05em',
      }}>
        Composition: Annotation Lifecycle
      </div>

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        {/* Column 1: New */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 200 }}>
          <SectionLabel>New</SectionLabel>
          <MiniCanvas>
            <AnnotationMarker number={1} style={{ top: 20, left: 48 }} />
          </MiniCanvas>
          <div style={{
            background: SURFACE, borderRadius: 10, padding: 12,
            boxShadow: '0 4px 16px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
            border: `1px solid ${BORDER}`,
            display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 11, color: TEXT_TER, letterSpacing: '0.02em' }}>
                TopBar &middot; div
              </div>
              <HoverButton title="Cancel" style={{ width: 20, height: 20 }}>
                <X size={12} strokeWidth={1.5} />
              </HoverButton>
            </div>
            <textarea
              value={annotationText}
              onChange={e => setAnnotationText(e.target.value)}
              placeholder="Describe the change..."
              style={{
                width: '100%', minHeight: 56, padding: '8px 10px', borderRadius: 6,
                backgroundColor: '#F9FAFB', border: `1px solid ${BORDER}`,
                fontSize: 12, color: annotationText ? TEXT : TEXT_TER,
                lineHeight: 1.5, resize: 'vertical', outline: 'none', fontFamily: FONT,
                boxSizing: 'border-box',
              }}
            />
            <button style={{
              padding: '8px 12px', borderRadius: 8, border: 'none',
              backgroundColor: annotationText.trim() ? ACCENT : 'rgba(232,89,12,0.15)',
              color: annotationText.trim() ? '#fff' : TEXT_TER,
              fontSize: 12, fontWeight: 500, fontFamily: FONT,
              alignSelf: 'flex-end', cursor: 'default',
              transition: 'background-color 0.1s ease, color 0.1s ease',
            }}>
              Apply
            </button>
          </div>
        </div>

        {/* Column 2: Pending */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 200 }}>
          <SectionLabel>Pending</SectionLabel>
          <MiniCanvas>
            <AnnotationMarker number={1} style={{ top: 20, left: 48 }} pulse />
          </MiniCanvas>
          <div style={{
            background: SURFACE, borderRadius: 10, padding: 12,
            boxShadow: '0 4px 16px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
            border: `1px solid ${BORDER}`,
            display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 11, color: TEXT_TER, letterSpacing: '0.02em' }}>
                TopBar &middot; div
              </div>
              <span style={{
                fontSize: 10, fontWeight: 500, color: ACCENT,
                backgroundColor: 'rgba(232,89,12,0.1)', padding: '4px 8px', borderRadius: 8,
              }}>
                Pending
              </span>
            </div>
            <div style={{
              fontSize: 12, color: TEXT, lineHeight: 1.5,
              padding: '8px 10px', borderRadius: 6,
              backgroundColor: '#F9FAFB', border: `1px solid ${BORDER}`,
              textWrap: 'pretty',
            } as React.CSSProperties}>
              Make the font weight 600 and reduce the gap to 4px
            </div>
          </div>
        </div>

        {/* Column 3: Resolved */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 200 }}>
          <SectionLabel>Resolved</SectionLabel>
          <MiniCanvas>
            <AnnotationMarker number={1} style={{ top: 20, left: 48 }} dimmed />
          </MiniCanvas>
          <div style={{
            background: SURFACE, borderRadius: 10, padding: 12,
            boxShadow: '0 4px 16px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
            border: `1px solid ${BORDER}`,
            display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 11, color: TEXT_TER, letterSpacing: '0.02em' }}>
                TopBar &middot; div
              </div>
              <span style={{
                fontSize: 10, fontWeight: 500, color: '#059669',
                backgroundColor: '#ECFDF5', padding: '4px 8px', borderRadius: 8,
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                <Check size={10} strokeWidth={2} />
                Resolved
              </span>
            </div>
            <div style={{
              padding: '8px 10px', borderRadius: 6,
              backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <Check size={14} strokeWidth={1.5} color="#059669" />
              <span style={{ fontSize: 12, color: '#059669', fontWeight: 500, textWrap: 'pretty' } as React.CSSProperties}>
                Applied — changed cursor to default
              </span>
            </div>
          </div>
        </div>
      </div>

      <Note>
        Column 1 textarea is typeable. Apply button activates when text is entered. Pending marker has a subtle glow. Resolved marker is dimmed.
      </Note>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   EXPORT 3: CompositionNavigation
   ═══════════════════════════════════════════════════════ */

const NAV_ITERATIONS = [
  { name: 'V5', pages: ['Polish', 'Dark Mode'] },
  { name: 'V4', pages: ['Exploration'] },
  { name: 'V3', pages: ['Components'] },
]

export function CompositionNavigation() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mode, setMode] = useState<'watch' | 'manual'>('watch')
  const [activeIter, setActiveIter] = useState(0)
  const [activePage, setActivePage] = useState(0)
  const [expandedSet, setExpandedSet] = useState<Set<number>>(() => new Set([0]))
  const sidebarRef = useRef<HTMLDivElement>(null)
  const sidebarSpring = useSpring(SPRING.gentle)

  const toggleSidebar = useCallback(() => {
    const next = !sidebarOpen
    setSidebarOpen(next)
    sidebarSpring.set(next ? 0 : -1, (v) => {
      if (sidebarRef.current) {
        sidebarRef.current.style.transform = `translateX(${v * 100}%)`
      }
    })
  }, [sidebarOpen, sidebarSpring])

  const toggleIter = (idx: number) => {
    setExpandedSet(prev => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx); else next.add(idx)
      return next
    })
  }

  return (
    <div style={{ fontFamily: FONT, display: 'flex', flexDirection: 'column', gap: 20, padding: 8 }}>
      <div style={{
        fontSize: 13, fontWeight: 600, color: TEXT_TER,
        textTransform: 'uppercase', letterSpacing: '0.05em',
      }}>
        Composition: Navigation Shell
      </div>

      {/* Mini shell */}
      <div style={{
        width: 280, height: 240, borderRadius: 10,
        border: `1px solid ${BORDER}`, overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        backgroundColor: '#F9FAFB',
      }}>
        {/* TopBar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          minHeight: 36, padding: '0 10px',
          borderBottom: `1px solid ${BORDER}`, backgroundColor: SURFACE,
          fontSize: 12, flexShrink: 0,
        }}>
          <HoverButton onClick={toggleSidebar} title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}>
            <PanelLeft size={16} strokeWidth={1.5} />
          </HoverButton>

          {/* Project name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 16, height: 16, borderRadius: 4, backgroundColor: ACCENT,
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 9, fontWeight: 600, flexShrink: 0,
            }}>
              C
            </div>
            <span style={{ fontSize: 13, fontWeight: 500, color: TEXT }}>canvai-ui</span>
            <ChevronDown size={12} strokeWidth={1.5} color={TEXT_TER} style={{ flexShrink: 0 }} />
          </div>

          <div style={{ flex: 1 }} />

          {/* Mode pill */}
          <button
            onClick={() => setMode(m => m === 'watch' ? 'manual' : 'watch')}
            style={{
              padding: '4px 8px', borderRadius: 10, border: 'none',
              backgroundColor: mode === 'watch' ? '#ECFDF5' : '#F3F4F6',
              color: mode === 'watch' ? '#059669' : TEXT_SEC,
              fontSize: 10, fontWeight: 500, fontFamily: FONT, cursor: 'default',
              transition: 'background-color 0.1s ease, color 0.1s ease',
            }}
          >
            {mode === 'watch' ? 'Watch' : 'Manual'}
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
          {/* Sidebar */}
          <div
            ref={sidebarRef}
            style={{
              position: 'absolute', left: 0, top: 0, bottom: 0, width: 140,
              backgroundColor: SURFACE, borderRight: `1px solid ${BORDER}`,
              display: 'flex', flexDirection: 'column', padding: '8px 4px', gap: 0,
              zIndex: 10,
              transform: 'translateX(-100%)',
            }}
          >
            <div style={{
              padding: '4px 8px 6px', fontSize: 9, fontWeight: 600, color: TEXT_TER,
              textTransform: 'uppercase', letterSpacing: '0.06em',
            }}>
              Iterations
            </div>
            {NAV_ITERATIONS.map((iter, iterIdx) => {
              const expanded = expandedSet.has(iterIdx)
              return (
                <div key={iter.name} style={{ marginTop: iterIdx > 0 ? 2 : 0 }}>
                  <button
                    onClick={() => toggleIter(iterIdx)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 4, width: '100%',
                      padding: '3px 8px', border: 'none', borderRadius: 4,
                      cursor: 'default', backgroundColor: 'transparent',
                      fontWeight: iterIdx === activeIter ? 600 : 500, fontSize: 11, color: TEXT,
                      textAlign: 'left', fontFamily: FONT,
                    }}
                  >
                    <ChevronDown
                      size={10} strokeWidth={1.5}
                      style={{
                        flexShrink: 0, transition: 'transform 0.15s ease',
                        transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)',
                        color: TEXT_TER,
                      }}
                    />
                    {iter.name}
                  </button>
                  {expanded && iter.pages.map((page, pageIdx) => (
                    <button
                      key={page}
                      onClick={() => { setActiveIter(iterIdx); setActivePage(pageIdx) }}
                      style={{
                        display: 'block', width: '100%', textAlign: 'left',
                        padding: '2px 8px 2px 22px', border: 'none', borderRadius: 4,
                        cursor: 'default',
                        backgroundColor: iterIdx === activeIter && pageIdx === activePage ? 'rgba(0,0,0,0.04)' : 'transparent',
                        fontSize: 11, fontFamily: FONT,
                        fontWeight: iterIdx === activeIter && pageIdx === activePage ? 500 : 400,
                        color: iterIdx === activeIter && pageIdx === activePage ? TEXT : TEXT_TER,
                      }}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              )
            })}
          </div>

          {/* Canvas placeholder */}
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, color: TEXT_TER,
          }}>
            Canvas area
          </div>
        </div>
      </div>

      {/* Status bar concept */}
      <div>
        <SectionLabel>Status bar</SectionLabel>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '8px 12px', borderRadius: 8,
          backgroundColor: '#F9FAFB', border: `1px solid ${BORDER}`,
        }}>
          {/* Pending count */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 16, height: 16, borderRadius: '50%',
              backgroundColor: ACCENT, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 9, fontWeight: 700,
            }}>
              3
            </div>
            <span style={{ fontSize: 11, color: TEXT_SEC }}>pending</span>
          </div>

          <div style={{ width: 1, height: 12, backgroundColor: BORDER }} />

          {/* Mode indicator */}
          <div style={{
            padding: '4px 8px', borderRadius: 10,
            backgroundColor: mode === 'watch' ? '#ECFDF5' : '#F3F4F6',
            color: mode === 'watch' ? '#059669' : TEXT_SEC,
            fontSize: 10, fontWeight: 500,
          }}>
            {mode === 'watch' ? 'Watch' : 'Manual'}
          </div>

          <div style={{ width: 1, height: 12, backgroundColor: BORDER }} />

          {/* Connected dot */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              backgroundColor: mode === 'watch' ? '#10B981' : TEXT_TER,
            }} />
            <span style={{ fontSize: 11, color: TEXT_SEC }}>
              {mode === 'watch' ? 'Connected' : 'Idle'}
            </span>
          </div>
        </div>
      </div>

      <Note>
        Click the sidebar toggle (PanelLeft icon) to spring-slide the sidebar open/closed. Click the mode pill to toggle Watch/Manual. The status bar updates to reflect the current mode.
      </Note>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   EXPORT 4: CompositionFeedback
   ═══════════════════════════════════════════════════════ */

const SHIMMER_KEYFRAMES = `
@keyframes shimmer {
  0% { background-position: -200px 0; }
  100% { background-position: 200px 0; }
}
`

function ShimmerLine({ width, height = 10, delay = 0 }: { width: number | string; height?: number; delay?: number }) {
  return (
    <div style={{
      width, height, borderRadius: 4,
      background: 'linear-gradient(90deg, #E5E7EB 0%, #F3F4F6 50%, #E5E7EB 100%)',
      backgroundSize: '400px 100%',
      animation: `shimmer 1.8s ease-in-out infinite`,
      animationDelay: `${delay}s`,
    }} />
  )
}

function Toast({ message, variant, springRef, visible }: {
  message: string; variant: 'success' | 'info' | 'error'
  springRef: React.RefObject<HTMLDivElement>; visible: boolean
}) {
  return (
    <div
      ref={springRef as React.RefObject<HTMLDivElement>}
      style={{
        padding: '8px 20px', borderRadius: 20,
        backgroundColor: TEXT, color: '#fff',
        fontSize: 13, fontWeight: 500, fontFamily: FONT,
        whiteSpace: 'nowrap',
        boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
        transform: 'translateY(20px)',
        opacity: 0,
        display: visible ? 'block' : 'none',
      }}
    >
      {message}
    </div>
  )
}

export function CompositionFeedback() {
  // Toast states
  const [successVisible, setSuccessVisible] = useState(false)
  const [infoVisible, setInfoVisible] = useState(false)
  const [errorVisible, setErrorVisible] = useState(false)
  const successRef = useRef<HTMLDivElement>(null)
  const infoRef = useRef<HTMLDivElement>(null)
  const errorRef = useRef<HTMLDivElement>(null)
  const successSpring = useSpring(SPRING.gentle)
  const infoSpring = useSpring(SPRING.gentle)
  const errorSpring = useSpring(SPRING.gentle)

  const showToast = useCallback((
    setVisible: (v: boolean) => void,
    ref: React.RefObject<HTMLDivElement | null>,
    spring: ReturnType<typeof useSpring>,
  ) => {
    setVisible(true)
    spring.set(1, (v) => {
      if (ref.current) {
        ref.current.style.transform = `translateY(${(1 - v) * 20}px)`
        ref.current.style.opacity = `${Math.max(0, v)}`
      }
    })
    setTimeout(() => {
      spring.set(0, (v) => {
        if (ref.current) {
          ref.current.style.transform = `translateY(${(1 - v) * 20}px)`
          ref.current.style.opacity = `${Math.max(0, v)}`
        }
        if (v <= 0.01) setVisible(false)
      })
    }, 2000)
  }, [])

  // Spinner rotation
  const spinnerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let angle = 0
    let raf: number
    function spin() {
      angle = (angle + 4) % 360
      if (spinnerRef.current) spinnerRef.current.style.transform = `rotate(${angle}deg)`
      raf = requestAnimationFrame(spin)
    }
    raf = requestAnimationFrame(spin)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div style={{ fontFamily: FONT, display: 'flex', flexDirection: 'column', gap: 20, padding: 8 }}>
      <style>{SHIMMER_KEYFRAMES}</style>
      <div style={{
        fontSize: 13, fontWeight: 600, color: TEXT_TER,
        textTransform: 'uppercase', letterSpacing: '0.05em',
      }}>
        Composition: Feedback Patterns
      </div>

      {/* Toast notifications */}
      <div>
        <SectionLabel>Toast notifications (spring up, auto-dismiss 2s)</SectionLabel>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <button
            onClick={() => showToast(setSuccessVisible, successRef, successSpring)}
            style={{
              padding: '8px 12px', borderRadius: 8, border: `1px solid ${BORDER}`,
              backgroundColor: SURFACE, fontSize: 12, fontWeight: 500,
              color: TEXT_SEC, fontFamily: FONT, cursor: 'default',
            }}
          >
            Show success
          </button>
          <button
            onClick={() => showToast(setInfoVisible, infoRef, infoSpring)}
            style={{
              padding: '8px 12px', borderRadius: 8, border: `1px solid ${BORDER}`,
              backgroundColor: SURFACE, fontSize: 12, fontWeight: 500,
              color: TEXT_SEC, fontFamily: FONT, cursor: 'default',
            }}
          >
            Show info
          </button>
          <button
            onClick={() => showToast(setErrorVisible, errorRef, errorSpring)}
            style={{
              padding: '8px 12px', borderRadius: 8, border: `1px solid ${BORDER}`,
              backgroundColor: SURFACE, fontSize: 12, fontWeight: 500,
              color: TEXT_SEC, fontFamily: FONT, cursor: 'default',
            }}
          >
            Show error
          </button>
        </div>
        <div style={{
          width: 320, height: 56, position: 'relative',
          borderRadius: 8, backgroundColor: '#F9FAFB', border: `1px solid ${BORDER}`,
          overflow: 'hidden',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          padding: '0 0 8px',
          gap: 8,
        }}>
          <Toast message="Change applied" variant="success" springRef={successRef} visible={successVisible} />
          <Toast message="Annotation #4 queued" variant="info" springRef={infoRef} visible={infoVisible} />
          <Toast message="Failed to send" variant="error" springRef={errorRef} visible={errorVisible} />
        </div>
      </div>

      {/* Loading states */}
      <div>
        <SectionLabel>Loading states</SectionLabel>
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
          {/* Skeleton card */}
          <div>
            <div style={{ fontSize: 10, color: TEXT_TER, marginBottom: 8 }}>Skeleton card</div>
            <div style={{
              width: 200, padding: 16, borderRadius: 10,
              backgroundColor: SURFACE, border: `1px solid ${BORDER}`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              display: 'flex', flexDirection: 'column', gap: 10,
            }}>
              <ShimmerLine width="60%" height={10} />
              <ShimmerLine width="100%" height={8} delay={0.15} />
              <ShimmerLine width="80%" height={8} delay={0.3} />
            </div>
          </div>

          {/* Inline spinner */}
          <div>
            <div style={{ fontSize: 10, color: TEXT_TER, marginBottom: 8 }}>Inline spinner</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                ref={spinnerRef}
                style={{
                  width: 16, height: 16, borderRadius: '50%',
                  border: `2px solid ${BORDER}`,
                  borderTopColor: ACCENT,
                }}
              />
              <span style={{ fontSize: 12, color: TEXT_SEC }}>Applying changes...</span>
            </div>
          </div>
        </div>
      </div>

      {/* Empty states */}
      <div>
        <SectionLabel>Empty states</SectionLabel>
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
          <div style={{
            width: 200, padding: 24, borderRadius: 10,
            backgroundColor: SURFACE, border: `1px solid ${BORDER}`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            textAlign: 'center',
          }}>
            <MessageSquare size={24} strokeWidth={1.5} color={TEXT_TER} />
            <div style={{ fontSize: 13, fontWeight: 500, color: TEXT, textWrap: 'pretty' } as React.CSSProperties}>
              No comments yet
            </div>
            <div style={{ fontSize: 11, color: TEXT_TER, lineHeight: 1.4, textWrap: 'pretty' } as React.CSSProperties}>
              Click any element to start a thread
            </div>
          </div>

          <div style={{
            width: 200, padding: 24, borderRadius: 10,
            backgroundColor: SURFACE, border: `1px solid ${BORDER}`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            textAlign: 'center',
          }}>
            <Pencil size={24} strokeWidth={1.5} color={TEXT_TER} />
            <div style={{ fontSize: 13, fontWeight: 500, color: TEXT, textWrap: 'pretty' } as React.CSSProperties}>
              No pending annotations
            </div>
            <div style={{ fontSize: 11, color: TEXT_TER, lineHeight: 1.4, textWrap: 'pretty' } as React.CSSProperties}>
              All changes have been applied
            </div>
          </div>
        </div>
      </div>

      <Note>
        Click the buttons above to trigger toast spring-in animations. Each auto-dismisses after 2 seconds. Skeleton uses CSS shimmer. Spinner is driven by requestAnimationFrame.
      </Note>
    </div>
  )
}
