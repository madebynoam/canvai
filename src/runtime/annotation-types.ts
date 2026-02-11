export interface CanvaiAnnotation {
  id: string
  frameId: string
  componentName: string
  props: Record<string, unknown>
  selector: string
  elementTag: string
  elementClasses: string
  elementText: string
  computedStyles: Record<string, string>
  comment: string
  timestamp: number
  status: 'pending' | 'resolved'
}
