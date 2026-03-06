import { useRef, useEffect, useState } from 'react'
import { SlidersHorizontal, ExternalLink, Sun, Moon, Monitor } from 'lucide-react'
import { S, T, ICON, FONT, V } from './tokens'
import { useMenu, MenuPanel, MenuRow } from './Menu'
import { resetTourCompleted } from './TourOverlay'
import { useTheme, type ThemeMode } from './useTheme'

const GITHUB_URL = 'https://github.com/madebynoam/bryllen'

export function InfoButton() {
  const { open, setOpen, containerRef, portalRef } = useMenu()
  const [triggerHover, setTriggerHover] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [rect, setRect] = useState<DOMRect | null>(null)
  const { mode, setMode } = useTheme()

  // Theme cycling: system → light → dark → system
  const cycleTheme = () => {
    const next: ThemeMode = mode === 'system' ? 'light' : mode === 'light' ? 'dark' : 'system'
    setMode(next)
  }

  const ThemeIcon = mode === 'dark' ? Moon : mode === 'light' ? Sun : Monitor
  const themeLabel = mode === 'system' ? 'System' : mode === 'light' ? 'Light' : 'Dark'

  // Measure trigger position on open
  useEffect(() => {
    if (open && triggerRef.current) {
      setRect(triggerRef.current.getBoundingClientRect())
    }
  }, [open])

  return (
    <div ref={containerRef} style={{ display: 'inline-flex' }}>
      <button
        ref={triggerRef}
        onClick={() => setOpen(o => !o)}
        onMouseEnter={() => setTriggerHover(true)}
        onMouseLeave={() => setTriggerHover(false)}
        title="Settings"
        style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          border: 'none',
          background: triggerHover ? V.active : V.card,
          cursor: 'default',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <SlidersHorizontal size={ICON.md} strokeWidth={1.5} style={{ color: V.txtSec }} />
      </button>
      {open && rect && (
        <MenuPanel
          portal={{ triggerRect: rect, position: 'above' }}
          portalRef={portalRef}
          width={160}
          zIndex={1000}
        >
          {/* Theme selector */}
          <MenuRow
            onClick={cycleTheme}
            style={{
              gap: S.sm,
              padding: `${S.xs}px ${S.sm}px`,
              fontSize: T.ui,
              color: V.txtSec,
            }}
          >
            <ThemeIcon size={ICON.sm} strokeWidth={1.5} style={{ color: V.txtSec }} />
            <span style={{ flex: 1 }}>Theme: {themeLabel}</span>
          </MenuRow>
          {/* Divider */}
          <div style={{ height: 1, background: V.border, margin: `${S.xs}px 0` }} />
          {/* Version — static, not interactive */}
          <div style={{
            padding: `${S.xs}px ${S.sm}px`,
            fontSize: T.ui, color: V.txtMuted,
            fontFamily: FONT,
            userSelect: 'none',
          }}>
            v{typeof __BRYLLEN_VERSION__ !== 'undefined' ? __BRYLLEN_VERSION__ : '0.0.0'}
          </div>
          <MenuRow
            onClick={() => {
              resetTourCompleted()
              window.location.reload()
            }}
            style={{
              padding: `${S.xs}px ${S.sm}px`,
              fontSize: T.ui,
              color: V.txtSec,
            }}
          >
            Relaunch tour
          </MenuRow>
          <MenuRow
            href={GITHUB_URL}
            style={{
              gap: S.sm,
              padding: `${S.xs}px ${S.sm}px`,
              fontSize: T.ui,
              color: V.txtSec,
            }}
          >
            <span style={{ flex: 1 }}>GitHub</span>
            <ExternalLink size={ICON.sm} strokeWidth={1.5} style={{ color: V.txtSec }} />
          </MenuRow>
        </MenuPanel>
      )}
    </div>
  )
}
