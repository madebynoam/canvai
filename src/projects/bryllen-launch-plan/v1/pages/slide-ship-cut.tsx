/**
 * Slide 4: Ship vs Cut
 * Dark editorial style
 */

const C = {
  bg: '#141414',
  text: '#FAFAFA',
  textSec: '#A1A1A1',
  textMuted: '#6B6B6B',
  green: '#4ADE80',
  red: '#F87171',
}

export function SlideShipCut() {
  const ship = ['Core annotation loop', 'canvai new', 'canvai design', 'Share button', 'Vue-style docs', 'README + GIF']
  const cut = ['GitHub comments', '/close command', '/update command', '/share command', '50+ variations', 'Complex iteration']

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: C.bg, fontFamily: 'Inter, -apple-system, sans-serif', padding: 64, display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontSize: 11, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 24 }}>
        04 — Ship vs Cut
      </div>

      <h1 style={{ fontSize: 44, fontWeight: 300, color: C.text, margin: 0, lineHeight: 1.3, marginBottom: 48 }}>
        Ruthless prioritization.
      </h1>

      <div style={{ display: 'flex', gap: 80, flex: 1 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: C.green, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20 }}>Ship Now</div>
          {ship.map((item, i) => (
            <div key={i} style={{ fontSize: 15, color: C.text, padding: '10px 0', borderBottom: `1px solid ${C.textMuted}20` }}>
              {item}
            </div>
          ))}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: C.red, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20 }}>Cut / Defer</div>
          {cut.map((item, i) => (
            <div key={i} style={{ fontSize: 15, color: C.textMuted, padding: '10px 0', borderBottom: `1px solid ${C.textMuted}20`, textDecoration: 'line-through' }}>
              {item}
            </div>
          ))}
        </div>
      </div>

      <div style={{ fontSize: 14, color: C.textSec, marginTop: 32 }}>
        Commands: 5 → 2. Close = Ctrl+C. Update = auto. Share = button.
      </div>
    </div>
  )
}
