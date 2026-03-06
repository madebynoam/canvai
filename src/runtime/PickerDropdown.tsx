import { useState, type ReactNode } from 'react'
import { ChevronsUpDown, Check } from 'lucide-react'
import { A, S, R, ICON, FONT, V } from './tokens'
import { useMenu, MenuPanel, MenuRow } from './Menu'

interface PickerDropdownProps<T> {
  items: T[]
  activeIndex: number
  onSelect: (index: number) => void
  renderTriggerLabel: (item: T) => ReactNode
  renderRow: (item: T, index: number, isActive: boolean) => ReactNode
  triggerPrefix?: ReactNode
  width?: number
  forceOpen?: boolean
  footer?: ReactNode
}

export function PickerDropdown<T>({
  items,
  activeIndex,
  onSelect,
  renderTriggerLabel,
  renderRow,
  triggerPrefix,
  width = 220,
  forceOpen = false,
  footer,
}: PickerDropdownProps<T>) {
  const { open, setOpen, containerRef } = useMenu({ forceOpen })
  const [triggerHovered, setTriggerHovered] = useState(false)

  const active = items[activeIndex]
  if (!active) return null

  return (
    <div ref={containerRef} style={{ position: 'relative', fontFamily: FONT }}>
      {/* Trigger */}
      <button
        onClick={() => !forceOpen && setOpen(o => !o)}
        onMouseEnter={() => setTriggerHovered(true)}
        onMouseLeave={() => setTriggerHovered(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: S.xs,
          padding: `${S.xs}px ${S.sm}px`,
          background: triggerHovered ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
          border: 'none',
          borderRadius: R.ui, cornerShape: 'squircle',
          fontFamily: FONT,
        }}
      >
        {triggerPrefix}
        {renderTriggerLabel(active)}
        <ChevronsUpDown size={ICON.sm} strokeWidth={1.5} style={{ color: V.txtSec, flexShrink: 0 }} />
      </button>

      {/* Dropdown — instant show/hide per Emil Kowalski's principles */}
      {open && (
        <MenuPanel width={width}>
          {items.map((item, i) => {
            const isActive = i === activeIndex
            return (
              <MenuRow
                key={i}
                active={isActive}
                onClick={() => {
                  onSelect(i)
                  if (!forceOpen) setOpen(false)
                }}
                style={{
                  gap: S.sm,
                  padding: `${S.sm}px ${S.sm}px`,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  {renderRow(item, i, isActive)}
                </div>
                {isActive && (
                  <Check size={ICON.md} strokeWidth={1.5} color={A.accent} style={{ flexShrink: 0 }} />
                )}
              </MenuRow>
            )
          })}
          {footer && (
            <div style={{ borderTop: `1px solid ${V.border}`, marginTop: S.xs, paddingTop: S.xs }}>
              {footer}
            </div>
          )}
        </MenuPanel>
      )}
    </div>
  )
}
