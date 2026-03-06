import { useRef, useEffect, useState } from 'react'
import { Check, Palette } from 'lucide-react'
import { A, S, R, ICON, FONT, V } from './tokens'

interface CanvasColorPreset {
  name: string
  value: string
}

// True neutral grays — 9 evenly spaced from near-white to near-black
const presets: CanvasColorPreset[] = [
  { name: '98', value: 'oklch(0.98 0 0)' },
  { name: '92', value: 'oklch(0.92 0 0)' },
  { name: '85', value: 'oklch(0.85 0 0)' },
  { name: '75', value: 'oklch(0.75 0 0)' },
  { name: '60', value: 'oklch(0.60 0 0)' },
  { name: '45', value: 'oklch(0.45 0 0)' },
  { name: '30', value: 'oklch(0.30 0 0)' },
  { name: '20', value: 'oklch(0.20 0 0)' },
  { name: '12', value: 'oklch(0.12 0 0)' },
]

export const DEFAULT_CANVAS_COLOR = 'oklch(0.92 0 0)'

function ColorDot({ preset, isActive, onSelect }: {
  preset: CanvasColorPreset
  isActive: boolean
  onSelect: () => void
}) {
  // Parse lightness from name (it's the L value)
  const lightness = parseInt(preset.name, 10)
  const isDark = lightness <= 45

  return (
    <button
      onClick={onSelect}
      title={preset.name}
      style={{
        width: S.xl,
        height: S.xl,
        borderRadius: '50%',
        border: isActive
          ? `2px solid ${A.accent}`
          : `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : V.border}`,
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
          border: `1px solid ${V.border}`,
          background: V.chrome,
          cursor: 'default',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Palette size={ICON.md} strokeWidth={1.5} style={{ color: V.txtSec }} />
      </button>

      {open && (
        <div
          ref={popoverRef}
          style={{
            position: 'absolute',
            top: '50%',
            right: 36,
            transform: 'translateY(-50%)',
            transformOrigin: 'center right',
            background: V.chrome,
            border: `1px solid ${V.border}`,
            borderRadius: R.ui, cornerShape: 'squircle',
            padding: S.sm,
            fontFamily: FONT,
            boxShadow: '0 4px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'row',
            gap: S.sm,
          }}
        >
          {presets.map((preset) => (
            <ColorDot
              key={preset.name}
              preset={preset}
              isActive={activeColor === preset.value}
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
