import { useState } from 'react'
import canvasWide from '../../screenshots/canvas-wide.png'

// ── Cipher — Terminal/command-line aesthetic ───────────────────────────────
// The page looks like terminal output. Monospace throughout. ASCII dividers.
// Feature descriptions as CLI flags. canvai new --directions 5.

const C = {
  bg: 'oklch(0.080 0.005 80)',
  text: 'oklch(0.850 0.003 80)',
  textSec: 'oklch(0.580 0.005 80)',
  textTer: 'oklch(0.420 0.005 80)',
  border: 'oklch(0.180 0.005 80)',
  green: 'oklch(0.700 0.140 145)',
  accent: 'oklch(0.850 0.003 80)',
  onAccent: 'oklch(0.080 0.005 80)',
}

const mono = '"SF Mono", "Fira Code", "Fira Mono", Menlo, monospace'
const spring = 'cubic-bezier(0.34, 1.56, 0.64, 1)'

function useHover() {
  const [h, setH] = useState(false)
  return [h, { onMouseEnter: () => setH(true), onMouseLeave: () => setH(false) }] as const
}
function usePress() {
  const [p, setP] = useState(false)
  return [p, { onMouseDown: () => setP(true), onMouseUp: () => setP(false), onMouseLeave: () => setP(false) }] as const
}

function Line({ prompt, command, output }: { prompt?: string, command?: string, output?: string[] }) {
  return (
    <div style={{ marginBottom: 4 }}>
      {command && (
        <div>
          <span style={{ color: C.green }}>{prompt || '~'}</span>
          <span style={{ color: C.textTer }}> $ </span>
          <span style={{ color: C.text }}>{command}</span>
        </div>
      )}
      {output?.map((line, i) => (
        <div key={i} style={{ color: C.textSec, paddingLeft: 0 }}>{line}</div>
      ))}
    </div>
  )
}

