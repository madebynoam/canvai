/**
 * Minimal Style — Name
 * Based on architectural magazine aesthetic
 */

export function MinimalName() {
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#fff', fontFamily: 'Inter, -apple-system, sans-serif', display: 'flex' }}>
      {/* Left: Content */}
      <div style={{ width: '50%', padding: '72px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontSize: 9, color: '#999', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 48 }}>
          Identity
        </div>

        <h1 style={{ fontSize: 56, fontWeight: 300, color: '#1a1a1a', margin: 0, lineHeight: 1, marginBottom: 32 }}>
          Modaio
        </h1>

        <p style={{ fontSize: 13, color: '#888', lineHeight: 1.8, marginBottom: 40 }}>
          From modello — the Italian word for model.<br />
          The sculptor's maquette.<br />
          Test ideas before you build.
        </p>

        <div style={{ fontSize: 11, color: '#bbb' }}>
          modaio.dev
        </div>
      </div>

      {/* Right: Image */}
      <div style={{ width: '50%', height: '100%' }}>
        <img
          src="https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=800&q=80"
          alt="Materials"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    </div>
  )
}
