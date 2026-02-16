import './v1/tokens.css'

import { Tokens } from './v1/pages/tokens'
import { Components } from './v1/pages/components'
import { Shell } from './v1/pages/shell'
import type { ProjectManifest } from '../../runtime/types'

const manifest: ProjectManifest = {
  project: 'canvai-ui-system',
  iterations: [
    {
      name: 'V1',
      frozen: false,
      pages: [
        {
          name: 'Tokens',
          grid: { columns: 1, columnWidth: 560, rowHeight: 1600, gap: 40 },
          frames: [
            { id: 'v1-tokens', title: 'OKLCH Token System', component: Tokens },
          ],
        },
        {
          name: 'Components',
          grid: { columns: 1, columnWidth: 640, rowHeight: 1400, gap: 40 },
          frames: [
            { id: 'v1-components', title: 'Runtime Components — Live', component: Components },
          ],
        },
        {
          name: 'Shell',
          grid: { columns: 1, columnWidth: 900, rowHeight: 900, gap: 40 },
          frames: [
            { id: 'v1-shell', title: 'Full Shell — Assembled', component: Shell },
          ],
        },
      ],
    },
  ],
}

export default manifest
