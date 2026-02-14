import { useState } from 'react'
import { Reply, Smile, Pencil, Link2, Trash2, Check, X, Send, MoreHorizontal, MessageSquare } from 'lucide-react'

const ACCENT = '#E8590C'
const SURFACE = '#FFFFFF'
const BORDER = '#E5E7EB'
const TEXT = '#1F2937'
const TEXT_SEC = '#6B7280'
const TEXT_TER = '#9CA3AF'
const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'

/* ── Shared primitives ─────────────────────────────── */

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

function Timestamp({ text }: { text: string }) {
  return <span style={{ fontSize: 11, color: TEXT_TER, fontWeight: 400 }}>{text}</span>
}

function Mention({ children }: { children: string }) {
  return <span style={{ color: '#2563EB', fontWeight: 500 }}>{children}</span>
}

function Reaction({ label, count }: { label: string; count: number }) {
  const [hovered, setHovered] = useState(false)
  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '2px 8px', borderRadius: 12,
        border: `1px solid ${hovered ? '#D1D5DB' : BORDER}`,
        backgroundColor: hovered ? '#F3F4F6' : '#FAFAFA',
        fontSize: 11, color: TEXT_SEC, fontWeight: 500,
        transition: 'all 0.1s ease',
      }}
    >
      {label} {count}
    </span>
  )
}

function HoverButton({ children, onClick, style }: {
  children: React.ReactNode; onClick?: () => void; style?: React.CSSProperties
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
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
    <HoverButton onClick={onClick}>
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
        width: 200, background: SURFACE, borderRadius: 8,
        border: `1px solid ${BORDER}`,
        boxShadow: '0 4px 16px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
        padding: 4, fontFamily: FONT,
      }}>
        {items.map((item, i) => (
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

const MENU_ITEMS = [
  { label: 'Reply', icon: <Reply size={16} strokeWidth={1.5} /> },
  { label: 'Add reaction', icon: <Smile size={16} strokeWidth={1.5} /> },
  { label: 'Add as annotation', icon: <Pencil size={16} strokeWidth={1.5} />, accent: true },
  { label: 'Copy link', icon: <Link2 size={16} strokeWidth={1.5} /> },
  { label: 'Delete', icon: <Trash2 size={16} strokeWidth={1.5} />, destructive: true, separator: true },
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
      <HoverButton style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: value ? ACCENT : '#F3F4F6', color: value ? '#fff' : TEXT_TER }}>
        <Send size={14} strokeWidth={1.5} />
      </HoverButton>
    </div>
  )
}

function CardShell({ children, width = 360 }: { children: React.ReactNode; width?: number }) {
  return (
    <div style={{
      width, background: SURFACE, borderRadius: 12, padding: 16,
      boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
      border: `1px solid ${BORDER}`, fontFamily: FONT,
      display: 'flex', flexDirection: 'column', gap: 12,
    }}>
      {children}
    </div>
  )
}

function CardHeader({ title, extra, onMenuToggle, menuOpen }: {
  title: string; extra?: React.ReactNode; onMenuToggle?: () => void; menuOpen?: boolean
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>{title}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, position: 'relative' }}>
        {extra}
        <MenuDots onClick={onMenuToggle} />
        {menuOpen && <DropdownMenu items={MENU_ITEMS} onClose={onMenuToggle!} />}
        <HoverButton><Check size={14} strokeWidth={1.5} /></HoverButton>
        <HoverButton><X size={14} strokeWidth={1.5} /></HoverButton>
      </div>
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
      onMouseLeave={() => { setHovered(false) }}
      style={{
        display: 'flex', gap: 8, alignItems: 'flex-start',
        padding: 4, margin: -4, borderRadius: 8,
        backgroundColor: hovered ? 'rgba(0,0,0,0.02)' : 'transparent',
        transition: 'background-color 0.1s ease',
        position: 'relative',
      }}
    >
      <Avatar name={name} size={28} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>{name}</span>
          <Timestamp text={time} />
          <div style={{ flex: 1 }} />
          <div style={{
            opacity: hovered || menuOpen ? 1 : 0,
            transition: 'opacity 0.1s ease',
            position: 'relative',
          }}>
            <MenuDots onClick={() => setMenuOpen(o => !o)} />
            {menuOpen && <DropdownMenu items={MENU_ITEMS} onClose={() => setMenuOpen(false)} />}
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
  return (
    <div style={{ fontSize: 11, color: TEXT_TER, marginBottom: 8 }}>{children}</div>
  )
}

/* ── Pin markers ────────────────────────────────────── */

