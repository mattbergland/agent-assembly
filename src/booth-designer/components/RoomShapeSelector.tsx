import { useState } from 'react'
import type { BoothShape, WallSegment } from '../types'

interface RoomShapeSelectorProps {
  currentShape: BoothShape
  walls: WallSegment[]
  onSelect: (shape: BoothShape, width: number, depth: number, walls: WallSegment[]) => void
  onClose: () => void
}

interface ShapeOption {
  shape: BoothShape
  label: string
  description: string
  defaultWidth: number
  defaultDepth: number
  defaultWalls: Record<string, boolean>
}

const SHAPES: ShapeOption[] = [
  {
    shape: 'rectangle',
    label: 'Inline',
    description: 'Standard linear booth with back wall and two sides. Most common 10×10 or 10×20 configuration.',
    defaultWidth: 120,
    defaultDepth: 120,
    defaultWalls: { top: false, right: true, bottom: true, left: true },
  },
  {
    shape: 'island',
    label: 'Island',
    description: 'Open on all sides. Premium placement for maximum visibility and traffic flow.',
    defaultWidth: 240,
    defaultDepth: 240,
    defaultWalls: { top: false, right: false, bottom: false, left: false },
  },
  {
    shape: 'peninsula',
    label: 'Peninsula',
    description: 'Open on three sides with one back wall. Great for end-of-row positions.',
    defaultWidth: 240,
    defaultDepth: 120,
    defaultWalls: { top: false, right: false, bottom: true, left: false },
  },
  {
    shape: 'l-shape',
    label: 'Corner / L-Shape',
    description: 'Wraps around a corner with two open sides. Good for creating distinct zones.',
    defaultWidth: 240,
    defaultDepth: 240,
    defaultWalls: { top: false, right: false, bottom: true, left: true },
  },
  {
    shape: 'u-shape',
    label: 'U-Shape',
    description: 'Open on one side only with walls on three sides. Maximizes wall display space.',
    defaultWidth: 240,
    defaultDepth: 120,
    defaultWalls: { top: false, right: true, bottom: true, left: true },
  },
]

