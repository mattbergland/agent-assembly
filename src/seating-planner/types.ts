export interface Guest {
  id: string
  name: string
  title: string
  company: string
  photoUrl: string | null
}

export type TableShape = 'round' | 'rectangular' | 'u-shape' | 'classroom' | 'boardroom' | 'banquet' | 'hollow-square'

export interface Seat {
  index: number
  guestId: string | null
}

export interface Table {
  id: string
  name: string
  seats: Seat[]
  shape: TableShape
}

export type DragItem = {
  type: 'GUEST'
  guestId: string
  sourceTableId?: string
  sourceSeatIndex?: number
}
