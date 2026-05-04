import type { ViewMode } from '../types'

interface ViewModeBarProps {
  viewMode: ViewMode
  onSetViewMode: (mode: ViewMode) => void
}

export function ViewModeBar({ viewMode, onSetViewMode }: ViewModeBarProps) {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 bg-white rounded-xl border border-rule/10 shadow-lg px-1.5 py-1.5">
      <ViewTab
        active={viewMode === 'floor'}
        onClick={() => onSetViewMode('floor')}
        label="Floor view"
        icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18M9 21V9" />
          </svg>
        }
      />
      <ViewTab
        active={viewMode === 'walkthrough'}
        onClick={() => onSetViewMode('walkthrough')}
        label="Walk-through"
        icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="5" r="2" />
            <path d="M10 22V17L7 12l3-4h4l3 4-3 5v5" />
          </svg>
        }
      />
      <ViewTab
        active={viewMode === '3d'}
        onClick={() => onSetViewMode('3d')}
        label="3D view"
        icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        }
      />
      <ViewTab
        active={viewMode === 'itemlist'}
        onClick={() => onSetViewMode('itemlist')}
        label="Item list"
        icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
        }
      />
    </div>
  )
}

function ViewTab({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean
  onClick: () => void
  label: string
  icon: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
        active
          ? 'bg-lavender/10 text-lavender font-medium shadow-sm'
          : 'text-ink-muted hover:text-ink hover:bg-paper'
      }`}
      title={label}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  )
}
