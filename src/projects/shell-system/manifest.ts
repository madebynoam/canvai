import './primitives/tokens.css'
import './iterations/v1/tokens.css'
import './iterations/v2/tokens.css'
import './iterations/v3/tokens.css'
import { ShellDefault } from './iterations/v1/shell-default'
import { PaletteOverview } from './iterations/v1/palette-overview'
import { ShellRams } from './iterations/v2/shell-rams'
import { RamsPalette } from './iterations/v2/rams-palette'
import { ShellLinear } from './iterations/v3/shell-linear'
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
      frozen: false,
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
  ],
}

export default manifest
