#!/usr/bin/env node

import { createServer } from 'http'
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

// --- Annotation store ---

const annotations = new Map()
const waiters = [] // Array of { resolve } for long-poll /annotations/next
const sseClients = [] // Array of response objects for SSE
let nextId = 1
let agentWatching = false // true when agent has a long-poll waiter registered
let watchdogTimer = null

function broadcastMode(mode) {
  for (const client of sseClients) {
    client.write(`data: ${JSON.stringify({ type: 'mode', mode })}\n\n`)
  }
}

// After a waiter is consumed, the agent has ~5s to re-register before we declare manual mode
function scheduleWatchdog() {
  if (watchdogTimer) clearTimeout(watchdogTimer)
  watchdogTimer = setTimeout(() => {
    if (waiters.length === 0 && agentWatching) {
      agentWatching = false
      broadcastMode('manual')
    }
  }, 5000)
}

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
    // Agent will re-register if still in watch mode — watchdog catches if it doesn't
    scheduleWatchdog()
  }

  return annotation
}

function resolveAnnotation(id) {
  const annotation = annotations.get(id)
  if (annotation) {
    annotation.status = 'resolved'
    // Notify all SSE clients
    for (const client of sseClients) {
      client.write(`data: ${JSON.stringify({ type: 'resolved', id })}\n\n`)
    }
  }
  return annotation
}

function getPending() {
  return [...annotations.values()].filter(a => a.status === 'pending')
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
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
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

      // Agent is now watching — broadcast mode change, cancel watchdog
      if (watchdogTimer) clearTimeout(watchdogTimer)
      if (!agentWatching) {
        agentWatching = true
        broadcastMode('watch')
      }

      // Block until a new annotation arrives
      const annotation = await new Promise((resolve) => {
        const waiter = { resolve }
        waiters.push(waiter)
        // If the request closes (agent exits watch), remove waiter and update mode
        req.on('close', () => {
          const idx = waiters.indexOf(waiter)
          if (idx !== -1) waiters.splice(idx, 1)
          if (waiters.length === 0 && agentWatching) {
            agentWatching = false
            broadcastMode('manual')
          }
        })
      })
      sendJson(res, 200, annotation)
      return
    }

    // GET /mode — current agent mode
    if (req.method === 'GET' && url.pathname === '/mode') {
      sendJson(res, 200, { mode: agentWatching ? 'watch' : 'manual' })
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
      const issues = await listIssues(repo, { labels: ['canvai-comment'] }, token)
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
        labels: ['canvai-comment'],
      }, token)

      const thread = issueToThread(issue, [])
      broadcastCommentEvent({ type: 'comment-created', thread })
      console.log(`[canvai] Comment thread #${issue.number} created`)
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
        frameId: data.frameId ?? '',
        componentName: data.componentName ?? '',
        selector: data.selector ?? '',
        elementTag: data.elementTag ?? '',
        elementText: data.elementText ?? '',
        computedStyles: data.computedStyles ?? {},
        comment: data.comment ?? '',
      })

      console.log(`[canvai] Comment #${issueNumber} promoted to annotation #${annotation.id}`)
      sendJson(res, 201, { annotationId: annotation.id })
      return
    }

    sendJson(res, 404, { error: 'Not found' })
  } catch (err) {
    console.error(`[canvai] HTTP error:`, err.message)
    sendJson(res, err.status ?? 500, { error: err.message })
  }
})

httpServer.listen(PORT, () => {
  console.log(`[canvai] Annotation server listening on port ${PORT}`)
})
