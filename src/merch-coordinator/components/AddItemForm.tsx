import { useState, useRef } from 'react'
import type { SwagItem, ItemCategory } from '../types'

interface AddItemFormProps {
  onAdd: (item: Omit<SwagItem, 'id'>) => void
}

const categories: { value: ItemCategory; label: string }[] = [
  { value: 'apparel', label: 'Apparel' },
  { value: 'tech', label: 'Tech' },
  { value: 'drinkware', label: 'Drinkware' },
  { value: 'stationery', label: 'Stationery' },
  { value: 'food', label: 'Food' },
  { value: 'custom', label: 'Custom' },
]

function resizeImage(file: File, maxSize: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let w = img.width
        let h = img.height
        if (w > maxSize || h > maxSize) {
          if (w > h) { h = (h / w) * maxSize; w = maxSize }
          else { w = (w / h) * maxSize; h = maxSize }
        }
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        if (!ctx) { reject(new Error('Canvas not supported')); return }
        ctx.drawImage(img, 0, 0, w, h)
        resolve(canvas.toDataURL('image/jpeg', 0.8))
      }
      img.onerror = reject
      img.src = reader.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function AddItemForm({ onAdd }: AddItemFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [category, setCategory] = useState<ItemCategory>('custom')
  const [cost, setCost] = useState('')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const dataUrl = await resizeImage(file, 200)
      setImageUrl(dataUrl)
    } catch {
      /* ignore */
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onAdd({
      name: name.trim(),
      imageUrl,
      category,
      unitCost: parseFloat(cost) || 0,
    })
    setName('')
    setCost('')
    setImageUrl(null)
    setCategory('custom')
    if (fileRef.current) fileRef.current.value = ''
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-lavender border border-dashed border-lavender/30 rounded-lg hover:bg-lavender/5 transition-colors"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
        Add Item
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-3 rounded-lg border border-rule/10 bg-white">
      {/* Image upload */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="w-14 h-14 flex-shrink-0 rounded-lg border border-dashed border-rule/20 bg-ink/[0.02] flex items-center justify-center overflow-hidden hover:border-lavender/40 transition-colors"
        >
          {imageUrl ? (
            <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink-muted/40">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          )}
        </button>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        <div className="flex-1 space-y-2">
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Item name"
            autoFocus
            className="w-full px-2.5 py-1.5 text-sm bg-transparent border border-rule/10 rounded-md focus:outline-none focus:border-lavender/50 focus:ring-1 focus:ring-lavender/20 placeholder:text-ink-muted/50"
          />
          <input
            value={cost}
            onChange={e => setCost(e.target.value)}
            placeholder="Cost (e.g. 12.50)"
            type="number"
            step="0.01"
            min="0"
            className="w-full px-2.5 py-1.5 text-sm bg-transparent border border-rule/10 rounded-md focus:outline-none focus:border-lavender/50 focus:ring-1 focus:ring-lavender/20 placeholder:text-ink-muted/50"
          />
        </div>
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-1.5">
        {categories.map(c => (
          <button
            key={c.value}
            type="button"
            onClick={() => setCategory(c.value)}
            className={`text-[10px] font-medium px-2 py-1 rounded-full transition-colors ${
              category === c.value
                ? 'bg-lavender text-white'
                : 'bg-ink/[0.04] text-ink-muted hover:bg-ink/[0.08]'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={!name.trim()}
          className="flex-1 px-3 py-1.5 text-xs font-medium text-white bg-lavender rounded-md hover:bg-lavender/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Add
        </button>
        <button
          type="button"
          onClick={() => { setIsOpen(false); setName(''); setCost(''); setImageUrl(null) }}
          className="px-3 py-1.5 text-xs text-ink-muted hover:text-ink transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
