import type { ElementDefinition, BoothConfig, WallSegment } from './types'

export const GRID_SIZE = 6 // 6 inches = 0.5 feet per grid cell

export const BOOTH_PRESETS: { label: string; width: number; depth: number }[] = [
  { label: "10' × 10'", width: 120, depth: 120 },
  { label: "10' × 20'", width: 240, depth: 120 },
  { label: "20' × 20'", width: 240, depth: 240 },
  { label: "20' × 30'", width: 360, depth: 240 },
  { label: "30' × 30'", width: 360, depth: 360 },
]

export function createDefaultWalls(): WallSegment[] {
  return [
    { id: 'wall-top', side: 'top', hasWall: false },
    { id: 'wall-right', side: 'right', hasWall: true },
    { id: 'wall-bottom', side: 'bottom', hasWall: true },
    { id: 'wall-left', side: 'left', hasWall: true },
  ]
}

export function createDefaultConfig(): BoothConfig {
  return {
    width: 120,
    depth: 120,
    ceilingHeight: 96,
    shape: 'rectangle',
    walls: createDefaultWalls(),
    openings: [],
  }
}

export const ELEMENT_CATALOG: ElementDefinition[] = [
  // Furniture
  { type: 'table-6ft', label: "6' Table", category: 'furniture', width: 72, depth: 30, height: 30, color: '#E8DCC8', icon: 'table', defaultCost: 75 },
  { type: 'table-4ft', label: "4' Table", category: 'furniture', width: 48, depth: 30, height: 30, color: '#E8DCC8', icon: 'table', defaultCost: 55 },
  { type: 'table-round', label: 'Round Table', category: 'furniture', width: 36, depth: 36, height: 30, color: '#E8DCC8', icon: 'circle', defaultCost: 65 },
  { type: 'counter', label: 'Counter', category: 'furniture', width: 60, depth: 24, height: 42, color: '#D4C5A9', icon: 'table', defaultCost: 150 },
  { type: 'reception-desk', label: 'Reception Desk', category: 'furniture', width: 72, depth: 30, height: 42, color: '#B8A88A', icon: 'desk', defaultCost: 250 },
  { type: 'chair', label: 'Chair', category: 'furniture', width: 18, depth: 18, height: 32, color: '#8B8B8B', icon: 'armchair', defaultCost: 25 },
  { type: 'stool', label: 'Bar Stool', category: 'furniture', width: 14, depth: 14, height: 30, color: '#8B8B8B', icon: 'circle', defaultCost: 35 },
  { type: 'sofa', label: 'Lounge Sofa', category: 'furniture', width: 72, depth: 30, height: 32, color: '#A0937D', icon: 'sofa', defaultCost: 200 },
  { type: 'coffee-table', label: 'Coffee Table', category: 'furniture', width: 36, depth: 24, height: 18, color: '#C4B89C', icon: 'table', defaultCost: 60 },
  { type: 'storage-cabinet', label: 'Storage Cabinet', category: 'furniture', width: 36, depth: 18, height: 36, color: '#9B8E7E', icon: 'cabinet', defaultCost: 120 },

  // Technology
  { type: 'monitor-42', label: '42" Monitor', category: 'technology', width: 38, depth: 6, height: 24, color: '#2A2A2A', icon: 'monitor', defaultCost: 350 },
  { type: 'monitor-55', label: '55" Monitor', category: 'technology', width: 49, depth: 6, height: 28, color: '#2A2A2A', icon: 'monitor', defaultCost: 500 },
  { type: 'monitor-stand', label: 'Monitor Stand', category: 'technology', width: 24, depth: 24, height: 72, color: '#3A3A3A', icon: 'monitor', defaultCost: 150 },
  { type: 'demo-station', label: 'Demo Station', category: 'technology', width: 48, depth: 24, height: 36, color: '#4A4A4A', icon: 'laptop', defaultCost: 300 },
  { type: 'charging-station', label: 'Charging Station', category: 'technology', width: 18, depth: 18, height: 42, color: '#5A5A5A', icon: 'zap', defaultCost: 100 },
  { type: 'kiosk', label: 'Interactive Kiosk', category: 'technology', width: 24, depth: 24, height: 54, color: '#3A3A3A', icon: 'tablet', defaultCost: 450 },
  { type: 'laptop-bar', label: 'Laptop Bar', category: 'technology', width: 72, depth: 18, height: 42, color: '#4A4A4A', icon: 'laptop', defaultCost: 200 },

  // Branding
  { type: 'banner-stand', label: 'Banner Stand', category: 'branding', width: 36, depth: 12, height: 84, color: '#8E7DBE', icon: 'flag', defaultCost: 120 },
  { type: 'backdrop-8ft', label: "8' Backdrop", category: 'branding', width: 96, depth: 6, height: 96, color: '#B8ABD9', icon: 'image', defaultCost: 400 },
  { type: 'backdrop-10ft', label: "10' Backdrop", category: 'branding', width: 120, depth: 6, height: 96, color: '#B8ABD9', icon: 'image', defaultCost: 500 },
  { type: 'hanging-sign', label: 'Hanging Sign', category: 'branding', width: 48, depth: 48, height: 6, color: '#9C8DC4', icon: 'type', defaultCost: 600 },
  { type: 'lightbox', label: 'Lightbox', category: 'branding', width: 36, depth: 6, height: 48, color: '#C4B8E0', icon: 'sun', defaultCost: 250 },
  { type: 'podium', label: 'Podium / Lectern', category: 'branding', width: 24, depth: 20, height: 44, color: '#7A6BA8', icon: 'mic', defaultCost: 175 },
  { type: 'literature-rack', label: 'Literature Rack', category: 'branding', width: 24, depth: 12, height: 60, color: '#A89BC8', icon: 'book', defaultCost: 80 },

  // Structure
  { type: 'wall-panel', label: 'Wall Panel', category: 'structure', width: 48, depth: 4, height: 96, color: '#E0DDD5', icon: 'panel-left', defaultCost: 200 },
  { type: 'half-wall', label: 'Half Wall', category: 'structure', width: 48, depth: 4, height: 42, color: '#E0DDD5', icon: 'panel-left', defaultCost: 120 },
  { type: 'arch-entry', label: 'Arch Entry', category: 'structure', width: 60, depth: 12, height: 96, color: '#D0CCC4', icon: 'door-open', defaultCost: 350 },
  { type: 'column', label: 'Column', category: 'structure', width: 12, depth: 12, height: 96, color: '#C8C4BC', icon: 'pillar', defaultCost: 150 },
  { type: 'raised-platform', label: 'Raised Platform', category: 'structure', width: 96, depth: 48, height: 6, color: '#BCBAB2', icon: 'layers', defaultCost: 400 },

  // Accessories
  { type: 'carpet', label: 'Area Carpet', category: 'accessories', width: 72, depth: 48, height: 1, color: '#6B6560', icon: 'square', defaultCost: 80 },
  { type: 'plant-large', label: 'Large Plant', category: 'accessories', width: 18, depth: 18, height: 48, color: '#5A7A50', icon: 'flower', defaultCost: 60 },
  { type: 'plant-small', label: 'Small Plant', category: 'accessories', width: 12, depth: 12, height: 24, color: '#6B8B60', icon: 'flower', defaultCost: 30 },
  { type: 'trash-bin', label: 'Trash Bin', category: 'accessories', width: 14, depth: 14, height: 28, color: '#8A8A8A', icon: 'trash', defaultCost: 15 },
  { type: 'rope-stanchion', label: 'Rope Stanchion', category: 'accessories', width: 12, depth: 12, height: 36, color: '#C0A870', icon: 'milestone', defaultCost: 40 },
  { type: 'led-strip', label: 'LED Light Strip', category: 'accessories', width: 48, depth: 2, height: 2, color: '#FFE066', icon: 'lightbulb', defaultCost: 60 },
]

export const CATEGORY_LABELS: Record<string, string> = {
  furniture: 'Furniture',
  technology: 'Technology',
  branding: 'Branding',
  structure: 'Structure',
  accessories: 'Accessories',
}
