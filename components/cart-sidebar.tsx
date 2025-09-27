"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

export function CartSidebar() {
  const { items, updateQuantity, removeItem, getTotalItems, getTotalPrice } = useCart()
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
      <SheetContent className="w-full sm:max-w-lg">
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
          <div className="flex flex-col h-full px-3">
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4 py-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center space-x-4">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden">
                      <Image
                        src={item.product.image || "/placeholder.svg"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate">{item.product.name}</h4>
                      <p className="text-sm text-muted-foreground">${item.product.price.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-8 h-8 bg-transparent"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-8 h-8 bg-transparent"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 text-destructive hover:text-destructive"
                        onClick={() => removeItem(item.product.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="space-y-4 pt-4 border-t px-3">
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>${totalPrice.toLocaleString()}</span>
              </div>
              <div className="space-y-2">
                <Link href="/checkout" onClick={() => setIsOpen(false)}>
                  <Button className="w-full my-3" size="lg">
                    Confirmar Compra
                  </Button>
                </Link>
                <Button variant="outline" className="w-full bg-transparent mb-6" onClick={() => setIsOpen(false)}>
                  Volver a la tienda
                </Button>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
