import { useState, useRef, useEffect, useCallback } from 'react'
import { MessageSquare, Send, Check, X, MoreHorizontal, Pencil, Trash2, ExternalLink, Copy, Github } from 'lucide-react'
import { N, A, F, S, R, T, ICON, FONT } from './tokens'
import { SPRING, useSpring } from './spring'

/* ── Constants ────────────────────────────── */

const MONO = 'SF Mono, Monaco, Inconsolata, monospace'
const SUCCESS_BG = 'oklch(0.18 0.04 155)'

const QUICK_REACTIONS = ['👍', '🤔', '🔥']

const MSG_MENU_ITEMS = [
  { label: 'Add as annotation', icon: <Pencil size={ICON.lg} strokeWidth={1.5} />, accent: true },
  { label: 'Delete', icon: <Trash2 size={ICON.lg} strokeWidth={1.5} />, destructive: true, separator: true },
]

const THREAD_MENU_ITEMS = [
  { label: 'Copy link', icon: <Copy size={ICON.lg} strokeWidth={1.5} /> },
  { label: 'Delete', icon: <Trash2 size={ICON.lg} strokeWidth={1.5} />, destructive: true, separator: true },
]

/* ── Primitives ────────────────────────────── */

function Avatar({ name, size = 28, color }: { name: string; size?: number; color?: string }) {
  const letter = name.charAt(0).toUpperCase()
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      backgroundColor: color || F.marker, color: 'oklch(0.08 0 0)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.4, fontWeight: 600, fontFamily: FONT,
    }}>
      {letter}
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
        width: 24, height: 24, borderRadius: R.control, border: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: N.txtTer, backgroundColor: hovered ? 'rgba(255,255,255,0.08)' : 'transparent',
        transition: 'background-color 0.1s ease', fontFamily: FONT,
        cursor: 'default',
        ...style,
      }}
    >
      {children}
    </button>
  )
}

function SpringDropdown({ items, onClose }: {
  items: { label: string; icon: React.ReactNode; accent?: boolean; destructive?: boolean; separator?: boolean }[]
  onClose: () => void
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
          position: 'absolute', top: '100%', right: 0, marginTop: S.xs, zIndex: 100,
          width: 208, background: N.card, borderRadius: R.card,
          border: `1px solid ${N.border}`,
          boxShadow: '0 4px 16px rgba(0,0,0,0.24), 0 1px 4px rgba(0,0,0,0.12)',
          padding: S.xs, fontFamily: FONT,
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
        width: '100%', padding: `${S.sm}px ${S.md}px`, borderRadius: R.control, border: 'none',
        fontSize: T.title,
        color: item.destructive
          ? (hovered ? F.danger : N.txtSec)
          : item.accent ? A.accent : N.txtPri,
        fontWeight: item.accent ? 500 : 400,
        backgroundColor: item.destructive && hovered
          ? 'oklch(0.18 0.06 28)'
          : hovered ? 'rgba(255,255,255,0.06)' : 'transparent',
        display: 'flex', alignItems: 'center', gap: S.sm,
        borderTop: item.separator ? `1px solid ${N.border}` : 'none',
        marginTop: item.separator ? S.xs : 0,
        fontFamily: FONT, textAlign: 'left',
        transition: 'all 0.1s ease',
        cursor: 'default',
      }}
    >
      <span style={{ width: ICON.lg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {item.icon}
      </span>
      {item.label}
    </button>
  )
}

function Reaction({ label, count, active, onClick }: { label: string; count: number; active?: boolean; onClick?: () => void }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: S.xs,
        padding: `2px ${S.sm}px`, borderRadius: R.panel,
        border: `1px solid ${active ? A.accent : hovered ? N.borderSoft : N.border}`,
        backgroundColor: active ? A.muted : hovered ? N.chromeSub : N.card,
        fontSize: T.caption, color: active ? A.accent : N.txtSec, fontWeight: 500, fontFamily: FONT,
        transition: 'all 0.1s ease', cursor: 'default',
      }}
    >
      {label} {count}
    </button>
  )
}

