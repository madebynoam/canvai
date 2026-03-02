/**
 * Dark Style — Ship vs Cut
 * Minimal editorial, dark variant
 */

const C = {
  bg: '#0A0A0A',
  text: '#FAFAFA',
  textSec: '#888888',
  textMuted: '#555555',
  border: '#222222',
}

export function DarkShipCut() {
  const ship = ['Core annotation loop', 'modaio new', 'modaio design', 'Share button', 'Vue-style docs']
  const cut = ['GitHub comments', '/close', '/update', '/share', '50+ variations']

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: C.bg, fontFamily: 'Inter, -apple-system, sans-serif', padding: '80px 64px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 24 }}>
        Ship vs Cut
      </div>

      <h1 style={{ fontSize: 36, fontWeight: 300, color: C.text, margin: 0, lineHeight: 1.2, marginBottom: 64 }}>
        Ruthless prioritization.
      </h1>

      <div style={{ display: 'flex', gap: 80, flex: 1 }}>
        {/* Ship */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, color: C.text, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 24 }}>Ship Now</div>
          {ship.map((item, i) => (
            <div key={i} style={{
              fontSize: 14,
              color: C.text,
              padding: '14px 0',
              borderBottom: `1px solid ${C.border}`,
            }}>
              {item}
            </div>
          ))}
        </div>

        {/* Cut */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 24 }}>Cut / Defer</div>
          {cut.map((item, i) => (
            <div key={i} style={{
              fontSize: 14,
              color: C.textMuted,
              padding: '14px 0',
              borderBottom: `1px solid ${C.border}`,
              textDecoration: 'line-through',
            }}>
              {item}
            </div>
          ))}
        </div>
      </div>

      <div style={{ fontSize: 13, color: C.textSec, marginTop: 32 }}>
        Commands: 5 → 2. Less is more.
      </div>
    </div>
  )
}
