import { useState } from 'react'
import { Reply, Smile, Pencil, Link2, Trash2, Send, MoreHorizontal, Check, X, MessageSquare } from 'lucide-react'

const ACCENT = '#E8590C'
const COMMENT = '#6366F1'
const COMMENT_HOVER = '#4F46E5'
const SURFACE = '#FFFFFF'
const BORDER = '#E5E7EB'
const TEXT = '#1F2937'
const TEXT_SEC = '#6B7280'
const TEXT_TER = '#9CA3AF'
const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
const CARD_W = 380

/* ── Primitives ────────────────────────────────────── */

function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  const colors: Record<string, string> = {
    G: '#6366F1', N: ACCENT, S: '#0EA5E9', M: '#8B5CF6', A: '#10B981',
  }
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

function Mention({ children }: { children: string }) {
  return <span style={{ color: '#2563EB', fontWeight: 500 }}>{children}</span>
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
        transition: 'all 0.1s ease',
      }}
    >
      {label} {count}
    </button>
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
        ...style,
      }}
    >
      {children}
    </button>
  )
}

function MenuDots({ onClick }: { onClick?: () => void }) {
  return (
    <HoverButton onClick={onClick} title="More actions">
      <MoreHorizontal size={16} strokeWidth={1.5} />
    </HoverButton>
  )
}

function DropdownMenu({ items, onClose }: {
  items: { label: string; icon: React.ReactNode; accent?: boolean; destructive?: boolean; separator?: boolean }[]
  onClose: () => void
}) {
  return (
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={onClose} />
      <div style={{
        position: 'absolute', top: '100%', right: 0, marginTop: 4, zIndex: 100,
        width: 208, background: SURFACE, borderRadius: 8,
        border: `1px solid ${BORDER}`,
        boxShadow: '0 4px 16px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
        padding: 4, fontFamily: FONT,
      }}>
        {items.map(item => (
          <MenuRow key={item.label} item={item} onClose={onClose} />
        ))}
      </div>
    </>
  )
}

function MenuRow({ item, onClose }: {
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
      }}
    >
      <span style={{ width: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {item.icon}
      </span>
      {item.label}
    </button>
  )
}

/** Per-message actions — slim: reply is at bottom, reactions inline, link on thread */
const MSG_MENU = [
  { label: 'Add as annotation', icon: <Pencil size={16} strokeWidth={1.5} />, accent: true },
  { label: 'Delete', icon: <Trash2 size={16} strokeWidth={1.5} />, destructive: true, separator: true },
]

const QUICK_REACTIONS = [
  { emoji: '👍', label: 'thumbs up' },
  { emoji: '🤔', label: 'thinking' },
  { emoji: '🔥', label: 'fire' },
]

/** Card-level (thread) actions */
const THREAD_MENU = [
  { label: 'Copy thread link', icon: <Link2 size={16} strokeWidth={1.5} /> },
  { label: 'Mute thread', icon: <Smile size={16} strokeWidth={1.5} /> },
  { label: 'Delete thread', icon: <Trash2 size={16} strokeWidth={1.5} />, destructive: true, separator: true },
]

function ReplyInput({ name }: { name: string }) {
  const [value, setValue] = useState('')
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '8px 0 0', borderTop: `1px solid ${BORDER}`,
    }}>
      <Avatar name={name} size={24} />
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Reply"
        style={{
          flex: 1, padding: '8px 12px', borderRadius: 20,
          backgroundColor: '#F3F4F6', fontSize: 13, color: value ? TEXT : TEXT_TER,
          border: 'none', outline: 'none', fontFamily: FONT,
        }}
      />
      <HoverButton title="Send" style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: value ? ACCENT : '#F3F4F6', color: value ? '#fff' : TEXT_TER }}>
        <Send size={14} strokeWidth={1.5} />
      </HoverButton>
    </div>
  )
}

function CardShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      width: CARD_W, background: SURFACE, borderRadius: 12, padding: 16,
      boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
      border: `1px solid ${BORDER}`, fontFamily: FONT,
      display: 'flex', flexDirection: 'column', gap: 12,
    }}>
      {children}
    </div>
  )
}