function ThreadMessage({ name, time, children, reactions, menuItems }: {
  name: string; time: string; children: React.ReactNode
  reactions?: { label: string; count: number; active?: boolean }[]
  menuItems?: { label: string; icon: React.ReactNode; accent?: boolean; destructive?: boolean; separator?: boolean }[]
}) {
  const [hovered, setHovered] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); if (!menuOpen) setMenuOpen(false) }}
      style={{
        display: 'flex', gap: S.sm, alignItems: 'flex-start',
        padding: S.xs, margin: -S.xs, borderRadius: R.card,
        backgroundColor: hovered ? 'rgba(255,255,255,0.04)' : 'transparent',
        transition: 'background-color 0.1s ease',
      }}
    >
      <Avatar name={name} size={28} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: S.sm, marginBottom: 2 }}>
          <span style={{ fontSize: T.title, fontWeight: 600, color: N.txtPri }}>{name}</span>
          <span style={{ fontSize: T.caption, color: N.txtTer }}>{time}</span>
          <div style={{ flex: 1 }} />
          <div style={{
            opacity: hovered || menuOpen ? 1 : 0,
            transition: 'opacity 0.1s ease',
            display: 'flex', alignItems: 'center', gap: 2,
          }}>
            {QUICK_REACTIONS.map(emoji => (
              <HoverButton key={emoji} title={emoji} style={{ width: 20, height: 20, fontSize: T.caption }}>
                {emoji}
              </HoverButton>
            ))}
            {menuItems && (
              <div style={{ position: 'relative' }}>
                <HoverButton onClick={() => setMenuOpen(o => !o)} title="More actions">
                  <MoreHorizontal size={ICON.lg} strokeWidth={1.5} />
                </HoverButton>
                {menuOpen && <SpringDropdown items={menuItems} onClose={() => setMenuOpen(false)} />}
              </div>
            )}
          </div>
        </div>
        <div style={{ fontSize: T.title, color: N.txtPri, lineHeight: 1.5, textWrap: 'pretty' } as React.CSSProperties}>
          {children}
        </div>
        {reactions && reactions.length > 0 && (
          <div style={{ display: 'flex', gap: S.xs, marginTop: S.xs }}>
            {reactions.map(r => <Reaction key={r.label} label={r.label} count={r.count} active={r.active} />)}
          </div>
        )}
      </div>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: T.caption, color: N.txtTer, marginBottom: S.sm, textWrap: 'pretty' } as React.CSSProperties}>{children}</div>
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: T.pill, color: N.txtTer, fontStyle: 'italic',
      padding: `${S.xs}px ${S.sm}px`, borderLeft: `2px solid ${N.border}`, marginTop: S.xs, textWrap: 'pretty',
    } as React.CSSProperties}>
      {children}
    </div>
  )
}

