import { useState } from 'react'
import type { TableShape } from '../types'

interface AddTableDialogProps {
  tableCount: number
  onAdd: (name: string, seats: number, shape: TableShape) => void
  onClose: () => void
}

const SHAPES: { value: TableShape; label: string; icon: string; description: string }[] = [
  { value: 'round', label: 'Round', icon: '○', description: 'Classic round table' },
  { value: 'rectangular', label: 'Rectangular', icon: '▭', description: 'Standard rectangle' },
  { value: 'u-shape', label: 'U-Shape', icon: '⊔', description: 'Open on one side' },
  { value: 'classroom', label: 'Classroom', icon: '⊏', description: 'All seats on one side' },
  { value: 'boardroom', label: 'Boardroom', icon: '⊡', description: 'Long conference table' },
  { value: 'banquet', label: 'Banquet', icon: '═', description: 'Long feast-style rows' },
  { value: 'hollow-square', label: 'Hollow Square', icon: '□', description: 'Open center, 4 sides' },
]

export function AddTableDialog({ tableCount, onAdd, onClose }: AddTableDialogProps) {
  const [name, setName] = useState(`Table ${tableCount + 1}`)
  const [seats, setSeats] = useState(8)
  const [shape, setShape] = useState<TableShape>('round')

  const presets = [
    { label: '4', seats: 4 },
    { label: '6', seats: 6 },
    { label: '8', seats: 8 },
    { label: '10', seats: 10 },
    { label: '12', seats: 12 },
    { label: '16', seats: 16 },
    { label: '20', seats: 20 },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onAdd(name.trim(), seats, shape)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/20" onClick={onClose}>
      <div className="bg-paper border border-rule/10 rounded-xl shadow-lg p-6 w-96 space-y-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <h3 className="text-sm font-medium tracking-tight text-ink">Add Table</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Table name"
            className="w-full px-3 py-2 text-sm bg-white border border-rule/10 rounded-lg focus:outline-none focus:border-lavender/50 focus:ring-1 focus:ring-lavender/20"
            autoFocus
          />

          <div>
            <label className="text-xs text-ink-muted mb-2 block">Layout</label>
            <div className="grid grid-cols-2 gap-2">
              {SHAPES.map(s => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setShape(s.value)}
                  className={`flex items-center gap-2.5 px-3 py-2 text-left rounded-lg border transition-colors ${
                    shape === s.value
                      ? 'border-lavender bg-lavender/10'
                      : 'border-rule/10 hover:border-lavender/30'
                  }`}
                >
                  <span className={`text-lg leading-none ${shape === s.value ? 'text-lavender' : 'text-ink-muted'}`}>{s.icon}</span>
                  <div>
                    <p className={`text-xs font-medium ${shape === s.value ? 'text-lavender' : 'text-ink-soft'}`}>{s.label}</p>
                    <p className="text-[10px] text-ink-muted leading-tight">{s.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-ink-muted mb-2 block">Seats</label>
            <div className="flex flex-wrap gap-1.5">
              {presets.map(p => (
                <button
                  key={p.seats}
                  type="button"
                  onClick={() => setSeats(p.seats)}
                  className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                    seats === p.seats
                      ? 'border-lavender bg-lavender/10 text-lavender font-medium'
                      : 'border-rule/10 text-ink-muted hover:border-lavender/30'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-lavender rounded-lg hover:bg-lavender/90 transition-colors"
            >
              Add Table
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-ink-muted hover:text-ink border border-rule/10 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
