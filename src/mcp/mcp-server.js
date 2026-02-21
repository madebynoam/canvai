#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod/v4'

const HTTP_BASE = 'http://localhost:4748'

async function httpGet(path) {
  const res = await fetch(`${HTTP_BASE}${path}`)
  return res.json()
}

async function httpPost(path) {
  const res = await fetch(`${HTTP_BASE}${path}`, { method: 'POST' })
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
      'Waits for a new annotation from the canvas with a 30-second timeout. Returns the annotation if one arrives, or { "timeout": true } if the timeout expires with no annotation. Call this in a loop to process annotations — between calls you can respond to designer messages.',
  },
  async () => {
    try {
      const annotation = await httpGet('/annotations/next?timeout=30000')
      return {
        content: [{ type: 'text', text: JSON.stringify(annotation, null, 2) }],
      }
    } catch (err) {
      return {
        content: [{ type: 'text', text: `Error waiting for annotations: ${err.message}. Is canvai dev running?` }],
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
          content: [{ type: 'text', text: `Annotation ${id} not found.` }],
          isError: true,
        }
      }
      return {
        content: [{ type: 'text', text: `Annotation ${id} resolved.` }],
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
      return {
        content: [{ type: 'text', text: JSON.stringify(pending, null, 2) }],
      }
    } catch (err) {
      return {
        content: [{ type: 'text', text: `Error fetching annotations: ${err.message}. Is canvai dev running?` }],
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
        content: [{ type: 'text', text: `Error fetching annotations: ${err.message}. Is canvai dev running?` }],
        isError: true,
      }
    }
  }
)

// Connect MCP over stdio
const transport = new StdioServerTransport()
await mcp.connect(transport)
console.error('[canvai-mcp] MCP server connected via stdio')
