import { useCallback } from 'react'
import { useDrag } from 'react-dnd'
import type { Guest, DragItem } from '../types'

interface GuestCardProps {
  guest: Guest
  onRemove: (id: string) => void
  onEdit: (guest: Guest) => void
  isSeated?: boolean
}

export function GuestCard({ guest, onRemove, onEdit, isSeated }: GuestCardProps) {
  const [{ isDragging }, drag] = useDrag<DragItem, void, { isDragging: boolean }>(() => ({
    type: 'GUEST',
    item: { type: 'GUEST', guestId: guest.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [guest.id])

  const setRef = useCallback((el: HTMLDivElement | null) => { drag(el) }, [drag])

  return (
    <div
      ref={setRef}
      className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg border border-rule/8 bg-white cursor-grab active:cursor-grabbing transition-all ${
        isDragging ? 'opacity-40 scale-95' : 'hover:border-lavender/30 hover:shadow-sm'
      } ${isSeated ? 'opacity-60' : ''}`}
    >
      {guest.photoUrl ? (
        <img
          src={guest.photoUrl}
          alt={guest.name}
          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-lavender/15 flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-medium text-lavender">
            {guest.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </span>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-ink truncate">{guest.name}</p>
        {(guest.title || guest.company) && (
          <p className="text-xs text-ink-muted truncate">
            {[guest.title, guest.company].filter(Boolean).join(' · ')}
          </p>
        )}
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(guest) }}
          className="p-1 text-ink-muted hover:text-ink transition-colors"
          title="Edit"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
          </svg>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(guest.id) }}
          className="p-1 text-ink-muted hover:text-red-500 transition-colors"
          title="Remove"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" /><path d="m6 6 12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
