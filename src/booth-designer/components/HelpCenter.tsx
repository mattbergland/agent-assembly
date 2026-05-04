import { useState } from 'react'

interface HelpCenterProps {
  onClose: () => void
  elementCount: number
  hasWalls: boolean
  boothArea: number
}

interface Tip {
  id: string
  title: string
  description: string
  condition: (ctx: { elementCount: number; hasWalls: boolean; boothArea: number }) => boolean
}

const TIPS: Tip[] = [
  {
    id: 'start',
    title: 'Start with your booth size',
    description: 'Use the Booth Size dropdown in the toolbar to select a preset or enter custom dimensions. Standard trade show booth sizes are 10×10, 10×20, and 20×20 feet.',
    condition: () => true,
  },
  {
    id: 'walls',
    title: 'Configure your walls',
    description: 'Toggle walls on/off using the Walls menu. Open sides face the aisle where attendees approach. Most inline booths have 3 walls (back + 2 sides) with the front open.',
    condition: ({ hasWalls }) => !hasWalls,
  },
  {
    id: 'anchor',
    title: 'Place anchor elements first',
    description: 'Start with large, fixed elements like your reception desk, backdrop, and main demo station. These anchor the layout and determine traffic flow.',
    condition: ({ elementCount }) => elementCount < 3,
  },
  {
    id: 'traffic',
    title: 'Create a traffic flow',
    description: 'Leave a clear path from the entry to your key areas. Attendees should be able to see your brand messaging from the aisle and naturally flow into the booth.',
    condition: ({ elementCount }) => elementCount >= 3,
  },
  {
    id: 'zones',
    title: 'Create distinct zones',
    description: 'Divide your booth into zones: Welcome/reception area near the front, demo area in the middle, meeting/lounge area in the back. Each zone serves a different purpose.',
    condition: ({ boothArea }) => boothArea >= 150,
  },
  {
    id: 'sightlines',
    title: 'Maintain clear sightlines',
    description: "Keep tall elements (banners, backdrops) at the back or sides. Don't block the view into the booth from the aisle. Place shorter elements (tables, counters) toward the front.",
    condition: ({ elementCount }) => elementCount >= 5,
  },
  {
    id: 'branding',
    title: 'Add branding elements',
    description: 'Include at least one banner or backdrop for brand visibility. Hanging signs are visible from far away and are worth the investment for larger booths.',
    condition: ({ elementCount }) => elementCount >= 2,
  },
  {
    id: 'budget',
    title: 'Watch your budget',
    description: 'The budget tracker in the toolbar shows your running total. Adjust individual item costs in the Properties panel to match your actual vendor quotes.',
    condition: () => true,
  },
  {
    id: 'power',
    title: 'Consider power & AV',
    description: 'Place monitors and demo stations near where power will be accessible. Plan for cable management — keep tech stations near walls or use raised platforms to hide cables.',
    condition: ({ elementCount }) => elementCount >= 4,
  },
  {
    id: 'storage',
    title: "Don't forget storage",
    description: 'Add a storage cabinet or space behind your backdrop for extra supplies, personal items, and collateral refills. This keeps the booth looking clean.',
    condition: ({ boothArea }) => boothArea >= 100,
  },
]

export function HelpCenter({ onClose, elementCount, hasWalls, boothArea }: HelpCenterProps) {
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set())

  const context = { elementCount, hasWalls, boothArea }
  const activeTips = TIPS
    .filter(tip => tip.condition(context))
    .filter(tip => !dismissedIds.has(tip.id))

  const dismiss = (id: string) => {
    setDismissedIds(prev => new Set([...prev, id]))
  }

  return (
    <div className="fixed top-16 right-4 z-40 w-80 max-h-[calc(100vh-100px)] bg-white rounded-xl border border-rule/10 shadow-xl flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-rule/10">
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8E7DBE" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
          <h3 className="text-sm font-medium text-ink tracking-tight">Design Tips</h3>
        </div>
        <button onClick={onClose} className="text-ink-muted hover:text-ink transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>
      </div>

      {/* Tips list */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {activeTips.length === 0 ? (
          <div className="text-center py-8">
            <svg className="mx-auto mb-3 text-lavender/40" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
            <p className="text-xs text-ink-muted">All tips dismissed. You're on a roll!</p>
          </div>
        ) : (
          activeTips.map(tip => (
            <div key={tip.id} className="p-3 rounded-lg bg-paper/50 border border-rule/5">
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-xs font-medium text-ink">{tip.title}</h4>
                <button
                  onClick={() => dismiss(tip.id)}
                  className="text-[10px] text-ink-muted hover:text-lavender transition-colors shrink-0"
                >
                  Hide
                </button>
              </div>
              <p className="text-[11px] text-ink-muted leading-relaxed mt-1">{tip.description}</p>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-rule/10 bg-paper/30">
        <p className="text-[10px] text-ink-muted">
          {activeTips.length} tip{activeTips.length !== 1 ? 's' : ''} &middot; Tips update as you build your booth
        </p>
      </div>
    </div>
  )
}