function ShapeThumbnail({ shape, isSelected }: { shape: BoothShape; isSelected: boolean }) {
  const s = 80
  const pad = 8
  const wallW = 4
  const floorColor = isSelected ? '#EDE8F5' : '#F0EDE4'
  const wallColor = isSelected ? '#8E7DBE' : '#3A3A38'
  const openColor = isSelected ? '#B8ABD9' : '#CCCAC2'

  switch (shape) {
    case 'rectangle':
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <rect x={pad} y={pad} width={s - 2 * pad} height={s - 2 * pad} fill={floorColor} stroke={openColor} strokeWidth={1} rx={2} />
          {/* Back wall */}
          <rect x={pad} y={s - pad - wallW} width={s - 2 * pad} height={wallW} fill={wallColor} rx={1} />
          {/* Left wall */}
          <rect x={pad} y={pad} width={wallW} height={s - 2 * pad} fill={wallColor} rx={1} />
          {/* Right wall */}
          <rect x={s - pad - wallW} y={pad} width={wallW} height={s - 2 * pad} fill={wallColor} rx={1} />
          {/* Entry arrow */}
          <path d={`M${s / 2 - 8} ${pad + 2} L${s / 2} ${pad + 8} L${s / 2 + 8} ${pad + 2}`} fill="none" stroke={openColor} strokeWidth={1.5} />
        </svg>
      )
    case 'island':
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <rect x={pad + 6} y={pad + 6} width={s - 2 * pad - 12} height={s - 2 * pad - 12} fill={floorColor} stroke={openColor} strokeWidth={1} strokeDasharray="4 2" rx={2} />
          {/* Arrows on all sides */}
          <path d={`M${s / 2 - 6} ${pad} L${s / 2} ${pad + 5} L${s / 2 + 6} ${pad}`} fill="none" stroke={openColor} strokeWidth={1.5} />
          <path d={`M${s / 2 - 6} ${s - pad} L${s / 2} ${s - pad - 5} L${s / 2 + 6} ${s - pad}`} fill="none" stroke={openColor} strokeWidth={1.5} />
          <path d={`M${pad} ${s / 2 - 6} L${pad + 5} ${s / 2} L${pad} ${s / 2 + 6}`} fill="none" stroke={openColor} strokeWidth={1.5} />
          <path d={`M${s - pad} ${s / 2 - 6} L${s - pad - 5} ${s / 2} L${s - pad} ${s / 2 + 6}`} fill="none" stroke={openColor} strokeWidth={1.5} />
        </svg>
      )
    case 'peninsula':
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <rect x={pad} y={pad} width={s - 2 * pad} height={s - 2 * pad} fill={floorColor} stroke={openColor} strokeWidth={1} rx={2} />
          {/* Back wall only */}
          <rect x={pad} y={s - pad - wallW} width={s - 2 * pad} height={wallW} fill={wallColor} rx={1} />
          {/* Arrows on 3 open sides */}
          <path d={`M${s / 2 - 6} ${pad + 2} L${s / 2} ${pad + 7} L${s / 2 + 6} ${pad + 2}`} fill="none" stroke={openColor} strokeWidth={1.5} />
          <path d={`M${pad + 2} ${s / 2 - 6} L${pad + 7} ${s / 2} L${pad + 2} ${s / 2 + 6}`} fill="none" stroke={openColor} strokeWidth={1.5} />
          <path d={`M${s - pad - 2} ${s / 2 - 6} L${s - pad - 7} ${s / 2} L${s - pad - 2} ${s / 2 + 6}`} fill="none" stroke={openColor} strokeWidth={1.5} />
        </svg>
      )
    case 'l-shape':
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <path d={`M${pad} ${pad} H${s - pad} V${s / 2} H${s / 2} V${s - pad} H${pad} Z`} fill={floorColor} stroke={openColor} strokeWidth={1} />
          {/* Back wall (bottom) */}
          <rect x={pad} y={s - pad - wallW} width={s / 2 - pad} height={wallW} fill={wallColor} rx={1} />
          {/* Left wall */}
          <rect x={pad} y={pad} width={wallW} height={s - 2 * pad} fill={wallColor} rx={1} />
          {/* Inner corner walls */}
          <rect x={s / 2 - wallW} y={s / 2} width={wallW} height={s / 2 - pad} fill={wallColor} rx={1} />
          <rect x={s / 2} y={s / 2 - wallW} width={s / 2 - pad} height={wallW} fill={wallColor} rx={1} />
        </svg>
      )
    case 'u-shape':
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <rect x={pad} y={pad} width={s - 2 * pad} height={s - 2 * pad} fill={floorColor} stroke={openColor} strokeWidth={1} rx={2} />
          {/* Back, left, right walls */}
          <rect x={pad} y={s - pad - wallW} width={s - 2 * pad} height={wallW} fill={wallColor} rx={1} />
          <rect x={pad} y={pad} width={wallW} height={s - 2 * pad} fill={wallColor} rx={1} />
          <rect x={s - pad - wallW} y={pad} width={wallW} height={s - 2 * pad} fill={wallColor} rx={1} />
          {/* Entry arrow (top) */}
          <path d={`M${s / 2 - 8} ${pad + 2} L${s / 2} ${pad + 8} L${s / 2 + 8} ${pad + 2}`} fill="none" stroke={openColor} strokeWidth={1.5} />
        </svg>
      )
    default:
      return null
  }
}

const SIDE_LABELS: Record<string, string> = {
  top: 'Front',
  right: 'Right',
  bottom: 'Back',
  left: 'Left',
}

function WallMiniDiagram({ walls }: { walls: Record<string, boolean> }) {
  const s = 100
  const pad = 16
  const inner = s - 2 * pad

  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
      <rect x={pad} y={pad} width={inner} height={inner} fill="#F5F5F3" stroke="#E0DDD5" strokeWidth={1} rx={2} />
      {/* Top / Front */}
      <rect x={pad} y={pad - 3} width={inner} height={4} rx={1.5}
        fill={walls.top ? '#3A3A38' : 'transparent'} stroke={walls.top ? 'none' : '#CCCAC2'} strokeWidth={1} strokeDasharray={walls.top ? 'none' : '3 2'} />
      {/* Bottom / Back */}
      <rect x={pad} y={pad + inner - 1} width={inner} height={4} rx={1.5}
        fill={walls.bottom ? '#3A3A38' : 'transparent'} stroke={walls.bottom ? 'none' : '#CCCAC2'} strokeWidth={1} strokeDasharray={walls.bottom ? 'none' : '3 2'} />
      {/* Left */}
      <rect x={pad - 3} y={pad} width={4} height={inner} rx={1.5}
        fill={walls.left ? '#3A3A38' : 'transparent'} stroke={walls.left ? 'none' : '#CCCAC2'} strokeWidth={1} strokeDasharray={walls.left ? 'none' : '3 2'} />
      {/* Right */}
      <rect x={pad + inner - 1} y={pad} width={4} height={inner} rx={1.5}
        fill={walls.right ? '#3A3A38' : 'transparent'} stroke={walls.right ? 'none' : '#CCCAC2'} strokeWidth={1} strokeDasharray={walls.right ? 'none' : '3 2'} />
      {/* Labels */}
      <text x={s / 2} y={pad - 7} textAnchor="middle" fontSize={7} fill="#AAA8A0" fontFamily="Inter, sans-serif">FRONT</text>
      <text x={s / 2} y={pad + inner + 14} textAnchor="middle" fontSize={7} fill="#AAA8A0" fontFamily="Inter, sans-serif">BACK</text>
    </svg>
  )
}

