import { useState } from 'react'
import { ELEMENT_CATALOG, CATEGORY_LABELS } from '../constants'
import type { ElementCategory } from '../types'

const CATEGORIES: ElementCategory[] = ['furniture', 'technology', 'branding', 'structure', 'accessories']

function ElementIcon({ icon, size = 20 }: { icon: string; size?: number }) {
  const s = size
  const sw = 1.8
  const common = { width: s, height: s, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: sw, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

  switch (icon) {
    case 'table':
      return <svg {...common}><rect x="3" y="4" width="18" height="12" rx="2" /><line x1="6" y1="16" x2="6" y2="20" /><line x1="18" y1="16" x2="18" y2="20" /></svg>
    case 'circle':
      return <svg {...common}><circle cx="12" cy="12" r="8" /></svg>
    case 'desk':
      return <svg {...common}><path d="M2 6h20v4H2z" /><path d="M4 10v8" /><path d="M20 10v8" /><path d="M8 10v4h8v-4" /></svg>
    case 'armchair':
      return <svg {...common}><path d="M5 11V7a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v4" /><rect x="3" y="11" width="18" height="8" rx="2" /><path d="M7 19v2M17 19v2" /></svg>
    case 'sofa':
      return <svg {...common}><path d="M3 10V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3" /><rect x="2" y="10" width="20" height="7" rx="2" /><path d="M6 17v2M18 17v2" /></svg>
    case 'cabinet':
      return <svg {...common}><rect x="4" y="3" width="16" height="18" rx="2" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="12" y1="7" x2="12" y2="7.01" /><line x1="12" y1="15" x2="12" y2="15.01" /></svg>
    case 'monitor':
      return <svg {...common}><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
    case 'laptop':
      return <svg {...common}><path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8H4V6z" /><path d="M2 18h20" /></svg>
    case 'zap':
      return <svg {...common}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
    case 'tablet':
      return <svg {...common}><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12" y2="18.01" /></svg>
    case 'flag':
      return <svg {...common}><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></svg>
    case 'image':
      return <svg {...common}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
    case 'type':
      return <svg {...common}><polyline points="4 7 4 4 20 4 20 7" /><line x1="9" y1="20" x2="15" y2="20" /><line x1="12" y1="4" x2="12" y2="20" /></svg>
    case 'sun':
      return <svg {...common}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></svg>
    case 'mic':
      return <svg {...common}><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>
    case 'book':
      return <svg {...common}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
    case 'panel-left':
      return <svg {...common}><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="9" y1="3" x2="9" y2="21" /></svg>
    case 'door-open':
      return <svg {...common}><path d="M13 4h3a2 2 0 0 1 2 2v14" /><path d="M2 20h3" /><path d="M13 20h9" /><path d="M10 12v.01" /><path d="M13 4.562v16.157a1 1 0 0 1-1.242.97L5 20V5.562a2 2 0 0 1 1.515-1.94l4-1A2 2 0 0 1 13 4.561z" /></svg>
    case 'pillar':
      return <svg {...common}><rect x="8" y="2" width="8" height="20" rx="1" /><line x1="6" y1="2" x2="18" y2="2" /><line x1="6" y1="22" x2="18" y2="22" /></svg>
    case 'layers':
      return <svg {...common}><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
    case 'square':
      return <svg {...common}><rect x="3" y="3" width="18" height="18" rx="2" /></svg>
    case 'flower':
      return <svg {...common}><circle cx="12" cy="12" r="3" /><path d="M12 2a3 3 0 0 0 0 6 3 3 0 0 0 0-6" /><path d="M19 7a3 3 0 0 0-5 2" /><path d="M20 14a3 3 0 0 0-4-2" /><path d="M16 20a3 3 0 0 0-2-4" /><path d="M8 20a3 3 0 0 0 2-4" /><path d="M4 14a3 3 0 0 0 4-2" /><path d="M5 7a3 3 0 0 0 5 2" /></svg>
    case 'trash':
      return <svg {...common}><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
    case 'milestone':
      return <svg {...common}><path d="M12 22V2" /><path d="M5 8h14l-2 4 2 4H5" /></svg>
    case 'lightbulb':
      return <svg {...common}><path d="M9 18h6" /><path d="M10 22h4" /><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" /></svg>
    default:
      return <svg {...common}><rect x="3" y="3" width="18" height="18" rx="2" /></svg>
  }
}

interface ElementsCatalogProps {
  onClose?: () => void
}

export function ElementsCatalog({ onClose }: ElementsCatalogProps) {
  const [activeCategory, setActiveCategory] = useState<ElementCategory>('furniture')
  const [search, setSearch] = useState('')

  const filtered = ELEMENT_CATALOG.filter(el => {
    if (search) return el.label.toLowerCase().includes(search.toLowerCase())
    return el.category === activeCategory
  })

  const handleDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData('element-type', type)
    e.dataTransfer.effectAllowed = 'copy'
  }

  return (
    <div className="w-full h-full flex flex-col bg-white border-r border-rule/10">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-rule/10">
        <h2 className="text-sm font-medium text-ink tracking-tight">Elements</h2>
        {onClose && (
          <button onClick={onClose} className="text-ink-muted hover:text-ink transition-colors md:hidden">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        )}
      </div>

      {/* Search */}
      <div className="px-3 py-2">
        <div className="relative">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-muted" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search elements..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-paper rounded-md border border-rule/10 focus:outline-none focus:border-lavender/40 transition-colors"
          />
        </div>
      </div>

      {/* Category tabs */}
      {!search && (
        <div className="flex gap-0.5 px-3 py-1 overflow-x-auto">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 text-[11px] rounded-md whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-lavender/10 text-lavender font-medium'
                  : 'text-ink-muted hover:text-ink hover:bg-ink/[0.03]'
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      )}

      {/* Element grid */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        <div className="grid grid-cols-2 gap-2">
          {filtered.map(el => (
            <div
              key={el.type}
              draggable
              onDragStart={(e) => handleDragStart(e, el.type)}
              className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-rule/10 bg-paper/50 hover:border-lavender/30 hover:bg-lavender/[0.04] cursor-grab active:cursor-grabbing transition-all group"
            >
              <div className="w-8 h-8 flex items-center justify-center text-ink-muted group-hover:text-lavender transition-colors">
                <ElementIcon icon={el.icon} size={22} />
              </div>
              <span className="text-[10px] text-ink-muted text-center leading-tight group-hover:text-ink transition-colors">
                {el.label}
              </span>
              <span className="text-[9px] text-ink-muted/60 font-mono">
                ${el.defaultCost}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Tip */}
      <div className="px-4 py-3 border-t border-rule/10 bg-paper/30">
        <p className="text-[10px] text-ink-muted leading-relaxed">
          Drag elements onto the floor plan to place them. Click to select, then rotate or delete.
        </p>
      </div>
    </div>
  )
}
