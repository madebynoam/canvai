#!/usr/bin/env node

import { createServer } from 'http'
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'fs'
import { execSync } from 'child_process'
import { join } from 'path'
import {
  initiateDeviceFlow,
  pollForToken,
  getStoredUser,
  getStoredToken,
  clearAuth,
} from './auth.js'
import {
  detectRepo,
  createIssue,
  closeIssue,
  reopenIssue,
  listIssues,
  getIssue,
  createIssueComment,
  listIssueComments,
  deleteIssueComment,
  addCommentReaction,
  removeCommentReaction,
  issueToThread,
  buildIssueBody,
  buildIssueTitle,
} from './github.js'

// --- Playwright (lazy) ---

let _browser = null
let _page = null

async function getPage() {
  if (_page) return _page

  let chromium
  try {
    const pw = await import('playwright')
    chromium = pw.chromium
  } catch {
    return null // playwright not installed
  }

  _browser = await chromium.launch({ headless: true })
  _page = await _browser.newPage()
  await _page.setViewportSize({ width: 1920, height: 1080 })
  await _page.goto('http://localhost:5173', { waitUntil: 'load' })
  await _page.waitForSelector('[data-frame-id]', { timeout: 15000 })
  return _page
}

function closeBrowser() {
  if (_browser) {
    _browser.close().catch(() => {})
    _browser = null
    _page = null
  }
}

process.on('SIGTERM', closeBrowser)
process.on('exit', closeBrowser)

// --- Persistence ---

const STORE_DIR = join(process.cwd(), '.bryllen')
const STORE_FILE = join(STORE_DIR, 'annotations.json')

function loadAnnotations() {
  try {
    if (existsSync(STORE_FILE)) {
      const data = JSON.parse(readFileSync(STORE_FILE, 'utf8'))
      if (Array.isArray(data)) {
        for (const a of data) annotations.set(a.id, a)
        if (data.length > 0) {
          nextId = Math.max(...data.map(a => Number(a.id))) + 1
        }
      }
    }
  } catch {
    // Corrupt file — start fresh
  }
}

function persistAnnotations() {
  try {
    if (!existsSync(STORE_DIR)) mkdirSync(STORE_DIR, { recursive: true })
    writeFileSync(STORE_FILE, JSON.stringify([...annotations.values()], null, 2))
  } catch (err) {
    console.error('[bryllen] Failed to persist annotations:', err.message)
  }
}

// --- Annotation store ---

const annotations = new Map()
const waiters = [] // Array of { resolve } for long-poll /annotations/next
const sseClients = [] // Array of response objects for SSE
let nextId = 1

// Load persisted annotations on startup
loadAnnotations()

function addAnnotation(data) {
  const id = String(nextId++)
  const isImmediate = data.type === 'iteration' || data.type === 'project' || data.type === 'prompt-request' || data.type === 'share' || data.type === 'pick'
  // Handle frameIds array: default to [frameId] if only single frameId provided
  const frameIds = data.frameIds ?? (data.frameId ? [data.frameId] : [])
  const annotation = {
    id,
    type: isImmediate ? data.type : 'annotation',
    project: data.project ?? '',
    frameId: data.frameId ?? '',
    frameIds,  // Include frameIds array for multi-select
    componentName: data.componentName ?? '',
    props: data.props ?? {},
    selector: data.selector ?? '',
    elementTag: data.elementTag ?? '',
    elementClasses: data.elementClasses ?? '',
    elementText: data.elementText ?? '',
    computedStyles: data.computedStyles ?? {},
    comment: data.comment ?? '',
    timestamp: Date.now(),
    status: isImmediate ? 'pending' : 'draft',
    mode: data.mode ?? 'refine',
  }
  annotations.set(id, annotation)
  persistAnnotations()

  // Immediate annotations (iteration, project, prompt-request) skip draft — immediately unblock a waiter
  if (isImmediate) {
    if (waiters.length > 0) {
      const waiter = waiters.shift()
      waiter.resolve(annotation)
    }
    // Notify SSE clients
    let sseType
    if (data.type === 'project') sseType = 'project-pending'
    else if (data.type === 'prompt-request') sseType = 'prompt-requested'
    else if (data.type === 'share') sseType = 'share-pending'
    else if (data.type === 'pick') sseType = 'pick-pending'
    else sseType = 'iteration-pending'
    for (const client of sseClients) {
      client.write(`data: ${JSON.stringify({ type: sseType, id })}\n\n`)
    }
  }

  return annotation
}

