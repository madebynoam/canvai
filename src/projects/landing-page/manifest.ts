import './v1/tokens.css'

import { Noir } from './v1/pages/noir'
import { Aurora } from './v1/pages/aurora'
import { CanvasLP } from './v1/pages/canvas-lp'
import { Bento } from './v1/pages/bento'
import { Shift } from './v1/pages/shift'
import { Mono } from './v2/pages/mono'
import { Prism } from './v2/pages/prism'
import { Grid } from './v2/pages/grid'
import { Type } from './v2/pages/type'
import { Vapor } from './v2/pages/vapor'
import { Silk } from './v3/pages/silk'
import { Kinetic } from './v3/pages/kinetic'
import { Terrain } from './v3/pages/terrain'
import { Crystalline } from './v3/pages/crystalline'
import { Brutalist } from './v3/pages/brutalist'
import { Solstice } from './v3/pages/solstice'
import { Edition } from './v4/pages/edition'
import { Signal } from './v4/pages/signal'
import { Form } from './v4/pages/form'
import { Object_ } from './v4/pages/object'
import { Index } from './v4/pages/index_'
import { Clearance } from './v5/pages/clearance'
import { Ledger } from './v5/pages/ledger'
import { Inversion } from './v5/pages/inversion'
import { Split } from './v5/pages/split'
import { Tabular } from './v5/pages/tabular'
import { Drift } from './v6/pages/drift'
import { Lumen } from './v6/pages/lumen'
import { Meridian } from './v6/pages/meridian'
import { Threshold } from './v6/pages/threshold'
import { Flux } from './v6/pages/flux'
import { Parallel } from './v6/pages/parallel'
import { Zenith } from './v6/pages/zenith'
import { Carbon } from './v6/pages/carbon'
import { Aperture } from './v6/pages/aperture'
import { Harmonic } from './v6/pages/harmonic'
// V7 — Rams × Brockmann × Vercel
import { Specimen } from './v7/pages/specimen'
import { Raster } from './v7/pages/raster'
import { Folio } from './v7/pages/folio'
import { Datum } from './v7/pages/datum'
import { Plinth } from './v7/pages/plinth'
import { Tract } from './v7/pages/tract'
import { Axis } from './v7/pages/axis'
import { Void } from './v7/pages/void_'
import { Codex } from './v7/pages/codex'
import { Gauge } from './v7/pages/gauge'
import { Plank } from './v7/pages/plank'
import { Verso } from './v7/pages/verso'
import { Module } from './v7/pages/module'
import { Proof } from './v7/pages/proof'
import { Cipher } from './v7/pages/cipher'
import { Narrative } from './v7/pages/narrative'
import { Statement } from './v7/pages/statement'
import { Vision } from './v7/pages/vision'
import { FyllaLight } from './v7/pages/fylla-light'
import { FyllaDark } from './v7/pages/fylla-dark'
import { Studio } from './v7/pages/studio'
import { Atelier } from './v7/pages/atelier'
import { Werkstatt } from './v7/pages/werkstatt'
import { Playful } from './v7/pages/playful'
import { Palette } from './v7/pages/palette'
import { Mosaic } from './v7/pages/mosaic'
// V8 — Bryllen rebrand (all pages updated with new name)
import { Specimen as Specimen8 } from './v8/pages/specimen'
import { Raster as Raster8 } from './v8/pages/raster'
import { Folio as Folio8 } from './v8/pages/folio'
import { Datum as Datum8 } from './v8/pages/datum'
import { Plinth as Plinth8 } from './v8/pages/plinth'
import { Tract as Tract8 } from './v8/pages/tract'
import { Axis as Axis8 } from './v8/pages/axis'
import { Void as Void8 } from './v8/pages/void_'
import { Codex as Codex8 } from './v8/pages/codex'
import { CodexReference } from './v8/pages/codex-reference'
import { CodexTerminal } from './v8/pages/codex-terminal'
import { CodexGallery } from './v8/pages/codex-gallery'
import { DocsManual } from './v8/pages/docs-manual'
import { DocsTerminal } from './v8/pages/docs-terminal'
import { DocsGuide } from './v8/pages/docs-guide'
import { Pulse } from './v8/pages/pulse'
import { Slate } from './v8/pages/slate'
import { Ivory } from './v8/pages/ivory'
import { Neon } from './v8/pages/neon'
import { Block } from './v8/pages/block'
import { Gauge as Gauge8 } from './v8/pages/gauge'
import { Plank as Plank8 } from './v8/pages/plank'
import { Verso as Verso8 } from './v8/pages/verso'
import { Module as Module8 } from './v8/pages/module'
import { Proof as Proof8 } from './v8/pages/proof'
import { Cipher as Cipher8 } from './v8/pages/cipher'
import { Narrative as Narrative8 } from './v8/pages/narrative'
import { Statement as Statement8 } from './v8/pages/statement'
import { Vision as Vision8 } from './v8/pages/vision'
import { FyllaLight as FyllaLight8 } from './v8/pages/fylla-light'
import { FyllaDark as FyllaDark8 } from './v8/pages/fylla-dark'
import { Studio as Studio8 } from './v8/pages/studio'
import { Atelier as Atelier8 } from './v8/pages/atelier'
import { Werkstatt as Werkstatt8 } from './v8/pages/werkstatt'
import { Playful as Playful8 } from './v8/pages/playful'
import { Palette as Palette8 } from './v8/pages/palette'
import { Mosaic as Mosaic8 } from './v8/pages/mosaic'
import type { ProjectManifest } from '../../runtime/types'

