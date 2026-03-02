/**
 * Minimal Style — Vision
 * Based on architectural magazine aesthetic
 */

export function MinimalVision() {
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#fff', fontFamily: 'Inter, -apple-system, sans-serif', display: 'flex' }}>
      {/* Left: Image */}
      <div style={{ width: '50%', height: '100%' }}>
        <img
          src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80"
          alt="Workspace"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Right: Content */}
      <div style={{ width: '50%', padding: '72px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 9, color: '#999', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
          Modaio
        </div>

        <div>
          <h1 style={{ fontSize: 32, fontWeight: 300, color: '#1a1a1a', margin: 0, lineHeight: 1.2 }}>
            See every<br />direction at once.
          </h1>
        </div>

        <div style={{ fontSize: 12, color: '#666', lineHeight: 1.7 }}>
          An infinite canvas for design exploration.<br />
          Generate real React components.<br />
          Ship what works.
        </div>
      </div>
    </div>
  )
}
