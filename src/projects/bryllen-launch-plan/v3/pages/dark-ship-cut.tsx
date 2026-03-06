/**
 * V3 Dark Editorial — Ship vs Cut
 * Prioritization with bold typography
 */

const C = {
  bg: '#0a0a0a',
  text: '#fff',
  textSec: '#a0a0a0',
  textMuted: '#666',
  accent: '#8b9a3b',
  red: '#b54a4a',
}

export function V3DarkShipCut() {
  const ship = ['Core annotation loop', 'modaio new', 'modaio design', 'Share button', 'Vue-style docs', 'README + GIF']
  const cut = ['GitHub comments', '/close command', '/update command', '/share command', '50+ variations', 'Complex iteration']

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: C.bg, fontFamily: 'Georgia, serif', padding: 48, display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontSize: 11, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 16 }}>
        04 — Ship vs Cut
      </div>

      <h1 style={{ fontSize: 32, fontWeight: 400, color: C.text, margin: 0, lineHeight: 1.2, marginBottom: 32 }}>
        Ruthless prioritization.
      </h1>

      <div style={{ display: 'flex', gap: 48, flex: 1 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: C.accent, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 16 }}>Ship Now</div>
          {ship.map((item, i) => (
            <div key={i} style={{ fontSize: 14, color: C.text, padding: '10px 0', borderBottom: `1px solid ${C.textMuted}` }}>
              {item}
            </div>
          ))}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: C.red, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 16 }}>Cut / Defer</div>
          {cut.map((item, i) => (
            <div key={i} style={{ fontSize: 14, color: C.textMuted, padding: '10px 0', borderBottom: `1px solid ${C.textMuted}`, textDecoration: 'line-through' }}>
              {item}
            </div>
          ))}
        </div>
      </div>

      <div style={{ fontSize: 13, color: C.textSec, marginTop: 16 }}>
        Commands: 5 → 2. Close = Ctrl+C. Update = auto. Share = button.
      </div>
    </div>
  )
}
