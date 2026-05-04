import { useState, useEffect, useCallback } from 'react'
import { ToolLayout } from '@/components/Layout'
import { useBoothStore, isTutorialDone } from '@/booth-designer/store'
import { BoothCanvas } from '@/booth-designer/components/BoothCanvas'
import { ElementsCatalog } from '@/booth-designer/components/ElementsCatalog'
import { Toolbar } from '@/booth-designer/components/Toolbar'
import { PropertiesPanel } from '@/booth-designer/components/PropertiesPanel'
import { ThreeDView } from '@/booth-designer/components/ThreeDView'
import { WalkthroughView } from '@/booth-designer/components/WalkthroughView'
import { ItemListView } from '@/booth-designer/components/ItemListView'
import { ViewModeBar } from '@/booth-designer/components/ViewModeBar'
import { ProjectSelector } from '@/booth-designer/components/ProjectSelector'
import { Tutorial } from '@/booth-designer/components/Tutorial'
import { RoomShapeSelector } from '@/booth-designer/components/RoomShapeSelector'
import { HelpCenter } from '@/booth-designer/components/HelpCenter'
import { OpeningsPanel } from '@/booth-designer/components/OpeningsPanel'
import type { BoothShape } from '@/booth-designer/types'
import '../App.css'

export default function BoothDesigner() {
  const [showCatalog, setShowCatalog] = useState(false)
  const [showTutorial, setShowTutorial] = useState(() => !isTutorialDone())
  const [showRoomShape, setShowRoomShape] = useState(false)
  const [showHelpCenter, setShowHelpCenter] = useState(false)
  const [showOpenings, setShowOpenings] = useState(false)

  const store = useBoothStore()
  const {
    projects,
    activeProject,
    viewMode,
    selectedId,
    totalBudget,
    canUndo,
    canRedo,
    setViewMode,
    setSelectedId,
    createProject,
    switchProject,
    renameProject,
    deleteProject,
    duplicateProject,
    updateConfig,
    toggleWall,
    addOpening,
    removeOpening,
    addElement,
    moveElement,
    moveElementDone,
    updateElement,
    rotateElement,
    removeElement,
    duplicateElement,
    clearElements,
    undo,
    redo,
  } = store

  // Auto-create first project
  useEffect(() => {
    if (projects.length === 0) {
      createProject('My Booth')
    }
  }, [projects.length, createProject])

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

    if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
      e.preventDefault()
      if (e.shiftKey) redo()
      else undo()
    }
    if (e.key === 'Delete' || e.key === 'Backspace') {
      if (selectedId) {
        e.preventDefault()
        removeElement(selectedId)
      }
    }
    if (e.key === 'r' || e.key === 'R') {
      if (selectedId) {
        e.preventDefault()
        rotateElement(selectedId)
      }
    }
    if (e.key === 'Escape') {
      setSelectedId(null)
      setShowRoomShape(false)
      setShowHelpCenter(false)
      setShowOpenings(false)
    }
  }, [selectedId, undo, redo, removeElement, rotateElement, setSelectedId])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const selectedElement = activeProject?.elements.find(el => el.id === selectedId) ?? null

  const handleRoomShapeSelect = (shape: BoothShape, width: number, depth: number) => {
    updateConfig({ shape, width, depth })
    setShowRoomShape(false)
  }

  const boothArea = activeProject
    ? (activeProject.config.width / 12) * (activeProject.config.depth / 12)
    : 0

  const hasWalls = activeProject
    ? activeProject.config.walls.some(w => w.hasWall)
    : false

  return (
    <ToolLayout
      title="Booth Designer"
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
          <div className="hidden sm:flex items-center gap-3 text-xs text-ink-muted">
            <span>{activeProject?.elements.length ?? 0} item{(activeProject?.elements.length ?? 0) !== 1 ? 's' : ''}</span>
            <span className="text-rule/20">|</span>
            <span className="font-mono font-medium text-ink">${totalBudget.toLocaleString()}</span>
          </div>
          <div className="flex sm:hidden items-center text-xs font-mono font-medium text-ink">
            ${totalBudget.toLocaleString()}
          </div>
        </>
      }
    >
      {showTutorial && <Tutorial onComplete={() => setShowTutorial(false)} />}

      {showRoomShape && activeProject && (
        <RoomShapeSelector
          currentShape={activeProject.config.shape}
          onSelect={handleRoomShapeSelect}
          onClose={() => setShowRoomShape(false)}
        />
      )}

      {activeProject && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Toolbar */}
          <Toolbar
            config={activeProject.config}
            totalBudget={totalBudget}
            canUndo={canUndo}
            canRedo={canRedo}
            elementCount={activeProject.elements.length}
            onUpdateConfig={updateConfig}
            onToggleWall={toggleWall}
            onUndo={undo}
            onRedo={redo}
            onClear={clearElements}
            onShowRoomShape={() => setShowRoomShape(true)}
            onShowOpenings={() => setShowOpenings(!showOpenings)}
            onShowHelp={() => setShowHelpCenter(!showHelpCenter)}
          />

          <div className="flex-1 flex overflow-hidden relative">
            {/* Mobile backdrop */}
            {showCatalog && (
              <div
                className="fixed inset-0 bg-ink/20 z-30 md:hidden"
                onClick={() => setShowCatalog(false)}
              />
            )}

            {/* Element catalog sidebar — hidden for item list view */}
            {viewMode !== 'itemlist' && (
              <div className={`
                fixed inset-y-0 left-0 z-40 w-[260px] transition-transform duration-300
                md:relative md:inset-auto md:z-auto md:w-[260px] md:translate-x-0 md:transition-none
                ${showCatalog ? 'translate-x-0' : '-translate-x-full'}
              `}>
                <ElementsCatalog onClose={() => setShowCatalog(false)} />
              </div>
            )}

            {/* Main content area */}
            {viewMode === 'floor' && (
              <BoothCanvas
                config={activeProject.config}
                elements={activeProject.elements}
                selectedId={selectedId}
                onSelect={setSelectedId}
                onAddElement={addElement}
                onMoveElement={moveElement}
                onMoveElementDone={moveElementDone}
                onRotateElement={rotateElement}
                onRemoveElement={removeElement}
              />
            )}
            {viewMode === '3d' && (
              <ThreeDView
                config={activeProject.config}
                elements={activeProject.elements}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            )}
            {viewMode === 'walkthrough' && (
              <WalkthroughView
                config={activeProject.config}
                elements={activeProject.elements}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            )}
            {viewMode === 'itemlist' && (
              <ItemListView
                elements={activeProject.elements}
                totalBudget={totalBudget}
                selectedId={selectedId}
                onSelect={setSelectedId}
                onRemove={removeElement}
                onDuplicate={duplicateElement}
              />
            )}

            {/* Properties panel — desktop only, not in item list view */}
            {selectedElement && viewMode !== 'itemlist' && (
              <div className="hidden md:block">
                <PropertiesPanel
                  element={selectedElement}
                  onUpdate={updateElement}
                  onRotate={rotateElement}
                  onDuplicate={duplicateElement}
                  onRemove={removeElement}
                  onClose={() => setSelectedId(null)}
                />
              </div>
            )}

            {/* View mode bar */}
            <ViewModeBar viewMode={viewMode} onSetViewMode={setViewMode} />

            {/* Help center */}
            {showHelpCenter && (
              <HelpCenter
                onClose={() => setShowHelpCenter(false)}
                elementCount={activeProject.elements.length}
                hasWalls={hasWalls}
                boothArea={boothArea}
              />
            )}

            {/* Openings panel */}
            {showOpenings && (
              <OpeningsPanel
                config={activeProject.config}
                onAddOpening={addOpening}
                onRemoveOpening={removeOpening}
                onClose={() => setShowOpenings(false)}
              />
            )}
          </div>

          {/* Mobile floating button for catalog */}
          {viewMode !== 'itemlist' && (
            <button
              onClick={() => setShowCatalog(true)}
              className="fixed bottom-5 left-5 z-20 md:hidden flex items-center gap-2 px-4 py-2.5 bg-lavender text-white text-sm font-medium rounded-full shadow-lg hover:bg-lavender/90 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>
              Elements
            </button>
          )}

          {/* Mobile selected element bar */}
          {selectedElement && viewMode !== 'itemlist' && (
            <div className="md:hidden flex items-center gap-2 px-4 py-2 bg-white border-t border-rule/10">
              <span className="text-xs font-medium text-ink flex-1 truncate">{selectedElement.label}</span>
              <button
                onClick={() => rotateElement(selectedElement.id)}
                className="p-1.5 rounded-md border border-rule/10 text-ink-muted hover:text-lavender transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></svg>
              </button>
              <button
                onClick={() => duplicateElement(selectedElement.id)}
                className="p-1.5 rounded-md border border-rule/10 text-ink-muted hover:text-lavender transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
              </button>
              <button
                onClick={() => removeElement(selectedElement.id)}
                className="p-1.5 rounded-md border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
              </button>
              <button
                onClick={() => setSelectedId(null)}
                className="p-1.5 rounded-md text-ink-muted hover:text-ink transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
              </button>
            </div>
          )}
        </div>
      )}
    </ToolLayout>
  )
}
