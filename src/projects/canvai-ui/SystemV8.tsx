import { useState, useRef, useEffect } from 'react'
import { PanelLeft, ChevronDown, ChevronRight, SquareMousePointer, Check, X, MessageSquare, Send, MoreHorizontal, Trash2, Github, Copy } from 'lucide-react'

/* ══════════════════════════════════════════════════════
   OKLCH Token System — Cerulean 400

   Every color is derived from two sources:
   1. Achromatic neutrals (c=0) — the shell material
   2. Cerulean accent scale (h=235) — the one color

   No hex. No rgb. No random values.
   ══════════════════════════════════════════════════════ */

function oklch(l: number, c: number, h: number): string {
  return `oklch(${l} ${c} ${h})`
}

/* Achromatic neutrals — c=0, zero hue */
const N = {
  chrome:     oklch(0.955, 0, 0),
  chromeSub:  oklch(0.940, 0, 0),
  canvas:     oklch(0.975, 0, 0),
  card:       oklch(0.995, 0, 0),
  border:     oklch(0.900, 0, 0),
  borderSoft: oklch(0.920, 0, 0),
  txtPri:     oklch(0.200, 0, 0),
  txtSec:     oklch(0.400, 0, 0),
  txtTer:     oklch(0.560, 0, 0),
  txtFaint:   oklch(0.680, 0, 0),
}

/* Cerulean accent scale — h=235 */
const A = {
  50:  oklch(0.97, 0.02, 235),
  100: oklch(0.93, 0.05, 235),
  200: oklch(0.87, 0.10, 235),
  300: oklch(0.78, 0.14, 235),
  400: oklch(0.68, 0.18, 235),
  500: oklch(0.58, 0.20, 235),
  600: oklch(0.52, 0.19, 235),
  700: oklch(0.44, 0.17, 235),
  800: oklch(0.36, 0.14, 235),
  900: oklch(0.28, 0.10, 235),
}

/* Functional */
const F = {
  comment:  oklch(0.260, 0, 0),
  resolved: oklch(0.700, 0, 0),
  success:  oklch(0.55, 0.14, 155),
  danger:   oklch(0.52, 0.20, 28),
}

const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
const MONO = 'SF Mono, Monaco, Inconsolata, monospace'

/* ── Shared Primitives ──────────────────────────── */

function PartLabel({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div style={{ marginTop: 16, marginBottom: 4 }}>
      <div style={{
        fontSize: 10, fontWeight: 600, color: N.txtTer, fontFamily: FONT,
        textTransform: 'uppercase', letterSpacing: '0.06em',
      }}>{children}</div>
      {sub && <div style={{ fontSize: 9, color: N.txtFaint, fontFamily: FONT, fontStyle: 'italic', marginTop: 2, textWrap: 'pretty' } as React.CSSProperties}>{sub}</div>}
    </div>
  )
}

