import { useState, useEffect, useCallback, useRef } from 'react'
import { SharePopover, type ShareStatus } from './SharePopover'
import { N, S, R, T, FONT, DIM } from './tokens'

interface ShareButtonProps {
  shareUrl?: string
  projectName: string
  annotationEndpoint: string
}

interface AuthUser {
  login: string
  avatarUrl: string
}

interface DeviceFlowData {
  device_code: string
  user_code: string
  verification_uri: string
  interval: number
  expires_in: number
}

export function ShareButton({ shareUrl, projectName, annotationEndpoint }: ShareButtonProps) {
  const [status, setStatus] = useState<ShareStatus>('checking')
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [authUser, setAuthUser] = useState<AuthUser | null>(null)
  const [deviceFlow, setDeviceFlow] = useState<DeviceFlowData | null>(null)
  const pollTimerRef = useRef<ReturnType<typeof setInterval>>()

  // Check auth status on mount
  useEffect(() => {
    fetch(`${annotationEndpoint}/auth/user`)
      .then(r => {
        if (r.ok) return r.json()
        throw new Error('Not authenticated')
      })
      .then(user => {
        setAuthUser({ login: user.login, avatarUrl: user.avatarUrl })
        setStatus(shareUrl ? 'shared' : 'idle')
      })
      .catch(() => {
        setAuthUser(null)
        setStatus('needs-auth')
      })
  }, [annotationEndpoint, shareUrl])

  // Update status when shareUrl changes (after agent deploys)
  useEffect(() => {
    if (shareUrl && (status === 'sharing' || status === 'idle')) {
      setStatus('shared')
    }
  }, [shareUrl, status])

  // Listen for SSE events about resolved share annotations
  useEffect(() => {
    const source = new EventSource(`${annotationEndpoint}/annotations/events`)
    source.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data)
        // When a share annotation is resolved, the agent has deployed
        if (data.type === 'resolved') {
          // We'll get the shareUrl via HMR when manifest updates
          // Just keep the sharing state until shareUrl arrives
        }
      } catch { /* ignore */ }
    }
    return () => source.close()
  }, [annotationEndpoint])

  const handleLogin = useCallback(async () => {
    try {
      // Initiate device flow
      const res = await fetch(`${annotationEndpoint}/auth/device-code`, { method: 'POST' })
      if (!res.ok) throw new Error('Failed to initiate login')

      const flow: DeviceFlowData = await res.json()
      setDeviceFlow(flow)

      // Open verification URL in new tab
      window.open(flow.verification_uri, '_blank')

      // Start polling for token
      pollTimerRef.current = setInterval(async () => {
        try {
          const pollRes = await fetch(`${annotationEndpoint}/auth/poll`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ device_code: flow.device_code }),
          })

          if (!pollRes.ok) return

          const result = await pollRes.json()

          if (result.status === 'success') {
            clearInterval(pollTimerRef.current)
            setDeviceFlow(null)
            setAuthUser(result.user)
            setStatus(shareUrl ? 'shared' : 'idle')
          } else if (result.status === 'expired' || result.status === 'error') {
            clearInterval(pollTimerRef.current)
            setDeviceFlow(null)
          }
          // 'pending' continues polling
        } catch {
          // Continue polling on network errors
        }
      }, (flow.interval + 1) * 1000)

      // Stop polling after expiry
      setTimeout(() => {
        if (pollTimerRef.current) {
          clearInterval(pollTimerRef.current)
          setDeviceFlow(null)
        }
      }, flow.expires_in * 1000)
    } catch (err) {
      console.error('[bryllen] Login failed:', err)
    }
  }, [annotationEndpoint, shareUrl])

  // Cleanup poll timer on unmount
  useEffect(() => {
    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current)
    }
  }, [])

  const handleShare = useCallback(async () => {
    setStatus('sharing')
    try {
      await fetch(`${annotationEndpoint}/annotations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'share',
          comment: JSON.stringify({ project: projectName }),
        }),
      })
      // Stay in 'sharing' state until shareUrl appears via HMR
    } catch (err) {
      console.error('[bryllen] Share failed:', err)
      setStatus('idle')
    }
  }, [annotationEndpoint, projectName])

  const handleButtonClick = () => {
    // Always open popover on click
    setPopoverOpen(true)
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={handleButtonClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: DIM.control,
          padding: `0 ${S.md}px`,
          backgroundColor: status === 'shared' && shareUrl ? 'oklch(0.55 0.14 155)' : N.txtPri,
          color: N.card,
          border: 'none',
          borderRadius: R.ui,
          fontSize: T.ui,
          fontWeight: 500,
          fontFamily: FONT,
          cursor: 'default',
          transition: 'background-color 150ms ease-out',
        }}
      >
        {status === 'shared' && shareUrl ? 'Shared' : 'Share'}
      </button>

      {popoverOpen && (
        <SharePopover
          status={status}
          shareUrl={shareUrl}
          authUser={authUser}
          onLogin={handleLogin}
          onShare={handleShare}
          onClose={() => setPopoverOpen(false)}
        />
      )}

      {/* Device flow code display */}
      {deviceFlow && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: S.xs,
            width: 280,
            backgroundColor: N.card,
            border: `1px solid ${N.border}`,
            borderRadius: R.ui,
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            padding: S.md,
            fontFamily: FONT,
            zIndex: 10001,
          }}
        >
          <p style={{ fontSize: T.ui, color: N.txtSec, margin: `0 0 ${S.sm}px 0` }}>
            Enter this code on GitHub:
          </p>
          <div
            style={{
              padding: S.md,
              backgroundColor: N.chrome,
              borderRadius: R.ui,
              textAlign: 'center',
              fontFamily: 'monospace',
              fontSize: 18,
              fontWeight: 700,
              color: N.txtPri,
              letterSpacing: '0.1em',
            }}
          >
            {deviceFlow.user_code}
          </div>
          <p style={{ fontSize: T.ui, color: N.txtSec, margin: `${S.sm}px 0 0 0`, textAlign: 'center' }}>
            Waiting for authorization...
          </p>
        </div>
      )}
    </div>
  )
}
