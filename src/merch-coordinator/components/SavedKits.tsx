import type { SwagItem, Kit, KitItem, RecipientTier, PackagingType } from '../types'

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

const packagingIcons: Record<PackagingType, React.ReactNode> = {
  box: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  bag: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  ),
  envelope: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  mailer: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="22" height="18" rx="2" />
      <path d="M1 9h22" />
    </svg>
  ),
}

function resolveKitItems(kit: Kit, items: SwagItem[]): (SwagItem & { quantity: number })[] {
  return kit.items
    .map((ki: KitItem) => {
      const item = items.find(i => i.id === ki.itemId)
      return item ? { ...item, quantity: ki.quantity } : null
    })
    .filter((i): i is SwagItem & { quantity: number } => !!i)
}

export function SavedKits({ kits, items, onSelect, onRemove, onDuplicate, getKitCost }: SavedKitsProps) {
  const sorted = [...kits].sort((a, b) => b.createdAt - a.createdAt)

  // Split into columns for masonry layout
  const cols: Kit[][] = [[], [], []]
  sorted.forEach((kit, i) => {
    cols[i % 3].push(kit)
  })

  return (
    <div className="flex gap-5">
      {cols.map((column, colIdx) => (
        <div key={colIdx} className="flex-1 flex flex-col gap-5">
          {column.map(kit => (
            <MoodboardCard
              key={kit.id}
              kit={kit}
              items={items}
              kitItems={resolveKitItems(kit, items)}
              cost={getKitCost(kit)}
              onSelect={onSelect}
              onRemove={onRemove}
              onDuplicate={onDuplicate}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

interface MoodboardCardProps {
  kit: Kit
  items: SwagItem[]
  kitItems: (SwagItem & { quantity: number })[]
  cost: number
  onSelect: (id: string) => void
  onRemove: (id: string) => void
  onDuplicate: (id: string) => void
}

function MoodboardCard({ kit, kitItems, cost, onSelect, onRemove, onDuplicate }: MoodboardCardProps) {
  const hasImages = kitItems.some(i => i.imageUrl)
  const imagesOnly = kitItems.filter(i => i.imageUrl)
  const totalCost = cost * kit.recipientCount

  return (
    <div
      onClick={() => onSelect(kit.id)}
      className="group relative rounded-2xl bg-white border border-rule/10 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-lavender/20 hover:-translate-y-1"
    >
      {/* Image collage area */}
      {hasImages && (
        <div className="relative">
          {imagesOnly.length === 1 && (
            <div className="aspect-[4/3] bg-ink/[0.03]">
              <img src={imagesOnly[0].imageUrl!} alt={imagesOnly[0].name} className="w-full h-full object-cover" />
            </div>
          )}
          {imagesOnly.length === 2 && (
            <div className="grid grid-cols-2 gap-px bg-rule/10">
              {imagesOnly.slice(0, 2).map(item => (
                <div key={item.id} className="aspect-square bg-ink/[0.03]">
                  <img src={item.imageUrl!} alt={item.name} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
          {imagesOnly.length === 3 && (
            <div className="grid grid-cols-2 gap-px bg-rule/10">
              <div className="row-span-2 aspect-[2/3] bg-ink/[0.03]">
                <img src={imagesOnly[0].imageUrl!} alt={imagesOnly[0].name} className="w-full h-full object-cover" />
              </div>
              {imagesOnly.slice(1, 3).map(item => (
                <div key={item.id} className="aspect-square bg-ink/[0.03]">
                  <img src={item.imageUrl!} alt={item.name} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
          {imagesOnly.length >= 4 && (
            <div className="grid grid-cols-2 gap-px bg-rule/10">
              {imagesOnly.slice(0, 4).map((item, idx) => (
                <div key={item.id} className="aspect-square bg-ink/[0.03] relative">
                  <img src={item.imageUrl!} alt={item.name} className="w-full h-full object-cover" />
                  {idx === 3 && imagesOnly.length > 4 && (
                    <div className="absolute inset-0 bg-ink/40 flex items-center justify-center">
                      <span className="text-white text-sm font-medium">+{imagesOnly.length - 4}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Packaging badge overlay */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-1 rounded-full bg-white/90 backdrop-blur-sm text-ink-muted shadow-sm">
            {packagingIcons[kit.packaging]}
            <span className="text-[10px] font-medium capitalize">{kit.packaging}</span>
          </div>
        </div>
      )}

      {/* No-image placeholder collage */}
      {!hasImages && kitItems.length > 0 && (
        <div className="p-4 grid grid-cols-3 gap-2">
          {kitItems.slice(0, 6).map(item => (
            <div key={item.id} className="aspect-square rounded-lg bg-gradient-to-br from-lavender/10 to-lavender/5 flex items-center justify-center">
              <span className="text-lg font-semibold text-lavender/40">{item.name.charAt(0).toUpperCase()}</span>
            </div>
          ))}
        </div>
      )}

      {/* No items placeholder */}
      {kitItems.length === 0 && (
        <div className="px-4 pt-4 pb-2">
          <div className="aspect-[3/2] rounded-lg bg-gradient-to-br from-ink/[0.02] to-ink/[0.04] flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink-muted/20" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 12v10H4V12" />
              <rect x="2" y="7" width="20" height="5" />
              <line x1="12" y1="22" x2="12" y2="7" />
              <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
              <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
            </svg>
          </div>
        </div>
      )}

      {/* Content area */}
      <div className="p-4 space-y-3">
        {/* Kit name */}
        <h3 className="text-sm font-semibold tracking-tight text-ink leading-snug">
          {kit.name || 'Untitled Kit'}
        </h3>

        {/* Item names list */}
        {kitItems.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {kitItems.map(item => (
              <span key={item.id} className="text-[10px] px-1.5 py-0.5 rounded-md bg-ink/[0.04] text-ink-muted">
                {item.quantity > 1 && <span className="font-medium">{item.quantity}x </span>}
                {item.name}
              </span>
            ))}
          </div>
        )}

        {/* Mini note preview */}
        {kit.note && (
          <div className="rounded-lg bg-gradient-to-br from-ink/[0.02] to-ink/[0.04] p-3 relative">
            <div className="absolute top-2 right-2">
              <svg width="12" height="12" viewBox="0 0 22 22" aria-hidden="true">
                <circle cx="5" cy="5" r="1" fill="#ddd" />
                <circle cx="11" cy="5" r="1" fill="#ddd" />
                <circle cx="17" cy="5" r="1" fill="#ddd" />
                <circle cx="5" cy="11" r="1" fill="#ddd" />
                <circle cx="11" cy="11" r="1.2" fill="#8E7DBE" />
                <circle cx="17" cy="11" r="1" fill="#ddd" />
                <circle cx="5" cy="17" r="1" fill="#ddd" />
                <circle cx="11" cy="17" r="1" fill="#ddd" />
                <circle cx="17" cy="17" r="1" fill="#ddd" />
              </svg>
            </div>
            <p className="text-[11px] text-ink-muted/80 italic leading-relaxed line-clamp-3 pr-4">
              "{kit.note}"
            </p>
          </div>
        )}

        {/* Footer: tier + cost */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-lavender/10 text-lavender">
              {tierLabels[kit.tier]}
            </span>
            <span className="text-[10px] text-ink-muted">
              {kit.recipientCount} recipient{kit.recipientCount !== 1 ? 's' : ''}
            </span>
          </div>
          {totalCost > 0 && (
            <span className="text-xs font-semibold text-ink">${totalCost.toFixed(2)}</span>
          )}
        </div>

        {/* Packaging badge for no-image kits */}
        {!hasImages && (
          <div className="flex items-center gap-1 text-ink-muted/60">
            {packagingIcons[kit.packaging]}
            <span className="text-[10px] capitalize">{kit.packaging}</span>
          </div>
        )}
      </div>

      {/* Hover actions */}
      <div className="absolute top-2.5 right-2.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
        <button
          onClick={(e) => { e.stopPropagation(); onDuplicate(kit.id) }}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-sm text-ink-muted hover:text-lavender transition-colors"
          title="Duplicate"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(kit.id) }}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-sm text-ink-muted hover:text-red-500 transition-colors"
          title="Delete"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>
    </div>
  )
}
