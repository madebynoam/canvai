import { ProfileCard } from './ProfileCard'
import type { ProjectManifest } from '../../runtime/types'

const manifest: ProjectManifest = {
  project: 'user-profile',
  iterations: [
    {
      name: 'V1',
      pages: [
        {
          name: 'States',
          grid: { columns: 3, columnWidth: 380, rowHeight: 480, gap: 40 },
          frames: [
            { id: 'profile-complete', title: 'Profile / Complete', component: ProfileCard, props: { variant: 'complete' } },
            { id: 'profile-minimal', title: 'Profile / Minimal', component: ProfileCard, props: { variant: 'minimal' } },
            { id: 'profile-empty', title: 'Profile / Empty', component: ProfileCard, props: { variant: 'empty' } },
          ],
        },
      ],
    },
  ],
}

export default manifest
