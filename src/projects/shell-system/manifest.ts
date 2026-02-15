import './primitives/tokens.css'
import './iterations/v1/tokens.css'
import { ShellDefault } from './iterations/v1/shell-default'
import { PaletteOverview } from './iterations/v1/palette-overview'
import type { ProjectManifest } from '../../runtime/types'

const manifest: ProjectManifest = {
  project: 'shell-system',
  iterations: [
    {
      name: 'V1',
      frozen: false,
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
  ],
}

export default manifest
