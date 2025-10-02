export interface Product {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  image: string;
  category: string;
  stock: number;
  subrubro_id?: string;
  subrubro_nombre?: string;
  destacado: boolean;
  visible: boolean;  
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
  delivery: boolean;
  status: 'pending' | 'shipped' | 'delivered' | 'canceled';
}