/**
 * canvai — GitHub OAuth Device Flow
 *
 * Implements the device flow for GitHub authentication.
 * Token stored in ~/.canvai/auth.json
 * Browser receives user info only (token never sent to browser).
 *
 * SETUP: Register a GitHub OAuth App at github.com/settings/applications/new
 *   - Application name: canvai
 *   - Homepage URL: https://github.com/madebynoam/canvai
 *   - Authorization callback URL: (leave empty — device flow doesn't need it)
 *   Then replace GITHUB_CLIENT_ID below with your app's Client ID.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { homedir } from 'os'
import { join } from 'path'

// TODO: Replace with the canvai GitHub OAuth App Client ID after registering at
// https://github.com/settings/applications/new
// Client IDs are public — safe to commit.
export const GITHUB_CLIENT_ID = process.env.CANVAI_GITHUB_CLIENT_ID ?? 'Ov23liXXXXXXXXXXXXXX'

const GITHUB_DEVICE_CODE_URL = 'https://github.com/login/device/code'
const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token'
const SCOPES = 'repo read:user'

const AUTH_FILE = join(homedir(), '.canvai', 'auth.json')

// ── Token storage ─────────────────────────────────────────────────────────────

function readAuthFile() {
  try {
    return JSON.parse(readFileSync(AUTH_FILE, 'utf8'))
  } catch {
    return null
  }
}

function writeAuthFile(data) {
  mkdirSync(join(homedir(), '.canvai'), { recursive: true })
  writeFileSync(AUTH_FILE, JSON.stringify(data, null, 2), 'utf8')
}

export function getStoredToken() {
  return readAuthFile()?.github_token ?? null
}

export function getStoredUser() {
  const auth = readAuthFile()
  if (!auth) return null
  return auth.user ?? null
}

export function saveAuth(token, user) {
  writeAuthFile({ github_token: token, user })
}

export function clearAuth() {
  writeAuthFile({})
}

// ── Device flow ───────────────────────────────────────────────────────────────

/**
 * Step 1: Request a device code from GitHub.
 * Returns { user_code, verification_uri, device_code, interval, expires_in }
 */
export async function initiateDeviceFlow() {
  const res = await fetch(GITHUB_DEVICE_CODE_URL, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'canvai/1.0',
    },
    body: new URLSearchParams({
      client_id: GITHUB_CLIENT_ID,
      scope: SCOPES,
    }),
  })

  if (!res.ok) {
    throw new Error(`GitHub device flow initiation failed: ${res.status} ${res.statusText}`)
  }

  const data = await res.json()
  if (data.error) throw new Error(`GitHub: ${data.error_description ?? data.error}`)

  return {
    device_code: data.device_code,
    user_code: data.user_code,
    verification_uri: data.verification_uri,
    interval: data.interval ?? 5,
    expires_in: data.expires_in ?? 900,
  }
}

/**
 * Step 2: Poll GitHub for the access token.
 * Returns { status: 'success', token, user } | { status: 'pending' } | { status: 'expired' } | { status: 'error', error }
 */
export async function pollForToken(deviceCode) {
  const res = await fetch(GITHUB_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'canvai/1.0',
    },
    body: new URLSearchParams({
      client_id: GITHUB_CLIENT_ID,
      device_code: deviceCode,
      grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
    }),
  })

  if (!res.ok) {
    return { status: 'error', error: `HTTP ${res.status}` }
  }

  const data = await res.json()

  if (data.error) {
    switch (data.error) {
      case 'authorization_pending':
        return { status: 'pending' }
      case 'slow_down':
        return { status: 'slow_down', interval: 5 }
      case 'expired_token':
        return { status: 'expired' }
      default:
        return { status: 'error', error: data.error_description ?? data.error }
    }
  }

  if (!data.access_token) {
    return { status: 'error', error: 'No access token in response' }
  }

  // Fetch user info
  const userRes = await fetch('https://api.github.com/user', {
    headers: {
      'Authorization': `Bearer ${data.access_token}`,
      'Accept': 'application/vnd.github+json',
      'User-Agent': 'canvai/1.0',
    },
  })

  const user = userRes.ok ? await userRes.json() : null

  const normalizedUser = user
    ? { login: user.login, avatarUrl: user.avatar_url, name: user.name ?? undefined }
    : null

  // Store auth
  saveAuth(data.access_token, normalizedUser)

  return { status: 'success', user: normalizedUser }
}