export function CommentPinsPreview() {
  return (
    <div style={{ fontFamily: FONT, display: 'flex', flexDirection: 'column', gap: 24, padding: 8 }}>
      <div style={{
        fontSize: 13, fontWeight: 600, color: TEXT_TER,
        textTransform: 'uppercase', letterSpacing: '0.05em',
      }}>
        Comment Pins
      </div>

      <div>
        <SectionLabel>Pin with avatar</SectionLabel>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          {(['Gustav', 'Noam', 'Sarah'] as const).map((name, i) => (
            <div key={name} style={{ position: 'relative', display: 'inline-block' }}>
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
          ))}
        </div>
      </div>

      <div>
        <SectionLabel>Numbered pin (no avatar)</SectionLabel>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {[1, 2, 3, 4, 5].map(n => (
            <div key={n} style={{
              width: 20, height: 20, borderRadius: '50%',
              backgroundColor: '#6366F1', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 700,
              boxShadow: '0 1px 4px rgba(99,102,241,0.3)',
            }}>
              {n}
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionLabel>Resolved pin (faded)</SectionLabel>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{
            width: 20, height: 20, borderRadius: '50%',
            backgroundColor: '#D1D5DB', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: 0.6,
          }}>
            <Check size={12} strokeWidth={1.5} />
          </div>
          <span style={{ fontSize: 11, color: TEXT_TER }}>Resolved</span>
        </div>
      </div>

      <div>
        <SectionLabel>Promoted to annotation</SectionLabel>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <div style={{
              width: 20, height: 20, borderRadius: '50%',
              backgroundColor: '#6366F1', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 700,
              boxShadow: '0 1px 4px rgba(99,102,241,0.3)',
            }}>
              2
            </div>
            <div style={{
              position: 'absolute', bottom: -3, right: -3,
              width: 10, height: 10, borderRadius: '50%',
              backgroundColor: ACCENT,
              border: `1.5px solid ${SURFACE}`,
            }} />
          </div>
          <span style={{ fontSize: 11, color: TEXT_TER }}>Has annotation</span>
        </div>
      </div>
    </div>
  )
}

/* ── Interactive comment cards ─────────────────────── */

export function CommentStatesPreview() {
  const [headerMenu, setHeaderMenu] = useState(false)
  const [composing, setComposing] = useState('')

  return (
    <div style={{ fontFamily: FONT, display: 'flex', flexDirection: 'column', gap: 24, padding: 8 }}>
      <div style={{
        fontSize: 13, fontWeight: 600, color: TEXT_TER,
        textTransform: 'uppercase', letterSpacing: '0.05em',
      }}>
        Comment Card States
      </div>

      {/* New comment */}
      <div>
        <SectionLabel>New comment (composing)</SectionLabel>
        <CardShell>
          <CardHeader title="Comment" onMenuToggle={() => setHeaderMenu(o => !o)} menuOpen={headerMenu} />
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
                padding: '6px 12px', background: 'transparent', color: TEXT_SEC,
                border: `1px solid ${BORDER}`, borderRadius: 8,
                fontSize: 12, fontWeight: 500, fontFamily: FONT,
              }}
            >Cancel</button>
            <button style={{
              padding: '6px 12px',
              background: composing.trim() ? ACCENT : 'rgba(232,89,12,0.15)',
              color: composing.trim() ? '#fff' : TEXT_TER,
              border: 'none', borderRadius: 8,
              fontSize: 12, fontWeight: 500, fontFamily: FONT,
            }}>Post</button>
          </div>
        </CardShell>
      </div>

      {/* Single comment */}
      <div>
        <SectionLabel>Single comment (hover message for menu)</SectionLabel>
        <CardShell>
          <CardHeader title="Comment" />
          <Message name="Gustav" time="2 min ago">
            <Mention>@Noam</Mention> here is the step form we did for Match me with an agency
          </Message>
          <ReplyInput name="Noam" />
        </CardShell>
      </div>

      {/* Thread */}
      <div>
        <SectionLabel>Thread (click ··· on any message)</SectionLabel>
        <CardShell>
          <CardHeader title="Comment" />
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
              <Reaction label="+1" count={1} />
            </div>
          </Message>
          <ReplyInput name="Noam" />
        </CardShell>
      </div>
    </div>
  )
}

/* ── Menu + annotation promotion ──────────────────── */

