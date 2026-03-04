import { useRef, useEffect, useState } from 'react'
import { Check, Palette } from 'lucide-react'
import { N, A, S, R, ICON, FONT } from './tokens'

interface CanvasColorPreset {
  name: string
  value: string
}

// Cool grays from light to dark (subtle blue hue for a modern feel)
const presets: CanvasColorPreset[] = [
  { name: 'White', value: 'oklch(0.985 0.003 250)' },
  { name: 'Light', value: 'oklch(0.94 0.006 250)' },
  { name: 'Soft', value: 'oklch(0.86 0.008 250)' },
  { name: 'Neutral', value: 'oklch(0.75 0.008 250)' },  // Default (middle)
  { name: 'Muted', value: 'oklch(0.55 0.010 250)' },
  { name: 'Dim', value: 'oklch(0.35 0.010 250)' },
  { name: 'Dark', value: 'oklch(0.18 0.008 250)' },
]

export const DEFAULT_CANVAS_COLOR = 'oklch(0.75 0.008 250)'

function ColorDot({ preset, isActive, onSelect }: {
  preset: CanvasColorPreset
  isActive: boolean
  onSelect: () => void
}) {
  const isDark = preset.name === 'Dark' || preset.name === 'Dim' || preset.name === 'Muted'

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
          border: `1px solid ${N.border}`,
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
            transform: 'translateY(-50%)',
            transformOrigin: 'center right',
            background: N.chrome,
            border: `1px solid ${N.border}`,
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
