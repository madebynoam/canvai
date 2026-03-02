/**
 * Minimal Style — Timeline
 * Based on architectural magazine aesthetic
 */

export function MinimalTimeline() {
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#fff', fontFamily: 'Inter, -apple-system, sans-serif', display: 'flex' }}>
      {/* Left: Image */}
      <div style={{ width: '40%', height: '100%' }}>
        <img
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
          alt="Concrete"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Right: Content */}
      <div style={{ width: '60%', padding: '72px 56px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 9, color: '#999', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 24 }}>
          Timeline
        </div>

        <h1 style={{ fontSize: 28, fontWeight: 300, color: '#1a1a1a', margin: 0, lineHeight: 1.3, marginBottom: 48 }}>
          7 days to ship.
        </h1>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {[
            { d: '1', t: 'Core Loop' },
            { d: '2', t: 'Polish' },
            { d: '3', t: 'Simplify' },
            { d: '4', t: 'LP Select' },
            { d: '5', t: 'Homepage' },
            { d: '6', t: 'Docs' },
            { d: '7', t: 'Ship', accent: true },
          ].map((day, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '10px 0',
              borderBottom: '1px solid #eee',
              backgroundColor: day.accent ? '#1a1a1a' : 'transparent',
              color: day.accent ? '#fff' : '#1a1a1a',
              margin: day.accent ? '8px -12px 0' : 0,
              padding: day.accent ? '10px 12px' : '10px 0',
            }}>
              <span style={{ fontSize: 9, color: day.accent ? '#888' : '#bbb', width: 32 }}>D{day.d}</span>
              <span style={{ fontSize: 13 }}>{day.t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
