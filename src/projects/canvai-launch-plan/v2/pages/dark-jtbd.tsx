/**
 * Dark Style — Jobs to Be Done
 * Minimal editorial, dark variant
 */

const C = {
  bg: '#0A0A0A',
  text: '#FAFAFA',
  textSec: '#888888',
  textMuted: '#555555',
  border: '#222222',
}

export function DarkJtbd() {
  const jobs = [
    { name: 'Explore', desc: 'See multiple directions at once' },
    { name: 'Iterate', desc: 'Describe changes in words' },
    { name: 'Decide', desc: 'Grab the file you want' },
    { name: 'Share', desc: 'Get feedback instantly' },
  ]

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: C.bg, fontFamily: 'Inter, -apple-system, sans-serif', padding: '80px 64px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 64 }}>
        <div>
          <div style={{ fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 24 }}>
            Jobs to Be Done
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 300, color: C.text, margin: 0, lineHeight: 1.2 }}>
            What Modaio is hired for.
          </h1>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {jobs.map((job, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'baseline',
            padding: '20px 0',
            borderBottom: i < jobs.length - 1 ? `1px solid ${C.border}` : 'none',
          }}>
            <span style={{ fontSize: 10, color: C.textMuted, width: 32 }}>0{i + 1}</span>
            <span style={{ fontSize: 18, fontWeight: 400, color: C.text, width: 120 }}>{job.name}</span>
            <span style={{ fontSize: 14, color: C.textSec }}>{job.desc}</span>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 13, color: C.textSec, marginTop: 48 }}>
        The code was never a mockup. Explore → Decide → Ship.
      </div>
    </div>
  )
}
