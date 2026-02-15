import { useState } from 'react'
import { PanelLeft, ChevronDown, ChevronRight, SquareMousePointer, MessageSquare } from 'lucide-react'
import { Avatar, HoverButton, Label } from '../../primitives'

/** Default shell layout with sidebar + topbar — using shared primitives + CSS tokens. */
export function ShellDefault() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ 'V1': true })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 8 }}>
      <Label sub="All parts composed using shared primitives and CSS custom properties.">Shell Assembly</Label>

      <div style={{
        width: 720, height: 480, borderRadius: 12, overflow: 'hidden',
        border: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* TopBar */}
        <div style={{
          height: 40, backgroundColor: 'var(--chrome)',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', padding: '0 12px', gap: 8, flexShrink: 0,
        }}>
          <HoverButton>
            <PanelLeft size={14} strokeWidth={1.5} />
          </HoverButton>
          <Avatar letter="S" size={16} />
          <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-primary)' }}>shell-system</span>
          <ChevronDown size={10} strokeWidth={1.5} style={{ color: 'var(--text-tertiary)' }} />
          <div style={{ flex: 1 }} />
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '3px 10px', borderRadius: 'var(--radius-lg)',
            backgroundColor: 'oklch(0.93 0.05 155)',
          }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              backgroundColor: 'var(--success)',
              boxShadow: '0 0 4px oklch(0.55 0.10 155)',
            }} />
            <span style={{ fontSize: 10, fontWeight: 500, color: 'oklch(0.40 0.12 155)' }}>Watch</span>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Sidebar */}
          <div style={{
            width: 160, borderRight: '1px solid var(--border)',
            backgroundColor: 'var(--chrome)', padding: '8px 0', flexShrink: 0,
            display: 'flex', flexDirection: 'column', gap: 2,
          }}>
            {[
              { name: 'V1', pages: ['Shell Default', 'Palette Overview'] },
              { name: 'V2', pages: ['Cerulean Accent'] },
            ].map((iter, i) => (
              <div key={iter.name} style={{
                borderTop: i > 0 ? '1px solid var(--border)' : 'none',
                marginTop: i > 0 ? 4 : 0, paddingTop: i > 0 ? 8 : 0,
              }}>
                <button
                  onClick={() => setExpanded(e => ({ ...e, [iter.name]: !e[iter.name] }))}
                  style={{
                    width: '100%', padding: '4px 12px', border: 'none',
                    backgroundColor: 'transparent', display: 'flex', alignItems: 'center', gap: 4,
                    fontSize: 10, fontWeight: expanded[iter.name] ? 600 : 400,
                    color: expanded[iter.name] ? 'var(--text-primary)' : 'var(--text-tertiary)',
                    cursor: 'default', textAlign: 'left',
                  }}
                >
                  {expanded[iter.name]
                    ? <ChevronDown size={8} strokeWidth={1.5} style={{ color: 'var(--text-tertiary)' }} />
                    : <ChevronRight size={8} strokeWidth={1.5} style={{ color: 'var(--text-faint)' }} />
                  }
                  {iter.name}
                </button>
                {expanded[iter.name] && iter.pages.map((page, pi) => (
                  <div key={page} style={{
                    padding: '3px 12px 3px 24px', fontSize: 10,
                    color: pi === 0 && iter.name === 'V1' ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontWeight: pi === 0 && iter.name === 'V1' ? 600 : 400,
                    backgroundColor: pi === 0 && iter.name === 'V1' ? 'var(--chrome-active)' : 'transparent',
                    borderRadius: 4, margin: '0 4px',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>{page}</div>
                ))}
              </div>
            ))}
          </div>

          {/* Canvas area */}
          <div style={{ flex: 1, backgroundColor: 'var(--canvas-bg)', position: 'relative' }}>
            <div style={{ padding: 24, display: 'flex', gap: 20 }}>
              {/* Sample card A */}
              <div style={{
                width: 160, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface)',
                border: '1px solid var(--border-soft)', padding: 12,
                display: 'flex', flexDirection: 'column', gap: 8,
              }}>
                <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--text-primary)' }}>Sign In</div>
                <div style={{ height: 20, borderRadius: 4, backgroundColor: 'var(--canvas-bg)', border: '1px solid var(--border-soft)' }} />
                <div style={{
                  height: 24, borderRadius: 6, backgroundColor: 'var(--accent)', color: '#fff',
                  fontSize: 9, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>Connect</div>
              </div>

              {/* Sample card B */}
              <div style={{
                width: 140, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface)',
                border: '1px solid var(--border-soft)', padding: 12,
                display: 'flex', flexDirection: 'column', gap: 6,
              }}>
                <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--text-primary)' }}>Annotation</div>
                <div style={{ fontSize: 7, color: 'var(--text-tertiary)' }}>Button &middot; span</div>
                <div style={{
                  height: 32, borderRadius: 4, backgroundColor: 'var(--canvas-bg)',
                  border: '1px solid var(--border-soft)',
                  display: 'flex', alignItems: 'center', padding: '0 6px',
                }}>
                  <span style={{ fontSize: 7, color: 'var(--text-faint)' }}>Make it 20px...</span>
                </div>
                <div style={{
                  height: 18, borderRadius: 4, backgroundColor: 'var(--accent)', color: '#fff',
                  fontSize: 7, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>Apply</div>
              </div>
            </div>

            {/* FABs */}
            <div style={{
              position: 'absolute', bottom: 16, right: 16,
              display: 'flex', flexDirection: 'column', gap: 8,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                backgroundColor: 'var(--text-primary)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <MessageSquare size={14} strokeWidth={1.5} />
              </div>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                backgroundColor: 'var(--accent)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
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
