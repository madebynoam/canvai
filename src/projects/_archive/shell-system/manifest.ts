import './v1/tokens.css'
import './v2/tokens.css'
import './v3/tokens.css'
import './v4/tokens.css'

// V1 pages
import { Tokens as V1Tokens } from './v1/pages/tokens'
import { Components as V1Components } from './v1/pages/components'
import { ShellDefault as V1ShellDefault } from './v1/pages/shell-default'
import { PaletteOverview as V1PaletteOverview } from './v1/pages/palette-overview'
// V2 pages (+ carried forward)
import { Tokens as V2Tokens } from './v2/pages/tokens'
import { Components as V2Components } from './v2/pages/components'
import { ShellDefault as V2ShellDefault } from './v2/pages/shell-default'
import { PaletteOverview as V2PaletteOverview } from './v2/pages/palette-overview'
import { ShellRams } from './v2/pages/shell-rams'
import { RamsPalette } from './v2/pages/rams-palette'
// V3 pages (+ carried forward)
import { Tokens as V3Tokens } from './v3/pages/tokens'
import { Components as V3Components } from './v3/pages/components'
import { ShellDefault as V3ShellDefault } from './v3/pages/shell-default'
import { PaletteOverview as V3PaletteOverview } from './v3/pages/palette-overview'
import { ShellRams as V3ShellRams } from './v3/pages/shell-rams'
import { RamsPalette as V3RamsPalette } from './v3/pages/rams-palette'
import { ShellLinear } from './v3/pages/shell-linear'
// V4 pages (+ carried forward)
import { Tokens as V4Tokens } from './v4/pages/tokens'
import { Components as V4Components } from './v4/pages/components'
import { ShellDefault as V4ShellDefault } from './v4/pages/shell-default'
import { PaletteOverview as V4PaletteOverview } from './v4/pages/palette-overview'
import { ShellRams as V4ShellRams } from './v4/pages/shell-rams'
import { RamsPalette as V4RamsPalette } from './v4/pages/rams-palette'
import { ShellLinear as V4ShellLinear } from './v4/pages/shell-linear'
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
          name: 'Tokens',
          grid: { columns: 1, columnWidth: 640, rowHeight: 560, gap: 40 },
          frames: [
            { id: 'v1-tokens', title: 'V1 Token System — Cerulean Accent', component: V1Tokens },
          ],
        },
        {
          name: 'Components',
          grid: { columns: 1, columnWidth: 640, rowHeight: 720, gap: 40 },
          frames: [
            { id: 'v1-components', title: 'V1 Building Blocks', component: V1Components },
          ],
        },
        {
          name: 'Shell Default',
          grid: { columns: 1, columnWidth: 800, rowHeight: 560, gap: 40 },
          frames: [
            { id: 'v1-shell-default', title: 'Shell Assembly — Primitives + CSS Tokens', component: V1ShellDefault },
          ],
        },
        {
          name: 'Palette Overview',
          grid: { columns: 1, columnWidth: 640, rowHeight: 560, gap: 40 },
          frames: [
            { id: 'v1-palette-overview', title: 'OKLCH Color System — Cerulean 400', component: V1PaletteOverview },
          ],
        },
      ],
    },
    {
      name: 'V2',
      frozen: true,
      pages: [
        {
          name: 'Tokens',
          grid: { columns: 1, columnWidth: 640, rowHeight: 560, gap: 40 },
          frames: [
            { id: 'v2-tokens', title: 'V2 Token System — Warm Neutrals + Braun Green', component: V2Tokens },
          ],
        },
        {
          name: 'Components',
          grid: { columns: 1, columnWidth: 640, rowHeight: 720, gap: 40 },
          frames: [
            { id: 'v2-components', title: 'V2 Building Blocks', component: V2Components },
          ],
        },
        {
          name: 'Shell Default',
          grid: { columns: 1, columnWidth: 800, rowHeight: 560, gap: 40 },
          frames: [
            { id: 'v2-shell-default', title: 'Shell Assembly — Primitives + CSS Tokens', component: V2ShellDefault },
          ],
        },
        {
          name: 'Palette Overview',
          grid: { columns: 1, columnWidth: 640, rowHeight: 560, gap: 40 },
          frames: [
            { id: 'v2-palette-overview', title: 'OKLCH Color System — Cerulean 400', component: V2PaletteOverview },
          ],
        },
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
          name: 'Tokens',
          grid: { columns: 1, columnWidth: 640, rowHeight: 560, gap: 40 },
          frames: [
            { id: 'v3-tokens', title: 'V3 Token System — Signal Red + Elevated Canvas', component: V3Tokens },
          ],
        },
        {
          name: 'Components',
          grid: { columns: 1, columnWidth: 640, rowHeight: 720, gap: 40 },
          frames: [
            { id: 'v3-components', title: 'V3 Building Blocks', component: V3Components },
          ],
        },
        {
          name: 'Shell Default',
          grid: { columns: 1, columnWidth: 800, rowHeight: 560, gap: 40 },
          frames: [
            { id: 'v3-shell-default', title: 'Shell Assembly — Primitives + CSS Tokens', component: V3ShellDefault },
          ],
        },
        {
          name: 'Palette Overview',
          grid: { columns: 1, columnWidth: 640, rowHeight: 560, gap: 40 },
          frames: [
            { id: 'v3-palette-overview', title: 'OKLCH Color System — Cerulean 400', component: V3PaletteOverview },
          ],
        },
        {
          name: 'Rams Palette',
          grid: { columns: 1, columnWidth: 640, rowHeight: 720, gap: 40 },
          frames: [
            { id: 'v3-rams-palette', title: 'Rams Accent Candidates — Green / Orange / Red', component: V3RamsPalette },
          ],
        },
        {
          name: 'Shell Rams',
          grid: { columns: 1, columnWidth: 800, rowHeight: 560, gap: 40 },
          frames: [
            { id: 'v3-shell-rams', title: 'Shell Assembly — Warm Neutrals + Braun Green', component: V3ShellRams },
          ],
        },
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
          name: 'Tokens',
          grid: { columns: 1, columnWidth: 640, rowHeight: 560, gap: 40 },
          frames: [
            { id: 'v4-tokens', title: 'V4 Token System — Dial Track + Signal Red', component: V4Tokens },
          ],
        },
        {
          name: 'Components',
          grid: { columns: 1, columnWidth: 640, rowHeight: 720, gap: 40 },
          frames: [
            { id: 'v4-components', title: 'V4 Building Blocks', component: V4Components },
          ],
        },
        {
          name: 'Shell Default',
          grid: { columns: 1, columnWidth: 800, rowHeight: 560, gap: 40 },
          frames: [
            { id: 'v4-shell-default', title: 'Shell Assembly — Primitives + CSS Tokens', component: V4ShellDefault },
          ],
        },
        {
          name: 'Palette Overview',
          grid: { columns: 1, columnWidth: 640, rowHeight: 560, gap: 40 },
          frames: [
            { id: 'v4-palette-overview', title: 'OKLCH Color System — Cerulean 400', component: V4PaletteOverview },
          ],
        },
        {
          name: 'Rams Palette',
          grid: { columns: 1, columnWidth: 640, rowHeight: 720, gap: 40 },
          frames: [
            { id: 'v4-rams-palette', title: 'Rams Accent Candidates — Green / Orange / Red', component: V4RamsPalette },
          ],
        },
        {
          name: 'Shell Rams',
          grid: { columns: 1, columnWidth: 800, rowHeight: 560, gap: 40 },
          frames: [
            { id: 'v4-shell-rams', title: 'Shell Assembly — Warm Neutrals + Braun Green', component: V4ShellRams },
          ],
        },
        {
          name: 'Shell Linear',
          grid: { columns: 1, columnWidth: 840, rowHeight: 560, gap: 40 },
          frames: [
            { id: 'v4-shell-linear', title: 'Shell — Linear Layout, Elevated Canvas', component: V4ShellLinear },
          ],
        },
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
