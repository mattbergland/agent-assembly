import { useState } from "react";
import { DndProvider } from "react-dnd";
import { ToolLayout } from "@/components/Layout";
import { useAppState } from "@/seating-planner/store";
import { GuestPanel } from "@/seating-planner/components/GuestPanel";
import { FloorPlan } from "@/seating-planner/components/FloorPlan";
import { getDndBackend, getDndBackendOptions } from "@/lib/dnd-backend";
import "../App.css";

export default function SeatArrangement() {
  const [showPanel, setShowPanel] = useState(false);
  const {
    guests,
    tables,
    unseatedGuests,
    addGuest,
    addGuests,
    updateGuest,
    removeGuest,
    addTable,
    removeTable,
    updateTable,
    resizeTable,
    assignSeat,
    unassignSeat,
    clearAll,
  } = useAppState();

  const seatedCount = guests.length - unseatedGuests.length;
  const backend = getDndBackend();
  const backendOptions = getDndBackendOptions();

  return (
    <ToolLayout
      title="Seating Planner"
      fullScreen
      headerRight={
        <>
          <div className="hidden sm:flex items-center gap-4 text-sm text-ink-muted">
            <span>
              {guests.length} guest{guests.length !== 1 ? "s" : ""}
            </span>
            <span className="text-rule/20">|</span>
            <span>{seatedCount} seated</span>
            <span className="text-rule/20">|</span>
            <span>
              {tables.length} table{tables.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex sm:hidden items-center gap-2 text-xs text-ink-muted">
            <span>{guests.length}g</span>
            <span className="text-rule/20">/</span>
            <span>{seatedCount}s</span>
            <span className="text-rule/20">/</span>
            <span>{tables.length}t</span>
          </div>
          {guests.length > 0 && (
            <button
              onClick={clearAll}
              className="text-xs text-ink-muted hover:text-ink transition-colors"
            >
              Clear all
            </button>
          )}
        </>
      }
    >
      <DndProvider backend={backend} options={backendOptions}>
        <div className="flex-1 flex overflow-hidden relative">
          {/* Mobile backdrop */}
          {showPanel && (
            <div
              className="fixed inset-0 bg-ink/20 z-30 md:hidden"
              onClick={() => setShowPanel(false)}
            />
          )}

          {/* Sidebar — always visible on md+, slide-over on mobile */}
          <div className={`
            fixed inset-y-0 left-0 z-40 w-[300px] transition-transform duration-300 md:relative md:inset-auto md:z-auto md:w-[340px] md:translate-x-0 md:transition-none
            ${showPanel ? 'translate-x-0' : '-translate-x-full'}
          `}>
            <GuestPanel
              guests={guests}
              unseatedGuests={unseatedGuests}
              onAdd={addGuest}
              onAddMany={addGuests}
              onUpdate={updateGuest}
              onRemove={removeGuest}
              onClose={() => setShowPanel(false)}
            />
          </div>

          <FloorPlan
            tables={tables}
            guests={guests}
            onAssign={assignSeat}
            onUnassign={unassignSeat}
            onAddTable={addTable}
            onRemoveTable={removeTable}
            onUpdateTable={updateTable}
            onResizeTable={resizeTable}
          />
        </div>

        {/* Mobile floating button to open guest panel */}
        <button
          onClick={() => setShowPanel(true)}
          className="fixed bottom-5 left-5 z-20 md:hidden flex items-center gap-2 px-4 py-2.5 bg-lavender text-white text-sm font-medium rounded-full shadow-lg hover:bg-lavender/90 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          Guests{unseatedGuests.length > 0 ? ` (${unseatedGuests.length})` : ''}
        </button>
      </DndProvider>
    </ToolLayout>
  );
}
