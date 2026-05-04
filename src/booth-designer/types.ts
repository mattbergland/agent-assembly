export type BoothShape = 'rectangle' | 'l-shape' | 'u-shape' | 'island' | 'peninsula'

export type ViewMode = 'floor' | '3d'

export type ElementCategory =
  | 'furniture'
  | 'technology'
  | 'branding'
  | 'structure'
  | 'accessories'

export interface ElementDefinition {
  type: string
  label: string
  category: ElementCategory
  width: number   // in inches
  depth: number   // in inches
  height: number  // in inches
  color: string
  icon: string
  defaultCost: number
}

export interface PlacedElement {
  id: string
  type: string
  x: number       // position in inches from left
  y: number       // position in inches from top
  width: number
  depth: number
  height: number
  rotation: number // degrees (0, 90, 180, 270)
  label: string
  cost: number
  color: string
  locked: boolean
  notes: string
}

export interface WallSegment {
  id: string
  side: 'top' | 'right' | 'bottom' | 'left'
  hasWall: boolean
}

export interface Opening {
  id: string
  wallSide: 'top' | 'right' | 'bottom' | 'left'
  position: number  // offset in inches from wall start
  width: number     // width in inches
  type: 'entry' | 'service'
}

export interface BoothConfig {
  width: number       // inches
  depth: number       // inches
  ceilingHeight: number // inches
  shape: BoothShape
  walls: WallSegment[]
  openings: Opening[]
}

export interface BoothProject {
  id: string
  name: string
  config: BoothConfig
  elements: PlacedElement[]
  createdAt: number
  updatedAt: number
}

export interface HistoryEntry {
  elements: PlacedElement[]
  config: BoothConfig
}

export interface DraggedElement {
  type: 'NEW_ELEMENT'
  elementType: string
}

export interface DraggedPlaced {
  type: 'MOVE_ELEMENT'
  elementId: string
}
