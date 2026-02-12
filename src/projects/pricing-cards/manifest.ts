import { PricingCard } from './PricingCard'
import type { ProjectManifest } from '../../runtime/types'

const manifest: ProjectManifest = {
  project: 'pricing-cards',
  iterations: [
    {
      name: 'V1',
      pages: [
        {
          name: 'All Tiers',
          grid: { columns: 3, columnWidth: 340, rowHeight: 560, gap: 40 },
          frames: [
            { id: 'pricing-free', title: 'Pricing / Starter', component: PricingCard, props: { tier: 'free' } },
            { id: 'pricing-pro', title: 'Pricing / Pro', component: PricingCard, props: { tier: 'pro', highlighted: true } },
            { id: 'pricing-enterprise', title: 'Pricing / Enterprise', component: PricingCard, props: { tier: 'enterprise' } },
          ],
        },
      ],
    },
  ],
}

export default manifest
