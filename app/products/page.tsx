
"use client"

import { useState, useEffect, use } from 'react'
import { ProductCard } from '@/components/product-card'
import { Skeleton } from '@/components/ui/skeleton'
import type { Product } from '@/lib/types'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_URL!);

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products')
        if (!response.ok) {
          throw new Error('Error al cargar los productos')
        }
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error(error)
        // Aquí podrías manejar el error, por ejemplo, mostrando un mensaje al usuario
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Conectado al servidor de WebSocket');
    });
    socket.on('updateProducto', () => {
      console.log('Producto actualizado, recargando lista...');
      // Volver a cargar los productos
      setLoading(true);
      fetch('/api/products')
        .then(response => {
          if (!response.ok) {
            throw new Error('Error al cargar los productos');
          }
          return response.json();
        })
        .then(data => {
          setProducts(data);
        })
        .catch(error => {
          console.error(error);
        })
        .finally(() => {
          setLoading(false);
        });
    });
    
    return () => {
      socket.off('updateProducto');
    };
  }, []);

  return (
    <>
    <Header />
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Nuestros Productos</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Explora nuestra selección de motos, accesorios y café de especialidad.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-[250px] w-full rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
    </>
  )
}
