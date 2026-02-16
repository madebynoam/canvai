import { Label, Swatch, Toggle, Checkbox } from '../components'

/*
 * Dieter Rams' actual color philosophy:
 *
 * 1. Products should not dominate a room — neutral palette (white, light gray, black, metallic)
 * 2. Color communicates function — a green power light, an orange volume dial, a red stop button
 * 3. Personal color accents belong to the user, not the appliance
 * 4. Timeless means avoiding trendy colors entirely
 *
 * Three accent candidates from real Braun/Vitsœ products:
 * - Braun Green (h=155) — power indicators on SK 4, T 3, ET 66 calculator
 * - Braun Orange (h=55)  — volume/tuning dials on TP 1, SK 4 knob accents
 * - Signal Red (h=28)    — stop/record buttons on TG 60 reel-to-reel
 */

const MONO = 'SF Mono, Monaco, Inconsolata, monospace'

/* Warm neutrals — faint warmth at h=80, c=0.003 */
const W = {
  chrome:     'oklch(0.952 0.003 80)',
  chromeActive: 'oklch(0.935 0.003 80)',
  canvas:     'oklch(0.972 0.003 80)',
  surface:    'oklch(0.993 0.003 80)',
  border:     'oklch(0.895 0.005 80)',
  borderSoft: 'oklch(0.915 0.003 80)',
  txtPri:     'oklch(0.180 0.005 80)',
  txtSec:     'oklch(0.380 0.005 80)',
  txtTer:     'oklch(0.540 0.005 80)',
  txtFaint:   'oklch(0.660 0.003 80)',
}

/* Three accent candidates */
const accents = [
  {
    name: 'Braun Green',
    source: 'SK 4 power light, ET 66 keys',
    hue: 155,
    scale: {
      50:  'oklch(0.96 0.02 155)',
      100: 'oklch(0.92 0.04 155)',
      200: 'oklch(0.85 0.08 155)',
      300: 'oklch(0.72 0.11 155)',
      400: 'oklch(0.58 0.12 155)',
      500: 'oklch(0.52 0.14 155)',
      600: 'oklch(0.46 0.16 155)',
      700: 'oklch(0.38 0.14 155)',
      800: 'oklch(0.30 0.10 155)',
      900: 'oklch(0.22 0.06 155)',
    },
  },
  {
    name: 'Braun Orange',
    source: 'TP 1 dial, SK 4 knobs',
    hue: 55,
    scale: {
      50:  'oklch(0.96 0.03 55)',
      100: 'oklch(0.92 0.06 55)',
      200: 'oklch(0.85 0.10 55)',
      300: 'oklch(0.76 0.14 55)',
      400: 'oklch(0.66 0.16 55)',
      500: 'oklch(0.58 0.18 55)',
      600: 'oklch(0.50 0.16 55)',
      700: 'oklch(0.42 0.14 55)',
      800: 'oklch(0.34 0.10 55)',
      900: 'oklch(0.26 0.06 55)',
    },
  },
  {
    name: 'Signal Red',
    source: 'TG 60 record, RT 20 dial',
    hue: 28,
    scale: {
      50:  'oklch(0.96 0.02 28)',
      100: 'oklch(0.92 0.05 28)',
      200: 'oklch(0.85 0.09 28)',
      300: 'oklch(0.74 0.14 28)',
      400: 'oklch(0.62 0.18 28)',
      500: 'oklch(0.52 0.20 28)',
      600: 'oklch(0.46 0.18 28)',
      700: 'oklch(0.38 0.14 28)',
      800: 'oklch(0.30 0.10 28)',
      900: 'oklch(0.22 0.06 28)',
    },
  },
]

