import { useState, useCallback, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { BoothProject, BoothConfig, PlacedElement, HistoryEntry, Opening, WallSegment, ViewMode } from './types'
import { createDefaultConfig, ELEMENT_CATALOG, GRID_SIZE } from './constants'

const PROJECTS_KEY = 'booth-designer-projects'
const ACTIVE_KEY = 'booth-designer-active'
const TUTORIAL_KEY = 'booth-designer-tutorial-done'
const MAX_HISTORY = 50

function createDefaultProject(): BoothProject {
  return {
    id: uuidv4(),
    name: 'Untitled Booth',
    config: createDefaultConfig(),
    elements: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
}

function loadProjects(): { projects: BoothProject[]; activeId: string | null } {
  try {
    const raw = localStorage.getItem(PROJECTS_KEY)
    if (raw) {
      const projects: BoothProject[] = JSON.parse(raw)
      const activeId = localStorage.getItem(ACTIVE_KEY)
      const active = projects.find(p => p.id === activeId) ? activeId : (projects[0]?.id ?? null)
      return { projects, activeId: active }
    }
  } catch { /* ignore */ }
  return { projects: [], activeId: null }
}

function saveProjects(projects: BoothProject[], activeId: string | null) {
  try {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects))
    if (activeId) localStorage.setItem(ACTIVE_KEY, activeId)
  } catch { /* ignore */ }
}

export function isTutorialDone(): boolean {
  try { return localStorage.getItem(TUTORIAL_KEY) === 'true' } catch { return false }
}

export function markTutorialDone() {
  try { localStorage.setItem(TUTORIAL_KEY, 'true') } catch { /* ignore */ }
}

function snapToGrid(value: number): number {
  return Math.round(value / GRID_SIZE) * GRID_SIZE
}

