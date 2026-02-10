import { ExpertiseListing } from './ExpertiseListing'
import type { ProjectManifest } from '../../runtime/types'

const manifest: ProjectManifest = {
  project: 'agency-expertise',
  pages: [
    {
      name: 'V1 — All States',
      grid: { columns: 4, columnWidth: 620, rowHeight: 620, gap: 60 },
      frames: [
        { id: 'expertise-not-applied', title: 'Expertise / Not Applied', component: ExpertiseListing, props: { state: 'not-applied' } },
        { id: 'expertise-pending', title: 'Expertise / Pending Review', component: ExpertiseListing, props: { state: 'pending', profileCompletion: 40 } },
        { id: 'expertise-approved-available', title: 'Expertise / Approved / Available', component: ExpertiseListing, props: { state: 'approved', availability: 'available' } },
        { id: 'expertise-approved-unavailable', title: 'Expertise / Approved / Unavailable', component: ExpertiseListing, props: { state: 'approved', availability: 'unavailable' } },
      ],
    },
  ],
}

export default manifest
