"use client"

import { OrderProduct } from "@/lib/types"
import { useEffect, useState } from "react"

export default function OrderProductsList({ orderId }: { orderId: number }) {
  const [orderProducts, setOrderProducts] = useState<OrderProduct[]>([])

  useEffect(() => {
    const fetchOrderProducts = async () => {
      const res = await fetch(`/api/orders/${orderId}/products`)
      const data = await res.json()
      setOrderProducts(data)
      console.log(data)
    }
    fetchOrderProducts()
  }, [orderId])

  return (
    <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-stone-800">Productos de la orden #{orderId}</h2>
        <span className="text-sm text-stone-500">{orderProducts.length} productos</span>
      </div>

      <div className="divide-y divide-stone-100">
        {orderProducts.map(product => (
          <div key={product.product_id + product.pedido_id} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-stone-700">#{product.nombre}</span>
              <span className="text-sm text-stone-600">× {product.cantidad}</span>
            </div>
            <div className="text-right">
              <span className="text-sm text-stone-600">
                {(product.moneda === 'USD' ? 'USD ' : '$')}
                {product.precio.toLocaleString('es-AR')}
              </span>
              <span className="ml-3 text-sm font-medium text-stone-800">
                {(product.moneda === 'USD' ? 'USD ' : '$')}
                {(product.cantidad * product.precio).toLocaleString('es-AR')}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-stone-200">
        <span className="text-sm font-medium text-stone-700">Total</span>
        <span className="text-lg font-semibold text-stone-900">
          ${orderProducts.reduce((acc, product) => acc + product.cantidad * product.precio, 0).toFixed(2)}
        </span>
      </div>
    </div>
  )
}