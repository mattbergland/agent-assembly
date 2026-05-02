import { useState } from 'react'
import { markTutorialDone } from '../store'

interface TutorialProps {
  onComplete: () => void
}

const STEPS = [
  {
    title: 'Welcome to Seating Planner',
    description: 'Plan table seating for your events — executive dinners, conferences, workshops, and more. This quick walkthrough will get you started.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8E7DBE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" />
        <circle cx="12" cy="3" r="1.5" />
        <circle cx="19.8" cy="7.5" r="1.5" />
        <circle cx="19.8" cy="16.5" r="1.5" />
        <circle cx="12" cy="21" r="1.5" />
        <circle cx="4.2" cy="16.5" r="1.5" />
        <circle cx="4.2" cy="7.5" r="1.5" />
      </svg>
    ),
  },
  {
    title: 'Add Your Guests',
    description: 'Use the form on the left to add guests one at a time with their name, title, and company. You can also import a whole list at once using CSV upload or paste.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8E7DBE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: 'Create Tables',
    description: 'Click "Add Table" on the right to create tables. Pick from 7 layouts: round, rectangular, U-shape, classroom, boardroom, banquet, and hollow square. You can resize and rename tables anytime.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8E7DBE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18" />
        <path d="M9 3v18" />
      </svg>
    ),
  },
  {
    title: 'Drag & Drop to Seat',
    description: 'Drag guest cards from the sidebar onto any empty seat. You can move guests between seats and tables freely. Each seated guest shows their full name, title, and company.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8E7DBE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 4h6v6" />
        <path d="M20 4L10 14" />
        <path d="M4 14h6v6" />
      </svg>
    ),
  },
  {
    title: 'Save Multiple Events',
    description: 'Use the event selector in the top bar to create separate seating plans for different events. Each event saves its own guests and tables independently — switch between them anytime.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8E7DBE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
]

export function Tutorial({ onComplete }: TutorialProps) {
  const [step, setStep] = useState(0)

  const isLast = step === STEPS.length - 1
  const current = STEPS[step]

  const handleNext = () => {
    if (isLast) {
      markTutorialDone()
      onComplete()
    } else {
      setStep(step + 1)
    }
  }

  const handleSkip = () => {
    markTutorialDone()
    onComplete()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
        {/* Progress bar */}
        <div className="h-1 bg-ink/[0.04]">
          <div
            className="h-full bg-lavender transition-all duration-300 ease-out"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        <div className="p-8 text-center">
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-lavender/10 flex items-center justify-center mx-auto mb-6">
            {current.icon}
          </div>

          {/* Step indicator */}
          <p className="text-[10px] font-mono text-lavender uppercase tracking-wider mb-3">
            Step {step + 1} of {STEPS.length}
          </p>

          {/* Content */}
          <h2 className="text-xl font-medium tracking-tight text-ink mb-3">
            {current.title}
          </h2>
          <p className="text-sm text-ink-muted leading-relaxed">
            {current.description}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between px-8 pb-8">
          <button
            onClick={handleSkip}
            className="text-xs text-ink-muted hover:text-ink transition-colors"
          >
            Skip tutorial
          </button>
          <div className="flex items-center gap-3">
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 text-sm text-ink-muted hover:text-ink border border-rule/10 rounded-lg hover:border-rule/20 transition-colors"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-5 py-2 text-sm font-medium text-white bg-lavender rounded-lg hover:bg-lavender/90 transition-colors"
            >
              {isLast ? 'Get Started' : 'Next'}
            </button>
          </div>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-1.5 pb-6">
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
