import { useState } from "react";
import { DndProvider } from "react-dnd";
import { ToolLayout } from "@/components/Layout";
import { useMerchStore } from "@/merch-coordinator/store";
import { ItemPanel } from "@/merch-coordinator/components/ItemPanel";
import { KitBuilder } from "@/merch-coordinator/components/KitBuilder";
import { getDndBackend, getDndBackendOptions } from "@/lib/dnd-backend";
import "../App.css";

export default function MerchCoordinator() {
  const [showPanel, setShowPanel] = useState(false);
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

  const backend = getDndBackend();
  const backendOptions = getDndBackendOptions();

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
            <ItemPanel
              items={items}
              onAdd={addItem}
              onRemove={removeItem}
              activeKit={activeKit}
              onAddItemToKit={activeKit ? (itemId: string) => addItemToKit(activeKit.id, itemId) : undefined}
              onClose={() => setShowPanel(false)}
            />
          </div>

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

        {/* Mobile floating button to open items panel */}
        <button
          onClick={() => setShowPanel(true)}
          className="fixed bottom-5 left-5 z-20 md:hidden flex items-center gap-2 px-4 py-2.5 bg-lavender text-white text-sm font-medium rounded-full shadow-lg hover:bg-lavender/90 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          Items{items.length > 0 ? ` (${items.length})` : ''}
        </button>
      </DndProvider>
    </ToolLayout>
  );
}
