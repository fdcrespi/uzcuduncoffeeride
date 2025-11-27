"use client"

import { useState, useEffect } from 'react'
import { ProductCard } from '@/components/product-card'
import { Skeleton } from '@/components/ui/skeleton'
import type { Product } from '@/lib/types'
import { io } from "socket.io-client";
import { useSearchParams } from 'next/navigation'

const socket = io(process.env.NEXT_PUBLIC_URL!);
const PAGE_LIMIT = 24;

interface ProductListProps {
  initialProducts: Product[];
}

export function ProductList({ initialProducts }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [loading, setLoading] = useState(false) // Initially false, as we have initial products
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setProducts(initialProducts);
    setPage(1);
    setHasMore(initialProducts.length === PAGE_LIMIT);
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
      const params = new URLSearchParams();
      const category = searchParams.get('category');
      const subcategory = searchParams.get('subcategory');
      params.set('visible', 'true');
      if (category) params.set('category', category);
      if (subcategory) params.set('subcategory', subcategory);
      params.set('page', '1');
      params.set('limit', String(PAGE_LIMIT));
      setLoading(true);
      fetch(`/api/products?${params.toString()}`)
        .then(res => res.json())
        .then(data => {
          setProducts(data);
          setPage(1);
          setHasMore(data.length === PAGE_LIMIT);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    };

    socket.on('updateProducto', handleUpdate);
    
    return () => {
      socket.off('connect');
      socket.off('updateProducto', handleUpdate);
    };
  }, []);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className="flex items-center justify-center mt-6">
        {hasMore && (
          <button
            className="cursor-pointer px-4 py-2 rounded-md border bg-card hover:bg-muted text-sm font-medium"
            onClick={() => {
              const nextPage = page + 1;
              const params = new URLSearchParams();
              const category = searchParams.get('category');
              const subcategory = searchParams.get('subcategory');
              params.set('visible', 'true');
              if (category) params.set('category', category);
              if (subcategory) params.set('subcategory', subcategory);
              params.set('page', String(nextPage));
              params.set('limit', String(PAGE_LIMIT));
              setLoading(true);
              fetch(`/api/products?${params.toString()}`)
                .then(res => res.json())
                .then(data => {
                  setProducts(prev => [...prev, ...data]);
                  setPage(nextPage);
                  setHasMore(data.length === PAGE_LIMIT);
                })
                .catch(console.error)
                .finally(() => setLoading(false));
            }}
          >
            {loading ? 'Cargando...' : 'Cargar más'}
          </button>
        )}
      </div>
    </div>
  )
}