export function useBoothStore() {
  const [state, setState] = useState(loadProjects)
  const [viewMode, setViewMode] = useState<ViewMode>('floor')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const historyRef = useRef<HistoryEntry[]>([])
  const futureRef = useRef<HistoryEntry[]>([])

  const activeProject = state.projects.find(p => p.id === state.activeId) ?? null

  const persist = useCallback((projects: BoothProject[], activeId: string | null) => {
    saveProjects(projects, activeId)
    setState({ projects, activeId })
  }, [])

  const pushHistory = useCallback(() => {
    if (!activeProject) return
    historyRef.current.push({
      elements: JSON.parse(JSON.stringify(activeProject.elements)),
      config: JSON.parse(JSON.stringify(activeProject.config)),
    })
    if (historyRef.current.length > MAX_HISTORY) historyRef.current.shift()
    futureRef.current = []
  }, [activeProject])

  const updateProject = useCallback((fn: (p: BoothProject) => BoothProject) => {
    setState(prev => {
      if (!prev.activeId) return prev
      const projects = prev.projects.map(p =>
        p.id === prev.activeId ? fn({ ...p, updatedAt: Date.now() }) : p
      )
      saveProjects(projects, prev.activeId)
      return { ...prev, projects }
    })
  }, [])

  // Project management
  const createProject = useCallback((name: string) => {
    const project = { ...createDefaultProject(), name }
    const projects = [...state.projects, project]
    persist(projects, project.id)
    return project.id
  }, [state.projects, persist])

  const switchProject = useCallback((id: string) => {
    persist(state.projects, id)
    setSelectedId(null)
    historyRef.current = []
    futureRef.current = []
  }, [state.projects, persist])

  const renameProject = useCallback((id: string, name: string) => {
    const projects = state.projects.map(p =>
      p.id === id ? { ...p, name, updatedAt: Date.now() } : p
    )
    persist(projects, state.activeId)
  }, [state, persist])

  const deleteProject = useCallback((id: string) => {
    const remaining = state.projects.filter(p => p.id !== id)
    const newActive = state.activeId === id ? (remaining[0]?.id ?? null) : state.activeId
    persist(remaining, newActive)
  }, [state, persist])

  const duplicateProject = useCallback((id: string) => {
    const source = state.projects.find(p => p.id === id)
    if (!source) return
    const copy: BoothProject = {
      ...JSON.parse(JSON.stringify(source)),
      id: uuidv4(),
      name: `${source.name} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    const projects = [...state.projects, copy]
    persist(projects, copy.id)
  }, [state.projects, persist])

  // Config
  const updateConfig = useCallback((partial: Partial<BoothConfig>) => {
    pushHistory()
    updateProject(p => ({ ...p, config: { ...p.config, ...partial } }))
  }, [pushHistory, updateProject])

  const toggleWall = useCallback((side: WallSegment['side']) => {
    pushHistory()
    updateProject(p => ({
      ...p,
      config: {
        ...p.config,
        walls: p.config.walls.map(w =>
          w.side === side ? { ...w, hasWall: !w.hasWall } : w
        ),
      },
    }))
  }, [pushHistory, updateProject])

  const addOpening = useCallback((opening: Omit<Opening, 'id'>) => {
    pushHistory()
    updateProject(p => ({
      ...p,
      config: {
        ...p.config,
        openings: [...p.config.openings, { ...opening, id: uuidv4() }],
      },
    }))
  }, [pushHistory, updateProject])

  const removeOpening = useCallback((id: string) => {
    pushHistory()
    updateProject(p => ({
      ...p,
      config: {
        ...p.config,
        openings: p.config.openings.filter(o => o.id !== id),
      },
    }))
  }, [pushHistory, updateProject])

  // Element operations
  const addElement = useCallback((elementType: string, x: number, y: number) => {
    const def = ELEMENT_CATALOG.find(e => e.type === elementType)
    if (!def) return null
    pushHistory()
    const id = uuidv4()
    const element: PlacedElement = {
      id,
      type: elementType,
      x: snapToGrid(x),
      y: snapToGrid(y),
      width: def.width,
      depth: def.depth,
      height: def.height,
      rotation: 0,
      label: def.label,
      cost: def.defaultCost,
      color: def.color,
      locked: false,
      notes: '',
    }
    updateProject(p => ({ ...p, elements: [...p.elements, element] }))
    setSelectedId(id)
    return id
  }, [pushHistory, updateProject])

  const moveElement = useCallback((id: string, x: number, y: number) => {
    updateProject(p => ({
      ...p,
      elements: p.elements.map(el =>
        el.id === id ? { ...el, x: snapToGrid(x), y: snapToGrid(y) } : el
      ),
    }))
  }, [updateProject])

  const moveElementDone = useCallback(() => {
    pushHistory()
  }, [pushHistory])

  const updateElement = useCallback((id: string, partial: Partial<PlacedElement>) => {
    pushHistory()
    updateProject(p => ({
      ...p,
      elements: p.elements.map(el =>
        el.id === id ? { ...el, ...partial } : el
      ),
    }))
  }, [pushHistory, updateProject])

  const rotateElement = useCallback((id: string) => {
    pushHistory()
    updateProject(p => ({
      ...p,
      elements: p.elements.map(el =>
        el.id === id
          ? { ...el, rotation: (el.rotation + 90) % 360, width: el.depth, depth: el.width }
          : el
      ),
    }))
  }, [pushHistory, updateProject])

  const removeElement = useCallback((id: string) => {
    pushHistory()
    updateProject(p => ({ ...p, elements: p.elements.filter(el => el.id !== id) }))
    if (selectedId === id) setSelectedId(null)
  }, [pushHistory, updateProject, selectedId])

  const duplicateElement = useCallback((id: string) => {
    if (!activeProject) return
    const source = activeProject.elements.find(el => el.id === id)
    if (!source) return
    pushHistory()
    const newEl: PlacedElement = {
      ...JSON.parse(JSON.stringify(source)),
      id: uuidv4(),
      x: snapToGrid(source.x + GRID_SIZE * 2),
      y: snapToGrid(source.y + GRID_SIZE * 2),
    }
    updateProject(p => ({ ...p, elements: [...p.elements, newEl] }))
    setSelectedId(newEl.id)
  }, [activeProject, pushHistory, updateProject])

  const clearElements = useCallback(() => {
    pushHistory()
    updateProject(p => ({ ...p, elements: [] }))
    setSelectedId(null)
  }, [pushHistory, updateProject])

  // Undo / Redo
  const undo = useCallback(() => {
    if (historyRef.current.length === 0 || !activeProject) return
    futureRef.current.push({
      elements: JSON.parse(JSON.stringify(activeProject.elements)),
      config: JSON.parse(JSON.stringify(activeProject.config)),
    })
    const prev = historyRef.current.pop()!
    updateProject(p => ({ ...p, elements: prev.elements, config: prev.config }))
  }, [activeProject, updateProject])

  const redo = useCallback(() => {
    if (futureRef.current.length === 0 || !activeProject) return
    historyRef.current.push({
      elements: JSON.parse(JSON.stringify(activeProject.elements)),
      config: JSON.parse(JSON.stringify(activeProject.config)),
    })
    const next = futureRef.current.pop()!
    updateProject(p => ({ ...p, elements: next.elements, config: next.config }))
  }, [activeProject, updateProject])

  const canUndo = historyRef.current.length > 0
  const canRedo = futureRef.current.length > 0

  // Budget
  const totalBudget = activeProject?.elements.reduce((sum, el) => sum + el.cost, 0) ?? 0

  return {
    projects: state.projects,
    activeProject,
    viewMode,
    selectedId,
    totalBudget,
    canUndo,
    canRedo,

    setViewMode,
    setSelectedId,

    createProject,
    switchProject,
    renameProject,
    deleteProject,
    duplicateProject,

    updateConfig,
    toggleWall,
    addOpening,
    removeOpening,

    addElement,
    moveElement,
    moveElementDone,
    updateElement,
    rotateElement,
    removeElement,
    duplicateElement,
    clearElements,

    undo,
    redo,
  }
}
