import type { PlacedElement } from '../types'
import { ELEMENT_CATALOG, CATEGORY_LABELS } from '../constants'

interface ItemListViewProps {
  elements: PlacedElement[]
  totalBudget: number
  onSelect: (id: string) => void
  selectedId: string | null
  onRemove: (id: string) => void
  onDuplicate: (id: string) => void
}

interface GroupedItem {
  type: string
  label: string
  category: string
  count: number
  unitCost: number
  totalCost: number
  ids: string[]
}

export function ItemListView({ elements, totalBudget, onSelect, selectedId, onRemove, onDuplicate }: ItemListViewProps) {
  // Group by type
  const grouped: GroupedItem[] = []
  const map = new Map<string, GroupedItem>()

  for (const el of elements) {
    const existing = map.get(el.type)
    if (existing) {
      existing.count++
      existing.totalCost += el.cost
      existing.ids.push(el.id)
    } else {
      const def = ELEMENT_CATALOG.find(d => d.type === el.type)
      const item: GroupedItem = {
        type: el.type,
        label: el.label,
        category: def?.category ?? 'other',
        count: 1,
        unitCost: el.cost,
        totalCost: el.cost,
        ids: [el.id],
      }
      map.set(el.type, item)
      grouped.push(item)
    }
  }

  // Group by category
  const categories = Array.from(new Set(grouped.map(g => g.category)))

  return (
    <div className="flex-1 min-w-0 h-full overflow-auto bg-white">
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-lg font-medium text-ink tracking-tight">Item List</h2>
          <p className="text-xs text-ink-muted mt-1">
            {elements.length} item{elements.length !== 1 ? 's' : ''} placed &middot; Total budget: ${totalBudget.toLocaleString()}
          </p>
        </div>

        {elements.length === 0 ? (
          <div className="text-center py-16">
            <svg className="mx-auto mb-4 text-ink-muted/30" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
            <p className="text-sm text-ink-muted">No items placed yet.</p>
            <p className="text-xs text-ink-muted/70 mt-1">Drag elements from the catalog onto the floor plan.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {categories.map(cat => {
              const items = grouped.filter(g => g.category === cat)
              const catTotal = items.reduce((s, i) => s + i.totalCost, 0)

              return (
                <div key={cat}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-medium text-ink-muted uppercase tracking-wide">
                      {CATEGORY_LABELS[cat] ?? cat}
                    </h3>
                    <span className="text-xs font-mono text-ink-muted">${catTotal.toLocaleString()}</span>
                  </div>

                  <div className="border border-rule/10 rounded-lg overflow-hidden">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-paper/50">
                          <th className="text-left px-3 py-2 text-ink-muted font-medium">Item</th>
                          <th className="text-center px-3 py-2 text-ink-muted font-medium w-16">Qty</th>
                          <th className="text-right px-3 py-2 text-ink-muted font-medium w-20">Unit</th>
                          <th className="text-right px-3 py-2 text-ink-muted font-medium w-24">Subtotal</th>
                          <th className="w-20"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map(item => (
                          <tr
                            key={item.type}
                            className={`border-t border-rule/5 hover:bg-lavender/[0.03] transition-colors ${
                              item.ids.includes(selectedId ?? '') ? 'bg-lavender/[0.06]' : ''
                            }`}
                          >
                            <td className="px-3 py-2.5">
                              <button
                                onClick={() => onSelect(item.ids[0])}
                                className="text-ink hover:text-lavender transition-colors text-left"
                              >
                                {item.label}
                              </button>
                            </td>
                            <td className="text-center px-3 py-2.5 font-mono text-ink-muted">{item.count}</td>
                            <td className="text-right px-3 py-2.5 font-mono text-ink-muted">${item.unitCost}</td>
                            <td className="text-right px-3 py-2.5 font-mono font-medium text-ink">${item.totalCost.toLocaleString()}</td>
                            <td className="px-3 py-2.5">
                              <div className="flex items-center gap-1 justify-end">
                                <button
                                  onClick={() => onDuplicate(item.ids[item.ids.length - 1])}
                                  className="p-1 text-ink-muted hover:text-lavender transition-colors"
                                  title="Add another"
                                >
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                </button>
                                <button
                                  onClick={() => onRemove(item.ids[item.ids.length - 1])}
                                  className="p-1 text-ink-muted hover:text-red-500 transition-colors"
                                  title="Remove one"
                                >
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            })}

            {/* Total */}
            <div className="flex items-center justify-between pt-4 border-t border-rule/10">
              <span className="text-sm font-medium text-ink">Total Budget</span>
              <span className="text-lg font-mono font-medium text-ink">${totalBudget.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
