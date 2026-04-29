import { useState, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { Guest, Table, Seat, TableShape } from './types'

const STORAGE_KEY = 'seating-planner-state'

interface AppState {
  guests: Guest[]
  tables: Table[]
}

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return { guests: [], tables: [] }
}

function saveState(state: AppState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function createSeats(count: number): Seat[] {
  return Array.from({ length: count }, (_, i) => ({ index: i, guestId: null }))
}

export function useAppState() {
  const [state, setState] = useState<AppState>(loadState)

  const update = useCallback((fn: (prev: AppState) => AppState) => {
    setState(prev => {
      const next = fn(prev)
      try { saveState(next) } catch { /* ignore storage errors */ }
      return next
    })
  }, [])

  const addGuest = useCallback((guest: Omit<Guest, 'id'>) => {
    const id = uuidv4()
    update(s => ({ ...s, guests: [...s.guests, { ...guest, id }] }))
    return id
  }, [update])

  const addGuests = useCallback((guests: Omit<Guest, 'id'>[]) => {
    update(s => ({
      ...s,
      guests: [...s.guests, ...guests.map(g => ({ ...g, id: uuidv4() }))]
    }))
  }, [update])

  const updateGuest = useCallback((id: string, data: Partial<Guest>) => {
    update(s => ({
      ...s,
      guests: s.guests.map(g => g.id === id ? { ...g, ...data } : g)
    }))
  }, [update])

  const removeGuest = useCallback((id: string) => {
    update(s => ({
      ...s,
      guests: s.guests.filter(g => g.id !== id),
      tables: s.tables.map(t => ({
        ...t,
        seats: t.seats.map(seat => seat.guestId === id ? { ...seat, guestId: null } : seat)
      }))
    }))
  }, [update])

  const addTable = useCallback((name: string, seatCount: number, shape: TableShape = 'round') => {
    update(s => ({
      ...s,
      tables: [...s.tables, { id: uuidv4(), name, seats: createSeats(seatCount), shape }]
    }))
  }, [update])

  const removeTable = useCallback((id: string) => {
    update(s => ({ ...s, tables: s.tables.filter(t => t.id !== id) }))
  }, [update])

  const updateTable = useCallback((id: string, data: Partial<Pick<Table, 'name' | 'shape'>>) => {
    update(s => ({
      ...s,
      tables: s.tables.map(t => t.id === id ? { ...t, ...data } : t)
    }))
  }, [update])

  const resizeTable = useCallback((id: string, newCount: number) => {
    update(s => ({
      ...s,
      tables: s.tables.map(t => {
        if (t.id !== id) return t
        const seats = [...t.seats]
        if (newCount > seats.length) {
          for (let i = seats.length; i < newCount; i++) {
            seats.push({ index: i, guestId: null })
          }
        } else {
          seats.length = newCount
        }
        return { ...t, seats: seats.map((s, i) => ({ ...s, index: i })) }
      })
    }))
  }, [update])

  const assignSeat = useCallback((tableId: string, seatIndex: number, guestId: string | null) => {
    update(s => ({
      ...s,
      tables: s.tables.map(t => {
        if (t.id !== tableId) {
          return {
            ...t,
            seats: t.seats.map(seat => seat.guestId === guestId ? { ...seat, guestId: null } : seat)
          }
        }
        return {
          ...t,
          seats: t.seats.map(seat => {
            if (seat.index === seatIndex && seat.guestId === guestId) return seat
            if (seat.guestId === guestId) return { ...seat, guestId: null }
            if (seat.index === seatIndex) return { ...seat, guestId }
            return seat
          })
        }
      })
    }))
  }, [update])

  const unassignSeat = useCallback((tableId: string, seatIndex: number) => {
    update(s => ({
      ...s,
      tables: s.tables.map(t =>
        t.id === tableId
          ? { ...t, seats: t.seats.map(seat => seat.index === seatIndex ? { ...seat, guestId: null } : seat) }
          : t
      )
    }))
  }, [update])

  const clearAll = useCallback(() => {
    update(() => ({ guests: [], tables: [] }))
  }, [update])

  const unseatedGuests = state.guests.filter(g => {
    return !state.tables.some(t => t.seats.some(s => s.guestId === g.id))
  })

  return {
    guests: state.guests,
    tables: state.tables,
    unseatedGuests,
    addGuest,
    addGuests,
    updateGuest,
    removeGuest,
    addTable,
    removeTable,
    updateTable,
    resizeTable,
    assignSeat,
    unassignSeat,
    clearAll,
  }
}