function StepBadge({ step }: { step: number }) {
  return (
    <div style={{
      width: 20, height: 20, borderRadius: '50%', backgroundColor: A.accent,
      color: 'oklch(0.08 0 0)', fontSize: T.pill, fontWeight: 700, fontFamily: FONT,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      {step}
    </div>
  )
}

function MiniCanvas({ children, style }: { children?: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      width: '100%', height: 160, backgroundColor: N.canvas, borderRadius: R.card,
      position: 'relative', overflow: 'hidden',
      border: `1px solid ${N.border}`,
      ...style,
    }}>
      {/* Fake frames */}
      <div style={{
        position: 'absolute', top: 24, left: 20,
        width: 80, height: 48, borderRadius: R.control,
        backgroundColor: N.card, border: `1px solid ${N.border}`,
      }} />
      <div style={{
        position: 'absolute', top: 32, left: 120,
        width: 96, height: 56, borderRadius: R.control,
        backgroundColor: N.card, border: `1px solid ${N.border}`,
      }} />
      {children}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   Step 1: Sign In
   ═══════════════════════════════════════════════════════ */

export function FlowStep1_SignIn() {
  const [phase, setPhase] = useState<'idle' | 'auth' | 'code' | 'done'>('idle')
  const cardRef = useRef<HTMLDivElement>(null)
  const cardSpring = useSpring(SPRING.snappy)

  useEffect(() => {
    if ((phase === 'auth' || phase === 'code' || phase === 'done') && cardRef.current) {
      cardSpring.state.value = 0.96
      cardSpring.state.velocity = 0
      cardSpring.set(1, (v) => {
        if (cardRef.current) {
          cardRef.current.style.transform = `scale(${v}) translateY(${(1 - v) * S.sm}px)`
          cardRef.current.style.opacity = `${Math.max(0, v)}`
        }
      })
    }
  }, [phase])

  return (
    <div style={{ fontFamily: FONT, display: 'flex', flexDirection: 'column', gap: S.xl, padding: S.sm }}>
      <div style={{
        fontSize: T.caption, fontWeight: 600, color: N.txtTer,
        textTransform: 'uppercase', letterSpacing: '0.05em',
        display: 'flex', alignItems: 'center', gap: S.sm,
      }}>
        <StepBadge step={1} />
        Sign In with GitHub
      </div>

      <div style={{
        width: 380, minHeight: 300, borderRadius: R.panel, backgroundColor: N.canvas,
        border: `1px solid ${N.border}`, position: 'relative', overflow: 'hidden',
      }}>
        {/* Fake frames */}
        <div style={{
          position: 'absolute', top: 40, left: 40,
          width: 120, height: 72, borderRadius: R.control,
          backgroundColor: N.card, border: `1px solid ${N.border}`,
        }} />
        <div style={{
          position: 'absolute', top: 56, left: 200,
          width: 100, height: 60, borderRadius: R.control,
          backgroundColor: N.card, border: `1px solid ${N.border}`,
        }} />

        {/* FABs */}
        <div style={{
          position: 'absolute', bottom: S.lg, right: S.lg,
          display: 'flex', flexDirection: 'column', gap: S.sm,
        }}>
          <button
            onClick={() => setPhase(phase === 'idle' ? 'auth' : 'idle')}
            style={{
              width: 40, height: 40, borderRadius: '50%', border: 'none',
              backgroundColor: A.accent, color: 'oklch(0.08 0 0)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
              cursor: 'default', position: 'relative',
            }}>
            <MessageSquare size={ICON.lg} strokeWidth={1.5} />
            {phase === 'done' && (
              <div style={{
                position: 'absolute', bottom: -2, right: -2,
                width: S.lg, height: S.lg, borderRadius: '50%',
                border: `2px solid ${N.canvas}`,
              }}>
                <Avatar name="Noam" size={S.lg} />
              </div>
            )}
          </button>
          <button style={{
            width: 40, height: 40, borderRadius: '50%', border: 'none',
            backgroundColor: A.accent, color: 'oklch(0.08 0 0)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
            cursor: 'default',
          }}>
            <Pencil size={ICON.lg} strokeWidth={1.5} />
          </button>
        </div>

        {/* Auth card */}
        {phase !== 'idle' && (
          <div ref={cardRef} style={{
            position: 'absolute', bottom: 72, right: S.lg,
            width: 260, backgroundColor: N.card, borderRadius: R.panel, padding: S.lg,
            border: `1px solid ${N.border}`,
            boxShadow: '0 4px 24px rgba(0,0,0,0.24), 0 1px 4px rgba(0,0,0,0.12)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: S.md,
            transform: 'scale(0.96)', opacity: 0,
          }}>
            {phase === 'auth' && (
              <>
                <Github size={24} strokeWidth={1.5} color={N.txtPri} />
                <div style={{ fontSize: T.title, fontWeight: 600, color: N.txtPri, textAlign: 'center' }}>
                  Sign in with GitHub
                </div>
                <div style={{ fontSize: T.body, color: N.txtSec, textAlign: 'center', lineHeight: 1.5, textWrap: 'pretty' } as React.CSSProperties}>
                  Comments are backed by GitHub Issues. Sign in to post and reply.
                </div>
                <button
                  onClick={() => setPhase('code')}
                  style={{
                    width: '100%', padding: `${S.sm}px ${S.lg}px`, borderRadius: R.card, border: 'none',
                    backgroundColor: N.txtPri, color: 'oklch(0.08 0 0)',
                    fontSize: T.title, fontWeight: 500, fontFamily: FONT, cursor: 'default',
                  }}>
                  Continue with GitHub
                </button>
              </>
            )}
            {phase === 'code' && (
              <>
                <div style={{ fontSize: T.body, color: N.txtSec, textAlign: 'center', lineHeight: 1.5, textWrap: 'pretty' } as React.CSSProperties}>
                  Enter this code at <span style={{ fontWeight: 600, color: N.txtPri }}>github.com/login/device</span>
                </div>
                <div style={{
                  padding: `${S.md}px ${S.xxl}px`, borderRadius: R.card,
                  backgroundColor: N.canvas, border: `1px solid ${N.border}`,
                  fontFamily: MONO, fontSize: 20, fontWeight: 700, color: N.txtPri,
                  letterSpacing: '0.1em', textAlign: 'center',
                }}>
                  ABCD-1234
                </div>
                <button
                  onClick={() => setPhase('done')}
                  style={{
                    padding: `${S.sm}px ${S.lg}px`, borderRadius: R.card, border: `1px solid ${N.border}`,
                    backgroundColor: N.card, fontSize: T.body, color: N.txtSec,
                    fontFamily: FONT, cursor: 'default',
                  }}>
                  I've entered the code
                </button>
              </>
            )}
            {phase === 'done' && (
              <>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', backgroundColor: SUCCESS_BG,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Check size={ICON.lg} strokeWidth={2} color={F.success} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: S.sm }}>
                  <Avatar name="Noam" size={32} />
                  <div>
                    <div style={{ fontSize: T.title, fontWeight: 600, color: N.txtPri }}>Noam</div>
                    <div style={{ fontSize: T.caption, color: N.txtTer }}>@madebynoam</div>
                  </div>
                </div>
                <div style={{ fontSize: T.caption, color: N.txtTer, textAlign: 'center', lineHeight: 1.4, textWrap: 'pretty' } as React.CSSProperties}>
                  Your avatar appears on the comment FAB, pins, and compose cards.
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <Note>
        Click the comment FAB to start the sign-in flow. Three states: auth prompt → device code → signed in. Avatar badge appears on the FAB after auth.
      </Note>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   Step 2: Targeting → Compose
   ═══════════════════════════════════════════════════════ */

export function FlowStep2_Compose() {
  const [phase, setPhase] = useState<'idle' | 'targeting' | 'compose'>('idle')
  const [text, setText] = useState('')
  const cardRef = useRef<HTMLDivElement>(null)
  const cardSpring = useSpring(SPRING.snappy)

  useEffect(() => {
    if (phase === 'compose' && cardRef.current) {
      cardSpring.state.value = 0.96
      cardSpring.state.velocity = 0
      cardSpring.set(1, (v) => {
        if (cardRef.current) {
          cardRef.current.style.transform = `scale(${v}) translateY(${(1 - v) * S.sm}px)`
          cardRef.current.style.opacity = `${Math.max(0, v)}`
        }
      })
    }
  }, [phase])

  return (
    <div style={{ fontFamily: FONT, display: 'flex', flexDirection: 'column', gap: S.xl, padding: S.sm }}>
      <div style={{
        fontSize: T.caption, fontWeight: 600, color: N.txtTer,
        textTransform: 'uppercase', letterSpacing: '0.05em',
        display: 'flex', alignItems: 'center', gap: S.sm,
      }}>
        <StepBadge step={2} />
        Target & Compose
      </div>

      <div style={{
        width: 380, minHeight: 340, borderRadius: R.panel, backgroundColor: N.canvas,
        border: `1px solid ${N.border}`, position: 'relative', overflow: 'hidden',
      }}>
        {/* Target element */}
        <div
          onClick={() => phase === 'targeting' && setPhase('compose')}
          style={{
            position: 'absolute', top: 40, left: 40,
            width: 200, height: 100, borderRadius: R.card,
            backgroundColor: N.card,
            border: phase === 'targeting' ? `2px solid ${A.accent}` : `1px solid ${N.border}`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: S.xs,
            cursor: phase === 'targeting' ? 'crosshair' : 'default',
          }}>
          <div style={{ fontSize: T.caption, fontWeight: 500, color: N.txtPri }}>PricingCard</div>
          <div style={{ fontSize: T.pill, color: N.txtTer }}>
            {phase === 'targeting' ? 'Click to place comment' : '$29/mo'}
          </div>
        </div>

        {/* Accent highlight */}
        {phase === 'targeting' && (
          <div style={{
            position: 'absolute', top: 38, left: 38,
            width: 204, height: 104, borderRadius: R.card + 2,
            backgroundColor: A.muted,
            border: `2px solid ${A.accent}`,
            pointerEvents: 'none',
          }} />
        )}

        {/* Compose card */}
        {phase === 'compose' && (
          <div ref={cardRef} style={{
            position: 'absolute', top: 148, left: 40,
            width: 280, backgroundColor: N.card, borderRadius: R.panel, padding: S.md,
            border: `1px solid ${N.border}`,
            boxShadow: '0 4px 24px rgba(0,0,0,0.24), 0 1px 4px rgba(0,0,0,0.12)',
            display: 'flex', flexDirection: 'column', gap: S.sm,
            transform: 'scale(0.96)', opacity: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: T.caption, color: N.txtTer, letterSpacing: '0.02em' }}>
                PricingCard &middot; h2
              </div>
              <HoverButton onClick={() => setPhase('idle')} title="Cancel">
                <X size={ICON.sm} strokeWidth={1.5} />
              </HoverButton>
            </div>
            <div style={{ display: 'flex', gap: S.sm, alignItems: 'flex-start' }}>
              <Avatar name="Noam" size={28} />
              <textarea
                value={text} onChange={e => setText(e.target.value)}
                placeholder="Add a comment..."
                style={{
                  flex: 1, minHeight: 56, padding: `${S.sm}px ${S.sm}px`, borderRadius: R.card,
                  backgroundColor: N.chromeSub, border: `1px solid ${N.border}`,
                  fontSize: T.body, color: text ? N.txtPri : N.txtTer, fontFamily: FONT,
                  resize: 'vertical', outline: 'none', lineHeight: 1.5,
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: S.sm }}>
              <button onClick={() => setPhase('idle')} style={{
                padding: `${S.sm}px ${S.md}px`, borderRadius: R.card, border: `1px solid ${N.border}`,
                backgroundColor: N.card, fontSize: T.body, color: N.txtSec,
                fontWeight: 400, fontFamily: FONT, cursor: 'default',
              }}>Cancel</button>
              <button style={{
                padding: `${S.sm}px ${S.md}px`, borderRadius: R.card, border: 'none',
                backgroundColor: text.trim() ? A.accent : A.muted,
                color: text.trim() ? 'oklch(1 0 0)' : N.txtTer,
                fontSize: T.body, fontWeight: 500, fontFamily: FONT, cursor: 'default',
                transition: 'background-color 0.1s ease, color 0.1s ease',
              }}>Post</button>
            </div>
          </div>
        )}

        {/* FAB */}
        <button
          onClick={() => setPhase(phase === 'idle' ? 'targeting' : 'idle')}
          style={{
            position: 'absolute', bottom: S.lg, right: S.lg,
            width: 40, height: 40, borderRadius: '50%', border: 'none',
            backgroundColor: phase === 'targeting' ? N.txtPri : A.accent, color: 'oklch(0.08 0 0)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
            cursor: 'default',
          }}>
          {phase === 'targeting' ? <X size={ICON.lg} strokeWidth={1.5} /> : <MessageSquare size={ICON.lg} strokeWidth={1.5} />}
        </button>
      </div>

      <Note>
        Click the FAB to enter targeting mode. Accent highlight follows cursor. Click an element to open the compose card. Textarea is typeable. Post activates when text is entered.
      </Note>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   Step 3: Thread — full card
   ═══════════════════════════════════════════════════════ */

export function FlowStep3_Thread() {
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
    <div style={{ fontFamily: FONT, display: 'flex', flexDirection: 'column', gap: S.xl, padding: S.sm }}>
      <div style={{
        fontSize: T.caption, fontWeight: 600, color: N.txtTer,
        textTransform: 'uppercase', letterSpacing: '0.05em',
        display: 'flex', alignItems: 'center', gap: S.sm,
      }}>
        <StepBadge step={3} />
        Thread View
      </div>

      <div style={{
        width: 380, background: N.card, borderRadius: R.panel, padding: S.lg,
        boxShadow: '0 4px 24px rgba(0,0,0,0.24), 0 1px 4px rgba(0,0,0,0.12)',
        border: `1px solid ${N.border}`, fontFamily: FONT,
        display: 'flex', flexDirection: 'column', gap: S.md,
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: S.sm }}>
            <span style={{ fontSize: T.title, fontWeight: 600, color: N.txtPri }}>Comment</span>
            <span style={{ fontSize: T.caption, color: N.txtTer }}>2 replies</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: S.xs, position: 'relative' }}>
            <div style={{ position: 'relative' }}>
              <HoverButton onClick={() => setThreadMenuOpen(o => !o)} title="Thread actions">
                <MoreHorizontal size={ICON.lg} strokeWidth={1.5} />
              </HoverButton>
              {threadMenuOpen && <SpringDropdown items={THREAD_MENU_ITEMS} onClose={() => setThreadMenuOpen(false)} />}
            </div>
            <HoverButton title="Resolve thread">
              <Check size={ICON.md} strokeWidth={1.5} />
            </HoverButton>
            <HoverButton title="Close panel">
              <X size={ICON.md} strokeWidth={1.5} />
            </HoverButton>
          </div>
        </div>

        {/* Element context */}
        <div style={{
          fontSize: T.caption, color: N.txtTer, letterSpacing: '0.02em',
          padding: `${S.xs}px 0`, borderBottom: `1px solid ${N.border}`,
        }}>
          PricingCard &middot; h2
        </div>

        {/* Messages */}
        <ThreadMessage name="Gustav" time="5 min ago" menuItems={MSG_MENU_ITEMS}>
          The heading font size feels too large for this card. Should be 20px to match the design system.
        </ThreadMessage>

        <ThreadMessage name="Noam" time="3 min ago" reactions={[{ label: '👍', count: 2, active: true }, { label: '🔥', count: 1 }]} menuItems={MSG_MENU_ITEMS}>
          Good catch. I also think the border-radius should be 8 instead of 6 for consistency with the rest of the system.
        </ThreadMessage>

        <ThreadMessage name="Sarah" time="1 min ago" menuItems={MSG_MENU_ITEMS}>
          Agreed on both. The spacing tokens doc says 16px for panel gutters.
        </ThreadMessage>

        {/* Reply input */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: S.sm,
          padding: `${S.sm}px 0 0`, borderTop: `1px solid ${N.border}`,
        }}>
          <Avatar name="Noam" size={24} />
          <input
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            placeholder="Reply"
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            style={{
              flex: 1, padding: `${S.sm}px ${S.md}px`, borderRadius: R.pill,
              backgroundColor: N.chromeSub, fontSize: T.title, color: replyText ? N.txtPri : N.txtTer,
              border: 'none', outline: 'none', fontFamily: FONT,
            }}
          />
          <button
            ref={sendRef}
            onClick={handleSend}
            title="Send"
            style={{
              width: 28, height: 28, borderRadius: '50%', border: 'none',
              backgroundColor: replyText.trim() ? A.accent : N.chromeSub,
              color: replyText.trim() ? 'oklch(1 0 0)' : N.txtTer,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'default', transition: 'background-color 0.1s ease, color 0.1s ease',
            }}
          >
            <Send size={ICON.md} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <Note>
        Hover messages to see quick reactions (👍 🤔 🔥) and ⋯ menu. Menus open with spring scaleY. Reply input is typeable — Enter or click Send. Send has spring press animation.
      </Note>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   Step 4: Pins on Canvas
   ═══════════════════════════════════════════════════════ */

export function FlowStep4_Pins() {
  return (
    <div style={{ fontFamily: FONT, display: 'flex', flexDirection: 'column', gap: S.xl, padding: S.sm }}>
      <div style={{
        fontSize: T.caption, fontWeight: 600, color: N.txtTer,
        textTransform: 'uppercase', letterSpacing: '0.05em',
        display: 'flex', alignItems: 'center', gap: S.sm,
      }}>
        <StepBadge step={4} />
        Avatar Pins
      </div>

      <MiniCanvas style={{ width: 380, height: 200 }}>
        {/* Pin 1 — active, with replies */}
        <div style={{ position: 'absolute', top: 16, left: 84 }}>
          <Avatar name="Gustav" size={28} />
          <div style={{
            position: 'absolute', top: -4, right: -8,
            minWidth: S.lg, height: S.lg, borderRadius: R.card, backgroundColor: A.accent,
            color: 'oklch(0.08 0 0)', fontSize: 9, fontWeight: 700, fontFamily: FONT,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: `0 ${S.xs}px`, border: `2px solid ${N.canvas}`,
          }}>
            3
          </div>
        </div>

        {/* Pin 2 — active, no replies */}
        <div style={{ position: 'absolute', top: 48, left: 200 }}>
          <Avatar name="Sarah" size={28} />
        </div>

        {/* Pin 3 — with annotation dot */}
        <div style={{ position: 'absolute', top: 88, left: 260 }}>
          <Avatar name="Noam" size={28} />
          <div style={{
            position: 'absolute', bottom: -2, right: -2,
            width: 10, height: 10, borderRadius: '50%',
            backgroundColor: A.accent, border: `2px solid ${N.canvas}`,
          }} />
        </div>

        {/* Pin 4 — resolved */}
        <div style={{ position: 'absolute', top: 120, left: 60, opacity: 0.5 }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%', backgroundColor: F.resolved,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Check size={ICON.md} strokeWidth={2} color="oklch(0.08 0 0)" />
          </div>
        </div>
      </MiniCanvas>

      {/* Legend */}
      <div style={{
        display: 'flex', gap: S.xl, padding: `${S.sm}px ${S.md}px`,
        backgroundColor: N.chromeSub, borderRadius: R.card, border: `1px solid ${N.border}`,
      }}>
        <LegendRow>
          <Avatar name="G" size={18} />
          <span>Active (28px)</span>
        </LegendRow>
        <LegendRow>
          <div style={{ position: 'relative' }}>
            <Avatar name="G" size={18} />
            <div style={{
              position: 'absolute', top: -3, right: -6,
              minWidth: 12, height: 12, borderRadius: 6, backgroundColor: A.accent,
              color: 'oklch(0.08 0 0)', fontSize: 7, fontWeight: 700, fontFamily: FONT,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '0 2px', border: `1.5px solid ${N.chromeSub}`,
            }}>3</div>
          </div>
          <span>Reply badge</span>
        </LegendRow>
        <LegendRow>
          <div style={{ position: 'relative' }}>
            <Avatar name="N" size={18} />
            <div style={{
              position: 'absolute', bottom: -1, right: -1,
              width: 8, height: 8, borderRadius: '50%',
              backgroundColor: A.accent, border: `1.5px solid ${N.chromeSub}`,
            }} />
          </div>
          <span>Has annotation</span>
        </LegendRow>
        <LegendRow>
          <div style={{ opacity: 0.5 }}>
            <div style={{
              width: 18, height: 18, borderRadius: '50%', backgroundColor: F.resolved,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Check size={10} strokeWidth={2} color="oklch(0.08 0 0)" />
            </div>
          </div>
          <span>Resolved</span>
        </LegendRow>
      </div>

      <Note>
        Pins track element positions via rAF (same pattern as annotation markers). Reply count badge top-right. Accent dot bottom-right means an annotation was promoted from this thread. Resolved pins fade to 50% opacity.
      </Note>
    </div>
  )
}

function LegendRow({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: S.sm, fontSize: T.pill, color: N.txtSec }}>
      {children}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   Step 5: Promote to Annotation
   ═══════════════════════════════════════════════════════ */

export function FlowStep5_Promote() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [promoted, setPromoted] = useState(false)
  const bannerRef = useRef<HTMLDivElement>(null)
  const bannerSpring = useSpring(SPRING.snappy)

  useEffect(() => {
    if (promoted && bannerRef.current) {
      bannerSpring.state.value = 0.96
      bannerSpring.state.velocity = 0
      bannerSpring.set(1, (v) => {
        if (bannerRef.current) {
          bannerRef.current.style.transform = `scale(${v})`
          bannerRef.current.style.opacity = `${Math.max(0, v)}`
        }
      })
    }
  }, [promoted])

  const handlePromote = () => {
    setMenuOpen(false)
    setPromoted(true)
  }

  return (
    <div style={{ fontFamily: FONT, display: 'flex', flexDirection: 'column', gap: S.xl, padding: S.sm }}>
      <div style={{
        fontSize: T.caption, fontWeight: 600, color: N.txtTer,
        textTransform: 'uppercase', letterSpacing: '0.05em',
        display: 'flex', alignItems: 'center', gap: S.sm,
      }}>
        <StepBadge step={5} />
        Promote to Annotation
      </div>

      {/* Thread card showing the message with ⋯ menu open */}
      <div style={{
        width: 380, background: N.card, borderRadius: R.panel, padding: S.lg,
        boxShadow: '0 4px 24px rgba(0,0,0,0.24), 0 1px 4px rgba(0,0,0,0.12)',
        border: `1px solid ${N.border}`, fontFamily: FONT,
        display: 'flex', flexDirection: 'column', gap: S.md,
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: S.sm }}>
            <span style={{ fontSize: T.title, fontWeight: 600, color: N.txtPri }}>Comment</span>
            <span style={{ fontSize: T.caption, color: N.txtTer }}>1 reply</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: S.xs }}>
            <HoverButton title="Resolve thread"><Check size={ICON.md} strokeWidth={1.5} /></HoverButton>
            <HoverButton title="Close panel"><X size={ICON.md} strokeWidth={1.5} /></HoverButton>
          </div>
        </div>

        <div style={{ fontSize: T.caption, color: N.txtTer, letterSpacing: '0.02em', padding: `${S.xs}px 0`, borderBottom: `1px solid ${N.border}` }}>
          PricingCard &middot; h2
        </div>

        {/* Message with hover + ⋯ menu */}
        <div style={{
          display: 'flex', gap: S.sm, alignItems: 'flex-start',
          padding: S.xs, margin: -S.xs, borderRadius: R.card,
          backgroundColor: 'rgba(255,255,255,0.04)',
        }}>
          <Avatar name="Gustav" size={28} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: S.sm, marginBottom: 2 }}>
              <span style={{ fontSize: T.title, fontWeight: 600, color: N.txtPri }}>Gustav</span>
              <span style={{ fontSize: T.caption, color: N.txtTer }}>5 min ago</span>
              <div style={{ flex: 1 }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {QUICK_REACTIONS.map(emoji => (
                  <HoverButton key={emoji} title={emoji} style={{ width: 20, height: 20, fontSize: T.caption }}>
                    {emoji}
                  </HoverButton>
                ))}
                <div style={{ position: 'relative' }}>
                  <HoverButton onClick={() => setMenuOpen(o => !o)} title="More actions">
                    <MoreHorizontal size={ICON.lg} strokeWidth={1.5} />
                  </HoverButton>
                  {menuOpen && (
                    <SpringDropdown
                      items={[
                        { label: 'Add as annotation', icon: <Pencil size={ICON.lg} strokeWidth={1.5} />, accent: true },
                        { label: 'Delete', icon: <Trash2 size={ICON.lg} strokeWidth={1.5} />, destructive: true, separator: true },
                      ]}
                      onClose={handlePromote}
                    />
                  )}
                </div>
              </div>
            </div>
            <div style={{ fontSize: T.title, color: N.txtPri, lineHeight: 1.5, textWrap: 'pretty' } as React.CSSProperties}>
              Make the heading 20px and semibold
            </div>
          </div>
        </div>

        {/* Banner — appears after promoting */}
        {promoted && (
          <div ref={bannerRef} style={{
            padding: `${S.sm}px ${S.md}px`, borderRadius: R.card,
            backgroundColor: A.muted,
            border: `1px solid ${N.border}`,
            display: 'flex', alignItems: 'center', gap: S.sm,
            transform: 'scale(0.96)', opacity: 0,
          }}>
            <Pencil size={ICON.sm} strokeWidth={1.5} color={A.accent} />
            <span style={{ fontSize: T.body, fontWeight: 500, color: A.accent }}>
              Annotation #4 — Queued
            </span>
          </div>
        )}
      </div>

      <Note>
        Hover the message to see quick reactions + ⋯ menu. Click ⋯ → "Add as annotation" to promote. The queued banner springs in below the message. Thread stays open for discussion.
      </Note>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   Step 6: Copy Link → Deep Link
   ═══════════════════════════════════════════════════════ */

export function FlowStep6_DeepLink() {
  const [copied, setCopied] = useState(false)
  const toastRef = useRef<HTMLDivElement>(null)
  const toastSpring = useSpring(SPRING.snappy)

  const handleCopy = useCallback(() => {
    setCopied(true)
    if (toastRef.current) {
      toastSpring.state.value = 0
      toastSpring.set(1, (v) => {
        if (toastRef.current) {
          toastRef.current.style.transform = `translateY(${(1 - v) * S.lg}px)`
          toastRef.current.style.opacity = `${Math.max(0, v)}`
        }
      })
    }
    setTimeout(() => {
      toastSpring.set(0, (v) => {
        if (toastRef.current) {
          toastRef.current.style.transform = `translateY(${(1 - v) * S.lg}px)`
          toastRef.current.style.opacity = `${Math.max(0, v)}`
        }
        if (v <= 0.01) setCopied(false)
      })
    }, 2000)
  }, [toastSpring])

  return (
    <div style={{ fontFamily: FONT, display: 'flex', flexDirection: 'column', gap: S.xl, padding: S.sm }}>
      <div style={{
        fontSize: T.caption, fontWeight: 600, color: N.txtTer,
        textTransform: 'uppercase', letterSpacing: '0.05em',
        display: 'flex', alignItems: 'center', gap: S.sm,
      }}>
        <StepBadge step={6} />
        Copy Link → Deep Link
      </div>

      {/* URL bar */}
      <div style={{
        padding: `${S.md}px ${S.lg}px`, borderRadius: R.panel, backgroundColor: N.card,
        border: `1px solid ${N.border}`,
        boxShadow: '0 2px 8px rgba(0,0,0,0.16)',
        display: 'flex', alignItems: 'center', gap: S.sm,
      }}>
        <ExternalLink size={ICON.md} strokeWidth={1.5} color={N.txtTer} />
        <span style={{ fontFamily: MONO, fontSize: T.body, color: N.txtSec }}>
          your-team.github.io/design
        </span>
        <span style={{ fontFamily: MONO, fontSize: T.body, color: A.accent, fontWeight: 600 }}>
          ?comment=42
        </span>
        <div style={{ flex: 1 }} />
        <button
          onClick={handleCopy}
          style={{
            padding: `${S.sm}px ${S.md}px`, borderRadius: R.card, border: `1px solid ${N.border}`,
            backgroundColor: N.card, fontSize: T.caption, fontWeight: 500,
            color: N.txtSec, fontFamily: FONT, cursor: 'default',
            display: 'flex', alignItems: 'center', gap: S.xs,
          }}>
          <Copy size={ICON.sm} strokeWidth={1.5} />
          Copy
        </button>
      </div>

      {/* Flow */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: S.sm,
        padding: S.lg, borderRadius: R.panel, backgroundColor: N.chromeSub,
        border: `1px solid ${N.border}`,
      }}>
        <FlowChip label="Open link" />
        <FlowArrow />
        <FlowChip label="Canvas loads" />
        <FlowArrow />
        <FlowChip label="Scroll to pin" />
        <FlowArrow />
        <FlowChip label="Thread auto-opens" highlight />
      </div>

      {/* Toast */}
      <div style={{
        height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div ref={toastRef} style={{
          padding: `${S.sm}px ${S.xl}px`, borderRadius: R.pill,
          backgroundColor: N.txtPri, color: 'oklch(0.08 0 0)',
          fontSize: T.title, fontWeight: 500, fontFamily: FONT,
          boxShadow: '0 2px 12px rgba(0,0,0,0.32)',
          transform: `translateY(${S.lg}px)`, opacity: 0,
        }}>
          Link copied to clipboard
        </div>
      </div>

      <Note>
        Thread menu → Copy link copies the shared canvai URL with ?comment=ID. When a collaborator opens it, the canvas scrolls to the pin and auto-opens the thread card. Toast confirms the copy.
      </Note>
    </div>
  )
}

function FlowChip({ label, highlight }: { label: string; highlight?: boolean }) {
  return (
    <div style={{
      padding: `${S.sm}px ${S.md}px`, borderRadius: R.card, fontSize: T.caption, fontWeight: 500,
      color: highlight ? A.accent : N.txtSec,
      backgroundColor: highlight ? A.muted : N.card,
      border: `1px solid ${highlight ? A.border : N.border}`,
      fontFamily: FONT, whiteSpace: 'nowrap',
    }}>
      {label}
    </div>
  )
}

function FlowArrow() {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" style={{ flexShrink: 0 }}>
      <path d="M1 6 L11 6 M8 2 L13 6 L8 10" stroke={N.txtTer} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════
   Step 7: Resolve
   ═══════════════════════════════════════════════════════ */

export function FlowStep7_Resolve() {
  const [resolved, setResolved] = useState(false)
  const pinRef = useRef<HTMLDivElement>(null)
  const pinSpring = useSpring(SPRING.soft)

  const handleResolve = useCallback(() => {
    setResolved(true)
    pinSpring.set(1, (v) => {
      if (pinRef.current) {
        pinRef.current.style.opacity = `${1 - v * 0.5}`
      }
    })
  }, [pinSpring])

  return (
    <div style={{ fontFamily: FONT, display: 'flex', flexDirection: 'column', gap: S.xl, padding: S.sm }}>
      <div style={{
        fontSize: T.caption, fontWeight: 600, color: N.txtTer,
        textTransform: 'uppercase', letterSpacing: '0.05em',
        display: 'flex', alignItems: 'center', gap: S.sm,
      }}>
        <StepBadge step={7} />
        Resolve Thread
      </div>

      <MiniCanvas style={{ width: 380, height: 180 }}>
        {/* Pin — fades on resolve */}
        <div ref={pinRef} style={{ position: 'absolute', top: 16, left: 84 }}>
          {resolved ? (
            <div style={{
              width: 28, height: 28, borderRadius: '50%', backgroundColor: F.resolved,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Check size={ICON.md} strokeWidth={2} color="oklch(0.08 0 0)" />
            </div>
          ) : (
            <>
              <Avatar name="Gustav" size={28} />
              <div style={{
                position: 'absolute', top: -4, right: -8,
                minWidth: S.lg, height: S.lg, borderRadius: R.card, backgroundColor: A.accent,
                color: 'oklch(0.08 0 0)', fontSize: 9, fontWeight: 700, fontFamily: FONT,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: `0 ${S.xs}px`, border: `2px solid ${N.canvas}`,
              }}>2</div>
            </>
          )}
        </div>

        {/* Resolve button overlay */}
        {!resolved && (
          <button
            onClick={handleResolve}
            style={{
              position: 'absolute', bottom: S.md, left: '50%', transform: 'translateX(-50%)',
              padding: `${S.sm}px ${S.lg}px`, borderRadius: R.card, border: `1px solid ${N.border}`,
              backgroundColor: N.card, fontSize: T.caption, fontWeight: 500,
              color: N.txtSec, fontFamily: FONT, cursor: 'default',
              display: 'flex', alignItems: 'center', gap: S.sm,
              boxShadow: '0 2px 8px rgba(0,0,0,0.16)',
            }}>
            <Check size={ICON.sm} strokeWidth={1.5} />
            Click to resolve
          </button>
        )}

        {resolved && (
          <div style={{
            position: 'absolute', bottom: S.md, left: '50%', transform: 'translateX(-50%)',
            fontSize: T.caption, color: N.txtTer,
          }}>
            Pin fades · GitHub Issue closes
          </div>
        )}
      </MiniCanvas>

      <Note>
        Click ✓ in the thread header to resolve. The avatar pin fades to a gray checkmark at 50% opacity. The GitHub Issue closes automatically.
      </Note>
    </div>
  )
}
