import { useState } from 'react'
import type { BoothConfig, ViewMode } from '../types'
import { BOOTH_PRESETS } from '../constants'

interface ToolbarProps {
  config: BoothConfig
  viewMode: ViewMode
  totalBudget: number
  canUndo: boolean
  canRedo: boolean
  elementCount: number
  onUpdateConfig: (partial: Partial<BoothConfig>) => void
  onToggleWall: (side: 'top' | 'right' | 'bottom' | 'left') => void
  onSetViewMode: (mode: ViewMode) => void
  onUndo: () => void
  onRedo: () => void
  onClear: () => void
}

function formatDim(inches: number): string {
  const feet = Math.floor(inches / 12)
  const rem = inches % 12
  return rem === 0 ? `${feet}'` : `${feet}' ${rem}"`
}

export function Toolbar({
  config,
  viewMode,
  totalBudget,
  canUndo,
  canRedo,
  elementCount,
  onUpdateConfig,
  onToggleWall,
  onSetViewMode,
  onUndo,
  onRedo,
  onClear,
}: ToolbarProps) {
  const [showBoothMenu, setShowBoothMenu] = useState(false)
  const [showWallMenu, setShowWallMenu] = useState(false)
  const [customW, setCustomW] = useState(String(config.width / 12))
  const [customD, setCustomD] = useState(String(config.depth / 12))

  const applyPreset = (w: number, d: number) => {
    onUpdateConfig({ width: w, depth: d })
    setCustomW(String(w / 12))
    setCustomD(String(d / 12))
    setShowBoothMenu(false)
  }

  const applyCustom = () => {
    const w = Math.max(5, Math.min(100, Number(customW))) * 12
    const d = Math.max(5, Math.min(100, Number(customD))) * 12
    onUpdateConfig({ width: w, depth: d })
    setShowBoothMenu(false)
  }

  return (
    <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-white border-b border-rule/10 flex-wrap">
      {/* Booth size selector */}
      <div className="relative">
        <button
          onClick={() => { setShowBoothMenu(!showBoothMenu); setShowWallMenu(false) }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-md border border-rule/10 hover:border-lavender/30 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /></svg>
          <span className="hidden sm:inline">Booth Size</span>
          <span className="font-mono text-ink-muted">{formatDim(config.width)} × {formatDim(config.depth)}</span>
        </button>

        {showBoothMenu && (
          <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg border border-rule/10 shadow-lg z-50 p-3">
            <p className="text-[10px] text-ink-muted uppercase tracking-wide mb-2">Presets</p>
            <div className="grid grid-cols-2 gap-1.5 mb-3">
              {BOOTH_PRESETS.map(p => (
                <button
                  key={p.label}
                  onClick={() => applyPreset(p.width, p.depth)}
                  className={`text-xs px-2.5 py-1.5 rounded-md border transition-colors ${
                    config.width === p.width && config.depth === p.depth
                      ? 'border-lavender bg-lavender/10 text-lavender font-medium'
                      : 'border-rule/10 hover:border-lavender/30 text-ink-muted hover:text-ink'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-ink-muted uppercase tracking-wide mb-2">Custom (feet)</p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={customW}
                onChange={e => setCustomW(e.target.value)}
                className="w-16 px-2 py-1 text-xs border border-rule/10 rounded-md focus:outline-none focus:border-lavender/40"
                min={5} max={100}
              />
              <span className="text-xs text-ink-muted">×</span>
              <input
                type="number"
                value={customD}
                onChange={e => setCustomD(e.target.value)}
                className="w-16 px-2 py-1 text-xs border border-rule/10 rounded-md focus:outline-none focus:border-lavender/40"
                min={5} max={100}
              />
              <button onClick={applyCustom} className="px-2.5 py-1 text-xs bg-lavender text-white rounded-md hover:bg-lavender/90 transition-colors">
                Apply
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="w-px h-5 bg-rule/10" />

      {/* Wall toggles */}
      <div className="relative">
        <button
          onClick={() => { setShowWallMenu(!showWallMenu); setShowBoothMenu(false) }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-md border border-rule/10 hover:border-lavender/30 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18" /><path d="M21 3H3" /></svg>
          <span className="hidden sm:inline">Walls</span>
        </button>

        {showWallMenu && (
          <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-lg border border-rule/10 shadow-lg z-50 p-3">
            <p className="text-[10px] text-ink-muted uppercase tracking-wide mb-2">Toggle walls</p>
            {(['top', 'right', 'bottom', 'left'] as const).map(side => {
              const wall = config.walls.find(w => w.side === side)
              return (
                <button
                  key={side}
                  onClick={() => onToggleWall(side)}
                  className="flex items-center justify-between w-full px-2.5 py-1.5 text-xs rounded-md hover:bg-paper transition-colors"
                >
                  <span className="capitalize">{side} wall</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                    wall?.hasWall ? 'bg-ink/10 text-ink' : 'bg-lavender/10 text-lavender'
                  }`}>
                    {wall?.hasWall ? 'Solid' : 'Open'}
                  </span>
                </button>
              )
            })}
            <p className="text-[10px] text-ink-muted mt-2">Open walls face the aisle.</p>
          </div>
        )}
      </div>

      {/* Ceiling height */}
      <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs border border-rule/10 rounded-md">
        <span className="text-ink-muted">Height</span>
        <input
          type="number"
          value={config.ceilingHeight}
          onChange={e => onUpdateConfig({ ceilingHeight: Math.max(60, Math.min(192, Number(e.target.value))) })}
          className="w-12 px-1 py-0.5 text-xs border border-rule/10 rounded focus:outline-none focus:border-lavender/40 text-center"
          min={60} max={192}
        />
        <span className="text-ink-muted">"</span>
      </div>

      {/* Divider */}
      <div className="w-px h-5 bg-rule/10" />

      {/* View toggle */}
      <div className="flex items-center bg-paper rounded-md p-0.5">
        <button
          onClick={() => onSetViewMode('floor')}
          className={`px-2.5 py-1 text-xs rounded transition-colors ${
            viewMode === 'floor' ? 'bg-white shadow-sm text-ink font-medium' : 'text-ink-muted hover:text-ink'
          }`}
        >
          2D
        </button>
        <button
          onClick={() => onSetViewMode('3d')}
          className={`px-2.5 py-1 text-xs rounded transition-colors ${
            viewMode === '3d' ? 'bg-white shadow-sm text-ink font-medium' : 'text-ink-muted hover:text-ink'
          }`}
        >
          3D
        </button>
      </div>

      {/* Divider */}
      <div className="w-px h-5 bg-rule/10" />

      {/* Undo / Redo */}
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className="p-1.5 rounded-md text-ink-muted hover:text-ink disabled:opacity-30 transition-colors"
        title="Undo"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></svg>
      </button>
      <button
        onClick={onRedo}
        disabled={!canRedo}
        className="p-1.5 rounded-md text-ink-muted hover:text-ink disabled:opacity-30 transition-colors"
        title="Redo"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
      </button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Stats */}
      <div className="hidden sm:flex items-center gap-3 text-xs text-ink-muted">
        <span>{elementCount} item{elementCount !== 1 ? 's' : ''}</span>
        <span className="text-rule/20">|</span>
        <span className="font-mono font-medium text-ink">${totalBudget.toLocaleString()}</span>
      </div>

      {/* Mobile budget */}
      <div className="flex sm:hidden items-center text-xs font-mono font-medium text-ink">
        ${totalBudget.toLocaleString()}
      </div>

      {/* Clear */}
      {elementCount > 0 && (
        <>
          <div className="w-px h-5 bg-rule/10" />
          <button
            onClick={onClear}
            className="text-xs text-ink-muted hover:text-ink transition-colors px-2 py-1"
          >
            Clear
          </button>
        </>
      )}
    </div>
  )
}
