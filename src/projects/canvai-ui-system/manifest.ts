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
import { Tokens as V4Tokens } from './v4/pages/tokens'
import { Components as V4Components } from './v4/pages/components'
import { Shell as V4Shell } from './v4/pages/shell'
import './v5/tokens.css'
import { Tokens as V5Tokens } from './v5/pages/tokens'
import { Components as V5Components } from './v5/pages/components'
import { Shell as V5Shell } from './v5/pages/shell'
import './v6/tokens.css'
import { Tokens as V6Tokens } from './v6/pages/tokens'
import { Components as V6Components } from './v6/pages/components'
import { Shell as V6Shell } from './v6/pages/shell'
import './v7/tokens.css'
import { Tokens as V7Tokens } from './v7/pages/tokens'
import { Components as V7Components } from './v7/pages/components'
import { Shell as V7Shell } from './v7/pages/shell'
import { FlowStep1_SignIn, FlowStep2_Compose, FlowStep3_Thread, FlowStep4_Pins, FlowStep5_Promote, FlowStep6_DeepLink, FlowStep7_Resolve } from './v7/pages/comments'
import './v8/tokens.css'
import { Tokens as V8Tokens } from './v8/pages/tokens'
import { Components as V8Components } from './v8/pages/components'
import { Shell as V8Shell } from './v8/pages/shell'
import { FlowStep1_SignIn as V8FlowStep1, FlowStep2_Compose as V8FlowStep2, FlowStep3_Thread as V8FlowStep3, FlowStep4_Pins as V8FlowStep4, FlowStep5_Promote as V8FlowStep5, FlowStep6_DeepLink as V8FlowStep6, FlowStep7_Resolve as V8FlowStep7 } from './v8/pages/comments'
import { AnnotationPanelInteractive, AnnotationPanelEmpty, AnnotationPanelResolved } from './v8/pages/annotation-panel'
import './v9/tokens.css'
import { Tokens as V9Tokens } from './v9/pages/tokens'
import { Components as V9Components } from './v9/pages/components'
import { Shell as V9Shell } from './v9/pages/shell'
import { FlowStep1_SignIn as V9FlowStep1, FlowStep2_Compose as V9FlowStep2, FlowStep3_Thread as V9FlowStep3, FlowStep4_Pins as V9FlowStep4, FlowStep5_Promote as V9FlowStep5, FlowStep6_DeepLink as V9FlowStep6, FlowStep7_Resolve as V9FlowStep7 } from './v9/pages/comments'
import { AnnotationPanelInteractive as V9AnnotationPanelInteractive, AnnotationPanelEmpty as V9AnnotationPanelEmpty, AnnotationPanelResolved as V9AnnotationPanelResolved } from './v9/pages/annotation-panel'
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
      frozen: true,
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
    {
      name: 'V4',
      frozen: true,
      pages: [
        {
          name: 'Tokens',
          grid: { columns: 1, columnWidth: 560, rowHeight: 1600, gap: 40 },
          frames: [
            { id: 'v4-tokens', title: 'OKLCH Token System', component: V4Tokens },
          ],
        },
        {
          name: 'Components',
          grid: { columns: 1, columnWidth: 640, rowHeight: 1800, gap: 40 },
          frames: [
            { id: 'v4-components', title: 'Runtime Components — Live', component: V4Components },
          ],
        },
        {
          name: 'Shell',
          grid: { columns: 1, columnWidth: 900, rowHeight: 900, gap: 40 },
          frames: [
            { id: 'v4-shell', title: 'Full Shell — Assembled', component: V4Shell },
          ],
        },
      ],
    },
    {
      name: 'V5',
      frozen: true,
      pages: [
        {
          name: 'Tokens',
          grid: { columns: 1, columnWidth: 560, rowHeight: 1600, gap: 40 },
          frames: [
            { id: 'v5-tokens', title: 'OKLCH Token System', component: V5Tokens },
          ],
        },
        {
          name: 'Components',
          grid: { columns: 1, columnWidth: 640, rowHeight: 1800, gap: 40 },
          frames: [
            { id: 'v5-components', title: 'Runtime Components — Live', component: V5Components },
          ],
        },
        {
          name: 'Shell',
          grid: { columns: 1, columnWidth: 900, rowHeight: 900, gap: 40 },
          frames: [
            { id: 'v5-shell', title: 'Full Shell — Assembled', component: V5Shell },
          ],
        },
      ],
    },
    {
      name: 'V6',
      frozen: true,
      pages: [
        {
          name: 'Tokens',
          grid: { columns: 1, columnWidth: 560, rowHeight: 1600, gap: 40 },
          frames: [
            { id: 'v6-tokens', title: 'OKLCH Token System', component: V6Tokens },
          ],
        },
        {
          name: 'Components',
          grid: { columns: 1, columnWidth: 640, rowHeight: 2400, gap: 40 },
          frames: [
            { id: 'v6-components', title: 'Runtime Components — Live', component: V6Components },
          ],
        },
        {
          name: 'Shell',
          grid: { columns: 1, columnWidth: 900, rowHeight: 1200, gap: 40 },
          frames: [
            { id: 'v6-shell', title: 'Shell — Layout Options', component: V6Shell },
          ],
        },
      ],
    },
    {
      name: 'V7',
      frozen: true,
      pages: [
        {
          name: 'Tokens',
          grid: { columns: 1, columnWidth: 560, rowHeight: 1600, gap: 40 },
          frames: [
            { id: 'v7-tokens', title: 'OKLCH Token System', component: V7Tokens },
          ],
        },
        {
          name: 'Components',
          grid: { columns: 1, columnWidth: 640, rowHeight: 2400, gap: 40 },
          frames: [
            { id: 'v7-components', title: 'Runtime Components — Live', component: V7Components },
          ],
        },
        {
          name: 'Shell',
          grid: { columns: 1, columnWidth: 900, rowHeight: 1200, gap: 40 },
          frames: [
            { id: 'v7-shell', title: 'Shell — Layout Options', component: V7Shell },
          ],
        },
        {
          name: 'GitHub Comments Flow',
          grid: { columns: 2, columnWidth: 560, rowHeight: 440, gap: 40 },
          frames: [
            { id: 'v7-step1-signin', title: 'Step 1 — Sign In', component: FlowStep1_SignIn },
            { id: 'v7-step2-compose', title: 'Step 2 — Target & Compose', component: FlowStep2_Compose },
            { id: 'v7-step3-thread', title: 'Step 3 — Thread', component: FlowStep3_Thread },
            { id: 'v7-step4-pins', title: 'Step 4 — Pins', component: FlowStep4_Pins },
            { id: 'v7-step5-promote', title: 'Step 5 — Promote to Annotation', component: FlowStep5_Promote },
            { id: 'v7-step6-deeplink', title: 'Step 6 — Copy Link → Deep Link', component: FlowStep6_DeepLink },
            { id: 'v7-step7-resolve', title: 'Step 7 — Resolve', component: FlowStep7_Resolve },
          ],
        },
      ],
    },
    {
      name: 'V8',
      frozen: true,
      pages: [
        {
          name: 'Tokens',
          grid: { columns: 1, columnWidth: 560, rowHeight: 1600, gap: 40 },
          frames: [
            { id: 'v8-tokens', title: 'OKLCH Token System', component: V8Tokens },
          ],
        },
        {
          name: 'Components',
          grid: { columns: 1, columnWidth: 640, rowHeight: 2400, gap: 40 },
          frames: [
            { id: 'v8-components', title: 'Runtime Components — Live', component: V8Components },
          ],
        },
        {
          name: 'Shell',
          grid: { columns: 1, columnWidth: 900, rowHeight: 1200, gap: 40 },
          frames: [
            { id: 'v8-shell', title: 'Shell — Layout Options', component: V8Shell },
          ],
        },
        {
          name: 'GitHub Comments Flow',
          grid: { columns: 2, columnWidth: 560, rowHeight: 440, gap: 40 },
          frames: [
            { id: 'v8-step1-signin', title: 'Step 1 — Sign In', component: V8FlowStep1 },
            { id: 'v8-step2-compose', title: 'Step 2 — Target & Compose', component: V8FlowStep2 },
            { id: 'v8-step3-thread', title: 'Step 3 — Thread', component: V8FlowStep3 },
            { id: 'v8-step4-pins', title: 'Step 4 — Pins', component: V8FlowStep4 },
            { id: 'v8-step5-promote', title: 'Step 5 — Promote to Annotation', component: V8FlowStep5 },
            { id: 'v8-step6-deeplink', title: 'Step 6 — Copy Link → Deep Link', component: V8FlowStep6 },
            { id: 'v8-step7-resolve', title: 'Step 7 — Resolve', component: V8FlowStep7 },
          ],
        },
        {
          name: 'Annotation Panel',
          grid: { columns: 1, columnWidth: 480, rowHeight: 600, gap: 40 },
          frames: [
            { id: 'v8-annot-interactive', title: 'Annotation Panel — Interactive', component: AnnotationPanelInteractive },
            { id: 'v8-annot-empty', title: 'Annotation Panel — Empty State', component: AnnotationPanelEmpty },
            { id: 'v8-annot-resolved', title: 'Annotation Panel — All Resolved', component: AnnotationPanelResolved },
          ],
        },
      ],
    },
    {
      name: 'V9',
      frozen: false,
      pages: [
        {
          name: 'Tokens',
          grid: { columns: 1, columnWidth: 560, rowHeight: 1600, gap: 40 },
          frames: [
            { id: 'v9-tokens', title: 'OKLCH Token System — Dark', component: V9Tokens },
          ],
        },
        {
          name: 'Components',
          grid: { columns: 1, columnWidth: 640, rowHeight: 2400, gap: 40 },
          frames: [
            { id: 'v9-components', title: 'Runtime Components — Dark', component: V9Components },
          ],
        },
        {
          name: 'Shell',
          grid: { columns: 1, columnWidth: 1400, rowHeight: 600, gap: 40 },
          frames: [
            { id: 'v9-shell', title: 'Shell — Dark vs Light', component: V9Shell },
          ],
        },
        {
          name: 'GitHub Comments Flow',
          grid: { columns: 2, columnWidth: 560, rowHeight: 440, gap: 40 },
          frames: [
            { id: 'v9-step1-signin', title: 'Step 1 — Sign In', component: V9FlowStep1 },
            { id: 'v9-step2-compose', title: 'Step 2 — Target & Compose', component: V9FlowStep2 },
            { id: 'v9-step3-thread', title: 'Step 3 — Thread', component: V9FlowStep3 },
            { id: 'v9-step4-pins', title: 'Step 4 — Pins', component: V9FlowStep4 },
            { id: 'v9-step5-promote', title: 'Step 5 — Promote to Annotation', component: V9FlowStep5 },
            { id: 'v9-step6-deeplink', title: 'Step 6 — Copy Link → Deep Link', component: V9FlowStep6 },
            { id: 'v9-step7-resolve', title: 'Step 7 — Resolve', component: V9FlowStep7 },
          ],
        },
        {
          name: 'Annotation Panel',
          grid: { columns: 1, columnWidth: 480, rowHeight: 600, gap: 40 },
          frames: [
            { id: 'v9-annot-interactive', title: 'Annotation Panel — Interactive', component: V9AnnotationPanelInteractive },
            { id: 'v9-annot-empty', title: 'Annotation Panel — Empty State', component: V9AnnotationPanelEmpty },
            { id: 'v9-annot-resolved', title: 'Annotation Panel — All Resolved', component: V9AnnotationPanelResolved },
          ],
        },
      ],
    },
  ],
}

export default manifest
