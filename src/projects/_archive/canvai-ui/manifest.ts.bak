import { AppShellShowcase, TopBarShowcase, ProjectPickerShowcase, IterationSidebarShowcase, AnnotateIdleShowcase, AnnotateTargetingShowcase, AnnotateCommentShowcase, InteractionPlayground } from './V6Showcase'
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
import { CommentPinsPreview, CommentStatesPreview, CommentMenuPreview, CommentAuthPreview } from './CommentThread'
import { CommentAnatomyPreview, CommentCardStatesPreview, CommentAnnotationFlowPreview, CommentPinsAuthPreview } from './CommentThreadV2'
import { AnnotationManageRecommended, AnnotationManageStates, AnnotationManageUndo, AnnotationManageList } from './AnnotationManage'
import { MotionPrinciples, MotionReveals, MotionMicroInteractions } from './MotionLanguage'
import { TokensPalette, TokensTypography } from './SystemTokens'
import { ComponentButtons, ComponentInputs, ComponentMenus } from './SystemComponents'
import { CompositionThread, CompositionAnnotation, CompositionNavigation, CompositionFeedback } from './SystemCompositions'
import { FlowStep1_SignIn, FlowStep2_Compose, FlowStep3_Thread, FlowStep4_Pins, FlowStep5_Promote, FlowStep6_DeepLink, FlowStep7_Resolve } from './CommentFlowV7'
import { FabColorGrid } from './FabColorExploration'
import { OklchNeutrals, OklchHueFamilies, OklchPairs } from './OklchPalettes'
import { V8Palette, V8ShellParts, V8AnnotationParts, V8Comments, V8Assembly } from './SystemV8'
import type { ProjectManifest } from '../../runtime/types'

