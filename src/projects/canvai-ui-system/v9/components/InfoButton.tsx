import { useRef, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Info, ExternalLink } from 'lucide-react'
import { N, S, R, T, ICON, FONT } from '../tokens'

const VERSION = '0.0.26'
const GITHUB_URL = 'https://github.com/madebynoam/canvai'

function MenuRow({ children, href }: {
  children: React.ReactNode
  href?: string
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: S.sm,
        width: '100%', boxSizing: 'border-box',
        border: 'none',
        padding: `${S.xs}px ${S.sm}px`,
        borderRadius: R.control,
        backgroundColor: hovered ? 'rgba(255,255,255,0.06)' : 'transparent',
        fontFamily: FONT, textAlign: 'left',
        fontSize: T.body, color: N.txtSec,
        cursor: 'default',
        textDecoration: 'none',
      }}
    >
      {children}
    </a>
  )
}

export function InfoButton() {
  const [open, setOpen] = useState(false)
  const [triggerHover, setTriggerHover] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const animRef = useRef<number>(0)
  const springState = useRef({ value: 0, velocity: 0 })
  const [rect, setRect] = useState<DOMRect | null>(null)

  // Measure trigger position on open
  useEffect(() => {
    if (open && triggerRef.current) {
      setRect(triggerRef.current.getBoundingClientRect())
    }
  }, [open])

  // Spring animation — same as ProjectPicker (tension 233, friction 21)
  useEffect(() => {
    const target = open ? 1 : 0
    cancelAnimationFrame(animRef.current)

    const tension = 233
    const friction = 21
    const DT = 1 / 120
    let accum = 0
    let prev = performance.now()

    function step(now: number) {
      accum += Math.min((now - prev) / 1000, 0.064)
      prev = now
      const s = springState.current
      while (accum >= DT) {
        const spring = -tension * (s.value - target)
        const damp = -friction * s.velocity
        s.velocity += (spring + damp) * DT
        s.value += s.velocity * DT
        accum -= DT
      }
      if (menuRef.current) {
        const v = Math.max(0, Math.min(1, s.value))
        const scale = 0.92 + 0.08 * v
        const ty = (1 - v) * S.xs
        menuRef.current.style.transform = `scale(${scale}) translateY(${ty}px)`
        menuRef.current.style.opacity = `${v}`
      }
      if (Math.abs(s.value - target) > 0.001 || Math.abs(s.velocity) > 0.001) {
        animRef.current = requestAnimationFrame(step)
      } else {
        s.value = target
        s.velocity = 0
        if (menuRef.current) {
          const scale = 0.92 + 0.08 * target
          menuRef.current.style.transform = `scale(${scale}) translateY(${target === 1 ? 0 : S.xs}px)`
          menuRef.current.style.opacity = `${target}`
        }
      }
    }
    animRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animRef.current)
  }, [open])

  // Click-outside + Escape
  useEffect(() => {
    if (!open) return
    function handlePointerDown(e: MouseEvent) {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const menu = (
    <div
      ref={menuRef}
      style={{
        position: 'fixed',
        left: rect ? rect.left : -9999,
        bottom: rect ? window.innerHeight - rect.top + S.xs : -9999,
        minWidth: 160,
        background: N.card,
        border: `1px solid ${N.border}`,
        borderRadius: R.card,
        padding: S.xs,
        fontFamily: FONT,
        boxShadow: '0 4px 12px rgba(0,0,0,0.24), 0 1px 3px rgba(0,0,0,0.12)',
        zIndex: 1000,
        transformOrigin: 'bottom left',
        opacity: 0,
        pointerEvents: open ? 'auto' : 'none',
      }}
    >
      {/* Version — static, not interactive */}
      <div style={{
        padding: `${S.xs}px ${S.sm}px`,
        fontSize: T.caption, color: N.txtTer,
        fontFamily: FONT,
        userSelect: 'none',
      }}>
        v{VERSION}
      </div>
      <MenuRow href={GITHUB_URL}>
        <span style={{ flex: 1 }}>GitHub</span>
        <ExternalLink size={ICON.sm} strokeWidth={1.5} color={N.txtTer} />
      </MenuRow>
    </div>
  )

  return (
    <>
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
          background: triggerHover ? 'rgba(255,255,255,0.08)' : N.chromeSub,
          cursor: 'default',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background-color 120ms ease',
        }}
      >
        <Info size={ICON.md} strokeWidth={1.5} color={N.txtTer} />
      </button>
      {createPortal(menu, document.body)}
    </>
  )
}
