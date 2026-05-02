import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ToolLayout } from "@/components/Layout";
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
    <ToolLayout
      title="Seating Planner"
      fullScreen
      headerRight={
        <>
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
        </>
      }
    >
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
    </ToolLayout>
  );
}
