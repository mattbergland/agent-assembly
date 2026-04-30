import { Link } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { LogoMark } from "@/components/Layout";
import { useAppState } from "@/seating-planner/store";
import { GuestPanel } from "@/seating-planner/components/GuestPanel";
import { FloorPlan } from "@/seating-planner/components/FloorPlan";
import "../App.css";

export default function SeatArrangement() {
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

  return (
    <div className="h-screen bg-paper text-ink font-sans antialiased flex flex-col overflow-hidden">
      {/* Tool header */}
      <header className="flex items-center justify-between px-6 py-4 flex-none">
        <div className="flex flex-col gap-1">
          <Link
            to="/"
            className="flex items-center gap-2.5 hover:opacity-70 transition-opacity"
          >
            <LogoMark />
            <span className="text-sm tracking-tight font-medium">
              Seating Planner
            </span>
          </Link>
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
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 text-sm text-ink-muted">
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
          {guests.length > 0 && (
            <button
              onClick={clearAll}
              className="text-xs text-ink-muted hover:text-ink transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
      </header>

      {/* Seating planner app */}
      <DndProvider backend={HTML5Backend}>
        <div className="flex-1 flex overflow-hidden">
          <GuestPanel
            guests={guests}
            unseatedGuests={unseatedGuests}
            onAdd={addGuest}
            onAddMany={addGuests}
            onUpdate={updateGuest}
            onRemove={removeGuest}
          />
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
      </DndProvider>
    </div>
  );
}
