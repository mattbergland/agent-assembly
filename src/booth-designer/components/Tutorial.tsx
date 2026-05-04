import { useState } from 'react'
import { markTutorialDone } from '../store'

interface TutorialProps {
  onComplete: () => void
}

const STEPS = [
  {
    title: 'Define your space',
    description: 'Set your booth dimensions using presets (10×10, 10×20, 20×20) or custom sizes. Toggle walls on/off to match your booth layout — open sides face the aisle.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8E7DBE" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
  },
  {
    title: 'Add elements',
    description: 'Browse the element catalog on the left — tables, monitors, banners, demo stations, and more. Drag items onto the floor plan to place them.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8E7DBE" strokeWidth="1.5">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    title: 'Arrange & customize',
    description: 'Click elements to select them, then drag to reposition. Use the rotate and delete buttons, or edit properties like labels, costs, and colors in the right panel.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8E7DBE" strokeWidth="1.5">
        <path d="M12 3v18M3 12h18" />
        <path d="m16 16 2 2 4-4" />
      </svg>
    ),
  },
  {
    title: 'Switch views & track budget',
    description: 'Toggle between 2D floor plan and 3D isometric views. Your running budget updates automatically as you add items. Use undo/redo to experiment freely.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8E7DBE" strokeWidth="1.5">
        <path d="M12 3 2 12h3v8h6v-6h2v6h6v-8h3L12 3z" />
      </svg>
    ),
  },
]

export function Tutorial({ onComplete }: TutorialProps) {
  const [step, setStep] = useState(0)

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1)
    } else {
      markTutorialDone()
      onComplete()
    }
  }

  const handleSkip = () => {
    markTutorialDone()
    onComplete()
  }

  const current = STEPS[step]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/30 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl border border-rule/10 w-full max-w-md mx-4 overflow-hidden">
        {/* Progress bar */}
        <div className="h-1 bg-paper">
          <div
            className="h-full bg-lavender transition-all duration-300"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        <div className="p-6 sm:p-8">
          {/* Icon */}
          <div className="w-12 h-12 rounded-lg bg-lavender/10 flex items-center justify-center mb-4">
            {current.icon}
          </div>

          {/* Step indicator */}
          <p className="text-[10px] text-ink-muted uppercase tracking-wide mb-1">
            Step {step + 1} of {STEPS.length}
          </p>

          {/* Title */}
          <h2 className="text-lg font-medium text-ink tracking-tight mb-2">
            {current.title}
          </h2>

          {/* Description */}
          <p className="text-sm text-ink-muted leading-relaxed">
            {current.description}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between px-6 sm:px-8 pb-6 sm:pb-8">
          <button
            onClick={handleSkip}
            className="text-xs text-ink-muted hover:text-ink transition-colors"
          >
            Skip tutorial
          </button>
          <button
            onClick={handleNext}
            className="px-4 py-2 text-sm bg-lavender text-white rounded-lg hover:bg-lavender/90 transition-colors font-medium"
          >
            {step < STEPS.length - 1 ? 'Next' : 'Get started'}
          </button>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-1.5 pb-4">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i === step ? 'bg-lavender' : 'bg-ink/10'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
