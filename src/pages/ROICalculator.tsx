import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Nav, Footer } from "@/components/Layout";
import Calculator from "@/roi-calculator/components/Calculator";
import EventLibrary from "@/roi-calculator/components/EventLibrary";
import CompareView from "@/roi-calculator/components/CompareView";
import WebGLConstellation from "@/roi-calculator/components/WebGLConstellation";
import type { SavedEvent } from "@/roi-calculator/utils/storage";
import { loadAllEvents } from "@/roi-calculator/utils/storage";
import "../App.css";

export default function ROICalculator() {
  const [view, setView] = useState<"calculator" | "compare">("calculator");
  const [activeEventId, setActiveEventId] = useState<string | null>(null);
  const [savedEvents, setSavedEvents] = useState<SavedEvent[]>(() =>
    loadAllEvents()
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const refreshEvents = useCallback(() => {
    setSavedEvents(loadAllEvents());
  }, []);

  const handleLoadEvent = useCallback((id: string) => {
    setActiveEventId(id);
    setView("calculator");
    setSidebarOpen(false);
  }, []);

  const handleNewEvent = useCallback(() => {
    setActiveEventId(null);
    setView("calculator");
    setSidebarOpen(false);
  }, []);

  const handleCompare = useCallback(() => {
    setView("compare");
    setSidebarOpen(false);
  }, []);

  return (
    <div className="relative min-h-screen bg-paper text-ink font-sans antialiased flex flex-col">
      <WebGLConstellation />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Nav
          extraLinks={
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-xs text-ink-muted hover:text-lavender transition-colors duration-200 tracking-wide"
            >
              {sidebarOpen ? "Close" : "My Events"}
            </button>
          }
        />

        <main className="flex-1 px-4 md:px-10 pb-16">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <div className="pt-6 pb-2">
              <Link
                to="/toolkit"
                className="inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-lavender transition-colors"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Back to Toolkit
              </Link>
            </div>

            {/* Content */}
            <div className="flex gap-6 pt-4">
              <div
                className={`${
                  sidebarOpen
                    ? "flex-1 min-w-0"
                    : "w-full max-w-4xl mx-auto"
                } bg-paper/90 backdrop-blur-sm border border-rule/10 p-6 md:p-10 transition-all duration-300`}
              >
                {view === "calculator" ? (
                  <Calculator
                    activeEventId={activeEventId}
                    onSaved={(id) => {
                      setActiveEventId(id);
                      refreshEvents();
                    }}
                  />
                ) : (
                  <CompareView
                    savedEvents={savedEvents}
                    onBack={() => setView("calculator")}
                  />
                )}
              </div>

              {sidebarOpen && (
                <div className="w-72 flex-shrink-0 bg-paper/90 backdrop-blur-sm border border-rule/10 p-5 self-start">
                  <EventLibrary
                    savedEvents={savedEvents}
                    activeEventId={activeEventId}
                    onLoad={handleLoadEvent}
                    onNew={handleNewEvent}
                    onDelete={(id) => {
                      if (activeEventId === id) setActiveEventId(null);
                      refreshEvents();
                    }}
                    onCompare={handleCompare}
                    refreshEvents={refreshEvents}
                  />
                </div>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
