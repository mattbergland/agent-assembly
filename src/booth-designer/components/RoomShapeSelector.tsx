import type { BoothShape } from '../types'

interface RoomShapeSelectorProps {
  currentShape: BoothShape
  onSelect: (shape: BoothShape, width: number, depth: number) => void
  onClose: () => void
}

interface ShapeOption {
  shape: BoothShape
  label: string
  description: string
  defaultWidth: number
  defaultDepth: number
}

const SHAPES: ShapeOption[] = [
  {
    shape: 'rectangle',
    label: 'Inline',
    description: 'Standard linear booth with back wall and two sides. Most common 10×10 or 10×20 configuration.',
    defaultWidth: 120,
    defaultDepth: 120,
  },
  {
    shape: 'island',
    label: 'Island',
    description: 'Open on all sides. Premium placement for maximum visibility and traffic flow.',
    defaultWidth: 240,
    defaultDepth: 240,
  },
  {
    shape: 'peninsula',
    label: 'Peninsula',
    description: 'Open on three sides with one back wall. Great for end-of-row positions.',
    defaultWidth: 240,
    defaultDepth: 120,
  },
  {
    shape: 'l-shape',
    label: 'Corner / L-Shape',
    description: 'Wraps around a corner with two open sides. Good for creating distinct zones.',
    defaultWidth: 240,
    defaultDepth: 240,
  },
  {
    shape: 'u-shape',
    label: 'U-Shape',
    description: 'Open on one side only with walls on three sides. Maximizes wall display space.',
    defaultWidth: 240,
    defaultDepth: 120,
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

export function RoomShapeSelector({ currentShape, onSelect, onClose }: RoomShapeSelectorProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/30 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl border border-rule/10 w-full max-w-2xl mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-rule/10">
          <div>
            <h2 className="text-lg font-medium text-ink tracking-tight">Booth Shape</h2>
            <p className="text-xs text-ink-muted mt-0.5">Select the layout that matches your booth assignment.</p>
          </div>
          <button onClick={onClose} className="text-ink-muted hover:text-ink transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SHAPES.map(opt => (
            <button
              key={opt.shape}
              onClick={() => onSelect(opt.shape, opt.defaultWidth, opt.defaultDepth)}
              className={`flex flex-col items-center text-left p-4 rounded-lg border transition-all ${
                currentShape === opt.shape
                  ? 'border-lavender bg-lavender/[0.06] shadow-sm'
                  : 'border-rule/10 hover:border-lavender/30 hover:bg-paper'
              }`}
            >
              <ShapeThumbnail shape={opt.shape} isSelected={currentShape === opt.shape} />
              <h3 className={`text-sm font-medium mt-3 ${currentShape === opt.shape ? 'text-lavender' : 'text-ink'}`}>
                {opt.label}
              </h3>
              <p className="text-[11px] text-ink-muted leading-relaxed mt-1 text-center">
                {opt.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