/** Card header showing the pinned element + thread controls */
function CardHeader({ element, count, extra, threadMenuOpen, onThreadMenu }: {
  element: string
  count?: number
  extra?: React.ReactNode
  threadMenuOpen?: boolean
  onThreadMenu?: () => void
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>Comment</span>
        {count != null && count > 0 && (
          <span style={{ fontSize: 11, color: TEXT_TER }}>{count} {count === 1 ? 'reply' : 'replies'}</span>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, position: 'relative' }}>
        {extra}
        <div style={{ position: 'relative' }}>
          <MenuDots onClick={onThreadMenu} />
          {threadMenuOpen && <DropdownMenu items={THREAD_MENU} onClose={onThreadMenu!} />}
        </div>
        <HoverButton title="Resolve thread">
          <Check size={14} strokeWidth={1.5} />
        </HoverButton>
        <HoverButton title="Close panel">
          <X size={14} strokeWidth={1.5} />
        </HoverButton>
      </div>
    </div>
  )
}

/** Element context bar — shows what this comment is pinned to */
function ElementContext({ text }: { text: string }) {
  return (
    <div style={{
      fontSize: 11, color: TEXT_TER, letterSpacing: '0.02em',
      padding: '4px 0', borderBottom: `1px solid ${BORDER}`,
    }}>
      {text}
    </div>
  )
}

function Message({ name, time, children }: {
  name: string; time: string; children: React.ReactNode
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
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
            {QUICK_REACTIONS.map(r => (
              <HoverButton key={r.label} title={r.label} style={{ width: 20, height: 20, fontSize: 11 }}>
                {r.emoji}
              </HoverButton>
            ))}
            <div style={{ position: 'relative' }}>
              <MenuDots onClick={() => setMenuOpen(o => !o)} />
              {menuOpen && <DropdownMenu items={MSG_MENU} onClose={() => setMenuOpen(false)} />}
            </div>
          </div>
        </div>
        <div style={{ fontSize: 13, color: TEXT, lineHeight: 1.5, textWrap: 'pretty' } as React.CSSProperties}>
          {children}
        </div>
      </div>
    </div>
  )
}

function SectionLabel({ children }: { children: string }) {
  return <div style={{ fontSize: 11, color: TEXT_TER, marginBottom: 8 }}>{children}</div>
}

