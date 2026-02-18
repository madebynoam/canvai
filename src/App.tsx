import { CanvaiShell } from './runtime/CanvaiShell'
import { manifests } from 'virtual:canvai-manifests'

export default function App() {
  return <CanvaiShell manifests={manifests} />
}
