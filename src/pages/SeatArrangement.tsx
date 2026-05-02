import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ToolLayout } from "@/components/Layout";
import { useAppState, isTutorialDone } from "@/seating-planner/store";
import { GuestPanel } from "@/seating-planner/components/GuestPanel";
import { FloorPlan } from "@/seating-planner/components/FloorPlan";
import { ProjectSelector } from "@/seating-planner/components/ProjectSelector";
import { Tutorial } from "@/seating-planner/components/Tutorial";
import "../App.css";

export default function SeatArrangement() {
  const {
    projects,
    activeProject,
    createProject,
    switchProject,
    renameProject,
    deleteProject,
    duplicateProject,
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

  const [showTutorial, setShowTutorial] = useState(() => !isTutorialDone());

  const seatedCount = guests.length - unseatedGuests.length;

  const handleCreateFirstProject = () => {
    createProject("Untitled Event");
  };

  return (
    <ToolLayout
      title="Seating Planner"
      fullScreen
      headerRight={
        <>
          <ProjectSelector
            projects={projects}
            activeProject={activeProject}
            onSwitch={switchProject}
            onCreate={createProject}
            onRename={renameProject}
            onDelete={deleteProject}
            onDuplicate={duplicateProject}
          />
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
      {showTutorial && <Tutorial onComplete={() => setShowTutorial(false)} />}

      {activeProject ? (
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
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
          <div className="w-20 h-20 rounded-full bg-lavender/10 flex items-center justify-center mb-4">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#8E7DBE"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium tracking-tight text-ink mb-1">
            No events yet
          </h3>
          <p className="text-sm text-ink-muted mb-6 max-w-xs leading-relaxed">
            Create your first event to start planning seating arrangements.
          </p>
          <button
            onClick={handleCreateFirstProject}
            className="px-5 py-2.5 text-sm font-medium text-white bg-lavender rounded-lg hover:bg-lavender/90 transition-colors"
          >
            Create First Event
          </button>
        </div>
      )}
    </ToolLayout>
  );
}
