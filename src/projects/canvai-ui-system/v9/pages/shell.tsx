import { useState } from 'react'
import { PanelLeft, ChevronDown, SquareMousePointer, Palette, Check, Sun, Moon, Monitor } from 'lucide-react'
import { E, S, R, T, FONT } from '../tokens'
import { PreviewTopBar, PreviewSidebar, ZoomControl, CanvasColorPicker, ThemeToggle } from '../components'
import type { ThemeMode } from '../components'

const iterations = ['V1', 'V2', 'V3']

const pages = [
  { name: 'Tokens' },
  { name: 'Components' },
  { name: 'Shell' },
  { name: 'Team Settings' },
]

/* ─── Canvas content placeholder ─── */
function CanvasFrames({ cardBg, borderColor, accentColor, subBg, textColor }: {
  cardBg: string; borderColor: string; accentColor: string; subBg: string; textColor: string
}) {
  return (
    <div style={{ display: 'flex', gap: S.xl, padding: S.xxl }}>
      {[1, 2, 3].map(i => (
        <div key={i} style={{
          width: 160, height: 120,
          backgroundColor: cardBg,
          borderRadius: R.card,
          border: `1px solid ${borderColor}`,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: S.sm,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            backgroundColor: i === 2 ? accentColor : subBg,
          }} />
          <div style={{ fontSize: T.body, color: textColor }}>Frame {i}</div>
        </div>
      ))}
    </div>
  )
}

function DarkCanvasContent() {
  return <CanvasFrames cardBg="var(--card)" borderColor="var(--border-soft)" accentColor="var(--accent)" subBg="var(--chrome-sub)" textColor="var(--txt-sec)" />
}

/* ─── Light mode tokens (V8 values) ─── */
const L = {
  chrome:     'oklch(0.985 0.000 90)',
  chromeSub:  'oklch(0.955 0.003 80)',
  canvas:     'oklch(0.972 0.001 197)',
  card:       'oklch(0.993 0.003 80)',
  border:     'oklch(0.895 0.005 80)',
  borderSoft: 'oklch(0.925 0.003 80)',
  txtPri:     'oklch(0.180 0.005 80)',
  txtSec:     'oklch(0.380 0.005 80)',
  txtTer:     'oklch(0.540 0.005 80)',
  txtFaint:   'oklch(0.660 0.003 80)',
  accent:     'oklch(0.300 0.005 80)',
  accentHover:'oklch(0.400 0.005 80)',
}

const lightCanvasPresets = [
  { name: 'Default', value: 'oklch(0.972 0.001 197)' },
  { name: 'Warm',    value: 'oklch(0.955 0.008 80)' },
  { name: 'Neutral', value: 'oklch(0.935 0.000 0)' },
  { name: 'Cool',    value: 'oklch(0.965 0.005 230)' },
  { name: 'Cream',   value: 'oklch(0.960 0.012 90)' },
]

/* ─── Light theme toggle (inline, uses light tokens) ─── */
function LightThemeToggle({ mode, onChange }: { mode: ThemeMode; onChange: (m: ThemeMode) => void }) {
  const modes: { value: ThemeMode; Icon: typeof Sun }[] = [
    { value: 'system', Icon: Monitor },
    { value: 'light',  Icon: Sun },
    { value: 'dark',   Icon: Moon },
  ]

  return (
    <div style={{
      display: 'inline-flex', gap: 2, padding: 2,
      borderRadius: R.pill,
      backgroundColor: L.chromeSub,
      fontFamily: FONT,
    }}>
      {modes.map(m => {
        const active = m.value === mode
        return (
          <button
            key={m.value}
            onClick={() => onChange(m.value)}
            title={m.value.charAt(0).toUpperCase() + m.value.slice(1)}
            style={{
              width: 28, height: 24, border: 'none',
              borderRadius: R.pill,
              backgroundColor: active ? L.card : 'transparent',
              color: active ? L.txtPri : L.txtFaint,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'default', padding: 0,
              boxShadow: active ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
            }}
          >
            <m.Icon size={12} strokeWidth={1.5} />
          </button>
        )
      })}
    </div>
  )
}

