export type RecipientTier = 'executives' | 'ambassadors' | 'power-users' | 'event-attendees'

export type PackagingType = 'box' | 'bag' | 'envelope' | 'mailer'

export type ItemCategory = 'apparel' | 'tech' | 'drinkware' | 'stationery' | 'food' | 'travel' | 'wellness' | 'bags' | 'accessories' | 'custom'

export interface SwagItem {
  id: string
  name: string
  brand?: string
  link?: string
  imageUrl: string | null
  category: ItemCategory
  unitCost: number
}

export interface KitItem {
  itemId: string
  quantity: number
}

export interface Kit {
  id: string
  name: string
  items: KitItem[]
  packaging: PackagingType
  note: string
  tier: RecipientTier
  recipientCount: number
  createdAt: number
}

export type DragItemType = {
  type: 'SWAG_ITEM'
  itemId: string
}

export type DragKitItemType = {
  type: 'KIT_ITEM'
  itemId: string
  fromKitId?: string
}
