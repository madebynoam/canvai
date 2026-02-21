import { useState } from 'react'
import { SquareMousePointer } from 'lucide-react'
import { E, S, R, T, FONT } from '../tokens'
import { PreviewTopBar, PreviewSidebar, ZoomControl, CanvasColorPicker, InfoButton } from '../components'
import type { ThemeMode } from '../components'

const iterations = ['V1', 'V2', 'V3']

const pages = [
  { name: 'Tokens' },
  { name: 'Components' },
  { name: 'Shell' },
  { name: 'Team Settings' },
]

/* ─── CSS variable overrides for light mode ─── */
const lightOverrides: Record<string, string> = {
  '--chrome':       'oklch(0.985 0.000 90)',
  '--chrome-sub':   'oklch(0.955 0.003 80)',
  '--canvas':       'oklch(0.972 0.001 197)',
  '--card':         'oklch(0.993 0.003 80)',
  '--border':       'oklch(0.895 0.005 80)',
  '--border-soft':  'oklch(0.925 0.003 80)',
  '--txt-pri':      'oklch(0.180 0.005 80)',
  '--txt-sec':      'oklch(0.380 0.005 80)',
  '--txt-ter':      'oklch(0.540 0.005 80)',
  '--txt-faint':    'oklch(0.660 0.003 80)',
  '--accent':       'oklch(0.300 0.005 80)',
  '--accent-hover': 'oklch(0.400 0.005 80)',
  '--accent-muted': 'oklch(0.920 0.003 80)',
  '--accent-strong':'oklch(0.220 0.005 80)',
  '--accent-border':'oklch(0.700 0.005 80)',
  '--text-on-accent':'oklch(1 0 0)',
  '--hover-subtle':  'rgba(0,0,0,0.03)',
  '--hover-active':  'rgba(0,0,0,0.06)',
}

const lightCanvasPresets = [
  { name: 'Default', value: 'oklch(0.972 0.001 197)' },
  { name: 'Warm',    value: 'oklch(0.955 0.008 80)' },
  { name: 'Neutral', value: 'oklch(0.935 0.000 0)' },
  { name: 'Cool',    value: 'oklch(0.965 0.005 230)' },
  { name: 'Cream',   value: 'oklch(0.960 0.012 90)' },
]

/* ─── Shared canvas content ─── */
function CanvasContent() {
  return (
    <div style={{ display: 'flex', gap: S.xl, padding: S.xxl }}>
      {[1, 2, 3].map(i => (
        <div key={i} style={{
          width: 160, height: 120,
          backgroundColor: 'var(--card)',
          borderRadius: R.card,
          border: `1px solid var(--border-soft)`,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: S.sm,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            backgroundColor: i === 2 ? 'var(--accent)' : 'var(--chrome-sub)',
          }} />
          <div style={{ fontSize: T.body, color: 'var(--txt-sec)' }}>Frame {i}</div>
        </div>
      ))}
    </div>
  )
}

/* ─── FAB ─── */
function FAB() {
  return (
    <div style={{ position: 'absolute', bottom: S.lg + S.md, right: S.lg + S.md }}>
      <div style={{
        width: 40, height: 40, borderRadius: '50%',
        backgroundColor: 'var(--accent)',
        color: 'var(--txt-pri)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 1px 3px rgba(0,0,0,0.24), 0 0 0 0.5px rgba(0,0,0,0.12)',
      }}>
        <SquareMousePointer size={S.xl} strokeWidth={1.5} />
      </div>
    </div>
  )
}

