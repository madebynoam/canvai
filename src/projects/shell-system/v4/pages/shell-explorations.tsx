import { useState } from 'react'
import { Label } from '../components'
import { ShellFrame } from './shell-frame'
import {
  PickerHairline, PickerDots, PickerSegments, PickerPills, PickerNotch,
  PickerStepper, PickerRadio, PickerUnderline, PickerGauge, PickerHash,
} from './pickers'

/**
 * 10 shell explorations — one per picker variation.
 * Each is a full interactive shell with sidebar that updates on picker change.
 */

const ITERATIONS = ['V1', 'V2', 'V3']

function useShellState() {
  const [iteration, setIteration] = useState(2)
  return { iteration, setIteration, iterations: ITERATIONS }
}

/* 1. Hairline — ruler + needle + dot */
export function ShellHairline() {
  const { iteration, setIteration, iterations } = useShellState()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 8 }}>
      <Label sub="Ruler + needle + dot. Fine tick marks, major ticks at iteration positions.">
        1. Hairline
      </Label>
      <ShellFrame
        iterations={iterations} iteration={iteration}
        picker={<PickerHairline items={iterations} initial={2} onChange={setIteration} />}
      />
    </div>
  )
}

/* 2. Dots — dots on a line, filled = active */
export function ShellDots() {
  const { iteration, setIteration, iterations } = useShellState()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 8 }}>
      <Label sub="Dots on a line. Active dot grows and fills. Click to switch.">
        2. Dots
      </Label>
      <ShellFrame
        iterations={iterations} iteration={iteration}
        picker={<PickerDots items={iterations} initial={2} onChange={setIteration} />}
      />
    </div>
  )
}

/* 3. Segments — thin progress bar divided into segments */
export function ShellSegments() {
  const { iteration, setIteration, iterations } = useShellState()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 8 }}>
      <Label sub="Progress bar divided into segments. Filled up to the active iteration.">
        3. Segments
      </Label>
      <ShellFrame
        iterations={iterations} iteration={iteration}
        picker={<PickerSegments items={iterations} initial={2} onChange={setIteration} />}
      />
    </div>
  )
}

/* 4. Pills — small rounded tabs */
export function ShellPills() {
  const { iteration, setIteration, iterations } = useShellState()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 8 }}>
      <Label sub="Rounded pill tabs. Active pill gets elevated surface + shadow.">
        4. Pills
      </Label>
      <ShellFrame
        iterations={iterations} iteration={iteration}
        picker={<PickerPills items={iterations} initial={2} onChange={setIteration} />}
      />
    </div>
  )
}

/* 5. Notch — line with triangle notch below */
export function ShellNotch() {
  const { iteration, setIteration, iterations } = useShellState()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 8 }}>
      <Label sub="Thin line with triangle notch indicator below. Spring-animated position.">
        5. Notch
      </Label>
      <ShellFrame
        iterations={iterations} iteration={iteration}
        picker={<PickerNotch items={iterations} initial={2} onChange={setIteration} />}
      />
    </div>
  )
}

/* 6. Stepper — arrows + label, no timeline */
export function ShellStepper() {
  const { iteration, setIteration, iterations } = useShellState()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 8 }}>
      <Label sub="Chevron arrows + label + counter. No timeline — just prev/next.">
        6. Stepper
      </Label>
      <ShellFrame
        iterations={iterations} iteration={iteration}
        picker={<PickerStepper items={iterations} initial={2} onChange={setIteration} />}
      />
    </div>
  )
}

/* 7. Radio — FM tuning needle, accent color */
export function ShellRadio() {
  const { iteration, setIteration, iterations } = useShellState()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 8 }}>
      <Label sub="FM tuning style. Accent-colored needle slides between tick marks.">
        7. Radio
      </Label>
      <ShellFrame
        iterations={iterations} iteration={iteration}
        picker={<PickerRadio items={iterations} initial={2} onChange={setIteration} />}
      />
    </div>
  )
}

/* 8. Underline — labels only, accent underline */
export function ShellUnderline() {
  const { iteration, setIteration, iterations } = useShellState()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 8 }}>
      <Label sub="Labels only. Active gets accent underline. Minimal, no chrome.">
        8. Underline
      </Label>
      <ShellFrame
        iterations={iterations} iteration={iteration}
        picker={<PickerUnderline items={iterations} initial={2} onChange={setIteration} />}
      />
    </div>
  )
}

/* 9. Gauge — semicircle speedometer */
export function ShellGauge() {
  const { iteration, setIteration, iterations } = useShellState()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 8 }}>
      <Label sub="Semicircle arc with rotating needle. Speedometer / instrument gauge.">
        9. Gauge
      </Label>
      <ShellFrame
        iterations={iterations} iteration={iteration}
        picker={<PickerGauge items={iterations} initial={2} onChange={setIteration} />}
      />
    </div>
  )
}

/* 10. Hash — film strip edge + accent indicator */
export function ShellHash() {
  const { iteration, setIteration, iterations } = useShellState()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 8 }}>
      <Label sub="Film strip hash marks between two lines. Accent indicator slides.">
        10. Hash
      </Label>
      <ShellFrame
        iterations={iterations} iteration={iteration}
        picker={<PickerHash items={iterations} initial={2} onChange={setIteration} />}
      />
    </div>
  )
}
