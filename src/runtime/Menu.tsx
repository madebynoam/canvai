import { useState, useRef, useEffect, type CSSProperties, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { N, A, S, R, T, ICON, FONT } from './tokens'

/* ─── useMenu hook ───────────────────────────────────── */

interface UseMenuOptions {
  /** When true, menu stays open — click-outside/escape listeners are skipped */
  forceOpen?: boolean
}

export function useMenu(options?: UseMenuOptions) {
  const forceOpen = options?.forceOpen ?? false
  const [open, setOpen] = useState(forceOpen)
  const containerRef = useRef<HTMLDivElement>(null)
  const portalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open || forceOpen) return

    function handlePointerDown(e: MouseEvent) {
      const target = e.target as Node
      if (containerRef.current?.contains(target)) return
      if (portalRef.current?.contains(target)) return
      setOpen(false)
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
  }, [open, forceOpen])

  return { open, setOpen, containerRef, portalRef }
}

/* ─── MenuPanel ──────────────────────────────────────── */

interface PortalConfig {
  triggerRect: DOMRect
  position: 'below' | 'above'
}

interface MenuPanelProps {
  children: ReactNode
  width?: number | string
  align?: 'left' | 'right'
  zIndex?: number
  style?: CSSProperties
  /** Renders via createPortal with fixed positioning */
  portal?: PortalConfig
  /** Ref forwarded from useMenu for portal click-outside */
  portalRef?: React.RefObject<HTMLDivElement | null>
  /** Renders a full-screen invisible div behind the menu */
  backdrop?: boolean
  /** Called when the backdrop is clicked */
  onBackdropClick?: () => void
}

const PANEL_SHADOW = `0 ${S.xs}px ${S.lg}px rgba(0, 0, 0, 0.08), 0 1px ${S.xs}px rgba(0, 0, 0, 0.04)`

export function MenuPanel({
  children,
  width,
  align = 'left',
  zIndex = 100,
  style,
  portal,
  portalRef,
  backdrop,
  onBackdropClick,
}: MenuPanelProps) {
  const panelStyle: CSSProperties = {
    background: N.card,
    borderRadius: R.card,
    border: `1px solid ${N.border}`,
    boxShadow: PANEL_SHADOW,
    padding: S.xs,
    fontFamily: FONT,
    ...style,
  }

  // Portal mode — fixed positioning relative to trigger
  if (portal) {
    const { triggerRect, position } = portal
    const fixedStyle: CSSProperties = {
      ...panelStyle,
      position: 'fixed',
      left: align === 'right' ? undefined : triggerRect.left,
      right: align === 'right' ? window.innerWidth - triggerRect.right : undefined,
      zIndex,
      width,
    }
    if (position === 'above') {
      fixedStyle.bottom = window.innerHeight - triggerRect.top + S.xs
    } else {
      fixedStyle.top = triggerRect.bottom + S.xs
    }

    return createPortal(
      <div ref={portalRef} style={fixedStyle}>
        {children}
      </div>,
      document.body,
    )
  }

  // Inline mode — absolute positioning
  const inlineStyle: CSSProperties = {
    ...panelStyle,
    position: 'absolute',
    top: '100%',
    marginTop: S.xs,
    zIndex,
    width,
    ...(align === 'right' ? { right: 0 } : { left: 0 }),
  }

  return (
    <>
      {backdrop && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: zIndex - 1 }}
          onClick={onBackdropClick}
        />
      )}
      <div style={inlineStyle}>
        {children}
      </div>
    </>
  )
}

/* ─── MenuRow ────────────────────────────────────────── */

interface MenuRowProps {
  children: ReactNode
  onClick?: () => void
  active?: boolean
  icon?: ReactNode
  href?: string
  destructive?: boolean
  accent?: boolean
  separator?: boolean
  style?: CSSProperties
}

