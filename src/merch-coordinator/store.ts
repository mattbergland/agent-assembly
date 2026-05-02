import { useState, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { SwagItem, Kit, KitItem, PackagingType, RecipientTier, ItemCategory } from './types'

const STORAGE_KEY = 'merch-coordinator-state'

interface AppState {
  items: SwagItem[]
  kits: Kit[]
  activeKitId: string | null
}

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return { items: [], kits: [], activeKitId: null }
}

function saveState(state: AppState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function createEmptyKit(): Kit {
  return {
    id: uuidv4(),
    name: '',
    items: [],
    packaging: 'box',
    note: '',
    tier: 'event-attendees',
    recipientCount: 1,
    createdAt: Date.now(),
  }
}

export function useMerchStore() {
  const [state, setState] = useState<AppState>(loadState)

  const update = useCallback((fn: (prev: AppState) => AppState) => {
    setState(prev => {
      const next = fn(prev)
      try { saveState(next) } catch { /* ignore storage errors */ }
      return next
    })
  }, [])

  // ── Item catalog ──

  const addItem = useCallback((item: Omit<SwagItem, 'id'>) => {
    const id = uuidv4()
    update(s => ({ ...s, items: [...s.items, { ...item, id }] }))
    return id
  }, [update])

  const updateItem = useCallback((id: string, data: Partial<SwagItem>) => {
    update(s => ({
      ...s,
      items: s.items.map(i => i.id === id ? { ...i, ...data } : i)
    }))
  }, [update])

  const removeItem = useCallback((id: string) => {
    update(s => ({
      ...s,
      items: s.items.filter(i => i.id !== id),
      kits: s.kits.map(k => ({
        ...k,
        items: k.items.filter(ki => ki.itemId !== id)
      }))
    }))
  }, [update])

  // ── Kit management ──

  const newKit = useCallback(() => {
    const kit = createEmptyKit()
    update(s => ({ ...s, kits: [...s.kits, kit], activeKitId: kit.id }))
    return kit.id
  }, [update])

  const setActiveKit = useCallback((id: string | null) => {
    update(s => ({ ...s, activeKitId: id }))
  }, [update])

  const updateKit = useCallback((id: string, data: Partial<Omit<Kit, 'id' | 'createdAt'>>) => {
    update(s => ({
      ...s,
      kits: s.kits.map(k => k.id === id ? { ...k, ...data } : k)
    }))
  }, [update])

  const removeKit = useCallback((id: string) => {
    update(s => ({
      ...s,
      kits: s.kits.filter(k => k.id !== id),
      activeKitId: s.activeKitId === id ? null : s.activeKitId,
    }))
  }, [update])

  const addItemToKit = useCallback((kitId: string, itemId: string) => {
    update(s => ({
      ...s,
      kits: s.kits.map(k => {
        if (k.id !== kitId) return k
        const existing = k.items.find(ki => ki.itemId === itemId)
        if (existing) {
          return {
            ...k,
            items: k.items.map(ki =>
              ki.itemId === itemId ? { ...ki, quantity: ki.quantity + 1 } : ki
            )
          }
        }
        return { ...k, items: [...k.items, { itemId, quantity: 1 }] }
      })
    }))
  }, [update])

  const updateKitItem = useCallback((kitId: string, itemId: string, quantity: number) => {
    update(s => ({
      ...s,
      kits: s.kits.map(k => {
        if (k.id !== kitId) return k
        if (quantity <= 0) {
          return { ...k, items: k.items.filter(ki => ki.itemId !== itemId) }
        }
        return {
          ...k,
          items: k.items.map(ki =>
            ki.itemId === itemId ? { ...ki, quantity } : ki
          )
        }
      })
    }))
  }, [update])

  const removeItemFromKit = useCallback((kitId: string, itemId: string) => {
    update(s => ({
      ...s,
      kits: s.kits.map(k =>
        k.id === kitId ? { ...k, items: k.items.filter(ki => ki.itemId !== itemId) } : k
      )
    }))
  }, [update])

  const duplicateKit = useCallback((id: string) => {
    update(s => {
      const source = s.kits.find(k => k.id === id)
      if (!source) return s
      const newId = uuidv4()
      const copy: Kit = {
        ...source,
        id: newId,
        name: source.name ? `${source.name} (copy)` : '',
        createdAt: Date.now(),
      }
      return { ...s, kits: [...s.kits, copy], activeKitId: newId }
    })
  }, [update])

  const clearAll = useCallback(() => {
    update(() => ({ items: [], kits: [], activeKitId: null }))
  }, [update])

  const activeKit = state.kits.find(k => k.id === state.activeKitId) ?? null

  const getKitCost = useCallback((kit: Kit) => {
    return kit.items.reduce((total, ki) => {
      const item = state.items.find(i => i.id === ki.itemId)
      return total + (item ? item.unitCost * ki.quantity : 0)
    }, 0)
  }, [state.items])

  return {
    items: state.items,
    kits: state.kits,
    activeKit,
    addItem,
    updateItem,
    removeItem,
    newKit,
    setActiveKit,
    updateKit,
    removeKit,
    addItemToKit,
    updateKitItem,
    removeItemFromKit,
    duplicateKit,
    clearAll,
    getKitCost,
  }
}

export type { SwagItem, Kit, KitItem, PackagingType, RecipientTier, ItemCategory }
