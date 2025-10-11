"use client";

import React, { ChangeEvent } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Truck } from "lucide-react";
import type { ShippingData } from "@/lib/types"; // Importa el tipo

// **Props específicas para este componente**
interface ShippingFormProps {
  shippingData: ShippingData;
  setShippingData: (data: ShippingData) => void;
  onStepForward: () => void; // Solo necesario en móvil, pero mantenlo para la consistencia
}

export const ShippingForm: React.FC<ShippingFormProps> = ({ shippingData, setShippingData, onStepForward }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setShippingData({ ...shippingData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStepForward();
  };

  return (
    // ... el resto de la implementación de tu formulario
    <form onSubmit={handleSubmit} id="shipping-form">
      {/* ... El resto de tu Card y Content ... */}
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
            {/* ... Resto de campos ... */}
            <div>
              <Label htmlFor="lastName">Apellido</Label>
              <Input id="lastName" name="lastName" value={shippingData.lastName} onChange={handleChange} required />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" value={shippingData.email} onChange={handleChange} />
          </div>
          {/* ... otros campos y el Textarea ... */}
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