/* ─── Reusable shell preview ─── */
function ShellPreview({ label, canvasColor, onCanvasColor, canvasPresets, themeMode, onThemeMode, zoom, onZoom, iterIdx, onIterIdx, pageIdx, onPageIdx, sidebarOpen, onToggleSidebar, styleOverrides }: {
  label: string
  canvasColor: string
  onCanvasColor: (c: string) => void
  canvasPresets?: { name: string; value: string }[]
  themeMode: ThemeMode
  onThemeMode: (m: ThemeMode) => void
  zoom: number
  onZoom: (z: number) => void
  iterIdx: number
  onIterIdx: (i: number) => void
  pageIdx: number
  onPageIdx: (i: number) => void
  sidebarOpen: boolean
  onToggleSidebar: () => void
  styleOverrides?: Record<string, string>
}) {
  return (
    <div>
      <div style={{
        fontSize: T.label, fontWeight: 600, color: 'var(--txt-faint)',
        textTransform: 'uppercase', letterSpacing: '0.08em',
        marginBottom: S.sm, fontFamily: FONT,
      }}>
        {label}
      </div>
      <div style={{
        width: '100%', minHeight: 420,
        display: 'flex', flexDirection: 'column',
        fontFamily: FONT, overflow: 'hidden',
        position: 'relative',
        borderRadius: R.card,
        ...styleOverrides,
      } as React.CSSProperties}>
        <PreviewTopBar
          projectName="canvai-ui-system"
          iterations={iterations}
          activeIterationIndex={iterIdx}
          onSelectIteration={onIterIdx}
          pendingCount={label === 'Dark Mode' ? 1 : 0}
          mode="manual"
          sidebarOpen={sidebarOpen}
          onToggleSidebar={onToggleSidebar}
        />
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          <PreviewSidebar
            pages={pages}
            activePageIndex={pageIdx}
            onSelectPage={onPageIdx}
            collapsed={!sidebarOpen}
          />
          <div style={{ flex: 1, backgroundColor: 'var(--chrome)', padding: E.inset, position: 'relative' }}>
            <div style={{
              width: '100%', height: '100%',
              borderRadius: E.radius,
              cornerShape: 'squircle',
              backgroundColor: canvasColor,
              boxShadow: E.shadow,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 200ms ease',
            } as React.CSSProperties}>
              <CanvasContent />
            </div>
            {/* Controls — top-right: settings + canvas color */}
            <div style={{
              position: 'absolute',
              top: E.inset + S.md,
              right: E.inset + S.md,
              display: 'flex', gap: S.sm, alignItems: 'center',
            }}>
              <CanvasColorPicker
                activeColor={canvasColor}
                onSelect={onCanvasColor}
                presets={canvasPresets}
              />
              <InfoButton themeMode={themeMode} onThemeMode={onThemeMode} />
            </div>
            {/* Zoom — bottom-center of canvas */}
            <div style={{
              position: 'absolute',
              bottom: E.inset + S.md,
              left: '50%',
              transform: 'translateX(-50%)',
            }}>
              <ZoomControl
                zoom={zoom}
                onZoomIn={() => onZoom(Math.min(5, zoom * 1.2))}
                onZoomOut={() => onZoom(Math.max(0.1, zoom * 0.8))}
                onFitToView={() => onZoom(1)}
              />
            </div>
          </div>
        </div>
        <FAB />
      </div>
    </div>
  )
}

/* ─── Main Shell page ─── */
export function Shell() {
  // Dark shell state
  const [dIterIdx, setDIterIdx] = useState(0)
  const [dPageIdx, setDPageIdx] = useState(2)
  const [dSidebar, setDSidebar] = useState(true)
  const [dZoom, setDZoom] = useState(0.85)
  const [dCanvas, setDCanvas] = useState('oklch(0.180 0.005 80)')
  const [dTheme, setDTheme] = useState<ThemeMode>('dark')

  // Light shell state
  const [lIterIdx, setLIterIdx] = useState(2)
  const [lPageIdx, setLPageIdx] = useState(2)
  const [lSidebar, setLSidebar] = useState(true)
  const [lZoom, setLZoom] = useState(0.85)
  const [lCanvas, setLCanvas] = useState('oklch(0.972 0.001 197)')
  const [lTheme, setLTheme] = useState<ThemeMode>('light')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S.xxl }}>
      {/* Dark mode shell */}
      <ShellPreview
        label="Dark Mode"
        canvasColor={dCanvas}
        onCanvasColor={setDCanvas}
        themeMode={dTheme}
        onThemeMode={setDTheme}
        zoom={dZoom}
        onZoom={setDZoom}
        iterIdx={dIterIdx}
        onIterIdx={setDIterIdx}
        pageIdx={dPageIdx}
        onPageIdx={setDPageIdx}
        sidebarOpen={dSidebar}
        onToggleSidebar={() => setDSidebar(o => !o)}
      />

      {/* Light mode shell — same components, CSS variable overrides */}
      <ShellPreview
        label="Light Mode"
        canvasColor={lCanvas}
        onCanvasColor={setLCanvas}
        themeMode={lTheme}
        onThemeMode={setLTheme}
        zoom={lZoom}
        onZoom={setLZoom}
        iterIdx={lIterIdx}
        onIterIdx={setLIterIdx}
        pageIdx={lPageIdx}
        onPageIdx={setLPageIdx}
        sidebarOpen={lSidebar}
        onToggleSidebar={() => setLSidebar(o => !o)}
        canvasPresets={lightCanvasPresets}
        styleOverrides={lightOverrides}
      />
    </div>
  )
}
