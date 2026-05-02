import { useState } from 'react'
import type { Guest, Table, TableShape } from '../types'
import { SeatSlot } from './SeatSlot'

interface TableViewProps {
  table: Table
  guests: Guest[]
  onAssign: (tableId: string, seatIndex: number, guestId: string) => void
  onUnassign: (tableId: string, seatIndex: number) => void
  onRemoveTable: (id: string) => void
  onUpdateTable: (id: string, data: Partial<Pick<Table, 'name' | 'shape'>>) => void
  onResizeTable: (id: string, count: number) => void
}

const SEAT_SIZE = 56
const SEAT_GAP = 72
const SEAT_HALF = SEAT_SIZE / 2
const LABEL_SPACE = 30

interface SeatPos { x: number; y: number }

function computeSeatPositions(shape: TableShape, count: number): { seats: SeatPos[]; tableWidth: number; tableHeight: number; containerWidth: number; containerHeight: number; tableOffsetX: number; tableOffsetY: number; borderRadius: string } {
  const pad = SEAT_SIZE + LABEL_SPACE

  if (shape === 'round') {
    const tableRadius = Math.max(50, count * 12 + 30)
    const seatRadius = tableRadius + 54
    const containerSize = (seatRadius + 40) * 2
    const cx = containerSize / 2
    const cy = containerSize / 2
    const seats = Array.from({ length: count }, (_, i) => {
      const angle = (2 * Math.PI * i) / count - Math.PI / 2
      return { x: cx + seatRadius * Math.cos(angle) - SEAT_HALF, y: cy + seatRadius * Math.sin(angle) - SEAT_HALF }
    })
    return { seats, tableWidth: tableRadius * 2, tableHeight: tableRadius * 2, containerWidth: containerSize, containerHeight: containerSize, tableOffsetX: cx - tableRadius, tableOffsetY: cy - tableRadius, borderRadius: '9999px' }
  }

  if (shape === 'rectangular') {
    const topCount = Math.ceil(count / 2)
    const bottomCount = count - topCount
    const tw = Math.max(200, topCount * SEAT_GAP + 40)
    const th = 140
    const cw = tw + pad * 2
    const ch = th + pad * 2
    const ox = (cw - tw) / 2
    const oy = (ch - th) / 2
    const seats: SeatPos[] = []
    for (let i = 0; i < topCount; i++) {
      const spacing = tw / (topCount + 1)
      seats.push({ x: ox + spacing * (i + 1) - SEAT_HALF, y: oy - pad + LABEL_SPACE })
    }
    for (let i = 0; i < bottomCount; i++) {
      const spacing = tw / (bottomCount + 1)
      seats.push({ x: ox + spacing * (i + 1) - SEAT_HALF, y: oy + th + LABEL_SPACE })
    }
    return { seats, tableWidth: tw, tableHeight: th, containerWidth: cw, containerHeight: ch, tableOffsetX: ox, tableOffsetY: oy, borderRadius: '8px' }
  }

  if (shape === 'u-shape') {
    const sideCount = Math.max(1, Math.floor((count - Math.ceil(count / 3)) / 2))
    const bottomCount = count - sideCount * 2
    const rows = Math.max(sideCount, 2)
    const tw = Math.max(200, (bottomCount + 1) * SEAT_GAP)
    const th = Math.max(140, rows * SEAT_GAP + 20)
    const cw = tw + pad * 2
    const ch = th + pad + SEAT_HALF + LABEL_SPACE
    const ox = (cw - tw) / 2
    const oy = SEAT_HALF
    const seats: SeatPos[] = []
    // left side (top to bottom)
    for (let i = 0; i < sideCount; i++) {
      const spacing = th / (sideCount + 1)
      seats.push({ x: ox - pad + LABEL_SPACE, y: oy + spacing * (i + 1) - SEAT_HALF })
    }
    // bottom row (left to right)
    for (let i = 0; i < bottomCount; i++) {
      const spacing = tw / (bottomCount + 1)
      seats.push({ x: ox + spacing * (i + 1) - SEAT_HALF, y: oy + th + LABEL_SPACE })
    }
    // right side (bottom to top)
    for (let i = 0; i < sideCount; i++) {
      const spacing = th / (sideCount + 1)
      seats.push({ x: ox + tw + LABEL_SPACE, y: oy + th - spacing * (i + 1) + SEAT_HALF - SEAT_SIZE })
    }
    return { seats, tableWidth: tw, tableHeight: th, containerWidth: cw, containerHeight: ch, tableOffsetX: ox, tableOffsetY: oy, borderRadius: '8px' }
  }

  if (shape === 'classroom') {
    const cols = Math.min(count, Math.max(3, Math.ceil(Math.sqrt(count * 2))))
    const rows = Math.ceil(count / cols)
    const tw = Math.max(200, cols * SEAT_GAP + 40)
    const th = Math.max(60, 40)
    const cw = tw + 40
    const ch = th + pad + rows * (SEAT_SIZE + LABEL_SPACE + 10) + 20
    const ox = (cw - tw) / 2
    const oy = 20
    const seats: SeatPos[] = []
    for (let i = 0; i < count; i++) {
      const row = Math.floor(i / cols)
      const col = i % cols
      const rowSize = row === rows - 1 ? count - row * cols : cols
      const spacing = tw / (rowSize + 1)
      const colIndex = row === rows - 1 ? i - row * cols : col
      seats.push({ x: ox + spacing * (colIndex + 1) - SEAT_HALF, y: oy + th + LABEL_SPACE + row * (SEAT_SIZE + LABEL_SPACE + 10) })
    }
    return { seats, tableWidth: tw, tableHeight: th, containerWidth: cw, containerHeight: ch, tableOffsetX: ox, tableOffsetY: oy, borderRadius: '8px' }
  }

  if (shape === 'boardroom') {
    const endSeats = count >= 6 ? 2 : 0
    const sideTotal = count - endSeats
    const leftCount = Math.ceil(sideTotal / 2)
    const rightCount = sideTotal - leftCount
    const sideRows = Math.max(leftCount, rightCount, 2)
    const tw = Math.max(160, 200)
    const th = Math.max(140, sideRows * SEAT_GAP + 20)
    const cw = tw + pad * 2
    const ch = th + (endSeats > 0 ? pad * 2 : pad)
    const ox = (cw - tw) / 2
    const oy = endSeats > 0 ? pad : SEAT_HALF
    const seats: SeatPos[] = []
    // left side
    for (let i = 0; i < leftCount; i++) {
      const spacing = th / (leftCount + 1)
      seats.push({ x: ox - pad + LABEL_SPACE, y: oy + spacing * (i + 1) - SEAT_HALF })
    }
    // right side
    for (let i = 0; i < rightCount; i++) {
      const spacing = th / (rightCount + 1)
      seats.push({ x: ox + tw + LABEL_SPACE, y: oy + spacing * (i + 1) - SEAT_HALF })
    }
    // end seats (head and foot)
    if (endSeats >= 1) seats.push({ x: ox + tw / 2 - SEAT_HALF, y: oy - pad + LABEL_SPACE })
    if (endSeats >= 2) seats.push({ x: ox + tw / 2 - SEAT_HALF, y: oy + th + LABEL_SPACE })
    return { seats, tableWidth: tw, tableHeight: th, containerWidth: cw, containerHeight: ch, tableOffsetX: ox, tableOffsetY: oy, borderRadius: '8px' }
  }

  if (shape === 'banquet') {
    const topCount = Math.ceil(count / 2)
    const bottomCount = count - topCount
    const tw = Math.max(240, Math.max(topCount, bottomCount) * SEAT_GAP + 40)
    const th = 60
    const cw = tw + 40
    const ch = th + pad * 2
    const ox = (cw - tw) / 2
    const oy = (ch - th) / 2
    const seats: SeatPos[] = []
    for (let i = 0; i < topCount; i++) {
      const spacing = tw / (topCount + 1)
      seats.push({ x: ox + spacing * (i + 1) - SEAT_HALF, y: oy - pad + LABEL_SPACE })
    }
    for (let i = 0; i < bottomCount; i++) {
      const spacing = tw / (bottomCount + 1)
      seats.push({ x: ox + spacing * (i + 1) - SEAT_HALF, y: oy + th + LABEL_SPACE })
    }
    return { seats, tableWidth: tw, tableHeight: th, containerWidth: cw, containerHeight: ch, tableOffsetX: ox, tableOffsetY: oy, borderRadius: '4px' }
  }

  if (shape === 'hollow-square') {
    const perSide = Math.max(1, Math.floor(count / 4))
    const remainder = count - perSide * 4
    const top = perSide + (remainder > 0 ? 1 : 0)
    const right = perSide + (remainder > 1 ? 1 : 0)
    const bottom = perSide + (remainder > 2 ? 1 : 0)
    const left = perSide
    const maxSide = Math.max(top, bottom, left, right, 2)
    const side = Math.max(200, maxSide * SEAT_GAP + 20)
    const cw = side + pad * 2
    const ch = side + pad * 2
    const ox = (cw - side) / 2
    const oy = (ch - side) / 2
    const seats: SeatPos[] = []
    // top (left to right)
    for (let i = 0; i < top; i++) {
      const spacing = side / (top + 1)
      seats.push({ x: ox + spacing * (i + 1) - SEAT_HALF, y: oy - pad + LABEL_SPACE })
    }
    // right (top to bottom)
    for (let i = 0; i < right; i++) {
      const spacing = side / (right + 1)
      seats.push({ x: ox + side + LABEL_SPACE, y: oy + spacing * (i + 1) - SEAT_HALF })
    }
    // bottom (right to left)
    for (let i = 0; i < bottom; i++) {
      const spacing = side / (bottom + 1)
      seats.push({ x: ox + side - spacing * (i + 1) - SEAT_HALF, y: oy + side + LABEL_SPACE })
    }
    // left (bottom to top)
    for (let i = 0; i < left; i++) {
      const spacing = side / (left + 1)
      seats.push({ x: ox - pad + LABEL_SPACE, y: oy + side - spacing * (i + 1) - SEAT_HALF })
    }
    return { seats, tableWidth: side, tableHeight: side, containerWidth: cw, containerHeight: ch, tableOffsetX: ox, tableOffsetY: oy, borderRadius: '8px' }
  }

  // fallback to round
  return computeSeatPositions('round', count)
}

