const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
const ACCENT = '#E8590C'
const TEXT = '#1F2937'
const TEXT_SECONDARY = '#6B7280'
const TEXT_MUTED = '#9CA3AF'
const BORDER = '#E5E7EB'
const SURFACE_SUBTLE = '#F7F7F8'

/** Consistent label for each section */
function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 500, color: TEXT_MUTED,
      textTransform: 'uppercase', letterSpacing: '0.08em',
      marginBottom: 12,
    }}>
      {children}
    </div>
  )
}

export function ButtonSamples() {
  return (
    <div style={{ fontFamily: FONT, width: 560 }}>
      <div style={{
        fontSize: 11, fontWeight: 600, color: TEXT_MUTED,
        textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 28,
      }}>
        Buttons & Controls
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {/* Primary — single accent, dark, and disabled */}
        <div>
          <Label>Primary</Label>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button style={{
              padding: '8px 20px', fontSize: 13, fontWeight: 500, fontFamily: FONT,
              border: 'none', borderRadius: 6,
              backgroundColor: ACCENT, color: '#fff',
              letterSpacing: '0.01em',
            }}>Apply</button>
            <button style={{
              padding: '8px 20px', fontSize: 13, fontWeight: 500, fontFamily: FONT,
              border: 'none', borderRadius: 6,
              backgroundColor: TEXT, color: '#fff',
              letterSpacing: '0.01em',
            }}>Confirm</button>
            <button style={{
              padding: '8px 20px', fontSize: 13, fontWeight: 500, fontFamily: FONT,
              border: `1px solid ${BORDER}`, borderRadius: 6,
              backgroundColor: SURFACE_SUBTLE, color: '#C4C7CC',
              letterSpacing: '0.01em',
            }}>Disabled</button>
          </div>
        </div>

        {/* Secondary — quiet, functional */}
        <div>
          <Label>Secondary</Label>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button style={{
              padding: '7px 16px', fontSize: 13, fontWeight: 500, fontFamily: FONT,
              border: `1px solid ${BORDER}`, borderRadius: 6,
              backgroundColor: '#fff', color: TEXT,
            }}>Cancel</button>
            <button style={{
              padding: '7px 16px', fontSize: 13, fontWeight: 500, fontFamily: FONT,
              border: `1px solid ${BORDER}`, borderRadius: 6,
              backgroundColor: '#fff', color: TEXT_SECONDARY,
            }}>Dismiss</button>
          </div>
        </div>

        {/* Compact — tighter for inline use */}
        <div>
          <Label>Compact</Label>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button style={{
              padding: '4px 12px', fontSize: 12, fontWeight: 500, fontFamily: FONT,
              border: 'none', borderRadius: 5,
              backgroundColor: ACCENT, color: '#fff',
            }}>Send</button>
            <button style={{
              padding: '4px 12px', fontSize: 12, fontWeight: 500, fontFamily: FONT,
              border: `1px solid ${BORDER}`, borderRadius: 5,
              backgroundColor: '#fff', color: TEXT,
            }}>Edit</button>
            <button style={{
              padding: '4px 12px', fontSize: 12, fontWeight: 500, fontFamily: FONT,
              border: `1px solid ${BORDER}`, borderRadius: 5,
              backgroundColor: SURFACE_SUBTLE, color: '#C4C7CC',
            }}>Disabled</button>
          </div>
        </div>

        {/* Status indicators — systematic, minimal */}
        <div>
          <Label>Status</Label>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{
              fontSize: 11, fontWeight: 500, color: TEXT_SECONDARY,
              backgroundColor: SURFACE_SUBTLE, padding: '3px 10px', borderRadius: 4,
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: TEXT_MUTED }} />
              Manual
            </span>
            <span style={{
              fontSize: 11, fontWeight: 500, color: '#059669',
              backgroundColor: '#F0FDF9', padding: '3px 10px', borderRadius: 4,
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#10B981' }} />
              Watch
            </span>
            <span style={{
              fontSize: 10, fontWeight: 500, color: TEXT_SECONDARY,
              backgroundColor: SURFACE_SUBTLE, padding: '2px 8px', borderRadius: 4,
            }}>Manual</span>
            <span style={{
              fontSize: 10, fontWeight: 500, color: '#059669',
              backgroundColor: '#F0FDF9', padding: '2px 8px', borderRadius: 4,
            }}>Live</span>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 16, height: 16, borderRadius: '50%', backgroundColor: ACCENT,
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 9, fontWeight: 600,
              }}>3</div>
              <span style={{ fontSize: 11, color: ACCENT, fontWeight: 500 }}>pending</span>
            </div>
          </div>
        </div>

        {/* Tags — restrained, functional */}
        <div>
          <Label>Tags</Label>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['Design Systems', 'React', 'TypeScript', 'Figma'].map(tag => (
              <span key={tag} style={{
                fontSize: 11, fontWeight: 500, color: TEXT_SECONDARY,
                backgroundColor: SURFACE_SUBTLE, padding: '3px 10px', borderRadius: 4,
              }}>{tag}</span>
            ))}
          </div>
        </div>

        {/* Icon button — single, precise */}
        <div>
          <Label>Icon Button</Label>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            backgroundColor: ACCENT, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 1px 6px rgba(232, 89, 12, 0.2)',
          }}>
            <svg width="15" height="15" viewBox="0 0 18 18" fill="none">
              <path d="M13 1.5l3.5 3.5-10 10H3v-3.5l10-10z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M11 3.5l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
