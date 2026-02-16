import { useState, type ReactNode } from 'react'
import { SquareMousePointer, MessageSquare, Layers, Palette, PanelLeft, ChevronDown } from 'lucide-react'
import { Avatar, Button, HoverButton } from '../components'

/**
 * Shared shell chrome for all V4 picker explorations.
 * Renders: top bar (sidebar toggle + project picker + picker slot + watch badge),
 * sidebar (System + Pages), floating canvas with gradient + FABs.
 *
 * Interactive:
 * - Sidebar toggle (PanelLeft) shows/hides sidebar
 * - Project picker shows project name + chevron (like runtime ProjectPicker)
 * - Picker slot drives iteration, sidebar updates
 */
export function ShellFrame({ picker, iteration, iterations }: {
  picker: ReactNode
  iteration: number
  iterations: string[]
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const activePage = 0

  const systemPages = ['Tokens', 'Primitives']
  const knownPages: Record<number, string[]> = {
    0: ['Shell Default', 'Palette'],
    1: ['Shell Rams', 'Rams Palette'],
    2: ['Shell Linear'],
  }
  const pages = knownPages[iteration] ?? ['Design', 'Components']

  return (
    <div style={{
      width: 760, height: 500, borderRadius: 12, overflow: 'hidden',
      border: '1px solid var(--border-soft)',
      backgroundColor: 'var(--chrome)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Top bar */}
      <div style={{
        height: 44, flexShrink: 0,
        display: 'flex', alignItems: 'center', padding: '0 12px',
        borderBottom: '1px solid var(--border-soft)',
        gap: 8,
      }}>
        {/* Sidebar toggle */}
        <HoverButton onClick={() => setSidebarOpen(s => !s)}>
          <PanelLeft size={14} strokeWidth={1.5} />
        </HoverButton>

        {/* Project picker — avatar + name + chevron */}
        <button style={{
          display: 'flex', alignItems: 'center', gap: 6,
          border: 'none', background: 'none', cursor: 'default',
          padding: '4px 8px', borderRadius: 8,
        }}>
          <Avatar letter="S" size={16} />
          <span style={{
            fontSize: 11, fontWeight: 500, color: 'var(--text-primary)',
            textWrap: 'pretty',
          } as React.CSSProperties}>shell-system</span>
          <ChevronDown size={10} strokeWidth={1.5} style={{ color: 'var(--text-tertiary)' }} />
        </button>

        <div style={{ flex: 1 }} />

        {/* Center — picker slot */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {picker}
        </div>

        <div style={{ flex: 1 }} />

        {/* Watch badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
          padding: '4px 12px', borderRadius: 8,
          backgroundColor: 'var(--accent-muted)',
          border: '1px solid var(--accent-border)',
        }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            backgroundColor: 'var(--accent)',
            boxShadow: '0 0 4px var(--accent)',
          }} />
          <span style={{
            fontSize: 10, fontWeight: 500, color: 'var(--accent-strong)',
            textWrap: 'pretty',
          } as React.CSSProperties}>Watch</span>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Sidebar — toggleable */}
        {sidebarOpen && (
          <div style={{
            width: 160, padding: '12px 0', flexShrink: 0,
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{
                padding: '0 16px', marginBottom: 4,
                fontSize: 9, fontWeight: 600, color: 'var(--text-faint)',
                textTransform: 'uppercase', letterSpacing: '0.08em',
                textWrap: 'pretty',
              } as React.CSSProperties}>System</div>
              {systemPages.map((page) => (
                <div key={page} style={{
                  padding: '4px 16px', fontSize: 11,
                  color: 'var(--text-secondary)', fontWeight: 400,
                  display: 'flex', alignItems: 'center', gap: 8,
                  textWrap: 'pretty',
                } as React.CSSProperties}>
                  {page === 'Tokens' && <Palette size={12} strokeWidth={1.5} style={{ color: 'var(--text-faint)' }} />}
                  {page === 'Primitives' && <Layers size={12} strokeWidth={1.5} style={{ color: 'var(--text-faint)' }} />}
                  {page}
                </div>
              ))}
            </div>
            <div style={{ height: 1, backgroundColor: 'var(--border-soft)', margin: '0 16px' }} />
            <div style={{ marginTop: 12 }}>
              <div style={{
                padding: '0 16px', marginBottom: 4,
                fontSize: 9, fontWeight: 600, color: 'var(--text-faint)',
                textTransform: 'uppercase', letterSpacing: '0.08em',
                textWrap: 'pretty',
              } as React.CSSProperties}>{iterations[iteration]} Pages</div>
              {pages.map((page, pi) => (
                <div key={page} style={{
                  padding: pi === activePage ? '4px 8px' : '4px 16px',
                  fontSize: 11,
                  color: pi === activePage ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: pi === activePage ? 500 : 400,
                  backgroundColor: pi === activePage ? 'var(--chrome-active)' : 'transparent',
                  borderRadius: pi === activePage ? 4 : 0,
                  margin: pi === activePage ? '0 8px' : '0',
                  textWrap: 'pretty',
                } as React.CSSProperties}>{page}</div>
              ))}
            </div>
          </div>
        )}

        {/* Canvas */}
        <div style={{ flex: 1, padding: 'var(--canvas-inset)' }}>
          <div style={{
            width: '100%', height: '100%',
            borderRadius: 'var(--canvas-radius)',
            backgroundColor: 'var(--canvas-bg)',
            boxShadow: 'var(--canvas-shadow)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 48,
              background: 'linear-gradient(to bottom, var(--canvas-bg) 0%, transparent 100%)',
              zIndex: 2, pointerEvents: 'none',
              borderRadius: 'var(--canvas-radius) var(--canvas-radius) 0 0',
            }} />
            <div style={{ padding: 32, display: 'flex', gap: 20, paddingTop: 48 }}>
              <div style={{
                width: 160, borderRadius: 8, backgroundColor: 'var(--surface)',
                border: '1px solid var(--border-soft)', padding: 12,
                display: 'flex', flexDirection: 'column', gap: 8,
              }}>
                <div style={{
                  fontSize: 9, fontWeight: 600, color: 'var(--text-primary)',
                  textWrap: 'pretty',
                } as React.CSSProperties}>Component</div>
                <div style={{
                  height: 20, borderRadius: 4,
                  backgroundColor: 'var(--canvas-bg)', border: '1px solid var(--border-soft)',
                }} />
                <Button variant="primary">Apply</Button>
              </div>
              <div style={{
                width: 140, borderRadius: 8, backgroundColor: 'var(--surface)',
                border: '1px solid var(--border-soft)', padding: 12,
                display: 'flex', flexDirection: 'column', gap: 8,
              }}>
                <div style={{
                  fontSize: 9, fontWeight: 600, color: 'var(--text-primary)',
                  textWrap: 'pretty',
                } as React.CSSProperties}>Annotation</div>
                <div style={{
                  fontSize: 7, color: 'var(--text-tertiary)',
                  textWrap: 'pretty',
                } as React.CSSProperties}>Button &middot; span</div>
                <div style={{
                  height: 32, borderRadius: 4, backgroundColor: 'var(--canvas-bg)',
                  border: '1px solid var(--border-soft)',
                  display: 'flex', alignItems: 'center', padding: '0 8px',
                }}>
                  <span style={{
                    fontSize: 7, color: 'var(--text-faint)',
                    textWrap: 'pretty',
                  } as React.CSSProperties}>Click a picker to change iteration...</span>
                </div>
                <Button variant="primary">Apply</Button>
              </div>
            </div>
            {/* FABs */}
            <div style={{
              position: 'absolute', bottom: 16, right: 16,
              display: 'flex', flexDirection: 'column', gap: 8, zIndex: 3,
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
