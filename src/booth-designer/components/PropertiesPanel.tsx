import type { PlacedElement } from '../types'
import { ELEMENT_CATALOG } from '../constants'

interface PropertiesPanelProps {
  element: PlacedElement
  onUpdate: (id: string, partial: Partial<PlacedElement>) => void
  onRotate: (id: string) => void
  onDuplicate: (id: string) => void
  onRemove: (id: string) => void
  onClose: () => void
}

function formatPos(inches: number): string {
  const feet = Math.floor(inches / 12)
  const rem = Math.round(inches % 12)
  return rem === 0 ? `${feet}'` : `${feet}' ${rem}"`
}

export function PropertiesPanel({
  element,
  onUpdate,
  onRotate,
  onDuplicate,
  onRemove,
  onClose,
}: PropertiesPanelProps) {
  const def = ELEMENT_CATALOG.find(e => e.type === element.type)

  return (
    <div className="w-64 bg-white border-l border-rule/10 flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-rule/10">
        <h3 className="text-sm font-medium text-ink tracking-tight">{element.label}</h3>
        <button onClick={onClose} className="text-ink-muted hover:text-ink transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="flex-1 px-4 py-3 space-y-4">
        {/* Type info */}
        {def && (
          <div className="text-[10px] text-ink-muted uppercase tracking-wide">
            {def.category}
          </div>
        )}

        {/* Label */}
        <div>
          <label className="text-[11px] text-ink-muted block mb-1">Label</label>
          <input
            type="text"
            value={element.label}
            onChange={e => onUpdate(element.id, { label: e.target.value })}
            className="w-full px-2.5 py-1.5 text-xs border border-rule/10 rounded-md focus:outline-none focus:border-lavender/40"
          />
        </div>

        {/* Position */}
        <div>
          <label className="text-[11px] text-ink-muted block mb-1">Position</label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] text-ink-muted">X</span>
              <div className="text-xs font-mono mt-0.5">{formatPos(element.x)}</div>
            </div>
            <div>
              <span className="text-[10px] text-ink-muted">Y</span>
              <div className="text-xs font-mono mt-0.5">{formatPos(element.y)}</div>
            </div>
          </div>
        </div>

        {/* Size */}
        <div>
          <label className="text-[11px] text-ink-muted block mb-1">Size</label>
          <div className="grid grid-cols-3 gap-2 text-xs font-mono">
            <div>
              <span className="text-[10px] text-ink-muted">W</span>
              <div className="mt-0.5">{formatPos(element.width)}</div>
            </div>
            <div>
              <span className="text-[10px] text-ink-muted">D</span>
              <div className="mt-0.5">{formatPos(element.depth)}</div>
            </div>
            <div>
              <span className="text-[10px] text-ink-muted">H</span>
              <div className="mt-0.5">{formatPos(element.height)}</div>
            </div>
          </div>
        </div>

        {/* Rotation */}
        <div>
          <label className="text-[11px] text-ink-muted block mb-1">Rotation</label>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono">{element.rotation}°</span>
            <button
              onClick={() => onRotate(element.id)}
              className="px-2.5 py-1 text-xs border border-rule/10 rounded-md hover:border-lavender/30 transition-colors"
            >
              Rotate 90°
            </button>
          </div>
        </div>

        {/* Cost */}
        <div>
          <label className="text-[11px] text-ink-muted block mb-1">Cost</label>
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-ink-muted">$</span>
            <input
              type="number"
              value={element.cost}
              onChange={e => onUpdate(element.id, { cost: Math.max(0, Number(e.target.value)) })}
              className="w-full pl-6 pr-2.5 py-1.5 text-xs border border-rule/10 rounded-md focus:outline-none focus:border-lavender/40 font-mono"
              min={0}
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="text-[11px] text-ink-muted block mb-1">Notes</label>
          <textarea
            value={element.notes}
            onChange={e => onUpdate(element.id, { notes: e.target.value })}
            rows={2}
            className="w-full px-2.5 py-1.5 text-xs border border-rule/10 rounded-md focus:outline-none focus:border-lavender/40 resize-none"
            placeholder="Add notes..."
          />
        </div>

        {/* Lock toggle */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-ink-muted">Lock position</span>
          <button
            onClick={() => onUpdate(element.id, { locked: !element.locked })}
            className={`w-8 h-4.5 rounded-full transition-colors ${
              element.locked ? 'bg-lavender' : 'bg-ink/10'
            }`}
          >
            <div className={`w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-transform ${
              element.locked ? 'translate-x-4' : 'translate-x-0.5'
            }`} />
          </button>
        </div>

        {/* Color */}
        <div>
          <label className="text-[11px] text-ink-muted block mb-1">Color</label>
          <input
            type="color"
            value={element.color}
            onChange={e => onUpdate(element.id, { color: e.target.value })}
            className="w-8 h-8 rounded border border-rule/10 cursor-pointer"
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="px-4 py-3 border-t border-rule/10 space-y-2">
        <button
          onClick={() => onDuplicate(element.id)}
          className="w-full px-3 py-1.5 text-xs border border-rule/10 rounded-md hover:border-lavender/30 hover:bg-lavender/[0.04] transition-colors"
        >
          Duplicate
        </button>
        <button
          onClick={() => onRemove(element.id)}
          className="w-full px-3 py-1.5 text-xs border border-red-200 text-red-600 rounded-md hover:bg-red-50 transition-colors"
        >
          Remove
        </button>
      </div>
    </div>
  )
}
