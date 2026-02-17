import './v1/tokens.css'

import { Tokens as V1Tokens } from './v1/pages/tokens'
import { Components as V1Components } from './v1/pages/components'
import { Shell as V1Shell } from './v1/pages/shell'
import { Tokens as V2Tokens } from './v2/pages/tokens'
import { Components as V2Components } from './v2/pages/components'
import { Shell as V2Shell } from './v2/pages/shell'
import { Tokens as V3Tokens } from './v3/pages/tokens'
import { Components as V3Components } from './v3/pages/components'
import { Shell as V3Shell } from './v3/pages/shell'
import type { ProjectManifest } from '../../runtime/types'

const manifest: ProjectManifest = {
  project: 'canvai-ui-system',
  iterations: [
    {
      name: 'V1',
      frozen: true,
      pages: [
        {
          name: 'Tokens',
          grid: { columns: 1, columnWidth: 560, rowHeight: 1600, gap: 40 },
          frames: [
            { id: 'v1-tokens', title: 'OKLCH Token System', component: V1Tokens },
          ],
        },
        {
          name: 'Components',
          grid: { columns: 1, columnWidth: 640, rowHeight: 1400, gap: 40 },
          frames: [
            { id: 'v1-components', title: 'Runtime Components — Live', component: V1Components },
          ],
        },
        {
          name: 'Shell',
          grid: { columns: 1, columnWidth: 900, rowHeight: 900, gap: 40 },
          frames: [
            { id: 'v1-shell', title: 'Full Shell — Assembled', component: V1Shell },
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
          grid: { columns: 1, columnWidth: 560, rowHeight: 1600, gap: 40 },
          frames: [
            { id: 'v2-tokens', title: 'OKLCH Token System', component: V2Tokens },
          ],
        },
        {
          name: 'Components',
          grid: { columns: 1, columnWidth: 640, rowHeight: 1800, gap: 40 },
          frames: [
            { id: 'v2-components', title: 'Runtime Components — Live', component: V2Components },
          ],
        },
        {
          name: 'Shell',
          grid: { columns: 1, columnWidth: 900, rowHeight: 900, gap: 40 },
          frames: [
            { id: 'v2-shell', title: 'Full Shell — Assembled', component: V2Shell },
          ],
        },
      ],
    },
    {
      name: 'V3',
      frozen: false,
      pages: [
        {
          name: 'Tokens',
          grid: { columns: 1, columnWidth: 560, rowHeight: 1600, gap: 40 },
          frames: [
            { id: 'v3-tokens', title: 'OKLCH Token System', component: V3Tokens },
          ],
        },
        {
          name: 'Components',
          grid: { columns: 1, columnWidth: 640, rowHeight: 1800, gap: 40 },
          frames: [
            { id: 'v3-components', title: 'Runtime Components — Live', component: V3Components },
          ],
        },
        {
          name: 'Shell',
          grid: { columns: 1, columnWidth: 900, rowHeight: 900, gap: 40 },
          frames: [
            { id: 'v3-shell', title: 'Full Shell — Assembled', component: V3Shell },
          ],
        },
      ],
    },
  ],
}

export default manifest
