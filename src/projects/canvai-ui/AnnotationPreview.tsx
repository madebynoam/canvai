import { useState } from 'react'

const ACCENT = '#E8590C'
const ACCENT_HOVER = '#CF4F0B'
const ACCENT_MUTED = 'rgba(232, 89, 12, 0.15)'
const ACCENT_SHADOW = 'rgba(232, 89, 12, 0.25)'
const SURFACE = '#FFFFFF'
const SURFACE_ALT = '#F9FAFB'
const BORDER = '#E5E7EB'
const TEXT_PRIMARY = '#1F2937'
const TEXT_SECONDARY = '#6B7280'
const TEXT_TERTIARY = '#9CA3AF'
const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'

/** Comment card in its various states */
export function CommentCardPreview() {
  return (
    <div style={{ fontFamily: FONT, display: 'flex', flexDirection: 'column', gap: 24, padding: 8 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: TEXT_TERTIARY, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Comment Card
      </div>

      {/* Empty state */}
      <div>
        <div style={{ fontSize: 11, color: TEXT_TERTIARY, marginBottom: 8 }}>Empty (Apply disabled)</div>
        <div style={{
          background: SURFACE, borderRadius: 10, padding: 16,
          boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
          border: `1px solid ${BORDER}`, width: 320,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ fontSize: 11, color: TEXT_TERTIARY, letterSpacing: '0.02em' }}>
              ButtonSamples &middot; button
            </div>
            <span style={{
              fontSize: 10, fontWeight: 500, color: TEXT_SECONDARY,
              backgroundColor: '#F3F4F6', padding: '2px 8px', borderRadius: 10,
            }}>Manual</span>
          </div>
          <div style={{
            width: '100%', minHeight: 72, background: SURFACE_ALT,
            color: TEXT_TERTIARY, border: `1px solid ${BORDER}`, borderRadius: 8,
            padding: 10, fontSize: 13, lineHeight: 1.5,
          }}>
            Describe the change...
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 10, justifyContent: 'flex-end' }}>
            <button style={{
              padding: '7px 14px', background: 'transparent', color: TEXT_SECONDARY,
              border: `1px solid ${BORDER}`, borderRadius: 8,
              fontSize: 12, fontWeight: 500, fontFamily: FONT,
            }}>Cancel</button>
            <button style={{
              padding: '7px 14px', background: ACCENT_MUTED, color: TEXT_TERTIARY,
              border: 'none', borderRadius: 8, cursor: 'default',
              fontSize: 12, fontWeight: 500, fontFamily: FONT,
            }}>Apply</button>
          </div>
        </div>
      </div>

      {/* Filled state */}
      <div>
        <div style={{ fontSize: 11, color: TEXT_TERTIARY, marginBottom: 8 }}>Filled (Apply active)</div>
        <div style={{
          background: SURFACE, borderRadius: 10, padding: 16,
          boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
          border: `1px solid ${BORDER}`, width: 320,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ fontSize: 11, color: TEXT_TERTIARY, letterSpacing: '0.02em' }}>
              TopBar &middot; div
            </div>
            <span style={{
              fontSize: 10, fontWeight: 500, color: TEXT_SECONDARY,
              backgroundColor: '#F3F4F6', padding: '2px 8px', borderRadius: 10,
            }}>Manual</span>
          </div>
          <div style={{
            width: '100%', minHeight: 72, background: SURFACE_ALT,
            color: TEXT_PRIMARY, border: `1px solid ${BORDER}`, borderRadius: 8,
            padding: 10, fontSize: 13, lineHeight: 1.5,
          }}>
            Make the font weight 600 and reduce the gap to 4px
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 10, justifyContent: 'flex-end' }}>
            <button style={{
              padding: '7px 14px', background: 'transparent', color: TEXT_SECONDARY,
              border: `1px solid ${BORDER}`, borderRadius: 8,
              fontSize: 12, fontWeight: 500, fontFamily: FONT,
            }}>Cancel</button>
            <button style={{
              padding: '7px 14px', background: ACCENT, color: '#fff',
              border: 'none', borderRadius: 8,
              fontSize: 12, fontWeight: 500, fontFamily: FONT,
            }}>Apply</button>
          </div>
        </div>
      </div>

      {/* Watch mode */}
      <div>
        <div style={{ fontSize: 11, color: TEXT_TERTIARY, marginBottom: 8 }}>Watch mode (Live badge)</div>
        <div style={{
          background: SURFACE, borderRadius: 10, padding: 16,
          boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
          border: `1px solid ${BORDER}`, width: 320,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ fontSize: 11, color: TEXT_TERTIARY, letterSpacing: '0.02em' }}>
              SidebarOptionN &middot; span
            </div>
            <span style={{
              fontSize: 10, fontWeight: 500, color: '#059669',
              backgroundColor: '#ECFDF5', padding: '2px 8px', borderRadius: 10,
            }}>Live</span>
          </div>
          <div style={{
            width: '100%', minHeight: 72, background: SURFACE_ALT,
            color: TEXT_PRIMARY, border: `1px solid ${BORDER}`, borderRadius: 8,
            padding: 10, fontSize: 13, lineHeight: 1.5,
          }}>
            Change the active text color to the accent orange
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 10, justifyContent: 'flex-end' }}>
            <button style={{
              padding: '7px 14px', background: 'transparent', color: TEXT_SECONDARY,
              border: `1px solid ${BORDER}`, borderRadius: 8,
              fontSize: 12, fontWeight: 500, fontFamily: FONT,
            }}>Cancel</button>
            <button style={{
              padding: '7px 14px', background: ACCENT, color: '#fff',
              border: 'none', borderRadius: 8,
              fontSize: 12, fontWeight: 500, fontFamily: FONT,
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              Send
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M3 8l4 4 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/** FAB button, markers, highlight, and toast */
export function AnnotationElementsPreview() {
  const [fabState, setFabState] = useState<'idle' | 'hover'>('idle')

  return (
    <div style={{ fontFamily: FONT, display: 'flex', flexDirection: 'column', gap: 24, padding: 8 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: TEXT_TERTIARY, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Annotation Elements
      </div>

      {/* FAB button states */}
      <div>
        <div style={{ fontSize: 11, color: TEXT_TERTIARY, marginBottom: 10 }}>Annotate Button (FAB)</div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {(['idle', 'hover', 'pressed'] as const).map(state => (
            <div key={state} style={{ textAlign: 'center' }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: state === 'hover' ? ACCENT_HOVER : state === 'pressed' ? '#D4520A' : ACCENT,
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: state === 'hover'
                  ? `0 4px 16px ${ACCENT_SHADOW}`
                  : `0 2px 8px ${ACCENT_SHADOW}`,
                transform: state === 'pressed' ? 'scale(0.95)' : 'scale(1)',
              }}>
                <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                  <path d="M13 1.5l3.5 3.5-10 10H3v-3.5l10-10z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M11 3.5l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div style={{ fontSize: 10, color: TEXT_TERTIARY, marginTop: 6 }}>{state}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Annotation markers */}
      <div>
        <div style={{ fontSize: 11, color: TEXT_TERTIARY, marginBottom: 10 }}>Annotation Markers</div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {[1, 2, 3, 4, 5].map(n => (
            <div key={n} style={{
              width: 18, height: 18, borderRadius: '50%',
              backgroundColor: ACCENT, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 9, fontWeight: 700, fontFamily: FONT,
              boxShadow: `0 1px 4px ${ACCENT_SHADOW}`,
              cursor: 'default', userSelect: 'none',
            }}>
              {n}
            </div>
          ))}
        </div>
      </div>

      {/* Highlight box */}
      <div>
        <div style={{ fontSize: 11, color: TEXT_TERTIARY, marginBottom: 10 }}>Targeting Highlight</div>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <div style={{
            padding: '8px 16px', background: '#F3F4F6', borderRadius: 6,
            fontSize: 13, color: TEXT_PRIMARY,
          }}>
            Sample element
          </div>
          <div style={{
            position: 'absolute', inset: -2,
            border: `2px solid ${ACCENT}`, borderRadius: 4,
            pointerEvents: 'none',
          }} />
        </div>
      </div>

      {/* Toast notifications */}
      <div>
        <div style={{ fontSize: 11, color: TEXT_TERTIARY, marginBottom: 10 }}>Toast Notifications (watch mode only)</div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{
            padding: '8px 24px', background: TEXT_PRIMARY, color: '#fff',
            borderRadius: 20, fontSize: 13, fontWeight: 500,
            boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
          }}>
            Sent to agent
          </div>
          <div style={{
            padding: '8px 24px', background: TEXT_PRIMARY, color: '#fff',
            borderRadius: 20, fontSize: 13, fontWeight: 500,
            boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
          }}>
            Failed to send
          </div>
        </div>
        <div style={{ fontSize: 10, color: TEXT_TERTIARY, marginTop: 6 }}>
          Manual mode: no toast (annotation is queued, not sent)
        </div>
      </div>

      {/* Crosshair cursor indicator */}
      <div>
        <div style={{ fontSize: 11, color: TEXT_TERTIARY, marginBottom: 10 }}>Targeting Mode Cursor</div>
        <div style={{
          width: 120, height: 80, background: '#F9FAFB', borderRadius: 8,
          border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'crosshair', fontSize: 11, color: TEXT_TERTIARY,
        }}>
          crosshair
        </div>
      </div>
    </div>
  )
}
