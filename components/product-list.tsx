"use client"

import { useState, useEffect } from 'react'
import { ProductCard } from '@/components/product-card'
import { Skeleton } from '@/components/ui/skeleton'
import type { Product } from '@/lib/types'
import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_URL!);

interface ProductListProps {
  initialProducts: Product[];
}

export function ProductList({ initialProducts }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [loading, setLoading] = useState(false) // Initially false, as we have initial products

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Conectado al servidor de WebSocket');
    });

    const handleUpdate = () => {
      console.log('Producto actualizado, recargando lista...');
      // Re-fetch all products to get the latest state
      // Note: This refetches all products, not just the updated one.
      // A more advanced implementation could receive the specific updated product.
      fetch('/api/products')
        .then(res => res.json())
        .then(data => setProducts(data))
        .catch(console.error);
    };

    socket.on('updateProducto', handleUpdate);
    
    return () => {
      socket.off('connect');
      socket.off('updateProducto', handleUpdate);
    };
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
