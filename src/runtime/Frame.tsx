import { useRef, useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import type { ReactNode } from 'react'
import { useCanvas } from './Canvas'
import { Star, Check, X, MoreHorizontal, ExternalLink, Copy, Trash2 } from 'lucide-react'
import { T, R, V, FONT } from './tokens'
import type { FrameStatus } from './types'

interface FrameProps {
  id: string
  title: string
  x: number
  y: number
  width: number
  height: number
  children: ReactNode
  onMove?: (id: string, x: number, y: number) => void
  onDuplicate?: (id: string, origX: number, origY: number) => string | undefined
  onResize?: (id: string, height: number) => void
  status?: FrameStatus
  onStatusChange?: (id: string, status: FrameStatus) => void
  selected?: boolean
  onSelect?: (id: string, shiftKey: boolean) => void
  onDelete?: (id: string) => void
  onDuplicateClick?: (id: string) => void
  onOpenInNewTab?: (id: string) => void
}

const STATUS_ICONS: Record<FrameStatus, { icon: typeof Star; fill: string; stroke: string }> = {
  none: { icon: Star, fill: 'none', stroke: '#999' },
  starred: { icon: Star, fill: '#F59E0B', stroke: '#F59E0B' },
  approved: { icon: Check, fill: 'none', stroke: '#10B981' },
  rejected: { icon: X, fill: 'none', stroke: '#EF4444' },
}

const STATUS_ORDER: FrameStatus[] = ['none', 'starred', 'approved', 'rejected']

function DropdownItem({ selected = false, onClick, icon: Icon, fill, stroke, label, destructive = false }: {
  selected?: boolean
  onClick: () => void
  icon: typeof Star
  fill: string
  stroke: string
  label: string
  destructive?: boolean
}) {
  const [hovered, setHovered] = useState(false)
  const color = destructive ? 'oklch(55% 0.2 25)' : V.txtPri
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        width: '100%',
        padding: '6px 10px',
        background: hovered ? V.active : selected ? 'rgba(0,0,0,0.05)' : 'none',
        border: 'none',
        borderRadius: R.ui, cornerShape: 'squircle',
        cursor: 'default',
        fontSize: T.ui,
        fontFamily: FONT,
        color,
        transition: 'background 0.1s ease',
      } as React.CSSProperties}
    >
      <Icon size={14} fill={fill} stroke={destructive ? 'oklch(55% 0.2 25)' : stroke} strokeWidth={2} />
      {label && <span style={{ textTransform: 'capitalize' }}>{label}</span>}
    </button>
  )
}

function MenuSeparator() {
  return <div style={{ height: 1, background: V.border, margin: '4px 0' }} />
}

