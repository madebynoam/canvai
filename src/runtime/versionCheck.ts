// Version check utility — fetches latest version from GitHub, compares with local

const GITHUB_RAW_URL = 'https://raw.githubusercontent.com/madebynoam/bryllen/main/package.json'
const CACHE_KEY = 'bryllen:version-check'
const CACHE_DURATION = 4 * 60 * 60 * 1000 // 4 hours

interface VersionCache {
  checkedAt: number
  latestVersion: string | null
}

interface VersionCheckResult {
  currentVersion: string
  latestVersion: string | null
  updateAvailable: boolean
}

// Simple semver compare: returns true if b > a
function semverGreater(a: string, b: string): boolean {
  const pa = a.replace(/^v/, '').split('.').map(Number)
  const pb = b.replace(/^v/, '').split('.').map(Number)

  for (let i = 0; i < 3; i++) {
    const va = pa[i] || 0
    const vb = pb[i] || 0
    if (vb > va) return true
    if (vb < va) return false
  }
  return false
}

function loadCache(): VersionCache | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveCache(latestVersion: string | null): void {
  try {
    const cache: VersionCache = { checkedAt: Date.now(), latestVersion }
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
  } catch {}
}

async function fetchLatestVersion(): Promise<string | null> {
  try {
    const res = await fetch(GITHUB_RAW_URL, { cache: 'no-store' })
    if (!res.ok) return null
    const pkg = await res.json()
    return pkg.version ?? null
  } catch {
    return null
  }
}

export async function checkForUpdate(currentVersion: string): Promise<VersionCheckResult> {
  // Check cache first
  const cache = loadCache()
  const now = Date.now()

  if (cache && (now - cache.checkedAt) < CACHE_DURATION) {
    // Use cached result
    return {
      currentVersion,
      latestVersion: cache.latestVersion,
      updateAvailable: cache.latestVersion ? semverGreater(currentVersion, cache.latestVersion) : false,
    }
  }

  // Fetch fresh
  const latestVersion = await fetchLatestVersion()
  saveCache(latestVersion)

  return {
    currentVersion,
    latestVersion,
    updateAvailable: latestVersion ? semverGreater(currentVersion, latestVersion) : false,
  }
}

// Get dismissed version from localStorage
const DISMISSED_KEY = 'bryllen:version-dismissed'

export function getDismissedVersion(): string | null {
  try {
    return localStorage.getItem(DISMISSED_KEY)
  } catch {
    return null
  }
}

export function setDismissedVersion(version: string): void {
  try {
    localStorage.setItem(DISMISSED_KEY, version)
  } catch {}
}
