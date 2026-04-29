import { useCallback } from 'react'
import { useDrop, useDrag } from 'react-dnd'
import type { Guest, DragItem } from '../types'

interface SeatSlotProps {
  guest: Guest | null
  tableId: string
  seatIndex: number
  x: number
  y: number
  onDrop: (tableId: string, seatIndex: number, guestId: string) => void
  onRemove: (tableId: string, seatIndex: number) => void
}

export function SeatSlot({ guest, tableId, seatIndex, x, y, onDrop, onRemove }: SeatSlotProps) {
  const [{ isOver, canDrop }, drop] = useDrop<DragItem, void, { isOver: boolean; canDrop: boolean }>(() => ({
    accept: 'GUEST',
    drop: (item) => {
      onDrop(tableId, seatIndex, item.guestId)
    },
    canDrop: () => true,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }), [tableId, seatIndex, onDrop])

  const [{ isDragging }, drag] = useDrag<DragItem, void, { isDragging: boolean }>(() => ({
    type: 'GUEST',
    item: { type: 'GUEST', guestId: guest?.id ?? '', sourceTableId: tableId, sourceSeatIndex: seatIndex },
    canDrag: () => !!guest,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [guest, tableId, seatIndex])

  const setRef = useCallback((el: HTMLDivElement | null) => {
    drag(el)
    drop(el)
  }, [drag, drop])

  return (
    <div
      ref={setRef}
      className={`absolute w-14 h-14 rounded-full flex items-center justify-center transition-all ${
        guest
          ? `bg-white border-2 border-lavender/40 shadow-sm cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-30' : 'hover:border-lavender hover:shadow-md'}`
          : `border-2 border-dashed ${isOver && canDrop ? 'border-lavender bg-lavender/15 scale-110' : 'border-rule/15 hover:border-lavender/30'}`
      }`}
      style={{ left: x, top: y }}
      title={guest ? `${guest.name}${guest.title ? ` — ${guest.title}` : ''}` : `Seat ${seatIndex + 1}`}
    >
      {guest ? (
        <div className="relative w-full h-full flex items-center justify-center group">
          {guest.photoUrl ? (
            <img src={guest.photoUrl} alt={guest.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            <span className="text-xs font-semibold text-lavender">
              {guest.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </span>
          )}
          <button
            onClick={() => onRemove(tableId, seatIndex)}
            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px] leading-none"
          >
            ×
          </button>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 translate-y-full whitespace-nowrap text-center pointer-events-none">
            <p className="text-[10px] text-ink font-medium leading-tight">{guest.name}</p>
            {guest.title && (
              <p className="text-[9px] text-ink-muted leading-tight">{guest.title}</p>
            )}
            {guest.company && (
              <p className="text-[9px] text-ink-muted leading-tight">{guest.company}</p>
            )}
          </div>
        </div>
      ) : (
        <span className="text-[10px] text-ink-muted/40">{seatIndex + 1}</span>
      )}
    </div>
  )
}
