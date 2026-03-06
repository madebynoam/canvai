import { useRef, useEffect, useState } from 'react'
import { Check, Palette } from 'lucide-react'
import { A, S, R, ICON, FONT, V } from './tokens'
import { useTheme } from './useTheme'

interface CanvasColorPreset {
  name: string
  value: string
}

// Light mode presets (Figma/Framer/Sketch inspired)
export const lightPresets: CanvasColorPreset[] = [
  { name: 'White', value: 'oklch(0.99 0 0)' },      // Clean/minimal
  { name: 'Figma', value: 'oklch(0.96 0 0)' },      // #F5F5F5
  { name: 'Warm', value: 'oklch(0.92 0 0)' },       // Softer gray
]

// Dark mode presets
export const darkPresets: CanvasColorPreset[] = [
  { name: 'Deep', value: 'oklch(0.12 0 0)' },       // Near black
  { name: 'Figma', value: 'oklch(0.20 0 0)' },      // #1E1E1E
  { name: 'Soft', value: 'oklch(0.28 0 0)' },       // Elevated dark
]

export const DEFAULT_CANVAS_COLOR = 'oklch(0.96 0 0)'

function ColorDot({ preset, isActive, isDarkTheme, onSelect }: {
  preset: CanvasColorPreset
  isActive: boolean
  isDarkTheme: boolean
  onSelect: () => void
}) {
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
          : `1px solid ${isDarkTheme ? 'rgba(255,255,255,0.12)' : V.border}`,
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
          color={isDarkTheme ? 'rgba(255,255,255,0.8)' : A.accent}
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
  const { resolved } = useTheme()
  const isDarkTheme = resolved === 'dark'
  const presets = isDarkTheme ? darkPresets : lightPresets

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
            boxShadow: isDarkTheme
              ? '0 4px 12px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2)'
              : '0 4px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)',
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
              isDarkTheme={isDarkTheme}
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
