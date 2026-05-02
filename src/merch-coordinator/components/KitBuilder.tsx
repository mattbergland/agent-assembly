import { useDrop } from 'react-dnd'
import type { SwagItem, Kit, PackagingType, RecipientTier, DragItemType } from '../types'
import { NotePreview } from './NotePreview'
import { KitContents } from './KitContents'
import { SavedKits } from './SavedKits'

interface KitBuilderProps {
  items: SwagItem[]
  kits: Kit[]
  activeKit: Kit | null
  onNewKit: () => void
  onSetActiveKit: (id: string | null) => void
  onUpdateKit: (id: string, data: Partial<Omit<Kit, 'id' | 'createdAt'>>) => void
  onRemoveKit: (id: string) => void
  onAddItemToKit: (kitId: string, itemId: string) => void
  onUpdateKitItem: (kitId: string, itemId: string, quantity: number) => void
  onRemoveItemFromKit: (kitId: string, itemId: string) => void
  onDuplicateKit: (id: string) => void
  getKitCost: (kit: Kit) => number
}

const packagingOptions: { value: PackagingType; label: string; icon: React.ReactNode }[] = [
  {
    value: 'box',
    label: 'Box',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  },
  {
    value: 'bag',
    label: 'Bag',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
  {
    value: 'envelope',
    label: 'Envelope',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
  {
    value: 'mailer',
    label: 'Mailer',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="22" height="18" rx="2" />
        <path d="M1 9h22" />
      </svg>
    ),
  },
]

const tierOptions: { value: RecipientTier; label: string; emoji: string }[] = [
  { value: 'executives', label: 'Executives', emoji: '' },
  { value: 'ambassadors', label: 'Ambassadors', emoji: '' },
  { value: 'power-users', label: 'Power Users', emoji: '' },
  { value: 'event-attendees', label: 'Event Attendees', emoji: '' },
]

export function KitBuilder({
  items,
  kits,
  activeKit,
  onNewKit,
  onSetActiveKit,
  onUpdateKit,
  onRemoveKit,
  onAddItemToKit,
  onUpdateKitItem,
  onRemoveItemFromKit,
  onDuplicateKit,
  getKitCost,
}: KitBuilderProps) {
  const [{ isOver }, drop] = useDrop<DragItemType, void, { isOver: boolean }>(() => ({
    accept: 'SWAG_ITEM',
    drop: (dragItem, monitor) => {
      if (monitor.didDrop()) return
      if (activeKit) {
        onAddItemToKit(activeKit.id, dragItem.itemId)
      }
    },
    canDrop: () => !!activeKit,
    collect: (monitor) => ({ isOver: monitor.isOver({ shallow: true }) && !!activeKit }),
  }), [activeKit, onAddItemToKit])

  if (!activeKit) {
    return (
      <div ref={drop} className="flex-1 min-w-0 h-full overflow-hidden bg-paper/50 relative flex">
        {/* Empty state or saved kits */}
        {kits.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6 sm:px-8">
            <div className="w-20 h-20 rounded-full bg-lavender/10 flex items-center justify-center mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8E7DBE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 12v10H4V12" />
                <rect x="2" y="7" width="20" height="5" />
                <line x1="12" y1="22" x2="12" y2="7" />
                <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium tracking-tight text-ink mb-1">Build your first kit</h3>
            <p className="text-sm text-ink-muted mb-6 max-w-xs leading-relaxed">
              Create a swag kit by adding items, choosing packaging, and writing a personal note for your recipients.
            </p>
            <button
              onClick={onNewKit}
              className="px-5 py-2.5 text-sm font-medium text-white bg-lavender rounded-lg hover:bg-lavender/90 transition-colors"
            >
              New Kit
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg font-medium tracking-tight text-ink">Saved Kits</h2>
                <button
                  onClick={onNewKit}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-lavender border border-lavender/30 rounded-lg hover:bg-lavender/5 transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  New Kit
                </button>
              </div>
              <SavedKits
                kits={kits}
                items={items}
                onSelect={onSetActiveKit}
                onRemove={onRemoveKit}
                onDuplicate={onDuplicateKit}
                getKitCost={getKitCost}
              />
            </div>
          </div>
        )}
      </div>
    )
  }

  const kitCost = getKitCost(activeKit)
  const totalCost = kitCost * activeKit.recipientCount

  return (
    <div ref={drop} className={`flex-1 min-w-0 h-full overflow-y-auto bg-paper/50 relative transition-colors duration-200 ${isOver ? 'bg-lavender/5' : ''}`}>
      {/* Drop indicator overlay */}
      {isOver && (
        <div className="absolute inset-0 border-2 border-dashed border-lavender/40 rounded-lg z-20 pointer-events-none flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm">
            <p className="text-sm font-medium text-lavender">Drop to add to kit</p>
          </div>
        </div>
      )}

      <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-4 sm:space-y-6">
        {/* Back to kits + kit name */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSetActiveKit(null)}
            className="flex items-center gap-1.5 text-xs text-ink-muted hover:text-lavender transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Kits
          </button>
          <span className="text-rule/20">|</span>
          <input
            value={activeKit.name}
            onChange={e => onUpdateKit(activeKit.id, { name: e.target.value })}
            placeholder="Untitled Kit"
            className="flex-1 text-lg font-medium tracking-tight bg-transparent border-none outline-none placeholder:text-ink-muted/40"
          />
        </div>

        {/* Tier selector */}
        <div>
          <label className="text-[11px] font-medium text-ink-muted uppercase tracking-wide mb-2 block">
            Recipient Tier
          </label>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {tierOptions.map(t => (
              <button
                key={t.value}
                onClick={() => onUpdateKit(activeKit.id, { tier: t.value })}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-medium rounded-full transition-all duration-200 ${
                  activeKit.tier === t.value
                    ? 'bg-lavender text-white shadow-sm'
                    : 'bg-white border border-rule/10 text-ink-muted hover:border-lavender/30 hover:text-ink'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Packaging selector */}
        <div>
          <label className="text-[11px] font-medium text-ink-muted uppercase tracking-wide mb-2 block">
            Packaging
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {packagingOptions.map(p => (
              <button
                key={p.value}
                onClick={() => onUpdateKit(activeKit.id, { packaging: p.value })}
                className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-lg transition-all duration-200 ${
                  activeKit.packaging === p.value
                    ? 'bg-lavender/10 border border-lavender/30 text-lavender'
                    : 'bg-white border border-rule/10 text-ink-muted hover:border-lavender/20'
                }`}
              >
                {p.icon}
                <span className="text-[10px] font-medium">{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Kit contents (drop zone) */}
        <KitContents
          kit={activeKit}
          items={items}
          onUpdateQuantity={(itemId, qty) => onUpdateKitItem(activeKit.id, itemId, qty)}
          onRemoveItem={(itemId) => onRemoveItemFromKit(activeKit.id, itemId)}
          onAddItemToKit={(itemId) => onAddItemToKit(activeKit.id, itemId)}
        />

        {/* Note preview */}
        <NotePreview
          note={activeKit.note}
          onChange={(note) => onUpdateKit(activeKit.id, { note })}
          tier={activeKit.tier}
        />

        {/* Recipient count + cost summary */}
        <div className="rounded-lg border border-rule/10 bg-white p-5 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-medium text-ink-muted uppercase tracking-wide">
              How many to send
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onUpdateKit(activeKit.id, { recipientCount: Math.max(1, activeKit.recipientCount - 1) })}
                className="w-7 h-7 flex items-center justify-center rounded-md border border-rule/10 text-ink-muted hover:border-lavender/30 hover:text-lavender transition-colors"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14" /></svg>
              </button>
              <input
                type="number"
                min={1}
                value={activeKit.recipientCount}
                onChange={e => onUpdateKit(activeKit.id, { recipientCount: Math.max(1, parseInt(e.target.value) || 1) })}
                className="w-16 text-center text-sm font-medium bg-transparent border border-rule/10 rounded-md py-1 focus:outline-none focus:border-lavender/50"
              />
              <button
                onClick={() => onUpdateKit(activeKit.id, { recipientCount: activeKit.recipientCount + 1 })}
                className="w-7 h-7 flex items-center justify-center rounded-md border border-rule/10 text-ink-muted hover:border-lavender/30 hover:text-lavender transition-colors"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
              </button>
            </div>
          </div>

          {activeKit.items.length > 0 && (
            <div className="pt-3 border-t border-rule/10 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-muted">Cost per kit</span>
                <span className="font-medium text-ink">${kitCost.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-muted">
                  Total ({activeKit.recipientCount} kit{activeKit.recipientCount !== 1 ? 's' : ''})
                </span>
                <span className="text-base font-semibold text-ink">${totalCost.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