const manifest: ProjectManifest = {
  project: 'canvai-ui',
  iterations: [
    {
      name: 'V8',
      pages: [
        {
          name: 'Palette',
          grid: { columns: 1, columnWidth: 640, rowHeight: 560, gap: 40 },
          frames: [
            { id: 'v8-palette', title: 'OKLCH Color System — Cerulean 400', component: V8Palette, props: {} },
          ],
        },
        {
          name: 'Shell Parts',
          grid: { columns: 1, columnWidth: 760, rowHeight: 900, gap: 40 },
          frames: [
            { id: 'v8-shell-parts', title: 'Shell — TopBar, Sidebar, ProjectPicker', component: V8ShellParts, props: {} },
          ],
        },
        {
          name: 'Annotation Parts',
          grid: { columns: 1, columnWidth: 760, rowHeight: 900, gap: 40 },
          frames: [
            { id: 'v8-annotation-parts', title: 'Annotations — FAB, Card, Markers, Toast', component: V8AnnotationParts, props: {} },
          ],
        },
        {
          name: 'Comments (Planned)',
          grid: { columns: 1, columnWidth: 1400, rowHeight: 800, gap: 40 },
          frames: [
            { id: 'v8-comments', title: 'Comments System — GitHub-backed (Planned)', component: V8Comments, props: {} },
          ],
        },
        {
          name: 'Assembly',
          grid: { columns: 1, columnWidth: 800, rowHeight: 600, gap: 40 },
          frames: [
            { id: 'v8-assembly', title: 'Full Assembly — Cerulean 400 on Achromatic Shell', component: V8Assembly, props: {} },
          ],
        },
      ],
    },
    {
      name: 'V7',
      pages: [
        {
          name: 'GitHub Comments Flow',
          grid: { columns: 2, columnWidth: 560, rowHeight: 440, gap: 40 },
          frames: [
            { id: 'v7-step1-signin', title: 'Step 1 — Sign In', component: FlowStep1_SignIn, props: {} },
            { id: 'v7-step2-compose', title: 'Step 2 — Target & Compose', component: FlowStep2_Compose, props: {} },
            { id: 'v7-step3-thread', title: 'Step 3 — Thread', component: FlowStep3_Thread, props: {} },
            { id: 'v7-step4-pins', title: 'Step 4 — Pins', component: FlowStep4_Pins, props: {} },
            { id: 'v7-step5-promote', title: 'Step 5 — Promote to Annotation', component: FlowStep5_Promote, props: {} },
            { id: 'v7-step6-deeplink', title: 'Step 6 — Copy Link → Deep Link', component: FlowStep6_DeepLink, props: {} },
            { id: 'v7-step7-resolve', title: 'Step 7 — Resolve', component: FlowStep7_Resolve, props: {} },
          ],
        },
        {
          name: 'FAB Colors',
          grid: { columns: 1, columnWidth: 1600, rowHeight: 1060, gap: 40 },
          frames: [
            { id: 'v7-fab-colors', title: 'FAB Color Exploration — 11 Concepts', component: FabColorGrid, props: {} },
          ],
        },
        {
          name: 'OKLCH Tokens',
          grid: { columns: 1, columnWidth: 1480, rowHeight: 720, gap: 40 },
          frames: [
            { id: 'v7-oklch-neutrals', title: 'Neutral Scales — 6 Hue Tints', component: OklchNeutrals, props: {} },
            { id: 'v7-oklch-hues', title: 'Hue Families — Tints & Roles', component: OklchHueFamilies, props: {} },
          ],
        },
        {
          name: 'OKLCH Color Pairs',
          grid: { columns: 1, columnWidth: 1400, rowHeight: 9000, gap: 40 },
          frames: [
            { id: 'v7-oklch-pairs', title: '33 Color Pairs — In Context', component: OklchPairs, props: {} },
          ],
        },
      ],
    },
    {
      name: 'V6',
      pages: [
        {
          name: 'App Shell',
          grid: { columns: 1, columnWidth: 960, rowHeight: 900, gap: 40 },
          frames: [
            { id: 'v6-app-shell', title: 'Canvai App Shell', component: AppShellShowcase, props: {} },
          ],
        },
        {
          name: 'Components',
          grid: { columns: 3, columnWidth: 520, rowHeight: 640, gap: 40 },
          frames: [
            { id: 'v6-topbar', title: 'TopBar', component: TopBarShowcase, props: {} },
            { id: 'v6-picker', title: 'ProjectPicker', component: ProjectPickerShowcase, props: {} },
            { id: 'v6-sidebar', title: 'Iteration Sidebar', component: IterationSidebarShowcase, props: {} },
          ],
        },
        {
          name: 'Annotation Flow',
          grid: { columns: 3, columnWidth: 420, rowHeight: 700, gap: 40 },
          frames: [
            { id: 'v6-ann-idle', title: 'Annotate', component: AnnotateIdleShowcase, props: {} },
            { id: 'v6-ann-target', title: 'Targeting', component: AnnotateTargetingShowcase, props: {} },
            { id: 'v6-ann-comment', title: 'Commenting', component: AnnotateCommentShowcase, props: {} },
          ],
        },
        {
          name: 'Interaction',
          grid: { columns: 1, columnWidth: 960, rowHeight: 640, gap: 40 },
          frames: [
            { id: 'v6-playground', title: 'Interaction Playground', component: InteractionPlayground, props: {} },
          ],
        },
      ],
    },
    {
      name: 'V5',
      pages: [
        {
          name: 'Tokens',
          grid: { columns: 2, columnWidth: 520, rowHeight: 700, gap: 40 },
          frames: [
            { id: 'v5-palette', title: 'Color Palette', component: TokensPalette, props: {} },
            { id: 'v5-typography', title: 'Type Scale', component: TokensTypography, props: {} },
          ],
        },
        {
          name: 'Structure',
          grid: { columns: 2, columnWidth: 520, rowHeight: 600, gap: 40 },
          frames: [
            { id: 'v5-spacing', title: '4px Spacing Grid', component: SpacingGrid, props: {} },
            { id: 'v5-interactions', title: 'Interaction Tokens', component: InteractionTokens, props: {} },
          ],
        },
        {
          name: 'Components',
          grid: { columns: 3, columnWidth: 420, rowHeight: 720, gap: 40 },
          frames: [
            { id: 'v5-buttons', title: 'Buttons & Controls', component: ComponentButtons, props: {} },
            { id: 'v5-inputs', title: 'Inputs & Fields', component: ComponentInputs, props: {} },
            { id: 'v5-menus', title: 'Menus & Overlays', component: ComponentMenus, props: {} },
          ],
        },
        {
          name: 'Compositions',
          grid: { columns: 2, columnWidth: 520, rowHeight: 800, gap: 40 },
          frames: [
            { id: 'v5-thread', title: 'Comment Thread', component: CompositionThread, props: {} },
            { id: 'v5-annotation', title: 'Annotation Lifecycle', component: CompositionAnnotation, props: {} },
            { id: 'v5-navigation', title: 'Navigation Shell', component: CompositionNavigation, props: {} },
            { id: 'v5-feedback', title: 'Feedback & States', component: CompositionFeedback, props: {} },
          ],
        },
        {
          name: 'Motion',
          grid: { columns: 3, columnWidth: 420, rowHeight: 680, gap: 40 },
          frames: [
            { id: 'v5-motion-principles', title: 'Principles — Rams + Matas', component: MotionPrinciples, props: {} },
            { id: 'v5-motion-reveals', title: 'Reveal & Dismiss', component: MotionReveals, props: {} },
            { id: 'v5-motion-micro', title: 'Micro-interactions', component: MotionMicroInteractions, props: {} },
          ],
        },
      ],
    },
    {
      name: 'V4',
      pages: [
        {
          name: 'Comment Threads Refined',
          grid: { columns: 2, columnWidth: 480, rowHeight: 900, gap: 40 },
          frames: [
            { id: 'comment-anatomy', title: 'Anatomy & Labels', component: CommentAnatomyPreview, props: {} },
            { id: 'comment-card-states', title: 'Card States', component: CommentCardStatesPreview, props: {} },
            { id: 'comment-annotation-flow', title: 'Annotation Promotion Flow', component: CommentAnnotationFlowPreview, props: {} },
            { id: 'comment-pins-auth', title: 'Pins, Auth & FAB', component: CommentPinsAuthPreview, props: {} },
          ],
        },
        {
          name: 'Motion Language',
          grid: { columns: 3, columnWidth: 420, rowHeight: 680, gap: 40 },
          frames: [
            { id: 'motion-principles', title: 'Principles — Rams + Matas', component: MotionPrinciples, props: {} },
            { id: 'motion-reveals', title: 'Reveal & Dismiss', component: MotionReveals, props: {} },
            { id: 'motion-micro', title: 'Micro-interactions', component: MotionMicroInteractions, props: {} },
          ],
        },
        {
          name: 'Annotation Management',
          grid: { columns: 2, columnWidth: 440, rowHeight: 560, gap: 40 },
          frames: [
            { id: 'ann-manage-rec', title: 'Click → Edit Card (Recommended)', component: AnnotationManageRecommended, props: {} },
            { id: 'ann-manage-states', title: 'New vs Saved States', component: AnnotationManageStates, props: {} },
            { id: 'ann-manage-undo', title: 'After Delete — Undo Toast', component: AnnotationManageUndo, props: {} },
            { id: 'ann-manage-list', title: 'List Panel — Bulk Management', component: AnnotationManageList, props: {} },
          ],
        },
      ],
    },
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
          name: 'Comment Threads',
          grid: { columns: 2, columnWidth: 480, rowHeight: 800, gap: 40 },
          frames: [
            { id: 'comment-pins', title: 'Comment Pins', component: CommentPinsPreview, props: {} },
            { id: 'comment-states', title: 'Card States', component: CommentStatesPreview, props: {} },
            { id: 'comment-menu', title: 'Actions & Annotation Promotion', component: CommentMenuPreview, props: {} },
            { id: 'comment-auth', title: 'Auth & Empty States', component: CommentAuthPreview, props: {} },
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
