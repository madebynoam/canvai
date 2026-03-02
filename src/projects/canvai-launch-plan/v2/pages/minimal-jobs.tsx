/**
 * Minimal Style — Jobs
 * Based on architectural magazine aesthetic
 */

export function MinimalJobs() {
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#fff', fontFamily: 'Inter, -apple-system, sans-serif', padding: '72px 56px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontSize: 9, color: '#999', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 48 }}>
        Jobs to Be Done
      </div>

      <h1 style={{ fontSize: 28, fontWeight: 300, color: '#1a1a1a', margin: 0, lineHeight: 1.3, marginBottom: 64 }}>
        What Modaio is hired for.
      </h1>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {[
          { num: '01', name: 'Explore', desc: 'See multiple directions at once' },
          { num: '02', name: 'Iterate', desc: 'Describe changes in words' },
          { num: '03', name: 'Decide', desc: 'Grab the file you want' },
          { num: '04', name: 'Share', desc: 'Get feedback instantly' },
        ].map((job, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'baseline', padding: '16px 0', borderBottom: '1px solid #eee' }}>
            <span style={{ fontSize: 9, color: '#bbb', width: 28 }}>{job.num}</span>
            <span style={{ fontSize: 14, color: '#1a1a1a', width: 80 }}>{job.name}</span>
            <span style={{ fontSize: 13, color: '#888' }}>{job.desc}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
