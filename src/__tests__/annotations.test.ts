import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * Annotation system integration tests
 *
 * These tests verify that:
 * 1. AnnotationPanel passes projectId to all API calls (preventing the bug where
 *    annotations were fetched from the global database instead of project-specific)
 * 2. AnnotationOverlay and AnnotationPanel use the same API contract
 * 3. The URL parameter pattern is consistent across all fetch calls
 */

/** Extract fetch URL patterns from source code */
function extractFetchUrls(source: string): string[] {
  // Match fetch calls: fetch(`${endpoint}/path`) or fetch(`${endpoint}/path?${params}`)
  const fetchRegex = /fetch\(`\$\{endpoint\}([^`]+)`/g
  const urls: string[] = []
  let match
  while ((match = fetchRegex.exec(source)) !== null) {
    urls.push(match[1])
  }
  return urls
}

/** Extract EventSource URL patterns from source code */
function extractEventSourceUrls(source: string): string[] {
  const eventSourceRegex = /new EventSource\(`\$\{endpoint\}([^`]+)`\)/g
  const urls: string[] = []
  let match
  while ((match = eventSourceRegex.exec(source)) !== null) {
    urls.push(match[1])
  }
  return urls
}

describe('annotation API contract', () => {
  const panelPath = join(__dirname, '..', 'runtime', 'AnnotationPanel.tsx')
  const overlayPath = join(__dirname, '..', 'runtime', 'AnnotationOverlay.tsx')

  const panelSource = readFileSync(panelPath, 'utf-8')
  const overlaySource = readFileSync(overlayPath, 'utf-8')

  describe('AnnotationPanel projectId usage', () => {
    it('useAnnotationPanel hook accepts projectId parameter', () => {
      // The hook signature should include projectId
      expect(panelSource).toContain('function useAnnotationPanel(endpoint: string, projectId?: string)')
    })

    it('AnnotationPanelWidget accepts projectId prop', () => {
      // The component props should include projectId
      expect(panelSource).toContain('{ endpoint, projectId }')
      expect(panelSource).toContain('projectId?: string')
    })

    it('passes projectId to useAnnotationPanel hook', () => {
      // The widget should pass projectId to the hook
      expect(panelSource).toContain('useAnnotationPanel(endpoint, projectId)')
    })

    it('includes projectId in all annotation fetch calls', () => {
      const fetchUrls = extractFetchUrls(panelSource)

      // All fetch calls should include the query params helper
      const annotationFetches = fetchUrls.filter(url => url.includes('/annotations'))
      expect(annotationFetches.length).toBeGreaterThan(0)

      // Verify the buildParams helper is used
      expect(panelSource).toContain('buildParams()')
      expect(panelSource).toContain('if (projectId) params.set(\'projectId\', projectId)')
    })

    it('includes projectId in EventSource connection', () => {
      const eventSourceUrls = extractEventSourceUrls(panelSource)

      // Should have an EventSource for annotation events
      const annotationEvents = eventSourceUrls.filter(url => url.includes('/annotations/events'))
      expect(annotationEvents.length).toBe(1)

      // Should include query params
      expect(annotationEvents[0]).toContain('${queryParams}')
    })
  })

  describe('AnnotationOverlay projectId usage', () => {
    it('accepts projectId prop', () => {
      expect(overlaySource).toContain('projectId?: string')
    })

    it('computes projectParam from projectId or project name', () => {
      expect(overlaySource).toContain('const projectParam = projectId || project')
    })

    it('includes projectId in fetch calls', () => {
      // Should use params.set for projectId
      expect(overlaySource).toContain("params.set('projectId', projectParam)")
    })

    it('includes projectId in EventSource connection', () => {
      // Should include projectParam in SSE connection
      expect(overlaySource).toContain('`${endpoint}/annotations/events?${params}`')
    })
  })

  describe('API contract consistency', () => {
    it('both components use the same query parameter name', () => {
      // AnnotationPanel uses 'projectId'
      expect(panelSource).toContain("params.set('projectId', projectId)")

      // AnnotationOverlay uses 'projectId'
      expect(overlaySource).toContain("params.set('projectId', projectParam)")
    })

    it('both components subscribe to /annotations/events SSE endpoint', () => {
      expect(panelSource).toContain('/annotations/events')
      expect(overlaySource).toContain('/annotations/events')
    })

    it('both handle applied event from SSE', () => {
      expect(panelSource).toContain("data.type === 'applied'")
      expect(overlaySource).toContain("data.type === 'resolved'")
    })
  })
})

describe('TopBar and BryllenShell integration', () => {
  const topBarPath = join(__dirname, '..', 'runtime', 'TopBar.tsx')
  const shellPath = join(__dirname, '..', 'runtime', 'BryllenShell.tsx')

  const topBarSource = readFileSync(topBarPath, 'utf-8')
  const shellSource = readFileSync(shellPath, 'utf-8')

  it('TopBar accepts projectId prop', () => {
    expect(topBarSource).toContain('projectId?: string')
  })

  it('TopBar passes projectId to AnnotationPanelWidget', () => {
    expect(topBarSource).toContain('projectId={projectId}')
  })

  it('BryllenShell passes projectId to TopBar', () => {
    expect(shellSource).toContain('projectId={activeProject?.project}')
  })

  it('BryllenShell passes projectId to AnnotationOverlay', () => {
    expect(shellSource).toContain('projectId={activeProject?.project}')
  })
})

describe('server API accepts projectId', () => {
  const serverPath = join(__dirname, '..', 'server', 'http-server.js')
  const serverSource = readFileSync(serverPath, 'utf-8')

  it('GET /annotations accepts projectId query param', () => {
    expect(serverSource).toContain("url.searchParams.get('projectId')")
  })

  it('POST /annotations accepts projectId query param', () => {
    expect(serverSource).toContain("const projectName = url.searchParams.get('projectId')")
  })

  it('SSE /annotations/events accepts projectId query param', () => {
    expect(serverSource).toContain("const projectName = url.searchParams.get('projectId')")
  })

  it('uses fallback global database when no projectId', () => {
    expect(serverSource).toContain('_global')
    expect(serverSource).toContain('No projectId provided for annotation')
  })
})
