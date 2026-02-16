import { useState } from 'react'
import { Label } from '../components'
import { ShellFrame } from './shell-frame'
import { IterationRadio } from './iteration-radio'
import { IterationRadioContained } from './iteration-radio-contained'
import { IterationPills } from './iteration-pills'

/**
 * Finalist comparison — Radio and Pills pickers at 1, 4, 10, 20 iterations.
 * Each is a full interactive shell. Click to change iteration, sidebar updates.
 */

function makeItems(n: number): string[] {
  return Array.from({ length: n }, (_, i) => `V${i + 1}`)
}

const STATES = [1, 4, 10, 20] as const

/* ─── Radio shells ─── */

function RadioShell({ count }: { count: number }) {
  const items = makeItems(count)
  const init = Math.min(count - 1, 2)
  const [iteration, setIteration] = useState(init)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 8 }}>
      <Label sub={`${count} iteration${count === 1 ? '' : 's'} — ${count <= 6 ? 'all labels visible' : 'labels collapse, ticks compress'}`}>
        Radio — {count} iter
      </Label>
      <ShellFrame
        iterations={items}
        iteration={iteration}
        picker={<IterationRadio items={items} initial={init} onChange={setIteration} />}
      />
    </div>
  )
}

export function RadioAt1() { return <RadioShell count={1} /> }
export function RadioAt4() { return <RadioShell count={4} /> }
export function RadioAt10() { return <RadioShell count={10} /> }
export function RadioAt20() { return <RadioShell count={20} /> }

/* ─── Pills shells ─── */

function PillsShell({ count }: { count: number }) {
  const items = makeItems(count)
  const init = Math.min(count - 1, 2)
  const [iteration, setIteration] = useState(init)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 8 }}>
      <Label sub={`${count} iteration${count === 1 ? '' : 's'} — ${count <= 5 ? 'all pills visible' : `window of 4 + arrows + counter`}`}>
        Pills — {count} iter
      </Label>
      <ShellFrame
        iterations={items}
        iteration={iteration}
        picker={<IterationPills items={items} initial={init} onChange={setIteration} />}
      />
    </div>
  )
}

export function PillsAt1() { return <PillsShell count={1} /> }
export function PillsAt4() { return <PillsShell count={4} /> }
export function PillsAt10() { return <PillsShell count={10} /> }
export function PillsAt20() { return <PillsShell count={20} /> }

/* ─── Radio Contained shells — radio inside a pill-shaped container ─── */

function RadioContainedShell({ count }: { count: number }) {
  const items = makeItems(count)
  const init = Math.min(count - 1, 2)
  const [iteration, setIteration] = useState(init)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 8 }}>
      <Label sub={`${count} iteration${count === 1 ? '' : 's'} — radio ruler inside a rounded container like Pills`}>
        Radio Contained — {count} iter
      </Label>
      <ShellFrame
        iterations={items}
        iteration={iteration}
        picker={<IterationRadioContained items={items} initial={init} onChange={setIteration} />}
      />
    </div>
  )
}

export function RadioContainedAt1() { return <RadioContainedShell count={1} /> }
export function RadioContainedAt4() { return <RadioContainedShell count={4} /> }
export function RadioContainedAt10() { return <RadioContainedShell count={10} /> }
export function RadioContainedAt20() { return <RadioContainedShell count={20} /> }
