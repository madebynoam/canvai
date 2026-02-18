/**
 * canvai — Browser-side GitHub API client
 *
 * Used on GitHub Pages (static builds) where there is no canvai dev server.
 * The token is stored in localStorage after the device flow completes in-browser.
 *
 * In local dev, the CommentOverlay routes through the server proxy instead.
 */

import type { CommentThread, CommentMessage, CommentAuthor, CommentReaction } from './comment-types'

// TODO: Replace with the actual canvai GitHub OAuth App Client ID
// Registered at https://github.com/settings/applications/new
// Client IDs are public — safe to commit.
export const GITHUB_CLIENT_ID = (import.meta as Record<string, unknown> & { env: Record<string, string> }).env?.VITE_GITHUB_CLIENT_ID ?? 'Ov23liXXXXXXXXXXXXXX'

const GITHUB_API = 'https://api.github.com'
const GITHUB_DEVICE_CODE_URL = 'https://github.com/login/device/code'
const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token'
const SCOPES = 'repo read:user'

const TOKEN_KEY = 'canvai_github_token'
const USER_KEY = 'canvai_github_user'

// ── Token storage (localStorage) ─────────────────────────────────────────────

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function getStoredUser(): CommentAuthor | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveAuth(token: string, user: CommentAuthor) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function isAuthenticated(): boolean {
  return !!getStoredToken()
}

// ── GitHub REST API ───────────────────────────────────────────────────────────

async function ghFetch(path: string, options: {
  token?: string | null
  method?: string
  body?: unknown
} = {}): Promise<unknown> {
  const token = options.token ?? getStoredToken()
  const res = await fetch(`${GITHUB_API}${path}`, {
    method: options.method ?? 'GET',
    headers: {
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
    },
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { message?: string }
    throw Object.assign(new Error(`GitHub API ${res.status}: ${err.message ?? res.statusText}`), {
      status: res.status,
    })
  }

  if (res.status === 204) return null
  return res.json()
}

// ── Device flow ───────────────────────────────────────────────────────────────

export interface DeviceFlowInit {
  device_code: string
  user_code: string
  verification_uri: string
  interval: number
  expires_in: number
}

/**
 * Step 1: Request a device code directly from GitHub (browser-initiated).
 * NOTE: GitHub requires the request to include the appropriate CORS headers.
 * This works because GitHub's device code endpoint supports CORS for public clients.
 */
export async function initiateDeviceFlow(): Promise<DeviceFlowInit> {
  const res = await fetch(GITHUB_DEVICE_CODE_URL, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: GITHUB_CLIENT_ID,
      scope: SCOPES,
    }),
  })

  if (!res.ok) throw new Error(`GitHub device flow failed: ${res.status}`)
  const data = await res.json() as Record<string, unknown>
  if (data.error) throw new Error(String(data.error_description ?? data.error))

  return {
    device_code: data.device_code as string,
    user_code: data.user_code as string,
    verification_uri: data.verification_uri as string,
    interval: (data.interval as number) ?? 5,
    expires_in: (data.expires_in as number) ?? 900,
  }
}

export type PollResult =
  | { status: 'success'; user: CommentAuthor }
  | { status: 'pending' }
  | { status: 'slow_down'; interval: number }
  | { status: 'expired' }
  | { status: 'error'; error: string }

/**
 * Step 2: Poll GitHub for the access token.
 */
export async function pollForToken(deviceCode: string): Promise<PollResult> {
  const res = await fetch(GITHUB_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: GITHUB_CLIENT_ID,
      device_code: deviceCode,
      grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
    }),
  })

  if (!res.ok) return { status: 'error', error: `HTTP ${res.status}` }

  const data = await res.json() as Record<string, unknown>

  if (data.error) {
    switch (data.error) {
      case 'authorization_pending': return { status: 'pending' }
      case 'slow_down': return { status: 'slow_down', interval: 5 }
      case 'expired_token': return { status: 'expired' }
      default: return { status: 'error', error: String(data.error_description ?? data.error) }
    }
  }

  if (!data.access_token) return { status: 'error', error: 'No access token' }

  const token = data.access_token as string
  const userRes = await fetch('https://api.github.com/user', {
    headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/vnd.github+json' },
  })
  const ghUser = userRes.ok ? (await userRes.json() as Record<string, unknown>) : null
  const user: CommentAuthor = ghUser
    ? { login: String(ghUser.login), avatarUrl: String(ghUser.avatar_url), name: ghUser.name ? String(ghUser.name) : undefined }
    : { login: 'unknown', avatarUrl: '' }

  saveAuth(token, user)
  return { status: 'success', user }
}

// ── Comment thread operations ─────────────────────────────────────────────────

type GHIssue = Record<string, unknown>
type GHComment = Record<string, unknown>

function parseIssueBody(body: string): { meta: Record<string, unknown> | null; comment: string } {
  if (!body) return { meta: null, comment: '' }
  const metaMatch = body.match(/<!--\s*canvai:meta\s*([\s\S]+?)\s*-->/)
  if (!metaMatch) return { meta: null, comment: body }
  try {
    const meta = JSON.parse(metaMatch[1]) as Record<string, unknown>
    const withoutMeta = body.replace(/<!--[\s\S]+?-->\s*/, '')
    const comment = withoutMeta.replace(/\s*---\s*\*Posted from \[canvai\][\s\S]*$/, '').trim()
    return { meta, comment }
  } catch {
    return { meta: null, comment: body }
  }
}

