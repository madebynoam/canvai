import { useState } from 'react'
import { ChevronDown, ChevronRight, SquareMousePointer, MessageSquare } from 'lucide-react'
import { Avatar, Button, HoverButton, Label } from '../components'

/**
 * V3 — Linear-inspired shell.
 *
 * No top bar. Sidebar items sit on the base surface (no chrome, no border).
 * Canvas is inset with rounded corners — elevated from the base.
 * Watch/pending indicators float on top of the canvas with a subtle top fade.
 *
 * Surface hierarchy:
 *   Layer 0 — chrome (0.952)      base shell, sidebar
 *   Layer 1 — canvas-bg (0.972)   workspace, inset with rounded corners
 *   Layer 2 — surface (0.993)     cards, floating indicators
 */
export function ShellLinear() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ 'V1': true, 'V2': true })
  const [watching, setWatching] = useState(true)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 8 }}>
      <Label sub="No top bar. Sidebar on surface. Canvas elevated + inset with rounded corners. Floating indicators.">
        Shell — Linear
      </Label>

      <div style={{
        width: 760, height: 500, borderRadius: 12, overflow: 'hidden',
        border: '1px solid var(--border-soft)',
        backgroundColor: 'var(--chrome)',
        display: 'flex',
      }}>
        {/* Sidebar — items on the base chrome, no separate background */}
        <div style={{
          width: 180, padding: '12px 0', flexShrink: 0,
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* Project identity — Avatar primitive + project name */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '0 16px', marginBottom: 16,
          }}>
            <Avatar letter="S" size={20} />
            <span style={{
              fontSize: 12, fontWeight: 600, color: 'var(--text-primary)',
              flex: 1,
            }}>shell-system</span>
            <ChevronDown size={12} strokeWidth={1.5} style={{ color: 'var(--text-faint)' }} />
          </div>

          {/* Iteration tree — no primitive fits this disclosure pattern.
              Override: raw <button> because tree items need custom layout
              (chevron + label + frozen badge) that Button/HoverButton don't support. */}
          {[
            { name: 'V1', frozen: true, pages: ['Shell Default', 'Palette Overview'] },
            { name: 'V2', frozen: false, pages: ['Shell Rams', 'Rams Palette'] },
            { name: 'V3', frozen: false, pages: ['Shell Linear'] },
          ].map((iter) => (
            <div key={iter.name}>
              <button
                onClick={() => setExpanded(e => ({ ...e, [iter.name]: !e[iter.name] }))}
                style={{
                  width: '100%', padding: '4px 16px', border: 'none',
                  backgroundColor: 'transparent', display: 'flex', alignItems: 'center', gap: 8,
                  fontSize: 11, fontWeight: expanded[iter.name] ? 600 : 400,
                  color: expanded[iter.name] ? 'var(--text-primary)' : 'var(--text-secondary)',
                  cursor: 'default', textAlign: 'left',
                }}
              >
                {expanded[iter.name]
                  ? <ChevronDown size={12} strokeWidth={1.5} style={{ color: 'var(--text-tertiary)' }} />
                  : <ChevronRight size={12} strokeWidth={1.5} style={{ color: 'var(--text-faint)' }} />
                }
                {iter.name}
                {iter.frozen && (
                  <span style={{
                    fontSize: 8, color: 'var(--text-faint)', fontWeight: 400,
                    marginLeft: 'auto',
                  }}>frozen</span>
                )}
              </button>
              {expanded[iter.name] && iter.pages.map((page, pi) => {
                const isActive = iter.name === 'V3' && pi === 0
                return (
                  <div key={page} style={{
                    padding: '4px 16px 4px 32px', fontSize: 11,
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontWeight: isActive ? 500 : 400,
                    backgroundColor: isActive ? 'var(--chrome-active)' : 'transparent',
                    borderRadius: isActive ? 4 : 0,
                    margin: isActive ? '0 8px' : '0',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>{page}</div>
                )
              })}
            </div>
          ))}
        </div>

        {/* Canvas area — Layer 1, inset from chrome base, rounded, elevated */}
        <div style={{
          flex: 1, padding: 'var(--canvas-inset)',
        }}>
          <div style={{
            width: '100%', height: '100%',
            borderRadius: 'var(--canvas-radius)',
            backgroundColor: 'var(--canvas-bg)',
            boxShadow: 'var(--canvas-shadow)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Top gradient fade — so floating indicators don't clash with content */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0,
              height: 48,
              background: 'linear-gradient(to bottom, var(--canvas-bg) 0%, transparent 100%)',
              zIndex: 2,
              pointerEvents: 'none',
              borderRadius: 'var(--canvas-radius) var(--canvas-radius) 0 0',
            }} />

            {/* Floating indicators — Layer 2, top right of canvas */}
            <div style={{
              position: 'absolute', top: 12, right: 12,
              zIndex: 3, display: 'flex', gap: 8, alignItems: 'center',
            }}>
              {/* Pending annotations — no primitive fits (badge + count + label).
                  Override: inline because this is a composite indicator, not a button. */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '4px 12px', borderRadius: 8,
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border-soft)',
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
              }}>
                <Avatar letter="2" size={16} />
                <span style={{ fontSize: 10, fontWeight: 500, color: 'var(--accent)' }}>pending</span>
              </div>

              {/* Watch mode pill — HoverButton primitive with custom styling */}
              {watching && (
                <HoverButton
                  onClick={() => setWatching(false)}
                  baseStyle={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    padding: '4px 12px', borderRadius: 8,
                    backgroundColor: 'var(--accent-muted)',
                    border: '1px solid var(--accent-border)',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                  }}
                >
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    backgroundColor: 'var(--accent)',
                    boxShadow: '0 0 4px var(--accent)',
                  }} />
                  <span style={{ fontSize: 10, fontWeight: 500, color: 'var(--accent-strong)' }}>Watch</span>
                </HoverButton>
              )}
            </div>

            {/* Canvas content — Layer 2 cards on Layer 1 canvas */}
            <div style={{ padding: 32, display: 'flex', gap: 20, paddingTop: 52 }}>
              {/* Component card — Layer 2 (surface on canvas-bg) */}
              <div style={{
                width: 160, borderRadius: 8, backgroundColor: 'var(--surface)',
                border: '1px solid var(--border-soft)', padding: 12,
                display: 'flex', flexDirection: 'column', gap: 8,
              }}>
                <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--text-primary)' }}>Component</div>
                {/* Input inset — drops back to canvas-bg for recessed feel */}
                <div style={{
                  height: 20, borderRadius: 4,
                  backgroundColor: 'var(--canvas-bg)',
                  border: '1px solid var(--border-soft)',
                }} />
                <Button variant="primary">Apply</Button>
              </div>

              {/* Annotation card — Layer 2 */}
              <div style={{
                width: 140, borderRadius: 8, backgroundColor: 'var(--surface)',
                border: '1px solid var(--border-soft)', padding: 12,
                display: 'flex', flexDirection: 'column', gap: 8,
              }}>
                <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--text-primary)' }}>Annotation</div>
                <div style={{ fontSize: 7, color: 'var(--text-tertiary)' }}>Button &middot; span</div>
                {/* Input inset — recessed */}
                <div style={{
                  height: 32, borderRadius: 4, backgroundColor: 'var(--canvas-bg)',
                  border: '1px solid var(--border-soft)',
                  display: 'flex', alignItems: 'center', padding: '0 8px',
                }}>
                  <span style={{ fontSize: 7, color: 'var(--text-faint)' }}>Less, but better...</span>
                </div>
                <Button variant="primary">Apply</Button>
              </div>
            </div>

            {/* FABs — Override: circular icon buttons. HoverButton is square/toolbar-only.
                These need round shape + colored bg + shadow — would need a FAB primitive
                or a `round` prop on HoverButton. Documenting for future extraction. */}
            <div style={{
              position: 'absolute', bottom: 16, right: 16,
              display: 'flex', flexDirection: 'column', gap: 8,
              zIndex: 3,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                backgroundColor: 'var(--text-primary)', color: 'oklch(1 0 0)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              }}>
                <MessageSquare size={14} strokeWidth={1.5} />
              </div>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                backgroundColor: 'var(--accent)', color: 'oklch(1 0 0)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              }}>
                <SquareMousePointer size={14} strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
