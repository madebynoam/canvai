import { useRef, useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import type { ReactNode } from 'react'
import { useCanvas } from './Canvas'
import { Star, Check, X } from 'lucide-react'
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
  onResize?: (id: string, height: number) => void
  status?: FrameStatus
  onStatusChange?: (id: string, status: FrameStatus) => void
}

const STATUS_ICONS: Record<FrameStatus, { icon: typeof Star; fill: string; stroke: string }> = {
  none: { icon: Star, fill: 'none', stroke: '#999' },
  starred: { icon: Star, fill: '#F59E0B', stroke: '#F59E0B' },
  approved: { icon: Check, fill: 'none', stroke: '#10B981' },
  rejected: { icon: X, fill: 'none', stroke: '#EF4444' },
}

const STATUS_ORDER: FrameStatus[] = ['none', 'starred', 'approved', 'rejected']

function DropdownItem({ zoom, selected, onClick, icon: Icon, fill, stroke, label }: {
  zoom: number
  selected: boolean
  onClick: () => void
  icon: typeof Star
  fill: string
  stroke: string
  label: string
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6 / zoom,
        width: '100%',
        padding: `${4 / zoom}px ${8 / zoom}px`,
        background: hovered ? 'rgba(0,0,0,0.08)' : selected ? 'rgba(0,0,0,0.05)' : 'none',
        border: 'none',
        borderRadius: 4 / zoom,
        cursor: 'default',
        fontSize: 11 / zoom,
        color: '#333',
        transition: 'background 0.1s ease',
      }}
    >
      <Icon size={12 / zoom} fill={fill} stroke={stroke} strokeWidth={2} />
      <span style={{ textTransform: 'capitalize' }}>{label}</span>
    </button>
  )
}

export function Frame({ id, title, x, y, width, height, children, onMove, onResize, status = 'none', onStatusChange }: FrameProps) {
  const { zoom } = useCanvas()
  const frameRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const statusButtonRef = useRef<HTMLButtonElement>(null)
  const isDraggingRef = useRef(false)
  const dragStartRef = useRef({ x: 0, y: 0 })
  const frameStartRef = useRef({ x: 0, y: 0 })
  const onMoveRef = useRef(onMove)
  const zoomRef = useRef(zoom)
  const idRef = useRef(id)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 })

  onMoveRef.current = onMove
  zoomRef.current = zoom
  idRef.current = id
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

    function handleWindowMove(ev: PointerEvent) {
      if (!isDraggingRef.current) return
      const dx = (ev.clientX - dragStartRef.current.x) / zoomRef.current
      const dy = (ev.clientY - dragStartRef.current.y) / zoomRef.current
      onMoveRef.current?.(idRef.current, frameStartRef.current.x + dx, frameStartRef.current.y + dy)
    }

    function handleWindowUp() {
      isDraggingRef.current = false
      window.removeEventListener('pointermove', handleWindowMove)
      window.removeEventListener('pointerup', handleWindowUp)
    }

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

  // Close dropdown on outside click (with delay to avoid catching the opening click)
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

  const { icon: StatusIcon, fill, stroke } = STATUS_ICONS[status]
  const [statusHovered, setStatusHovered] = useState(false)
  const iconSize = 12 / zoom

  return (
    <div
      ref={frameRef}
      data-frame-id={id}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
      }}
    >
      <div
        data-frame-handle="true"
        onPointerDown={handlePointerDown}
        style={{
          fontSize: 12 / zoom,
          color: '#999',
          marginBottom: 8 / zoom,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 4 / zoom,
        }}
      >
        {onStatusChange && (
          <div style={{ position: 'relative', pointerEvents: 'auto' }}>
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
                borderRadius: 4,
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
                  background: 'white',
                  borderRadius: 6,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  padding: 4,
                  zIndex: 99999,
                  minWidth: 100,
                  pointerEvents: 'auto',
                }}
              >
                {STATUS_ORDER.map((s) => {
                  const { icon: Icon, fill: f, stroke: st } = STATUS_ICONS[s]
                  return (
                    <DropdownItem
                      key={s}
                      zoom={1}
                      selected={status === s}
                      onClick={() => handleStatusSelect(s)}
                      icon={Icon}
                      fill={f}
                      stroke={st}
                      label={s === 'none' ? 'Clear' : s}
                    />
                  )
                })}
              </div>,
              document.body
            )}
          </div>
        )}
        <span data-frame-handle="true">{title}</span>
      </div>
      <div ref={contentRef} data-frame-content="" style={{
        width,
        minHeight: height,
        overflow: 'visible',
      }}>
        {children}
      </div>
    </div>
  )
}
