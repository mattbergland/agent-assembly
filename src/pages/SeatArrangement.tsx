import { Link } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Nav, Footer } from "@/components/Layout";
import { useAppState } from "@/seating-planner/store";
import { Header } from "@/seating-planner/components/Header";
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
    <div className="min-h-screen bg-paper text-ink font-sans antialiased flex flex-col">
      <Nav />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Breadcrumb */}
        <div className="px-6 md:px-10 pt-6 pb-2">
          <div className="max-w-7xl mx-auto">
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
        </div>

        {/* Seating planner app */}
        <DndProvider backend={HTML5Backend}>
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header
              guestCount={guests.length}
              seatedCount={seatedCount}
              tableCount={tables.length}
              onClearAll={clearAll}
            />
            <div className="flex flex-1 overflow-hidden">
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
          </div>
        </DndProvider>
      </main>

      <Footer />
    </div>
  );
}
