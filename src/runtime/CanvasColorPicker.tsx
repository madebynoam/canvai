import { useRef, useEffect, useState, useCallback } from 'react'
import { Check, Palette } from 'lucide-react'
import { N, A, S, R, ICON, FONT } from './tokens'

interface CanvasColorPreset {
  name: string
  value: string
}

const presets: CanvasColorPreset[] = [
  { name: 'Default', value: 'oklch(0.972 0.001 197)' },
  { name: 'Warm', value: 'oklch(0.965 0.008 80)' },
  { name: 'Neutral', value: 'oklch(0.940 0.000 0)' },
  { name: 'Dark', value: 'oklch(0.200 0.005 80)' },
  { name: 'Midnight', value: 'oklch(0.150 0.010 260)' },
]

// Minimal spring simulation — tension/friction → physical motion
function springAnimate(
  from: number,
  to: number,
  tension: number,
  friction: number,
  onUpdate: (v: number) => void,
  onDone: () => void,
) {
  let position = from
  let velocity = 0
  const dt = 1 / 120 // 120Hz fixed timestep
  let raf: number
  let lastTime = 0

  function tick(now: number) {
    if (!lastTime) { lastTime = now; raf = requestAnimationFrame(tick); return }
    let elapsed = (now - lastTime) / 1000
    lastTime = now
    // Clamp to avoid spiral of death
    if (elapsed > 0.064) elapsed = 0.064

    let acc = 0
    while (acc < elapsed) {
      const step = Math.min(dt, elapsed - acc)
      const springForce = -tension * (position - to)
      const dampingForce = -friction * velocity
      velocity += (springForce + dampingForce) * step
      position += velocity * step
      acc += step
    }

    onUpdate(position)

    if (Math.abs(position - to) < 0.001 && Math.abs(velocity) < 0.01) {
      onUpdate(to)
      onDone()
      return
    }
    raf = requestAnimationFrame(tick)
  }

  raf = requestAnimationFrame(tick)
  return () => cancelAnimationFrame(raf)
}

function ColorDot({ preset, isActive, onSelect, delay }: {
  preset: CanvasColorPreset
  isActive: boolean
  onSelect: () => void
  delay: number
}) {
  const isDark = preset.name === 'Dark' || preset.name === 'Midnight'
  const ref = useRef<HTMLButtonElement>(null)

  // Staggered spring entrance
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.opacity = '0'
    el.style.transform = 'scale(0.5)'
    const timeout = setTimeout(() => {
      const cancel = springAnimate(0, 1, 300, 20, (v) => {
        el.style.opacity = String(Math.min(1, v * 1.5))
        el.style.transform = `scale(${v})`
      }, () => {
        el.style.opacity = '1'
        el.style.transform = 'scale(1)'
      })
      return () => cancel?.()
    }, delay)
    return () => clearTimeout(timeout)
  }, [delay])

  // Press spring
  const handlePointerDown = useCallback(() => {
    const el = ref.current
    if (!el) return
    springAnimate(1, 0.8, 400, 22, (v) => {
      el.style.transform = `scale(${v})`
    }, () => {})
  }, [])

  const handlePointerUp = useCallback(() => {
    const el = ref.current
    if (!el) return
    springAnimate(0.8, 1, 300, 18, (v) => {
      el.style.transform = `scale(${v})`
    }, () => {})
  }, [])

  return (
    <button
      ref={ref}
      onClick={onSelect}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      title={preset.name}
      style={{
        width: S.xl,
        height: S.xl,
        borderRadius: '50%',
        border: isActive
          ? `2px solid ${A.accent}`
          : `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : N.border}`,
        background: preset.value,
        cursor: 'default',
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
      }}
    >
      {isActive && (
        <Check
          size={10}
          strokeWidth={2.5}
          color={isDark ? 'rgba(255,255,255,0.8)' : A.accent}
        />
      )}
    </button>
  )
}

interface CanvasColorPickerProps {
  activeColor: string
  onSelect: (color: string) => void
}

export function CanvasColorPicker({
  activeColor,
  onSelect,
}: CanvasColorPickerProps) {
  const [open, setOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  // Close on click outside
  useEffect(() => {
    if (!open) return
    function handlePointerDown(e: MouseEvent) {
      if (
        popoverRef.current && !popoverRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [open])

  // Spring the popover container in
  useEffect(() => {
    if (!open || !popoverRef.current) return
    const el = popoverRef.current
    el.style.opacity = '0'
    el.style.transform = 'translateY(-50%) scaleX(0.6) scaleY(0.8)'
    const cancel = springAnimate(0, 1, 233, 19, (v) => {
      el.style.opacity = String(Math.min(1, v * 2))
      el.style.transform = `translateY(-50%) scaleX(${0.6 + 0.4 * v}) scaleY(${0.8 + 0.2 * v})`
    }, () => {
      el.style.opacity = '1'
      el.style.transform = 'translateY(-50%)'
    })
    return () => cancel?.()
  }, [open])

  return (
    <div style={{ position: 'relative' }}>
      <button
        ref={triggerRef}
        onClick={() => setOpen(o => !o)}
        title="Canvas color"
        style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          border: `1px solid ${N.borderSoft}`,
          background: N.chrome,
          cursor: 'default',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Palette size={ICON.md} strokeWidth={1.5} color={N.txtSec} />
      </button>

      {open && (
        <div
          ref={popoverRef}
          style={{
            position: 'absolute',
            top: '50%',
            right: 36,
            transformOrigin: 'center right',
            background: N.chrome,
            border: `1px solid ${N.border}`,
            borderRadius: R.card,
            padding: S.sm,
            fontFamily: FONT,
            boxShadow: '0 4px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'row',
            gap: S.sm,
          }}
        >
          {presets.map((preset, i) => (
            <ColorDot
              key={preset.name}
              preset={preset}
              isActive={activeColor === preset.value}
              delay={i * 30}
              onSelect={() => {
                onSelect(preset.value)
                setOpen(false)
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
