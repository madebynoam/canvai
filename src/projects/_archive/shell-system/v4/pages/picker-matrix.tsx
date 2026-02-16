import { Label } from '../components'
import {
  PickerHairline, PickerDots, PickerSegments, PickerPills, PickerNotch,
  PickerStepper, PickerRadio, PickerUnderline, PickerGauge, PickerHash,
} from './pickers'

/**
 * Picker matrix — every variation at 1, 3, and 8 iterations.
 * Tests compression, readability, and edge cases.
 */

const SINGLE = ['V1']
const FEW = ['V1', 'V2', 'V3']
const MANY = ['V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8']

const MONO = 'SF Mono, Monaco, Inconsolata, monospace'

const pickers = [
  { name: 'Hairline', note: 'Ruler + needle + dot', Comp: PickerHairline },
  { name: 'Dots', note: 'Dots on a line, filled = active', Comp: PickerDots },
  { name: 'Segments', note: 'Progress bar, filled to current', Comp: PickerSegments },
  { name: 'Pills', note: 'Rounded tabs, active elevated', Comp: PickerPills },
  { name: 'Notch', note: 'Line + triangle notch below', Comp: PickerNotch },
  { name: 'Stepper', note: 'Arrows + label, no timeline', Comp: PickerStepper },
  { name: 'Radio', note: 'FM tuning needle, accent color', Comp: PickerRadio },
  { name: 'Underline', note: 'Labels only, accent underline', Comp: PickerUnderline },
  { name: 'Gauge', note: 'Semicircle speedometer', Comp: PickerGauge },
  { name: 'Hash', note: 'Film strip + accent indicator', Comp: PickerHash },
]

const states = [
  { label: '1 iter', items: SINGLE, initial: 0 },
  { label: '3 iter', items: FEW, initial: 2 },
  { label: '8 iter', items: MANY, initial: 5 },
]

export function PickerMatrix() {
  return (
    <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Label sub="Each picker at 1, 3, and 8 iterations. Fixed 160px width — density compresses.">
        Iteration Picker — 10 Variations × 3 States
      </Label>

      {/* Header row */}
      <div style={{
        display: 'grid', gridTemplateColumns: '120px 1fr 1fr 1fr',
        gap: 12, padding: '8px 0', borderBottom: '1px solid var(--border)',
      }}>
        <div />
        {states.map(s => (
          <div key={s.label} style={{
            fontSize: 9, fontWeight: 600, color: 'var(--text-tertiary)',
            textTransform: 'uppercase', letterSpacing: '0.06em',
            textWrap: 'pretty',
          } as React.CSSProperties}>{s.label}</div>
        ))}
      </div>

      {/* Picker rows */}
      {pickers.map(({ name, note, Comp }) => (
        <div key={name} style={{
          display: 'grid', gridTemplateColumns: '120px 1fr 1fr 1fr',
          gap: 12, alignItems: 'center',
          padding: '12px 0', borderBottom: '1px solid var(--border-soft)',
        }}>
          {/* Label */}
          <div>
            <div style={{
              fontSize: 11, fontWeight: 600, color: 'var(--text-primary)',
              textWrap: 'pretty',
            } as React.CSSProperties}>{name}</div>
            <div style={{
              fontSize: 9, color: 'var(--text-faint)', fontFamily: MONO,
              textWrap: 'pretty',
            } as React.CSSProperties}>{note}</div>
          </div>
          {/* 3 states */}
          {states.map(s => (
            <div key={s.label} style={{
              display: 'flex', justifyContent: 'center',
              padding: '8px 4px',
              backgroundColor: 'var(--chrome)',
              borderRadius: 8,
              minHeight: 44,
              alignItems: 'center',
            }}>
              <Comp items={s.items} initial={s.initial} />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
