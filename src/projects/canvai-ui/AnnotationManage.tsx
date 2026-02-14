import { useState } from 'react'
import { Trash2, X, Undo2 } from 'lucide-react'

const ACCENT = '#E8590C'
const SURFACE = '#FFFFFF'
const BORDER = '#E5E7EB'
const TEXT = '#1F2937'
const TEXT_SEC = '#6B7280'
const TEXT_TER = '#9CA3AF'
const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
const CANVAS_BG = '#F3F4F6'
const DANGER = '#DC2626'

/* ── Shared primitives ────────────────────────────── */

function MarkerDot({ n, size = 18, active, style }: { n: number; size?: number; active?: boolean; style?: React.CSSProperties }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      backgroundColor: ACCENT, color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.5, fontWeight: 700, fontFamily: FONT,
      boxShadow: active
        ? `0 0 0 2px ${ACCENT}, 0 1px 4px rgba(232,89,12,0.25)`
        : '0 1px 4px rgba(232,89,12,0.25)',
      flexShrink: 0, ...style,
    }}>
      {n}
    </div>
  )
}

function HoverButton({ children, onClick, title, danger, style }: {
  children: React.ReactNode; onClick?: () => void; title?: string; danger?: boolean; style?: React.CSSProperties
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick} title={title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 24, height: 24, border: 'none', borderRadius: 4,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: danger ? (hovered ? DANGER : TEXT_TER) : TEXT_TER,
        backgroundColor: danger && hovered ? 'rgba(220,38,38,0.06)' : hovered ? 'rgba(0,0,0,0.06)' : 'transparent',
        transition: 'all 0.1s ease', fontFamily: FONT,
        ...style,
      }}
    >
      {children}
    </button>
  )
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

function SectionLabel({ children }: { children: string }) {
  return <div style={{ fontSize: 11, color: TEXT_TER, marginBottom: 8, textWrap: 'pretty' } as React.CSSProperties}>{children}</div>
}

