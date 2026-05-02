import { useState, useRef, useCallback, useEffect } from 'react'
import type { SwagItem, ItemCategory } from '../types'

interface ScreenshotImportProps {
  onAdd: (item: Omit<SwagItem, 'id'>) => void
  onCancel: () => void
}

const API_KEY_STORAGE = 'merch-coordinator-openai-key'

const categories: { value: ItemCategory; label: string }[] = [
  { value: 'apparel', label: 'Apparel' },
  { value: 'tech', label: 'Tech' },
  { value: 'drinkware', label: 'Drinkware' },
  { value: 'stationery', label: 'Stationery' },
  { value: 'food', label: 'Food' },
  { value: 'custom', label: 'Custom' },
]

interface ExtractedData {
  name: string
  cost: number
  category: ItemCategory
}

type ImportState =
  | { step: 'paste' }
  | { step: 'processing'; imageUrl: string }
  | { step: 'review'; imageUrl: string; data: ExtractedData }
  | { step: 'error'; message: string; imageUrl?: string }
  | { step: 'api_key' }

function resizeForAI(dataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const maxSize = 1024
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
      resolve(canvas.toDataURL('image/jpeg', 0.85))
    }
    img.onerror = reject
    img.src = dataUrl
  })
}

function resizeForThumbnail(dataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const maxSize = 200
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
    img.src = dataUrl
  })
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function ScreenshotImport({ onAdd, onCancel }: ScreenshotImportProps) {
  const [state, setState] = useState<ImportState>({ step: 'paste' })
  const [editName, setEditName] = useState('')
  const [editCost, setEditCost] = useState('')
  const [editCategory, setEditCategory] = useState<ItemCategory>('custom')
  const [apiKey, setApiKey] = useState('')
  const [isDragOver, setIsDragOver] = useState(false)
  const dropRef = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const processScreenshot = useCallback(async (dataUrl: string) => {
    const aiImage = await resizeForAI(dataUrl)
    setState({ step: 'processing', imageUrl: dataUrl })

    const storedKey = localStorage.getItem(API_KEY_STORAGE)
    const body: { image: string; apiKey?: string } = { image: aiImage }
    if (storedKey) body.apiKey = storedKey

    try {
      const res = await fetch('/api/extract-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const json = await res.json()

      if (json.error === 'no_api_key') {
        setState({ step: 'api_key' })
        return
      }

      if (!res.ok) {
        setState({ step: 'error', message: json.message || json.error || 'Failed to extract details', imageUrl: dataUrl })
        return
      }

      const data: ExtractedData = {
        name: json.name || '',
        cost: typeof json.cost === 'number' ? json.cost : parseFloat(json.cost) || 0,
        category: json.category || 'custom',
      }

      setEditName(data.name)
      setEditCost(data.cost > 0 ? String(data.cost) : '')
      setEditCategory(data.category)
      setState({ step: 'review', imageUrl: dataUrl, data })
    } catch {
      setState({ step: 'error', message: 'Network error — check your connection', imageUrl: dataUrl })
    }
  }, [])

  // Handle clipboard paste
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (state.step !== 'paste') return
      const items = e.clipboardData?.items
      if (!items) return

      for (const item of items) {
        if (item.type.startsWith('image/')) {
          e.preventDefault()
          const file = item.getAsFile()
          if (file) {
            readFileAsDataUrl(file).then(processScreenshot)
          }
          return
        }
      }
    }

    document.addEventListener('paste', handlePaste)
    return () => document.removeEventListener('paste', handlePaste)
  }, [state.step, processScreenshot])

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    if (state.step !== 'paste') return
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      readFileAsDataUrl(file).then(processScreenshot)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      readFileAsDataUrl(file).then(processScreenshot)
    }
  }

  const handleApiKeySubmit = () => {
    if (!apiKey.trim()) return
    localStorage.setItem(API_KEY_STORAGE, apiKey.trim())
    setState({ step: 'paste' })
    setApiKey('')
  }

  const handleConfirm = async () => {
    if (state.step !== 'review' || !editName.trim()) return
    const thumbnail = await resizeForThumbnail(state.imageUrl)
    onAdd({
      name: editName.trim(),
      unitCost: parseFloat(editCost) || 0,
      category: editCategory,
      imageUrl: thumbnail,
    })
  }

  // API key setup screen
  if (state.step === 'api_key') {
    return (
      <div className="space-y-3 p-3 rounded-lg border border-amber-200 bg-amber-50/50">
        <div className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-500 flex-shrink-0">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3" />
          </svg>
          <p className="text-xs text-amber-800 font-medium">OpenAI API Key Required</p>
        </div>
        <p className="text-[11px] text-amber-700/80">
          Screenshot import uses GPT-4o mini to read product details. Paste your OpenAI API key below — it&apos;s stored locally in your browser.
        </p>
        <input
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
          placeholder="sk-..."
          type="password"
          autoFocus
          className="w-full px-2.5 py-1.5 text-xs bg-white border border-amber-200 rounded-md focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-200 placeholder:text-amber-300 font-mono"
        />
        <div className="flex items-center gap-2">
          <button
            onClick={handleApiKeySubmit}
            disabled={!apiKey.trim()}
            className="flex-1 px-3 py-1.5 text-xs font-medium text-white bg-amber-500 rounded-md hover:bg-amber-600 transition-colors disabled:opacity-40"
          >
            Save Key
          </button>
          <button onClick={onCancel} className="px-3 py-1.5 text-xs text-ink-muted hover:text-ink transition-colors">
            Cancel
          </button>
        </div>
      </div>
    )
  }

  // Paste / drop zone
  if (state.step === 'paste') {
    return (
      <div className="space-y-2">
        <div
          ref={dropRef}
          onDragOver={e => { e.preventDefault(); setIsDragOver(true) }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={`relative flex flex-col items-center justify-center gap-2 p-5 rounded-lg border-2 border-dashed transition-colors cursor-pointer ${
            isDragOver
              ? 'border-lavender bg-lavender/5'
              : 'border-rule/20 hover:border-lavender/40 bg-ink/[0.01]'
          }`}
          onClick={() => fileRef.current?.click()}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-lavender/50">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          <div className="text-center">
            <p className="text-xs font-medium text-ink-muted">Paste or drop a screenshot</p>
            <p className="text-[10px] text-ink-muted/60 mt-0.5">⌘V to paste · or click to browse</p>
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
        </div>
        <button onClick={onCancel} className="w-full px-3 py-1.5 text-xs text-ink-muted hover:text-ink transition-colors">
          Cancel
        </button>
      </div>
    )
  }

  // Processing state
  if (state.step === 'processing') {
    return (
      <div className="space-y-3 p-3 rounded-lg border border-rule/10 bg-white">
        <div className="relative rounded-lg overflow-hidden">
          <img src={state.imageUrl} alt="Screenshot" className="w-full h-24 object-cover opacity-50" />
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[2px]">
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-lavender animate-spin">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              <span className="text-xs font-medium text-ink-muted">Reading screenshot...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (state.step === 'error') {
    return (
      <div className="space-y-3 p-3 rounded-lg border border-red-200 bg-red-50/50">
        <p className="text-xs text-red-700">{state.message}</p>
        <div className="flex items-center gap-2">
          {state.imageUrl && (
            <button
              onClick={() => processScreenshot(state.imageUrl!)}
              className="flex-1 px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-md hover:bg-red-50 transition-colors"
            >
              Retry
            </button>
          )}
          <button onClick={onCancel} className="px-3 py-1.5 text-xs text-ink-muted hover:text-ink transition-colors">
            Cancel
          </button>
        </div>
      </div>
    )
  }

  // Review extracted data
  return (
    <div className="space-y-3 p-3 rounded-lg border border-lavender/20 bg-white">
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-ink/[0.02]">
          <img src={state.imageUrl} alt="Product" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 space-y-2">
          <input
            value={editName}
            onChange={e => setEditName(e.target.value)}
            placeholder="Item name"
            autoFocus
            className="w-full px-2.5 py-1.5 text-sm bg-transparent border border-rule/10 rounded-md focus:outline-none focus:border-lavender/50 focus:ring-1 focus:ring-lavender/20 placeholder:text-ink-muted/50"
          />
          <input
            value={editCost}
            onChange={e => setEditCost(e.target.value)}
            placeholder="Cost (e.g. 12.50)"
            type="number"
            step="0.01"
            min="0"
            className="w-full px-2.5 py-1.5 text-sm bg-transparent border border-rule/10 rounded-md focus:outline-none focus:border-lavender/50 focus:ring-1 focus:ring-lavender/20 placeholder:text-ink-muted/50"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {categories.map(c => (
          <button
            key={c.value}
            type="button"
            onClick={() => setEditCategory(c.value)}
            className={`text-[10px] font-medium px-2 py-1 rounded-full transition-colors ${
              editCategory === c.value
                ? 'bg-lavender text-white'
                : 'bg-ink/[0.04] text-ink-muted hover:bg-ink/[0.08]'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleConfirm}
          disabled={!editName.trim()}
          className="flex-1 px-3 py-1.5 text-xs font-medium text-white bg-lavender rounded-md hover:bg-lavender/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Add Item
        </button>
        <button onClick={onCancel} className="px-3 py-1.5 text-xs text-ink-muted hover:text-ink transition-colors">
          Cancel
        </button>
      </div>
    </div>
  )
}
