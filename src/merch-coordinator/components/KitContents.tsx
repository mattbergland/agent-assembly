import { useDrop } from 'react-dnd'
import type { SwagItem, Kit, DragItemType } from '../types'

interface KitContentsProps {
  kit: Kit
  items: SwagItem[]
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemoveItem: (itemId: string) => void
  onAddItemToKit: (itemId: string) => void
}

export function KitContents({ kit, items, onUpdateQuantity, onRemoveItem, onAddItemToKit }: KitContentsProps) {
  const [{ isOver }, drop] = useDrop<DragItemType, void, { isOver: boolean }>(() => ({
    accept: 'SWAG_ITEM',
    drop: (dragItem) => onAddItemToKit(dragItem.itemId),
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  }), [onAddItemToKit])

  const kitItems = kit.items
    .map(ki => {
      const item = items.find(i => i.id === ki.itemId)
      return item ? { ...ki, item } : null
    })
    .filter((ki): ki is { itemId: string; quantity: number; item: SwagItem } => ki !== null)

  return (
    <div>
      <label className="text-[11px] font-medium text-ink-muted uppercase tracking-wide mb-2 block">
        Kit Contents
      </label>
      <div
        ref={drop}
        className={`rounded-lg border-2 transition-all duration-200 min-h-[120px] ${
          isOver
            ? 'border-lavender/40 border-dashed bg-lavender/5'
            : kitItems.length > 0
            ? 'border-rule/10 border-solid bg-white'
            : 'border-rule/10 border-dashed bg-white'
        }`}
      >
        {kitItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink-muted/30 mb-2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
            <p className="text-xs text-ink-muted/60">Drag items here to add them</p>
          </div>
        ) : (
          <div className="divide-y divide-rule/10">
            {kitItems.map(({ item, quantity, itemId }) => (
              <div key={itemId} className="flex items-center gap-3 p-3 group">
                {/* Image */}
                <div className="w-10 h-10 flex-shrink-0 rounded-md bg-ink/[0.03] overflow-hidden flex items-center justify-center">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink-muted/40">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  )}
                </div>

                {/* Name + cost */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium tracking-tight text-ink truncate">{item.name}</p>
                  <p className="text-[11px] text-ink-muted">${(item.unitCost * quantity).toFixed(2)}</p>
                </div>

                {/* Quantity controls */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onUpdateQuantity(itemId, quantity - 1)}
                    className="w-6 h-6 flex items-center justify-center rounded border border-rule/10 text-ink-muted hover:border-lavender/30 hover:text-lavender transition-colors text-xs"
                  >
                    -
                  </button>
                  <span className="w-6 text-center text-xs font-medium">{quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(itemId, quantity + 1)}
                    className="w-6 h-6 flex items-center justify-center rounded border border-rule/10 text-ink-muted hover:border-lavender/30 hover:text-lavender transition-colors text-xs"
                  >
                    +
                  </button>
                </div>

                {/* Remove */}
                <button
                  onClick={() => onRemoveItem(itemId)}
                  className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded-full text-ink-muted hover:text-ink hover:bg-ink/5 transition-all"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
