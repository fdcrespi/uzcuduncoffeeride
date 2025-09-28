"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import type { Product } from "@/lib/types"
import Image from "next/image"
import { toast } from "@/hooks/use-toast"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()

  const handleAddToCart = () => {
    addItem(product)
  }

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover-lift">
      <div className="relative overflow-hidden">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          width={300}
          height={250}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.category === "motorcycle" && (
          <Badge className="absolute top-2 left-2 bg-primary animate-pulse-glow">Nuevo</Badge>
        )}
        {product.category === "electric" && (
          <Badge className="absolute top-2 left-2 bg-green-600 animate-pulse-glow">Eco</Badge>
        )}
        {product.category === "coffee" && (
          <Badge className="absolute top-2 left-2 bg-amber-600 animate-pulse-glow">Especial</Badge>
        )}
      </div>
      <CardHeader>
        <CardTitle className="text-lg group-hover:text-primary transition-colors">{product.name}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 transition-colors ${
                i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-muted-foreground"
              }`}
            />
          ))}
          <span className="ml-2 text-sm text-muted-foreground">({product.reviews} reseñas)</span>
        </div>
        <p className="text-2xl font-bold text-primary">${product.price}</p>
      </CardContent>
      <CardFooter>
        {product.category === "motorcycle" ? (
          <Button className="w-full btn-motorcycle bg-transparent" variant="outline">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Consultar
          </Button>
        ) : (
          <Button className="w-full btn-motorcycle" onClick={handleAddToCart} disabled={!product.inStock}>
            <ShoppingCart className="w-4 h-4 mr-2" />
            {product.inStock ? "Agregar al Carrito" : "Sin Stock"}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
