import './v1/tokens.css'

import { Tokens } from './v1/pages/tokens'
import { Components } from './v1/pages/components'
import { TeamSettings } from './v1/pages/team-settings'
import type { ProjectManifest } from '../../runtime/types'

const manifest: ProjectManifest = {
  project: 'settings-page',
  iterations: [
    {
      name: 'V1',
      frozen: false,
      pages: [
        {
          name: 'Tokens',
          grid: { columns: 1, columnWidth: 640, rowHeight: 640, gap: 40 },
          frames: [
            { id: 'v1-tokens', title: 'V1 Token System — Warm Neutrals + Signal Red', component: Tokens },
          ],
        },
        {
          name: 'Components',
          grid: { columns: 1, columnWidth: 640, rowHeight: 900, gap: 40 },
          frames: [
            { id: 'v1-components', title: 'V1 Building Blocks', component: Components },
          ],
        },
        {
          name: 'Team Settings',
          grid: { columns: 1, columnWidth: 700, rowHeight: 1200, gap: 40 },
          frames: [
            { id: 'v1-team-settings', title: 'Team Settings — Full Page', component: TeamSettings },
          ],
        },
      ],
    },
  ],
}

export default manifest
