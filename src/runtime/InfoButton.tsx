import { useRef, useEffect, useState } from 'react'
import { Info, ExternalLink } from 'lucide-react'
import { N, S, T, ICON, FONT } from './tokens'
import { useMenu, MenuPanel, MenuRow } from './Menu'

const GITHUB_URL = 'https://github.com/madebynoam/canvai'

export function InfoButton() {
  const { open, setOpen, containerRef, portalRef } = useMenu()
  const [triggerHover, setTriggerHover] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [rect, setRect] = useState<DOMRect | null>(null)

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
        title="About canvai"
        style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          border: 'none',
          background: triggerHover ? 'rgba(0,0,0,0.06)' : N.chromeSub,
          cursor: 'default',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Info size={ICON.md} strokeWidth={1.5} color={N.txtTer} />
      </button>
      {open && rect && (
        <MenuPanel
          portal={{ triggerRect: rect, position: 'above' }}
          portalRef={portalRef}
          width={160}
          zIndex={1000}
        >
          {/* Version — static, not interactive */}
          <div style={{
            padding: `${S.xs}px ${S.sm}px`,
            fontSize: T.caption, color: N.txtTer,
            fontFamily: FONT,
            userSelect: 'none',
          }}>
            v{typeof __CANVAI_VERSION__ !== 'undefined' ? __CANVAI_VERSION__ : '0.0.0'}
          </div>
          <MenuRow
            href={GITHUB_URL}
            style={{
              gap: S.sm,
              padding: `${S.xs}px ${S.sm}px`,
              fontSize: T.body,
              color: N.txtSec,
            }}
          >
            <span style={{ flex: 1 }}>GitHub</span>
            <ExternalLink size={ICON.sm} strokeWidth={1.5} color={N.txtTer} />
          </MenuRow>
        </MenuPanel>
      )}
    </div>
  )
}
