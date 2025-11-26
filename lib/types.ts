export interface Product {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  precio_alternativo: number;
  moneda: 'ARS' | 'USD';
  image: string;
  stock: number;
  subrubro_id: string;
  subrubro_nombre: string;
  destacado: boolean;
  visible: boolean;
  exhibicion: boolean;
}

export interface Subcategory {
  id: string;
  nombre: string;
}

export interface Category {
  id: string;
  nombre: string;
}

export interface Size {
  id: number;
  nombre: string;
  tipo: string | null;
  stock?: number; // stock por talle para el producto
}

export interface CartItem {
  product: Product;
  quantity: number;
  talle_id?: number;
  talle_nombre?: string;
}

export interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, options?: { talle_id?: number; talle_nombre?: string }) => void;
  removeItem: (productId: string, talle_id?: number) => void;
  updateQuantity: (productId: string, quantity: number, talle_id?: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  lastItemAddedTimestamp: number | null;
  setLastItemAddedTimestamp: (timestamp: number | null) => void;
  itemToRemove: CartItem | null;
  confirmRemoveItem: () => void;
  cancelRemoveItem: () => void;
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
  moneda?: 'ARS' | 'USD';
  nombre: string;
  talle_id?: number | null;
  talle_nombre?: string | null;
}