export function Cipher() {
  const [bh, bhB] = useHover()
  const [ba, baB] = usePress()
  const [ph, phB] = useHover()

  return (
    <div style={{
      background: C.bg, minHeight: '100%', overflow: 'auto',
      fontFamily: mono, fontSize: 13, lineHeight: 1.7,
      WebkitFontSmoothing: 'antialiased', color: C.text,
    }}>
      {/* Terminal header */}
      <div style={{
        padding: '16px 64px', borderBottom: `1px solid ${C.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <span style={{ width: 12, height: 12, borderRadius: 6, background: 'oklch(0.650 0.200 30)' }} />
          <span style={{ width: 12, height: 12, borderRadius: 6, background: 'oklch(0.750 0.170 85)' }} />
          <span style={{ width: 12, height: 12, borderRadius: 6, background: 'oklch(0.700 0.140 145)' }} />
        </div>
        <span style={{ fontSize: 12, color: C.textTer }}>canvai — bash — 80×24</span>
      </div>

      {/* Terminal content */}
      <div style={{ padding: '32px 64px', maxWidth: 960 }}>
        {/* Boot sequence */}
        <Line command="canvai --version" output={['canvai v1.0.0']} />
        <div style={{ height: 16 }} />

        {/* ASCII art header */}
        <pre style={{
          color: C.text, fontSize: 11, lineHeight: 1.3, margin: '0 0 24px',
          fontFamily: mono,
        }}>{`
  ╔═══════════════════════════════════════════════╗
  ║                                               ║
  ║   canvai — the canvas for design exploration  ║
  ║                                               ║
  ╚═══════════════════════════════════════════════╝
`}</pre>

        {/* JTBD-driven CLI description */}
        <Line
          command="canvai describe --help"
          output={[
            '',
            'USAGE',
            '  canvai describe <prompt>',
            '',
            'DESCRIPTION',
            '  Describe a UI in plain language. Get five design',
            '  directions on an infinite canvas. Compare them side',
            '  by side instead of scrolling through chat.',
            '',
            'OPTIONS',
            '  --directions   Number of directions (default: 5)',
            '  --canvas       Canvas size (default: infinite)',
            '  --preserve     Keep all versions (default: true)',
            '  --output       Production React (always)',
            '',
          ]}
        />

        <div style={{ height: 16 }} />

        {/* Feature walkthrough as commands */}
        <Line
          prompt="~/my-project"
          command='canvai describe "a dashboard for monitoring deployments"'
          output={[
            '',
            '✓ Generated 5 directions in 4.2s',
            '✓ Canvas ready at http://localhost:5199',
            '✓ Annotation server listening on :3847',
            '',
          ]}
        />

        <Line
          prompt="~/my-project"
          command="canvai status"
          output={[
            '',
            'PROJECT     my-project',
            'ITERATION   v3 (current)',
            'DIRECTIONS  5 active, 12 total',
            'PRESERVED   3 iterations, 0 lost',
            'OUTPUT      production React',
            '',
          ]}
        />

        <div style={{ height: 16 }} />
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16 }} />

        {/* Feature summary as man page */}
        <div style={{ color: C.textSec, marginBottom: 24 }}>
          <div style={{ color: C.text, marginBottom: 8 }}>FEATURES</div>
          <div style={{ paddingLeft: 24 }}>
            <div style={{ marginBottom: 8 }}>
              <span style={{ color: C.green }}>compare</span>
              <span style={{ color: C.textTer }}> — </span>
              <span>Five directions from one prompt. See every</span>
              <br />
              <span style={{ paddingLeft: 0 }}>option on a single surface.</span>
            </div>
            <div style={{ marginBottom: 8 }}>
              <span style={{ color: C.green }}>annotate</span>
              <span style={{ color: C.textTer }}> — </span>
              <span>Click anywhere on a frame. Describe the change.</span>
              <br />
              <span>Code updates while you watch.</span>
            </div>
            <div style={{ marginBottom: 8 }}>
              <span style={{ color: C.green }}>preserve</span>
              <span style={{ color: C.textTer }}> — </span>
              <span>Every iteration frozen. Nothing overwritten.</span>
              <br />
              <span>Branch from any point.</span>
            </div>
            <div>
              <span style={{ color: C.green }}>ship</span>
              <span style={{ color: C.textTer }}> — </span>
              <span>Every frame is production React. Deploy what</span>
              <br />
              <span>you designed.</span>
            </div>
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16, marginBottom: 24 }} />

        {/* Product screenshot */}
        <div style={{ marginBottom: 24 }}>
          <span style={{ color: C.textTer }}>$ # the canvas:</span>
        </div>
      </div>

      <div style={{ padding: '0 64px 32px', maxWidth: 1200 }}>
        <div {...phB} style={{
          borderRadius: 8, overflow: 'hidden', border: `1px solid ${C.border}`,
          transform: ph ? 'translateY(-2px)' : 'translateY(0)',
          transition: `transform 0.3s ${spring}`,
        }}>
          <img src={canvasWide} alt="Bryllen canvas" style={{ width: '100%', display: 'block' }} />
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: '32px 64px 48px', maxWidth: 960 }}>
        <Line
          prompt="~"
          command="npx canvai new my-project && cd my-project && npx canvai design"
          output={['']}
        />
        <div style={{ marginTop: 16 }}>
          <button {...bhB} {...baB} style={{
            border: `1px solid ${C.border}`, cursor: 'default',
            fontFamily: mono, fontWeight: 400, fontSize: 13,
            borderRadius: 4, padding: '8px 24px',
            background: 'transparent', color: C.green,
            transform: ba ? 'scale(0.94)' : bh ? 'scale(1.01)' : 'scale(1)',
            transition: `transform 0.15s ${spring}`,
          }}>→ start designing</button>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 64px', borderTop: `1px solid ${C.border}`,
      }}>
        <span style={{ fontSize: 12, color: C.textTer }}>canvai</span>
        <span style={{ fontSize: 11, color: C.textTer }}>EOF</span>
      </footer>
    </div>
  )
}