/** Mini canvas background with fake frames */
function CanvasScene({ children, height = 240 }: { children: React.ReactNode; height?: number }) {
  return (
    <div style={{
      width: 380, height, backgroundColor: CANVAS_BG, borderRadius: 8,
      position: 'relative', overflow: 'visible', border: `1px solid ${BORDER}`,
    }}>
      {/* Fake frames */}
      <div style={{
        position: 'absolute', left: 20, top: 30, width: 140, height: 100,
        backgroundColor: SURFACE, borderRadius: 8, border: `1px solid ${BORDER}`,
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      }}>
        <div style={{ padding: 8, fontSize: 9, color: TEXT_TER, borderBottom: `1px solid ${BORDER}` }}>
          ButtonSamples
        </div>
        <div style={{ padding: 8 }}>
          <div style={{ width: 60, height: 16, backgroundColor: '#E5E7EB', borderRadius: 4 }} />
          <div style={{ width: 80, height: 16, backgroundColor: '#E5E7EB', borderRadius: 4, marginTop: 4 }} />
        </div>
      </div>
      <div style={{
        position: 'absolute', left: 190, top: 50, width: 140, height: 100,
        backgroundColor: SURFACE, borderRadius: 8, border: `1px solid ${BORDER}`,
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      }}>
        <div style={{ padding: 8, fontSize: 9, color: TEXT_TER, borderBottom: `1px solid ${BORDER}` }}>
          TopBar
        </div>
        <div style={{ padding: 8 }}>
          <div style={{ width: 100, height: 12, backgroundColor: '#E5E7EB', borderRadius: 4 }} />
        </div>
      </div>
      {children}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   Recommended — Click marker → editable card with delete
   ═══════════════════════════════════════════════════════ */

export function AnnotationManageRecommended() {
  const [activeMarker, setActiveMarker] = useState<number | null>(2)
  const [text, setText] = useState('The cursor should be normal, right now it shows the text cursor')

  return (
    <div style={{ fontFamily: FONT, display: 'flex', flexDirection: 'column', gap: 16, padding: 8 }}>
      <div style={{
        fontSize: 13, fontWeight: 600, color: TEXT_TER,
        textTransform: 'uppercase', letterSpacing: '0.05em',
      }}>
        Click Marker → Edit Card
      </div>

      <SectionLabel>Click a marker to open its card. Edit the text, or delete it. Same card as new annotations.</SectionLabel>

      <CanvasScene height={280}>
        {/* Marker 1 — idle */}
        <div style={{ position: 'absolute', left: 52, top: 60, cursor: 'default' }} onClick={() => setActiveMarker(1)}>
          <MarkerDot n={1} active={activeMarker === 1} />
        </div>

        {/* Marker 2 — active with card */}
        <div style={{ position: 'absolute', left: 220, top: 72, zIndex: 10 }}>
          <div style={{ cursor: 'default' }} onClick={() => setActiveMarker(2)}>
            <MarkerDot n={2} active={activeMarker === 2} />
          </div>

          {activeMarker === 2 && (
            <div style={{
              position: 'absolute', top: 24, left: -80,
              width: 280, backgroundColor: SURFACE, borderRadius: 8,
              border: `1px solid ${BORDER}`,
              boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
              padding: 12, fontFamily: FONT,
            }}>
              {/* Header: element context + actions */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ fontSize: 11, color: TEXT_TER, letterSpacing: '0.02em' }}>
                  TopBar · div
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <HoverButton danger title="Delete annotation" onClick={() => setActiveMarker(null)}>
                    <Trash2 size={14} strokeWidth={1.5} />
                  </HoverButton>
                  <HoverButton title="Close" onClick={() => setActiveMarker(null)}>
                    <X size={14} strokeWidth={1.5} />
                  </HoverButton>
                </div>
              </div>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                style={{
                  width: '100%', minHeight: 64, background: '#F9FAFB',
                  color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 8,
                  padding: 8, fontSize: 13, lineHeight: 1.5,
                  resize: 'vertical', outline: 'none', fontFamily: 'inherit',
                  textWrap: 'pretty',
                } as React.CSSProperties}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                <button style={{
                  padding: '6px 12px', background: ACCENT, color: '#fff',
                  border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 500,
                  fontFamily: FONT,
                }}>
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      </CanvasScene>

      <Note>Reuses the same card as new annotations — consistent UX. Delete icon next to X in header. Text is editable.</Note>
      <Note>This is the existing behavior plus a trash icon. No new patterns to learn.</Note>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   States — new vs saved annotation card
   ═══════════════════════════════════════════════════════ */

export function AnnotationManageStates() {
  const [newText, setNewText] = useState('')
  const [savedText, setSavedText] = useState('Padding feels tight here, should be 16px')

  return (
    <div style={{ fontFamily: FONT, display: 'flex', flexDirection: 'column', gap: 20, padding: 8 }}>
      <div style={{
        fontSize: 13, fontWeight: 600, color: TEXT_TER,
        textTransform: 'uppercase', letterSpacing: '0.05em',
      }}>
        Card States
      </div>

      {/* New annotation */}
      <div>
        <SectionLabel>New — no delete icon, just X to cancel</SectionLabel>
        <div style={{
          width: 280, backgroundColor: SURFACE, borderRadius: 8,
          border: `1px solid ${BORDER}`,
          boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
          padding: 12, fontFamily: FONT,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ fontSize: 11, color: TEXT_TER }}>ButtonSamples · button</div>
            <HoverButton title="Cancel">
              <X size={14} strokeWidth={1.5} />
            </HoverButton>
          </div>
          <textarea
            value={newText}
            onChange={e => setNewText(e.target.value)}
            placeholder="Describe the change..."
            style={{
              width: '100%', minHeight: 64, background: '#F9FAFB',
              color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 8,
              padding: 8, fontSize: 13, lineHeight: 1.5,
              resize: 'vertical', outline: 'none', fontFamily: 'inherit',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
            <button
              disabled={!newText.trim()}
              style={{
                padding: '6px 12px',
                background: newText.trim() ? ACCENT : 'rgba(232,89,12,0.15)',
                color: newText.trim() ? '#fff' : TEXT_TER,
                border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 500,
                fontFamily: FONT,
              }}
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* Saved annotation */}
      <div>
        <SectionLabel>Saved — delete icon appears next to X</SectionLabel>
        <div style={{
          width: 280, backgroundColor: SURFACE, borderRadius: 8,
          border: `1px solid ${BORDER}`,
          boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
          padding: 12, fontFamily: FONT,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ fontSize: 11, color: TEXT_TER }}>TopBar · div</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <HoverButton danger title="Delete annotation">
                <Trash2 size={14} strokeWidth={1.5} />
              </HoverButton>
              <HoverButton title="Close">
                <X size={14} strokeWidth={1.5} />
              </HoverButton>
            </div>
          </div>
          <textarea
            value={savedText}
            onChange={e => setSavedText(e.target.value)}
            style={{
              width: '100%', minHeight: 64, background: '#F9FAFB',
              color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 8,
              padding: 8, fontSize: 13, lineHeight: 1.5,
              resize: 'vertical', outline: 'none', fontFamily: 'inherit',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
            <button style={{
              padding: '6px 12px', background: ACCENT, color: '#fff',
              border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 500,
              fontFamily: FONT,
            }}>
              Save
            </button>
          </div>
        </div>
      </div>

      <Note>Only difference between new and saved: the trash icon. Everything else is the same card.</Note>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   Undo toast — shown after deletion
   ═══════════════════════════════════════════════════════ */

export function AnnotationManageUndo() {
  const [deleted, setDeleted] = useState(false)

  return (
    <div style={{ fontFamily: FONT, display: 'flex', flexDirection: 'column', gap: 16, padding: 8 }}>
      <div style={{
        fontSize: 13, fontWeight: 600, color: TEXT_TER,
        textTransform: 'uppercase', letterSpacing: '0.05em',
      }}>
        After Delete — Undo Toast
      </div>

      <SectionLabel>After clicking trash, marker fades and undo toast appears for 3 seconds</SectionLabel>

      <CanvasScene>
        <div style={{ position: 'absolute', left: 52, top: 60 }}>
          <MarkerDot n={1} />
        </div>

        {/* Marker 2 — deleted (dimmed) or restored */}
        <div
          style={{ position: 'absolute', left: 220, top: 72, opacity: deleted ? 0.2 : 1, transition: 'opacity 0.2s ease' }}
          onClick={() => !deleted && setDeleted(true)}
        >
          <MarkerDot n={2} />
        </div>

        {/* Undo toast */}
        {deleted && (
          <div style={{
            position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)',
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 16px', borderRadius: 20,
            backgroundColor: TEXT, color: '#fff',
            fontSize: 12, fontWeight: 500, fontFamily: FONT,
            boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
            whiteSpace: 'nowrap',
          }}>
            <span>Annotation #2 removed</span>
            <button
              onClick={(e) => { e.stopPropagation(); setDeleted(false) }}
              style={{
                border: 'none', background: 'rgba(255,255,255,0.2)',
                color: '#fff', borderRadius: 4, padding: '2px 8px',
                fontSize: 11, fontWeight: 600, fontFamily: FONT,
                display: 'flex', alignItems: 'center', gap: 4,
              }}
            >
              <Undo2 size={12} strokeWidth={1.5} /> Undo
            </button>
          </div>
        )}
      </CanvasScene>

      <Note>3-second undo window. After that the annotation is permanently deleted from the MCP server.</Note>
      <Note>Click "Undo" above to restore the marker.</Note>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   List panel — bulk management
   ═══════════════════════════════════════════════════════ */

export function AnnotationManageList() {
  const [deleted, setDeleted] = useState<number[]>([])

  const annotations = [
    { id: 1, element: 'ButtonSamples · button', comment: 'The cursor should be normal' },
    { id: 2, element: 'TopBar · div', comment: 'Padding feels tight, should be 16px' },
    { id: 3, element: 'SidebarOption · span', comment: 'Text color too light on dark bg' },
  ]

  const visible = annotations.filter(a => !deleted.includes(a.id))

  return (
    <div style={{ fontFamily: FONT, display: 'flex', flexDirection: 'column', gap: 16, padding: 8 }}>
      <div style={{
        fontSize: 13, fontWeight: 600, color: TEXT_TER,
        textTransform: 'uppercase', letterSpacing: '0.05em',
      }}>
        List Panel — Bulk Management
      </div>

      <SectionLabel>Could live in the sidebar for managing all annotations at once</SectionLabel>

      <div style={{
        width: 340, backgroundColor: SURFACE, borderRadius: 12,
        border: `1px solid ${BORDER}`,
        boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
        fontFamily: FONT, overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px', borderBottom: `1px solid ${BORDER}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>Annotations</span>
            <span style={{
              fontSize: 10, fontWeight: 600, color: ACCENT,
              backgroundColor: 'rgba(232,89,12,0.1)', padding: '2px 8px', borderRadius: 8,
            }}>{visible.length} pending</span>
          </div>
          {visible.length > 0 && (
            <HoverButton
              danger
              title="Clear all"
              onClick={() => setDeleted(annotations.map(a => a.id))}
              style={{ fontSize: 11, width: 'auto', padding: '4px 8px' }}
            >
              <Trash2 size={14} strokeWidth={1.5} />
            </HoverButton>
          )}
        </div>

        <div style={{ padding: 4 }}>
          {visible.map(a => (
            <AnnotationRow key={a.id} annotation={a} onDelete={() => setDeleted(d => [...d, a.id])} />
          ))}
          {visible.length === 0 && (
            <div style={{ padding: '20px 16px', textAlign: 'center', fontSize: 12 }}>
              <div style={{ color: TEXT_TER, marginBottom: 8 }}>No pending annotations</div>
              <button
                onClick={() => setDeleted([])}
                style={{
                  border: `1px solid ${BORDER}`, background: 'transparent',
                  borderRadius: 8, padding: '4px 12px', fontSize: 11,
                  color: TEXT_SEC, fontFamily: FONT,
                }}
              >
                Reset demo
              </button>
            </div>
          )}
        </div>
      </div>

      <Note>Complementary to the card approach — useful when managing many annotations at once.</Note>
    </div>
  )
}

function AnnotationRow({ annotation, onDelete }: {
  annotation: { id: number; element: string; comment: string }
  onDelete: () => void
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 8,
        padding: '8px 12px', borderRadius: 8,
        backgroundColor: hovered ? 'rgba(0,0,0,0.02)' : 'transparent',
        transition: 'background-color 0.1s ease',
      }}
    >
      <MarkerDot n={annotation.id} size={20} style={{ marginTop: 2 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, color: TEXT_TER }}>{annotation.element}</div>
        <div style={{
          fontSize: 12, color: TEXT, lineHeight: 1.4, marginTop: 2,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {annotation.comment}
        </div>
      </div>
      <div style={{
        opacity: hovered ? 1 : 0, transition: 'opacity 0.1s ease',
        flexShrink: 0,
      }}>
        <HoverButton danger title="Delete" onClick={onDelete}>
          <Trash2 size={14} strokeWidth={1.5} />
        </HoverButton>
      </div>
    </div>
  )
}
