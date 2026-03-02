/**
 * Minimal Style — Ship vs Cut
 * Based on architectural magazine aesthetic
 */

export function MinimalShip() {
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#fff', fontFamily: 'Inter, -apple-system, sans-serif', padding: '72px 56px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontSize: 9, color: '#999', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 24 }}>
        Prioritization
      </div>

      <h1 style={{ fontSize: 28, fontWeight: 300, color: '#1a1a1a', margin: 0, lineHeight: 1.3, marginBottom: 64 }}>
        Ruthless prioritization.
      </h1>

      <div style={{ display: 'flex', gap: 80, flex: 1 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 9, color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 24 }}>Ship</div>
          {['Core annotation loop', 'modaio new', 'modaio design', 'Share button', 'Vue-style docs'].map((item, i) => (
            <div key={i} style={{ fontSize: 13, color: '#1a1a1a', padding: '12px 0', borderBottom: '1px solid #eee' }}>{item}</div>
          ))}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 9, color: '#bbb', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 24 }}>Cut</div>
          {['GitHub comments', '/close', '/update', '/share', '50+ variations'].map((item, i) => (
            <div key={i} style={{ fontSize: 13, color: '#ccc', padding: '12px 0', borderBottom: '1px solid #eee', textDecoration: 'line-through' }}>{item}</div>
          ))}
        </div>
      </div>
    </div>
  )
}