function buildIssueBody(meta: Record<string, unknown>, comment: string): string {
  const metaBlock = `<!-- canvai:meta\n${JSON.stringify(meta, null, 2)}\n-->`
  return `${metaBlock}\n\n${comment}\n\n---\n*Posted from [canvai](https://github.com/madebynoam/canvai) canvas*`
}

function issueToThread(issue: GHIssue, ghComments: GHComment[]): CommentThread {
  const { meta, comment } = parseIssueBody(String(issue.body ?? ''))
  const ghUser = issue.user as Record<string, unknown>
  const author: CommentAuthor = {
    login: String(ghUser.login),
    avatarUrl: String(ghUser.avatar_url),
    name: ghUser.name ? String(ghUser.name) : undefined,
  }

  const messages: CommentMessage[] = [
    {
      id: `issue-${issue.number}`,
      author,
      body: comment,
      reactions: [],
      createdAt: String(issue.created_at),
      isOriginal: true,
    },
    ...ghComments.map(c => {
      const cUser = c.user as Record<string, unknown>
      return {
        id: `comment-${c.id}`,
        ghCommentId: c.id as number,
        author: {
          login: String(cUser.login),
          avatarUrl: String(cUser.avatar_url),
          name: cUser.name ? String(cUser.name) : undefined,
        },
        body: String(c.body ?? ''),
        reactions: [] as CommentReaction[],
        createdAt: String(c.created_at),
        isOriginal: false,
      }
    }),
  ]

  return {
    id: String(issue.number),
    ghIssueNumber: issue.number as number,
    ghIssueUrl: String(issue.html_url),
    frameId: String(meta?.frameId ?? ''),
    componentName: String(meta?.componentName ?? ''),
    selector: String(meta?.selector ?? ''),
    elementTag: String(meta?.elementTag ?? ''),
    elementText: String(meta?.elementText ?? ''),
    computedStyles: (meta?.computedStyles ?? {}) as Record<string, string>,
    author,
    messages,
    status: issue.state === 'open' ? 'open' : 'resolved',
    annotationId: meta?.annotationId ? String(meta.annotationId) : undefined,
    createdAt: String(issue.created_at),
    updatedAt: String(issue.updated_at),
  }
}

export async function fetchThreads(repo: string): Promise<CommentThread[]> {
  const issues = await ghFetch(`/repos/${repo}/issues?labels=canvai-comment&state=all&per_page=100`) as GHIssue[]
  // Fetch comments for each issue in parallel
  const threads = await Promise.all(
    issues.map(async issue => {
      const comments = await ghFetch(`/repos/${repo}/issues/${issue.number}/comments?per_page=100`) as GHComment[]
      return issueToThread(issue, comments)
    })
  )
  return threads
}

export async function createThread(repo: string, data: {
  frameId: string
  componentName: string
  selector: string
  elementTag: string
  elementText: string
  computedStyles: Record<string, string>
  comment: string
}): Promise<CommentThread> {
  const meta = {
    frameId: data.frameId,
    componentName: data.componentName,
    selector: data.selector,
    elementTag: data.elementTag,
    elementText: data.elementText,
    computedStyles: data.computedStyles,
  }
  const body = buildIssueBody(meta, data.comment)
  const firstLine = data.comment.split('\n')[0].slice(0, 60)
  const title = `[canvai] ${data.componentName} · ${data.elementTag} — ${firstLine}`

  const issue = await ghFetch(`/repos/${repo}/issues`, {
    method: 'POST',
    body: { title, body, labels: ['canvai-comment'] },
  }) as GHIssue

  return issueToThread(issue, [])
}

export async function addReply(repo: string, issueNumber: number, body: string): Promise<CommentMessage> {
  const comment = await ghFetch(`/repos/${repo}/issues/${issueNumber}/comments`, {
    method: 'POST',
    body: { body },
  }) as GHComment

  const cUser = comment.user as Record<string, unknown>
  return {
    id: `comment-${comment.id}`,
    ghCommentId: comment.id as number,
    author: {
      login: String(cUser.login),
      avatarUrl: String(cUser.avatar_url),
      name: cUser.name ? String(cUser.name) : undefined,
    },
    body: String(comment.body ?? ''),
    reactions: [],
    createdAt: String(comment.created_at),
    isOriginal: false,
  }
}

export async function resolveThread(repo: string, issueNumber: number): Promise<void> {
  await ghFetch(`/repos/${repo}/issues/${issueNumber}`, {
    method: 'PATCH',
    body: { state: 'closed' },
  })
}

export async function reopenThread(repo: string, issueNumber: number): Promise<void> {
  await ghFetch(`/repos/${repo}/issues/${issueNumber}`, {
    method: 'PATCH',
    body: { state: 'open' },
  })
}

export async function deleteThread(repo: string, issueNumber: number): Promise<void> {
  await ghFetch(`/repos/${repo}/issues/${issueNumber}`, {
    method: 'PATCH',
    body: { state: 'closed' },
  })
}
