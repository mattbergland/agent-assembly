import { useState, useCallback, useRef } from 'react'
import type { PlacedElement } from '../types'
import { GRID_SIZE } from '../constants'

interface CanvasElementProps {
  element: PlacedElement
  isSelected: boolean
  scale: number
  onSelect: () => void
  onMove: (x: number, y: number) => void
  onMoveDone: () => void
  onRotate: () => void
  onRemove: () => void
  boothWidth: number
  boothDepth: number
}

export function CanvasElement({
  element,
  isSelected,
  scale,
  onSelect,
  onMove,
  onMoveDone,
  onRotate,
  onRemove,
  boothWidth,
  boothDepth,
}: CanvasElementProps) {
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ mx: 0, my: 0, ex: 0, ey: 0 })

  const x = element.x * scale
  const y = element.y * scale
  const w = element.width * scale
  const d = element.depth * scale

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (element.locked) return
    e.stopPropagation()
    e.preventDefault()
    onSelect()
    setIsDragging(true)
    dragStart.current = { mx: e.clientX, my: e.clientY, ex: element.x, ey: element.y }

    const handleMouseMove = (e: MouseEvent) => {
      const svg = (e.target as Element)?.closest?.('svg')
      const ctm = svg?.getScreenCTM?.()
      const scaleFactor = ctm ? ctm.a : scale
      const dx = (e.clientX - dragStart.current.mx) / scaleFactor
      const dy = (e.clientY - dragStart.current.my) / scaleFactor
      let newX = dragStart.current.ex + dx / scale
      let newY = dragStart.current.ey + dy / scale
      newX = Math.round(newX / GRID_SIZE) * GRID_SIZE
      newY = Math.round(newY / GRID_SIZE) * GRID_SIZE
      newX = Math.max(0, Math.min(boothWidth - element.width, newX))
      newY = Math.max(0, Math.min(boothDepth - element.depth, newY))
      onMove(newX, newY)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      onMoveDone()
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }, [element, scale, onSelect, onMove, onMoveDone, boothWidth, boothDepth])

  const isRound = element.type.includes('round') || element.type === 'plant-large' || element.type === 'plant-small' || element.type === 'column' || element.type === 'stool' || element.type === 'trash-bin' || element.type === 'charging-station' || element.type === 'rope-stanchion'

  return (
    <g
      onMouseDown={handleMouseDown}
      onClick={(e) => { e.stopPropagation(); onSelect() }}
      style={{ cursor: element.locked ? 'default' : isDragging ? 'grabbing' : 'grab' }}
    >
      {/* Selection highlight */}
      {isSelected && (
        <rect
          x={x - 3} y={y - 3} width={w + 6} height={d + 6}
          fill="none" stroke="#8E7DBE" strokeWidth={1.5} strokeDasharray="4 2"
          rx={isRound ? w / 2 + 3 : 3}
          ry={isRound ? d / 2 + 3 : 3}
        />
      )}

      {/* Element shape */}
      {isRound ? (
        <ellipse
          cx={x + w / 2} cy={y + d / 2}
          rx={w / 2} ry={d / 2}
          fill={element.color}
          stroke={isSelected ? '#8E7DBE' : '#B8B6AE'}
          strokeWidth={isSelected ? 1.5 : 0.8}
          opacity={isDragging ? 0.8 : 1}
        />
      ) : (
        <rect
          x={x} y={y} width={w} height={d}
          fill={element.color}
          stroke={isSelected ? '#8E7DBE' : '#B8B6AE'}
          strokeWidth={isSelected ? 1.5 : 0.8}
          rx={2}
          opacity={isDragging ? 0.8 : 1}
        />
      )}

      {/* Label */}
      {w > 40 && d > 20 && (
        <text
          x={x + w / 2} y={y + d / 2 + 4}
          textAnchor="middle"
          fill="#444"
          fontSize={Math.min(10, w / 6)}
          fontFamily="Inter, sans-serif"
          pointerEvents="none"
        >
          {element.label}
        </text>
      )}

      {/* Action buttons when selected */}
      {isSelected && !isDragging && (
        <g>
          {/* Rotate button */}
          <g onClick={(e) => { e.stopPropagation(); onRotate() }} style={{ cursor: 'pointer' }}>
            <circle cx={x + w + 8} cy={y - 8} r={9} fill="white" stroke="#8E7DBE" strokeWidth={1} />
            <text x={x + w + 8} y={y - 4} textAnchor="middle" fill="#8E7DBE" fontSize={10} fontFamily="Inter, sans-serif">↻</text>
          </g>
          {/* Delete button */}
          <g onClick={(e) => { e.stopPropagation(); onRemove() }} style={{ cursor: 'pointer' }}>
            <circle cx={x - 8} cy={y - 8} r={9} fill="white" stroke="#E55" strokeWidth={1} />
            <text x={x - 8} y={y - 4} textAnchor="middle" fill="#E55" fontSize={10} fontFamily="Inter, sans-serif">×</text>
          </g>
        </g>
      )}
    </g>
  )
}
