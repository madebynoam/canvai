/**
 * Minimal Style — Master
 * Based on architectural magazine aesthetic
 */

export function MinimalMaster() {
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#fff', fontFamily: 'Inter, -apple-system, sans-serif', padding: '56px', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 }}>
        <h1 style={{ fontSize: 36, fontWeight: 300, color: '#1a1a1a', margin: 0 }}>Modaio</h1>
        <div style={{ fontSize: 9, color: '#bbb', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Summary</div>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, flex: 1 }}>
        <div>
          <div style={{ fontSize: 9, color: '#999', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 16 }}>Jobs</div>
          {['Explore', 'Iterate', 'Decide', 'Share'].map((j, i) => (
            <div key={i} style={{ fontSize: 12, color: '#1a1a1a', padding: '6px 0', borderBottom: '1px solid #eee' }}>{j}</div>
          ))}
        </div>

        <div>
          <div style={{ fontSize: 9, color: '#999', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 16 }}>Ship</div>
          {['Core loop', 'new', 'design', 'Share btn', 'Docs'].map((s, i) => (
            <div key={i} style={{ fontSize: 12, color: '#1a1a1a', padding: '6px 0', borderBottom: '1px solid #eee' }}>{s}</div>
          ))}
        </div>

        <div>
          <div style={{ fontSize: 9, color: '#999', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 16 }}>7 Days</div>
          {['D1-2 Core', 'D3 Simplify', 'D4 LP', 'D5-6 Site', 'D7 Ship'].map((d, i) => (
            <div key={i} style={{ fontSize: 12, color: '#888', padding: '6px 0', borderBottom: '1px solid #eee' }}>{d}</div>
          ))}
        </div>

        <div style={{ backgroundColor: '#1a1a1a', padding: 20, color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.5 }}>Goal</div>
          <div style={{ fontSize: 12, lineHeight: 1.6 }}>npx modaio new → shareable URL in under 5 min</div>
        </div>
      </div>
    </div>
  )
}
