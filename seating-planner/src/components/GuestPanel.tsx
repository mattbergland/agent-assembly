import { useState } from 'react'
import type { Guest } from '../types'
import { GuestCard } from './GuestCard'
import { AddGuestForm } from './AddGuestForm'
import { CsvImport } from './CsvImport'

interface GuestPanelProps {
  guests: Guest[]
  unseatedGuests: Guest[]
  onAdd: (guest: Omit<Guest, 'id'>) => void
  onAddMany: (guests: Omit<Guest, 'id'>[]) => void
  onUpdate: (id: string, data: Partial<Guest>) => void
  onRemove: (id: string) => void
}

export function GuestPanel({ guests, unseatedGuests, onAdd, onAddMany, onUpdate, onRemove }: GuestPanelProps) {
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null)
  const [search, setSearch] = useState('')

  const seatedIds = new Set(guests.filter(g => !unseatedGuests.includes(g)).map(g => g.id))

  const filtered = guests.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.title.toLowerCase().includes(search.toLowerCase()) ||
    g.company.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="w-80 flex-shrink-0 flex flex-col h-full border-r border-rule/10 bg-paper overflow-hidden">
      <div className="p-4 space-y-4 border-b border-rule/10">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium tracking-tight text-ink">Guests</h2>
          <span className="text-xs text-ink-muted">{unseatedGuests.length} unseated</span>
        </div>

        {editingGuest ? (
          <AddGuestForm
            onAdd={onAdd}
            editGuest={editingGuest}
            onUpdate={onUpdate}
            onCancel={() => setEditingGuest(null)}
          />
        ) : (
          <AddGuestForm onAdd={onAdd} />
        )}

        <CsvImport onImport={onAddMany} />
      </div>

      <div className="px-4 py-3 border-b border-rule/10">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search guests..."
          className="w-full px-3 py-1.5 text-sm bg-white border border-rule/10 rounded-lg focus:outline-none focus:border-lavender/50 focus:ring-1 focus:ring-lavender/20 placeholder:text-ink-muted/50"
        />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {filtered.length === 0 && guests.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-ink-muted">No guests yet</p>
            <p className="text-xs text-ink-muted/60 mt-1">Add guests above or import a CSV</p>
          </div>
        )}
        {filtered.length === 0 && guests.length > 0 && (
          <p className="text-sm text-ink-muted text-center py-4">No matches</p>
        )}
        {filtered.map(guest => (
          <GuestCard
            key={guest.id}
            guest={guest}
            onRemove={onRemove}
            onEdit={setEditingGuest}
            isSeated={seatedIds.has(guest.id)}
          />
        ))}
      </div>
    </div>
  )
}
