/**
 * V3 — Ship vs Cut
 * Minimal style with full prioritization lists
 */

const C = {
  bg: '#fff',
  text: '#1a1a1a',
  textSec: '#666',
  textMuted: '#999',
  green: '#16a34a',
  red: '#dc2626',
}

export function V3ShipCut() {
  const ship = ['Core annotation loop', 'modaio new', 'modaio design', 'Share button', 'Vue-style docs', 'README + GIF']
  const cut = ['GitHub comments', '/close command', '/update command', '/share command', '50+ variations', 'Complex iteration']

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: C.bg, fontFamily: 'Inter, -apple-system, sans-serif', padding: 56, display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 24 }}>
        04 — Ship vs Cut
      </div>

      <h1 style={{ fontSize: 32, fontWeight: 300, color: C.text, margin: 0, lineHeight: 1.25, marginBottom: 32 }}>
        Ruthless prioritization.
      </h1>

      <div style={{ display: 'flex', gap: 64, flex: 1 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, color: C.green, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Ship Now</div>
          {ship.map((item, i) => (
            <div key={i} style={{ fontSize: 14, color: C.text, padding: '10px 0', borderBottom: '1px solid #eee' }}>
              {item}
            </div>
          ))}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, color: C.red, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Cut / Defer</div>
          {cut.map((item, i) => (
            <div key={i} style={{ fontSize: 14, color: C.textMuted, padding: '10px 0', borderBottom: '1px solid #eee', textDecoration: 'line-through' }}>
              {item}
            </div>
          ))}
        </div>
      </div>

      <div style={{ fontSize: 13, color: C.textSec, marginTop: 24 }}>
        Commands: 5 → 2. Close = Ctrl+C. Update = auto. Share = button.
      </div>
    </div>
  )
}
