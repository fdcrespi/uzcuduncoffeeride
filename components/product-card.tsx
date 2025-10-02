"use client"

import type { Product } from "@/lib/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { useCart } from "@/contexts/cart-context";
import { toast } from "@/hooks/use-toast";
import { ShoppingCart, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const router = useRouter();

  const handleAddToCart = () => {
    addItem(product);
    toast({
      title: "¡Agregado!",
      description: `${product.nombre} se ha añadido al carrito.`,
    });
  };

  const handleBuyNow = () => {
    if (product) {
      addItem(product);
      router.push("/checkout");
    }
  };

  return (
    <Card className="group flex flex-col justify-between overflow-hidden rounded-lg border shadow-sm transition-all duration-300 hover:shadow-xl">
      {/* Contenedor para la parte superior de la tarjeta (imagen, título, precio) */}
      <div>
        <div className="relative overflow-hidden">
          <Link href={`/products/${product.id}`}>
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.nombre}
              width={300}
              height={250}
              className="h-48 w-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>
        </div>
        <CardHeader>
          {/* Altura fija para alinear títulos de diferente longitud */}
          <CardTitle className="line-clamp-2 h-14 text-lg transition-colors group-hover:text-primary">
            {product.nombre}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-primary">
            ${product.precio.toLocaleString("es-AR")}
          </p>
        </CardContent>
      </div>

      {/* Pie de la tarjeta, siempre se mostrará en la parte inferior */}
      <CardFooter className="p-4">
        <div className="grid w-full grid-cols-1 gap-4">
          <Button
            onClick={handleBuyNow}
            disabled={product.stock <= 0}
            variant="default"
            size="sm"
          >
            <Zap className="mr-2 h-4 w-4" />
            {product.stock > 0 ? "Comprar ahora" : "Sin Stock"}
          </Button>
          <Button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            variant="outline"
            size="sm"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {product.stock > 0 ? "Agregar al carrito" : "Sin Stock"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
