import { useState, useCallback, useRef, useEffect } from 'react'
import { useDrop } from 'react-dnd'
import type { Guest, Table, DragItem, TableShape } from '../types'
import { TableView } from './TableView'
import { AddTableDialog } from './AddTableDialog'

interface FloorPlanProps {
  tables: Table[]
  guests: Guest[]
  onAssign: (tableId: string, seatIndex: number, guestId: string) => void
  onUnassign: (tableId: string, seatIndex: number) => void
  onAddTable: (name: string, seats: number, shape: TableShape) => void
  onRemoveTable: (id: string) => void
  onUpdateTable: (id: string, data: Partial<Pick<Table, 'name' | 'shape'>>) => void
  onResizeTable: (id: string, count: number) => void
}

const MIN_ZOOM = 0.25
const MAX_ZOOM = 2
const ZOOM_STEP = 0.1

export function FloorPlan({ tables, guests, onAssign, onUnassign, onAddTable, onRemoveTable, onUpdateTable, onResizeTable }: FloorPlanProps) {
  const [showAddTable, setShowAddTable] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const panStart = useRef({ x: 0, y: 0 })
  const panOrigin = useRef({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement | null>(null)
  const touchCount = useRef(0)
  const lastTouchDist = useRef(0)

  const [, floorDrop] = useDrop<DragItem>(() => ({
    accept: 'GUEST',
  }), [])

  const setFloorRef = useCallback((el: HTMLDivElement | null) => {
    floorDrop(el)
    containerRef.current = el
  }, [floorDrop])

  const handleWheel = useCallback((e: WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
      const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP
      setZoom(z => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z + delta)))
    }
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel)
  }, [handleWheel])

  // Mouse pan (Alt+drag or middle-click)
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

  const handleMouseUp = useCallback(() => {
    setIsPanning(false)
  }, [])

  // Touch pan (two-finger drag) and pinch-to-zoom
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchCount.current = e.touches.length
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
    touchCount.current = 0
    lastTouchDist.current = 0
    setIsPanning(false)
  }, [])

  const handleZoomIn = () => setZoom(z => Math.min(MAX_ZOOM, z + ZOOM_STEP))
  const handleZoomOut = () => setZoom(z => Math.max(MIN_ZOOM, z - ZOOM_STEP))
  const handleResetView = () => { setZoom(1); setPan({ x: 0, y: 0 }) }

  const zoomPercent = Math.round(zoom * 100)

  return (
    <div
      ref={setFloorRef}
      className={`flex-1 min-w-0 h-full overflow-hidden bg-paper/50 relative ${isPanning ? 'cursor-grabbing' : ''}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {tables.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center px-6 sm:px-8">
          <div className="w-20 h-20 rounded-full bg-lavender/10 flex items-center justify-center mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8E7DBE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M8 12h8" />
              <path d="M12 8v8" />
            </svg>
          </div>
          <h3 className="text-lg font-medium tracking-tight text-ink mb-1">No tables yet</h3>
          <p className="text-sm text-ink-muted mb-6 max-w-xs leading-relaxed">
            Add a table to start arranging your seating. You can drag guests from the sidebar onto any seat.
          </p>
          <button
            onClick={() => setShowAddTable(true)}
            className="px-5 py-2.5 text-sm font-medium text-white bg-lavender rounded-lg hover:bg-lavender/90 transition-colors"
          >
            Add First Table
          </button>
        </div>
      ) : (
        <>
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 pointer-events-none">
            <h2 className="text-sm font-medium tracking-tight text-ink pointer-events-auto">Floor Plan</h2>
            <button
              onClick={() => setShowAddTable(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-lavender border border-lavender/30 rounded-lg hover:bg-lavender/5 transition-colors pointer-events-auto bg-paper/80 backdrop-blur-sm"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 5v14" /><path d="M5 12h14" />
              </svg>
              Add Table
            </button>
          </div>

          <div
            className="w-full h-full origin-center transition-transform duration-100 ease-out pt-14"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            }}
          >
            <div className="flex flex-wrap gap-6 sm:gap-12 items-start justify-center p-4 sm:p-8">
              {tables.map(table => (
                <TableView
                  key={table.id}
                  table={table}
                  guests={guests}
                  onAssign={onAssign}
                  onUnassign={onUnassign}
                  onRemoveTable={onRemoveTable}
                  onUpdateTable={onUpdateTable}
                  onResizeTable={onResizeTable}
                />
              ))}
            </div>
          </div>

          <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1 bg-paper/90 backdrop-blur-sm border border-rule/10 rounded-lg p-1 shadow-sm">
            <button
              onClick={handleZoomOut}
              className="w-7 h-7 flex items-center justify-center text-ink-muted hover:text-ink rounded transition-colors text-sm"
              title="Zoom out"
            >
              −
            </button>
            <button
              onClick={handleResetView}
              className="px-2 h-7 flex items-center justify-center text-[11px] text-ink-muted hover:text-ink rounded transition-colors min-w-[42px] font-mono"
              title="Reset view"
            >
              {zoomPercent}%
            </button>
            <button
              onClick={handleZoomIn}
              className="w-7 h-7 flex items-center justify-center text-ink-muted hover:text-ink rounded transition-colors text-sm"
              title="Zoom in"
            >
              +
            </button>
          </div>

          {zoom !== 1 || pan.x !== 0 || pan.y !== 0 ? (
            <div className="absolute bottom-4 left-4 z-10">
              <p className="hidden sm:block text-[10px] text-ink-muted/60 bg-paper/80 backdrop-blur-sm rounded px-2 py-1">
                Ctrl+scroll to zoom · Alt+drag to pan
              </p>
              <p className="sm:hidden text-[10px] text-ink-muted/60 bg-paper/80 backdrop-blur-sm rounded px-2 py-1">
                Pinch to zoom · Two-finger drag to pan
              </p>
            </div>
          ) : null}
        </>
      )}

      {showAddTable && (
        <AddTableDialog
          tableCount={tables.length}
          onAdd={onAddTable}
          onClose={() => setShowAddTable(false)}
        />
      )}
    </div>
  )
}