/* ─── Static light mode shell (reference for contrast comparison) ─── */
function LightShellPreview({ canvasColor, onCanvasColor, themeMode, onThemeMode }: {
  canvasColor: string; onCanvasColor: (c: string) => void
  themeMode: ThemeMode; onThemeMode: (m: ThemeMode) => void
}) {
  return (
    <div style={{
      width: '100%', minHeight: 400,
      display: 'flex', flexDirection: 'column',
      fontFamily: FONT, overflow: 'hidden',
      borderRadius: R.card,
    }}>
      {/* Light TopBar */}
      <div style={{
        display: 'flex', alignItems: 'center',
        minHeight: 40, padding: `0 ${S.md}px`,
        backgroundColor: L.chrome,
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: S.sm }}>
          <PanelLeft size={16} strokeWidth={1.5} color={L.txtPri} />
          <div style={{
            width: S.xl, height: S.xl, borderRadius: '50%',
            backgroundColor: L.accent, color: 'oklch(1 0 0)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: T.pill, fontWeight: 600,
          }}>C</div>
          <span style={{ fontSize: T.title, fontWeight: 500, color: L.txtPri }}>canvai-ui-system</span>
          <ChevronDown size={12} strokeWidth={1.5} color={L.txtTer} />
        </div>
        <div style={{ flex: 1 }} />
        <div style={{
          display: 'inline-flex', gap: S.xs, padding: S.xs,
          borderRadius: R.pill, backgroundColor: L.chromeSub,
        }}>
          {iterations.map((name, i) => (
            <div key={i} style={{
              width: 32, padding: `${S.xs}px ${S.sm}px`, borderRadius: R.pill,
              fontSize: T.pill, fontWeight: i === 2 ? 600 : 400,
              fontFamily: FONT, textAlign: 'center',
              backgroundColor: i === 2 ? L.card : 'transparent',
              color: i === 2 ? L.txtPri : L.txtFaint,
              boxShadow: i === 2 ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
            }}>{name}</div>
          ))}
        </div>
      </div>

      {/* Light body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Light sidebar */}
        <div style={{
          width: 160, backgroundColor: L.chrome,
          padding: `${S.md}px 0`,
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden', flexShrink: 0,
        }}>
          <div style={{
            padding: `0 ${S.lg}px`, marginBottom: S.xs,
            fontSize: T.label, fontWeight: 600, color: L.txtFaint,
            textTransform: 'uppercase', letterSpacing: '0.08em',
          }}>System</div>
          {['Tokens', 'Components'].map(name => (
            <div key={name} style={{
              display: 'flex', alignItems: 'center', gap: S.sm,
              padding: `${S.xs}px ${S.sm}px`,
              margin: `0 ${S.sm}px`,
              borderRadius: R.control,
              fontSize: T.body, color: L.txtSec,
            }}>{name}</div>
          ))}
          <div style={{ marginTop: S.md }}>
            <div style={{
              padding: `0 ${S.lg}px`, marginBottom: S.xs,
              fontSize: T.label, fontWeight: 600, color: L.txtFaint,
              textTransform: 'uppercase', letterSpacing: '0.08em',
            }}>Pages</div>
            {['Shell', 'Team Settings'].map((name, i) => (
              <div key={name} style={{
                display: 'flex', alignItems: 'center', gap: S.sm,
                padding: `${S.xs}px ${S.sm}px`,
                margin: `0 ${S.sm}px`,
                borderRadius: R.control,
                backgroundColor: i === 0 ? L.chromeSub : 'transparent',
                fontSize: T.body,
                color: i === 0 ? L.txtPri : L.txtSec,
              }}>{name}</div>
            ))}
          </div>
        </div>

        {/* Light canvas area */}
        <div style={{ flex: 1, backgroundColor: L.chrome, padding: E.inset, position: 'relative' }}>
          <div style={{
            width: '100%', height: '100%',
            borderRadius: E.radius,
            backgroundColor: canvasColor,
            boxShadow: `0 1px 3px rgba(0,0,0,0.04), 0 0 0 1px ${L.borderSoft}`,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 200ms ease',
          }}>
            <CanvasFrames cardBg={L.card} borderColor={L.borderSoft} accentColor={L.accent} subBg={L.chromeSub} textColor={L.txtSec} />
          </div>
          {/* Light controls — top-right */}
          <div style={{
            position: 'absolute',
            top: E.inset + S.md,
            right: E.inset + S.md,
            display: 'flex', gap: S.sm, alignItems: 'center',
          }}>
            <LightThemeToggle mode={themeMode} onChange={onThemeMode} />
            <div style={{
              display: 'flex', gap: S.sm,
              background: L.chrome,
              border: `1px solid ${L.borderSoft}`,
              borderRadius: R.card,
              padding: S.sm,
            }}>
            {lightCanvasPresets.map(p => (
              <button
                key={p.name}
                onClick={() => onCanvasColor(p.value)}
                title={p.name}
                style={{
                  width: S.xl, height: S.xl, borderRadius: '50%',
                  border: canvasColor === p.value
                    ? `2px solid ${L.accent}`
                    : `1px solid ${L.border}`,
                  background: p.value, cursor: 'default', padding: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxSizing: 'border-box',
                }}
              >
                {canvasColor === p.value && <Check size={10} strokeWidth={2.5} color={L.accent} />}
              </button>
            ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── FAB ─── */
function FAB({ color, shadow }: { color: string; shadow: string }) {
  return (
    <div style={{ position: 'absolute', bottom: S.lg + S.md, right: S.lg + S.md }}>
      <div style={{
        width: 40, height: 40, borderRadius: '50%',
        backgroundColor: 'var(--accent)', color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: shadow,
      }}>
        <SquareMousePointer size={S.xl} strokeWidth={1.5} />
      </div>
    </div>
  )
}

/* ─── Main Shell page ─── */
export function Shell() {
  const [iterIdx, setIterIdx] = useState(0)
  const [pageIdx, setPageIdx] = useState(2)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [zoom, setZoom] = useState(0.85)
  const [darkCanvas, setDarkCanvas] = useState('oklch(0.180 0.005 80)')
  const [lightCanvas, setLightCanvas] = useState('oklch(0.972 0.001 197)')
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark')
  const [lightThemeMode, setLightThemeMode] = useState<ThemeMode>('light')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S.xxl }}>
      {/* Side-by-side: Dark vs Light */}
      <div style={{ display: 'flex', gap: S.xxl }}>
        {/* Dark shell */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: T.label, fontWeight: 600, color: 'var(--txt-faint)',
            textTransform: 'uppercase', letterSpacing: '0.08em',
            marginBottom: S.sm, fontFamily: FONT,
          }}>
            Dark Mode
          </div>
          <div style={{
            width: '100%', minHeight: 400,
            display: 'flex', flexDirection: 'column',
            fontFamily: FONT, overflow: 'hidden',
            position: 'relative',
            borderRadius: R.card,
          }}>
            <PreviewTopBar
              projectName="canvai-ui-system"
              iterations={iterations}
              activeIterationIndex={iterIdx}
              onSelectIteration={setIterIdx}
              pendingCount={1}
              mode="manual"
              sidebarOpen={sidebarOpen}
              onToggleSidebar={() => setSidebarOpen(o => !o)}
            />
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
              <PreviewSidebar
                pages={pages}
                activePageIndex={pageIdx}
                onSelectPage={setPageIdx}
                collapsed={!sidebarOpen}
              />
              <div style={{ flex: 1, backgroundColor: 'var(--chrome)', padding: E.inset, position: 'relative' }}>
                <div style={{
                  width: '100%', height: '100%',
                  borderRadius: E.radius,
                  backgroundColor: darkCanvas,
                  boxShadow: E.shadow,
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background-color 200ms ease',
                }}>
                  <DarkCanvasContent />
                </div>
                <div style={{
                  position: 'absolute',
                  top: E.inset + S.md,
                  right: E.inset + S.md,
                  display: 'flex', gap: S.sm, alignItems: 'center',
                }}>
                  <ThemeToggle mode={themeMode} onChange={setThemeMode} />
                  <CanvasColorPicker
                    activeColor={darkCanvas}
                    onSelect={setDarkCanvas}
                  />
                  <ZoomControl
                    zoom={zoom}
                    onZoomIn={() => setZoom(z => Math.min(5, z * 1.2))}
                    onZoomOut={() => setZoom(z => Math.max(0.1, z * 0.8))}
                    onFitToView={() => setZoom(1)}
                  />
                </div>
              </div>
            </div>
            <FAB color="oklch(0.08 0 0)" shadow="inset 0 1px 0 rgba(255,255,255,0.04), 0 1px 3px rgba(0,0,0,0.32), 0 0 0 0.5px rgba(0,0,0,0.16)" />
          </div>
        </div>

        {/* Light shell */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: T.label, fontWeight: 600, color: 'var(--txt-faint)',
            textTransform: 'uppercase', letterSpacing: '0.08em',
            marginBottom: S.sm, fontFamily: FONT,
          }}>
            Light Mode
          </div>
          <LightShellPreview canvasColor={lightCanvas} onCanvasColor={setLightCanvas} themeMode={lightThemeMode} onThemeMode={setLightThemeMode} />
        </div>
      </div>
    </div>
  )
}
