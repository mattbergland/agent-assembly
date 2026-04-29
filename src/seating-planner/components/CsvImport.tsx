import { useRef, useState } from 'react'
import Papa from 'papaparse'
import type { Guest } from '../types'

interface CsvImportProps {
  onImport: (guests: Omit<Guest, 'id'>[]) => void
}

export function CsvImport({ onImport }: CsvImportProps) {
  const [textMode, setTextMode] = useState(false)
  const [textValue, setTextValue] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const parseCSV = (text: string) => {
    const result = Papa.parse(text, { header: true, skipEmptyLines: true })
    const guests: Omit<Guest, 'id'>[] = (result.data as Record<string, string>[]).map((row) => ({
      name: row['name'] || row['Name'] || row['Full Name'] || row['full_name'] || '',
      title: row['title'] || row['Title'] || row['Job Title'] || row['job_title'] || '',
      company: row['company'] || row['Company'] || row['Organization'] || row['organization'] || '',
      photoUrl: row['photo'] || row['Photo'] || row['photo_url'] || row['avatar'] || null,
    })).filter((g) => g.name.trim())
    if (guests.length > 0) onImport(guests)
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => parseCSV(reader.result as string)
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleTextImport = () => {
    if (!textValue.trim()) return
    const lines = textValue.trim().split('\n').filter(l => l.trim())
    const hasCommas = lines.some(l => l.includes(','))
    if (hasCommas) {
      parseCSV(textValue)
    } else {
      const guests: Omit<Guest, 'id'>[] = lines.map(line => ({
        name: line.trim(),
        title: '',
        company: '',
        photoUrl: null,
      }))
      if (guests.length > 0) onImport(guests)
    }
    setTextValue('')
    setTextMode(false)
  }

  return (
    <div className="space-y-2">
      {textMode ? (
        <div className="space-y-2">
          <textarea
            value={textValue}
            onChange={e => setTextValue(e.target.value)}
            placeholder={"Paste names (one per line) or CSV data:\n\nname,title,company\nJane Doe,CEO,Acme Corp\nJohn Smith,CTO,Widget Inc"}
            className="w-full h-32 px-3 py-2 text-sm bg-white border border-rule/10 rounded-lg focus:outline-none focus:border-lavender/50 focus:ring-1 focus:ring-lavender/20 placeholder:text-ink-muted/50 resize-none font-mono"
          />
          <div className="flex gap-2">
            <button
              onClick={handleTextImport}
              className="flex-1 px-3 py-1.5 text-xs font-medium text-lavender border border-lavender/30 rounded-lg hover:bg-lavender/5 transition-colors"
            >
              Import
            </button>
            <button
              onClick={() => { setTextMode(false); setTextValue('') }}
              className="px-3 py-1.5 text-xs text-ink-muted hover:text-ink transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={() => fileRef.current?.click()}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-ink-muted border border-dashed border-rule/15 rounded-lg hover:border-lavender/30 hover:text-lavender transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Upload CSV
          </button>
          <button
            onClick={() => setTextMode(true)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-ink-muted border border-dashed border-rule/15 rounded-lg hover:border-lavender/30 hover:text-lavender transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            Paste List
          </button>
          <input ref={fileRef} type="file" accept=".csv,.txt" onChange={handleFile} className="hidden" />
        </div>
      )}
    </div>
  )
}