const manifest: ProjectManifest = {
  id: '25ad55f6-27f8-493e-8263-b012818af79a',
  project: 'landing-page',
  iterations: [
    {
      name: 'V1',
      frozen: true,
      pages: [
        {
          name: 'Noir',
          grid: { columns: 1, columnWidth: 1440, rowHeight: 2400, gap: 40 },
          frames: [
            { id: 'v1-noir', title: 'Noir — Linear Dark Minimal', component: Noir, width: 1440, height: 2400 },
          ],
        },
        {
          name: 'Aurora',
          grid: { columns: 1, columnWidth: 1440, rowHeight: 2400, gap: 40 },
          frames: [
            { id: 'v1-aurora', title: 'Aurora — Cursor Gradient', component: Aurora, width: 1440, height: 2400 },
          ],
        },
        {
          name: 'Canvas',
          grid: { columns: 1, columnWidth: 1440, rowHeight: 2400, gap: 40 },
          frames: [
            { id: 'v1-canvas', title: 'Canvas — Vercel Light Spacious', component: CanvasLP, width: 1440, height: 2400 },
          ],
        },
        {
          name: 'Bento',
          grid: { columns: 1, columnWidth: 1440, rowHeight: 2000, gap: 40 },
          frames: [
            { id: 'v1-bento', title: 'Bento — Hip Modern Grid', component: Bento, width: 1440, height: 2000 },
          ],
        },
        {
          name: 'Shift',
          grid: { columns: 1, columnWidth: 1440, rowHeight: 2800, gap: 40 },
          frames: [
            { id: 'v1-shift', title: 'Shift — Dark to Light', component: Shift, width: 1440, height: 2800 },
          ],
        },
      ],
    },
    {
      name: 'V2',
      frozen: true,
      pages: [
        {
          name: 'Noir',
          grid: { columns: 1, columnWidth: 1440, rowHeight: 2400, gap: 40 },
          frames: [
            { id: 'v2-noir', title: 'Noir — Linear Dark Minimal', component: Noir, width: 1440, height: 2400 },
          ],
        },
        {
          name: 'Aurora',
          grid: { columns: 1, columnWidth: 1440, rowHeight: 2400, gap: 40 },
          frames: [
            { id: 'v2-aurora', title: 'Aurora — Cursor Gradient', component: Aurora, width: 1440, height: 2400 },
          ],
        },
        {
          name: 'Canvas',
          grid: { columns: 1, columnWidth: 1440, rowHeight: 2400, gap: 40 },
          frames: [
            { id: 'v2-canvas', title: 'Canvas — Vercel Light Spacious', component: CanvasLP, width: 1440, height: 2400 },
          ],
        },
        {
          name: 'Bento',
          grid: { columns: 1, columnWidth: 1440, rowHeight: 2000, gap: 40 },
          frames: [
            { id: 'v2-bento', title: 'Bento — Hip Modern Grid', component: Bento, width: 1440, height: 2000 },
          ],
        },
        {
          name: 'Shift',
          grid: { columns: 1, columnWidth: 1440, rowHeight: 2800, gap: 40 },
          frames: [
            { id: 'v2-shift', title: 'Shift — Dark to Light', component: Shift, width: 1440, height: 2800 },
          ],
        },
        {
          name: 'Mono',
          grid: { columns: 1, columnWidth: 1440, rowHeight: 2400, gap: 40 },
          frames: [
            { id: 'v2-mono', title: 'Mono — Monochrome Ultra-Minimal', component: Mono, width: 1440, height: 2400 },
          ],
        },
        {
          name: 'Prism',
          grid: { columns: 1, columnWidth: 1440, rowHeight: 2400, gap: 40 },
          frames: [
            { id: 'v2-prism', title: 'Prism — Linear Purple Gradient', component: Prism, width: 1440, height: 2400 },
          ],
        },
        {
          name: 'Grid',
          grid: { columns: 1, columnWidth: 1440, rowHeight: 2400, gap: 40 },
          frames: [
            { id: 'v2-grid', title: 'Grid — Structured Layout', component: Grid, width: 1440, height: 2400 },
          ],
        },
        {
          name: 'Type',
          grid: { columns: 1, columnWidth: 1440, rowHeight: 2400, gap: 40 },
          frames: [
            { id: 'v2-type', title: 'Type — Typography Editorial', component: Type, width: 1440, height: 2400 },
          ],
        },
        {
          name: 'Vapor',
          grid: { columns: 1, columnWidth: 1440, rowHeight: 2400, gap: 40 },
          frames: [
            { id: 'v2-vapor', title: 'Vapor — Atmospheric Dark', component: Vapor, width: 1440, height: 2400 },
          ],
        },
      ],
    },
    {
      name: 'V3',
      frozen: true,
      pages: [
        {
          name: 'New Directions',
          grid: { columns: 3, columnWidth: 1440, rowHeight: 2400, gap: 40 },
          frames: [
            { id: 'v3-silk', title: 'Silk — Layered Shadows, Warm Cream', component: Silk, width: 1440, height: 2400 },
            { id: 'v3-kinetic', title: 'Kinetic — Snappy Dark, Bold Type', component: Kinetic, width: 1440, height: 2400 },
            { id: 'v3-terrain', title: 'Terrain — Topographic, Earthy', component: Terrain, width: 1440, height: 2400 },
            { id: 'v3-crystalline', title: 'Crystalline — Frosted Glass, Prismatic', component: Crystalline, width: 1440, height: 2400 },
            { id: 'v3-brutalist', title: 'Brutalist — Raw, Exposed, Anti-Design', component: Brutalist, width: 1440, height: 2400 },
            { id: 'v3-solstice', title: 'Solstice — Warm Sunset, Soft Organic', component: Solstice, width: 1440, height: 2400 },
          ],
        },
        {
          name: 'Noir',
          grid: { columns: 1, columnWidth: 1440, rowHeight: 2400, gap: 40 },
          frames: [
            { id: 'v3-noir', title: 'Noir — Linear Dark Minimal', component: Noir, width: 1440, height: 2400 },
          ],
        },
        {
          name: 'Aurora',
          grid: { columns: 1, columnWidth: 1440, rowHeight: 2400, gap: 40 },
          frames: [
            { id: 'v3-aurora', title: 'Aurora — Cursor Gradient', component: Aurora, width: 1440, height: 2400 },
          ],
        },
        {
          name: 'Canvas',
          grid: { columns: 1, columnWidth: 1440, rowHeight: 2400, gap: 40 },
          frames: [
            { id: 'v3-canvas', title: 'Canvas — Vercel Light Spacious', component: CanvasLP, width: 1440, height: 2400 },
          ],
        },
        {
          name: 'Bento',
          grid: { columns: 1, columnWidth: 1440, rowHeight: 2000, gap: 40 },
          frames: [
            { id: 'v3-bento', title: 'Bento — Hip Modern Grid', component: Bento, width: 1440, height: 2000 },
          ],
        },
        {
          name: 'Shift',
          grid: { columns: 1, columnWidth: 1440, rowHeight: 2800, gap: 40 },
          frames: [
            { id: 'v3-shift', title: 'Shift — Dark to Light', component: Shift, width: 1440, height: 2800 },
          ],
        },
        {
          name: 'Mono',
          grid: { columns: 1, columnWidth: 1440, rowHeight: 2400, gap: 40 },
          frames: [
            { id: 'v3-mono', title: 'Mono — Monochrome Ultra-Minimal', component: Mono, width: 1440, height: 2400 },
          ],
        },
        {
          name: 'Prism',
          grid: { columns: 1, columnWidth: 1440, rowHeight: 2400, gap: 40 },
          frames: [
            { id: 'v3-prism', title: 'Prism — Linear Purple Gradient', component: Prism, width: 1440, height: 2400 },
          ],
        },
        {
          name: 'Grid',
          grid: { columns: 1, columnWidth: 1440, rowHeight: 2400, gap: 40 },
          frames: [
            { id: 'v3-grid', title: 'Grid — Structured Layout', component: Grid, width: 1440, height: 2400 },
          ],
        },
        {
          name: 'Type',
          grid: { columns: 1, columnWidth: 1440, rowHeight: 2400, gap: 40 },
          frames: [
            { id: 'v3-type', title: 'Type — Typography Editorial', component: Type, width: 1440, height: 2400 },
          ],
        },
        {
          name: 'Vapor',
          grid: { columns: 1, columnWidth: 1440, rowHeight: 2400, gap: 40 },
          frames: [
            { id: 'v3-vapor', title: 'Vapor — Atmospheric Dark', component: Vapor, width: 1440, height: 2400 },
          ],
        },
      ],
    },
    {
      name: 'V4',
      frozen: true,
      pages: [
        {
          name: 'Rams',
          grid: { columns: 3, columnWidth: 1440, rowHeight: 2400, gap: 40 },
          frames: [
            { id: 'v4-edition', title: 'Edition — Light, System, Centered', component: Edition, width: 1440, height: 2400 },
            { id: 'v4-signal', title: 'Signal — Dark, Quiet Confidence', component: Signal, width: 1440, height: 2400 },
            { id: 'v4-form', title: 'Form — Serif Warmth, Shadow Cards', component: Form, width: 1440, height: 2400 },
            { id: 'v4-object', title: 'Object — Product-First Hero', component: Object_, width: 1440, height: 2400 },
            { id: 'v4-index', title: 'Index — Left-Aligned, Numbered', component: Index, width: 1440, height: 2400 },
          ],
        },
        {
          name: 'V3 Directions',
          grid: { columns: 3, columnWidth: 1440, rowHeight: 2400, gap: 40 },
          frames: [
            { id: 'v4-silk', title: 'Silk — Layered Shadows, Warm Cream', component: Silk, width: 1440, height: 2400 },
            { id: 'v4-kinetic', title: 'Kinetic — Snappy Dark, Bold Type', component: Kinetic, width: 1440, height: 2400 },
            { id: 'v4-terrain', title: 'Terrain — Topographic, Earthy', component: Terrain, width: 1440, height: 2400 },
            { id: 'v4-crystalline', title: 'Crystalline — Frosted Glass, Prismatic', component: Crystalline, width: 1440, height: 2400 },
            { id: 'v4-brutalist', title: 'Brutalist — Raw, Exposed, Anti-Design', component: Brutalist, width: 1440, height: 2400 },
            { id: 'v4-solstice', title: 'Solstice — Warm Sunset, Soft Organic', component: Solstice, width: 1440, height: 2400 },
          ],
        },
        {
          name: 'Originals',
          grid: { columns: 3, columnWidth: 1440, rowHeight: 2400, gap: 40 },
          frames: [
            { id: 'v4-noir', title: 'Noir', component: Noir, width: 1440, height: 2400 },
            { id: 'v4-aurora', title: 'Aurora', component: Aurora, width: 1440, height: 2400 },
            { id: 'v4-canvas', title: 'Canvas', component: CanvasLP, width: 1440, height: 2400 },
            { id: 'v4-mono', title: 'Mono', component: Mono, width: 1440, height: 2400 },
            { id: 'v4-prism', title: 'Prism', component: Prism, width: 1440, height: 2400 },
            { id: 'v4-vapor', title: 'Vapor', component: Vapor, width: 1440, height: 2400 },
            { id: 'v4-grid', title: 'Grid', component: Grid, width: 1440, height: 2400 },
            { id: 'v4-type', title: 'Type', component: Type, width: 1440, height: 2400 },
          ],
        },
      ],
    },
    {
      name: 'V5',
      frozen: true,
      pages: [
        {
          name: 'Rams Catalog',
          grid: { columns: 3, columnWidth: 1440, rowHeight: 2400, gap: 40 },
          frames: [
            { id: 'v5-clearance', title: 'Clearance — Maximum White Space, Catalog Hero', component: Clearance, width: 1440, height: 2400 },
            { id: 'v5-ledger', title: 'Ledger — Numbered, 40/60 Asymmetric', component: Ledger, width: 1440, height: 2400 },
            { id: 'v5-inversion', title: 'Inversion — Dark, ET 66 Calculator', component: Inversion, width: 1440, height: 2400 },
            { id: 'v5-split', title: 'Split — Strict 40/60 Pinned', component: Split, width: 1440, height: 2400 },
            { id: 'v5-tabular', title: 'Tabular — Grid Table Precision', component: Tabular, width: 1440, height: 2400 },
          ],
        },
        {
          name: 'V4 Rams',
          grid: { columns: 3, columnWidth: 1440, rowHeight: 2400, gap: 40 },
          frames: [
            { id: 'v5-edition', title: 'Edition — Light, System, Centered', component: Edition, width: 1440, height: 2400 },
            { id: 'v5-signal', title: 'Signal — Dark, Quiet Confidence', component: Signal, width: 1440, height: 2400 },
            { id: 'v5-form', title: 'Form — Serif Warmth, Shadow Cards', component: Form, width: 1440, height: 2400 },
            { id: 'v5-object', title: 'Object — Product-First Hero', component: Object_, width: 1440, height: 2400 },
            { id: 'v5-index', title: 'Index — Left-Aligned, Numbered', component: Index, width: 1440, height: 2400 },
          ],
        },
        {
          name: 'V3 Directions',
          grid: { columns: 3, columnWidth: 1440, rowHeight: 2400, gap: 40 },
          frames: [
            { id: 'v5-silk', title: 'Silk — Layered Shadows, Warm Cream', component: Silk, width: 1440, height: 2400 },
            { id: 'v5-kinetic', title: 'Kinetic — Snappy Dark, Bold Type', component: Kinetic, width: 1440, height: 2400 },
            { id: 'v5-terrain', title: 'Terrain — Topographic, Earthy', component: Terrain, width: 1440, height: 2400 },
            { id: 'v5-crystalline', title: 'Crystalline — Frosted Glass, Prismatic', component: Crystalline, width: 1440, height: 2400 },
            { id: 'v5-brutalist', title: 'Brutalist — Raw, Exposed, Anti-Design', component: Brutalist, width: 1440, height: 2400 },
            { id: 'v5-solstice', title: 'Solstice — Warm Sunset, Soft Organic', component: Solstice, width: 1440, height: 2400 },
          ],
        },
        {
          name: 'Originals',
          grid: { columns: 3, columnWidth: 1440, rowHeight: 2400, gap: 40 },
          frames: [
            { id: 'v5-noir', title: 'Noir', component: Noir, width: 1440, height: 2400 },
            { id: 'v5-aurora', title: 'Aurora', component: Aurora, width: 1440, height: 2400 },
            { id: 'v5-canvas', title: 'Canvas', component: CanvasLP, width: 1440, height: 2400 },
            { id: 'v5-mono', title: 'Mono', component: Mono, width: 1440, height: 2400 },
            { id: 'v5-prism', title: 'Prism', component: Prism, width: 1440, height: 2400 },
            { id: 'v5-vapor', title: 'Vapor', component: Vapor, width: 1440, height: 2400 },
            { id: 'v5-grid', title: 'Grid', component: Grid, width: 1440, height: 2400 },
            { id: 'v5-type', title: 'Type', component: Type, width: 1440, height: 2400 },
          ],
        },
      ],
    },
    {
      name: 'V6',
      frozen: true,
      pages: [
        {
          name: 'Expressive',
          grid: { columns: 5, columnWidth: 1440, rowHeight: 2400, gap: 40 },
          frames: [
            { id: 'v6-drift', title: 'Drift — Linear Purple, Command Palette', component: Drift, width: 1440, height: 2400 },
            { id: 'v6-lumen', title: 'Lumen — Vercel Editorial Serif', component: Lumen, width: 1440, height: 2400 },
            { id: 'v6-meridian', title: 'Meridian — Midnight Navy, Electric Cyan', component: Meridian, width: 1440, height: 2400 },
            { id: 'v6-threshold', title: 'Threshold — Swiss Split-Screen', component: Threshold, width: 1440, height: 2400 },
            { id: 'v6-flux', title: 'Flux — Gradient Mesh, Glassmorphism', component: Flux, width: 1440, height: 2400 },
            { id: 'v6-parallel', title: 'Parallel — Deployment Log Timeline', component: Parallel, width: 1440, height: 2400 },
            { id: 'v6-zenith', title: 'Zenith — Ultra-White, One Bold Punch', component: Zenith, width: 1440, height: 2400 },
            { id: 'v6-carbon', title: 'Carbon — Terminal-Native Developer', component: Carbon, width: 1440, height: 2400 },
            { id: 'v6-aperture', title: 'Aperture — Photography, Dramatic Scale', component: Aperture, width: 1440, height: 2400 },
            { id: 'v6-harmonic', title: 'Harmonic — Warm Rounded Playful', component: Harmonic, width: 1440, height: 2400 },
          ],
        },
        {
          name: 'V5 Rams Catalog',
          grid: { columns: 3, columnWidth: 1440, rowHeight: 2400, gap: 40 },
          frames: [
            { id: 'v6-clearance', title: 'Clearance — Maximum White Space', component: Clearance, width: 1440, height: 2400 },
            { id: 'v6-ledger', title: 'Ledger — Numbered, Asymmetric', component: Ledger, width: 1440, height: 2400 },
            { id: 'v6-inversion', title: 'Inversion — Dark, ET 66', component: Inversion, width: 1440, height: 2400 },
            { id: 'v6-split', title: 'Split — 40/60 Pinned', component: Split, width: 1440, height: 2400 },
            { id: 'v6-tabular', title: 'Tabular — Grid Table', component: Tabular, width: 1440, height: 2400 },
          ],
        },
        {
          name: 'V4 Rams',
          grid: { columns: 3, columnWidth: 1440, rowHeight: 2400, gap: 40 },
          frames: [
            { id: 'v6-edition', title: 'Edition', component: Edition, width: 1440, height: 2400 },
            { id: 'v6-signal', title: 'Signal', component: Signal, width: 1440, height: 2400 },
            { id: 'v6-form', title: 'Form', component: Form, width: 1440, height: 2400 },
            { id: 'v6-object', title: 'Object', component: Object_, width: 1440, height: 2400 },
            { id: 'v6-index', title: 'Index', component: Index, width: 1440, height: 2400 },
          ],
        },
        {
          name: 'V3 Directions',
          grid: { columns: 3, columnWidth: 1440, rowHeight: 2400, gap: 40 },
          frames: [
            { id: 'v6-silk', title: 'Silk', component: Silk, width: 1440, height: 2400 },
            { id: 'v6-kinetic', title: 'Kinetic', component: Kinetic, width: 1440, height: 2400 },
            { id: 'v6-terrain', title: 'Terrain', component: Terrain, width: 1440, height: 2400 },
            { id: 'v6-crystalline', title: 'Crystalline', component: Crystalline, width: 1440, height: 2400 },
            { id: 'v6-brutalist', title: 'Brutalist', component: Brutalist, width: 1440, height: 2400 },
            { id: 'v6-solstice', title: 'Solstice', component: Solstice, width: 1440, height: 2400 },
          ],
        },
        {
          name: 'Originals',
          grid: { columns: 3, columnWidth: 1440, rowHeight: 2400, gap: 40 },
          frames: [
            { id: 'v6-noir', title: 'Noir', component: Noir, width: 1440, height: 2400 },
            { id: 'v6-aurora', title: 'Aurora', component: Aurora, width: 1440, height: 2400 },
            { id: 'v6-canvas', title: 'Canvas', component: CanvasLP, width: 1440, height: 2400 },
            { id: 'v6-mono', title: 'Mono', component: Mono, width: 1440, height: 2400 },
            { id: 'v6-prism', title: 'Prism', component: Prism, width: 1440, height: 2400 },
            { id: 'v6-vapor', title: 'Vapor', component: Vapor, width: 1440, height: 2400 },
            { id: 'v6-grid', title: 'Grid', component: Grid, width: 1440, height: 2400 },
            { id: 'v6-type', title: 'Type', component: Type, width: 1440, height: 2400 },
          ],
        },
      ],
    },
    {
      name: 'V7',
      frozen: true,
      pages: [
        {
          name: 'Playful Inspired',
          grid: { columns: 3, columnWidth: 1440, rowHeight: 2400, gap: 40 },
          frames: [
            { id: 'v7-playful', title: 'Playful — Retro-modern, Colorful Icons', component: Playful, width: 1440, height: 2400 },
            { id: 'v7-palette', title: 'Palette — Bold Color Blocks, Chunky', component: Palette, width: 1440, height: 2400 },
            { id: 'v7-mosaic', title: 'Mosaic — Grid-heavy, Pastel Tones', component: Mosaic, width: 1440, height: 2400 },
          ],
        },
        {
          name: 'Studio Inspired',
          grid: { columns: 3, columnWidth: 1440, rowHeight: 2400, gap: 40 },
          frames: [
            { id: 'v7-studio', title: 'Studio — Overlapping Cards, Bold Orange', component: Studio, width: 1440, height: 2400 },
            { id: 'v7-atelier', title: 'Atelier — Warm Minimal, Serif Editorial', component: Atelier, width: 1440, height: 2400 },
            { id: 'v7-werkstatt', title: 'Werkstatt — Geometric Bold, Black/Orange', component: Werkstatt, width: 1440, height: 2400 },
          ],
        },
        {
          name: 'Context Inspired',
          grid: { columns: 3, columnWidth: 1440, rowHeight: 2400, gap: 40 },
          frames: [
            { id: 'v7-narrative', title: 'Narrative — Grid Editorial, Blue Verticals', component: Narrative, width: 1440, height: 2400 },
            { id: 'v7-statement', title: 'Statement — Minimal Typography, Warm', component: Statement, width: 1440, height: 2400 },
            { id: 'v7-vision', title: 'Vision — Real Imagery, Bright Future', component: Vision, width: 1440, height: 2400 },
          ],
        },
        {
          name: 'FYLLA Variations',
          grid: { columns: 2, columnWidth: 1440, rowHeight: 2400, gap: 40 },
          frames: [
            { id: 'v7-fylla-light', title: 'Fylla Light — Cream Serif Editorial', component: FyllaLight, width: 1440, height: 2400 },
            { id: 'v7-fylla-dark', title: 'Fylla Dark — Charcoal Serif Editorial', component: FyllaDark, width: 1440, height: 2400 },
          ],
        },
        {
          name: 'Rams × Brockmann',
          grid: { columns: 5, columnWidth: 1440, rowHeight: 2400, gap: 40 },
          frames: [
            { id: 'v7-specimen', title: 'Specimen — Swiss Type Catalog', component: Specimen, width: 1440, height: 2400 },
            { id: 'v7-raster', title: 'Raster — Visible Modular Grid', component: Raster, width: 1440, height: 2400 },
            { id: 'v7-folio', title: 'Folio — Editorial Magazine', component: Folio, width: 1440, height: 2400 },
            { id: 'v7-datum', title: 'Datum — Stats-First Hero', component: Datum, width: 1440, height: 2400 },
            { id: 'v7-plinth', title: 'Plinth — Product Shrine', component: Plinth, width: 1440, height: 2400 },
            { id: 'v7-tract', title: 'Tract — Alternating Bands', component: Tract, width: 1440, height: 2400 },
            { id: 'v7-axis', title: 'Axis — Center-Divided', component: Axis, width: 1440, height: 2400 },
            { id: 'v7-void', title: 'Void — Radical Whitespace', component: Void, width: 1440, height: 2400 },
            { id: 'v7-codex', title: 'Codex — Table of Contents', component: Codex, width: 1440, height: 2400 },
            { id: 'v7-gauge', title: 'Gauge — Instrument Panel', component: Gauge, width: 1440, height: 2400 },
            { id: 'v7-plank', title: 'Plank — Full-Bleed Bands', component: Plank, width: 1440, height: 2400 },
            { id: 'v7-verso', title: 'Verso — Dark/Light Hard Split', component: Verso, width: 1440, height: 2400 },
            { id: 'v7-module', title: 'Module — Brockmann 6-Column', component: Module, width: 1440, height: 2400 },
            { id: 'v7-proof', title: 'Proof — Typography as Design', component: Proof, width: 1440, height: 2400 },
            { id: 'v7-cipher', title: 'Cipher — Terminal Aesthetic', component: Cipher, width: 1440, height: 2400 },
          ],
        },
        // Carry forward V6 Expressive
        {
          name: 'V6 Expressive',
          grid: { columns: 5, columnWidth: 1440, rowHeight: 2400, gap: 40 },
          frames: [
            { id: 'v7-drift', title: 'Drift', component: Drift, width: 1440, height: 2400 },
            { id: 'v7-lumen', title: 'Lumen', component: Lumen, width: 1440, height: 2400 },
            { id: 'v7-meridian', title: 'Meridian', component: Meridian, width: 1440, height: 2400 },
            { id: 'v7-threshold', title: 'Threshold', component: Threshold, width: 1440, height: 2400 },
            { id: 'v7-flux', title: 'Flux', component: Flux, width: 1440, height: 2400 },
            { id: 'v7-parallel', title: 'Parallel', component: Parallel, width: 1440, height: 2400 },
            { id: 'v7-zenith', title: 'Zenith', component: Zenith, width: 1440, height: 2400 },
            { id: 'v7-carbon', title: 'Carbon', component: Carbon, width: 1440, height: 2400 },
            { id: 'v7-aperture', title: 'Aperture', component: Aperture, width: 1440, height: 2400 },
            { id: 'v7-harmonic', title: 'Harmonic', component: Harmonic, width: 1440, height: 2400 },
          ],
        },
        {
          name: 'V5 Rams Catalog',
          grid: { columns: 3, columnWidth: 1440, rowHeight: 2400, gap: 40 },
          frames: [
            { id: 'v7-clearance', title: 'Clearance', component: Clearance, width: 1440, height: 2400 },
            { id: 'v7-ledger', title: 'Ledger', component: Ledger, width: 1440, height: 2400 },
            { id: 'v7-inversion', title: 'Inversion', component: Inversion, width: 1440, height: 2400 },
            { id: 'v7-split', title: 'Split', component: Split, width: 1440, height: 2400 },
            { id: 'v7-tabular', title: 'Tabular', component: Tabular, width: 1440, height: 2400 },
          ],
        },
        {
          name: 'V4 Rams',
          grid: { columns: 3, columnWidth: 1440, rowHeight: 2400, gap: 40 },
          frames: [
            { id: 'v7-edition', title: 'Edition', component: Edition, width: 1440, height: 2400 },
            { id: 'v7-signal', title: 'Signal', component: Signal, width: 1440, height: 2400 },
            { id: 'v7-form', title: 'Form', component: Form, width: 1440, height: 2400 },
            { id: 'v7-object', title: 'Object', component: Object_, width: 1440, height: 2400 },
            { id: 'v7-index', title: 'Index', component: Index, width: 1440, height: 2400 },
          ],
        },
        {
          name: 'V3 Directions',
          grid: { columns: 3, columnWidth: 1440, rowHeight: 2400, gap: 40 },
          frames: [
            { id: 'v7-silk', title: 'Silk', component: Silk, width: 1440, height: 2400 },
            { id: 'v7-kinetic', title: 'Kinetic', component: Kinetic, width: 1440, height: 2400 },
            { id: 'v7-terrain', title: 'Terrain', component: Terrain, width: 1440, height: 2400 },
            { id: 'v7-crystalline', title: 'Crystalline', component: Crystalline, width: 1440, height: 2400 },
            { id: 'v7-brutalist', title: 'Brutalist', component: Brutalist, width: 1440, height: 2400 },
            { id: 'v7-solstice', title: 'Solstice', component: Solstice, width: 1440, height: 2400 },
          ],
        },
        {
          name: 'Originals',
          grid: { columns: 3, columnWidth: 1440, rowHeight: 2400, gap: 40 },
          frames: [
            { id: 'v7-noir', title: 'Noir', component: Noir, width: 1440, height: 2400 },
            { id: 'v7-aurora', title: 'Aurora', component: Aurora, width: 1440, height: 2400 },
            { id: 'v7-canvas', title: 'Canvas', component: CanvasLP, width: 1440, height: 2400 },
            { id: 'v7-mono', title: 'Mono', component: Mono, width: 1440, height: 2400 },
            { id: 'v7-prism', title: 'Prism', component: Prism, width: 1440, height: 2400 },
            { id: 'v7-vapor', title: 'Vapor', component: Vapor, width: 1440, height: 2400 },
            { id: 'v7-grid', title: 'Grid', component: Grid, width: 1440, height: 2400 },
            { id: 'v7-type', title: 'Type', component: Type, width: 1440, height: 2400 },
          ],
        },
      ],
    },
    {
      name: 'V8',
      description: 'Bryllen rebrand — all pages updated with new product name',
      pages: [
        {
          name: 'Bryllen — Featured',
          grid: { columns: 5, columnWidth: 1440, rowHeight: 2400, gap: 40 },
          frames: [
            { id: 'v8-specimen', title: 'Specimen — Swiss Type Catalog', component: Specimen8, width: 1440, height: 2400 },
            { id: 'v8-raster', title: 'Raster — Visible Modular Grid', component: Raster8, width: 1440, height: 2400 },
            { id: 'v8-folio', title: 'Folio — Editorial Magazine', component: Folio8, width: 1440, height: 2400 },
            { id: 'v8-datum', title: 'Datum — Stats-First Hero', component: Datum8, width: 1440, height: 2400 },
            { id: 'v8-plinth', title: 'Plinth — Product Shrine', component: Plinth8, width: 1440, height: 2400 },
          ],
        },
        {
          name: 'Playful Inspired',
          grid: { columns: 3, columnWidth: 1440, rowHeight: 2400, gap: 40 },
          frames: [
            { id: 'v8-playful', title: 'Playful — Retro-modern, Colorful Icons', component: Playful8, width: 1440, height: 2400 },
            { id: 'v8-palette', title: 'Palette — Bold Color Blocks, Chunky', component: Palette8, width: 1440, height: 2400 },
            { id: 'v8-mosaic', title: 'Mosaic — Grid-heavy, Pastel Tones', component: Mosaic8, width: 1440, height: 2400 },
          ],
        },
        {
          name: 'Studio Inspired',
          grid: { columns: 3, columnWidth: 1440, rowHeight: 2400, gap: 40 },
          frames: [
            { id: 'v8-studio', title: 'Studio — Overlapping Cards, Bold Orange', component: Studio8, width: 1440, height: 2400 },
            { id: 'v8-atelier', title: 'Atelier — Warm Minimal, Serif Editorial', component: Atelier8, width: 1440, height: 2400 },
            { id: 'v8-werkstatt', title: 'Werkstatt — Geometric Bold, Black/Orange', component: Werkstatt8, width: 1440, height: 2400 },
          ],
        },
        {
          name: 'Context Inspired',
          grid: { columns: 3, columnWidth: 1440, rowHeight: 2400, gap: 40 },
          frames: [
            { id: 'v8-narrative', title: 'Narrative — Grid Editorial, Blue Verticals', component: Narrative8, width: 1440, height: 2400 },
            { id: 'v8-statement', title: 'Statement — Minimal Typography, Warm', component: Statement8, width: 1440, height: 2400 },
            { id: 'v8-vision', title: 'Vision — Real Imagery, Bright Future', component: Vision8, width: 1440, height: 2400 },
          ],
        },
        {
          name: 'FYLLA Variations',
          grid: { columns: 2, columnWidth: 1440, rowHeight: 2400, gap: 40 },
          frames: [
            { id: 'v8-fylla-light', title: 'Fylla Light — Cream Serif Editorial', component: FyllaLight8, width: 1440, height: 2400 },
            { id: 'v8-fylla-dark', title: 'Fylla Dark — Charcoal Serif Editorial', component: FyllaDark8, width: 1440, height: 2400 },
          ],
        },
        {
          name: 'Rams × Brockmann',
          grid: { columns: 5, columnWidth: 1440, rowHeight: 2400, gap: 40 },
          frames: [
            { id: 'v8-tract', title: 'Tract — Alternating Bands', component: Tract8, width: 1440, height: 2400 },
            { id: 'v8-axis', title: 'Axis — Center-Divided', component: Axis8, width: 1440, height: 2400 },
            { id: 'v8-void', title: 'Void — Radical Whitespace', component: Void8, width: 1440, height: 2400 },
            { id: 'v8-codex', title: 'Codex — Table of Contents', component: Codex8, width: 1440, height: 2400 },
            { id: 'v8-gauge', title: 'Gauge — Instrument Panel', component: Gauge8, width: 1440, height: 2400 },
            { id: 'v8-plank', title: 'Plank — Full-Bleed Bands', component: Plank8, width: 1440, height: 2400 },
            { id: 'v8-verso', title: 'Verso — Dark/Light Hard Split', component: Verso8, width: 1440, height: 2400 },
            { id: 'v8-module', title: 'Module — Brockmann 6-Column', component: Module8, width: 1440, height: 2400 },
            { id: 'v8-proof', title: 'Proof — Typography as Design', component: Proof8, width: 1440, height: 2400 },
            { id: 'v8-cipher', title: 'Cipher — Terminal Aesthetic', component: Cipher8, width: 1440, height: 2400 },
          ],
        },
        {
          name: 'Codex Variations',
          grid: { columns: 4, columnWidth: 1440, rowHeight: 3200, gap: 40 },
          frames: [
            { id: 'v8-codex-original', title: 'Codex — Original (Updated)', component: Codex8, width: 1440, height: 3200 },
            { id: 'v8-codex-reference', title: 'Codex Reference — Refined Swiss Book', component: CodexReference, width: 1440, height: 3200 },
            { id: 'v8-codex-terminal', title: 'Codex Terminal — Dark Developer CLI', component: CodexTerminal, width: 1440, height: 3200 },
            { id: 'v8-codex-gallery', title: 'Codex Gallery — Museum Whitespace', component: CodexGallery, width: 1440, height: 3200 },
          ],
        },
        {
          name: 'Design System (Landing + Docs)',
          grid: { columns: 5, columnWidth: 1440, rowHeight: 900, gap: 40 },
          frames: [
            { id: 'v8-system-codex', title: 'Landing — Codex Original', component: Codex8, width: 1440, height: 900 },
            { id: 'v8-system-reference', title: 'Landing — Codex Reference', component: CodexReference, width: 1440, height: 900 },
            { id: 'v8-system-docs-manual', title: 'Docs — Book Style', component: DocsManual, width: 1440, height: 900 },
            { id: 'v8-system-docs-terminal', title: 'Docs — Terminal', component: DocsTerminal, width: 1440, height: 900 },
            { id: 'v8-system-docs-guide', title: 'Docs — Modern Sidebar', component: DocsGuide, width: 1440, height: 900 },
          ],
        },
        {
          name: 'Context-Inspired Variations',
          grid: { columns: 5, columnWidth: 1440, rowHeight: 2000, gap: 40 },
          frames: [
            { id: 'v8-pulse', title: 'Pulse — Soft Blue Floating Cards', component: Pulse, width: 1440, height: 2000 },
            { id: 'v8-slate', title: 'Slate — Dark Industrial', component: Slate, width: 1440, height: 2000 },
            { id: 'v8-ivory', title: 'Ivory — Warm Serif Editorial', component: Ivory, width: 1440, height: 2000 },
            { id: 'v8-neon', title: 'Neon — Extreme Minimal', component: Neon, width: 1440, height: 2000 },
            { id: 'v8-block', title: 'Block — Playful Geometric', component: Block, width: 1440, height: 2000 },
          ],
        },
      ],
    },
  ],
}

export default manifest
