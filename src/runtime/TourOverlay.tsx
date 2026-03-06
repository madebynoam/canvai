import { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { A, D, S, R, T, V, FONT } from './tokens'
import { ActionButton } from './Menu'

const TOUR_KEY = 'bryllen:tour-completed'

export function isTourCompleted(): boolean {
  try {
    return localStorage.getItem(TOUR_KEY) === 'true'
  } catch {
    return false
  }
}

export function setTourCompleted(): void {
  try {
    localStorage.setItem(TOUR_KEY, 'true')
  } catch {}
}

export function resetTourCompleted(): void {
  try {
    localStorage.removeItem(TOUR_KEY)
  } catch {}
}

interface TourStep {
  targetId: string
  title: string
  body: string
}

const TOUR_STEPS: TourStep[] = [
  {
    targetId: 'canvas',
    title: 'Welcome to Bryllen',
    body: 'This is your infinite canvas. Pan with scroll, zoom with pinch or Cmd+scroll. Your designs live here as interactive frames.',
  },
  {
    targetId: 'frame',
    title: 'Design frames',
    body: 'Each frame is a live React component. Interact with buttons, inputs, and menus — everything works. Drag frames to reposition them.',
  },
  {
    targetId: 'annotation-fab',
    title: 'Annotate anything',
    body: 'Click to enter annotation mode. Point at any element and describe the change. Click Save, then Apply in the top bar to send it to the agent.',
  },
  {
    targetId: 'iteration-picker',
    title: 'Iterations',
    body: 'Create iterations to snapshot your progress. V1, V2, V3 — each preserves your work while you explore new directions.',
  },
  {
    targetId: 'sidebar',
    title: 'Pages and navigation',
    body: 'Your project is organized into pages. Switch between Tokens, Components, and custom pages here.',
  },
  {
    targetId: 'done',
    title: 'You\'re ready!',
    body: 'Paste images (Cmd+V) as inspiration, then annotate them to tell the agent what style to follow. Click the annotation button to start designing.',
  },
]

const SPRING = 'cubic-bezier(0.34, 1.56, 0.64, 1)'

interface TourOverlayProps {
  onComplete?: () => void
}

export function TourOverlay({ onComplete }: TourOverlayProps) {
  const [step, setStep] = useState(0)
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null)
  const [visible, setVisible] = useState(true)
  const rafRef = useRef<number>(0)

  const currentStep = TOUR_STEPS[step]

  // Find and track the target element
  useEffect(() => {
    function updateRect() {
      // 'done' step has no target
      if (currentStep.targetId === 'done') {
        setTargetRect(null)
        return
      }

      // Special case: find any frame on canvas
      if (currentStep.targetId === 'frame') {
        const el = document.querySelector('[data-frame-id]')
        if (el) setTargetRect(el.getBoundingClientRect())
        else setTargetRect(null)
        rafRef.current = requestAnimationFrame(updateRect)
        return
      }

      const el = document.querySelector(`[data-tour-id="${currentStep.targetId}"]`)
      if (el) {
        setTargetRect(el.getBoundingClientRect())
      } else {
        setTargetRect(null)
      }
      rafRef.current = requestAnimationFrame(updateRect)
    }

    rafRef.current = requestAnimationFrame(updateRect)
    return () => cancelAnimationFrame(rafRef.current)
  }, [currentStep.targetId])

  const handleNext = useCallback(() => {
    if (step < TOUR_STEPS.length - 1) {
      setStep(s => s + 1)
    } else {
      setTourCompleted()
      setVisible(false)
      onComplete?.()
    }
  }, [step, onComplete])

  const handlePrev = useCallback(() => {
    if (step > 0) {
      setStep(s => s - 1)
    }
  }, [step])

  const handleSkip = useCallback(() => {
    setTourCompleted()
    setVisible(false)
    onComplete?.()
  }, [onComplete])

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        handleSkip()
      } else if (e.key === 'Enter' || e.key === 'ArrowRight') {
        handleNext()
      } else if (e.key === 'ArrowLeft') {
        handlePrev()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleNext, handlePrev, handleSkip])

  if (!visible) return null

  // Calculate card position (prefer below target, avoid edges)
  const cardWidth = 320
  const cardHeight = 180
  let cardTop = 100
  let cardLeft = 100

  if (targetRect) {
    // Position below target with padding
    cardTop = targetRect.bottom + S.lg
    cardLeft = targetRect.left

    // Keep within viewport
    if (cardTop + cardHeight > window.innerHeight - S.xxl) {
      cardTop = targetRect.top - cardHeight - S.lg
    }
    if (cardLeft + cardWidth > window.innerWidth - S.xxl) {
      cardLeft = window.innerWidth - cardWidth - S.xxl
    }
    if (cardLeft < S.xxl) cardLeft = S.xxl
    if (cardTop < S.xxl) cardTop = S.xxl
  } else {
    // Center for 'done' step
    cardTop = (window.innerHeight - cardHeight) / 2
    cardLeft = (window.innerWidth - cardWidth) / 2
  }

  return createPortal(
    <>
      {/* Semi-transparent backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.4)',
          zIndex: 99990,
        }}
        onClick={handleSkip}
      />

      {/* Highlight box around target */}
      {targetRect && (
        <div
          style={{
            position: 'fixed',
            left: targetRect.left - 4,
            top: targetRect.top - 4,
            width: targetRect.width + 8,
            height: targetRect.height + 8,
            border: `2px solid ${A.accent}`,
            borderRadius: R.ui,
            background: 'transparent',
            boxShadow: `0 0 0 9999px rgba(0, 0, 0, 0.4), 0 0 20px ${A.accent}`,
            pointerEvents: 'none',
            zIndex: 99991,
            transition: `all 300ms ${SPRING}`,
          }}
        />
      )}

      {/* Tour card */}
      <div
        style={{
          position: 'fixed',
          top: cardTop,
          left: cardLeft,
          width: cardWidth,
          background: V.card,
          borderRadius: R.ui,
          border: `1px solid ${V.border}`,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
          padding: S.lg,
          fontFamily: FONT,
          zIndex: 99992,
          transition: `top 300ms ${SPRING}, left 300ms ${SPRING}`,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Progress indicator */}
        <div style={{
          display: 'flex',
          gap: S.xs,
          marginBottom: S.md,
        }}>
          {TOUR_STEPS.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === step ? 16 : 6,
                height: 6,
                borderRadius: R.pill,
                background: i === step ? A.accent : V.border,
                transition: `all 200ms ${SPRING}`,
              }}
            />
          ))}
        </div>

        {/* Title */}
        <h3 style={{
          margin: 0,
          fontSize: T.ui,
          fontWeight: 600,
          color: V.txtPri,
          marginBottom: S.sm,
        }}>
          {currentStep.title}
        </h3>

        {/* Body */}
        <p style={{
          margin: 0,
          fontSize: T.ui,
          color: V.txtSec,
          lineHeight: 1.5,
          marginBottom: S.lg,
          textWrap: 'pretty',
        }}>
          {currentStep.body}
        </p>

        {/* Actions */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <button
            onClick={handleSkip}
            style={{
              border: 'none',
              background: 'transparent',
              color: V.txtSec,
              fontSize: T.ui,
              fontFamily: FONT,
              cursor: 'default',
              padding: `${S.xs}px ${S.sm}px`,
              borderRadius: R.ui,
            }}
          >
            Skip tour
          </button>

          <div style={{ display: 'flex', gap: S.sm }}>
            {step > 0 && (
              <ActionButton variant="ghost" onClick={handlePrev}>
                Back
              </ActionButton>
            )}
            <ActionButton variant="primary" onClick={handleNext}>
              {step < TOUR_STEPS.length - 1 ? 'Next' : 'Get started'}
            </ActionButton>
          </div>
        </div>
      </div>
    </>,
    document.body
  )
}
