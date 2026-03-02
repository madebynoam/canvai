/**
 * Minimal Style — Polish
 * Based on architectural magazine aesthetic
 */

export function MinimalPolish() {
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#fff', fontFamily: 'Inter, -apple-system, sans-serif', display: 'flex' }}>
      {/* Left: Content */}
      <div style={{ width: '60%', padding: '72px 56px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 9, color: '#999', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 24 }}>
          Polish
        </div>

        <h1 style={{ fontSize: 28, fontWeight: 300, color: '#1a1a1a', margin: 0, lineHeight: 1.3, marginBottom: 48 }}>
          What makes it "wow".
        </h1>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {[
            'Instant scaffold (<5s)',
            'Multiple directions shown',
            'Click → marker instantly',
            'Share button in topbar',
            'URL copied immediately',
            'Pan/zoom 60fps',
          ].map((item, i) => (
            <div key={i} style={{ fontSize: 13, color: '#1a1a1a', padding: '10px 0', borderBottom: '1px solid #eee' }}>{item}</div>
          ))}
        </div>
      </div>

      {/* Right: Image */}
      <div style={{ width: '40%', height: '100%' }}>
        <img
          src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=800&q=80"
          alt="Texture"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    </div>
  )
}