const SHAPE_ORDER: TableShape[] = ['round', 'rectangular', 'u-shape', 'classroom', 'boardroom', 'banquet', 'hollow-square']

const SHAPE_LABELS: Record<TableShape, string> = {
  'round': '○',
  'rectangular': '▭',
  'u-shape': '⊔',
  'classroom': '⊏',
  'boardroom': '⊡',
  'banquet': '═',
  'hollow-square': '□',
}

export function TableView({ table, guests, onAssign, onUnassign, onRemoveTable, onUpdateTable, onResizeTable }: TableViewProps) {
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(table.name)

  const seatCount = table.seats.length
  const getGuest = (guestId: string | null) => guestId ? guests.find(g => g.id === guestId) ?? null : null

  const handleNameSubmit = () => {
    if (editName.trim()) {
      onUpdateTable(table.id, { name: editName.trim() })
    }
    setEditing(false)
  }

  const seated = table.seats.filter(s => s.guestId).length
  const layout = computeSeatPositions(table.shape, seatCount)

  const nextShape = () => {
    const idx = SHAPE_ORDER.indexOf(table.shape)
    const next = SHAPE_ORDER[(idx + 1) % SHAPE_ORDER.length]
    onUpdateTable(table.id, { shape: next })
  }

  return (
    <div className="inline-flex flex-col items-center gap-3">
      <div className="relative" style={{ width: layout.containerWidth, height: layout.containerHeight }}>
        {/* Table surface */}
        <div
          className="absolute bg-white border-2 border-rule/10 shadow-sm"
          style={{
            width: layout.tableWidth,
            height: layout.tableHeight,
            left: layout.tableOffsetX,
            top: layout.tableOffsetY,
            borderRadius: layout.borderRadius,
          }}
        />
        {/* Table label */}
        <div
          className="absolute flex flex-col items-center justify-center pointer-events-none"
          style={{
            width: layout.tableWidth,
            height: layout.tableHeight,
            left: layout.tableOffsetX,
            top: layout.tableOffsetY,
          }}
        >
          <div className="pointer-events-auto">
            {editing ? (
              <input
                autoFocus
                value={editName}
                onChange={e => setEditName(e.target.value)}
                onBlur={handleNameSubmit}
                onKeyDown={e => e.key === 'Enter' && handleNameSubmit()}
                className="w-24 text-center text-sm font-medium bg-transparent border-b border-lavender focus:outline-none"
              />
            ) : (
              <button
                onClick={() => { setEditName(table.name); setEditing(true) }}
                className="text-sm font-medium text-ink-soft hover:text-lavender transition-colors cursor-text"
                title="Click to rename"
              >
                {table.name}
              </button>
            )}
          </div>
          <span className="text-[10px] text-ink-muted mt-0.5">{seated}/{seatCount}</span>
        </div>

        {/* Seats */}
        {table.seats.map((seat, i) => {
          const pos = layout.seats[i]
          if (!pos) return null
          return (
            <SeatSlot
              key={seat.index}
              guest={getGuest(seat.guestId)}
              tableId={table.id}
              seatIndex={seat.index}
              x={pos.x}
              y={pos.y}
              onDrop={onAssign}
              onRemove={onUnassign}
            />
          )
        })}
      </div>

      <TableControls
        table={table}
        onRemove={onRemoveTable}
        onResize={onResizeTable}
        onToggleShape={nextShape}
      />
    </div>
  )
}

