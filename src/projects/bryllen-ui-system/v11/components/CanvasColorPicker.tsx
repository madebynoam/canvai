import { useRef, useEffect, useState } from 'react'
import { Check, Palette } from 'lucide-react'
import { S, R, ICON, FONT } from '../tokens'

export interface CanvasColorPreset {
  name: string
  value: string
}

const darkPresets: CanvasColorPreset[] = [
  { name: 'Seamless', value: 'oklch(0.130 0.005 80)' },
  { name: 'Subtle',   value: 'oklch(0.180 0.005 80)' },
  { name: 'Soft',     value: 'oklch(0.250 0.005 80)' },
  { name: 'Medium',   value: 'oklch(0.350 0.005 80)' },
  { name: 'Cool',     value: 'oklch(0.140 0.010 260)' },
]

function isDarkColor(value: string): boolean {
  const match = value.match(/oklch\(([0-9.]+)/)
  return match ? parseFloat(match[1]) < 0.5 : false
}

function ColorDot({ preset, isActive, onSelect }: {
  preset: CanvasColorPreset
  isActive: boolean
  onSelect: () => void
}) {
  const dark = isDarkColor(preset.value)

  return (
    <button
      onClick={onSelect}
      title={preset.name}
      style={{
        width: S.xl,
        height: S.xl,
        borderRadius: '50%',
        border: isActive
          ? `2px solid var(--accent)`
          : `1px solid ${dark ? 'rgba(255,255,255,0.12)' : 'var(--border)'}`,
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
          color={dark ? 'rgba(255,255,255,0.8)' : 'var(--accent)'}
        />
      )}
    </button>
  )
}

interface CanvasColorPickerProps {
  activeColor?: string
  onSelect?: (color: string) => void
  presets?: CanvasColorPreset[]
}

export function CanvasColorPicker({
  activeColor,
  onSelect,
  presets = darkPresets,
}: CanvasColorPickerProps) {
  const effectiveActive = activeColor ?? presets[0].value
  const [open, setOpen] = useState(false)
  const [triggerHover, setTriggerHover] = useState(false)
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

  return (
    <div style={{ position: 'relative' }}>
      {/* Trigger — simple round icon button */}
      <button
        ref={triggerRef}
        onClick={() => setOpen(o => !o)}
        onMouseEnter={() => setTriggerHover(true)}
        onMouseLeave={() => setTriggerHover(false)}
        title="Canvas color"
        style={{
          width: 24,
          height: 24,
          borderRadius: '50%',
          border: `1px solid ${triggerHover ? 'var(--border)' : 'var(--border-soft)'}`,
          background: triggerHover ? 'var(--chrome-sub)' : 'var(--chrome)',
          cursor: 'default',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'border-color 120ms ease, background-color 120ms ease',
        }}
      >
        <Palette size={ICON.sm} strokeWidth={1.5} color="var(--txt-sec)" />
      </button>

      {/* Popover — dots only */}
      {open && (
        <div
          ref={popoverRef}
          style={{
            position: 'absolute',
            top: 28,
            right: 0,
            background: 'var(--chrome)',
            border: `1px solid var(--border)`,
            borderRadius: R.card,
            padding: S.sm,
            fontFamily: FONT,
            boxShadow: '0 4px 12px rgba(0,0,0,0.24), 0 1px 3px rgba(0,0,0,0.12)',
            zIndex: 10,
            display: 'flex',
            gap: S.sm,
          }}
        >
          {presets.map((preset) => (
            <ColorDot
              key={preset.name}
              preset={preset}
              isActive={effectiveActive === preset.value}
              onSelect={() => {
                onSelect?.(preset.value)
                setOpen(false)
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