export function CommentMenuPreview() {
  const [standaloneMenu, setStandaloneMenu] = useState(false)

  return (
    <div style={{ fontFamily: FONT, display: 'flex', flexDirection: 'column', gap: 24, padding: 8 }}>
      <div style={{
        fontSize: 13, fontWeight: 600, color: TEXT_TER,
        textTransform: 'uppercase', letterSpacing: '0.05em',
      }}>
        Comment Actions
      </div>

      {/* Standalone menu */}
      <div>
        <SectionLabel>Message menu (click to toggle)</SectionLabel>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <HoverButton onClick={() => setStandaloneMenu(o => !o)} style={{
            width: 32, height: 32, borderRadius: 8,
            border: `1px solid ${BORDER}`,
            backgroundColor: standaloneMenu ? 'rgba(0,0,0,0.06)' : SURFACE,
          }}>
            <MoreHorizontal size={16} strokeWidth={1.5} />
          </HoverButton>
          {standaloneMenu && <DropdownMenu items={MENU_ITEMS} onClose={() => setStandaloneMenu(false)} />}
        </div>
      </div>

      {/* Promoted to annotation */}
      <div>
        <SectionLabel>Promoted to annotation (badge on card)</SectionLabel>
        <CardShell>
          <CardHeader title="Comment" extra={
            <span style={{
              fontSize: 10, fontWeight: 500, color: ACCENT,
              backgroundColor: 'rgba(232,89,12,0.1)', padding: '2px 8px', borderRadius: 8,
            }}>Annotation #4</span>
          } />
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
            <span style={{ fontSize: 12, color: ACCENT, fontWeight: 500 }}>
              Queued as annotation
            </span>
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: 11, color: TEXT_TER }}>Pending</span>
          </div>
          <ReplyInput name="Noam" />
        </CardShell>
      </div>

      {/* Resolved */}
      <div>
        <SectionLabel>Annotation resolved (agent applied change)</SectionLabel>
        <CardShell>
          <CardHeader title="Comment" extra={
            <span style={{
              fontSize: 10, fontWeight: 500, color: '#059669',
              backgroundColor: '#ECFDF5', padding: '2px 8px', borderRadius: 8,
            }}>Resolved</span>
          } />
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
          <ReplyInput name="Noam" />
        </CardShell>
      </div>
    </div>
  )
}

/* ── Auth + empty states ──────────────────────────── */

export function CommentAuthPreview() {
  return (
    <div style={{ fontFamily: FONT, display: 'flex', flexDirection: 'column', gap: 24, padding: 8 }}>
      <div style={{
        fontSize: 13, fontWeight: 600, color: TEXT_TER,
        textTransform: 'uppercase', letterSpacing: '0.05em',
      }}>
        Auth & Empty States
      </div>

      {/* Sign in */}
      <div>
        <SectionLabel>Not signed in</SectionLabel>
        <CardShell width={320}>
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <svg width="32" height="32" viewBox="0 0 16 16" fill="none" style={{ margin: '0 auto 12px', display: 'block' }}>
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" fill="#1F2937" />
            </svg>
            <div style={{ fontSize: 13, fontWeight: 500, color: TEXT, marginBottom: 4 }}>
              Sign in to comment
            </div>
            <div style={{ fontSize: 12, color: TEXT_TER, marginBottom: 16 }}>
              Requires GitHub repo access
            </div>
            <button style={{
              padding: '8px 20px', borderRadius: 8, border: `1px solid ${BORDER}`,
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

      {/* Empty */}
      <div>
        <SectionLabel>No comments on this element</SectionLabel>
        <CardShell width={320}>
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ fontSize: 13, color: TEXT_TER, marginBottom: 4 }}>
              No comments yet
            </div>
            <div style={{ fontSize: 12, color: TEXT_TER }}>
              Click any element to start a thread
            </div>
          </div>
        </CardShell>
      </div>

      {/* FABs */}
      <div>
        <SectionLabel>Comment FAB (shared builds)</SectionLabel>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {(['idle', 'hover'] as const).map(state => (
            <div key={state} style={{ textAlign: 'center' }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: state === 'hover' ? '#4F46E5' : '#6366F1',
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: state === 'hover'
                  ? '0 4px 16px rgba(99,102,241,0.3)'
                  : '0 2px 8px rgba(99,102,241,0.25)',
              }}>
                <MessageSquare size={16} strokeWidth={1.5} />
              </div>
              <div style={{ fontSize: 10, color: TEXT_TER, marginTop: 6 }}>{state}</div>
            </div>
          ))}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: ACCENT, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(232,89,12,0.25)',
            }}>
              <Pencil size={16} strokeWidth={1.5} />
            </div>
            <div style={{ fontSize: 10, color: TEXT_TER, marginTop: 6 }}>annotate (dev)</div>
          </div>
        </div>
        <div style={{ fontSize: 10, color: TEXT_TER, marginTop: 8 }}>
          Purple = comment (shared). Orange = annotate (dev only).
        </div>
      </div>
    </div>
  )
}
