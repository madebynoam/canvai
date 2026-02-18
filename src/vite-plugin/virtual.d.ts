declare module 'virtual:canvai-manifests' {
  import type { ProjectManifest } from '../runtime/types'
  export const manifests: ProjectManifest[]
}

declare const __CANVAI_VERSION__: string
