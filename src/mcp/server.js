#!/usr/bin/env node

import { createServer } from 'http'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod/v4'

// --- Annotation store ---

const annotations = new Map()
const waiters = [] // Array of { resolve } for watch_annotations
let nextId = 1

function addAnnotation(data) {
  const id = String(nextId++)
  const annotation = {
    id,
    frameId: data.frameId ?? '',
    componentName: data.componentName ?? '',
    props: data.props ?? {},
    selector: data.selector ?? '',
    elementTag: data.elementTag ?? '',
    elementClasses: data.elementClasses ?? '',
    elementText: data.elementText ?? '',
    computedStyles: data.computedStyles ?? {},
    comment: data.comment ?? '',
    timestamp: Date.now(),
    status: 'pending',
  }
  annotations.set(id, annotation)

  // Unblock the oldest waiter (FIFO)
  if (waiters.length > 0) {
    const waiter = waiters.shift()
    waiter.resolve(annotation)
  }

  return annotation
}

function resolveAnnotation(id) {
  const annotation = annotations.get(id)
  if (annotation) {
    annotation.status = 'resolved'
  }
  return annotation
}

function getPending() {
  return [...annotations.values()].filter(a => a.status === 'pending')
}

function getAll() {
  return [...annotations.values()]
}

// --- HTTP server (port 4748) ---

const PORT = 4748

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', chunk => { body += chunk })
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {})
      } catch {
        reject(new Error('Invalid JSON'))
      }
    })
    req.on('error', reject)
  })
}

function sendJson(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  })
  res.end(JSON.stringify(data))
}

const httpServer = createServer(async (req, res) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    sendJson(res, 204, null)
    return
  }

  const url = new URL(req.url, `http://localhost:${PORT}`)

  try {
    // POST /annotations — receive from browser
    if (req.method === 'POST' && url.pathname === '/annotations') {
      const data = await parseBody(req)
      const annotation = addAnnotation(data)
      console.error(`[canvai-mcp] Annotation received: ${annotation.id} — "${annotation.comment}"`)
      sendJson(res, 201, annotation)
      return
    }

    // GET /annotations — list all
    if (req.method === 'GET' && url.pathname === '/annotations') {
      sendJson(res, 200, getAll())
      return
    }

    // POST /annotations/:id/resolve — mark resolved
    const resolveMatch = url.pathname.match(/^\/annotations\/(.+)\/resolve$/)
    if (req.method === 'POST' && resolveMatch) {
      const annotation = resolveAnnotation(resolveMatch[1])
      if (annotation) {
        sendJson(res, 200, annotation)
      } else {
        sendJson(res, 404, { error: 'Annotation not found' })
      }
      return
    }

    sendJson(res, 404, { error: 'Not found' })
  } catch (err) {
    console.error(`[canvai-mcp] HTTP error:`, err.message)
    sendJson(res, 400, { error: err.message })
  }
})

httpServer.listen(PORT, () => {
  console.error(`[canvai-mcp] HTTP server listening on port ${PORT}`)
})

// --- MCP server (stdio) ---

const mcp = new McpServer({
  name: 'canvai-annotations',
  version: '1.0.0',
})

// watch_annotations — blocks until a new annotation arrives
mcp.registerTool(
  'watch_annotations',
  {
    title: 'Watch Annotations',
    description:
      'Blocks until a new annotation arrives from the canvas. Call this in a loop to process annotations as the designer submits them. Returns the annotation with frameId, componentName, selector, comment, and computedStyles.',
  },
  async () => {
    // Check if there are already pending annotations
    const pending = getPending()
    if (pending.length > 0) {
      const annotation = pending[0]
      return {
        content: [{ type: 'text', text: JSON.stringify(annotation, null, 2) }],
      }
    }

    // Block until a new annotation arrives
    const annotation = await new Promise((resolve) => {
      waiters.push({ resolve })
    })

    return {
      content: [{ type: 'text', text: JSON.stringify(annotation, null, 2) }],
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
    const annotation = resolveAnnotation(id)
    if (!annotation) {
      return {
        content: [{ type: 'text', text: `Annotation ${id} not found.` }],
        isError: true,
      }
    }
    return {
      content: [{ type: 'text', text: `Annotation ${id} resolved.` }],
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
    const pending = getPending()
    return {
      content: [{ type: 'text', text: JSON.stringify(pending, null, 2) }],
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
    const all = getAll()
    return {
      content: [{ type: 'text', text: JSON.stringify(all, null, 2) }],
    }
  }
)

// Connect MCP over stdio
const transport = new StdioServerTransport()
await mcp.connect(transport)
console.error('[canvai-mcp] MCP server connected via stdio')
