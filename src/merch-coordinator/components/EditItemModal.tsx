import { useState, useRef } from 'react'
import type { SwagItem, ItemCategory } from '../types'

interface EditItemModalProps {
  item: SwagItem
  onSave: (id: string, updates: Partial<Omit<SwagItem, 'id'>>) => void
  onClose: () => void
}

const categories: { value: ItemCategory; label: string }[] = [
  { value: 'apparel', label: 'Apparel' },
  { value: 'tech', label: 'Tech' },
  { value: 'drinkware', label: 'Drinkware' },
  { value: 'stationery', label: 'Stationery' },
  { value: 'food', label: 'Food' },
  { value: 'travel', label: 'Travel' },
  { value: 'wellness', label: 'Wellness' },
  { value: 'bags', label: 'Bags' },
  { value: 'accessories', label: 'Accessories' },
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

export function EditItemModal({ item, onSave, onClose }: EditItemModalProps) {
  const [name, setName] = useState(item.name)
  const [brand, setBrand] = useState(item.brand || '')
  const [link, setLink] = useState(item.link || '')
  const [cost, setCost] = useState(item.unitCost > 0 ? String(item.unitCost) : '')
  const [category, setCategory] = useState<ItemCategory>(item.category)
  const [imageUrl, setImageUrl] = useState<string | null>(item.imageUrl)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const dataUrl = await resizeImage(file, 200)
      setImageUrl(dataUrl)
    } catch { /* ignore */ }
  }

  const handleSave = () => {
    if (!name.trim()) return
    onSave(item.id, {
      name: name.trim(),
      brand: brand.trim() || undefined,
      link: link.trim() || undefined,
      unitCost: parseFloat(cost) || 0,
      category,
      imageUrl,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-ink/20 backdrop-blur-[1px]" />
      <div
        className="relative w-full max-w-sm bg-paper rounded-2xl border border-rule/10 shadow-xl p-5 space-y-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-ink">Edit Item</h3>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded-full text-ink-muted hover:text-ink hover:bg-ink/5 transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-16 h-16 flex-shrink-0 rounded-lg border border-dashed border-rule/20 bg-ink/[0.02] flex items-center justify-center overflow-hidden hover:border-lavender/40 transition-colors"
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

        <div className="grid grid-cols-2 gap-2">
          <input
            value={brand}
            onChange={e => setBrand(e.target.value)}
            placeholder="Brand"
            className="px-2.5 py-1.5 text-sm bg-transparent border border-rule/10 rounded-md focus:outline-none focus:border-lavender/50 focus:ring-1 focus:ring-lavender/20 placeholder:text-ink-muted/50"
          />
          <input
            value={link}
            onChange={e => setLink(e.target.value)}
            placeholder="Link (URL)"
            type="url"
            className="px-2.5 py-1.5 text-sm bg-transparent border border-rule/10 rounded-md focus:outline-none focus:border-lavender/50 focus:ring-1 focus:ring-lavender/20 placeholder:text-ink-muted/50"
          />
        </div>

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

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="flex-1 px-3 py-2 text-xs font-medium text-white bg-lavender rounded-lg hover:bg-lavender/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Save Changes
          </button>
          <button onClick={onClose} className="px-3 py-2 text-xs text-ink-muted hover:text-ink transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
