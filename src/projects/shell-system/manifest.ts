import './v1/tokens.css'
import './v2/tokens.css'
import './v3/tokens.css'
import './v4/tokens.css'

// V1 pages
import { ShellDefault } from './v1/pages/shell-default'
import { PaletteOverview } from './v1/pages/palette-overview'
// V2 pages
import { ShellRams } from './v2/pages/shell-rams'
import { RamsPalette } from './v2/pages/rams-palette'
// V3 pages
import { ShellLinear } from './v3/pages/shell-linear'
// V4 pages
import { PickerMatrix } from './v4/pages/picker-matrix'
import {
  ShellHairline, ShellDots, ShellSegments, ShellPills, ShellNotch,
  ShellStepper, ShellRadio, ShellUnderline, ShellGauge, ShellHash,
} from './v4/pages/shell-explorations'
import {
  RadioAt1, RadioAt4, RadioAt10, RadioAt20,
  PillsAt1, PillsAt4, PillsAt10, PillsAt20,
  RadioContainedAt1, RadioContainedAt4, RadioContainedAt10, RadioContainedAt20,
} from './v4/pages/finalists'
import type { ProjectManifest } from '../../runtime/types'

const manifest: ProjectManifest = {
  project: 'shell-system',
  iterations: [
    {
      name: 'V1',
      frozen: true,
      pages: [
        {
          name: 'Shell Default',
          grid: { columns: 1, columnWidth: 800, rowHeight: 560, gap: 40 },
          frames: [
            { id: 'v1-shell-default', title: 'Shell Assembly — Primitives + CSS Tokens', component: ShellDefault },
          ],
        },
        {
          name: 'Palette Overview',
          grid: { columns: 1, columnWidth: 640, rowHeight: 560, gap: 40 },
          frames: [
            { id: 'v1-palette-overview', title: 'OKLCH Color System — Cerulean 400', component: PaletteOverview },
          ],
        },
      ],
    },
    {
      name: 'V2',
      frozen: true,
      pages: [
        {
          name: 'Rams Palette',
          grid: { columns: 1, columnWidth: 640, rowHeight: 720, gap: 40 },
          frames: [
            { id: 'v2-rams-palette', title: 'Rams Accent Candidates — Green / Orange / Red', component: RamsPalette },
          ],
        },
        {
          name: 'Shell Rams',
          grid: { columns: 1, columnWidth: 800, rowHeight: 560, gap: 40 },
          frames: [
            { id: 'v2-shell-rams', title: 'Shell Assembly — Warm Neutrals + Braun Green', component: ShellRams },
          ],
        },
      ],
    },
    {
      name: 'V3',
      frozen: true,
      pages: [
        {
          name: 'Shell Linear',
          grid: { columns: 1, columnWidth: 840, rowHeight: 560, gap: 40 },
          frames: [
            { id: 'v3-shell-linear', title: 'Shell — Linear Layout, Elevated Canvas', component: ShellLinear },
          ],
        },
      ],
    },
    {
      name: 'V4',
      frozen: false,
      pages: [
        {
          name: 'Picker Matrix',
          grid: { columns: 1, columnWidth: 720, rowHeight: 800, gap: 40 },
          frames: [
            { id: 'v4-picker-matrix', title: '10 Pickers × 3 States (1, 3, 8 Iterations)', component: PickerMatrix },
          ],
        },
        {
          name: 'Shell Explorations',
          grid: { columns: 2, columnWidth: 800, rowHeight: 560, gap: 40 },
          frames: [
            { id: 'v4-shell-hairline', title: '1. Hairline — Ruler + Needle + Dot', component: ShellHairline },
            { id: 'v4-shell-dots', title: '2. Dots — Filled = Active', component: ShellDots },
            { id: 'v4-shell-segments', title: '3. Segments — Progress Bar', component: ShellSegments },
            { id: 'v4-shell-pills', title: '4. Pills — Rounded Tabs', component: ShellPills },
            { id: 'v4-shell-notch', title: '5. Notch — Triangle Indicator', component: ShellNotch },
            { id: 'v4-shell-stepper', title: '6. Stepper — Arrows + Label', component: ShellStepper },
            { id: 'v4-shell-radio', title: '7. Radio — FM Tuning Needle', component: ShellRadio },
            { id: 'v4-shell-underline', title: '8. Underline — Accent Underline', component: ShellUnderline },
            { id: 'v4-shell-gauge', title: '9. Gauge — Speedometer Arc', component: ShellGauge },
            { id: 'v4-shell-hash', title: '10. Hash — Film Strip', component: ShellHash },
          ],
        },
        {
          name: 'Finalists',
          grid: { columns: 4, columnWidth: 320, rowHeight: 280, gap: 24 },
          frames: [
            { id: 'v4-radio-1', title: 'Radio — 1 Iteration', component: RadioAt1 },
            { id: 'v4-radio-4', title: 'Radio — 4 Iterations', component: RadioAt4 },
            { id: 'v4-radio-10', title: 'Radio — 10 Iterations', component: RadioAt10 },
            { id: 'v4-radio-20', title: 'Radio — 20 Iterations', component: RadioAt20 },
            { id: 'v4-pills-1', title: 'Pills — 1 Iteration', component: PillsAt1 },
            { id: 'v4-pills-4', title: 'Pills — 4 Iterations', component: PillsAt4 },
            { id: 'v4-pills-10', title: 'Pills — 10 Iterations', component: PillsAt10 },
            { id: 'v4-pills-20', title: 'Pills — 20 Iterations', component: PillsAt20 },
            { id: 'v4-radio-contained-1', title: 'Radio Contained — 1', component: RadioContainedAt1 },
            { id: 'v4-radio-contained-4', title: 'Radio Contained — 4', component: RadioContainedAt4 },
            { id: 'v4-radio-contained-10', title: 'Radio Contained — 10', component: RadioContainedAt10 },
            { id: 'v4-radio-contained-20', title: 'Radio Contained — 20', component: RadioContainedAt20 },
          ],
        },
      ],
    },
  ],
}

export default manifest
