import { useState } from 'react'
import { F, R, V } from './tokens'

interface Point {
  x: number
  y: number
}

interface ConnectionLineProps {
  from: Point
  to: Point
  /** Whether the line is being drawn (provisional) or persisted */
  provisional?: boolean
  /** Whether the line is hovered */
  hovered?: boolean
  onClick?: () => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

/** Distance between two points */
function distance(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x
  const dy = p2.y - p1.y
  return Math.sqrt(dx * dx + dy * dy)
}

/**
 * Calculate control point for a quadratic bezier curve that creates an organic "noodle" shape.
 * The curve sags perpendicular to the line, with more sag for longer distances.
 */
function calculateControlPoint(p1: Point, p2: Point): Point {
  const mid = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 }
  const dist = distance(p1, p2)

  // Sag amount scales with distance, but with diminishing returns
  const sag = Math.min(dist * 0.15, 80)

  // Angle perpendicular to the line (always sag "down" in screen space for consistency)
  const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) + Math.PI / 2

  // If the line is more horizontal, sag down; if more vertical, sag right
  const lineAngle = Math.atan2(p2.y - p1.y, p2.x - p1.x)
  const sagDirection = Math.abs(lineAngle) < Math.PI / 4 || Math.abs(lineAngle) > 3 * Math.PI / 4 ? 1 : -1

  return {
    x: mid.x + Math.cos(angle) * sag * sagDirection,
    y: mid.y + Math.sin(angle) * sag * sagDirection,
  }
}

/**
 * Organic connection line between two points.
 * Renders as a quadratic bezier curve with circle endpoints.
 */
export function ConnectionLine({
  from,
  to,
  provisional = false,
  hovered = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: ConnectionLineProps) {
  const cp = calculateControlPoint(from, to)
  const pathD = `M ${from.x},${from.y} Q ${cp.x},${cp.y} ${to.x},${to.y}`

  const circleRadius = provisional ? 4 : hovered ? 6 : 5
  const strokeWidth = provisional ? 1.5 : hovered ? 2.5 : 2
  const strokeColor = provisional
    ? F.marker
    : hovered
      ? F.marker
      : V.txtSec
  const strokeOpacity = provisional ? 0.6 : hovered ? 1 : 0.8
  const fillColor = provisional ? F.marker : hovered ? F.marker : V.txtSec

  return (
    <g
      style={{ cursor: provisional ? 'default' : 'pointer' }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Invisible wider stroke for easier hover targeting */}
      {!provisional && (
        <path
          d={pathD}
          fill="none"
          stroke="transparent"
          strokeWidth={16}
          style={{ cursor: 'pointer' }}
        />
      )}

      {/* Visible stroke */}
      <path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeOpacity={strokeOpacity}
        strokeLinecap="round"
        style={{
          transition: provisional ? 'none' : 'stroke-width 150ms, stroke-opacity 150ms',
          pointerEvents: 'none',
        }}
      />

      {/* Start circle */}
      <circle
        cx={from.x}
        cy={from.y}
        r={circleRadius}
        fill={fillColor}
        fillOpacity={strokeOpacity}
        style={{
          transition: provisional ? 'none' : 'r 150ms, fill-opacity 150ms',
          pointerEvents: 'none',
        }}
      />

      {/* End circle */}
      <circle
        cx={to.x}
        cy={to.y}
        r={circleRadius}
        fill={fillColor}
        fillOpacity={strokeOpacity}
        style={{
          transition: provisional ? 'none' : 'r 150ms, fill-opacity 150ms',
          pointerEvents: 'none',
        }}
      />
    </g>
  )
}

interface ConnectionsSvgLayerProps {
  children: React.ReactNode
}

/**
 * SVG layer for rendering connection lines.
 * Should be positioned over the canvas content.
 */
export function ConnectionsSvgLayer({ children }: ConnectionsSvgLayerProps) {
  return (
    <svg
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 99996, // Below overlay (99998) but above frames
      }}
      width="100%"
      height="100%"
    >
      <g style={{ pointerEvents: 'auto' }}>
        {children}
      </g>
    </svg>
  )
}
