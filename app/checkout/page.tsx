"use client";

import type React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { QuantityControl } from "@/components/ui/quantity-control";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/contexts/cart-context";
import { ArrowLeft, Shield, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, ChangeEvent } from "react";
import { toast } from "@/hooks/use-toast";
import type { CartItem } from "@/lib/types";
import { Header } from "@/components/layout/header";

// Definición de tipos
interface ShippingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  notes: string;
}

interface ShippingFormProps {
  shippingData: ShippingData;
  setShippingData: (data: ShippingData) => void;
  isMobile: boolean;
  onStepForward: () => void;
}

interface OrderSummaryProps {
  items: CartItem[];
  totalPrice: number;
  shipping: number;
  finalTotal: number;
  isProcessing: boolean;
  handleCreatePreference: () => void;
  preferenceId: string | null;
  isMobile: boolean;
  onBack: () => void;
  updateQuantity: (productId: string, quantity: number) => void;
}

// Sub-componente: ShippingForm
const ShippingForm: React.FC<ShippingFormProps> = ({ shippingData, setShippingData, onStepForward }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setShippingData({ ...shippingData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStepForward();
  };

  return (    
    <form onSubmit={handleSubmit} id="shipping-form">
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
              <Input id="firstName" name="firstName" value={shippingData.firstName} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="lastName">Apellido</Label>
              <Input id="lastName" name="lastName" value={shippingData.lastName} onChange={handleChange} required />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" value={shippingData.email} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="phone">Teléfono</Label>
            <Input id="phone" name="phone" value={shippingData.phone} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="address">Dirección</Label>
            <Input id="address" name="address" value={shippingData.address} onChange={handleChange} required />
          </div>
          <div className="flex gap-4">
            <div className="flex-1 basis-[60%]">
              <Label htmlFor="city">Ciudad</Label>
              <Input id="city" name="city" value={shippingData.city} onChange={handleChange} required />
            </div>
            <div className="flex-1 basis-[30%]">
              <Label htmlFor="zipCode">Cod.Postal</Label>
              <Input id="zipCode" name="zipCode" value={shippingData.zipCode} onChange={handleChange} required />
            </div>
          </div>
          <div>
            <Label htmlFor="notes">Notas del pedido (opcional)</Label>
            <Textarea id="notes" name="notes" value={shippingData.notes} onChange={handleChange} placeholder="Instrucciones especiales de entrega..." />
          </div>
        </CardContent>
      </Card>
    </form>
  );
};




// Sub-componente: OrderSummary
const OrderSummary: React.FC<OrderSummaryProps> = ({ items, totalPrice, shipping, finalTotal, isProcessing, handleCreatePreference, preferenceId, isMobile, onBack, updateQuantity }) => (
  <div className="flex flex-col h-full">
    {/* Área de contenido con scroll */}
    <div className="flex-grow overflow-y-auto space-y-6 pr-2">
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
                <QuantityControl
                  quantity={item.quantity}
                  // A futuro, controlar que no se pase del stock máximo al incrementar.
                  onUpdate={(newQuantity) => updateQuantity(item.product.id, newQuantity)}
                />
              </div>
              <div className="text-right">
                <p className="font-medium">${(item.product.precio * item.quantity).toLocaleString()}</p>
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
              <span>{shipping === 0 ? "Gratis" : `${shipping}`}</span>
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

// Componente Principal: CheckoutPage
export default function CheckoutPage() {
  const { items, getTotalPrice, updateQuantity } = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(1);
  const [shippingData, setShippingData] = useState<ShippingData>({
    firstName: "", lastName: "", email: "", phone: "", address: "", city: "", zipCode: "", notes: "",
  });
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const mpKey = process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY;
    if (mpKey) {
      initMercadoPago(mpKey, { locale: "es-AR" });
    }
  }, []);

  useEffect(() => {
    // Si el carrito se vacía, invalida cualquier preferencia de pago existente
    // y redirige al usuario de vuelta a la tienda.
    if (items.length === 0 && !isProcessing) {
      setPreferenceId(null);
      router.push('/');
    }
  }, [items, isProcessing, router]);

  const totalPrice = getTotalPrice();
  const shipping = totalPrice > 100 ? 0 : 15; // Esto será dinámico más adelante
  const finalTotal = totalPrice + shipping;

  const handleCreatePreference = async () => {
    const { notes, ...requiredData } = shippingData;
    const isFormValid = Object.values(requiredData).every(value => value.trim() !== "");

    if (!isFormValid) {
      toast({
        title: "Formulario incompleto",
        description: "Por favor, completa todos los campos de envío requeridos.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch("/api/mercadopago/preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, shippingData }),
      });

      if (!response.ok) throw new Error("Failed to create preference");

      const { id } = await response.json();
      setPreferenceId(id);

    } catch (error) {
      console.error(error);
      toast({
        title: "Error al crear el pago",
        description: "Hubo un problema al conectar con Mercado Pago. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0 && !isProcessing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Tu carrito está vacío</h1>
          <p className="text-muted-foreground mb-6">Agrega algunos productos antes de proceder al checkout</p>
          {/* <Link href="/"><Button><ArrowLeft className="w-4 h-4 mr-2" />Volver a la tienda</Button></Link> */}
        </div>
      </div>
    );
  }

  const orderSummaryProps = { items, totalPrice, shipping, finalTotal, isProcessing, handleCreatePreference, preferenceId, isMobile, onBack: () => setStep(1), updateQuantity };

  return (
    <div className="min-h-screen bg-background">
       {/*{!isMobile && (
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-2">
                <ArrowLeft className="w-5 h-5" />
                <span className="font-semibold">Volver a la tienda</span>
              </Link>
              <div className="w-24" />
            </div>
          </div>
        </header>
      )} */}

      <div className="container mx-auto px-4 py-8">
        {isMobile ? (
          step === 1 ? (
            <div className="flex flex-col h-[calc(100vh-112px)]">
              <div className="flex-grow overflow-y-auto pr-2">
                <ShippingForm shippingData={shippingData} setShippingData={setShippingData} isMobile={isMobile} onStepForward={() => setStep(2)} />
              </div>
              <div className="flex-shrink-0 pt-4">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <Button type="submit" form="shipping-form" className="w-full" size="lg">
                      Continuar al resumen
                    </Button>
                    <Link href="/" className="w-full inline-block text-center">
                      <Button className="w-full" size="lg" variant="outline">
                        Volver a la tienda
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="h-[calc(100vh-112px)]">
              <OrderSummary {...orderSummaryProps} />
            </div>
          )
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ShippingForm shippingData={shippingData} setShippingData={setShippingData} isMobile={isMobile} onStepForward={() => {}} />
            <OrderSummary {...orderSummaryProps} />
          </div>
        )}
      </div>
    </div>
  );
}
