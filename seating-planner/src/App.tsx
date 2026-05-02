import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useAppState } from './store'
import { Header } from './components/Header'
import { GuestPanel } from './components/GuestPanel'
import { FloorPlan } from './components/FloorPlan'

function App() {
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
  } = useAppState()

  const seatedCount = guests.length - unseatedGuests.length

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen flex flex-col bg-paper">
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
  )
}

export default App
