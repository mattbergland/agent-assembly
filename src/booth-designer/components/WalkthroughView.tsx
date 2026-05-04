import { useState, useCallback, useRef, useEffect } from 'react'
import type { BoothConfig, PlacedElement } from '../types'

interface WalkthroughViewProps {
  config: BoothConfig
  elements: PlacedElement[]
  selectedId: string | null
  onSelect: (id: string | null) => void
}

export function WalkthroughView({ config, elements, selectedId, onSelect }: WalkthroughViewProps) {
  const bw = config.width
  const bd = config.depth
  const ch = config.ceilingHeight

  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const panStart = useRef({ x: 0, y: 0 })
  const panOrigin = useRef({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setPan({ x: 0, y: 0 }) }, [config.width, config.depth])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0 || e.button === 1) {
      setIsPanning(true)
      panStart.current = { x: e.clientX, y: e.clientY }
      panOrigin.current = { ...pan }
    }
  }, [pan])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning) return
    setPan({
      x: panOrigin.current.x + (e.clientX - panStart.current.x),
      y: panOrigin.current.y + (e.clientY - panStart.current.y),
    })
  }, [isPanning])

  const handleMouseUp = useCallback(() => setIsPanning(false), [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const handler = (e: WheelEvent) => {
      e.preventDefault()
      setPan(p => ({ x: p.x - e.deltaX, y: p.y - e.deltaY }))
    }
    el.addEventListener('wheel', handler, { passive: false })
    return () => el.removeEventListener('wheel', handler)
  }, [])

  // Perspective rendering — view from front of booth looking in
  const viewW = 900
  const viewH = 500
  const fov = 1.2
  const eyeZ = -80 // viewer position in front of booth

  function project(x: number, y: number, z: number): { x: number; y: number; scale: number } {
    const relY = y - eyeZ
    const depth = Math.max(relY, 10)
    const scale = (fov * 300) / depth
    return {
      x: viewW / 2 + (x - bw / 2) * scale,
      y: viewH * 0.85 - z * scale,
      scale,
    }
  }

  // Floor corners
  const fl = project(0, 0, 0)
  const fr = project(bw, 0, 0)
  const bl = project(0, bd, 0)
  const br = project(bw, bd, 0)

  // Ceiling corners
  const ctl = project(0, bd, ch)
  const ctr = project(bw, bd, ch)

  // Wall polygons
  const hasBack = config.walls.find(w => w.side === 'bottom')?.hasWall
  const hasLeft = config.walls.find(w => w.side === 'left')?.hasWall
  const hasRight = config.walls.find(w => w.side === 'right')?.hasWall

  // Sort elements by y (far to near) for painter's algorithm
  const sortedElements = [...elements].sort((a, b) => (b.y + b.depth) - (a.y + a.depth))

  return (
    <div
      ref={containerRef}
      className={`flex-1 min-w-0 h-full overflow-hidden bg-gradient-to-b from-[#E8E6DE] to-[#F0EDE4] flex items-center justify-center relative select-none ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
      onClick={() => { if (!isPanning) onSelect(null) }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ transform: `translate(${pan.x}px, ${pan.y}px)` }}
      >
      <svg width={viewW} height={viewH} viewBox={`0 0 ${viewW} ${viewH}`}>
        {/* Sky gradient */}
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#DAD8D0" />
            <stop offset="100%" stopColor="#ECEAE2" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width={viewW} height={viewH} fill="url(#skyGrad)" />

        {/* Floor */}
        <polygon
          points={`${fl.x},${fl.y} ${fr.x},${fr.y} ${br.x},${br.y} ${bl.x},${bl.y}`}
          fill="#E8E2D4"
          stroke="#D4D0C8"
          strokeWidth={0.5}
        />

        {/* Floor grid */}
        {Array.from({ length: Math.floor(bd / 12) + 1 }, (_, i) => {
          const l = project(0, i * 12, 0)
          const r = project(bw, i * 12, 0)
          return <line key={`gy${i}`} x1={l.x} y1={l.y} x2={r.x} y2={r.y} stroke="#D0CCC4" strokeWidth={0.3} />
        })}
        {Array.from({ length: Math.floor(bw / 12) + 1 }, (_, i) => {
          const f = project(i * 12, 0, 0)
          const b = project(i * 12, bd, 0)
          return <line key={`gx${i}`} x1={f.x} y1={f.y} x2={b.x} y2={b.y} stroke="#D0CCC4" strokeWidth={0.3} />
        })}

        {/* Back wall */}
        {hasBack && (
          <polygon
            points={`${bl.x},${bl.y} ${br.x},${br.y} ${ctr.x},${ctr.y} ${ctl.x},${ctl.y}`}
            fill="#E0DDD5"
            stroke="#C8C6BE"
            strokeWidth={0.8}
          />
        )}

        {/* Left wall */}
        {hasLeft && (() => {
          const ftl = project(0, 0, 0)
          const fbl = project(0, bd, 0)
          const cfl = project(0, 0, ch)
          const cbl = project(0, bd, ch)
          return (
            <polygon
              points={`${ftl.x},${ftl.y} ${fbl.x},${fbl.y} ${cbl.x},${cbl.y} ${cfl.x},${cfl.y}`}
              fill="#D8D5CD"
              stroke="#C8C6BE"
              strokeWidth={0.8}
            />
          )
        })()}

        {/* Right wall */}
        {hasRight && (() => {
          const ftr = project(bw, 0, 0)
          const fbr = project(bw, bd, 0)
          const cfr = project(bw, 0, ch)
          const cbr = project(bw, bd, ch)
          return (
            <polygon
              points={`${ftr.x},${ftr.y} ${fbr.x},${fbr.y} ${cbr.x},${cbr.y} ${cfr.x},${cfr.y}`}
              fill="#CECBC3"
              stroke="#C8C6BE"
              strokeWidth={0.8}
            />
          )
        })()}

        {/* Elements */}
        {sortedElements.map(el => {
          const isSelected = el.id === selectedId
          const p1 = project(el.x, el.y, 0)
          const p2 = project(el.x + el.width, el.y, 0)
          const p3 = project(el.x + el.width, el.y + el.depth, 0)
          const p4 = project(el.x, el.y + el.depth, 0)

          const t1 = project(el.x, el.y, el.height)
          const t2 = project(el.x + el.width, el.y, el.height)
          const t3 = project(el.x + el.width, el.y + el.depth, el.height)
          const t4 = project(el.x, el.y + el.depth, el.height)

          return (
            <g key={el.id} onClick={(e) => { e.stopPropagation(); onSelect(el.id) }} style={{ cursor: 'pointer' }}>
              {/* Back face */}
              <polygon
                points={`${p3.x},${p3.y} ${p4.x},${p4.y} ${t4.x},${t4.y} ${t3.x},${t3.y}`}
                fill={el.color} opacity={0.6}
                stroke={isSelected ? '#8E7DBE' : '#AAA'} strokeWidth={isSelected ? 1.5 : 0.3}
              />
              {/* Right face */}
              <polygon
                points={`${p2.x},${p2.y} ${p3.x},${p3.y} ${t3.x},${t3.y} ${t2.x},${t2.y}`}
                fill={el.color} opacity={0.75}
                stroke={isSelected ? '#8E7DBE' : '#AAA'} strokeWidth={isSelected ? 1.5 : 0.3}
              />
              {/* Front face */}
              <polygon
                points={`${p1.x},${p1.y} ${p2.x},${p2.y} ${t2.x},${t2.y} ${t1.x},${t1.y}`}
                fill={el.color} opacity={0.9}
                stroke={isSelected ? '#8E7DBE' : '#AAA'} strokeWidth={isSelected ? 1.5 : 0.3}
              />
              {/* Top face */}
              <polygon
                points={`${t1.x},${t1.y} ${t2.x},${t2.y} ${t3.x},${t3.y} ${t4.x},${t4.y}`}
                fill={el.color}
                stroke={isSelected ? '#8E7DBE' : '#AAA'} strokeWidth={isSelected ? 1.5 : 0.3}
              />
              {/* Label */}
              {el.width > 20 && (
                <text
                  x={(t1.x + t3.x) / 2}
                  y={(t1.y + t3.y) / 2 + 3}
                  textAnchor="middle" fill="#333" fontSize={Math.min(10, el.width * p1.scale / 20)}
                  fontFamily="Inter, sans-serif" pointerEvents="none"
                >
                  {el.label}
                </text>
              )}
            </g>
          )
        })}

        {/* View info */}
        <text x={viewW / 2} y={30} textAnchor="middle" fill="#B0AEA6" fontSize={11} fontFamily="Inter, sans-serif" letterSpacing={1}>
          ATTENDEE VIEW
        </text>
      </svg>
      </div>

      {/* View label */}
      <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-md px-3 py-1.5 border border-rule/10 shadow-sm z-10">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8E7DBE" strokeWidth="2">
          <circle cx="12" cy="5" r="2" />
          <path d="M10 22V17L7 12l3-4h4l3 4-3 5v5" />
        </svg>
        <span className="text-xs text-ink-muted font-medium">Walk-through</span>
      </div>
    </div>
  )
}
