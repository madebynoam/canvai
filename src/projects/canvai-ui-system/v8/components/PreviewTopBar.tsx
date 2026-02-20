import { useState } from 'react'
import { PanelLeft, ChevronDown } from 'lucide-react'
import { S, R, T, ICON, FONT } from '../tokens'

interface PreviewTopBarProps {
  projectName: string
  iterations: string[]
  activeIterationIndex: number
  onSelectIteration: (index: number) => void
  pendingCount: number
  mode: 'manual' | 'watch'
  sidebarOpen: boolean
  onToggleSidebar: () => void
}

export function PreviewTopBar({
  projectName,
  iterations,
  activeIterationIndex,
  onSelectIteration,
  pendingCount,
  mode,
  sidebarOpen,
  onToggleSidebar,
}: PreviewTopBarProps) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      minHeight: 40, padding: `0 ${S.md}px`,
      backgroundColor: 'var(--chrome)',
      fontFamily: FONT, flexShrink: 0, position: 'relative',
    }}>
      {/* Left: sidebar toggle + project trigger */}
      <div style={{ display: 'flex', alignItems: 'center', gap: S.sm, flex: '0 0 auto' }}>
        <button onClick={onToggleSidebar} style={{
          width: S.xxl, height: S.xxl, border: 'none', background: 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: sidebarOpen ? 'var(--txt-pri)' : 'var(--txt-ter)', borderRadius: R.control,
          cursor: 'default',
        }}>
          <PanelLeft size={ICON.lg} strokeWidth={1.5} />
        </button>

        <div style={{
          display: 'flex', alignItems: 'center', gap: S.sm,
          padding: `${S.xs}px ${S.sm}px`, borderRadius: R.control,
        }}>
          <div style={{
            width: S.xl, height: S.xl, borderRadius: '50%',
            backgroundColor: 'var(--accent)', color: 'oklch(1 0 0)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: T.pill, fontWeight: 600, flexShrink: 0,
          }}>
            {projectName.charAt(0).toUpperCase()}
          </div>
          <span style={{ fontSize: T.title, fontWeight: 500, color: 'var(--txt-pri)' }}>{projectName}</span>
          <ChevronDown size={ICON.sm} strokeWidth={1.5} color="var(--txt-ter)" style={{ flexShrink: 0 }} />
        </div>
      </div>

      {/* Center: iteration pills */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        transform: 'translate(-50%, -50%)',
      }}>
        <div style={{
          display: 'inline-flex', gap: S.xs, padding: S.xs,
          borderRadius: R.pill, backgroundColor: 'var(--chrome-sub)',
        }}>
          {iterations.map((name, i) => (
            <button key={i} onClick={() => onSelectIteration(i)} style={{
              width: 32, border: 'none', cursor: 'default',
              padding: `${S.xs}px ${S.sm}px`, borderRadius: R.pill,
              fontSize: T.pill, fontWeight: i === activeIterationIndex ? 600 : 400,
              fontFamily: FONT,
              backgroundColor: i === activeIterationIndex ? 'var(--card)' : 'transparent',
              color: i === activeIterationIndex ? 'var(--txt-pri)' : 'var(--txt-faint)',
              boxShadow: i === activeIterationIndex ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
              textAlign: 'center',
            }}>{name}</button>
          ))}
        </div>
      </div>

      {/* Right: pending + watch */}
      <div style={{ display: 'flex', alignItems: 'center', gap: S.md, flex: '0 0 auto' }}>
        {pendingCount > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: S.sm }}>
            <div style={{
              width: S.lg, height: S.lg, borderRadius: '50%',
              backgroundColor: 'var(--accent)', color: 'oklch(1 0 0)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: T.label, fontWeight: 600,
            }}>
              {pendingCount}
            </div>
            <span style={{ fontSize: T.caption, color: 'var(--accent)', fontWeight: 500 }}>pending</span>
          </div>
        )}

      </div>
    </div>
  )
}
