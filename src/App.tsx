import { BryllenShell } from './runtime/BryllenShell'
import { manifests } from 'virtual:bryllen-manifests'

declare const __BRYLLEN_HTTP_PORT__: number | undefined
const annotationEndpoint = `http://localhost:${__BRYLLEN_HTTP_PORT__ ?? 4748}`

export default function App() {
  return <BryllenShell manifests={manifests} annotationEndpoint={annotationEndpoint} />
}
