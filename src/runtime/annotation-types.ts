export interface CanvaiAnnotation {
  id: string
  type?: 'annotation' | 'iteration' | 'project' | 'prompt-request'
  project?: string
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
  status: 'draft' | 'pending' | 'resolved'
  /** Mode for annotation: 'refine' = edit specific element, 'ideate' = generate 3+ different frames */
  mode?: 'refine' | 'ideate'
}
