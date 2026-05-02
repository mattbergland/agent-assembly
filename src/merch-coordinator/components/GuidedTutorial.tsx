import { useState, useEffect, useCallback } from 'react'
import type { SwagItem, Kit } from '../types'

const STORAGE_KEY = 'merch-coordinator-tutorial-done'

interface GuidedTutorialProps {
  items: SwagItem[]
  kits: Kit[]
  activeKit: Kit | null
  onNewKit: () => void
}

interface TutorialStep {
  title: string
  description: string
  action?: string
  icon: React.ReactNode
}

const STEPS: TutorialStep[] = [
  {
    title: 'Add your first item',
    description: 'Start by adding a swag item to your catalog. Click "Add Item" on the left panel — give it a name, cost, and category.',
    action: 'Click "Add Item" to continue',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
  },
  {
    title: 'Start a new kit',
    description: 'Now let\'s create a kit. A kit is a curated set of items bundled together with packaging and a personal note.',
    action: 'Click "New Kit" to continue',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 12v10H4V12" />
        <rect x="2" y="7" width="20" height="5" />
        <line x1="12" y1="22" x2="12" y2="7" />
        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
      </svg>
    ),
  },
  {
    title: 'Build your kit',
    description: 'Drag items from the left sidebar into your kit. Choose packaging, pick a recipient tier, and write a personal note to include.',
    action: 'Drag an item into your kit',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="5 9 2 12 5 15" />
        <polyline points="9 5 12 2 15 5" />
        <polyline points="15 19 12 22 9 19" />
        <polyline points="19 9 22 12 19 15" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <line x1="12" y1="2" x2="12" y2="22" />
      </svg>
    ),
  },
  {
    title: 'You\'re all set!',
    description: 'Your first kit is taking shape. Keep adding items, tweak the note, and save as many kits as you need — they\'ll show up as cards in your moodboard.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
]

function getActiveStep(items: SwagItem[], kits: Kit[], activeKit: Kit | null): number {
  if (items.length === 0) return 0
  if (kits.length === 0) return 1
  if (activeKit && activeKit.items.length === 0) return 2
  if (activeKit && activeKit.items.length > 0) return 3
  return 2
}

export function GuidedTutorial({ items, kits, activeKit, onNewKit }: GuidedTutorialProps) {
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true'
    } catch {
      return false
    }
  })
  const [visible, setVisible] = useState(false)

  const currentStep = getActiveStep(items, kits, activeKit)
  const step = STEPS[currentStep]

  // Animate in after a short delay
  useEffect(() => {
    if (dismissed) return
    const timer = setTimeout(() => setVisible(true), 600)
    return () => clearTimeout(timer)
  }, [dismissed])

  const handleDismiss = useCallback(() => {
    setVisible(false)
    setTimeout(() => {
      setDismissed(true)
      try {
        localStorage.setItem(STORAGE_KEY, 'true')
      } catch { /* ignore */ }
    }, 500)
  }, [])

  // Auto-dismiss when all steps complete and user has been on step 4 for a bit
  useEffect(() => {
    if (currentStep === 3 && !dismissed) {
      const timer = setTimeout(handleDismiss, 8000)
      return () => clearTimeout(timer)
    }
  }, [currentStep, dismissed, handleDismiss])

  if (dismissed) return null

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="bg-white rounded-xl shadow-lg border border-rule/10 p-5 max-w-md w-[420px] relative">
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full text-ink-muted/40 hover:text-ink-muted hover:bg-ink/5 transition-colors"
          aria-label="Dismiss tutorial"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="flex gap-4">
          {/* Icon */}
          <div className="w-10 h-10 rounded-lg bg-lavender/10 flex items-center justify-center flex-shrink-0 text-lavender">
            {step.icon}
          </div>

          <div className="flex-1 min-w-0">
            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-medium text-lavender uppercase tracking-widest">
                Step {currentStep + 1} of {STEPS.length}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-sm font-semibold text-ink tracking-tight mb-1">
              {step.title}
            </h3>

            {/* Description */}
            <p className="text-xs text-ink-muted leading-relaxed">
              {step.description}
            </p>

            {/* Action hint or New Kit button */}
            {currentStep === 1 ? (
              <button
                onClick={onNewKit}
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-lavender rounded-md hover:bg-lavender/90 transition-colors"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                New Kit
              </button>
            ) : currentStep === 3 ? (
              <button
                onClick={handleDismiss}
                className="mt-3 inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-lavender rounded-md hover:bg-lavender/90 transition-colors"
              >
                Got it
              </button>
            ) : step.action ? (
              <p className="mt-2 text-[10px] font-medium text-lavender/70">
                {step.action}
              </p>
            ) : null}
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-1.5 mt-4 pt-3 border-t border-rule/5">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-500 ${
                i < currentStep
                  ? 'w-6 bg-lavender'
                  : i === currentStep
                  ? 'w-6 bg-lavender/60'
                  : 'w-1.5 bg-ink/10'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
