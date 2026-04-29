import type { EventInputs } from '../types'

export interface SavedEvent {
  id: string
  inputs: EventInputs
  createdAt: number
  updatedAt: number
}

const STORAGE_KEY = 'event-roi-saved-events'

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function loadAllEvents(): SavedEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as SavedEvent[]
  } catch {
    return []
  }
}

function persist(events: SavedEvent[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
}

export function saveEvent(inputs: EventInputs, existingId?: string): SavedEvent {
  const events = loadAllEvents()
  const now = Date.now()

  if (existingId) {
    const idx = events.findIndex((e) => e.id === existingId)
    if (idx !== -1) {
      events[idx] = { ...events[idx], inputs, updatedAt: now }
      persist(events)
      return events[idx]
    }
  }

  const saved: SavedEvent = { id: generateId(), inputs, createdAt: now, updatedAt: now }
  events.unshift(saved)
  persist(events)
  return saved
}

export function deleteEvent(id: string) {
  const events = loadAllEvents().filter((e) => e.id !== id)
  persist(events)
}
