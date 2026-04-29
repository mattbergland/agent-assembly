import { useState, useCallback } from 'react'
import WebGLConstellation from './components/WebGLConstellation'
import Calculator from './components/Calculator'
import EventLibrary from './components/EventLibrary'
import CompareView from './components/CompareView'
import Logo from './components/Logo'
import type { SavedEvent } from './utils/storage'
import { loadAllEvents } from './utils/storage'

type View = 'calculator' | 'compare'

export default function App() {
  const [view, setView] = useState<View>('calculator')
  const [activeEventId, setActiveEventId] = useState<string | null>(null)
  const [savedEvents, setSavedEvents] = useState<SavedEvent[]>(() => loadAllEvents())
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const refreshEvents = useCallback(() => {
    setSavedEvents(loadAllEvents())
  }, [])

  const handleLoadEvent = useCallback((id: string) => {
    setActiveEventId(id)
    setView('calculator')
    setSidebarOpen(false)
  }, [])

  const handleNewEvent = useCallback(() => {
    setActiveEventId(null)
    setView('calculator')
    setSidebarOpen(false)
  }, [])

  const handleCompare = useCallback(() => {
    setView('compare')
    setSidebarOpen(false)
  }, [])

  return (
    <div className="relative min-h-screen flex flex-col">
      <WebGLConstellation />

      <div className="relative z-10 flex flex-col min-h-screen pointer-events-none">
        {/* Header */}
        <header className="flex items-center justify-between px-6 md:px-10 py-5 pointer-events-auto">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="text-sm font-medium tracking-tight text-ink">
              Event ROI
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-xs text-ink-muted hover:text-lavender transition-colors duration-200 tracking-wide"
            >
              {sidebarOpen ? 'Close' : 'My Events'}
            </button>
            <a
              href="mailto:hello@mattberg.land"
              className="text-xs text-ink-muted hover:text-lavender transition-colors duration-200 tracking-wide"
            >
              Contact
            </a>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 flex items-start justify-center px-4 md:px-10 py-6 pointer-events-auto">
          <div className="w-full max-w-5xl flex gap-6">
            {/* Calculator / Compare area */}
            <div className={`${sidebarOpen ? 'flex-1 min-w-0' : 'w-full max-w-4xl mx-auto'} bg-paper/90 backdrop-blur-sm border border-rule/10 p-6 md:p-10 transition-all duration-300`}>
              {view === 'calculator' ? (
                <Calculator
                  activeEventId={activeEventId}
                  onSaved={(id) => {
                    setActiveEventId(id)
                    refreshEvents()
                  }}
                />
              ) : (
                <CompareView
                  savedEvents={savedEvents}
                  onBack={() => setView('calculator')}
                />
              )}
            </div>

            {/* Sidebar */}
            {sidebarOpen && (
              <div className="w-72 flex-shrink-0 bg-paper/90 backdrop-blur-sm border border-rule/10 p-5 animate-in slide-in-from-right-5 duration-200 self-start">
                <EventLibrary
                  savedEvents={savedEvents}
                  activeEventId={activeEventId}
                  onLoad={handleLoadEvent}
                  onNew={handleNewEvent}
                  onDelete={(id) => {
                    if (activeEventId === id) setActiveEventId(null)
                    refreshEvents()
                  }}
                  onCompare={handleCompare}
                  refreshEvents={refreshEvents}
                />
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="flex items-center justify-between px-6 md:px-10 py-4 text-xs text-ink-muted pointer-events-auto">
          <span>&copy; {new Date().getFullYear()}</span>
          <div className="flex items-center gap-4">
            <a
              href="https://twitter.com/mattbergland"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-lavender transition-colors duration-200"
            >
              Twitter
            </a>
            <a
              href="https://linkedin.com/in/mattbergland"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-lavender transition-colors duration-200"
            >
              LinkedIn
            </a>
          </div>
        </footer>
      </div>
    </div>
  )
}
