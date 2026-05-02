import { Link } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Nav, Footer } from "@/components/Layout";
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
    <div className="min-h-screen bg-paper text-ink font-sans antialiased flex flex-col">
      <Nav />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Breadcrumb */}
        <div className="px-6 md:px-10 pt-6 pb-2">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
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
            {(items.length > 0 || kits.length > 0) && (
              <button
                onClick={clearAll}
                className="text-xs text-ink-muted hover:text-ink transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Header */}
        <div className="px-6 md:px-10 pb-4">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-lavender/10 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8E7DBE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 12v10H4V12" />
                <rect x="2" y="7" width="20" height="5" />
                <line x1="12" y1="22" x2="12" y2="7" />
                <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-medium tracking-tight text-ink">Merch Coordinator</h1>
              <p className="text-xs text-ink-muted">Build swag kits, choose packaging, and preview notes for your recipients.</p>
            </div>
          </div>
        </div>

        {/* Main app area */}
        <DndProvider backend={HTML5Backend}>
          <div className="flex-1 flex overflow-hidden border-t border-rule/10">
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
      </main>

      <Footer />
    </div>
  );
}
