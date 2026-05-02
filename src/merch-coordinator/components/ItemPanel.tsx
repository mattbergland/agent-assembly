import { useState } from 'react'
import type { SwagItem, Kit } from '../types'
import { ItemCard } from './ItemCard'
import { AddItemForm } from './AddItemForm'

interface ItemPanelProps {
  items: SwagItem[]
  onAdd: (item: Omit<SwagItem, 'id'>) => void
  onRemove: (id: string) => void
  activeKit?: Kit | null
  onAddItemToKit?: (itemId: string) => void
  onClose?: () => void
}

export function ItemPanel({ items, onAdd, onRemove, activeKit, onAddItemToKit, onClose }: ItemPanelProps) {
  const [search, setSearch] = useState('')

  const filtered = items.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="w-full h-full flex-shrink-0 flex flex-col border-r border-rule/10 bg-paper overflow-hidden">
      <div className="p-4 space-y-4 border-b border-rule/10">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium tracking-tight text-ink">Items</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-ink-muted">{items.length} item{items.length !== 1 ? 's' : ''}</span>
            {onClose && (
              <button
                onClick={onClose}
                className="md:hidden w-6 h-6 flex items-center justify-center rounded-full text-ink-muted hover:text-ink hover:bg-ink/5 transition-colors"
                aria-label="Close panel"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
        <AddItemForm onAdd={onAdd} />
      </div>

      {items.length > 3 && (
        <div className="px-4 py-3 border-b border-rule/10">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search items..."
            className="w-full px-3 py-1.5 text-sm bg-white border border-rule/10 rounded-lg focus:outline-none focus:border-lavender/50 focus:ring-1 focus:ring-lavender/20 placeholder:text-ink-muted/50"
          />
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {filtered.length === 0 && items.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-ink-muted">No items yet</p>
            <p className="text-xs text-ink-muted/60 mt-1">Add swag items to build kits</p>
          </div>
        )}
        {filtered.length === 0 && items.length > 0 && (
          <p className="text-sm text-ink-muted text-center py-4">No matches</p>
        )}
        {filtered.map(item => (
          <ItemCard
            key={item.id}
            item={item}
            onRemove={onRemove}
            showAddToKit={!!activeKit && !!onAddItemToKit}
            onAddToKit={onAddItemToKit ? () => onAddItemToKit(item.id) : undefined}
          />
        ))}
      </div>

      {items.length > 0 && (
        <div className="px-4 py-3 border-t border-rule/10">
          <p className="text-[10px] text-ink-muted/60 text-center hidden md:block">
            Drag items into a kit to add them
          </p>
          <p className="text-[10px] text-ink-muted/60 text-center md:hidden">
            {activeKit ? 'Tap + to add items to your kit' : 'Open a kit to add items'}
          </p>
        </div>
      )}
    </div>
  )
}
