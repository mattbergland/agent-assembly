import { useState, useCallback, useRef, useEffect } from 'react'
import type { BoothConfig, PlacedElement } from '../types'
import { GRID_SIZE, ELEMENT_CATALOG } from '../constants'
import { CanvasElement } from './CanvasElement'

interface BoothCanvasProps {
  config: BoothConfig
  elements: PlacedElement[]
  selectedId: string | null
  onSelect: (id: string | null) => void
  onAddElement: (type: string, x: number, y: number) => string | null
  onMoveElement: (id: string, x: number, y: number) => void
  onMoveElementDone: () => void
  onRotateElement: (id: string) => void
  onRemoveElement: (id: string) => void
}

const MIN_ZOOM = 0.2
const MAX_ZOOM = 3
const ZOOM_STEP = 0.15

function formatDimension(inches: number): string {
  const feet = Math.floor(inches / 12)
  const remaining = inches % 12
  if (remaining === 0) return `${feet}'`
  return `${feet}' ${remaining}"`
}

export function BoothCanvas({
  config,
  elements,
  selectedId,
  onSelect,
  onAddElement,
  onMoveElement,
  onMoveElementDone,
  onRotateElement,
  onRemoveElement,
}: BoothCanvasProps) {
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const panStart = useRef({ x: 0, y: 0 })
  const panOrigin = useRef({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const lastTouchDist = useRef(0)

  const pxPerInch = 4 * zoom
  const boothW = config.width * 4
  const boothH = config.depth * 4

  // Auto-fit on mount or config change
  useEffect(() => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const padding = 120
    const scaleX = (rect.width - padding) / boothW
    const scaleY = (rect.height - padding) / boothH
    const fit = Math.min(scaleX, scaleY, 1.5)
    setZoom(fit)
    setPan({ x: 0, y: 0 })
  }, [config.width, config.depth, boothW, boothH])

  // Wheel zoom
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const handler = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP
        setZoom(z => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z + delta)))
      }
    }
    el.addEventListener('wheel', handler, { passive: false })
    return () => el.removeEventListener('wheel', handler)
  }, [])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      e.preventDefault()
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

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault()
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      lastTouchDist.current = Math.sqrt(dx * dx + dy * dy)
      const mx = (e.touches[0].clientX + e.touches[1].clientX) / 2
      const my = (e.touches[0].clientY + e.touches[1].clientY) / 2
      panStart.current = { x: mx, y: my }
      panOrigin.current = { ...pan }
      setIsPanning(true)
    }
  }, [pan])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault()
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (lastTouchDist.current > 0) {
        const scale = dist / lastTouchDist.current
        setZoom(z => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z * scale)))
      }
      lastTouchDist.current = dist
      const mx = (e.touches[0].clientX + e.touches[1].clientX) / 2
      const my = (e.touches[0].clientY + e.touches[1].clientY) / 2
      setPan({
        x: panOrigin.current.x + (mx - panStart.current.x),
        y: panOrigin.current.y + (my - panStart.current.y),
      })
    }
  }, [])

  const handleTouchEnd = useCallback(() => {
    lastTouchDist.current = 0
    setIsPanning(false)
  }, [])

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).dataset.canvas === 'bg') {
      onSelect(null)
    }
  }, [onSelect])

  // Drop handler for catalog items
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const type = e.dataTransfer.getData('element-type')
    if (!type) return
    const def = ELEMENT_CATALOG.find(el => el.type === type)
    if (!def || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const cx = (e.clientX - rect.left - rect.width / 2 - pan.x) / pxPerInch
    const cy = (e.clientY - rect.top - rect.height / 2 - pan.y) / pxPerInch
    const x = Math.round((cx - def.width / 2) / GRID_SIZE) * GRID_SIZE
    const y = Math.round((cy - def.depth / 2) / GRID_SIZE) * GRID_SIZE
    onAddElement(type, x, y)
  }, [pan, pxPerInch, onAddElement])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }, [])

  const zoomIn = () => setZoom(z => Math.min(MAX_ZOOM, z + ZOOM_STEP))
  const zoomOut = () => setZoom(z => Math.max(MIN_ZOOM, z - ZOOM_STEP))
  const resetView = () => { setZoom(1); setPan({ x: 0, y: 0 }) }

  // Grid lines
  const gridLines: React.ReactNode[] = []
  for (let x = 0; x <= config.width; x += GRID_SIZE) {
    const isFoot = x % 12 === 0
    gridLines.push(
      <line
        key={`v${x}`}
        x1={x * 4} y1={0} x2={x * 4} y2={boothH}
        stroke={isFoot ? '#D4D4D0' : '#E8E8E4'}
        strokeWidth={isFoot ? 0.8 : 0.4}
      />
    )
  }
  for (let y = 0; y <= config.depth; y += GRID_SIZE) {
    const isFoot = y % 12 === 0
    gridLines.push(
      <line
        key={`h${y}`}
        x1={0} y1={y * 4} x2={boothW} y2={y * 4}
        stroke={isFoot ? '#D4D4D0' : '#E8E8E4'}
        strokeWidth={isFoot ? 0.8 : 0.4}
      />
    )
  }

  // Walls
  const wallThickness = 6
  const wallSegments: React.ReactNode[] = config.walls
    .filter(w => w.hasWall)
    .map(w => {
      let x = 0, y = 0, width = 0, height = 0
      switch (w.side) {
        case 'top': x = 0; y = -wallThickness; width = boothW; height = wallThickness; break
        case 'bottom': x = 0; y = boothH; width = boothW; height = wallThickness; break
        case 'left': x = -wallThickness; y = 0; width = wallThickness; height = boothH; break
        case 'right': x = boothW; y = 0; width = wallThickness; height = boothH; break
      }
      return (
        <rect
          key={w.id}
          x={x} y={y} width={width} height={height}
          fill="#3A3A38"
          rx={1}
        />
      )
    })

  // Openings (gaps in walls)
  const openingMarkers: React.ReactNode[] = config.openings.map(o => {
    const pos = o.position * 4
    const w = o.width * 4
    let x = 0, y = 0, rw = 0, rh = 0
    switch (o.wallSide) {
      case 'top': x = pos; y = -wallThickness - 2; rw = w; rh = wallThickness + 4; break
      case 'bottom': x = pos; y = boothH - 2; rw = w; rh = wallThickness + 4; break
      case 'left': x = -wallThickness - 2; y = pos; rw = wallThickness + 4; rh = w; break
      case 'right': x = boothW - 2; y = pos; rw = wallThickness + 4; rh = w; break
    }
    return (
      <g key={o.id}>
        <rect x={x} y={y} width={rw} height={rh} fill="#F5F5F3" />
        <line
          x1={x} y1={o.wallSide === 'left' || o.wallSide === 'right' ? y : y + rh / 2}
          x2={x + rw} y2={o.wallSide === 'left' || o.wallSide === 'right' ? y : y + rh / 2}
          stroke="#8E7DBE"
          strokeWidth={1.5}
          strokeDasharray="4 3"
        />
      </g>
    )
  })

  // Dimension labels
  const dimY = boothH + 28
  const dimX = boothW + 28

  return (
    <div
      ref={containerRef}
      className={`flex-1 min-w-0 h-full overflow-hidden bg-[#FAFAF8] relative select-none ${isPanning ? 'cursor-grabbing' : 'cursor-default'}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleCanvasClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ transform: `translate(${pan.x}px, ${pan.y}px)` }}
      >
        <svg
          width={boothW * zoom + 80}
          height={boothH * zoom + 80}
          viewBox={`${-40} ${-40} ${boothW + 80} ${boothH + 80}`}
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
          data-canvas="bg"
        >
          {/* Floor */}
          <rect
            x={0} y={0} width={boothW} height={boothH}
            fill="#F0EDE4"
            stroke="#CCCAC2"
            strokeWidth={1.5}
            rx={2}
            data-canvas="bg"
          />

          {/* Grid */}
          <g opacity={0.6}>{gridLines}</g>

          {/* Walls */}
          {wallSegments}

          {/* Openings */}
          {openingMarkers}

          {/* Dimension: width (bottom) */}
          <g>
            <line x1={0} y1={dimY - 6} x2={0} y2={dimY + 6} stroke="#8E7DBE" strokeWidth={0.8} />
            <line x1={boothW} y1={dimY - 6} x2={boothW} y2={dimY + 6} stroke="#8E7DBE" strokeWidth={0.8} />
            <line x1={0} y1={dimY} x2={boothW} y2={dimY} stroke="#8E7DBE" strokeWidth={0.8} />
            <text x={boothW / 2} y={dimY + 16} textAnchor="middle" fill="#8E7DBE" fontSize={11} fontFamily="Inter, sans-serif">
              {formatDimension(config.width)}
            </text>
          </g>

          {/* Dimension: depth (right) */}
          <g>
            <line x1={dimX - 6} y1={0} x2={dimX + 6} y2={0} stroke="#8E7DBE" strokeWidth={0.8} />
            <line x1={dimX - 6} y1={boothH} x2={dimX + 6} y2={boothH} stroke="#8E7DBE" strokeWidth={0.8} />
            <line x1={dimX} y1={0} x2={dimX} y2={boothH} stroke="#8E7DBE" strokeWidth={0.8} />
            <text x={dimX + 16} y={boothH / 2} textAnchor="middle" fill="#8E7DBE" fontSize={11} fontFamily="Inter, sans-serif"
              transform={`rotate(90, ${dimX + 16}, ${boothH / 2})`}
            >
              {formatDimension(config.depth)}
            </text>
          </g>

          {/* Area label */}
          <text x={boothW / 2} y={boothH / 2 - 8} textAnchor="middle" fill="#AAA8A0" fontSize={13} fontFamily="Inter, sans-serif">
            Booth Area
          </text>
          <text x={boothW / 2} y={boothH / 2 + 12} textAnchor="middle" fill="#AAA8A0" fontSize={12} fontFamily="Inter, sans-serif">
            {((config.width / 12) * (config.depth / 12)).toFixed(0)} ft²
          </text>

          {/* Placed elements */}
          {elements.map(el => (
            <CanvasElement
              key={el.id}
              element={el}
              isSelected={el.id === selectedId}
              scale={4}
              onSelect={() => onSelect(el.id)}
              onMove={(x, y) => onMoveElement(el.id, x, y)}
              onMoveDone={onMoveElementDone}
              onRotate={() => onRotateElement(el.id)}
              onRemove={() => onRemoveElement(el.id)}
              boothWidth={config.width}
              boothDepth={config.depth}
            />
          ))}

          {/* Entry arrow (front = top if no top wall) */}
          {!config.walls.find(w => w.side === 'top')?.hasWall && (
            <g>
              <text x={boothW / 2} y={-18} textAnchor="middle" fill="#8E7DBE" fontSize={10} fontFamily="Inter, sans-serif" letterSpacing={1}>
                AISLE / ENTRY
              </text>
              <path
                d={`M ${boothW / 2 - 20} -10 L ${boothW / 2} -4 L ${boothW / 2 + 20} -10`}
                fill="none" stroke="#8E7DBE" strokeWidth={1.2}
              />
            </g>
          )}
        </svg>
      </div>

      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-1 z-10">
        <button onClick={zoomIn} className="w-8 h-8 flex items-center justify-center rounded-md bg-white border border-rule/10 shadow-sm text-ink-muted hover:text-ink transition-colors text-lg">+</button>
        <button onClick={resetView} className="w-8 h-8 flex items-center justify-center rounded-md bg-white border border-rule/10 shadow-sm text-ink-muted hover:text-ink transition-colors text-[10px] font-mono">{Math.round(zoom * 100)}%</button>
        <button onClick={zoomOut} className="w-8 h-8 flex items-center justify-center rounded-md bg-white border border-rule/10 shadow-sm text-ink-muted hover:text-ink transition-colors text-lg">−</button>
      </div>

      {/* View label */}
      <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-md px-3 py-1.5 border border-rule/10 shadow-sm z-10">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8E7DBE" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>
        <span className="text-xs text-ink-muted font-medium">Floor View</span>
      </div>
    </div>
  )
}
