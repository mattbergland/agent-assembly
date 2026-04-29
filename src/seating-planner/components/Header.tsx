import { Logo } from './Logo'

interface HeaderProps {
  guestCount: number
  seatedCount: number
  tableCount: number
  onClearAll: () => void
}

export function Header({ guestCount, seatedCount, tableCount, onClearAll }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-rule/10">
      <div className="flex items-center gap-3">
        <Logo />
        <h1 className="text-lg font-medium tracking-tight text-ink">Seating Planner</h1>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 text-sm text-ink-muted">
          <span>{guestCount} guest{guestCount !== 1 ? 's' : ''}</span>
          <span className="text-rule/20">|</span>
          <span>{seatedCount} seated</span>
          <span className="text-rule/20">|</span>
          <span>{tableCount} table{tableCount !== 1 ? 's' : ''}</span>
        </div>
        {guestCount > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs text-ink-muted hover:text-ink transition-colors"
          >
            Clear all
          </button>
        )}
      </div>
    </header>
  )
}
