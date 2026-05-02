import type { SwagItem, Kit, RecipientTier } from '../types'

interface SavedKitsProps {
  kits: Kit[]
  items: SwagItem[]
  onSelect: (id: string) => void
  onRemove: (id: string) => void
  onDuplicate: (id: string) => void
  getKitCost: (kit: Kit) => number
}

const tierLabels: Record<RecipientTier, string> = {
  executives: 'Executives',
  ambassadors: 'Ambassadors',
  'power-users': 'Power Users',
  'event-attendees': 'Event Attendees',
}

const packagingLabels: Record<string, string> = {
  box: 'Box',
  bag: 'Bag',
  envelope: 'Envelope',
  mailer: 'Mailer',
}

export function SavedKits({ kits, items, onSelect, onRemove, onDuplicate, getKitCost }: SavedKitsProps) {
  const sorted = [...kits].sort((a, b) => b.createdAt - a.createdAt)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {sorted.map(kit => {
        const kitItems = kit.items
          .map(ki => items.find(i => i.id === ki.itemId))
          .filter((i): i is SwagItem => !!i)
        const cost = getKitCost(kit)

        return (
          <div
            key={kit.id}
            onClick={() => onSelect(kit.id)}
            className="group relative rounded-xl border border-rule/10 bg-white p-5 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-lavender/30 hover:-translate-y-0.5"
          >
            {/* Actions */}
            <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => { e.stopPropagation(); onDuplicate(kit.id) }}
                className="w-7 h-7 flex items-center justify-center rounded-md text-ink-muted hover:text-lavender hover:bg-lavender/5 transition-colors"
                title="Duplicate"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onRemove(kit.id) }}
                className="w-7 h-7 flex items-center justify-center rounded-md text-ink-muted hover:text-red-500 hover:bg-red-50 transition-colors"
                title="Delete"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            </div>

            {/* Kit name */}
            <h3 className="text-sm font-medium tracking-tight text-ink mb-1 pr-16">
              {kit.name || 'Untitled Kit'}
            </h3>

            {/* Meta */}
            <div className="flex items-center gap-2 text-[10px] text-ink-muted mb-3">
              <span className="px-1.5 py-0.5 rounded-full bg-lavender/10 text-lavender font-medium">
                {tierLabels[kit.tier]}
              </span>
              <span>{packagingLabels[kit.packaging]}</span>
              <span className="text-rule/30">|</span>
              <span>{kit.items.length} item{kit.items.length !== 1 ? 's' : ''}</span>
            </div>

            {/* Item thumbnails */}
            {kitItems.length > 0 && (
              <div className="flex items-center gap-1.5 mb-3">
                {kitItems.slice(0, 5).map(item => (
                  <div key={item.id} className="w-8 h-8 rounded-md bg-ink/[0.03] overflow-hidden flex items-center justify-center border border-rule/10">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[8px] text-ink-muted/40 font-medium">{item.name.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                ))}
                {kitItems.length > 5 && (
                  <span className="text-[10px] text-ink-muted">+{kitItems.length - 5}</span>
                )}
              </div>
            )}

            {/* Cost */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-ink-muted">
                {kit.recipientCount} recipient{kit.recipientCount !== 1 ? 's' : ''}
              </span>
              {cost > 0 && (
                <span className="font-medium text-ink">${(cost * kit.recipientCount).toFixed(2)}</span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