export function Frame({ id, title, x, y, width, height, children, onMove, onDuplicate, onResize, status = 'none', onStatusChange, selected = false, onSelect, onDelete, onDuplicateClick, onOpenInNewTab }: FrameProps) {
  const { zoom } = useCanvas()
  const frameRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const statusButtonRef = useRef<HTMLButtonElement>(null)
  const moreButtonRef = useRef<HTMLButtonElement>(null)
  const isDraggingRef = useRef(false)
  const dragStartRef = useRef({ x: 0, y: 0 })
  const frameStartRef = useRef({ x: 0, y: 0 })
  const dragDistanceRef = useRef(0)
  const onMoveRef = useRef(onMove)
  const onDuplicateRef = useRef(onDuplicate)
  const zoomRef = useRef(zoom)
  const idRef = useRef(id)
  const onSelectRef = useRef(onSelect)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 })
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false)
  const [moreDropdownPos, setMoreDropdownPos] = useState({ top: 0, left: 0 })

  onMoveRef.current = onMove
  onDuplicateRef.current = onDuplicate
  zoomRef.current = zoom
  idRef.current = id
  onSelectRef.current = onSelect
  const onResizeRef = useRef(onResize)
  onResizeRef.current = onResize

  // ResizeObserver on content div only (not title bar which has zoom-dependent font size)
  useEffect(() => {
    const el = contentRef.current
    if (!el) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const h = entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height
        onResizeRef.current?.(idRef.current, h)
        window.dispatchEvent(new CustomEvent('bryllen:frame-resize', {
          detail: { id: idRef.current, height: h },
        }))
      }
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    const target = e.target as HTMLElement
    if (!target.dataset.frameHandle) return

    e.stopPropagation()
    e.preventDefault()
    isDraggingRef.current = true
    dragStartRef.current = { x: e.clientX, y: e.clientY }
    frameStartRef.current = { x, y }
    dragDistanceRef.current = 0
    const shiftKeyAtStart = e.shiftKey
    const altKeyAtStart = e.altKey

    let currentX = x
    let currentY = y
    let duplicateSpawned = false

    function handleWindowMove(ev: PointerEvent) {
      if (!isDraggingRef.current) return
      const dx = (ev.clientX - dragStartRef.current.x) / zoomRef.current
      const dy = (ev.clientY - dragStartRef.current.y) / zoomRef.current
      dragDistanceRef.current = Math.sqrt(dx * dx + dy * dy)
      currentX = frameStartRef.current.x + dx
      currentY = frameStartRef.current.y + dy
      // Option+drag: once threshold crossed, stamp a copy at the origin so it
      // stays behind — then continue dragging the current frame (it becomes the dupe)
      if (altKeyAtStart && !duplicateSpawned && dragDistanceRef.current >= 5) {
        duplicateSpawned = true
        const newId = onDuplicateRef.current?.(idRef.current, frameStartRef.current.x, frameStartRef.current.y)
        if (newId) idRef.current = newId
      }
      onMoveRef.current?.(idRef.current, currentX, currentY)
    }

    function handleWindowUp() {
      const wasDrag = dragDistanceRef.current >= 5
      isDraggingRef.current = false
      window.removeEventListener('pointermove', handleWindowMove)
      window.removeEventListener('pointerup', handleWindowUp)
      if (altKeyAtStart) document.body.style.cursor = ''

      if (!wasDrag && onSelectRef.current) {
        onSelectRef.current(idRef.current, shiftKeyAtStart)
      }
    }

    if (altKeyAtStart) document.body.style.cursor = 'copy'
    window.addEventListener('pointermove', handleWindowMove)
    window.addEventListener('pointerup', handleWindowUp)
  }, [x, y])

  const handleStatusClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (!dropdownOpen && statusButtonRef.current) {
      const rect = statusButtonRef.current.getBoundingClientRect()
      setDropdownPos({ top: rect.bottom + 4, left: rect.left })
    }
    setDropdownOpen(o => !o)
  }

  const handleStatusSelect = (newStatus: FrameStatus) => {
    onStatusChange?.(id, newStatus)
    setDropdownOpen(false)
  }

  // Close status dropdown on outside click (with delay to avoid catching the opening click)
  useEffect(() => {
    if (!dropdownOpen) return
    const handleClick = () => setDropdownOpen(false)
    // Delay adding listener to next tick so opening click doesn't trigger close
    const timer = setTimeout(() => {
      window.addEventListener('click', handleClick)
    }, 0)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('click', handleClick)
    }
  }, [dropdownOpen])

  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (!moreDropdownOpen && moreButtonRef.current) {
      const rect = moreButtonRef.current.getBoundingClientRect()
      setMoreDropdownPos({ top: rect.bottom + 4, left: rect.left })
    }
    setMoreDropdownOpen(o => !o)
  }

  // Close more dropdown on outside click
  useEffect(() => {
    if (!moreDropdownOpen) return
    const handleClick = () => setMoreDropdownOpen(false)
    const timer = setTimeout(() => {
      window.addEventListener('click', handleClick)
    }, 0)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('click', handleClick)
    }
  }, [moreDropdownOpen])

  const { icon: StatusIcon, fill, stroke } = STATUS_ICONS[status]
  const [statusHovered, setStatusHovered] = useState(false)
  const [moreHovered, setMoreHovered] = useState(false)
  const iconSize = 12 / zoom

  // Selection ring style
  const selectionRingStyle = selected ? {
    boxShadow: '0 0 0 2px oklch(65% 0.2 250)',
    borderRadius: R.ui, cornerShape: 'squircle',
  } as React.CSSProperties : {}

  return (
    <div
      ref={frameRef}
      data-frame-id={id}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        ...selectionRingStyle,
      }}
    >
      <div
        data-frame-handle="true"
        onPointerDown={handlePointerDown}
        style={{
          fontSize: 12 / zoom,
          color: '#999',
          marginBottom: 8 / zoom,
          userSelect: 'none',
          WebkitUserSelect: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 4 / zoom,
        }}
      >
        {onStatusChange && (
          <div style={{ position: 'relative', pointerEvents: 'auto', flexShrink: 0 }}>
            <button
              ref={statusButtonRef}
              onClick={handleStatusClick}
              onPointerDown={e => e.stopPropagation()}
              onMouseEnter={() => setStatusHovered(true)}
              onMouseLeave={() => setStatusHovered(false)}
              style={{
                background: statusHovered ? 'rgba(0,0,0,0.08)' : 'none',
                border: 'none',
                padding: 4,
                margin: -4,
                borderRadius: R.ui, cornerShape: 'squircle',
                cursor: 'default',
                display: 'flex',
                alignItems: 'center',
                transition: 'background 0.15s ease',
              }}
            >
              <StatusIcon
                size={iconSize}
                fill={fill}
                stroke={stroke}
                strokeWidth={2}
              />
            </button>
            {dropdownOpen && createPortal(
              <div
                onClick={e => e.stopPropagation()}
                onPointerDown={e => e.stopPropagation()}
                style={{
                  position: 'fixed',
                  top: dropdownPos.top,
                  left: dropdownPos.left,
                  background: V.card,
                  border: `1px solid ${V.border}`,
                  borderRadius: R.ui, cornerShape: 'squircle',
                  boxShadow: V.shadow,
                  padding: 4,
                  zIndex: 99999,
                  minWidth: 120,
                  pointerEvents: 'auto',
                } as React.CSSProperties}
              >
                {STATUS_ORDER.map((s) => {
                  const { icon: Icon, fill: f, stroke: st } = STATUS_ICONS[s]
                  return (
                    <DropdownItem
                      key={s}
                      selected={status === s}
                      onClick={() => handleStatusSelect(s)}
                      icon={Icon}
                      fill={f}
                      stroke={st}
                      label={s === 'none' ? '' : s}
                    />
                  )
                })}
              </div>,
              document.body
            )}
          </div>
        )}
        <span
          data-frame-handle="true"
          style={{
            flex: 1,
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >{title}</span>
        {(onOpenInNewTab || onDuplicateClick || onDelete) && (
          <div style={{ position: 'relative', pointerEvents: 'auto', flexShrink: 0 }}>
            <button
              ref={moreButtonRef}
              onClick={handleMoreClick}
              onPointerDown={e => e.stopPropagation()}
              onMouseEnter={() => setMoreHovered(true)}
              onMouseLeave={() => setMoreHovered(false)}
              style={{
                background: moreHovered ? 'rgba(0,0,0,0.08)' : 'none',
                border: 'none',
                padding: 4,
                margin: -4,
                borderRadius: R.ui, cornerShape: 'squircle',
                cursor: 'default',
                display: 'flex',
                alignItems: 'center',
                transition: 'background 0.15s ease',
              }}
            >
              <MoreHorizontal size={iconSize} stroke="#999" strokeWidth={2} />
            </button>
            {moreDropdownOpen && createPortal(
              <div
                onClick={e => e.stopPropagation()}
                onPointerDown={e => e.stopPropagation()}
                style={{
                  position: 'fixed',
                  top: moreDropdownPos.top,
                  left: moreDropdownPos.left,
                  background: V.card,
                  border: `1px solid ${V.border}`,
                  borderRadius: R.ui, cornerShape: 'squircle',
                  boxShadow: V.shadow,
                  padding: 4,
                  zIndex: 99999,
                  minWidth: 160,
                  pointerEvents: 'auto',
                } as React.CSSProperties}
              >
                {onOpenInNewTab && (
                  <DropdownItem
                    onClick={() => { onOpenInNewTab(id); setMoreDropdownOpen(false) }}
                    icon={ExternalLink}
                    fill="none"
                    stroke="#999"
                    label="Open in new tab"
                  />
                )}
                {onDuplicateClick && (
                  <DropdownItem
                    onClick={() => { onDuplicateClick(id); setMoreDropdownOpen(false) }}
                    icon={Copy}
                    fill="none"
                    stroke="#999"
                    label="Duplicate"
                  />
                )}
                {onDelete && (
                  <>
                    <MenuSeparator />
                    <DropdownItem
                      onClick={() => { onDelete(id); setMoreDropdownOpen(false) }}
                      icon={Trash2}
                      fill="none"
                      stroke="#999"
                      label="Delete"
                      destructive
                    />
                  </>
                )}
              </div>,
              document.body
            )}
          </div>
        )}
      </div>
      <div ref={contentRef} data-frame-content="" style={{
        width,
        height,
        overflow: 'hidden',
      }}>
        {children}
      </div>
    </div>
  )
}
