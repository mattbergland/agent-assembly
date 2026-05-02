import { useDrag } from 'react-dnd'
import type { SwagItem, DragItemType } from '../types'

interface ItemCardProps {
  item: SwagItem
  onRemove: (id: string) => void
  compact?: boolean
}

const categoryColors: Record<string, string> = {
  apparel: 'bg-blue-100 text-blue-700',
  tech: 'bg-purple-100 text-purple-700',
  drinkware: 'bg-amber-100 text-amber-700',
  stationery: 'bg-green-100 text-green-700',
  food: 'bg-red-100 text-red-700',
  custom: 'bg-gray-100 text-gray-600',
}

export function ItemCard({ item, onRemove, compact }: ItemCardProps) {
  const [{ isDragging }, drag] = useDrag<DragItemType, void, { isDragging: boolean }>(() => ({
    type: 'SWAG_ITEM',
    item: { type: 'SWAG_ITEM', itemId: item.id },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }), [item.id])

  return (
    <div
      ref={drag}
      className={`group relative flex items-center gap-3 rounded-lg border border-rule/10 bg-white p-3 cursor-grab active:cursor-grabbing transition-all duration-200 ${
        isDragging ? 'opacity-40 scale-95' : 'hover:border-lavender/30 hover:shadow-sm'
      } ${compact ? 'p-2 gap-2' : ''}`}
    >
      {/* Image */}
      <div className={`flex-shrink-0 rounded-md bg-ink/[0.03] overflow-hidden flex items-center justify-center ${compact ? 'w-8 h-8' : 'w-12 h-12'}`}>
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <svg width={compact ? 14 : 18} height={compact ? 14 : 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink-muted/40">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className={`font-medium tracking-tight text-ink truncate ${compact ? 'text-xs' : 'text-sm'}`}>
          {item.name}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${categoryColors[item.category] || categoryColors.custom}`}>
            {item.category}
          </span>
          {item.unitCost > 0 && (
            <span className="text-[11px] text-ink-muted">${item.unitCost.toFixed(2)}</span>
          )}
        </div>
      </div>

      {/* Remove button */}
      {!compact && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(item.id) }}
          className="opacity-0 group-hover:opacity-100 absolute top-1.5 right-1.5 w-5 h-5 flex items-center justify-center rounded-full text-ink-muted hover:text-ink hover:bg-ink/5 transition-all"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* Drag hint */}
      <div className={`flex-shrink-0 text-ink-muted/30 group-hover:text-ink-muted/60 transition-colors ${compact ? 'hidden' : ''}`}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="9" cy="5" r="2" />
          <circle cx="15" cy="5" r="2" />
          <circle cx="9" cy="12" r="2" />
          <circle cx="15" cy="12" r="2" />
          <circle cx="9" cy="19" r="2" />
          <circle cx="15" cy="19" r="2" />
        </svg>
      </div>
    </div>
  )
}
