import { useState } from 'react'
import { SquareMousePointer } from 'lucide-react'
import { E, S, R, T, FONT } from '../tokens'
import { PreviewTopBar, PreviewSidebar, ZoomControl, CanvasColorPicker } from '../components'

const iterations = ['V8', 'V9', 'V10']

const pages = [
  { name: 'Tokens' },
  { name: 'Components' },
  { name: 'Shell' },
  { name: 'GitHub Comments Flow' },
  { name: 'Annotation Panel' },
]

/* ─── Sample canvas content — mimics real frames on canvas ─── */
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
          <div style={{ fontSize: T.body, color: 'var(--txt-sec)', textWrap: 'pretty' }}>Frame {i}</div>
        </div>
      ))}
    </div>
  )
}

/* ─── FAB — annotation button ─── */
function FAB() {
  return (
    <div style={{ position: 'absolute', bottom: S.lg + S.md, right: S.lg + S.md }}>
      <div style={{
        width: 40, height: 40, borderRadius: '50%',
        backgroundColor: 'var(--accent)',
        color: 'var(--text-on-accent)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 1px 3px rgba(0,0,0,0.12), 0 0 0 0.5px rgba(0,0,0,0.06)',
      }}>
        <SquareMousePointer size={S.xl} strokeWidth={1.5} />
      </div>
    </div>
  )
}

/* ─── Main Shell page — mirrors the real live app ─── */
export function Shell() {
  const [iterIdx, setIterIdx] = useState(2)
  const [pageIdx, setPageIdx] = useState(2)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [zoom, setZoom] = useState(0.85)
  const [canvasColor, setCanvasColor] = useState('oklch(0.972 0.001 197)')

  return (
    <div style={{
      width: '100%', minHeight: 520,
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
        pendingCount={0}
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
        <div style={{ flex: 1, backgroundColor: 'var(--chrome)', padding: `${E.insetTop}px ${E.inset}px ${E.inset}px`, position: 'relative' }}>
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
          } as React.CSSProperties}>
            <CanvasContent />
          </div>
          {/* Canvas color picker — top-right */}
          <div style={{
            position: 'absolute',
            top: E.insetTop + S.md,
            right: E.inset + S.md,
          }}>
            <CanvasColorPicker
              activeColor={canvasColor}
              onSelect={setCanvasColor}
            />
          </div>
          {/* Zoom — bottom-center */}
          <div style={{
            position: 'absolute',
            bottom: E.inset + S.md,
            left: '50%',
            transform: 'translateX(-50%)',
          }}>
            <ZoomControl
              zoom={zoom}
              onZoomIn={() => setZoom(Math.min(5, zoom * 1.2))}
              onZoomOut={() => setZoom(Math.max(0.1, zoom * 0.8))}
              onFitToView={() => setZoom(1)}
            />
          </div>
        </div>
      </div>
      <FAB />
    </div>
  )
}
