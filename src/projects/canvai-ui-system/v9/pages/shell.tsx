import { useState } from 'react'
import { SquareMousePointer } from 'lucide-react'
import { E, S, R, T, FONT } from '../tokens'
import { PreviewTopBar, PreviewSidebar, ZoomControl, CanvasColorPicker } from '../components'

const iterations = ['V1', 'V2', 'V3']

const pages = [
  { name: 'Tokens' },
  { name: 'Components' },
  { name: 'Shell' },
  { name: 'Team Settings' },
]

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

function FAB() {
  return (
    <div style={{
      position: 'absolute',
      bottom: S.lg + S.md,
      right: S.lg + S.md,
    }}>
      <div style={{
        width: 40, height: 40,
        borderRadius: '50%',
        backgroundColor: 'var(--accent)',
        color: 'oklch(0.08 0 0)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 1px 3px rgba(0,0,0,0.32), 0 0 0 0.5px rgba(0,0,0,0.16)',
      }}>
        <SquareMousePointer size={S.xl} strokeWidth={1.5} />
      </div>
    </div>
  )
}

export function Shell() {
  const [iterIdx, setIterIdx] = useState(0)
  const [pageIdx, setPageIdx] = useState(2)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [zoom, setZoom] = useState(0.85)
  const [canvasColor, setCanvasColor] = useState('oklch(0.100 0.003 80)')

  const [iterIdx2, setIterIdx2] = useState(0)
  const [pageIdx2, setPageIdx2] = useState(2)
  const [sidebarOpen2, setSidebarOpen2] = useState(true)
  const [zoom2, setZoom2] = useState(0.85)
  const [canvasColor2, setCanvasColor2] = useState('oklch(0.972 0.001 197)')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S.xxl }}>
      {/* Option A — Zoom + color at top-right */}
      <div>
        <div style={{
          fontSize: T.label, fontWeight: 600, color: 'var(--txt-faint)',
          textTransform: 'uppercase', letterSpacing: '0.08em',
          marginBottom: S.sm, fontFamily: FONT,
        }}>
          Option C — Controls Top-Right
        </div>
        <div style={{
          width: '100%', minHeight: 480,
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
                backgroundColor: canvasColor,
                boxShadow: E.shadow,
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 200ms ease',
              }}>
                <CanvasContent />
              </div>
              {/* Controls — top-right */}
              <div style={{
                position: 'absolute',
                top: E.inset + S.md,
                right: E.inset + S.md,
                display: 'flex',
                gap: S.sm,
                alignItems: 'center',
              }}>
                <CanvasColorPicker
                  activeColor={canvasColor}
                  onSelect={setCanvasColor}
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
          <FAB />
        </div>
      </div>

      {/* Option B — Zoom at bottom-center */}
      <div>
        <div style={{
          fontSize: T.label, fontWeight: 600, color: 'var(--txt-faint)',
          textTransform: 'uppercase', letterSpacing: '0.08em',
          marginBottom: S.sm, fontFamily: FONT,
        }}>
          Option B — Zoom Bottom-Center
        </div>
        <div style={{
          width: '100%', minHeight: 480,
          display: 'flex', flexDirection: 'column',
          fontFamily: FONT, overflow: 'hidden',
          position: 'relative',
          borderRadius: R.card,
        }}>
          <PreviewTopBar
            projectName="canvai-ui-system"
            iterations={iterations}
            activeIterationIndex={iterIdx2}
            onSelectIteration={setIterIdx2}
            pendingCount={0}
            mode="manual"
            sidebarOpen={sidebarOpen2}
            onToggleSidebar={() => setSidebarOpen2(o => !o)}
          />
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            <PreviewSidebar
              pages={pages}
              activePageIndex={pageIdx2}
              onSelectPage={setPageIdx2}
              collapsed={!sidebarOpen2}
            />
            <div style={{ flex: 1, backgroundColor: 'var(--chrome)', padding: E.inset, position: 'relative' }}>
              <div style={{
                width: '100%', height: '100%',
                borderRadius: E.radius,
                backgroundColor: canvasColor2,
                boxShadow: E.shadow,
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 200ms ease',
              }}>
                <CanvasContent />
              </div>
              {/* Canvas color — top-right (compact) */}
              <div style={{
                position: 'absolute',
                top: E.inset + S.md,
                right: E.inset + S.md,
              }}>
                <CanvasColorPicker
                  activeColor={canvasColor2}
                  onSelect={setCanvasColor2}
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
                  zoom={zoom2}
                  onZoomIn={() => setZoom2(z => Math.min(5, z * 1.2))}
                  onZoomOut={() => setZoom2(z => Math.max(0.1, z * 0.8))}
                  onFitToView={() => setZoom2(1)}
                />
              </div>
            </div>
          </div>
          <FAB />
        </div>
      </div>
    </div>
  )
}
