/**
 * Slide 2: Jobs to Be Done
 * Dark editorial style
 */

const C = {
  bg: '#141414',
  text: '#FAFAFA',
  textSec: '#A1A1A1',
  textMuted: '#6B6B6B',
}

export function SlideJtbd() {
  const jobs = [
    { name: 'Explore', desc: 'See multiple directions at once', interaction: 'Canvas shows options' },
    { name: 'Iterate', desc: 'Describe changes in words', interaction: 'Click → Type → Applied' },
    { name: 'Decide', desc: 'Grab the file', interaction: 'Cmd+Shift+Click → Finder' },
    { name: 'Share', desc: 'Get feedback', interaction: 'Share button → Link' },
  ]

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: C.bg, fontFamily: 'Inter, -apple-system, sans-serif', padding: 64, display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontSize: 11, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 24 }}>
        02 — Jobs to Be Done
      </div>

      <h1 style={{ fontSize: 44, fontWeight: 300, color: C.text, margin: 0, lineHeight: 1.3 }}>
        What Canvai is hired for.
      </h1>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 32 }}>
        {jobs.map((job, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 24 }}>
            <div style={{ fontSize: 13, color: C.textMuted, width: 80 }}>{job.name}</div>
            <div style={{ fontSize: 18, color: C.text, fontWeight: 400 }}>{job.desc}</div>
            <div style={{ fontSize: 13, color: C.textSec, marginLeft: 'auto', fontFamily: 'monospace' }}>{job.interaction}</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 14, color: C.textSec, marginTop: 48 }}>
        The code was never a mockup. Explore → Decide → Ship.
      </div>
    </div>
  )
}
