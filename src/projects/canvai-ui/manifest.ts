import { TopBarPreview } from './TopBarPreview'
import { ProjectPickerPreview } from './ProjectPickerPreview'
import { IterationSidebarPreview } from './IterationSidebarPreview'
import { SidebarOptionD, SidebarOptionE, SidebarOptionF, SidebarOptionG, SidebarOptionH, SidebarOptionI, SidebarOptionJ, SidebarOptionK, SidebarOptionL, SidebarOptionM, SidebarOptionN, PickerP1, PickerP2, PickerP3, PickerP4, PickerP5, PickerP6 } from './SidebarExploration'
import { CommentCardPreview, AnnotationElementsPreview } from './AnnotationPreview'
import { ColorPalette } from './ColorPalette'
import { TypeScale } from './TypeScale'
import { ButtonSamples } from './ButtonSamples'
import { RadiusScale } from './RadiusScale'
import { ShadowScale } from './ShadowScale'
import { SpacingGrid, InteractionTokens } from './DesignRules'
import type { ProjectManifest } from '../../runtime/types'

const manifest: ProjectManifest = {
  project: 'canvai-ui',
  iterations: [
    {
      name: 'V3',
      pages: [
        {
          name: 'Sidebar Refined',
          grid: { columns: 3, columnWidth: 440, rowHeight: 400, gap: 40 },
          frames: [
            { id: 'sidebar-opt-d', title: 'D / Clean — Icon + No Count', component: SidebarOptionD, props: {} },
            { id: 'sidebar-opt-e', title: 'E / With "Iterations" Label', component: SidebarOptionE, props: {} },
            { id: 'sidebar-opt-f', title: 'F / Picker in Sidebar', component: SidebarOptionF, props: {} },
            { id: 'sidebar-opt-g', title: 'G / Ultra-Minimal Flat List', component: SidebarOptionG, props: {} },
            { id: 'sidebar-opt-h', title: 'H / Accent Bar on Active', component: SidebarOptionH, props: {} },
            { id: 'sidebar-opt-i', title: 'I / Collapsed Icon Rail', component: SidebarOptionI, props: {} },
            { id: 'sidebar-opt-j', title: 'J / D + Horizontal Separators', component: SidebarOptionJ, props: {} },
            { id: 'sidebar-opt-k', title: 'K / J + Borderless Picker', component: SidebarOptionK, props: {} },
            { id: 'sidebar-opt-l', title: 'L / K + Iterations Header', component: SidebarOptionL, props: {} },
            { id: 'sidebar-opt-m', title: 'M / Linear-Inspired', component: SidebarOptionM, props: {} },
            { id: 'sidebar-opt-n', title: 'N / Micro Chevron Inline', component: SidebarOptionN, props: {} },
          ],
        },
        {
          name: 'Picker Variants',
          grid: { columns: 2, columnWidth: 440, rowHeight: 400, gap: 40 },
          frames: [
            { id: 'picker-p1', title: 'P1 / Text Only — No Icon', component: PickerP1, props: {} },
            { id: 'picker-p2', title: 'P2 / Colored Dot', component: PickerP2, props: {} },
            { id: 'picker-p3', title: 'P3 / Accent First Letter', component: PickerP3, props: {} },
            { id: 'picker-p4', title: 'P4 / Picker in Sidebar (Dot)', component: PickerP4, props: {} },
            { id: 'picker-p5', title: 'P5 / Picker in Sidebar (Letter)', component: PickerP5, props: {} },
            { id: 'picker-p6', title: 'P6 / P4 + Separators', component: PickerP6, props: {} },
          ],
        },
      ],
    },
    {
      name: 'V2',
      pages: [
        {
          name: 'Sidebar Toggle Exploration',
          grid: { columns: 2, columnWidth: 500, rowHeight: 360, gap: 40 },
          frames: [
            { id: 'sidebar-v2-note', title: 'Superseded by V3', component: IterationSidebarPreview, props: { count: 3 } },
          ],
        },
      ],
    },
    {
      name: 'V1',
      pages: [
        {
          name: 'Design System',
          grid: { columns: 2, columnWidth: 600, rowHeight: 500, gap: 60 },
          frames: [
            { id: 'ds-colors', title: 'Colors', component: ColorPalette, props: {} },
            { id: 'ds-type', title: 'Type Scale', component: TypeScale, props: {} },
            { id: 'ds-spacing', title: '4px Spacing Grid', component: SpacingGrid, props: {} },
            { id: 'ds-interactions', title: 'Interaction Tokens & Rules', component: InteractionTokens, props: {} },
            { id: 'ds-buttons', title: 'Buttons & Controls', component: ButtonSamples, props: {} },
            { id: 'ds-radius', title: 'Border Radius', component: RadiusScale, props: {} },
            { id: 'ds-shadows', title: 'Shadows', component: ShadowScale, props: {} },
          ],
        },
        {
          name: 'Components',
          grid: { columns: 2, columnWidth: 760, rowHeight: 100, gap: 40 },
          frames: [
            { id: 'topbar-manual', title: 'TopBar / Manual Mode', component: TopBarPreview, props: { mode: 'manual', pendingCount: 0 } },
            { id: 'topbar-watch', title: 'TopBar / Watch Mode', component: TopBarPreview, props: { mode: 'watch', pendingCount: 3 } },
            { id: 'picker', title: 'ProjectPicker', component: ProjectPickerPreview, props: {} },
          ],
        },
        {
          name: 'Annotation Overlay',
          grid: { columns: 2, columnWidth: 420, rowHeight: 700, gap: 40 },
          frames: [
            { id: 'comment-card', title: 'Comment Card States', component: CommentCardPreview, props: {} },
            { id: 'annotation-elements', title: 'Annotation Elements', component: AnnotationElementsPreview, props: {} },
          ],
        },
        {
          name: 'Sidebar',
          grid: { columns: 2, columnWidth: 500, rowHeight: 360, gap: 40 },
          frames: [
            { id: 'sidebar-3', title: 'Sidebar / 3 Iterations', component: IterationSidebarPreview, props: { count: 3 } },
            { id: 'sidebar-5', title: 'Sidebar / 5 Iterations', component: IterationSidebarPreview, props: { count: 5 } },
          ],
        },
      ],
    },
  ],
}

export default manifest
