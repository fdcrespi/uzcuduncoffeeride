"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { QuantityControl } from "./ui/quantity-control"
import { Separator } from "./ui/separator"

export function CartSidebar() {
  const { items, updateQuantity, getTotalItems, getTotalPrice } = useCart()
  const [isOpen, setIsOpen] = useState(false)

  const totalItems = getTotalItems()
  const totalPrice = getTotalPrice()

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="w-5 h-5" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center p-0 text-xs">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Carrito de Compras ({totalItems} {totalItems === 1 ? "artículo" : "artículos"})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <ShoppingCart className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Tu carrito está vacío</h3>
            <p className="text-muted-foreground mb-4">Agrega algunos productos para comenzar</p>
            <Button onClick={() => setIsOpen(false)}>Continuar Comprando</Button>
          </div>
        ) : (
          <>
            <div className="flex-grow overflow-y-auto pr-2 space-y-4 mx-4">
              {/* Card principal para el contenido */}
              <Card>
                <CardContent className="pt-6 space-y-4">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex items-start space-x-4">
                      <div className="relative w-12 h-12 rounded-md overflow-hidden">
                        <Image
                          src={item.product.image || "/placeholder.svg"}
                          alt={item.product.nombre}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium leading-tight truncate">{item.product.nombre}</h4>
                        {/* Mostrar talle si corresponde */}
                        {item.talle_nombre && (
                          <p className="text-xs text-muted-foreground">Talle: {item.talle_nombre}</p>
                        )}
                        <QuantityControl
                          quantity={item.quantity}
                          onUpdate={(newQuantity) => updateQuantity(item.product.id, newQuantity, item.talle_id)}
                          stock={item.product.stock}
                        />
                      </div>
                      <div className="text-right">
                        {/* Mostrar moneda junto al precio del ítem */}
                        <p className="font-medium text-sm">
                          {item.product.moneda === 'ARS' ? '$' : 'USD'}{" "}
                          {(item.product.precio * item.quantity).toLocaleString("es-AR")}
                        </p>
                      </div>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>${totalPrice.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>

              {totalPrice < 100000 && (
                <Card className="border-amber-200 bg-amber-50">
                  <CardContent className="py-4">
                    <p className="text-sm text-amber-800">💡 Agrega ${(100000 - totalPrice).toFixed(2)} más para obtener envío gratuito</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Footer fijo con acciones en su propia Card */}
            <div className="flex-shrink-0 pt-6 mx-4 mb-8">
              <Card>
                <CardContent className="pt-4 space-y-2 mb-4">
                  <Link href="/checkout" onClick={() => setIsOpen(false)}>
                    <Button className="w-full" size="lg">
                      Datos de Envío y Pago
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full mt-4" onClick={() => setIsOpen(false)}>
                    Volver a la tienda
                  </Button>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
