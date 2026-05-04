import type { BoothConfig, PlacedElement } from '../types'

interface ThreeDViewProps {
  config: BoothConfig
  elements: PlacedElement[]
  selectedId: string | null
  onSelect: (id: string | null) => void
}

const ISO_ANGLE = Math.PI / 6
const SCALE = 2.5
const WALL_HEIGHT_SCALE = 0.6

function toIso(x: number, y: number, z: number): { x: number; y: number } {
  return {
    x: (x - y) * Math.cos(ISO_ANGLE) * SCALE,
    y: (x + y) * Math.sin(ISO_ANGLE) * SCALE - z * SCALE,
  }
}

export function ThreeDView({ config, elements, selectedId, onSelect }: ThreeDViewProps) {
  const bw = config.width
  const bd = config.depth
  const ch = config.ceilingHeight * WALL_HEIGHT_SCALE

  const viewW = (bw + bd) * Math.cos(ISO_ANGLE) * SCALE + 200
  const viewH = (bw + bd) * Math.sin(ISO_ANGLE) * SCALE + ch * SCALE + 200

  const offsetX = viewW / 2
  const offsetY = viewH * 0.75

  function iso(x: number, y: number, z: number) {
    const p = toIso(x, y, z)
    return { x: p.x + offsetX, y: p.y + offsetY }
  }

  // Floor polygon
  const f0 = iso(0, 0, 0)
  const f1 = iso(bw, 0, 0)
  const f2 = iso(bw, bd, 0)
  const f3 = iso(0, bd, 0)
  const floorPath = `M${f0.x},${f0.y} L${f1.x},${f1.y} L${f2.x},${f2.y} L${f3.x},${f3.y} Z`

  // Wall faces
  const walls: React.ReactNode[] = []

  // Back wall (y = bd, from x=0 to x=bw)
  const backWall = config.walls.find(w => w.side === 'bottom')
  if (backWall?.hasWall) {
    const a = iso(0, bd, 0)
    const b = iso(bw, bd, 0)
    const c = iso(bw, bd, ch)
    const d = iso(0, bd, ch)
    walls.push(
      <polygon
        key="back-wall"
        points={`${a.x},${a.y} ${b.x},${b.y} ${c.x},${c.y} ${d.x},${d.y}`}
        fill="#E8E6DE"
        stroke="#C8C6BE"
        strokeWidth={0.8}
      />
    )
  }

  // Left wall (x = 0, from y=0 to y=bd)
  const leftWall = config.walls.find(w => w.side === 'left')
  if (leftWall?.hasWall) {
    const a = iso(0, 0, 0)
    const b = iso(0, bd, 0)
    const c = iso(0, bd, ch)
    const d = iso(0, 0, ch)
    walls.push(
      <polygon
        key="left-wall"
        points={`${a.x},${a.y} ${b.x},${b.y} ${c.x},${c.y} ${d.x},${d.y}`}
        fill="#DEDCD4"
        stroke="#C8C6BE"
        strokeWidth={0.8}
      />
    )
  }

  // Right wall (x = bw, from y=0 to y=bd)
  const rightWall = config.walls.find(w => w.side === 'right')
  if (rightWall?.hasWall) {
    const a = iso(bw, 0, 0)
    const b = iso(bw, bd, 0)
    const c = iso(bw, bd, ch)
    const d = iso(bw, 0, ch)
    walls.push(
      <polygon
        key="right-wall"
        points={`${a.x},${a.y} ${b.x},${b.y} ${c.x},${c.y} ${d.x},${d.y}`}
        fill="#D4D2CA"
        stroke="#C8C6BE"
        strokeWidth={0.8}
      />
    )
  }

  // Sort elements by depth for painter's algorithm (back to front)
  const sortedElements = [...elements].sort((a, b) => (b.y + b.depth) - (a.y + a.depth) || (b.x + b.width) - (a.x + a.width))

  // Element rendering
  const elementNodes = sortedElements.map(el => {
    const ex = el.x
    const ey = el.y
    const ew = el.width
    const ed = el.depth
    const eh = el.height * WALL_HEIGHT_SCALE
    const isSelected = el.id === selectedId

    // Top face
    const t0 = iso(ex, ey, eh)
    const t1 = iso(ex + ew, ey, eh)
    const t2 = iso(ex + ew, ey + ed, eh)
    const t3 = iso(ex, ey + ed, eh)
    const topPath = `M${t0.x},${t0.y} L${t1.x},${t1.y} L${t2.x},${t2.y} L${t3.x},${t3.y} Z`

    // Front face (y = ey, from z=0 to z=eh)
    const ff0 = iso(ex, ey, 0)
    const ff1 = iso(ex + ew, ey, 0)
    const ff2 = iso(ex + ew, ey, eh)
    const ff3 = iso(ex, ey, eh)
    const frontPath = `M${ff0.x},${ff0.y} L${ff1.x},${ff1.y} L${ff2.x},${ff2.y} L${ff3.x},${ff3.y} Z`

    // Right face (x = ex + ew, from y to y+ed)
    const rf0 = iso(ex + ew, ey, 0)
    const rf1 = iso(ex + ew, ey + ed, 0)
    const rf2 = iso(ex + ew, ey + ed, eh)
    const rf3 = iso(ex + ew, ey, eh)
    const rightPath = `M${rf0.x},${rf0.y} L${rf1.x},${rf1.y} L${rf2.x},${rf2.y} L${rf3.x},${rf3.y} Z`

    // Lighter/darker shades of element color
    const baseColor = el.color

    return (
      <g
        key={el.id}
        onClick={(e) => { e.stopPropagation(); onSelect(el.id) }}
        style={{ cursor: 'pointer' }}
        opacity={0.95}
      >
        {/* Right face */}
        <path d={rightPath} fill={baseColor} stroke={isSelected ? '#8E7DBE' : '#AAA'} strokeWidth={isSelected ? 1.5 : 0.5} opacity={0.7} />
        {/* Front face */}
        <path d={frontPath} fill={baseColor} stroke={isSelected ? '#8E7DBE' : '#AAA'} strokeWidth={isSelected ? 1.5 : 0.5} opacity={0.85} />
        {/* Top face */}
        <path d={topPath} fill={baseColor} stroke={isSelected ? '#8E7DBE' : '#AAA'} strokeWidth={isSelected ? 1.5 : 0.5} />

        {/* Label on top */}
        {ew > 20 && ed > 20 && (
          <text
            x={(t0.x + t2.x) / 2}
            y={(t0.y + t2.y) / 2 + 3}
            textAnchor="middle"
            fill="#444"
            fontSize={Math.min(9, ew / 6)}
            fontFamily="Inter, sans-serif"
            pointerEvents="none"
          >
            {el.label}
          </text>
        )}

        {/* Selection highlight */}
        {isSelected && (
          <path d={topPath} fill="none" stroke="#8E7DBE" strokeWidth={2} strokeDasharray="4 2" />
        )}
      </g>
    )
  })

  return (
    <div className="flex-1 min-w-0 h-full overflow-auto bg-[#FAFAF8] flex items-center justify-center"
      onClick={() => onSelect(null)}
    >
      <svg width={viewW} height={viewH} viewBox={`0 0 ${viewW} ${viewH}`}>
        {/* Floor */}
        <path d={floorPath} fill="#F0EDE4" stroke="#CCCAC2" strokeWidth={1} />

        {/* Grid on floor */}
        {Array.from({ length: Math.floor(bw / 12) + 1 }, (_, i) => {
          const a = iso(i * 12, 0, 0)
          const b = iso(i * 12, bd, 0)
          return <line key={`gx${i}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#DDD" strokeWidth={0.3} />
        })}
        {Array.from({ length: Math.floor(bd / 12) + 1 }, (_, i) => {
          const a = iso(0, i * 12, 0)
          const b = iso(bw, i * 12, 0)
          return <line key={`gy${i}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#DDD" strokeWidth={0.3} />
        })}

        {/* Walls */}
        {walls}

        {/* Elements */}
        {elementNodes}

        {/* Entry label */}
        {!config.walls.find(w => w.side === 'top')?.hasWall && (() => {
          const mid = iso(bw / 2, -8, 0)
          return (
            <text x={mid.x} y={mid.y} textAnchor="middle" fill="#8E7DBE" fontSize={10} fontFamily="Inter, sans-serif" letterSpacing={1}>
              AISLE
            </text>
          )
        })()}
      </svg>

      {/* View label */}
      <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-md px-3 py-1.5 border border-rule/10 shadow-sm z-10">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8E7DBE" strokeWidth="2"><path d="M12 3 2 12h3v8h6v-6h2v6h6v-8h3L12 3z" /></svg>
        <span className="text-xs text-ink-muted font-medium">3D View</span>
      </div>
    </div>
  )
}
