import { HTML5Backend } from 'react-dnd-html5-backend'
import { TouchBackend } from 'react-dnd-touch-backend'

function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

export function getDndBackend() {
  return isTouchDevice() ? TouchBackend : HTML5Backend
}

export function getDndBackendOptions() {
  if (isTouchDevice()) {
    return { enableMouseEvents: true, delayTouchStart: 200 }
  }
  return undefined
}
