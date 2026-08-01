export interface ShopItem {
  id: string
  name: string
  price: number
  image: string
  description: string
  priceId: string
  timestamps?: { start: number; end: number }[]
}

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'hoodie-1',
    name: 'Sober Life Hoodie',
    price: 79,
    priceId: 'price_hoodie',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80',
    description: 'Heavyweight fleece. Engineered for resilience, cut for confidence.',
    timestamps: [{ start: 30, end: 60 }, { start: 300, end: 330 }],
  },
  {
    id: 'cap-1',
    name: 'Sober Life Cap',
    price: 39,
    priceId: 'price_cap',
    image: '/sober_cap.jpg',
    description: 'Limited-run 6-panel cap. Made for those who lead, not follow.',
    timestamps: [{ start: 120, end: 150 }],
  },
  {
    id: 'tshirt-1',
    name: 'Sober Life Tee',
    price: 45,
    priceId: 'price_tshirt',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
    description: 'Premium 100% cotton. The uniform of the disciplined.',
    timestamps: [{ start: 200, end: 240 }],
  },
]

export function getActiveItems(currentTime: number): ShopItem[] {
  return SHOP_ITEMS.filter(item =>
    item.timestamps?.some(ts => currentTime >= ts.start && currentTime <= ts.end)
  )
}
