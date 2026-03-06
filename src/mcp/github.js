/**
 * bryllen — GitHub API wrapper
 *
 * All GitHub API calls go through this module.
 * Used by the HTTP server proxy (local dev).
 * The browser uses github-client.ts directly for static builds.
 */

import { execSync } from 'child_process'

const GITHUB_API = 'https://api.github.com'

// ── Repo detection ──────────────────────────────────────────────────────────

/**
 * Detect the GitHub repo from git remote origin.
 * Returns "owner/repo" or null if not detectable.
 */
export function detectRepo() {
  try {
    const remote = execSync('git remote get-url origin', {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim()

    // SSH: git@github.com:owner/repo.git
    const sshMatch = remote.match(/git@github\.com:([^/]+\/[^/.]+)/)
    if (sshMatch) return sshMatch[1]

    // HTTPS: https://github.com/owner/repo(.git)
    const httpsMatch = remote.match(/https?:\/\/github\.com\/([^/]+\/[^/.]+)/)
    if (httpsMatch) return httpsMatch[1]

    return null
  } catch {
    return null
  }
}

// ── GitHub REST API ──────────────────────────────────────────────────────────

async function ghFetch(path, { token, method = 'GET', body } = {}) {
  const res = await fetch(`${GITHUB_API}${path}`, {
    method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
      'User-Agent': 'bryllen/1.0',
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    const message = err.message ?? res.statusText
    throw Object.assign(new Error(`GitHub API ${res.status}: ${message}`), {
      status: res.status,
      ghError: err,
    })
  }

  if (res.status === 204) return null
  return res.json()
}

// ── Issues ──────────────────────────────────────────────────────────────────

export async function createIssue(repo, { title, body, labels }, token) {
  return ghFetch(`/repos/${repo}/issues`, {
    token,
    method: 'POST',
    body: { title, body, labels },
  })
}

export async function closeIssue(repo, issueNumber, token) {
  return ghFetch(`/repos/${repo}/issues/${issueNumber}`, {
    token,
    method: 'PATCH',
    body: { state: 'closed' },
  })
}

export async function reopenIssue(repo, issueNumber, token) {
  return ghFetch(`/repos/${repo}/issues/${issueNumber}`, {
    token,
    method: 'PATCH',
    body: { state: 'open' },
  })
}

export async function listIssues(repo, { labels = [], state = 'all' } = {}, token) {
  const params = new URLSearchParams({ state, per_page: '100' })
  if (labels.length) params.set('labels', labels.join(','))
  return ghFetch(`/repos/${repo}/issues?${params}`, { token })
}

export async function getIssue(repo, issueNumber, token) {
  return ghFetch(`/repos/${repo}/issues/${issueNumber}`, { token })
}

// ── Issue Comments ───────────────────────────────────────────────────────────

export async function createIssueComment(repo, issueNumber, body, token) {
  return ghFetch(`/repos/${repo}/issues/${issueNumber}/comments`, {
    token,
    method: 'POST',
    body: { body },
  })
}

export async function listIssueComments(repo, issueNumber, token) {
  return ghFetch(`/repos/${repo}/issues/${issueNumber}/comments?per_page=100`, { token })
}

export async function deleteIssueComment(repo, commentId, token) {
  return ghFetch(`/repos/${repo}/issues/comments/${commentId}`, {
    token,
    method: 'DELETE',
  })
}

// ── Reactions ────────────────────────────────────────────────────────────────
// GitHub reaction content values: +1, -1, laugh, confused, heart, hooray, rocket, eyes

const EMOJI_TO_CONTENT = {
  '👍': '+1',
  '👎': '-1',
  '😄': 'laugh',
  '🤔': 'confused',
  '❤️': 'heart',
  '🎉': 'hooray',
  '🔥': 'hooray',   // bryllen uses 🔥, GitHub maps to hooray
  '🚀': 'rocket',
  '👀': 'eyes',
}

const CONTENT_TO_EMOJI = {
  '+1': '👍',
  '-1': '👎',
  'laugh': '😄',
  'confused': '🤔',
  'heart': '❤️',
  'hooray': '🔥',   // display hooray as 🔥 in bryllen
  'rocket': '🚀',
  'eyes': '👀',
}

export async function addCommentReaction(repo, commentId, emoji, token) {
  const content = EMOJI_TO_CONTENT[emoji]
  if (!content) throw new Error(`Unsupported reaction emoji: ${emoji}`)
  return ghFetch(`/repos/${repo}/issues/comments/${commentId}/reactions`, {
    token,
    method: 'POST',
    body: { content },
  })
}

export async function removeCommentReaction(repo, commentId, reactionId, token) {
  return ghFetch(`/repos/${repo}/issues/comments/${commentId}/reactions/${reactionId}`, {
    token,
    method: 'DELETE',
  })
}

export async function listCommentReactions(repo, commentId, token) {
  const reactions = await ghFetch(
    `/repos/${repo}/issues/comments/${commentId}/reactions`,
    { token },
  )
  // Normalize into grouped emoji → { emoji, count, viewerHasReacted, reactionIds }
  const groups = {}
  for (const r of reactions) {
    const emoji = CONTENT_TO_EMOJI[r.content] ?? r.content
    if (!groups[emoji]) groups[emoji] = { emoji, count: 0, viewerHasReacted: false, reactionIds: [] }
    groups[emoji].count++
    groups[emoji].reactionIds.push(r.id)
  }
  return Object.values(groups)
}

// ── Auth ─────────────────────────────────────────────────────────────────────

export async function getAuthenticatedUser(token) {
  return ghFetch('/user', { token })
}

// ── Issue body format ─────────────────────────────────────────────────────────

/**
 * Build the structured issue body.
 * Metadata lives in an HTML comment block (parseable by bryllen, readable on GitHub).
 */
export function buildIssueBody(meta, comment) {
  const metaBlock = `<!-- bryllen:meta\n${JSON.stringify(meta, null, 2)}\n-->`
  const footer = `---\n*Posted from [bryllen](https://github.com/madebynoam/bryllen) canvas*`
  return `${metaBlock}\n\n${comment}\n\n${footer}`
}

export function parseIssueBody(body) {
  if (!body) return { meta: null, comment: '' }
  const metaMatch = body.match(/<!--\s*bryllen:meta\s*([\s\S]+?)\s*-->/)
  if (!metaMatch) return { meta: null, comment: body }
  try {
    const meta = JSON.parse(metaMatch[1])
    const withoutMeta = body.replace(/<!--[\s\S]+?-->\s*/, '')
    const comment = withoutMeta.replace(/\s*---\s*\*Posted from \[bryllen\][\s\S]*$/, '').trim()
    return { meta, comment }
  } catch {
    return { meta: null, comment: body }
  }
}

/**
 * Convert a GitHub Issue + its comments into a CommentThread.
 * ghComments: array from listIssueComments()
 */
export function issueToThread(issue, ghComments = []) {
  const { meta, comment } = parseIssueBody(issue.body)

  const author = {
    login: issue.user.login,
    avatarUrl: issue.user.avatar_url,
    name: issue.user.name ?? undefined,
  }

  const messages = [
    {
      id: `issue-${issue.number}`,
      author,
      body: comment,
      reactions: [],
      createdAt: issue.created_at,
      isOriginal: true,
    },
    ...ghComments.map(c => ({
      id: `comment-${c.id}`,
      ghCommentId: c.id,
      author: {
        login: c.user.login,
        avatarUrl: c.user.avatar_url,
        name: c.user.name ?? undefined,
      },
      body: c.body,
      reactions: [],
      createdAt: c.created_at,
      isOriginal: false,
    })),
  ]

  return {
    id: String(issue.number),
    ghIssueNumber: issue.number,
    ghIssueUrl: issue.html_url,
    frameId: meta?.frameId ?? '',
    componentName: meta?.componentName ?? '',
    selector: meta?.selector ?? '',
    elementTag: meta?.elementTag ?? '',
    elementText: meta?.elementText ?? '',
    computedStyles: meta?.computedStyles ?? {},
    author,
    messages,
    status: issue.state === 'open' ? 'open' : 'resolved',
    annotationId: meta?.annotationId ?? undefined,
    createdAt: issue.created_at,
    updatedAt: issue.updated_at,
  }
}

/**
 * Build the issue title from metadata.
 */
export function buildIssueTitle(componentName, elementTag, comment) {
  const firstLine = comment.split('\n')[0].slice(0, 60)
  return `[bryllen] ${componentName} · ${elementTag} — ${firstLine}`
}