function applyAnnotation(id) {
  const annotation = annotations.get(id)
  if (!annotation || annotation.status !== 'draft') return null
  annotation.status = 'pending'
  persistAnnotations()

  // Unblock oldest long-poll waiter
  if (waiters.length > 0) {
    const waiter = waiters.shift()
    waiter.resolve(annotation)
  }

  // Notify SSE clients
  for (const client of sseClients) {
    client.write(`data: ${JSON.stringify({ type: 'applied', id })}\n\n`)
  }

  return annotation
}

function applyAllAnnotations() {
  const applied = []
  for (const annotation of annotations.values()) {
    if (annotation.status === 'draft') {
      annotation.status = 'pending'
      applied.push(annotation)
    }
  }
  if (applied.length === 0) return applied
  persistAnnotations()

  // Unblock waiters for each applied annotation (FIFO)
  for (const annotation of applied) {
    if (waiters.length > 0) {
      const waiter = waiters.shift()
      waiter.resolve(annotation)
    }
  }

  // Notify SSE clients
  for (const client of sseClients) {
    client.write(`data: ${JSON.stringify({ type: 'applied-all', ids: applied.map(a => a.id) })}\n\n`)
  }

  return applied
}

function autoCommit(annotation) {
  try {
    // Check if there are staged or unstaged changes in src/projects/
    const status = execSync('git status --porcelain src/projects/', { encoding: 'utf8' }).trim()
    if (!status) return // nothing to commit

    execSync('git add src/projects/', { stdio: 'ignore' })

    const comment = (annotation.comment || '').slice(0, 72).replace(/'/g, "'\\''")
    const prefix = (annotation.type === 'iteration' || annotation.type === 'project') ? 'feat' : 'style'
    const msg = `${prefix}: annotation #${annotation.id} — ${comment}`

    execSync(`git commit -m '${msg}'`, { stdio: 'ignore' })
    console.log(`[bryllen] Auto-committed: ${msg}`)

    // Notify SSE clients about the commit
    for (const client of sseClients) {
      client.write(`data: ${JSON.stringify({ type: 'committed', id: annotation.id, message: msg })}\n\n`)
    }
  } catch {
    // Silent — git not available, no repo, or nothing to commit
  }
}

function resolveAnnotation(id, navigateTo = null) {
  const annotation = annotations.get(id)
  if (annotation) {
    annotation.status = 'resolved'
    delete annotation.progress // Clear progress on resolve
    persistAnnotations()
    // Notify all SSE clients
    for (const client of sseClients) {
      client.write(`data: ${JSON.stringify({ type: 'resolved', id })}\n\n`)
      // If navigation requested (e.g., after creating a new iteration), send navigate event
      if (navigateTo) {
        client.write(`data: ${JSON.stringify({ type: 'navigate', iteration: navigateTo })}\n\n`)
      }
    }
    // Auto-commit project changes
    autoCommit(annotation)
  }
  return annotation
}

function updateProgress(id, message) {
  const annotation = annotations.get(id)
  if (annotation && annotation.status === 'pending') {
    annotation.progress = message
    // Notify all SSE clients
    for (const client of sseClients) {
      client.write(`data: ${JSON.stringify({ type: 'progress', id, message })}\n\n`)
    }
    return annotation
  }
  return null
}

function deleteAnnotation(id) {
  const annotation = annotations.get(id)
  if (!annotation) return null
  annotations.delete(id)
  persistAnnotations()
  // Notify all SSE clients
  for (const client of sseClients) {
    client.write(`data: ${JSON.stringify({ type: 'deleted', id })}\n\n`)
  }
  return annotation
}

function getPending() {
  return [...annotations.values()].filter(a => a.status === 'pending')
}

function getDrafts() {
  return [...annotations.values()].filter(a => a.status === 'draft')
}

function getAll() {
  return [...annotations.values()]
}

// --- Comment SSE ---

const commentSseClients = []

function broadcastCommentEvent(event) {
  const payload = `data: ${JSON.stringify(event)}\n\n`
  for (const client of commentSseClients) {
    client.write(payload)
  }
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
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
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
    // ── Annotation SSE ───────────────────────────────────────────────────────

    if (req.method === 'GET' && url.pathname === '/annotations/events') {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
      })
      res.write('\n')
      sseClients.push(res)
      req.on('close', () => {
        const idx = sseClients.indexOf(res)
        if (idx !== -1) sseClients.splice(idx, 1)
      })
      return
    }

    // POST /annotations — receive from browser
    if (req.method === 'POST' && url.pathname === '/annotations') {
      const data = await parseBody(req)
      const annotation = addAnnotation(data)
      console.log(`[bryllen] Annotation #${annotation.id}: "${annotation.comment}"`)
      sendJson(res, 201, annotation)
      return
    }

    // GET /annotations/next — long-poll with timeout, returns pending annotation or { timeout: true }
    if (req.method === 'GET' && url.pathname === '/annotations/next') {
      const pending = getPending()
      if (pending.length > 0) {
        sendJson(res, 200, pending[0])
        return
      }

      const timeoutMs = Number(url.searchParams.get('timeout')) || 30000

      const annotation = await new Promise((resolve) => {
        const waiter = { resolve }
        waiters.push(waiter)

        const timer = setTimeout(() => {
          const idx = waiters.indexOf(waiter)
          if (idx !== -1) {
            waiters.splice(idx, 1)
            resolve(null)
          }
        }, timeoutMs)

        // Wrap resolve to clear the timer when an annotation arrives
        const original = waiter.resolve
        waiter.resolve = (value) => {
          clearTimeout(timer)
          original(value)
        }

        req.on('close', () => {
          clearTimeout(timer)
          const idx = waiters.indexOf(waiter)
          if (idx !== -1) waiters.splice(idx, 1)
        })
      })

      if (annotation === null) {
        sendJson(res, 200, { timeout: true })
      } else {
        sendJson(res, 200, annotation)
      }
      return
    }

    // POST /annotations/apply — apply all drafts
    if (req.method === 'POST' && url.pathname === '/annotations/apply') {
      const applied = applyAllAnnotations()
      sendJson(res, 200, applied)
      return
    }

    // POST /annotations/:id/apply — apply single draft
    const applyMatch = url.pathname.match(/^\/annotations\/(.+)\/apply$/)
    if (req.method === 'POST' && applyMatch) {
      const annotation = applyAnnotation(applyMatch[1])
      if (annotation) {
        sendJson(res, 200, annotation)
      } else {
        sendJson(res, 404, { error: 'Annotation not found or not a draft' })
      }
      return
    }

    // GET /annotations — list all (with optional ?status= filter)
    if (req.method === 'GET' && url.pathname === '/annotations') {
      const status = url.searchParams.get('status')
      if (status === 'pending') {
        sendJson(res, 200, getPending())
      } else if (status === 'draft') {
        sendJson(res, 200, getDrafts())
      } else {
        sendJson(res, 200, getAll())
      }
      return
    }

    // POST /annotations/:id/resolve — mark resolved
    // Body can include { navigate: "V8" } to trigger UI navigation
    const resolveMatch = url.pathname.match(/^\/annotations\/(.+)\/resolve$/)
    if (req.method === 'POST' && resolveMatch) {
      let navigateTo = null
      // Parse optional body for navigation
      let body = ''
      req.on('data', chunk => { body += chunk })
      req.on('end', () => {
        try {
          if (body) {
            const parsed = JSON.parse(body)
            navigateTo = parsed.navigate || null
          }
        } catch { /* ignore parse errors */ }

        const annotation = resolveAnnotation(resolveMatch[1], navigateTo)
        if (annotation) {
          sendJson(res, 200, annotation)
        } else {
          sendJson(res, 404, { error: 'Annotation not found' })
        }
      })
      return
    }

    // POST /annotations/:id/progress — update progress message
    const progressMatch = url.pathname.match(/^\/annotations\/(.+)\/progress$/)
    if (req.method === 'POST' && progressMatch) {
      let body = ''
      req.on('data', chunk => { body += chunk })
      req.on('end', () => {
        try {
          const { message } = JSON.parse(body)
          const annotation = updateProgress(progressMatch[1], message)
          if (annotation) {
            sendJson(res, 200, { id: annotation.id, progress: message })
          } else {
            sendJson(res, 404, { error: 'Annotation not found or not pending' })
          }
        } catch (err) {
          sendJson(res, 400, { error: 'Invalid JSON' })
        }
      })
      return
    }

    // DELETE /annotations/:id — delete an annotation
    const deleteAnnotationMatch = url.pathname.match(/^\/annotations\/(\d+)$/)
    if (req.method === 'DELETE' && deleteAnnotationMatch) {
      const annotation = deleteAnnotation(deleteAnnotationMatch[1])
      if (annotation) {
        console.log(`[bryllen] Annotation #${deleteAnnotationMatch[1]} deleted`)
        sendJson(res, 200, annotation)
      } else {
        sendJson(res, 404, { error: 'Annotation not found' })
      }
      return
    }

    // ── Auth routes ──────────────────────────────────────────────────────────

    // POST /auth/device-code — initiate device flow
    if (req.method === 'POST' && url.pathname === '/auth/device-code') {
      const flow = await initiateDeviceFlow()
      sendJson(res, 200, flow)
      return
    }

    // POST /auth/poll — poll for token
    if (req.method === 'POST' && url.pathname === '/auth/poll') {
      const { device_code } = await parseBody(req)
      if (!device_code) {
        sendJson(res, 400, { error: 'device_code required' })
        return
      }
      const result = await pollForToken(device_code)
      sendJson(res, 200, result)
      return
    }

    // GET /auth/user — return current authenticated user
    if (req.method === 'GET' && url.pathname === '/auth/user') {
      const user = getStoredUser()
      if (!user) {
        sendJson(res, 401, { error: 'Not authenticated' })
      } else {
        sendJson(res, 200, user)
      }
      return
    }

    // POST /auth/logout — clear stored token
    if (req.method === 'POST' && url.pathname === '/auth/logout') {
      clearAuth()
      sendJson(res, 200, { ok: true })
      return
    }

    // ── Comment SSE ──────────────────────────────────────────────────────────

    if (req.method === 'GET' && url.pathname === '/comments/events') {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
      })
      res.write('\n')
      commentSseClients.push(res)
      req.on('close', () => {
        const idx = commentSseClients.indexOf(res)
        if (idx !== -1) commentSseClients.splice(idx, 1)
      })
      return
    }

    // ── Comment routes (require auth + repo) ─────────────────────────────────

    const repo = detectRepo()
    const token = getStoredToken()

    // GET /comments — list all comment threads for this project
    if (req.method === 'GET' && url.pathname === '/comments') {
      if (!repo) { sendJson(res, 503, { error: 'Cannot detect GitHub repo from git remote' }); return }
      const issues = await listIssues(repo, { labels: ['bryllen-comment'] }, token)
      const threads = await Promise.all(
        issues.map(async issue => {
          const comments = await listIssueComments(repo, issue.number, token)
          return issueToThread(issue, comments)
        })
      )
      sendJson(res, 200, threads)
      return
    }

    // GET /comments/:id — get thread with all messages
    const commentIdMatch = url.pathname.match(/^\/comments\/(\d+)$/)
    if (req.method === 'GET' && commentIdMatch) {
      if (!repo) { sendJson(res, 503, { error: 'Cannot detect GitHub repo' }); return }
      const issueNumber = Number(commentIdMatch[1])
      const [issue, ghComments] = await Promise.all([
        getIssue(repo, issueNumber, token),
        listIssueComments(repo, issueNumber, token),
      ])
      sendJson(res, 200, issueToThread(issue, ghComments))
      return
    }

    // POST /comments — create new thread (creates GitHub Issue)
    if (req.method === 'POST' && url.pathname === '/comments') {
      if (!repo) { sendJson(res, 503, { error: 'Cannot detect GitHub repo' }); return }
      if (!token) { sendJson(res, 401, { error: 'Not authenticated' }); return }
      const data = await parseBody(req)
      const { frameId, componentName, selector, elementTag, elementText, computedStyles, comment } = data

      const meta = { frameId, componentName, selector, elementTag, elementText, computedStyles }
      const body = buildIssueBody(meta, comment)
      const title = buildIssueTitle(componentName, elementTag, comment)

      const issue = await createIssue(repo, {
        title,
        body,
        labels: ['bryllen-comment'],
      }, token)

      const thread = issueToThread(issue, [])
      broadcastCommentEvent({ type: 'comment-created', thread })
      console.log(`[bryllen] Comment thread #${issue.number} created`)
      sendJson(res, 201, thread)
      return
    }

    // POST /comments/:id/replies — add reply
    const replyMatch = url.pathname.match(/^\/comments\/(\d+)\/replies$/)
    if (req.method === 'POST' && replyMatch) {
      if (!repo) { sendJson(res, 503, { error: 'Cannot detect GitHub repo' }); return }
      if (!token) { sendJson(res, 401, { error: 'Not authenticated' }); return }
      const issueNumber = Number(replyMatch[1])
      const { body } = await parseBody(req)
      const ghComment = await createIssueComment(repo, issueNumber, body, token)
      const message = {
        id: `comment-${ghComment.id}`,
        ghCommentId: ghComment.id,
        author: {
          login: ghComment.user.login,
          avatarUrl: ghComment.user.avatar_url,
          name: ghComment.user.name ?? undefined,
        },
        body: ghComment.body,
        reactions: [],
        createdAt: ghComment.created_at,
        isOriginal: false,
      }
      broadcastCommentEvent({ type: 'reply-added', threadId: String(issueNumber), message })
      sendJson(res, 201, message)
      return
    }

    // POST /comments/:id/resolve — resolve thread (close GitHub Issue)
    const resolveCommentMatch = url.pathname.match(/^\/comments\/(\d+)\/resolve$/)
    if (req.method === 'POST' && resolveCommentMatch) {
      if (!repo) { sendJson(res, 503, { error: 'Cannot detect GitHub repo' }); return }
      if (!token) { sendJson(res, 401, { error: 'Not authenticated' }); return }
      const issueNumber = Number(resolveCommentMatch[1])
      await closeIssue(repo, issueNumber, token)
      broadcastCommentEvent({ type: 'comment-resolved', threadId: String(issueNumber) })
      sendJson(res, 200, { ok: true })
      return
    }

    // POST /comments/:id/reopen — reopen thread
    const reopenMatch = url.pathname.match(/^\/comments\/(\d+)\/reopen$/)
    if (req.method === 'POST' && reopenMatch) {
      if (!repo) { sendJson(res, 503, { error: 'Cannot detect GitHub repo' }); return }
      if (!token) { sendJson(res, 401, { error: 'Not authenticated' }); return }
      const issueNumber = Number(reopenMatch[1])
      await reopenIssue(repo, issueNumber, token)
      broadcastCommentEvent({ type: 'comment-reopened', threadId: String(issueNumber) })
      sendJson(res, 200, { ok: true })
      return
    }

    // DELETE /comments/:id — delete thread (close + lock issue)
    const deleteCommentMatch = url.pathname.match(/^\/comments\/(\d+)$/)
    if (req.method === 'DELETE' && deleteCommentMatch) {
      if (!repo) { sendJson(res, 503, { error: 'Cannot detect GitHub repo' }); return }
      if (!token) { sendJson(res, 401, { error: 'Not authenticated' }); return }
      const issueNumber = Number(deleteCommentMatch[1])
      await closeIssue(repo, issueNumber, token)
      sendJson(res, 200, { ok: true })
      return
    }

    // DELETE /comments/:threadId/messages/:msgId — delete a reply (GitHub comment)
    const deleteMessageMatch = url.pathname.match(/^\/comments\/(\d+)\/messages\/comment-(\d+)$/)
    if (req.method === 'DELETE' && deleteMessageMatch) {
      if (!repo) { sendJson(res, 503, { error: 'Cannot detect GitHub repo' }); return }
      if (!token) { sendJson(res, 401, { error: 'Not authenticated' }); return }
      const commentId = Number(deleteMessageMatch[2])
      await deleteIssueComment(repo, commentId, token)
      sendJson(res, 200, { ok: true })
      return
    }

    // POST /comments/:id/messages/:msgId/reactions — toggle reaction on a message
    const reactionMatch = url.pathname.match(/^\/comments\/(\d+)\/messages\/comment-(\d+)\/reactions$/)
    if (req.method === 'POST' && reactionMatch) {
      if (!repo) { sendJson(res, 503, { error: 'Cannot detect GitHub repo' }); return }
      if (!token) { sendJson(res, 401, { error: 'Not authenticated' }); return }
      const threadId = reactionMatch[1]
      const commentId = Number(reactionMatch[2])
      const { emoji, remove, reactionId } = await parseBody(req)

      let reactions
      if (remove && reactionId) {
        await removeCommentReaction(repo, commentId, reactionId, token)
        reactions = []  // client will re-fetch
      } else {
        await addCommentReaction(repo, commentId, emoji, token)
        reactions = []  // client will re-fetch
      }

      broadcastCommentEvent({ type: 'reaction-toggled', threadId, messageId: `comment-${commentId}`, reactions })
      sendJson(res, 200, { ok: true })
      return
    }

    // POST /comments/:id/annotate — promote comment to annotation
    const annotateMatch = url.pathname.match(/^\/comments\/(\d+)\/annotate$/)
    if (req.method === 'POST' && annotateMatch) {
      if (!repo) { sendJson(res, 503, { error: 'Cannot detect GitHub repo' }); return }
      const issueNumber = Number(annotateMatch[1])
      const data = await parseBody(req)

      // Create annotation via existing flow
      const annotation = addAnnotation({
        project: data.project ?? '',
        frameId: data.frameId ?? '',
        componentName: data.componentName ?? '',
        selector: data.selector ?? '',
        elementTag: data.elementTag ?? '',
        elementText: data.elementText ?? '',
        computedStyles: data.computedStyles ?? {},
        comment: data.comment ?? '',
      })

      console.log(`[bryllen] Comment #${issueNumber} promoted to annotation #${annotation.id}`)
      sendJson(res, 201, { annotationId: annotation.id })
      return
    }

    // ── Context images routes ─────────────────────────────────────────────────

    // POST /context — save a context image from paste
    // Supports optional `page` param for per-page storage (defaults to root context/)
    if (req.method === 'POST' && url.pathname === '/context') {
      const data = await parseBody(req)
      const { project, iteration, page, dataUrl, filename } = data

      if (!project || !iteration || !dataUrl) {
        sendJson(res, 400, { error: 'project, iteration, and dataUrl are required' })
        return
      }

      // Parse data URL: data:image/png;base64,<data>
      const match = dataUrl.match(/^data:image\/([^;]+);base64,(.+)$/)
      if (!match) {
        sendJson(res, 400, { error: 'Invalid dataUrl format' })
        return
      }

      const ext = match[1] === 'jpeg' ? 'jpg' : match[1]
      const base64Data = match[2]
      const buffer = Buffer.from(base64Data, 'base64')

      // Build path: src/projects/<project>/<iteration>/context/<page?>/<filename>
      const projectDir = join(process.cwd(), 'src', 'projects', project)
      const contextDir = page
        ? join(projectDir, iteration, 'context', page)
        : join(projectDir, iteration, 'context')
      const finalFilename = filename || `context-${Date.now()}.${ext}`
      const filepath = join(contextDir, finalFilename)

      // Ensure context directory exists
      if (!existsSync(contextDir)) {
        mkdirSync(contextDir, { recursive: true })
      }

      writeFileSync(filepath, buffer)
      console.log(`[bryllen] Context image saved: ${filepath}`)

      const relativePath = page ? `context/${page}/${finalFilename}` : `context/${finalFilename}`
      sendJson(res, 201, { path: relativePath, filename: finalFilename, absolutePath: filepath, page: page || null })
      return
    }

    // GET /context — list context images for a project/iteration (optionally per-page)
    if (req.method === 'GET' && url.pathname === '/context') {
      const project = url.searchParams.get('project')
      const iteration = url.searchParams.get('iteration')
      const page = url.searchParams.get('page') // optional — if provided, gets per-page images

      if (!project || !iteration) {
        sendJson(res, 400, { error: 'project and iteration query params are required' })
        return
      }

      const contextDir = page
        ? join(process.cwd(), 'src', 'projects', project, iteration, 'context', page)
        : join(process.cwd(), 'src', 'projects', project, iteration, 'context')

      if (!existsSync(contextDir)) {
        sendJson(res, 200, { images: [], positions: {} })
        return
      }

      const { readdirSync, statSync } = await import('fs')
      // Only list files, not subdirectories (subdirs are per-page folders)
      const files = readdirSync(contextDir).filter(f => {
        const fpath = join(contextDir, f)
        return statSync(fpath).isFile() && /\.(png|jpg|jpeg|gif|webp)$/i.test(f)
      })

      // Load positions from positions.json if it exists
      const positionsFile = join(contextDir, 'positions.json')
      let positions = {}
      if (existsSync(positionsFile)) {
        try {
          positions = JSON.parse(readFileSync(positionsFile, 'utf8'))
        } catch {}
      }

      const images = files.map(filename => ({
        filename,
        path: page ? `context/${page}/${filename}` : `context/${filename}`,
        // Build URL for browser to fetch the image
        url: `/context-image?project=${encodeURIComponent(project)}&iteration=${encodeURIComponent(iteration)}${page ? `&page=${encodeURIComponent(page)}` : ''}&filename=${encodeURIComponent(filename)}`,
      }))

      sendJson(res, 200, { images, positions, page: page || null })
      return
    }

    // PUT /context-positions — save context image positions (optionally per-page)
    if (req.method === 'PUT' && url.pathname === '/context-positions') {
      let body = ''
      req.on('data', chunk => { body += chunk })
      req.on('end', async () => {
        try {
          const { project, iteration, page, positions } = JSON.parse(body)
          if (!project || !iteration || !positions) {
            sendJson(res, 400, { error: 'project, iteration, and positions are required' })
            return
          }

          const contextDir = page
            ? join(process.cwd(), 'src', 'projects', project, iteration, 'context', page)
            : join(process.cwd(), 'src', 'projects', project, iteration, 'context')
          if (!existsSync(contextDir)) {
            mkdirSync(contextDir, { recursive: true })
          }

          const positionsFile = join(contextDir, 'positions.json')
          writeFileSync(positionsFile, JSON.stringify(positions, null, 2))
          sendJson(res, 200, { saved: true })
        } catch (err) {
          sendJson(res, 500, { error: err.message })
        }
      })
      return
    }

    // GET /context-image — serve a context image file (optionally per-page)
    if (req.method === 'GET' && url.pathname === '/context-image') {
      const project = url.searchParams.get('project')
      const iteration = url.searchParams.get('iteration')
      const page = url.searchParams.get('page') // optional
      const filename = url.searchParams.get('filename')

      if (!project || !iteration || !filename) {
        sendJson(res, 400, { error: 'project, iteration, and filename query params are required' })
        return
      }

      const filepath = page
        ? join(process.cwd(), 'src', 'projects', project, iteration, 'context', page, filename)
        : join(process.cwd(), 'src', 'projects', project, iteration, 'context', filename)

      if (!existsSync(filepath)) {
        sendJson(res, 404, { error: 'Image not found' })
        return
      }

      const imageData = readFileSync(filepath)
      const ext = filename.split('.').pop()?.toLowerCase()
      const mimeTypes = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp' }
      const contentType = mimeTypes[ext] || 'application/octet-stream'

      res.writeHead(200, {
        'Content-Type': contentType,
        'Content-Length': imageData.length,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'max-age=3600',
      })
      res.end(imageData)
      return
    }

    // DELETE /context — delete a context image (optionally per-page)
    if (req.method === 'DELETE' && url.pathname === '/context') {
      const project = url.searchParams.get('project')
      const iteration = url.searchParams.get('iteration')
      const page = url.searchParams.get('page') // optional
      const filename = url.searchParams.get('filename')

      if (!project || !iteration || !filename) {
        sendJson(res, 400, { error: 'project, iteration, and filename query params are required' })
        return
      }

      const filepath = page
        ? join(process.cwd(), 'src', 'projects', project, iteration, 'context', page, filename)
        : join(process.cwd(), 'src', 'projects', project, iteration, 'context', filename)

      if (!existsSync(filepath)) {
        sendJson(res, 404, { error: 'Image not found' })
        return
      }

      const { unlinkSync } = await import('fs')
      unlinkSync(filepath)
      console.log(`[bryllen] Context image deleted: ${filepath}`)
      sendJson(res, 200, { deleted: true, filename })
      return
    }

    // ── Frame positions routes ─────────────────────────────────────────────

    // GET /frame-positions — load frame positions for a page
    if (req.method === 'GET' && url.pathname === '/frame-positions') {
      const project = url.searchParams.get('project')
      const page = url.searchParams.get('page')

      if (!project || !page) {
        sendJson(res, 400, { error: 'project and page query params are required' })
        return
      }

      const positionsFile = join(STORE_DIR, 'frame-positions', project, `${page}.json`)
      if (!existsSync(positionsFile)) {
        sendJson(res, 200, { positions: null })
        return
      }

      try {
        const positions = JSON.parse(readFileSync(positionsFile, 'utf8'))
        sendJson(res, 200, { positions })
      } catch {
        sendJson(res, 200, { positions: null })
      }
      return
    }

    // PUT /frame-positions — save frame positions for a page
    if (req.method === 'PUT' && url.pathname === '/frame-positions') {
      const data = await parseBody(req)
      const { project, page, positions } = data

      if (!project || !page || !positions) {
        sendJson(res, 400, { error: 'project, page, and positions are required' })
        return
      }

      const positionsDir = join(STORE_DIR, 'frame-positions', project)
      if (!existsSync(positionsDir)) {
        mkdirSync(positionsDir, { recursive: true })
      }

      const positionsFile = join(positionsDir, `${page}.json`)
      writeFileSync(positionsFile, JSON.stringify(positions, null, 2))
      sendJson(res, 200, { saved: true })
      return
    }

    // ── Screenshot route ────────────────────────────────────────────────────

    if (req.method === 'GET' && url.pathname === '/screenshot') {
      const page = await getPage()
      if (!page) {
        sendJson(res, 503, {
          error: 'playwright not installed',
          install: 'npx playwright install chromium',
        })
        return
      }

      const frameId = url.searchParams.get('frame')
      const projectName = url.searchParams.get('project')
      const iterationName = url.searchParams.get('iteration')
      const pageName = url.searchParams.get('page')
      const delay = Number(url.searchParams.get('delay')) || 500

      try {
        // Build URL with routing params
        let targetUrl = 'http://localhost:5173'
        if (projectName) {
          targetUrl += '/' + encodeURIComponent(projectName)
          if (iterationName) {
            targetUrl += '/' + encodeURIComponent(iterationName)
            if (pageName) {
              targetUrl += '/' + encodeURIComponent(pageName)
            }
          }
        }

        // Navigate to the target URL
        await page.goto(targetUrl, { waitUntil: 'load' })

        // Dismiss tour overlay for clean screenshots
        await page.evaluate(() => {
          localStorage.setItem('bryllen:tour-completed', 'true')
        })
        // Reload to apply the tour dismissal
        await page.reload({ waitUntil: 'load' })

        await new Promise(r => setTimeout(r, delay))
        await page.waitForSelector('[data-frame-id]', { timeout: 10000 })

        // Ensure screenshots directory exists
        const storeIsDir = existsSync(STORE_DIR) && statSync(STORE_DIR).isDirectory()
        const screenshotDir = storeIsDir
          ? join(STORE_DIR, 'screenshots')
          : join(process.cwd(), '.bryllen-screenshots')
        if (!existsSync(screenshotDir)) mkdirSync(screenshotDir, { recursive: true })

        const timestamp = Date.now()
        const filename = `${timestamp}.png`
        const filepath = join(screenshotDir, filename)

        if (frameId) {
          // Frame mode — screenshot a specific frame's content
          await page.evaluate(() => window.__bryllen?.fitToView())
          await new Promise(r => setTimeout(r, 300))

          const frameContent = await page.$(`[data-frame-id="${frameId}"] [data-frame-content]`)
          if (!frameContent) {
            // List available frames for debugging
            const available = await page.evaluate(() => window.__bryllen?.getFrameIds?.() ?? [])
            sendJson(res, 404, { error: `Frame "${frameId}" not found`, available })
            return
          }
          await frameContent.screenshot({ path: filepath })
        } else {
          // Page mode — fit all frames into view, screenshot canvas content
          await page.evaluate(() => window.__bryllen?.fitToView())
          await new Promise(r => setTimeout(r, 300))

          const canvasContent = await page.$('[data-canvas-content]')
          if (!canvasContent) {
            sendJson(res, 500, { error: 'Canvas content element not found' })
            return
          }
          // Use page screenshot since canvas content may have visibility issues
          await page.screenshot({ path: filepath })
        }

        const relPath = screenshotDir.replace(process.cwd() + '/', '') + '/' + filename
        sendJson(res, 200, { path: relPath, absolutePath: filepath })
      } catch (err) {
        // Reset browser on errors so next call gets a fresh instance
        closeBrowser()
        sendJson(res, 500, { error: `Screenshot failed: ${err.message}` })
      }
      return
    }

    sendJson(res, 404, { error: 'Not found' })
  } catch (err) {
    console.error(`[bryllen] HTTP error:`, err.message)
    sendJson(res, err.status ?? 500, { error: err.message })
  }
})

httpServer.listen(PORT, () => {
  console.log(`[bryllen] Annotation server listening on port ${PORT}`)
})
