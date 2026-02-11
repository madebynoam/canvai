#!/usr/bin/env node

import { createServer } from 'http'

// --- Annotation store ---

const annotations = new Map()
const waiters = [] // Array of { resolve } for long-poll /annotations/next
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

  // Unblock the oldest long-poll waiter (FIFO)
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

// --- HTTP server ---

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
      console.log(`[canvai] Annotation #${annotation.id}: "${annotation.comment}"`)
      sendJson(res, 201, annotation)
      return
    }

    // GET /annotations/next — long-poll, blocks until a pending annotation exists
    if (req.method === 'GET' && url.pathname === '/annotations/next') {
      const pending = getPending()
      if (pending.length > 0) {
        sendJson(res, 200, pending[0])
        return
      }

      // Block until a new annotation arrives
      const annotation = await new Promise((resolve) => {
        waiters.push({ resolve })
      })
      sendJson(res, 200, annotation)
      return
    }

    // GET /annotations — list all
    if (req.method === 'GET' && url.pathname === '/annotations') {
      const status = url.searchParams.get('status')
      if (status === 'pending') {
        sendJson(res, 200, getPending())
      } else {
        sendJson(res, 200, getAll())
      }
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
    console.error(`[canvai] HTTP error:`, err.message)
    sendJson(res, 400, { error: err.message })
  }
})

httpServer.listen(PORT, () => {
  console.log(`[canvai] Annotation server listening on port ${PORT}`)
})
