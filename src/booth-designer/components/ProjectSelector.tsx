import { useState } from 'react'
import type { BoothProject } from '../types'

interface ProjectSelectorProps {
  projects: BoothProject[]
  activeProject: BoothProject | null
  onSwitch: (id: string) => void
  onCreate: (name: string) => string
  onRename: (id: string, name: string) => void
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
}

export function ProjectSelector({
  projects,
  activeProject,
  onSwitch,
  onCreate,
  onRename,
  onDelete,
  onDuplicate,
}: ProjectSelectorProps) {
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  const handleCreate = () => {
    onCreate('Untitled Booth')
    setOpen(false)
  }

  const startRename = (id: string, currentName: string) => {
    setEditingId(id)
    setEditName(currentName)
  }

  const commitRename = () => {
    if (editingId && editName.trim()) {
      onRename(editingId, editName.trim())
    }
    setEditingId(null)
  }

  if (projects.length === 0) return null

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1 text-xs border border-rule/10 rounded-md hover:border-lavender/30 transition-colors max-w-[180px]"
      >
        <span className="truncate">{activeProject?.name ?? 'Select project'}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full right-0 mt-1 w-64 bg-white rounded-lg border border-rule/10 shadow-lg z-50 py-1">
            {projects.map(p => (
              <div
                key={p.id}
                className={`flex items-center gap-2 px-3 py-2 hover:bg-paper transition-colors ${
                  p.id === activeProject?.id ? 'bg-lavender/[0.06]' : ''
                }`}
              >
                {editingId === p.id ? (
                  <input
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    onBlur={commitRename}
                    onKeyDown={e => e.key === 'Enter' && commitRename()}
                    className="flex-1 px-1.5 py-0.5 text-xs border border-lavender/40 rounded focus:outline-none"
                    autoFocus
                  />
                ) : (
                  <button
                    onClick={() => { onSwitch(p.id); setOpen(false) }}
                    className="flex-1 text-left text-xs truncate"
                  >
                    {p.name}
                  </button>
                )}
                <div className="flex items-center gap-0.5">
                  <button
                    onClick={() => startRename(p.id, p.name)}
                    className="p-1 text-ink-muted hover:text-ink transition-colors"
                    title="Rename"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg>
                  </button>
                  <button
                    onClick={() => onDuplicate(p.id)}
                    className="p-1 text-ink-muted hover:text-ink transition-colors"
                    title="Duplicate"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                  </button>
                  {projects.length > 1 && (
                    <button
                      onClick={() => { onDelete(p.id); if (projects.length <= 1) setOpen(false) }}
                      className="p-1 text-ink-muted hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div className="border-t border-rule/10 mt-1 pt-1">
              <button
                onClick={handleCreate}
                className="w-full px-3 py-2 text-xs text-lavender hover:bg-lavender/[0.04] text-left transition-colors"
              >
                + New booth design
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
