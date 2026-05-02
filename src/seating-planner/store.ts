import { useState, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { Guest, Table, Seat, TableShape, Project } from './types'

const PROJECTS_KEY = 'seating-planner-projects'
const ACTIVE_PROJECT_KEY = 'seating-planner-active-project'
const LEGACY_KEY = 'seating-planner-state'
const TUTORIAL_KEY = 'seating-planner-tutorial-done'

interface ProjectsState {
  projects: Project[]
  activeProjectId: string | null
}

function createDefaultProject(): Project {
  return {
    id: uuidv4(),
    name: 'Untitled Event',
    guests: [],
    tables: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
}

function migrateLegacyState(): Project | null {
  try {
    const raw = localStorage.getItem(LEGACY_KEY)
    if (!raw) return null
    const legacy = JSON.parse(raw) as { guests: Guest[]; tables: Table[] }
    if (legacy.guests.length === 0 && legacy.tables.length === 0) return null
    const project: Project = {
      id: uuidv4(),
      name: 'My Event',
      guests: legacy.guests,
      tables: legacy.tables,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    localStorage.removeItem(LEGACY_KEY)
    return project
  } catch {
    return null
  }
}

function loadProjects(): ProjectsState {
  try {
    const raw = localStorage.getItem(PROJECTS_KEY)
    if (raw) {
      const projects: Project[] = JSON.parse(raw)
      const activeId = localStorage.getItem(ACTIVE_PROJECT_KEY)
      const active = projects.find(p => p.id === activeId) ? activeId : (projects[0]?.id ?? null)
      return { projects, activeProjectId: active }
    }
  } catch { /* ignore */ }

  const migrated = migrateLegacyState()
  if (migrated) {
    const state = { projects: [migrated], activeProjectId: migrated.id }
    saveProjects(state.projects, state.activeProjectId)
    return state
  }

  return { projects: [], activeProjectId: null }
}

function saveProjects(projects: Project[], activeId: string | null) {
  try {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects))
    if (activeId) localStorage.setItem(ACTIVE_PROJECT_KEY, activeId)
  } catch { /* ignore storage errors */ }
}

function createSeats(count: number): Seat[] {
  return Array.from({ length: count }, (_, i) => ({ index: i, guestId: null }))
}

export function isTutorialDone(): boolean {
  try {
    return localStorage.getItem(TUTORIAL_KEY) === 'true'
  } catch {
    return false
  }
}

export function markTutorialDone() {
  try {
    localStorage.setItem(TUTORIAL_KEY, 'true')
  } catch { /* ignore */ }
}

export function useAppState() {
  const [state, setState] = useState<ProjectsState>(loadProjects)

  const activeProject = state.projects.find(p => p.id === state.activeProjectId) ?? null

  const update = useCallback((fn: (prev: ProjectsState) => ProjectsState) => {
    setState(prev => {
      const next = fn(prev)
      saveProjects(next.projects, next.activeProjectId)
      return next
    })
  }, [])

  const updateActiveProject = useCallback((fn: (project: Project) => Project) => {
    update(s => {
      if (!s.activeProjectId) return s
      return {
        ...s,
        projects: s.projects.map(p =>
          p.id === s.activeProjectId ? fn({ ...p, updatedAt: Date.now() }) : p
        ),
      }
    })
  }, [update])

  // Project management
  const createProject = useCallback((name: string) => {
    const project = { ...createDefaultProject(), name }
    update(s => ({
      projects: [...s.projects, project],
      activeProjectId: project.id,
    }))
    return project.id
  }, [update])

  const switchProject = useCallback((id: string) => {
    update(s => ({ ...s, activeProjectId: id }))
  }, [update])

  const renameProject = useCallback((id: string, name: string) => {
    update(s => ({
      ...s,
      projects: s.projects.map(p =>
        p.id === id ? { ...p, name, updatedAt: Date.now() } : p
      ),
    }))
  }, [update])

  const deleteProject = useCallback((id: string) => {
    update(s => {
      const remaining = s.projects.filter(p => p.id !== id)
      const newActive = s.activeProjectId === id
        ? (remaining[0]?.id ?? null)
        : s.activeProjectId
      return { projects: remaining, activeProjectId: newActive }
    })
  }, [update])

  const duplicateProject = useCallback((id: string) => {
    update(s => {
      const source = s.projects.find(p => p.id === id)
      if (!source) return s
      const copy: Project = {
        ...JSON.parse(JSON.stringify(source)),
        id: uuidv4(),
        name: `${source.name} (Copy)`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
      return {
        projects: [...s.projects, copy],
        activeProjectId: copy.id,
      }
    })
  }, [update])

  // Guest operations
  const addGuest = useCallback((guest: Omit<Guest, 'id'>) => {
    const id = uuidv4()
    updateActiveProject(p => ({ ...p, guests: [...p.guests, { ...guest, id }] }))
    return id
  }, [updateActiveProject])

  const addGuests = useCallback((guests: Omit<Guest, 'id'>[]) => {
    updateActiveProject(p => ({
      ...p,
      guests: [...p.guests, ...guests.map(g => ({ ...g, id: uuidv4() }))]
    }))
  }, [updateActiveProject])

  const updateGuest = useCallback((id: string, data: Partial<Guest>) => {
    updateActiveProject(p => ({
      ...p,
      guests: p.guests.map(g => g.id === id ? { ...g, ...data } : g)
    }))
  }, [updateActiveProject])

  const removeGuest = useCallback((id: string) => {
    updateActiveProject(p => ({
      ...p,
      guests: p.guests.filter(g => g.id !== id),
      tables: p.tables.map(t => ({
        ...t,
        seats: t.seats.map(seat => seat.guestId === id ? { ...seat, guestId: null } : seat)
      }))
    }))
  }, [updateActiveProject])

  // Table operations
  const addTable = useCallback((name: string, seatCount: number, shape: TableShape = 'round') => {
    updateActiveProject(p => ({
      ...p,
      tables: [...p.tables, { id: uuidv4(), name, seats: createSeats(seatCount), shape }]
    }))
  }, [updateActiveProject])

  const removeTable = useCallback((id: string) => {
    updateActiveProject(p => ({ ...p, tables: p.tables.filter(t => t.id !== id) }))
  }, [updateActiveProject])

  const updateTable = useCallback((id: string, data: Partial<Pick<Table, 'name' | 'shape'>>) => {
    updateActiveProject(p => ({
      ...p,
      tables: p.tables.map(t => t.id === id ? { ...t, ...data } : t)
    }))
  }, [updateActiveProject])

  const resizeTable = useCallback((id: string, newCount: number) => {
    updateActiveProject(p => ({
      ...p,
      tables: p.tables.map(t => {
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
  }, [updateActiveProject])

  const assignSeat = useCallback((tableId: string, seatIndex: number, guestId: string | null) => {
    updateActiveProject(p => ({
      ...p,
      tables: p.tables.map(t => {
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
  }, [updateActiveProject])

  const unassignSeat = useCallback((tableId: string, seatIndex: number) => {
    updateActiveProject(p => ({
      ...p,
      tables: p.tables.map(t =>
        t.id === tableId
          ? { ...t, seats: t.seats.map(seat => seat.index === seatIndex ? { ...seat, guestId: null } : seat) }
          : t
      )
    }))
  }, [updateActiveProject])

  const clearAll = useCallback(() => {
    updateActiveProject(p => ({ ...p, guests: [], tables: [] }))
  }, [updateActiveProject])

  const guests = activeProject?.guests ?? []
  const tables = activeProject?.tables ?? []

  const unseatedGuests = guests.filter(g => {
    return !tables.some(t => t.seats.some(s => s.guestId === g.id))
  })

  return {
    // Project management
    projects: state.projects,
    activeProject,
    activeProjectId: state.activeProjectId,
    createProject,
    switchProject,
    renameProject,
    deleteProject,
    duplicateProject,
    // Guest/table state
    guests,
    tables,
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
