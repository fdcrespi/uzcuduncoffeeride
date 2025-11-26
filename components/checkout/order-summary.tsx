"use client";

import type React from "react";
import { Wallet } from "@mercadopago/sdk-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { QuantityControl } from "@/components/ui/quantity-control";
import { Skeleton } from "@/components/ui/skeleton";
import type { CartItem } from "@/lib/types"; // Importa el tipo
import { ArrowLeft, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// **Props específicas para este componente**
interface OrderSummaryProps {
  items: CartItem[];
  totalPrice: number;
  shipping: number;
  finalTotal: number;
  isProcessing: boolean;
  handleCreatePreference: () => Promise<void>;
  preferenceId: string | null;
  isMobile: boolean;
  onBack: () => void;
  updateQuantity: (productId: string, quantity: number, talle_id?: number) => void;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({ items, totalPrice, shipping, finalTotal, isProcessing, handleCreatePreference, preferenceId, isMobile, onBack, updateQuantity }) => (
  <div className="flex flex-col h-full">
    {/* Área de contenido con scroll */}
    <div className="flex-grow overflow-y-auto space-y-6 pr-2">
      {/* ... El resumen del pedido con la Card ... */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen del Pedido</CardTitle>
          <CardDescription>
            {items.length} {items.length === 1 ? "artículo" : "artículos"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item) => (
            <div key={item.product.id} className="flex items-start space-x-4">
              <div className="relative w-16 h-16 rounded-md overflow-hidden">
                <Image src={item.product.image || "/placeholder.svg"} alt={item.product.nombre} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium leading-tight">{item.product.nombre}</h4>
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
                <p className="font-medium">
                  {item.product.moneda === 'ARS' ? '$' : 'USD'}{" "}
                  {(item.product.precio * item.quantity).toLocaleString("es-AR")}
                </p>
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
              <span>{shipping === 0 ? "Gratis" : `$${shipping.toFixed(2)}`}</span>
            </div>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-semibold">
            <span>Total:</span>
            <span>${finalTotal.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Footer fijo con acciones */}
    <div className="flex-shrink-0 pt-4">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4" />
            <span>Compra segura y protegida</span>
          </div>

          {preferenceId ? (
            // Componente de Mercado Pago. ¡Asegúrate de que 'initMercadoPago' se haya ejecutado en un componente padre o en un wrapper!
            <Wallet initialization={{ preferenceId }} />
          ) : isProcessing ? (
            <Skeleton className="h-11 w-full" />
          ) : (
            <Button onClick={handleCreatePreference} className="w-full" size="lg">
              {"Confirmar y Pagar"}
            </Button>
          )}

          {isMobile && (
            <Button onClick={onBack} className="w-full" size="lg" variant="outline">
              Volver
            </Button>
          )}

          {!isMobile && (
            <Link href="/" className="w-full inline-block text-center">
              <Button className="w-full" size="lg" variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a la tienda
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>
    </div>
  </div>
);