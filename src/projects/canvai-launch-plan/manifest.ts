import './v1/tokens.css'
import './v2/tokens.css'

// V1 - Dark Editorial
import { SlideSummary } from './v1/pages/slide-summary'
import { SlideJtbd } from './v1/pages/slide-jtbd'
import { SlideCompetitors } from './v1/pages/slide-competitors'
import { SlideShipCut } from './v1/pages/slide-ship-cut'
import { SlideTimeline } from './v1/pages/slide-timeline'
import { SlideNaming } from './v1/pages/slide-naming'
import { SlideDocs } from './v1/pages/slide-docs'
import { SlidePolish } from './v1/pages/slide-polish'
import { MasterBoard } from './v1/pages/master-board'

// V2 - Light Style
import { LightSummary } from './v2/pages/light-summary'
import { LightJtbd } from './v2/pages/light-jtbd'
import { LightTimeline } from './v2/pages/light-timeline'
import { LightShipCut } from './v2/pages/light-ship-cut'
import { LightNaming } from './v2/pages/light-naming'
import { LightPolish } from './v2/pages/light-polish'
import { LightMaster } from './v2/pages/light-master'

// V2 - Dark Style
import { DarkSummary } from './v2/pages/dark-summary'
import { DarkJtbd } from './v2/pages/dark-jtbd'
import { DarkTimeline } from './v2/pages/dark-timeline'
import { DarkShipCut } from './v2/pages/dark-ship-cut'
import { DarkNaming } from './v2/pages/dark-naming'
import { DarkPolish } from './v2/pages/dark-polish'
import { DarkMaster } from './v2/pages/dark-master'

// V2 - Minimal Style
import { MinimalVision } from './v2/pages/minimal-vision'
import { MinimalJobs } from './v2/pages/minimal-jobs'
import { MinimalName } from './v2/pages/minimal-name'
import { MinimalTimeline } from './v2/pages/minimal-timeline'
import { MinimalShip } from './v2/pages/minimal-ship'
import { MinimalPolish } from './v2/pages/minimal-polish'
import { MinimalMaster } from './v2/pages/minimal-master'

import type { ProjectManifest } from '../../runtime/types'

const manifest: ProjectManifest = {
  project: 'canvai-launch-plan',
  iterations: [
    {
      name: 'V1',
      description: 'Dark Editorial Style',
      frozen: true,
      pages: [
        {
          name: 'All Slides',
          grid: { columns: 4, columnWidth: 800, rowHeight: 600, gap: 32 },
          frames: [
            { id: 'summary', title: '01 — Vision', component: SlideSummary, width: 800, height: 600 },
            { id: 'jtbd', title: '02 — Jobs to Be Done', component: SlideJtbd, width: 800, height: 600 },
            { id: 'competitors', title: '03 — The Landscape', component: SlideCompetitors, width: 800, height: 600 },
            { id: 'ship-cut', title: '04 — Ship vs Cut', component: SlideShipCut, width: 800, height: 600 },
            { id: 'timeline', title: '05 — Timeline', component: SlideTimeline, width: 800, height: 600 },
            { id: 'naming', title: '06 — Naming', component: SlideNaming, width: 800, height: 600 },
            { id: 'docs', title: '07 — Docs', component: SlideDocs, width: 800, height: 600 },
            { id: 'polish', title: '08 — Polish', component: SlidePolish, width: 800, height: 600 },
            { id: 'master', title: '09 — Master', component: MasterBoard, width: 800, height: 600 },
          ],
        },
      ],
    },
    {
      name: 'V2',
      description: 'Light & Dark with Imagery',
      pages: [
        {
          name: 'Light Style',
          grid: { columns: 4, columnWidth: 800, rowHeight: 600, gap: 32 },
          frames: [
            { id: 'light-summary', title: 'Vision', component: LightSummary, width: 800, height: 600 },
            { id: 'light-jtbd', title: 'Jobs', component: LightJtbd, width: 800, height: 600 },
            { id: 'light-timeline', title: 'Timeline', component: LightTimeline, width: 800, height: 600 },
            { id: 'light-ship', title: 'Ship vs Cut', component: LightShipCut, width: 800, height: 600 },
            { id: 'light-naming', title: 'Naming', component: LightNaming, width: 800, height: 600 },
            { id: 'light-polish', title: 'Polish', component: LightPolish, width: 800, height: 600 },
            { id: 'light-master', title: 'Master', component: LightMaster, width: 800, height: 600 },
          ],
        },
        {
          name: 'Dark Style',
          grid: { columns: 4, columnWidth: 800, rowHeight: 600, gap: 32 },
          frames: [
            { id: 'dark-summary', title: 'Vision', component: DarkSummary, width: 800, height: 600 },
            { id: 'dark-jtbd', title: 'Jobs', component: DarkJtbd, width: 800, height: 600 },
            { id: 'dark-timeline', title: 'Timeline', component: DarkTimeline, width: 800, height: 600 },
            { id: 'dark-ship', title: 'Ship vs Cut', component: DarkShipCut, width: 800, height: 600 },
            { id: 'dark-naming', title: 'Naming', component: DarkNaming, width: 800, height: 600 },
            { id: 'dark-polish', title: 'Polish', component: DarkPolish, width: 800, height: 600 },
            { id: 'dark-master', title: 'Master', component: DarkMaster, width: 800, height: 600 },
          ],
        },
        {
          name: 'Minimal Style',
          grid: { columns: 4, columnWidth: 800, rowHeight: 600, gap: 32 },
          frames: [
            { id: 'minimal-vision', title: 'Vision', component: MinimalVision, width: 800, height: 600 },
            { id: 'minimal-jobs', title: 'Jobs', component: MinimalJobs, width: 800, height: 600 },
            { id: 'minimal-name', title: 'Name', component: MinimalName, width: 800, height: 600 },
            { id: 'minimal-timeline', title: 'Timeline', component: MinimalTimeline, width: 800, height: 600 },
            { id: 'minimal-ship', title: 'Ship vs Cut', component: MinimalShip, width: 800, height: 600 },
            { id: 'minimal-polish', title: 'Polish', component: MinimalPolish, width: 800, height: 600 },
            { id: 'minimal-master', title: 'Master', component: MinimalMaster, width: 800, height: 600 },
          ],
        },
      ],
    },
  ],
}

export default manifest
