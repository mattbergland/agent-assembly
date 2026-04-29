import { Plus, Trash2, BarChart3 } from 'lucide-react'
import type { SavedEvent } from '../utils/storage'
import { deleteEvent } from '../utils/storage'
import { EVENT_TYPES, calculateROI } from '../types'

function getTypeLabel(type: string) {
  return EVENT_TYPES.find((t) => t.value === type)?.label ?? type
}

function fmtDate(ts: number) {
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function fmtDollar(n: number) {
  if (n === 0 || !isFinite(n)) return '—'
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`
  return `$${Math.round(n).toLocaleString()}`
}

interface EventLibraryProps {
  savedEvents: SavedEvent[]
  activeEventId: string | null
  onLoad: (id: string) => void
  onNew: () => void
  onDelete: (id: string) => void
  onCompare: () => void
  refreshEvents: () => void
}

export default function EventLibrary({
  savedEvents,
  activeEventId,
  onLoad,
  onNew,
  onDelete,
  onCompare,
  refreshEvents,
}: EventLibraryProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs uppercase tracking-[0.12em] text-ink-muted font-medium">
          Saved Events
        </h3>
        <button
          onClick={onNew}
          className="text-lavender hover:text-lavender-soft transition-colors"
          title="New event"
        >
          <Plus size={16} />
        </button>
      </div>

      {savedEvents.length === 0 ? (
        <p className="text-sm text-ink-muted/50 italic">
          No saved events yet. Fill in data and click Save to keep it.
        </p>
      ) : (
        <>
          <div className="space-y-2 mb-4">
            {savedEvents.map((ev) => {
              const metrics = calculateROI(ev.inputs)
              const isActive = ev.id === activeEventId
              return (
                <div
                  key={ev.id}
                  className={`group p-3 border cursor-pointer transition-all duration-150 ${
                    isActive
                      ? 'border-lavender bg-lavender/5'
                      : 'border-rule/10 hover:border-rule/30'
                  }`}
                  onClick={() => onLoad(ev.id)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-ink truncate">
                        {ev.inputs.eventName || 'Untitled Event'}
                      </div>
                      <div className="text-[11px] text-ink-muted mt-0.5">
                        {getTypeLabel(ev.inputs.eventType)} · {fmtDate(ev.updatedAt)}
                      </div>
                      <div className="text-[11px] text-ink-muted mt-1 tabular-nums">
                        {fmtDollar(metrics.totalCost)} invested
                        {metrics.revenueROI !== 0 && isFinite(metrics.revenueROI) && (
                          <span className={metrics.revenueROI > 0 ? ' text-emerald-700' : ' text-red-700'}>
                            {' · '}{metrics.revenueROI > 0 ? '+' : ''}{metrics.revenueROI.toFixed(0)}% ROI
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteEvent(ev.id)
                        onDelete(ev.id)
                        refreshEvents()
                      }}
                      className="opacity-0 group-hover:opacity-100 text-ink-muted hover:text-red-600 transition-all p-1"
                      title="Delete"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {savedEvents.length >= 2 && (
            <button
              onClick={onCompare}
              className="w-full flex items-center justify-center gap-2 py-2 text-xs text-lavender border border-lavender/30 hover:bg-lavender/5 transition-colors"
            >
              <BarChart3 size={12} />
              Compare Events
            </button>
          )}
        </>
      )}
    </div>
  )
}