function Swatch({ color, label, value, size = 44, dark }: {
  color: string; label: string; value?: string; size?: number; dark?: boolean
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <div style={{
        width: size, height: size, borderRadius: 8, backgroundColor: color,
        border: `1px solid rgba(0,0,0,0.06)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {dark !== undefined && (
          <span style={{ fontSize: 9, fontWeight: 600, color: dark ? '#fff' : N.txtPri, fontFamily: FONT }}>Aa</span>
        )}
      </div>
      <span style={{ fontSize: 8, fontWeight: 500, color: N.txtSec, fontFamily: FONT }}>{label}</span>
      {value && <span style={{ fontSize: 7, color: N.txtFaint, fontFamily: MONO }}>{value}</span>}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   PALETTE — The OKLCH Color System
   ═══════════════════════════════════════════════════════ */

export function V8Palette() {
  return (
    <div style={{ fontFamily: FONT, padding: 8, display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Neutral scale */}
      <div>
        <PartLabel sub="c=0 at every step. Pure perceptual gray. The shell material.">Achromatic Neutrals</PartLabel>
        <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
          <Swatch color={N.card} label="Card" value=".995" size={48} />
          <Swatch color={N.canvas} label="Canvas" value=".975" size={48} />
          <Swatch color={N.chrome} label="Chrome" value=".955" size={48} />
          <Swatch color={N.chromeSub} label="Active" value=".940" size={48} />
          <Swatch color={N.borderSoft} label="Bdr Soft" value=".920" size={48} />
          <Swatch color={N.border} label="Border" value=".900" size={48} />
          <Swatch color={N.txtFaint} label="Faint" value=".680" size={48} dark />
          <Swatch color={N.txtTer} label="Tertiary" value=".560" size={48} dark />
          <Swatch color={N.txtSec} label="Secondary" value=".400" size={48} dark />
          <Swatch color={N.txtPri} label="Primary" value=".200" size={48} dark />
        </div>
      </div>

      {/* Cerulean accent scale */}
      <div>
        <PartLabel sub="h=235. The one color. Like an indicator light on a Braun radio.">Cerulean Accent Scale</PartLabel>
        <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
          {([
            ['50', A[50], '.97/.02'], ['100', A[100], '.93/.05'], ['200', A[200], '.87/.10'],
            ['300', A[300], '.78/.14'], ['400', A[400], '.68/.18'], ['500', A[500], '.58/.20'],
            ['600', A[600], '.52/.19'], ['700', A[700], '.44/.17'], ['800', A[800], '.36/.14'],
            ['900', A[900], '.28/.10'],
          ] as [string, string, string][]).map(([name, color, val]) => (
            <Swatch key={name} color={color} label={name} value={val} size={48} dark={parseInt(name) >= 400} />
          ))}
        </div>
        <div style={{
          marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '4px 12px', borderRadius: 8, backgroundColor: A[50],
          border: `1px solid ${A[200]}`,
        }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: A[400] }} />
          <span style={{ fontSize: 10, fontWeight: 600, color: A[700], fontFamily: FONT }}>
            400 = Primary accent
          </span>
          <span style={{ fontSize: 9, color: A[600], fontFamily: MONO }}>oklch(0.68 0.18 235)</span>
        </div>
      </div>

      {/* Functional */}
      <div>
        <PartLabel sub="Semantic colors derived from the same OKLCH system.">Functional</PartLabel>
        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <Swatch color={F.comment} label="Comment" value="l=.26" size={40} dark />
          <Swatch color={F.resolved} label="Resolved" value="l=.70" size={40} dark />
          <Swatch color={F.success} label="Success" value="h=155" size={40} dark />
          <Swatch color={F.danger} label="Danger" value="h=28" size={40} dark />
        </div>
      </div>

      {/* Surface depth demo */}
      <div>
        <PartLabel sub="Three depth levels. Chrome → Canvas → Card. Each 0.020 apart in lightness.">Surface Depth</PartLabel>
        <div style={{
          marginTop: 8, display: 'flex', gap: 0, borderRadius: 12, overflow: 'hidden',
          border: `1px solid ${N.border}`, width: 480, height: 120,
        }}>
          {/* Chrome layer */}
          <div style={{
            width: 120, backgroundColor: N.chrome, padding: 12,
            borderRight: `1px solid ${N.border}`,
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
          }}>
            <span style={{ fontSize: 8, fontWeight: 600, color: N.txtTer, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Chrome</span>
            <span style={{ fontSize: 9, color: N.txtFaint, fontFamily: MONO }}>L=0.955</span>
          </div>
          {/* Canvas layer */}
          <div style={{
            flex: 1, backgroundColor: N.canvas, padding: 16,
            display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 8, fontWeight: 600, color: N.txtTer, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Canvas</span>
              <span style={{ fontSize: 9, color: N.txtFaint, fontFamily: MONO }}>L=0.975</span>
            </div>
            {/* Card on canvas */}
            <div style={{
              backgroundColor: N.card, borderRadius: 8, padding: 12,
              border: `1px solid ${N.borderSoft}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 8, fontWeight: 600, color: N.txtTer, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Card</span>
                <span style={{ fontSize: 9, color: N.txtFaint, fontFamily: MONO }}>L=0.995</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   SHELL PARTS — TopBar, Sidebar, ProjectPicker
   ═══════════════════════════════════════════════════════ */

export function V8ShellParts() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ 'V8': true })

  return (
    <div style={{ fontFamily: FONT, padding: 8, display: 'flex', flexDirection: 'column', gap: 40 }}>

      {/* ── TopBar ──────────────────────────── */}
      <div>
        <PartLabel sub="40px height. Chrome surface. Contains sidebar toggle, project picker, status indicators.">TopBar</PartLabel>
        <div style={{
          marginTop: 8, width: 680, height: 40, backgroundColor: N.chrome,
          borderRadius: 8, border: `1px solid ${N.border}`,
          display: 'flex', alignItems: 'center', padding: '0 12px', gap: 8,
        }}>
          {/* Sidebar toggle */}
          <button
            onClick={() => setSidebarOpen(o => !o)}
            style={{
              width: 24, height: 24, borderRadius: 4, border: 'none',
              backgroundColor: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: sidebarOpen ? N.txtPri : N.txtTer, cursor: 'default',
            }}
          >
            <PanelLeft size={16} strokeWidth={1.5} />
          </button>

          {/* Logo mark */}
          <div style={{
            width: 20, height: 20, borderRadius: 4, backgroundColor: A[400],
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, fontWeight: 700,
          }}>C</div>

          {/* Project name */}
          <span style={{ fontSize: 13, fontWeight: 500, color: N.txtPri }}>canvai-ui</span>
          <ChevronDown size={12} strokeWidth={1.5} color={N.txtTer} />

          <div style={{ flex: 1 }} />

          {/* Pending badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 16, height: 16, borderRadius: '50%', backgroundColor: A[400],
              color: '#fff', fontSize: 9, fontWeight: 600, fontFamily: FONT,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>3</div>
            <span style={{ fontSize: 11, fontWeight: 500, color: A[400] }}>pending</span>
          </div>

          {/* Watch pill */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '4px 12px', borderRadius: 12,
            backgroundColor: oklch(0.93, 0.05, 155),
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%', backgroundColor: F.success,
              boxShadow: `0 0 4px ${oklch(0.55, 0.10, 155)}`,
            }} />
            <span style={{ fontSize: 11, fontWeight: 500, color: oklch(0.40, 0.12, 155) }}>Watch</span>
          </div>
        </div>

        {/* Callouts */}
        <div style={{ display: 'flex', gap: 24, marginTop: 8 }}>
          {['Sidebar toggle', 'Logo mark (accent)', 'Project name + chevron', 'Pending count', 'Watch mode'].map(label => (
            <span key={label} style={{ fontSize: 8, color: N.txtFaint, fontFamily: FONT }}>{label}</span>
          ))}
        </div>
      </div>

      {/* ── Sidebar ──────────────────────────── */}
      <div>
        <PartLabel sub="184px width. Chrome surface. Expandable iterations with page items.">Iteration Sidebar</PartLabel>
        <div style={{
          marginTop: 8, width: 184, backgroundColor: N.chrome,
          borderRadius: 8, border: `1px solid ${N.border}`,
          padding: '8px 4px', display: 'flex', flexDirection: 'column', gap: 0,
        }}>
          {/* Header */}
          <div style={{
            padding: '4px 8px', fontSize: 10, fontWeight: 600, color: N.txtTer,
            textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>Iterations</div>

          {/* Iterations */}
          {[
            { name: 'V8', pages: ['System Parts', 'Assembly'] },
            { name: 'V7', pages: ['Comments Flow', 'FAB Colors', 'OKLCH Tokens'] },
            { name: 'V6', pages: ['App Shell', 'Components'] },
          ].map((iter, i) => (
            <div key={iter.name} style={{ borderTop: i > 0 ? `1px solid ${N.border}` : 'none', marginTop: i > 0 ? 4 : 0, paddingTop: i > 0 ? 4 : 0 }}>
              <button
                onClick={() => setExpanded(e => ({ ...e, [iter.name]: !e[iter.name] }))}
                style={{
                  width: '100%', padding: '4px 8px', border: 'none', borderRadius: 4,
                  backgroundColor: 'transparent', display: 'flex', alignItems: 'center', gap: 4,
                  fontSize: 12, fontWeight: 500, color: N.txtPri, fontFamily: FONT,
                  cursor: 'default', textAlign: 'left',
                }}
              >
                {expanded[iter.name]
                  ? <ChevronDown size={8} strokeWidth={1.5} color={N.txtTer} />
                  : <ChevronRight size={8} strokeWidth={1.5} color={N.txtFaint} />
                }
                {iter.name}
              </button>
              {expanded[iter.name] && iter.pages.map((page, pi) => (
                <button key={page} style={{
                  width: '100%', padding: '3px 8px 3px 24px', border: 'none', borderRadius: 4,
                  backgroundColor: pi === 0 && iter.name === 'V8' ? N.chromeSub : 'transparent',
                  fontSize: 12, fontWeight: pi === 0 && iter.name === 'V8' ? 500 : 400,
                  color: pi === 0 && iter.name === 'V8' ? N.txtPri : N.txtSec,
                  fontFamily: FONT, cursor: 'default', textAlign: 'left',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {page}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── ProjectPicker ──────────────────────────── */}
      <div>
        <PartLabel sub="Dropdown from TopBar. Active project gets accent avatar. Escape/click-outside to dismiss.">Project Picker</PartLabel>
        <div style={{ marginTop: 8, display: 'flex', gap: 40, alignItems: 'flex-start' }}>
          {/* Trigger */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 8, color: N.txtFaint }}>Trigger (closed)</span>
            <button style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '4px 8px', border: 'none', borderRadius: 4,
              backgroundColor: 'transparent', fontFamily: FONT, cursor: 'default',
            }}>
              <div style={{
                width: 20, height: 20, borderRadius: 4, backgroundColor: A[400],
                color: '#fff', fontSize: 10, fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>C</div>
              <span style={{ fontSize: 13, fontWeight: 500, color: N.txtPri }}>canvai-ui</span>
              <ChevronDown size={12} strokeWidth={1.5} color={N.txtTer} />
            </button>
          </div>

          {/* Dropdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 8, color: N.txtFaint }}>Dropdown (open)</span>
            <div style={{
              width: 220, backgroundColor: N.card, borderRadius: 8,
              border: `1px solid ${N.border}`,
              boxShadow: '0 4px 16px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
              padding: 4,
            }}>
              {[
                { name: 'canvai-ui', active: true },
                { name: 'my-app', active: false },
                { name: 'landing-page', active: false },
              ].map(proj => (
                <div key={proj.name} style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '8px 8px',
                  borderRadius: 4, fontSize: 13, color: N.txtPri,
                  backgroundColor: proj.active ? N.chromeSub : 'transparent',
                }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: 4, flexShrink: 0,
                    backgroundColor: proj.active ? A[400] : N.border,
                    color: proj.active ? '#fff' : N.txtSec,
                    fontSize: 10, fontWeight: 600,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{proj.name.charAt(0).toUpperCase()}</div>
                  <span style={{ flex: 1, textAlign: 'left' }}>{proj.name}</span>
                  {proj.active && <Check size={14} strokeWidth={1.5} color={A[400]} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   ANNOTATION PARTS — FAB, Card, Markers, Toast
   ═══════════════════════════════════════════════════════ */

export function V8AnnotationParts() {
  const [text, setText] = useState('')

  return (
    <div style={{ fontFamily: FONT, padding: 8, display: 'flex', flexDirection: 'column', gap: 40 }}>

      {/* ── FAB States ──────────────────────────── */}
      <div>
        <PartLabel sub="40×40px circle. Flat accent. No shadow, no gradient.">Annotation FAB</PartLabel>
        <div style={{ display: 'flex', gap: 24, marginTop: 12, alignItems: 'flex-end' }}>
          {[
            { label: 'Idle', bg: A[400], scale: 1 },
            { label: 'Hover', bg: A[300], scale: 1 },
            { label: 'Pressed', bg: A[500], scale: 0.95 },
          ].map(state => (
            <div key={state.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                backgroundColor: state.bg, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transform: `scale(${state.scale})`,
              }}>
                <SquareMousePointer size={20} strokeWidth={1.5} />
              </div>
              <span style={{ fontSize: 8, color: N.txtFaint }}>{state.label}</span>
            </div>
          ))}

          {/* Comment FAB for comparison */}
          <div style={{ marginLeft: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              backgroundColor: F.comment, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <MessageSquare size={16} strokeWidth={1.5} />
            </div>
            <span style={{ fontSize: 8, color: N.txtFaint }}>Comment FAB</span>
          </div>
        </div>
      </div>

      {/* ── Targeting Highlight ──────────────────────────── */}
      <div>
        <PartLabel sub="2px accent border around targeted element. Cursor becomes crosshair.">Targeting Highlight</PartLabel>
        <div style={{
          marginTop: 12, width: 280, height: 80, borderRadius: 8,
          backgroundColor: N.card, border: `1px solid ${N.borderSoft}`,
          position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 11, color: N.txtSec }}>PricingCard</span>
          {/* Highlight overlay */}
          <div style={{
            position: 'absolute', inset: -2, borderRadius: 10,
            border: `2px solid ${A[400]}`, pointerEvents: 'none',
          }} />
        </div>
      </div>

      {/* ── Comment Card ──────────────────────────── */}
      <div>
        <PartLabel sub="320px width. Auto-positions below target. Apply activates when text entered.">Comment Card</PartLabel>
        <div style={{ display: 'flex', gap: 32, marginTop: 12, alignItems: 'flex-start' }}>
          {/* Empty state */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 8, color: N.txtFaint }}>Empty</span>
            <div style={{
              width: 320, backgroundColor: N.card, borderRadius: 10, padding: 16,
              border: `1px solid ${N.border}`,
              boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
              display: 'flex', flexDirection: 'column', gap: 8,
            }}>
              <div style={{ fontSize: 11, color: N.txtTer, letterSpacing: '0.02em' }}>
                PricingCard &middot; h2
              </div>
              <textarea
                readOnly
                placeholder="Describe the change..."
                style={{
                  width: '100%', minHeight: 72, resize: 'vertical', boxSizing: 'border-box',
                  backgroundColor: N.canvas, color: N.txtFaint, border: `1px solid ${N.border}`,
                  borderRadius: 8, padding: 10, fontSize: 13, lineHeight: 1.5,
                  outline: 'none', fontFamily: FONT,
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button style={{
                  padding: '7px 14px', borderRadius: 8, border: `1px solid ${N.border}`,
                  backgroundColor: 'transparent', fontSize: 12, fontWeight: 500,
                  color: N.txtSec, fontFamily: FONT, cursor: 'default',
                }}>Cancel</button>
                <button style={{
                  padding: '7px 14px', borderRadius: 8, border: 'none',
                  backgroundColor: A[100], color: N.txtTer,
                  fontSize: 12, fontWeight: 500, fontFamily: FONT, cursor: 'default',
                }}>Apply</button>
              </div>
            </div>
          </div>

          {/* Filled state */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 8, color: N.txtFaint }}>Filled</span>
            <div style={{
              width: 320, backgroundColor: N.card, borderRadius: 10, padding: 16,
              border: `1px solid ${N.border}`,
              boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
              display: 'flex', flexDirection: 'column', gap: 8,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: 11, color: N.txtTer, letterSpacing: '0.02em' }}>
                  PricingCard &middot; h2
                </div>
                <button style={{
                  width: 24, height: 24, borderRadius: 4, border: 'none',
                  backgroundColor: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: N.txtTer, cursor: 'default',
                }}>
                  <Trash2 size={14} strokeWidth={1.5} />
                </button>
              </div>
              <textarea
                value={text || 'Make the heading 20px semibold'}
                onChange={e => setText(e.target.value)}
                style={{
                  width: '100%', minHeight: 72, resize: 'vertical', boxSizing: 'border-box',
                  backgroundColor: N.canvas, color: N.txtPri, border: `1px solid ${N.border}`,
                  borderRadius: 8, padding: 10, fontSize: 13, lineHeight: 1.5,
                  outline: 'none', fontFamily: FONT,
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button style={{
                  padding: '7px 14px', borderRadius: 8, border: `1px solid ${N.border}`,
                  backgroundColor: 'transparent', fontSize: 12, fontWeight: 500,
                  color: N.txtSec, fontFamily: FONT, cursor: 'default',
                }}>Cancel</button>
                <button style={{
                  padding: '7px 14px', borderRadius: 8, border: 'none',
                  backgroundColor: A[400], color: '#fff',
                  fontSize: 12, fontWeight: 500, fontFamily: FONT, cursor: 'default',
                }}>Apply</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Markers + Toast ──────────────────────────── */}
      <div>
        <PartLabel sub="18×18px numbered dots. Flat accent. Track element position via rAF.">Annotation Markers</PartLabel>
        <div style={{ display: 'flex', gap: 12, marginTop: 12, alignItems: 'center' }}>
          {[1, 2, 3, 4, 5].map(n => (
            <div key={n} style={{
              width: 18, height: 18, borderRadius: '50%',
              backgroundColor: A[400],
              color: '#fff', fontSize: 9, fontWeight: 700, fontFamily: FONT,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{n}</div>
          ))}
        </div>

        <PartLabel sub="20px pill. Near-black background. Auto-dismiss after 2s.">Toast</PartLabel>
        <div style={{
          marginTop: 8, display: 'inline-flex', padding: '8px 24px', borderRadius: 20,
          backgroundColor: N.txtPri, color: '#fff',
          fontSize: 13, fontWeight: 500, fontFamily: FONT,
          boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
        }}>
          Sent to agent
        </div>
      </div>

      {/* ── Frame Label ──────────────────────────── */}
      <div>
        <PartLabel sub="12px / zoom. Gray. Drag handle for repositioning frames on canvas.">Frame Label</PartLabel>
        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: 12, color: N.txtFaint, marginBottom: 8 }}>Step 1 — Sign In</div>
          <div style={{
            width: 200, height: 80, borderRadius: 4, backgroundColor: N.card,
            border: `1px solid ${N.borderSoft}`,
          }} />
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   COMMENTS (PLANNED) — GitHub-backed comment system
   ═══════════════════════════════════════════════════════ */

export function V8Comments() {
  return (
    <div style={{ fontFamily: FONT, padding: 8, display: 'flex', flexDirection: 'column', gap: 40 }}>
      <PartLabel sub="Planned feature. Comments backed by GitHub Issues. OAuth device flow for auth.">Comments System (Planned)</PartLabel>

      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
        {/* Sign-in card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 8, fontWeight: 600, color: N.txtTer, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Sign In</span>
          <div style={{
            width: 260, backgroundColor: N.card, borderRadius: 10, padding: 16,
            border: `1px solid ${N.border}`,
            boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
          }}>
            <Github size={24} strokeWidth={1.5} color={N.txtPri} />
            <div style={{ fontSize: 13, fontWeight: 600, color: N.txtPri, textAlign: 'center' }}>Sign in with GitHub</div>
            <div style={{ fontSize: 12, color: N.txtSec, textAlign: 'center', lineHeight: 1.5, textWrap: 'pretty' } as React.CSSProperties}>
              Comments are backed by GitHub Issues. Sign in to post and reply.
            </div>
            <button style={{
              width: '100%', padding: '8px 16px', borderRadius: 8, border: 'none',
              backgroundColor: N.txtPri, color: '#fff',
              fontSize: 13, fontWeight: 500, fontFamily: FONT, cursor: 'default',
            }}>Continue with GitHub</button>
          </div>
        </div>

        {/* Device code */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 8, fontWeight: 600, color: N.txtTer, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Device Code</span>
          <div style={{
            width: 260, backgroundColor: N.card, borderRadius: 10, padding: 16,
            border: `1px solid ${N.border}`,
            boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
          }}>
            <div style={{ fontSize: 12, color: N.txtSec, textAlign: 'center', lineHeight: 1.5, textWrap: 'pretty' } as React.CSSProperties}>
              Enter this code at <span style={{ fontWeight: 600, color: N.txtPri }}>github.com/login/device</span>
            </div>
            <div style={{
              padding: '12px 24px', borderRadius: 8,
              backgroundColor: N.canvas, border: `1px solid ${N.border}`,
              fontFamily: MONO, fontSize: 20, fontWeight: 700, color: N.txtPri,
              letterSpacing: '0.1em', textAlign: 'center',
            }}>ABCD-1234</div>
            <button style={{
              padding: '6px 16px', borderRadius: 8, border: `1px solid ${N.border}`,
              backgroundColor: N.card, fontSize: 12, color: N.txtSec,
              fontFamily: FONT, cursor: 'default',
            }}>I've entered the code</button>
          </div>
        </div>

        {/* Compose card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 8, fontWeight: 600, color: N.txtTer, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Compose</span>
          <div style={{
            width: 280, backgroundColor: N.card, borderRadius: 10, padding: 12,
            border: `1px solid ${N.border}`,
            boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
            display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, color: N.txtTer, letterSpacing: '0.02em' }}>PricingCard &middot; h2</span>
              <button style={{
                width: 24, height: 24, borderRadius: 4, border: 'none',
                backgroundColor: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: N.txtTer, cursor: 'default',
              }}><X size={12} strokeWidth={1.5} /></button>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                backgroundColor: A[400], color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 600,
              }}>N</div>
              <textarea
                readOnly placeholder="Add a comment..."
                style={{
                  flex: 1, minHeight: 56, padding: '8px 10px', borderRadius: 6, boxSizing: 'border-box',
                  backgroundColor: N.canvas, border: `1px solid ${N.border}`,
                  fontSize: 12, color: N.txtFaint, fontFamily: FONT,
                  resize: 'vertical', outline: 'none', lineHeight: 1.5,
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button style={{
                padding: '8px 12px', borderRadius: 8, border: `1px solid ${N.border}`,
                backgroundColor: N.card, fontSize: 12, color: N.txtSec,
                fontFamily: FONT, cursor: 'default',
              }}>Cancel</button>
              <button style={{
                padding: '8px 12px', borderRadius: 8, border: 'none',
                backgroundColor: A[100], color: N.txtTer,
                fontSize: 12, fontWeight: 500, fontFamily: FONT, cursor: 'default',
              }}>Post</button>
            </div>
          </div>
        </div>

        {/* Thread */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 8, fontWeight: 600, color: N.txtTer, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Thread</span>
          <div style={{
            width: 340, backgroundColor: N.card, borderRadius: 10, padding: 16,
            boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
            border: `1px solid ${N.border}`,
            display: 'flex', flexDirection: 'column', gap: 12,
          }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: N.txtPri }}>Comment</span>
                <span style={{ fontSize: 11, color: N.txtTer }}>2 replies</span>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                <div style={{ width: 24, height: 24, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: N.txtTer }}>
                  <MoreHorizontal size={16} strokeWidth={1.5} />
                </div>
                <div style={{ width: 24, height: 24, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: N.txtTer }}>
                  <Check size={14} strokeWidth={1.5} />
                </div>
                <div style={{ width: 24, height: 24, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: N.txtTer }}>
                  <X size={14} strokeWidth={1.5} />
                </div>
              </div>
            </div>

            <div style={{ fontSize: 11, color: N.txtTer, letterSpacing: '0.02em', padding: '4px 0', borderBottom: `1px solid ${N.border}` }}>
              PricingCard &middot; h2
            </div>

            {/* Messages */}
            {[
              { name: 'Gustav', letter: 'G', color: A[500], time: '5m', text: 'The heading feels too large for this card.' },
              { name: 'Noam', letter: 'N', color: A[400], time: '3m', text: 'Good catch. Border-radius should be 8 too.' },
            ].map(msg => (
              <div key={msg.name} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                  backgroundColor: msg.color, color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 600,
                }}>{msg.letter}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: N.txtPri }}>{msg.name}</span>
                    <span style={{ fontSize: 11, color: N.txtTer }}>{msg.time}</span>
                  </div>
                  <div style={{ fontSize: 13, color: N.txtPri, lineHeight: 1.5, textWrap: 'pretty' } as React.CSSProperties}>{msg.text}</div>
                </div>
              </div>
            ))}

            {/* Reply */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 0 0', borderTop: `1px solid ${N.border}`,
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                backgroundColor: A[400], color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 9, fontWeight: 600,
              }}>N</div>
              <input
                readOnly placeholder="Reply"
                style={{
                  flex: 1, padding: '8px 12px', borderRadius: 20,
                  backgroundColor: N.canvas, fontSize: 13, color: N.txtFaint,
                  border: 'none', outline: 'none', fontFamily: FONT,
                }}
              />
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                backgroundColor: N.canvas, color: N.txtTer,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Send size={14} strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </div>

        {/* Pins */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 8, fontWeight: 600, color: N.txtTer, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Avatar Pins</span>
          <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginTop: 8 }}>
            {/* Active pin with reply badge */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  backgroundColor: A[500], color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 600,
                }}>G</div>
                <div style={{
                  position: 'absolute', top: -4, right: -8,
                  minWidth: 16, height: 16, borderRadius: 8, backgroundColor: A[400],
                  color: '#fff', fontSize: 9, fontWeight: 700, fontFamily: FONT,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '0 4px', border: `2px solid ${N.canvas}`,
                }}>3</div>
              </div>
              <span style={{ fontSize: 7, color: N.txtFaint }}>Active + replies</span>
            </div>

            {/* Active pin no replies */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                backgroundColor: oklch(0.58, 0.12, 200), color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 600,
              }}>S</div>
              <span style={{ fontSize: 7, color: N.txtFaint }}>Active</span>
            </div>

            {/* Pin with annotation dot */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  backgroundColor: A[400], color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 600,
                }}>N</div>
                <div style={{
                  position: 'absolute', bottom: -2, right: -2,
                  width: 10, height: 10, borderRadius: '50%',
                  backgroundColor: A[400], border: `2px solid ${N.canvas}`,
                }} />
              </div>
              <span style={{ fontSize: 7, color: N.txtFaint }}>Has annotation</span>
            </div>

            {/* Resolved */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ opacity: 0.5 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', backgroundColor: F.resolved,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Check size={14} strokeWidth={1.5} color="#fff" />
                </div>
              </div>
              <span style={{ fontSize: 7, color: N.txtFaint }}>Resolved</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   ASSEMBLY — Full shell with all parts composed
   Based on AccentPreview layout (#33) with Cerulean 400
   ═══════════════════════════════════════════════════════ */

export function V8Assembly() {
  return (
    <div style={{ fontFamily: FONT, padding: 8, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <PartLabel sub="All parts composed into the complete Canvai shell. Cerulean 400 accent on achromatic chrome.">Full Assembly</PartLabel>

      <div style={{
        width: 720, height: 480, borderRadius: 12, overflow: 'hidden',
        border: `1px solid ${N.border}`,
        display: 'flex', flexDirection: 'column',
      }}>
        {/* ── TopBar ──────────────────────── */}
        <div style={{
          height: 40, backgroundColor: N.chrome, borderBottom: `1px solid ${N.border}`,
          display: 'flex', alignItems: 'center', padding: '0 12px', gap: 8, flexShrink: 0,
        }}>
          <PanelLeft size={14} strokeWidth={1.5} color={N.txtTer} />
          <div style={{
            width: 16, height: 16, borderRadius: 4, backgroundColor: A[400],
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 8, fontWeight: 700,
          }}>C</div>
          <span style={{ fontSize: 11, fontWeight: 500, color: N.txtPri }}>canvai-ui</span>
          <ChevronDown size={10} strokeWidth={1.5} color={N.txtTer} />
          <div style={{ flex: 1 }} />
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '3px 10px', borderRadius: 12,
            backgroundColor: oklch(0.93, 0.05, 155),
          }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%', backgroundColor: F.success,
              boxShadow: `0 0 4px ${oklch(0.55, 0.10, 155)}`,
            }} />
            <span style={{ fontSize: 10, fontWeight: 500, color: oklch(0.40, 0.12, 155) }}>Watch</span>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* ── Sidebar ──────────────────────── */}
          <div style={{
            width: 160, borderRight: `1px solid ${N.border}`,
            backgroundColor: N.chrome, padding: '8px 0', flexShrink: 0,
            display: 'flex', flexDirection: 'column', gap: 2,
          }}>
            <div style={{ padding: '4px 12px', display: 'flex', alignItems: 'center', gap: 4 }}>
              <ChevronDown size={8} strokeWidth={1.5} color={N.txtTer} />
              <span style={{ fontSize: 10, fontWeight: 600, color: N.txtPri }}>V8</span>
            </div>
            {['System Parts', 'Assembly'].map((name, i) => (
              <div key={name} style={{
                padding: '3px 12px 3px 24px', fontSize: 10,
                color: i === 0 ? N.txtPri : N.txtSec,
                fontWeight: i === 0 ? 600 : 400,
                backgroundColor: i === 0 ? N.chromeSub : 'transparent',
                borderRadius: 4, margin: '0 4px',
              }}>{name}</div>
            ))}
            <div style={{ padding: '4px 12px', display: 'flex', alignItems: 'center', gap: 4, marginTop: 4, borderTop: `1px solid ${N.border}`, paddingTop: 8 }}>
              <ChevronRight size={8} strokeWidth={1.5} color={N.txtFaint} />
              <span style={{ fontSize: 10, color: N.txtTer }}>V7</span>
            </div>
            <div style={{ padding: '4px 12px', display: 'flex', alignItems: 'center', gap: 4 }}>
              <ChevronRight size={8} strokeWidth={1.5} color={N.txtFaint} />
              <span style={{ fontSize: 10, color: N.txtTer }}>V6</span>
            </div>
          </div>

          {/* ── Canvas ──────────────────────── */}
          <div style={{ flex: 1, backgroundColor: N.canvas, position: 'relative' }}>
            {/* Design cards */}
            <div style={{ padding: 24, display: 'flex', gap: 20 }}>
              {/* Card A — Sign In */}
              <div style={{
                width: 160, borderRadius: 8, backgroundColor: N.card,
                border: `1px solid ${N.borderSoft}`, padding: 12,
                display: 'flex', flexDirection: 'column', gap: 8,
              }}>
                <div style={{ fontSize: 9, fontWeight: 600, color: N.txtPri }}>Sign In</div>
                <div style={{ height: 20, borderRadius: 4, backgroundColor: N.canvas, border: `1px solid ${N.borderSoft}` }} />
                <div style={{
                  height: 24, borderRadius: 6, backgroundColor: A[400], color: '#fff',
                  fontSize: 9, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>Connect GitHub</div>
                <div style={{ fontSize: 8, color: N.txtFaint, textAlign: 'center' }}>OAuth device flow</div>
              </div>

              {/* Card B — Thread */}
              <div style={{
                width: 148, borderRadius: 8, backgroundColor: N.card,
                border: `1px solid ${N.borderSoft}`, padding: 12,
                display: 'flex', flexDirection: 'column', gap: 6,
              }}>
                <div style={{ fontSize: 9, fontWeight: 600, color: N.txtPri }}>Thread</div>
                {[
                  { letter: 'N', text: 'Spacing feels off', time: '2m' },
                  { letter: 'G', text: 'Try 8px gap', time: '1m' },
                ].map((msg, i) => (
                  <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                    <div style={{
                      width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                      backgroundColor: i === 0 ? F.comment : N.txtSec,
                      color: '#fff', fontSize: 6, fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>{msg.letter}</div>
                    <div>
                      <div style={{ fontSize: 8, color: N.txtSec, lineHeight: 1.3 }}>{msg.text}</div>
                      <div style={{ fontSize: 7, color: N.txtFaint }}>{msg.time}</div>
                    </div>
                  </div>
                ))}
                <div style={{
                  height: 18, borderRadius: 4, backgroundColor: N.canvas,
                  border: `1px solid ${N.borderSoft}`,
                  display: 'flex', alignItems: 'center', padding: '0 6px',
                }}>
                  <span style={{ fontSize: 7, color: N.txtFaint }}>Reply…</span>
                </div>
              </div>

              {/* Card C — Annotation Card */}
              <div style={{
                width: 140, borderRadius: 8, backgroundColor: N.card,
                border: `1px solid ${N.borderSoft}`, padding: 10,
                display: 'flex', flexDirection: 'column', gap: 6,
              }}>
                <div style={{ fontSize: 9, fontWeight: 600, color: N.txtPri }}>Annotation</div>
                <div style={{ fontSize: 7, color: N.txtTer }}>Button &middot; span</div>
                <div style={{
                  height: 32, borderRadius: 4, backgroundColor: N.canvas,
                  border: `1px solid ${N.borderSoft}`,
                  display: 'flex', alignItems: 'center', padding: '0 6px',
                }}>
                  <span style={{ fontSize: 7, color: N.txtFaint }}>Make it 20px…</span>
                </div>
                <div style={{
                  height: 18, borderRadius: 4, backgroundColor: A[400], color: '#fff',
                  fontSize: 7, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>Apply</div>
              </div>
            </div>

            {/* Comment pin */}
            <div style={{
              position: 'absolute', top: 20, left: 176,
              width: 22, height: 22, borderRadius: '50%',
              backgroundColor: F.comment, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 9, fontWeight: 700, boxShadow: '0 1px 4px rgba(0,0,0,0.10)',
            }}>N</div>
            <div style={{
              position: 'absolute', top: 16, left: 192,
              width: 13, height: 13, borderRadius: '50%',
              backgroundColor: F.comment, color: '#fff',
              fontSize: 7, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: `2px solid ${N.canvas}`,
            }}>2</div>

            {/* Annotation marker */}
            <div style={{
              position: 'absolute', top: 32, right: 100,
              width: 18, height: 18, borderRadius: '50%',
              backgroundColor: A[400],
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 9, fontWeight: 700,
            }}>1</div>

            {/* Resolved pin */}
            <div style={{
              position: 'absolute', bottom: 60, left: 32, opacity: 0.35,
              width: 16, height: 16, borderRadius: '50%',
              backgroundColor: F.resolved,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Check size={9} strokeWidth={1.5} color="#fff" />
            </div>

            {/* FABs */}
            <div style={{
              position: 'absolute', bottom: 16, right: 16,
              display: 'flex', flexDirection: 'column', gap: 8,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                backgroundColor: F.comment, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <MessageSquare size={14} strokeWidth={1.5} />
              </div>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                backgroundColor: A[400], color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <SquareMousePointer size={14} strokeWidth={1.5} />
              </div>
            </div>

            {/* Toast */}
            <div style={{
              position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
              padding: '6px 20px', borderRadius: 20,
              backgroundColor: N.txtPri, color: '#fff',
              fontSize: 11, fontWeight: 500,
              boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
            }}>
              Sent to agent
            </div>
          </div>
        </div>
      </div>

      {/* Swatches */}
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        <Swatch color={F.comment} label="Comment" size={20} />
        <Swatch color={A[400]} label="Accent" size={20} />
        <Swatch color={A[100]} label="Tint" size={20} />
        <div style={{ width: 1, height: 16, backgroundColor: N.border, margin: '0 4px' }} />
        <Swatch color={N.chrome} label="Chrome" size={20} />
        <Swatch color={N.canvas} label="Canvas" size={20} />
        <Swatch color={N.card} label="Card" size={20} />
        <div style={{ width: 1, height: 16, backgroundColor: N.border, margin: '0 4px' }} />
        <Swatch color={N.border} label="Border" size={20} />
        <Swatch color={N.txtPri} label="Text" size={20} />
        <Swatch color={N.txtTer} label="Muted" size={20} />
      </div>
    </div>
  )
}
