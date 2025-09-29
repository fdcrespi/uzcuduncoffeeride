
"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useCart } from '@/contexts/cart-context'
import { toast } from '@/hooks/use-toast'

// Definimos un tipo extendido para el producto que incluye el stock numérico
import { Product } from '@/lib/types'
import { Header } from '@/components/layout/header'

export default function ProductDetailPage() {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)

  const params = useParams()
  const router = useRouter()
  const { addItem } = useCart()
  const { id } = params

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          setLoading(true)
          const response = await fetch(`/api/products/${id}`)
          if (!response.ok) {
            throw new Error('Producto no encontrado')
          }
          const data = await response.json()
          setProduct(data)
        } catch (error) {
          console.error(error)
          setProduct(null)
        } finally {
          setLoading(false)
        }
      }
      fetchProduct()
    }
  }, [id])

  const handleAddToCart = () => {
    if (product) {
      addItem(product)
      toast({
        title: "¡Agregado!",
        description: `Se ha añadido ${product.nombre} al carrito.`,
      })
    }
  }

  const handleBuyNow = () => {
    if (product) {
      addItem(product)
      router.push('/checkout')
    }
  }

  if (loading) {
    return <ProductSkeleton />
  }

  if (!product) {
    return (
      <div className="container mx-auto text-center py-20">
        <h1 className="text-2xl font-bold">Producto no encontrado</h1>
        <p className="text-muted-foreground">El producto que buscas no existe o no está disponible.</p>
      </div>
    )
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Columna de Imagen */}
          <div className="w-full">
            <div className="relative aspect-square bg-muted rounded-lg overflow-hidden mx-auto" style={{ maxWidth: '500px' }}>
              <Image
                src={product.image || '/placeholder.svg'}
                alt={product.nombre}
                fill
                className="object-cover"
              />
            </div>
            {/* Aquí se podría agregar un carrusel si hubiera más imágenes */}
          </div>

          {/* Columna de Detalles y Acciones */}
          <div className="flex flex-col pt-4">
            <h1 className="text-3xl md:text-4xl font-bold text-left mb-4">{product.nombre}</h1>
            
            <p className="text-4xl font-extrabold text-black mb-6 text-left">${product.precio.toFixed(2)}</p>

            <div className="mb-6">
              <h3 className="font-semibold text-lg">Stock disponible</h3>
              <div className="flex items-center gap-4 mt-2">
                  <p className="text-md text-black">
                      Cantidad: {quantity}
                      {product.stock > 0 && <span className="text-gray-500 ml-2">({product.stock} disponibles)</span>}
                  </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full max-w-xs">
              <Button size="lg" className="bg-primary hover:bg-primary/90" onClick={handleBuyNow} disabled={product.stock <= 0}>
                Comprar ahora
              </Button>
              <Button size="lg" variant="outline" onClick={handleAddToCart} disabled={product.stock <= 0}>
                Agregar al carrito
              </Button>
            </div>
            {product.stock <= 0 && (
                <p className="text-red-600 font-semibold mt-4">Producto sin stock</p>
            )}

            <div className="mt-8 pt-6 border-t">
              <h3 className="font-semibold text-lg mb-2">Características</h3>
              <p className="text-muted-foreground">{product.descripcion || "No hay descripción disponible."}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// Componente para el esqueleto de carga
function ProductSkeleton() {
    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                <Skeleton className="aspect-square w-full max-w-[500px] mx-auto" />
                <div className="flex flex-col space-y-6 pt-4">
                    <Skeleton className="h-10 w-3/4" />
                    <Skeleton className="h-12 w-1/2" />
                    <div className="space-y-3">
                        <Skeleton className="h-6 w-1/4" />
                        <Skeleton className="h-6 w-1/3" />
                    </div>
                    <div className="flex flex-col gap-3 w-full max-w-xs">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                    <div className="space-y-3 pt-6">
                        <Skeleton className="h-6 w-1/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                    </div>
                </div>
            </div>
        </div>
    )
}
