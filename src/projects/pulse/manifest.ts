import type { ProjectManifest } from '../../runtime/types'
// V1 imports
import { Dashboard } from './v1/pages/dashboard'
import { Components } from './v1/pages/components'
import { Settings } from './v1/pages/settings'
import { DashLight } from './v1/pages/dash-light'
import { DashDark } from './v1/pages/dash-dark'
import { DashMinimal } from './v1/pages/dash-minimal'
// V2 imports - inspired by context images
import { Dashboard as Dashboard2 } from './v2/pages/dashboard'
import { Components as Components2 } from './v2/pages/components'
import { Settings as Settings2 } from './v2/pages/settings'
import { DashLight as DashLight2 } from './v2/pages/dash-light'
import { DashDark as DashDark2 } from './v2/pages/dash-dark'
import { DashMinimal as DashMinimal2 } from './v2/pages/dash-minimal'
import { DashBold } from './v2/pages/dash-bold'
import { DashCards } from './v2/pages/dash-cards'
import { DashPlanner } from './v2/pages/dash-planner'
import { DashAgencies } from './v2/pages/dash-agencies'

const manifest: ProjectManifest = {
  id: 'ee98420f-a805-4eb6-a5db-8740a8ed8439',
  project: 'pulse',
  iterations: [
    {
      name: 'V1',
      frozen: true,
      pages: [
        {
          name: 'All Directions',
          grid: { columns: 2, columnWidth: 1440, rowHeight: 900, gap: 40 },
          frames: [
            { id: 'v1-dash-light', title: 'Direction A — Light Sidebar', component: DashLight, width: 1440, height: 900 },
            { id: 'v1-dash-dark', title: 'Direction B — Dark Dense', component: DashDark, width: 1440, height: 900 },
            { id: 'v1-dash-minimal', title: 'Direction C — Ultra Minimal', component: DashMinimal, width: 1440, height: 900 },
            { id: 'v1-dashboard-orig', title: 'Direction D — Original', component: Dashboard, width: 1440, height: 900 },
          ],
        },
        {
          name: 'Dashboard',
          grid: { columns: 1, columnWidth: 1440, rowHeight: 900, gap: 40 },
          frames: [
            { id: 'v1-dashboard', title: 'Dashboard — Analytics Overview', component: Dashboard, width: 1440, height: 900 },
          ],
        },
        {
          name: 'Components',
          grid: { columns: 1, columnWidth: 1440, rowHeight: 1200, gap: 40 },
          frames: [
            { id: 'v1-components', title: 'Components — UI Library', component: Components, width: 1440, height: 1200 },
          ],
        },
        {
          name: 'Settings',
          grid: { columns: 1, columnWidth: 1440, rowHeight: 900, gap: 40 },
          frames: [
            { id: 'v1-settings', title: 'Settings — Account Preferences', component: Settings, width: 1440, height: 900 },
          ],
        },
      ],
    },
    {
      name: 'V2',
      description: 'Dashboards inspired by context images: bold B&W typography, dark cards with blue accent',
      frozen: false,
      pages: [
        {
          name: 'All Directions',
          grid: { columns: 2, columnWidth: 1440, rowHeight: 900, gap: 40 },
          frames: [
            { id: 'v2-dash-bold', title: 'Direction E — Bold Contrast', component: DashBold, width: 1440, height: 900 },
            { id: 'v2-dash-cards', title: 'Direction F — Dark Cards', component: DashCards, width: 1440, height: 900 },
            { id: 'v2-dash-planner', title: 'Direction G — Planner Style', component: DashPlanner, width: 1440, height: 900 },
            { id: 'v2-dash-agencies', title: 'Direction H — Agencies', component: DashAgencies, width: 1440, height: 900 },
          ],
        },
        {
          name: 'Dashboard',
          grid: { columns: 1, columnWidth: 1440, rowHeight: 900, gap: 40 },
          frames: [
            { id: 'v2-dashboard', title: 'Dashboard — Analytics Overview', component: Dashboard2, width: 1440, height: 900 },
          ],
        },
        {
          name: 'Components',
          grid: { columns: 1, columnWidth: 1440, rowHeight: 1200, gap: 40 },
          frames: [
            { id: 'v2-components', title: 'Components — UI Library', component: Components2, width: 1440, height: 1200 },
          ],
        },
        {
          name: 'Settings',
          grid: { columns: 1, columnWidth: 1440, rowHeight: 900, gap: 40 },
          frames: [
            { id: 'v2-settings', title: 'Settings — Account Preferences', component: Settings2, width: 1440, height: 900 },
          ],
        },
      ],
    },
  ],
}

export default manifest