function TableControls({ table, onRemove, onResize, onToggleShape }: {
  table: Table
  onRemove: (id: string) => void
  onResize: (id: string, count: number) => void
  onToggleShape: () => void
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onResize(table.id, Math.max(2, table.seats.length - 1))}
        className="w-6 h-6 flex items-center justify-center text-ink-muted hover:text-ink border border-rule/10 rounded transition-colors text-xs"
        title="Remove seat"
      >
        −
      </button>
      <span className="text-xs text-ink-muted w-14 text-center">{table.seats.length} seats</span>
      <button
        onClick={() => onResize(table.id, Math.min(24, table.seats.length + 1))}
        className="w-6 h-6 flex items-center justify-center text-ink-muted hover:text-ink border border-rule/10 rounded transition-colors text-xs"
        title="Add seat"
      >
        +
      </button>
      <button
        onClick={onToggleShape}
        className="ml-2 px-2 py-1 text-[10px] text-ink-muted hover:text-ink border border-rule/10 rounded transition-colors"
        title="Cycle layout style"
      >
        {SHAPE_LABELS[table.shape]}
      </button>
      <button
        onClick={() => onRemove(table.id)}
        className="ml-1 px-2 py-1 text-[10px] text-red-400 hover:text-red-600 border border-rule/10 rounded transition-colors"
        title="Remove table"
      >
        Remove
      </button>
    </div>
  )
}
