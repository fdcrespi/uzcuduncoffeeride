export interface Product {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  image: string;
  stock: number;
  subrubro_id: string;
  subrubro_nombre: string;
  destacado: boolean;
  visible: boolean;
}

export interface Subcategory {
  id: string;
  nombre: string;
}

export interface Category {
  id: string;
  nombre: string;
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
  itemToRemove: CartItem | null
  confirmRemoveItem: () => void
  cancelRemoveItem: () => void
}


export interface Order {
  id: string;
  fecha_emision: string;
  cliente_id: number;
  pago: boolean;
  payer_name: string;
  payer_address: string;
  total: number;
  delivery: number;
  modo_entrega_id: number;
  status: 'pending' | 'shipped' | 'delivered' | 'canceled';
  payer_zip?: string | null;
}

export interface OrderProduct {
  pedido_id: number;
  product_id: number;
  cantidad: number;
  precio: number;
  nombre: string;
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
  itemToRemove: CartItem | null
  confirmRemoveItem: () => void
  cancelRemoveItem: () => void
}
export interface OrderProduct {
  pedido_id: number;
  product_id: number;
  cantidad: number;
  precio: number;
  nombre: string;
}