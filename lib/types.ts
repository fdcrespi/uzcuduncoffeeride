export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: "motorcycle" | "electric" | "accessory" | "coffee"
  inStock: boolean
  rating: number
  reviews: number
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface CartContextType {
  items: CartItem[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  lastItemAddedTimestamp: number | null
  setLastItemAddedTimestamp: (timestamp: number | null) => void
}
