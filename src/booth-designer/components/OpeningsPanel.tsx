import { useState } from 'react'
import type { BoothConfig, Opening } from '../types'

interface OpeningsPanelProps {
  config: BoothConfig
  onAddOpening: (opening: Omit<Opening, 'id'>) => void
  onRemoveOpening: (id: string) => void
  onClose: () => void
}

export function OpeningsPanel({ config, onAddOpening, onRemoveOpening, onClose }: OpeningsPanelProps) {
  const [wallSide, setWallSide] = useState<Opening['wallSide']>('top')
  const [position, setPosition] = useState(36)
  const [width, setWidth] = useState(48)
  const [type, setType] = useState<Opening['type']>('entry')

  const wallLength = (wallSide === 'top' || wallSide === 'bottom') ? config.width : config.depth

  const handleAdd = () => {
    const clampedPos = Math.max(0, Math.min(wallLength - width, position))
    onAddOpening({ wallSide, position: clampedPos, width, type })
  }

  return (
    <div className="fixed top-16 right-4 z-40 w-72 bg-white rounded-xl border border-rule/10 shadow-xl flex flex-col max-h-[calc(100vh-100px)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-rule/10">
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8E7DBE" strokeWidth="2">
            <path d="M13 4h3a2 2 0 0 1 2 2v14" />
            <path d="M2 20h3" /><path d="M13 20h9" />
            <path d="M10 12v.01" />
            <path d="M13 4.562v16.157a1 1 0 0 1-1.242.97L5 20V5.562a2 2 0 0 1 1.515-1.94l4-1A2 2 0 0 1 13 4.561z" />
          </svg>
          <h3 className="text-sm font-medium text-ink tracking-tight">Openings</h3>
        </div>
        <button onClick={onClose} className="text-ink-muted hover:text-ink transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>
      </div>

      {/* Add new */}
      <div className="px-4 py-3 space-y-3 border-b border-rule/10">
        <p className="text-[10px] text-ink-muted uppercase tracking-wide">Add an opening</p>

        {/* Type */}
        <div>
          <label className="text-[11px] text-ink-muted block mb-1">Type</label>
          <div className="flex gap-1">
            {(['entry', 'service'] as const).map(t => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`flex-1 px-2.5 py-1.5 text-xs rounded-md border transition-colors capitalize ${
                  type === t
                    ? 'border-lavender bg-lavender/10 text-lavender font-medium'
                    : 'border-rule/10 text-ink-muted hover:border-lavender/30'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Wall */}
        <div>
          <label className="text-[11px] text-ink-muted block mb-1">Wall side</label>
          <div className="grid grid-cols-4 gap-1">
            {(['top', 'right', 'bottom', 'left'] as const).map(side => {
              const wall = config.walls.find(w => w.side === side)
              return (
                <button
                  key={side}
                  onClick={() => setWallSide(side)}
                  className={`px-2 py-1.5 text-[11px] rounded-md border transition-colors capitalize ${
                    wallSide === side
                      ? 'border-lavender bg-lavender/10 text-lavender font-medium'
                      : 'border-rule/10 text-ink-muted hover:border-lavender/30'
                  } ${!wall?.hasWall ? 'opacity-50' : ''}`}
                >
                  {side}
                </button>
              )
            })}
          </div>
        </div>

        {/* Position */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] text-ink-muted block mb-1">Position (in)</label>
            <input
              type="number"
              value={position}
              onChange={e => setPosition(Math.max(0, Number(e.target.value)))}
              className="w-full px-2 py-1.5 text-xs border border-rule/10 rounded-md focus:outline-none focus:border-lavender/40"
              min={0} max={wallLength - width}
            />
          </div>
          <div>
            <label className="text-[11px] text-ink-muted block mb-1">Width (in)</label>
            <input
              type="number"
              value={width}
              onChange={e => setWidth(Math.max(12, Math.min(wallLength, Number(e.target.value))))}
              className="w-full px-2 py-1.5 text-xs border border-rule/10 rounded-md focus:outline-none focus:border-lavender/40"
              min={12} max={wallLength}
            />
          </div>
        </div>

        <button
          onClick={handleAdd}
          className="w-full px-3 py-1.5 text-xs bg-lavender text-white rounded-md hover:bg-lavender/90 transition-colors"
        >
          Add opening
        </button>
      </div>

      {/* Existing openings */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <p className="text-[10px] text-ink-muted uppercase tracking-wide mb-2">
          Current openings ({config.openings.length})
        </p>

        {config.openings.length === 0 ? (
          <p className="text-[11px] text-ink-muted/60 py-4 text-center">No openings added yet.</p>
        ) : (
          <div className="space-y-2">
            {config.openings.map(o => (
              <div key={o.id} className="flex items-center justify-between p-2.5 rounded-lg bg-paper/50 border border-rule/5">
                <div>
                  <p className="text-xs text-ink font-medium capitalize">{o.type} — {o.wallSide} wall</p>
                  <p className="text-[10px] text-ink-muted mt-0.5">
                    {o.width}" wide at {o.position}" from start
                  </p>
                </div>
                <button
                  onClick={() => onRemoveOpening(o.id)}
                  className="p-1 text-ink-muted hover:text-red-500 transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