function Note({ children }: { children: string }) {
  return (
    <div style={{
      fontSize: 10, color: TEXT_TER, fontStyle: 'italic',
      padding: '4px 8px', borderLeft: `2px solid ${BORDER}`, marginTop: 4, textWrap: 'pretty',
    }}>
      {children}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   EXPORTED FRAMES
   ═══════════════════════════════════════════════════════ */

/* ── 1. Anatomy — labeled breakdown of a comment card ── */

export function CommentAnatomyPreview() {
  return (
    <div style={{ fontFamily: FONT, display: 'flex', flexDirection: 'column', gap: 20, padding: 8 }}>
      <div style={{
        fontSize: 13, fontWeight: 600, color: TEXT_TER,
        textTransform: 'uppercase', letterSpacing: '0.05em',
      }}>
        Comment Card — Anatomy
      </div>

      <CardShell>
        {/* Header with annotations */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>Comment</span>
            <span style={{ fontSize: 11, color: TEXT_TER }}>2 replies</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {/* Labeled icons */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <HoverButton title="Thread actions">
                <MoreHorizontal size={16} strokeWidth={1.5} />
              </HoverButton>
              <span style={{ fontSize: 8, color: COMMENT, fontWeight: 500 }}>thread menu</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <HoverButton title="Resolve thread">
                <Check size={14} strokeWidth={1.5} />
              </HoverButton>
              <span style={{ fontSize: 8, color: COMMENT, fontWeight: 500 }}>resolve</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <HoverButton title="Close panel">
                <X size={14} strokeWidth={1.5} />
              </HoverButton>
              <span style={{ fontSize: 8, color: COMMENT, fontWeight: 500 }}>close</span>
            </div>
          </div>
        </div>

        <ElementContext text="ButtonSamples · button" />

        <Message name="Gustav" time="2 min ago">
          <Mention>@Noam</Mention> the padding feels tight here, should be 16px
        </Message>

        <ReplyInput name="Noam" />
      </CardShell>

      <Note>
        Header ··· = thread-level actions (copy link, mute, delete thread). Per-message: quick reactions (👍 🤔 🔥) + ··· menu (add as annotation, delete).
      </Note>
      <Note>
        Checkmark = resolve thread (closes the GitHub Issue). X = dismiss the panel (thread stays open).
      </Note>
      <Note>
        Element context bar shows what the comment is pinned to (component · element tag).
      </Note>
    </div>
  )
}

/* ── 2. Card states ───────────────────────────────── */

export function CommentCardStatesPreview() {
  const [composing, setComposing] = useState('')
  return (
    <div style={{ fontFamily: FONT, display: 'flex', flexDirection: 'column', gap: 24, padding: 8 }}>
      <div style={{
        fontSize: 13, fontWeight: 600, color: TEXT_TER,
        textTransform: 'uppercase', letterSpacing: '0.05em',
      }}>
        Card States
      </div>

      {/* Composing */}
      <div>
        <SectionLabel>Composing — first message, no thread controls yet</SectionLabel>
        <CardShell>
          {/* Simplified header: no thread menu or resolve — thread doesn't exist yet */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>New comment</span>
            <HoverButton title="Close panel">
              <X size={14} strokeWidth={1.5} />
            </HoverButton>
          </div>
          <ElementContext text="TopBar · div" />
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <Avatar name="Noam" size={28} />
            <textarea
              value={composing}
              onChange={e => setComposing(e.target.value)}
              placeholder="Add a comment..."
              style={{
                flex: 1, padding: '8px 12px', borderRadius: 8,
                backgroundColor: '#F9FAFB', border: `1px solid ${BORDER}`,
                fontSize: 13, color: composing ? TEXT : TEXT_TER, minHeight: 56, lineHeight: 1.5,
                resize: 'vertical', outline: 'none', fontFamily: FONT,
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button
              onClick={() => setComposing('')}
              style={{
                padding: '8px 12px', background: 'transparent', color: TEXT_SEC,
                border: `1px solid ${BORDER}`, borderRadius: 8,
                fontSize: 12, fontWeight: 500, fontFamily: FONT,
              }}
            >Cancel</button>
            <button style={{
              padding: '8px 12px',
              background: composing.trim() ? ACCENT : 'rgba(232,89,12,0.15)',
              color: composing.trim() ? '#fff' : TEXT_TER,
              border: 'none', borderRadius: 8,
              fontSize: 12, fontWeight: 500, fontFamily: FONT,
            }}>Post</button>
          </div>
        </CardShell>
      </div>

      {/* Single message */}
      <div>
        <SectionLabel>Posted — single message, hover for per-message ···</SectionLabel>
        <CardShell>
          <CardHeader element="ButtonSamples · button" />
          <ElementContext text="ButtonSamples · button" />
          <Message name="Gustav" time="2 min ago">
            <Mention>@Noam</Mention> here is the step form we did for Match me with an agency
          </Message>
          <ReplyInput name="Noam" />
        </CardShell>
      </div>

      {/* Thread */}
      <div>
        <SectionLabel>Thread — multiple replies with reactions</SectionLabel>
        <CardShell>
          <CardHeader element="SidebarOption · span" count={2} />
          <ElementContext text="SidebarOption · span" />
          <Message name="Gustav" time="1 day ago">
            <Mention>@Noam</Mention> here is the step form we did for Match me with an agency
          </Message>
          <Message name="Noam" time="1 day ago">
            Nice, looks like we use that pagination still in prod
          </Message>
          <Message name="Noam" time="1 day ago">
            <Mention>@Gustav</Mention> the client forms should follow this style, not Core.
            <div style={{ marginTop: 4 }}>Core is only for the agencies.</div>
            <div style={{ marginTop: 8, display: 'flex', gap: 4 }}>
              <Reaction label="+1" count={2} />
              <Reaction label="Agreed" count={1} />
            </div>
          </Message>
          <ReplyInput name="Noam" />
        </CardShell>
      </div>
    </div>
  )
}

/* ── 3. Annotation promotion flow ─────────────────── */

export function CommentAnnotationFlowPreview() {
  const [menu, setMenu] = useState(false)

  return (
    <div style={{ fontFamily: FONT, display: 'flex', flexDirection: 'column', gap: 24, padding: 8 }}>
      <div style={{
        fontSize: 13, fontWeight: 600, color: TEXT_TER,
        textTransform: 'uppercase', letterSpacing: '0.05em',
      }}>
        Annotation Promotion
      </div>

      {/* Step 1: menu with "Add as annotation" */}
      <div>
        <SectionLabel>Step 1 — User clicks ··· on a message, selects "Add as annotation"</SectionLabel>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <HoverButton onClick={() => setMenu(o => !o)} style={{
            width: 32, height: 32, borderRadius: 8,
            border: `1px solid ${BORDER}`, backgroundColor: menu ? 'rgba(0,0,0,0.06)' : SURFACE,
          }}>
            <MoreHorizontal size={16} strokeWidth={1.5} />
          </HoverButton>
          {menu && <DropdownMenu items={MSG_MENU} onClose={() => setMenu(false)} />}
        </div>
        <Note>This is the per-message menu. "Add as annotation" sends the comment to the agent's queue.</Note>
      </div>

      {/* Step 2: promoted */}
      <div>
        <SectionLabel>Step 2 — Comment promoted, shows annotation badge + queued banner</SectionLabel>
        <CardShell>
          <CardHeader element="AnnotationOverlay · marker" extra={
            <span style={{
              fontSize: 10, fontWeight: 500, color: ACCENT,
              backgroundColor: 'rgba(232,89,12,0.1)', padding: '2px 8px', borderRadius: 8,
            }}>Annotation #4</span>
          } />
          <ElementContext text="AnnotationOverlay · div.marker" />
          <Message name="Gustav" time="5 min ago">
            The cursor should be normal, right now it hovers over the text inside and shows the text cursor
          </Message>
          <div style={{
            padding: '8px 12px', borderRadius: 8,
            backgroundColor: 'rgba(232,89,12,0.06)',
            border: '1px solid rgba(232,89,12,0.15)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <div style={{
              width: 16, height: 16, borderRadius: '50%',
              backgroundColor: ACCENT, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 9, fontWeight: 700,
            }}>4</div>
            <span style={{ fontSize: 12, color: ACCENT, fontWeight: 500 }}>Queued as annotation</span>
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: 11, color: TEXT_TER }}>Pending</span>
          </div>
          <ReplyInput name="Noam" />
        </CardShell>
      </div>

      {/* Step 3: resolved by agent */}
      <div>
        <SectionLabel>Step 3 — Agent processes annotation, thread auto-resolved</SectionLabel>
        <CardShell>
          <CardHeader element="AnnotationOverlay · marker" extra={
            <span style={{
              fontSize: 10, fontWeight: 500, color: '#059669',
              backgroundColor: '#ECFDF5', padding: '2px 8px', borderRadius: 8,
            }}>Resolved</span>
          } />
          <ElementContext text="AnnotationOverlay · div.marker" />
          <Message name="Gustav" time="10 min ago">
            The cursor should be normal, right now it hovers over the text inside and shows the text cursor
          </Message>
          <div style={{
            padding: '8px 12px', borderRadius: 8,
            backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <Check size={14} strokeWidth={1.5} color="#059669" />
            <span style={{ fontSize: 12, color: '#059669', fontWeight: 500 }}>
              Applied — changed cursor to default
            </span>
          </div>
        </CardShell>
        <Note>Agent closes the GitHub Issue and leaves a comment with what changed.</Note>
      </div>
    </div>
  )
}

/* ── 4. Pins, auth, FABs ─────────────────────────── */

export function CommentPinsAuthPreview() {
  return (
    <div style={{ fontFamily: FONT, display: 'flex', flexDirection: 'column', gap: 24, padding: 8 }}>
      <div style={{
        fontSize: 13, fontWeight: 600, color: TEXT_TER,
        textTransform: 'uppercase', letterSpacing: '0.05em',
      }}>
        Pins, Auth & FAB
      </div>

      {/* Pins */}
      <div>
        <SectionLabel>Comment pins on canvas — avatar with thread count</SectionLabel>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          {(['Gustav', 'Noam', 'Sarah'] as const).map((name, i) => (
            <div key={name} style={{ textAlign: 'center' }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <Avatar name={name} size={28} />
                <div style={{
                  position: 'absolute', top: -4, right: -4,
                  width: 14, height: 14, borderRadius: '50%',
                  backgroundColor: SURFACE, border: `1.5px solid ${BORDER}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 8, fontWeight: 700, color: TEXT_SEC,
                }}>
                  {i + 1}
                </div>
              </div>
              <div style={{ fontSize: 9, color: TEXT_TER, marginTop: 4 }}>{name.split(' ')[0]}</div>
            </div>
          ))}
          {/* Resolved */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              backgroundColor: '#E5E7EB', color: '#fff', opacity: 0.5,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Check size={14} strokeWidth={1.5} />
            </div>
            <div style={{ fontSize: 9, color: TEXT_TER, marginTop: 4 }}>resolved</div>
          </div>
          {/* Has annotation */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <Avatar name="Gustav" size={28} />
              <div style={{
                position: 'absolute', bottom: -2, right: -2,
                width: 12, height: 12, borderRadius: '50%',
                backgroundColor: ACCENT, border: `2px solid ${SURFACE}`,
              }} />
            </div>
            <div style={{ fontSize: 9, color: TEXT_TER, marginTop: 4 }}>annotated</div>
          </div>
        </div>
        <Note>Pins use the commenter's avatar color, not a fixed purple. Orange dot = promoted to annotation.</Note>
      </div>

      {/* Auth */}
      <div>
        <SectionLabel>Not signed in — GitHub OAuth required</SectionLabel>
        <CardShell>
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <svg width="28" height="28" viewBox="0 0 16 16" fill="none" style={{ margin: '0 auto 8px', display: 'block' }}>
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" fill="#1F2937" />
            </svg>
            <div style={{ fontSize: 13, fontWeight: 500, color: TEXT, marginBottom: 4 }}>
              Sign in to comment
            </div>
            <div style={{ fontSize: 12, color: TEXT_TER, marginBottom: 12 }}>
              Requires repo collaborator access
            </div>
            <button style={{
              padding: '8px 20px', borderRadius: 8, border: 'none',
              backgroundColor: TEXT, color: '#fff',
              fontSize: 13, fontWeight: 500, fontFamily: FONT,
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
              Sign in with GitHub
            </button>
          </div>
        </CardShell>
      </div>

      {/* FABs */}
      <div>
        <SectionLabel>FAB — comment (shared builds) vs. annotate (dev only)</SectionLabel>
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: COMMENT, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(99,102,241,0.25)',
            }}>
              <MessageSquare size={16} strokeWidth={1.5} />
            </div>
            <div style={{ fontSize: 10, fontWeight: 500, color: COMMENT, marginTop: 6 }}>Comment</div>
            <div style={{ fontSize: 9, color: TEXT_TER, marginTop: 2 }}>shared builds</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: ACCENT, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(232,89,12,0.25)',
            }}>
              <Pencil size={16} strokeWidth={1.5} />
            </div>
            <div style={{ fontSize: 10, fontWeight: 500, color: ACCENT, marginTop: 6 }}>Annotate</div>
            <div style={{ fontSize: 9, color: TEXT_TER, marginTop: 2 }}>dev only</div>
          </div>
        </div>
        <Note>Comment = conversation (GitHub Issue). Annotate = direct instruction to agent (MCP).</Note>
      </div>
    </div>
  )
}