export function RamsPalette() {
  return (
    <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Warm neutrals */}
      <div>
        <Label sub="h=80 (warm stone), c=0.003. Barely perceptible warmth — like aged white plastic on a Braun radio.">Warm Neutrals</Label>
        <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
          <Swatch color={W.surface} label="Surface" value=".993" size={48} />
          <Swatch color={W.canvas} label="Canvas" value=".972" size={48} />
          <Swatch color={W.chrome} label="Chrome" value=".952" size={48} />
          <Swatch color={W.chromeActive} label="Active" value=".935" size={48} />
          <Swatch color={W.borderSoft} label="Bdr Soft" value=".915" size={48} />
          <Swatch color={W.border} label="Border" value=".895" size={48} />
          <Swatch color={W.txtFaint} label="Faint" value=".660" size={48} dark />
          <Swatch color={W.txtTer} label="Tertiary" value=".540" size={48} dark />
          <Swatch color={W.txtSec} label="Secondary" value=".380" size={48} dark />
          <Swatch color={W.txtPri} label="Primary" value=".180" size={48} dark />
        </div>
        <div style={{
          marginTop: 8, fontSize: 9, color: W.txtTer, fontFamily: MONO,
          padding: '4px 8px', borderLeft: `2px solid ${W.border}`,
        }}>
          vs V1: c=0.000 → c=0.003 at h=80. Same lightness steps, faint warmth.
        </div>
      </div>

      {/* Accent candidates */}
      {accents.map((a) => (
        <div key={a.name}>
          <Label sub={`h=${a.hue}. Source: ${a.source}. Color as function indicator, not decoration.`}>{a.name}</Label>
          <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
            {(['50','100','200','300','400','500','600','700','800','900'] as const).map((step) => {
              const color = a.scale[parseInt(step) as keyof typeof a.scale]
              const lc = color.match(/oklch\(([\d.]+)\s+([\d.]+)/)
              const val = lc ? `${lc[1]}/${lc[2]}` : ''
              return (
                <Swatch
                  key={step}
                  color={color}
                  label={step}
                  value={val}
                  size={48}
                  dark={parseInt(step) >= 400}
                />
              )
            })}
          </div>
          {/* Usage preview — accent in context */}
          <div style={{
            marginTop: 12, display: 'flex', gap: 16, alignItems: 'center',
          }}>
            {/* Indicator dot */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '4px 12px', borderRadius: 8,
              backgroundColor: a.scale[50], border: `1px solid ${a.scale[200]}`,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: a.scale[500] }} />
              <span style={{ fontSize: 10, fontWeight: 500, color: a.scale[700] }}>Active</span>
            </div>
            {/* Button */}
            <div style={{
              padding: '6px 16px', borderRadius: 8,
              backgroundColor: a.scale[500], color: '#fff',
              fontSize: 11, fontWeight: 500,
            }}>
              Apply
            </div>
            {/* Badge */}
            <div style={{
              minWidth: 16, height: 16, borderRadius: 8,
              backgroundColor: a.scale[500], color: '#fff',
              fontSize: 9, fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '0 4px',
            }}>
              3
            </div>
            {/* Source note */}
            <span style={{ fontSize: 9, color: W.txtTer, fontStyle: 'italic' }}>
              "{a.source}"
            </span>
          </div>
        </div>
      ))}

      {/* Interactive controls — accent in motion */}
      <div>
        <Label sub="Spring primitives using the active accent token. Toggle and Checkbox respond to var(--accent).">Controls</Label>
        <div style={{
          marginTop: 8, display: 'flex', gap: 24, alignItems: 'flex-start',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Toggle defaultOn={true} />
              <span style={{ fontSize: 10, color: W.txtSec }}>On</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Toggle defaultOn={false} />
              <span style={{ fontSize: 10, color: W.txtSec }}>Off</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Checkbox defaultChecked={true} label="Checked" />
            <Checkbox defaultChecked={false} label="Unchecked" />
          </div>
        </div>
      </div>

      {/* Philosophy note */}
      <div style={{
        padding: 12, borderRadius: 8,
        backgroundColor: W.surface, border: `1px solid ${W.border}`,
      }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: W.txtSec, marginBottom: 4 }}>
          Rams on color
        </div>
        <div style={{
          fontSize: 11, color: W.txtTer, lineHeight: 1.5,
          textWrap: 'pretty',
        } as React.CSSProperties}>
          "I have always been against the use of bright colors at Braun. Personal color accents should be added by the user, not the appliance."
        </div>
      </div>
    </div>
  )
}
