const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
const ACCENT = '#E8590C'

export function ButtonSamples() {
  return (
    <div style={{ fontFamily: FONT, width: 560 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>
        Buttons & Controls
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Primary buttons */}
        <div>
          <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 10 }}>Primary</div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button style={{
              padding: '10px 24px', fontSize: 14, fontWeight: 500, fontFamily: FONT,
              border: 'none', borderRadius: 10, cursor: 'pointer',
              backgroundColor: ACCENT, color: '#fff',
            }}>Apply</button>
            <button style={{
              padding: '10px 24px', fontSize: 14, fontWeight: 500, fontFamily: FONT,
              border: 'none', borderRadius: 10, cursor: 'pointer',
              backgroundColor: '#1F2937', color: '#fff',
            }}>Follow</button>
            <button style={{
              padding: '10px 24px', fontSize: 14, fontWeight: 500, fontFamily: FONT,
              border: 'none', borderRadius: 10, cursor: 'default',
              backgroundColor: 'rgba(232, 89, 12, 0.15)', color: '#9CA3AF',
            }}>Disabled</button>
          </div>
        </div>

        {/* Secondary buttons */}
        <div>
          <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 10 }}>Secondary</div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button style={{
              padding: '8px 16px', fontSize: 13, fontWeight: 500, fontFamily: FONT,
              border: '1px solid #E5E7EB', borderRadius: 8, cursor: 'pointer',
              backgroundColor: '#fff', color: '#1F2937',
            }}>Cancel</button>
            <button style={{
              padding: '8px 16px', fontSize: 13, fontWeight: 500, fontFamily: FONT,
              border: '1px solid #E5E7EB', borderRadius: 8, cursor: 'pointer',
              backgroundColor: '#fff', color: '#1F2937',
            }}>Message</button>
            <button style={{
              padding: '8px 16px', fontSize: 13, fontWeight: 500, fontFamily: FONT,
              border: '1px solid #E5E7EB', borderRadius: 8, cursor: 'pointer',
              backgroundColor: '#fff', color: '#6B7280',
            }}>Following</button>
          </div>
        </div>

        {/* Badges & Pills */}
        <div>
          <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 10 }}>Badges & Pills</div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: 11, fontWeight: 500, color: '#6B7280',
              backgroundColor: '#F3F4F6', padding: '3px 10px', borderRadius: 12,
              display: 'inline-flex', alignItems: 'center', gap: 5,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#9CA3AF' }} />
              Manual
            </span>
            <span style={{
              fontSize: 11, fontWeight: 500, color: '#059669',
              backgroundColor: '#ECFDF5', padding: '3px 10px', borderRadius: 12,
              display: 'inline-flex', alignItems: 'center', gap: 5,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#10B981' }} />
              Watch
            </span>
            <span style={{
              fontSize: 10, fontWeight: 500, color: '#6B7280',
              backgroundColor: '#F3F4F6', padding: '2px 8px', borderRadius: 10,
            }}>Manual</span>
            <span style={{
              fontSize: 10, fontWeight: 500, color: '#059669',
              backgroundColor: '#ECFDF5', padding: '2px 8px', borderRadius: 10,
            }}>Live</span>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              <div style={{
                width: 16, height: 16, borderRadius: '50%', backgroundColor: ACCENT,
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 9, fontWeight: 600,
              }}>3</div>
              <span style={{ fontSize: 11, color: ACCENT, fontWeight: 500 }}>pending</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div>
          <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 10 }}>Tags</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['Design Systems', 'React', 'TypeScript', 'Figma'].map(tag => (
              <span key={tag} style={{
                fontSize: 11, fontWeight: 500, color: '#6B7280',
                backgroundColor: '#F3F4F6', padding: '3px 10px', borderRadius: 99,
              }}>{tag}</span>
            ))}
          </div>
        </div>

        {/* Icon button */}
        <div>
          <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 10 }}>Icon Button (Annotate)</div>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            backgroundColor: ACCENT, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(232, 89, 12, 0.25)',
            cursor: 'pointer',
          }}>
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <path d="M13 1.5l3.5 3.5-10 10H3v-3.5l10-10z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M11 3.5l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