export function RoomShapeSelector({ currentShape, walls: currentWalls, onSelect, onClose }: RoomShapeSelectorProps) {
  const [selectedShape, setSelectedShape] = useState<BoothShape>(currentShape)
  const currentWallMap = Object.fromEntries(currentWalls.map(w => [w.side, w.hasWall]))
  const shapeOpt = SHAPES.find(s => s.shape === selectedShape)
  const [wallConfig, setWallConfig] = useState<Record<string, boolean>>(currentWallMap)

  const handleShapeClick = (opt: ShapeOption) => {
    setSelectedShape(opt.shape)
    setWallConfig(opt.defaultWalls)
  }

  const toggleWallSide = (side: string) => {
    setWallConfig(prev => ({ ...prev, [side]: !prev[side] }))
  }

  const handleApply = () => {
    const opt = SHAPES.find(s => s.shape === selectedShape)!
    const newWalls: WallSegment[] = (['top', 'right', 'bottom', 'left'] as const).map(side => ({
      id: `wall-${side}`,
      side,
      hasWall: wallConfig[side] ?? false,
    }))
    onSelect(selectedShape, opt.defaultWidth, opt.defaultDepth, newWalls)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/30 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl border border-rule/10 w-full max-w-3xl mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-rule/10">
          <div>
            <h2 className="text-lg font-medium text-ink tracking-tight">Booth Shape & Walls</h2>
            <p className="text-xs text-ink-muted mt-0.5">Select your booth layout, then configure which sides have walls.</p>
          </div>
          <button onClick={onClose} className="text-ink-muted hover:text-ink transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Shape selector */}
        <div className="p-6 pb-0">
          <p className="text-[10px] text-ink-muted uppercase tracking-wide mb-3">Booth Layout</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {SHAPES.map(opt => (
              <button
                key={opt.shape}
                onClick={() => handleShapeClick(opt)}
                className={`flex flex-col items-center text-left p-3 rounded-lg border transition-all ${
                  selectedShape === opt.shape
                    ? 'border-lavender bg-lavender/[0.06] shadow-sm'
                    : 'border-rule/10 hover:border-lavender/30 hover:bg-paper'
                }`}
              >
                <ShapeThumbnail shape={opt.shape} isSelected={selectedShape === opt.shape} />
                <h3 className={`text-xs font-medium mt-2 ${selectedShape === opt.shape ? 'text-lavender' : 'text-ink'}`}>
                  {opt.label}
                </h3>
              </button>
            ))}
          </div>
          {shapeOpt && (
            <p className="text-[11px] text-ink-muted mt-2">{shapeOpt.description}</p>
          )}
        </div>

        {/* Wall configuration */}
        <div className="p-6">
          <p className="text-[10px] text-ink-muted uppercase tracking-wide mb-3">Wall Configuration</p>
          <div className="flex items-start gap-6">
            <WallMiniDiagram walls={wallConfig} />
            <div className="flex-1 grid grid-cols-2 gap-2">
              {(['top', 'right', 'bottom', 'left'] as const).map(side => (
                <button
                  key={side}
                  onClick={() => toggleWallSide(side)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg border transition-all text-xs ${
                    wallConfig[side]
                      ? 'border-ink/20 bg-ink/[0.04]'
                      : 'border-rule/10 hover:border-lavender/30'
                  }`}
                >
                  <span className="font-medium text-ink">{SIDE_LABELS[side]} wall</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    wallConfig[side]
                      ? 'bg-ink/10 text-ink'
                      : 'bg-lavender/10 text-lavender'
                  }`}>
                    {wallConfig[side] ? 'Wall' : 'Open'}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <p className="text-[10px] text-ink-muted mt-3">Open sides face the aisle. Click a side to toggle between wall and open.</p>
        </div>

        {/* Apply button */}
        <div className="px-6 pb-5 flex justify-end">
          <button
            onClick={handleApply}
            className="px-5 py-2 text-sm font-medium bg-lavender text-white rounded-lg hover:bg-lavender/90 transition-colors shadow-sm"
          >
            Apply Layout
          </button>
        </div>
      </div>
    </div>
  )
}
