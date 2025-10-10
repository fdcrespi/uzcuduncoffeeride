"use client"

import OrderDetailCard from "@/components/admin/order-detail-card"
import OrderProductsList from "@/components/admin/order-product-list"
import Link from "next/link"
import { Button } from "@/components/ui/button"            // ← añade esta import si no está

export default function OrderDetail({ params }: { params: { id: number } }) {
  const { id } = params
  return (
    <div className="container mx-auto space-y-4">
      <OrderDetailCard orderId={id} />
      <OrderProductsList orderId={id} />      

      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline mt-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Volver a la lista de pedidos
      </Link>
    </div>
  )
}

