/**
 * V3 Dark Editorial — Vision
 * Bold serif typography with architectural imagery
 */

const C = {
  bg: '#0a0a0a',
  text: '#fff',
  textSec: '#a0a0a0',
  textMuted: '#666',
  accent: '#8b9a3b', // olive green
}

export function V3DarkVision() {
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: C.bg, fontFamily: 'Georgia, serif', display: 'flex', flexDirection: 'column' }}>
      {/* Hero with accent bar */}
      <div style={{ backgroundColor: C.accent, padding: '32px 48px' }}>
        <div style={{ fontSize: 11, color: '#000', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 8 }}>01 — Vision</div>
        <h1 style={{ fontSize: 48, fontWeight: 400, color: '#000', margin: 0, lineHeight: 1.1 }}>
          See every direction<br />at once.
        </h1>
      </div>

      <div style={{ flex: 1, padding: '32px 48px', display: 'flex', gap: 32 }}>
        {/* Left: Description */}
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 15, color: C.textSec, lineHeight: 1.7, margin: 0 }}>
            Design canvas for Claude Code. Generate real React components. Compare directions side-by-side. Ship what works.
          </p>

          <div style={{ display: 'flex', gap: 32, marginTop: 32 }}>
            {[
              { val: '∞', label: 'Canvas' },
              { val: 'N', label: 'Directions' },
              { val: '1', label: 'Click to share' },
              { val: '0', label: 'Mockups' },
            ].map((m, i) => (
              <div key={i}>
                <div style={{ fontSize: 32, color: C.text, fontFamily: 'Georgia, serif' }}>{m.val}</div>
                <div style={{ fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 4 }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Image */}
        <div style={{ width: 280 }}>
          <img
            src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600&q=80"
            alt="Architectural vision"
            style={{ width: '100%', height: 200, objectFit: 'cover' }}
          />
        </div>
      </div>

      <div style={{ padding: '16px 48px', borderTop: `1px solid ${C.textMuted}` }}>
        <div style={{ fontSize: 13, color: C.textSec }}>
          Not mockups. Not chat. A canvas where designs become code.
        </div>
      </div>
    </div>
  )
}
