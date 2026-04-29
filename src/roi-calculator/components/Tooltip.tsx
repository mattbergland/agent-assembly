import { useState, useRef } from 'react'
import { Info } from 'lucide-react'

export default function Tooltip({ text }: { text: string }) {
  const [visible, setVisible] = useState(false)
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const show = () => {
    if (timeout.current) clearTimeout(timeout.current)
    setVisible(true)
  }
  const hide = () => {
    timeout.current = setTimeout(() => setVisible(false), 150)
  }

  return (
    <span className="relative inline-flex ml-1.5 align-middle">
      <button
        type="button"
        className="text-ink-muted/40 hover:text-lavender transition-colors duration-150 focus:outline-none"
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        tabIndex={-1}
        aria-label="More info"
      >
        <Info size={12} />
      </button>
      {visible && (
        <span className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 px-3 py-2 text-[11px] leading-relaxed text-paper bg-ink rounded shadow-lg pointer-events-none animate-in fade-in-0 zoom-in-95 duration-150">
          {text}
          <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-ink" />
        </span>
      )}
    </span>
  )
}
