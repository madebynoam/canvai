#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod/v4'

import { readFileSync } from 'fs'
import { join } from 'path'

/** Re-read .canvai-ports.json on every call so we pick up port changes. */
function httpBase() {
  try {
    const ports = JSON.parse(readFileSync(join(process.cwd(), '.canvai-ports.json'), 'utf8'))
    return `http://localhost:${ports.http || 4748}`
  } catch {
    return 'http://localhost:4748'
  }
}

async function httpGet(path) {
  const res = await fetch(`${httpBase()}${path}`)
  return res.json()
}

async function httpPost(path) {
  const res = await fetch(`${httpBase()}${path}`, { method: 'POST' })
  return res.json()
}

// --- MCP server (stdio) ---

const mcp = new McpServer({
  name: 'canvai-annotations',
  version: '1.0.0',
})

// watch_annotations — long-polls the HTTP server with a timeout
mcp.registerTool(
  'watch_annotations',
  {
    title: 'Watch Annotations',
    description:
      'Waits for a new annotation from the canvas with a 15-second timeout. Returns the annotation if one arrives, or { "timeout": true } if the timeout expires with no annotation. Call this in a loop to process annotations — between calls you can respond to designer messages.',
  },
  async () => {
    try {
      const result = await httpGet('/annotations/next?timeout=15000')

      if (result.timeout) {
        return {
          content: [{ type: 'text', text: 'Waiting for designer...' }],
        }
      }

      const { id, type, project, componentName, comment } = result
      const what = type === 'iteration' ? 'New iteration request'
        : type === 'project' ? 'New project request'
        : `Annotation #${id}`
      const inProject = project ? ` in project "${project}"` : ''
      const target = componentName ? ` on ${componentName}` : ''
      const summary = `${what}${inProject}${target}: "${comment}"`

      return {
        content: [
          { type: 'text', text: summary },
          { type: 'text', text: JSON.stringify(result, null, 2) },
        ],
      }
    } catch (err) {
      return {
        content: [{ type: 'text', text: `Error waiting for annotations: ${err.message}. Is canvai design running?` }],
        isError: true,
      }
    }
  }
)

// resolve_annotation — mark an annotation as resolved
mcp.registerTool(
  'resolve_annotation',
  {
    title: 'Resolve Annotation',
    description: 'Mark an annotation as resolved after applying the requested change.',
    inputSchema: {
      id: z.string().describe('The annotation ID to resolve'),
    },
  },
  async ({ id }) => {
    try {
      const result = await httpPost(`/annotations/${id}/resolve`)
      if (result.error) {
        return {
          content: [{ type: 'text', text: `Annotation #${id} not found.` }],
          isError: true,
        }
      }
      const comment = (result.comment || '').slice(0, 60)
      return {
        content: [{ type: 'text', text: `Done — #${id} resolved and committed. "${comment}"` }],
      }
    } catch (err) {
      return {
        content: [{ type: 'text', text: `Error resolving annotation: ${err.message}` }],
        isError: true,
      }
    }
  }
)

// get_pending_annotations — return all pending annotations
mcp.registerTool(
  'get_pending_annotations',
  {
    title: 'Get Pending Annotations',
    description: 'Return all annotations with status=pending. Use for recovery if the watch loop was interrupted.',
  },
  async () => {
    try {
      const pending = await httpGet('/annotations?status=pending')
      if (pending.length === 0) {
        return {
          content: [{ type: 'text', text: 'No pending annotations. Canvas is clean.' }],
        }
      }
      const summary = pending.map(a => `#${a.id}: "${(a.comment || '').slice(0, 50)}"`)
      return {
        content: [
          { type: 'text', text: `${pending.length} pending annotation${pending.length > 1 ? 's' : ''}: ${summary.join(', ')}` },
          { type: 'text', text: JSON.stringify(pending, null, 2) },
        ],
      }
    } catch (err) {
      return {
        content: [{ type: 'text', text: `Error fetching annotations: ${err.message}. Is canvai design running?` }],
        isError: true,
      }
    }
  }
)

// screenshot_canvas — screenshot the canvas for visual review
mcp.registerTool(
  'screenshot_canvas',
  {
    title: 'Screenshot Canvas',
    description:
      'Screenshot the canvas for visual review. Returns a file path to a PNG image — read it with the Read tool to see what the canvas looks like. Use after applying changes to verify they look correct.',
    inputSchema: {
      frameId: z.string().optional().describe('Frame ID to screenshot (e.g. "v1-shell"). Omit for all frames.'),
      delay: z.number().optional().describe('HMR settle delay in ms (default 500)'),
    },
  },
  async ({ frameId, delay }) => {
    try {
      const params = new URLSearchParams()
      if (frameId) params.set('frame', frameId)
      if (delay) params.set('delay', String(delay))
      const qs = params.toString()
      const result = await httpGet(`/screenshot${qs ? '?' + qs : ''}`)

      if (result.error) {
        if (result.install) {
          return {
            content: [{ type: 'text', text: `Playwright is not installed. Run: ${result.install}\nSkipping visual review.` }],
          }
        }
        return {
          content: [{ type: 'text', text: `Screenshot failed: ${result.error}` }],
          isError: true,
        }
      }

      return {
        content: [{ type: 'text', text: `Screenshot saved to ${result.path}\nRead this file to see the canvas.` }],
      }
    } catch (err) {
      return {
        content: [{ type: 'text', text: `Error taking screenshot: ${err.message}. Is canvai design running?` }],
        isError: true,
      }
    }
  }
)

// list_annotations — return all annotations
mcp.registerTool(
  'list_annotations',
  {
    title: 'List Annotations',
    description: 'Return all annotations with their status.',
  },
  async () => {
    try {
      const all = await httpGet('/annotations')
      return {
        content: [{ type: 'text', text: JSON.stringify(all, null, 2) }],
      }
    } catch (err) {
      return {
        content: [{ type: 'text', text: `Error fetching annotations: ${err.message}. Is canvai design running?` }],
        isError: true,
      }
    }
  }
)

// Connect MCP over stdio
const transport = new StdioServerTransport()
await mcp.connect(transport)
console.error('[canvai-mcp] MCP server connected via stdio')
