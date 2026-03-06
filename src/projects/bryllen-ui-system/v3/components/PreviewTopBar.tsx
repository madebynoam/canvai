import { useState } from 'react'
import { PanelLeft, ChevronDown } from 'lucide-react'
import { N, A, W, S, R, T, ICON, FONT } from '../tokens'

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
  const isWatch = mode === 'watch'

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      minHeight: 40, padding: `0 ${S.md}px`,
      backgroundColor: N.chrome,
      fontFamily: FONT, flexShrink: 0, position: 'relative',
    }}>
      {/* Left: sidebar toggle + project trigger */}
      <div style={{ display: 'flex', alignItems: 'center', gap: S.sm, flex: '0 0 auto' }}>
        <button onClick={onToggleSidebar} style={{
          width: S.xxl, height: S.xxl, border: 'none', background: 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: sidebarOpen ? N.txtPri : N.txtTer, borderRadius: R.control,
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
            backgroundColor: A.accent, color: 'oklch(1 0 0)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: T.pill, fontWeight: 600, flexShrink: 0,
          }}>
            {projectName.charAt(0).toUpperCase()}
          </div>
          <span style={{ fontSize: T.title, fontWeight: 500, color: N.txtPri }}>{projectName}</span>
          <ChevronDown size={ICON.sm} strokeWidth={1.5} color={N.txtTer} style={{ flexShrink: 0 }} />
        </div>
      </div>

      {/* Center: iteration pills */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        transform: 'translate(-50%, -50%)',
      }}>
        <div style={{
          display: 'inline-flex', gap: S.xs, padding: S.xs,
          borderRadius: R.pill, backgroundColor: N.chromeSub,
        }}>
          {iterations.map((name, i) => (
            <button key={i} onClick={() => onSelectIteration(i)} style={{
              width: 32, border: 'none', cursor: 'default',
              padding: `${S.xs}px ${S.sm}px`, borderRadius: R.pill,
              fontSize: T.pill, fontWeight: i === activeIterationIndex ? 600 : 400,
              fontFamily: FONT,
              backgroundColor: i === activeIterationIndex ? N.card : 'transparent',
              color: i === activeIterationIndex ? N.txtPri : N.txtFaint,
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
              backgroundColor: A.accent, color: 'oklch(1 0 0)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: T.label, fontWeight: 600,
            }}>
              {pendingCount}
            </div>
            <span style={{ fontSize: T.caption, color: A.accent, fontWeight: 500 }}>pending</span>
          </div>
        )}

        <div style={{
          display: 'flex', alignItems: 'center', gap: S.xs,
          padding: `${S.xs}px ${S.md}px`, borderRadius: R.card,
          backgroundColor: isWatch ? W.bg : N.chromeSub,
          border: `1px solid ${isWatch ? 'oklch(0.82 0.06 155)' : N.border}`,
          fontSize: T.pill, fontWeight: 500,
          color: isWatch ? W.text : N.txtTer,
        }}>
          <div style={{
            width: S.sm, height: S.sm, borderRadius: '50%',
            backgroundColor: isWatch ? W.dot : N.txtFaint,
          }} />
          Watch
        </div>
      </div>
    </div>
  )
}
