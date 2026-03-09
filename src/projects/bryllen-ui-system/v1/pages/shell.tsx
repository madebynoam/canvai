import { useState } from 'react'
import { SquareMousePointer } from 'lucide-react'
import { N, A, E, S, R, T, FONT } from '../../../../runtime/tokens'
import { TopBar } from '../../../../runtime/TopBar'

const projects = [
  { project: 'canvai-ui-system' },
  { project: 'settings-page' },
  { project: 'dashboard' },
]

export function Shell() {
  const [projectIdx, setProjectIdx] = useState(0)

  return (
    <div style={{
      width: '100%', minHeight: 560,
      display: 'flex', flexDirection: 'column',
      fontFamily: FONT, overflow: 'hidden',
      position: 'relative',
    }}>
      <TopBar
        projects={projects}
        activeProjectIndex={projectIdx}
        onSelectProject={setProjectIdx}
        annotationEndpoint="http://localhost:4748"
        projectName="canvai-ui-system"
      />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Canvas area */}
        <div style={{ flex: 1, backgroundColor: N.chrome, padding: E.inset }}>
          <div style={{
            width: '100%', height: '100%',
            borderRadius: E.radius,
            backgroundColor: N.canvas,
            boxShadow: E.shadow,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {/* Fake frame cards */}
            <div style={{ display: 'flex', gap: S.xl, padding: S.xxl }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{
                  width: 160, height: 120,
                  backgroundColor: N.card,
                  borderRadius: R.card,
                  border: `1px solid ${N.borderSoft}`,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  gap: S.sm,
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    backgroundColor: i === 2 ? A.accent : N.chromeSub,
                  }} />
                  <div style={{ fontSize: T.body, color: N.txtSec }}>Frame {i}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FAB */}
      <div style={{
        position: 'absolute',
        bottom: S.lg + S.md,
        right: S.lg + S.md,
      }}>
        <div style={{
          width: 40, height: 40,
          borderRadius: '50%',
          backgroundColor: A.accent,
          color: 'oklch(1 0 0)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 1px 3px rgba(0,0,0,0.12), 0 0 0 0.5px rgba(0,0,0,0.06)',
        }}>
          <SquareMousePointer size={S.xl} strokeWidth={1.5} />
        </div>
      </div>
    </div>
  )
}
