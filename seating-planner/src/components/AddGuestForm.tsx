import { useState, useRef } from 'react'
import type { Guest } from '../types'

interface AddGuestFormProps {
  onAdd: (guest: Omit<Guest, 'id'>) => void
  editGuest?: Guest | null
  onUpdate?: (id: string, data: Partial<Guest>) => void
  onCancel?: () => void
}

export function AddGuestForm({ onAdd, editGuest, onUpdate, onCancel }: AddGuestFormProps) {
  const [name, setName] = useState(editGuest?.name ?? '')
  const [title, setTitle] = useState(editGuest?.title ?? '')
  const [company, setCompany] = useState(editGuest?.company ?? '')
  const [photoUrl, setPhotoUrl] = useState(editGuest?.photoUrl ?? '')
  const fileRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    if (editGuest && onUpdate) {
      onUpdate(editGuest.id, { name: name.trim(), title: title.trim(), company: company.trim(), photoUrl: photoUrl || null })
      onCancel?.()
    } else {
      onAdd({ name: name.trim(), title: title.trim(), company: company.trim(), photoUrl: photoUrl || null })
      setName('')
      setTitle('')
      setCompany('')
      setPhotoUrl('')
    }
  }

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setPhotoUrl(reader.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="w-10 h-10 rounded-full bg-lavender/10 border border-dashed border-lavender/30 flex items-center justify-center flex-shrink-0 hover:bg-lavender/20 transition-colors overflow-hidden"
        >
          {photoUrl ? (
            <img src={photoUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8E7DBE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          )}
        </button>
        <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Name *"
          className="flex-1 px-3 py-2 text-sm bg-white border border-rule/10 rounded-lg focus:outline-none focus:border-lavender/50 focus:ring-1 focus:ring-lavender/20 placeholder:text-ink-muted/50"
          required
        />
      </div>
      <div className="flex gap-2">
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Title"
          className="flex-1 px-3 py-2 text-sm bg-white border border-rule/10 rounded-lg focus:outline-none focus:border-lavender/50 focus:ring-1 focus:ring-lavender/20 placeholder:text-ink-muted/50"
        />
        <input
          value={company}
          onChange={e => setCompany(e.target.value)}
          placeholder="Company"
          className="flex-1 px-3 py-2 text-sm bg-white border border-rule/10 rounded-lg focus:outline-none focus:border-lavender/50 focus:ring-1 focus:ring-lavender/20 placeholder:text-ink-muted/50"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 px-4 py-2 text-sm font-medium text-white bg-lavender rounded-lg hover:bg-lavender/90 transition-colors"
        >
          {editGuest ? 'Update' : 'Add Guest'}
        </button>
        {editGuest && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm text-ink-muted hover:text-ink border border-rule/10 rounded-lg transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
