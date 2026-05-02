import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ToolLayout } from "@/components/Layout";
import { useMerchStore } from "@/merch-coordinator/store";
import { ItemPanel } from "@/merch-coordinator/components/ItemPanel";
import { KitBuilder } from "@/merch-coordinator/components/KitBuilder";
import "../App.css";

export default function MerchCoordinator() {
  const {
    items,
    kits,
    activeKit,
    addItem,
    removeItem,
    newKit,
    setActiveKit,
    updateKit,
    removeKit,
    addItemToKit,
    updateKitItem,
    removeItemFromKit,
    duplicateKit,
    clearAll,
    getKitCost,
  } = useMerchStore();

  return (
    <ToolLayout
      title="Merch Coordinator"
      fullScreen
      headerRight={
        (items.length > 0 || kits.length > 0) ? (
          <button
            onClick={clearAll}
            className="text-xs text-ink-muted hover:text-ink transition-colors"
          >
            Clear all
          </button>
        ) : undefined
      }
    >
      <DndProvider backend={HTML5Backend}>
        <div className="flex-1 flex overflow-hidden">
          <ItemPanel
            items={items}
            onAdd={addItem}
            onRemove={removeItem}
          />
          <KitBuilder
            items={items}
            kits={kits}
            activeKit={activeKit}
            onNewKit={newKit}
            onSetActiveKit={setActiveKit}
            onUpdateKit={updateKit}
            onRemoveKit={removeKit}
            onAddItemToKit={addItemToKit}
            onUpdateKitItem={updateKitItem}
            onRemoveItemFromKit={removeItemFromKit}
            onDuplicateKit={duplicateKit}
            getKitCost={getKitCost}
          />
        </div>
      </DndProvider>
    </ToolLayout>
  );
}
