/**
 * Dark Style — Vision
 * Minimal editorial, dark variant
 */

const C = {
  bg: '#0A0A0A',
  text: '#FAFAFA',
  textSec: '#888888',
  textMuted: '#555555',
}

export function DarkSummary() {
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: C.bg, fontFamily: 'Inter, -apple-system, sans-serif', display: 'flex' }}>
      {/* Left: Full-bleed image - architectural concrete */}
      <div style={{ flex: 1 }}>
        <img
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
          alt="Concrete architecture"
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }}
        />
      </div>

      {/* Right: Content with generous whitespace */}
      <div style={{ flex: 1, padding: '80px 64px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 48 }}>
            Modaio
          </div>

          <h1 style={{ fontSize: 42, fontWeight: 300, color: C.text, margin: 0, lineHeight: 1.15, maxWidth: 320 }}>
            See every direction at once.
          </h1>
        </div>

        <div>
          <p style={{ fontSize: 14, color: C.textSec, lineHeight: 1.8, maxWidth: 280, marginBottom: 40 }}>
            An infinite canvas for design exploration. Generate real React components. Compare directions side-by-side. Ship what works.
          </p>

          <div style={{ display: 'flex', gap: 40 }}>
            {[
              { value: '∞', label: 'Canvas' },
              { value: 'N', label: 'Directions' },
              { value: '1', label: 'Click' },
            ].map((m, i) => (
              <div key={i}>
                <div style={{ fontSize: 24, fontWeight: 300, color: C.text }}>{m.value}</div>
                <div style={{ fontSize: 9, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 4 }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
