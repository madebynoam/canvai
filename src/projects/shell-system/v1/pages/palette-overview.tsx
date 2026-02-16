import { Label, Swatch } from '../components'

/* OKLCH values mirroring the CSS custom properties in tokens.css */
const N = {
  chrome:     'oklch(0.955 0 0)',
  chromeActive: 'oklch(0.940 0 0)',
  canvas:     'oklch(0.975 0 0)',
  surface:    'oklch(0.995 0 0)',
  border:     'oklch(0.900 0 0)',
  borderSoft: 'oklch(0.920 0 0)',
  txtPri:     'oklch(0.200 0 0)',
  txtSec:     'oklch(0.400 0 0)',
  txtTer:     'oklch(0.560 0 0)',
  txtFaint:   'oklch(0.680 0 0)',
}

const A = {
  50:  'oklch(0.97 0.02 235)',
  100: 'oklch(0.93 0.05 235)',
  200: 'oklch(0.87 0.10 235)',
  300: 'oklch(0.78 0.14 235)',
  400: 'oklch(0.68 0.18 235)',
  500: 'oklch(0.58 0.20 235)',
  600: 'oklch(0.52 0.19 235)',
  700: 'oklch(0.44 0.17 235)',
  800: 'oklch(0.36 0.14 235)',
  900: 'oklch(0.28 0.10 235)',
}

const MONO = 'SF Mono, Monaco, Inconsolata, monospace'

/** OKLCH palette display using Swatch primitive — shows neutral + accent scales. */
export function PaletteOverview() {
  return (
    <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Neutral scale */}
      <div>
        <Label sub="c=0 at every step. Pure perceptual gray. The shell material.">Achromatic Neutrals</Label>
        <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
          <Swatch color={N.surface} label="Surface" value=".995" size={48} />
          <Swatch color={N.canvas} label="Canvas" value=".975" size={48} />
          <Swatch color={N.chrome} label="Chrome" value=".955" size={48} />
          <Swatch color={N.chromeActive} label="Active" value=".940" size={48} />
          <Swatch color={N.borderSoft} label="Bdr Soft" value=".920" size={48} />
          <Swatch color={N.border} label="Border" value=".900" size={48} />
          <Swatch color={N.txtFaint} label="Faint" value=".680" size={48} dark />
          <Swatch color={N.txtTer} label="Tertiary" value=".560" size={48} dark />
          <Swatch color={N.txtSec} label="Secondary" value=".400" size={48} dark />
          <Swatch color={N.txtPri} label="Primary" value=".200" size={48} dark />
        </div>
      </div>

      {/* Cerulean accent scale */}
      <div>
        <Label sub="h=235. The one color. Like an indicator light on a Braun radio.">Cerulean Accent Scale</Label>
        <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
          {([
            ['50', A[50], '.97/.02'], ['100', A[100], '.93/.05'], ['200', A[200], '.87/.10'],
            ['300', A[300], '.78/.14'], ['400', A[400], '.68/.18'], ['500', A[500], '.58/.20'],
            ['600', A[600], '.52/.19'], ['700', A[700], '.44/.17'], ['800', A[800], '.36/.14'],
            ['900', A[900], '.28/.10'],
          ] as [string, string, string][]).map(([name, color, val]) => (
            <Swatch key={name} color={color} label={name} value={val} size={48} dark={parseInt(name) >= 400} />
          ))}
        </div>
        <div style={{
          marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '4px 12px', borderRadius: 8, backgroundColor: A[50],
          border: `1px solid ${A[200]}`,
        }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: A[400] }} />
          <span style={{ fontSize: 10, fontWeight: 600, color: A[700] }}>
            400 = Primary accent
          </span>
          <span style={{ fontSize: 9, color: A[600], fontFamily: MONO }}>oklch(0.68 0.18 235)</span>
        </div>
      </div>

      {/* Surface depth demo */}
      <div>
        <Label sub="Three depth levels. Chrome → Canvas → Surface. Achromatic lightness steps.">Surface Depth</Label>
        <div style={{
          marginTop: 8, display: 'flex', gap: 0, borderRadius: 12, overflow: 'hidden',
          border: '1px solid var(--border)', width: 480, height: 120,
        }}>
          <div style={{
            width: 120, backgroundColor: 'var(--chrome)', padding: 12,
            borderRight: '1px solid var(--border)',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
          }}>
            <span style={{ fontSize: 8, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Chrome</span>
            <span style={{ fontSize: 9, color: 'var(--text-faint)', fontFamily: MONO }}>L=0.955</span>
          </div>
          <div style={{
            flex: 1, backgroundColor: 'var(--canvas-bg)', padding: 16,
            display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 8, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Canvas</span>
              <span style={{ fontSize: 9, color: 'var(--text-faint)', fontFamily: MONO }}>L=0.975</span>
            </div>
            <div style={{
              backgroundColor: 'var(--surface)', borderRadius: 8, padding: 12,
              border: '1px solid var(--border-soft)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 8, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Surface</span>
                <span style={{ fontSize: 9, color: 'var(--text-faint)', fontFamily: MONO }}>L=0.995</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
