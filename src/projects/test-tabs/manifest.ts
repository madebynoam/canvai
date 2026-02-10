import { SegmentedTabs } from './SegmentedTabs'
import type { ProjectManifest } from '../../runtime/types'

const tabs2 = ['Monthly', 'Yearly']
const tabs3 = ['All', 'Active', 'Archived']
const tabs4 = ['Overview', 'Analytics', 'Reports', 'Settings']

const manifest: ProjectManifest = {
  project: 'test-tabs',
  pages: [
    {
      name: 'V1 — Matrix',
      grid: { columns: 3, columnWidth: 320, rowHeight: 60, gap: 40 },
      frames: [
        // Small
        { id: 'tabs-sm-filled', title: 'Tabs / Small / Filled', component: SegmentedTabs, props: { tabs: tabs2, size: 'small', variant: 'filled' } },
        { id: 'tabs-sm-outline', title: 'Tabs / Small / Outline', component: SegmentedTabs, props: { tabs: tabs2, size: 'small', variant: 'outline' } },
        { id: 'tabs-sm-disabled', title: 'Tabs / Small / Disabled', component: SegmentedTabs, props: { tabs: tabs2, size: 'small', disabled: true } },
        // Medium
        { id: 'tabs-md-filled', title: 'Tabs / Medium / Filled', component: SegmentedTabs, props: { tabs: tabs3, size: 'medium', variant: 'filled' } },
        { id: 'tabs-md-outline', title: 'Tabs / Medium / Outline', component: SegmentedTabs, props: { tabs: tabs3, size: 'medium', variant: 'outline' } },
        { id: 'tabs-md-disabled', title: 'Tabs / Medium / Disabled', component: SegmentedTabs, props: { tabs: tabs3, size: 'medium', disabled: true } },
        // Large
        { id: 'tabs-lg-filled', title: 'Tabs / Large / Filled', component: SegmentedTabs, props: { tabs: tabs4, size: 'large', variant: 'filled' } },
        { id: 'tabs-lg-outline', title: 'Tabs / Large / Outline', component: SegmentedTabs, props: { tabs: tabs4, size: 'large', variant: 'outline' } },
        { id: 'tabs-lg-disabled', title: 'Tabs / Large / Disabled', component: SegmentedTabs, props: { tabs: tabs4, size: 'large', disabled: true } },
      ],
    },
  ],
}

export default manifest
