declare module 'virtual:bryllen-manifests' {
  import type { ProjectManifest } from '../runtime/types'
  export const manifests: ProjectManifest[]
}

declare const __BRYLLEN_VERSION__: string
