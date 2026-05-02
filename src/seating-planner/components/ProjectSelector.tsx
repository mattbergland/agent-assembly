import { useState, useRef, useEffect } from 'react'
import type { Project } from '../types'

interface ProjectSelectorProps {
  projects: Project[]
  activeProject: Project | null
  onSwitch: (id: string) => void
  onCreate: (name: string) => void
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
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [showNewInput, setShowNewInput] = useState(false)
  const [newName, setNewName] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const editInputRef = useRef<HTMLInputElement>(null)
  const newInputRef = useRef<HTMLInputElement>(null)
  const shouldCommitRename = useRef(true)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setEditingId(null)
        setShowNewInput(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (editingId && editInputRef.current) editInputRef.current.focus()
  }, [editingId])

  useEffect(() => {
    if (showNewInput && newInputRef.current) newInputRef.current.focus()
  }, [showNewInput])

  const handleStartRename = (project: Project) => {
    shouldCommitRename.current = true
    setEditingId(project.id)
    setEditName(project.name)
  }

  const handleFinishRename = () => {
    if (shouldCommitRename.current && editingId && editName.trim()) {
      onRename(editingId, editName.trim())
    }
    setEditingId(null)
  }

  const handleCreateProject = () => {
    const name = newName.trim() || 'Untitled Event'
    onCreate(name)
    setNewName('')
    setShowNewInput(false)
    setIsOpen(false)
  }

  if (!activeProject && projects.length === 0) {
    return (
      <button
        onClick={() => onCreate('Untitled Event')}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-lavender border border-lavender/30 rounded-lg hover:bg-lavender/5 transition-colors"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M12 5v14" /><path d="M5 12h14" />
        </svg>
        New Event
      </button>
    )
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-ink hover:text-lavender border border-rule/10 rounded-lg hover:border-lavender/30 transition-colors bg-white max-w-[240px]"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-ink-muted">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
        <span className="truncate">{activeProject?.name ?? 'Select event'}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-ink-muted">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-72 bg-white border border-rule/10 rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="p-2 border-b border-rule/10">
            <p className="text-[10px] font-medium text-ink-muted uppercase tracking-wider px-2 py-1">
              Events
            </p>
          </div>

          <div className="max-h-64 overflow-y-auto p-1">
            {projects.map(project => (
              <div
                key={project.id}
                className={`group flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer transition-colors ${
                  project.id === activeProject?.id
                    ? 'bg-lavender/10 text-ink'
                    : 'hover:bg-ink/[0.03] text-ink-muted'
                }`}
              >
                {editingId === project.id ? (
                  <input
                    ref={editInputRef}
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    onBlur={handleFinishRename}
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleFinishRename()
                      if (e.key === 'Escape') { shouldCommitRename.current = false; setEditingId(null) }
                    }}
                    className="flex-1 text-sm bg-transparent border-b border-lavender/40 focus:outline-none px-0 py-0"
                  />
                ) : (
                  <button
                    onClick={() => { onSwitch(project.id); setIsOpen(false) }}
                    className="flex-1 text-left text-sm truncate"
                  >
                    {project.name}
                  </button>
                )}

                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleStartRename(project) }}
                    className="p-1 rounded hover:bg-ink/[0.06] text-ink-muted hover:text-ink transition-colors"
                    title="Rename"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDuplicate(project.id) }}
                    className="p-1 rounded hover:bg-ink/[0.06] text-ink-muted hover:text-ink transition-colors"
                    title="Duplicate"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  </button>
                  {projects.length > 1 && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onDelete(project.id) }}
                      className="p-1 rounded hover:bg-red-50 text-ink-muted hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="p-2 border-t border-rule/10">
            {showNewInput ? (
              <div className="flex items-center gap-2 px-2">
                <input
                  ref={newInputRef}
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleCreateProject()
                    if (e.key === 'Escape') { setShowNewInput(false); setNewName('') }
                  }}
                  placeholder="Event name..."
                  className="flex-1 text-sm bg-transparent border-b border-lavender/40 focus:outline-none px-0 py-1 placeholder:text-ink-muted/50"
                />
                <button
                  onClick={handleCreateProject}
                  className="text-xs font-medium text-lavender hover:text-lavender/80 transition-colors"
                >
                  Create
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowNewInput(true)}
                className="flex items-center gap-2 w-full px-2 py-1.5 text-sm text-ink-muted hover:text-lavender rounded-lg hover:bg-lavender/5 transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M12 5v14" /><path d="M5 12h14" />
                </svg>
                New Event
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
