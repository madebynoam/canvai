/**
 * Light Style — Polish
 * Minimal editorial
 */

const C = {
  bg: '#FFFFFF',
  text: '#1A1A1A',
  textSec: '#6B6B6B',
  textMuted: '#999999',
  border: '#E5E5E5',
}

export function LightPolish() {
  const must = [
    'Instant scaffold (<5s)',
    'Multiple directions shown',
    'Click → marker instantly',
    'Share button in topbar',
    'URL copied immediately',
    'Pan/zoom 60fps',
  ]

  const should = [
    'Error has retry',
    'Consistent radii',
  ]

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: C.bg, fontFamily: 'Inter, -apple-system, sans-serif', display: 'flex' }}>
      {/* Left: Content */}
      <div style={{ flex: 1, padding: '80px 64px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 24 }}>
          Polish
        </div>

        <h1 style={{ fontSize: 36, fontWeight: 300, color: C.text, margin: 0, lineHeight: 1.2, marginBottom: 48 }}>
          What makes it "wow".
        </h1>

        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 10, color: C.text, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Must</div>
          {must.map((item, i) => (
            <div key={i} style={{
              fontSize: 14,
              color: C.text,
              padding: '12px 0',
              borderBottom: `1px solid ${C.border}`,
            }}>
              {item}
            </div>
          ))}
        </div>

        <div>
          <div style={{ fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Should</div>
          {should.map((item, i) => (
            <div key={i} style={{
              fontSize: 14,
              color: C.textSec,
              padding: '12px 0',
              borderBottom: `1px solid ${C.border}`,
            }}>
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Right: Image - material samples */}
      <div style={{ width: '45%' }}>
        <img
          src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=800&q=80"
          alt="Material textures"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    </div>
  )
}