export function MenuRow({
  children,
  onClick,
  active,
  icon,
  href,
  destructive,
  accent,
  separator,
  style,
}: MenuRowProps) {
  const [hovered, setHovered] = useState(false)

  const bg = active
    ? 'rgba(0, 0, 0, 0.06)'
    : destructive && hovered
      ? 'oklch(0.96 0.04 28)'
      : hovered
        ? 'rgba(0, 0, 0, 0.03)'
        : 'transparent'

  const color = destructive
    ? (hovered ? 'oklch(0.52 0.20 28)' : N.txtSec)
    : accent
      ? N.txtPri
      : undefined

  const sharedStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    boxSizing: 'border-box',
    border: 'none',
    borderRadius: R.control,
    backgroundColor: bg,
    fontFamily: FONT,
    textAlign: 'left',
    cursor: 'default',
    textDecoration: 'none',
    ...(color ? { color } : {}),
    ...(accent ? { fontWeight: 500 } : {}),
    ...(separator ? { borderTop: `1px solid ${N.border}`, marginTop: S.xs } : {}),
    ...style,
  }

  const content = icon ? (
    <>
      <span style={{
        width: ICON.lg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        {icon}
      </span>
      {children}
    </>
  ) : children

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={sharedStyle}
      >
        {content}
      </a>
    )
  }

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={sharedStyle}
    >
      {content}
    </button>
  )
}

/* ─── Overlay ───────────────────────────────────────── */

interface OverlayProps {
  open: boolean
  onClose: () => void
  zIndex?: number
  children: ReactNode
}

export function Overlay({ open, onClose, zIndex = 99999, children }: OverlayProps) {
  useEffect(() => {
    if (!open) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex,
        background: 'rgba(0, 0, 0, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </div>,
    document.body,
  )
}

/* ─── DialogCard ────────────────────────────────────── */

interface DialogCardProps {
  title?: string
  width?: number
  children: ReactNode
  style?: CSSProperties
}

export function DialogCard({ title, width = 480, children, style }: DialogCardProps) {
  return (
    <div
      style={{
        background: N.card,
        borderRadius: R.card,
        border: `1px solid ${N.border}`,
        boxShadow: PANEL_SHADOW,
        padding: S.xxl,
        fontFamily: FONT,
        width,
        ...style,
      }}
    >
      {title && (
        <div style={{
          fontSize: T.title,
          fontWeight: 600,
          color: N.txtPri,
          marginBottom: S.lg,
          textWrap: 'pretty',
        }}>
          {title}
        </div>
      )}
      {children}
    </div>
  )
}

/* ─── DialogActions ─────────────────────────────────── */

export function DialogActions({ children }: { children: ReactNode }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'flex-end',
      gap: S.sm,
      marginTop: S.lg,
    }}>
      {children}
    </div>
  )
}

/* ─── ActionButton ──────────────────────────────────── */

interface ActionButtonProps {
  variant: 'ghost' | 'primary'
  disabled?: boolean
  onClick?: () => void
  children: ReactNode
}

export function ActionButton({ variant, disabled, onClick, children }: ActionButtonProps) {
  const [hovered, setHovered] = useState(false)

  const isPrimary = variant === 'primary'
  const bg = isPrimary
    ? (disabled ? A.muted : hovered ? A.hover : A.accent)
    : (hovered ? 'rgba(0, 0, 0, 0.03)' : 'transparent')
  const color = isPrimary
    ? (disabled ? N.txtTer : 'oklch(1 0 0)')
    : N.txtSec

  return (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: `${S.sm}px ${S.md}px`,
        background: bg,
        color,
        border: isPrimary ? 'none' : `1px solid ${N.border}`,
        borderRadius: R.card,
        cursor: 'default',
        fontSize: T.body,
        fontWeight: 500,
        fontFamily: FONT,
        display: 'flex',
        alignItems: 'center',
        gap: S.xs,
      }}
    >
      {children}
    </button>
  )
}
