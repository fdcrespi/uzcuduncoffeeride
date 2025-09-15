"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCart } from "@/contexts/cart-context"
import { ArrowLeft, CreditCard, Truck, Shield } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { toast } from "@/hooks/use-toast"

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)

  const totalPrice = getTotalPrice()
  const shipping = totalPrice > 100 ? 0 : 15
  const tax = totalPrice * 0.1
  const finalTotal = totalPrice + shipping + tax

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast({
      title: "¡Pedido confirmado!",
      description: "Recibirás un email de confirmación en breve.",
    })

    clearCart()
    setIsProcessing(false)
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Tu carrito está vacío</h1>
          <p className="text-muted-foreground mb-6">Agrega algunos productos antes de proceder al checkout</p>
          <Link href="/">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a la tienda
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Volver a la tienda</span>
            </Link>
            <h1 className="text-xl font-bold">Checkout</h1>
            <div className="w-24" /> {/* Spacer */}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Información de Envío
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Nombre</Label>
                    <Input id="firstName" placeholder="Juan" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Apellido</Label>
                    <Input id="lastName" placeholder="Pérez" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="juan@ejemplo.com" />
                </div>
                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input id="phone" placeholder="+1 (555) 123-4567" />
                </div>
                <div>
                  <Label htmlFor="address">Dirección</Label>
                  <Input id="address" placeholder="Calle Principal 123" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">Ciudad</Label>
                    <Input id="city" placeholder="Ciudad" />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">Código Postal</Label>
                    <Input id="zipCode" placeholder="12345" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="notes">Notas del pedido (opcional)</Label>
                  <Textarea id="notes" placeholder="Instrucciones especiales de entrega..." />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Información de Pago
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="paymentMethod">Método de Pago</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona método de pago" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit">Tarjeta de Crédito</SelectItem>
                      <SelectItem value="debit">Tarjeta de Débito</SelectItem>
                      <SelectItem value="transfer">Transferencia Bancaria</SelectItem>
                      <SelectItem value="cash">Efectivo (Contra entrega)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="cardNumber">Número de Tarjeta</Label>
                  <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Vencimiento</Label>
                    <Input id="expiry" placeholder="MM/AA" />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" placeholder="123" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
                <CardDescription>
                  {items.length} {items.length === 1 ? "artículo" : "artículos"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product.name}</h4>
                      <p className="text-sm text-muted-foreground">Cantidad: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${(item.product.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Envío:</span>
                    <span>{shipping === 0 ? "Gratis" : `$${shipping}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Impuestos:</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                  <Shield className="w-4 h-4" />
                  <span>Compra segura y protegida</span>
                </div>
                <form onSubmit={handleSubmitOrder}>
                  <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
                    {isProcessing ? "Procesando..." : `Confirmar Pedido - $${finalTotal.toFixed(2)}`}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {totalPrice < 100 && (
              <Card className="border-amber-200 bg-amber-50">
                <CardContent className="pt-6">
                  <p className="text-sm text-amber-800">
                    💡 Agrega ${(100 - totalPrice).toFixed(2)} más para obtener envío gratuito
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
