// En app/checkout/success/page.tsx (o similar)
"use client";

import { CheckCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { use, useEffect } from 'react';

import io from 'socket.io-client';
import { toast } from "@/hooks/use-toast";
const socket = io(process.env.NEXT_PUBLIC_URL!);

export default function SuccessPage() {

  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  // const status = searchParams.get('status');
  // const external_reference = searchParams.get('external_reference');

  //console.log("Payment ID:", payment_id);
  //console.log("Status:", status);
  //console.log("External Reference:", external_reference);
  useEffect(() => {
    socket.emit('updateProducto', 'Producto actualizado');
    socket.emit('addPedido', 'Nuevo pedido realizado');
    if (orderId) {
      updatePedido(orderId);
    }
  }, []);

  async function updatePedido(orderId: string) {
    if (!orderId) {
      toast({
        title: "Error al actualizar el pedido",
        description: "Hubo un problema al actualizar el pedido. Intenta de nuevo.",
        variant: "destructive",
      });
      return;
    }
    try {
      const res = await fetch('/api/orders', {
        method: 'PUT',
        body: JSON.stringify({ orderId: orderId }),
      });
      const data = await res.json();
      if (data.success) {
        toast({
          title: "Pedido actualizado",
          description: "El pedido ha sido actualizado con éxito.",
          variant: "default",
        });
      } else {
        toast({
          title: "Error al actualizar el pedido",
          description: "Hubo un problema al actualizar el pedido. Intenta de nuevo.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({ 
        title: "Error al actualizar el pedido",
        description: "Hubo un problema al actualizar el pedido. Intenta de nuevo.",
        variant: "destructive",
      });
    }
  }


  return (
    <div className="container mt-4 mx-auto p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">¡Gracias por tu compra!</h1>
      <div className="flex justify-center">
        <CheckCircle className="text-green-500 w-16 h-16 mb-4" />
      </div>
      <p className="mb-2">Tu pago ha sido procesado con éxito.</p>
      {/* <p className="mb-2">ID de Pago: {payment_id}</p>
      <p className="mb-2">Estado: {status}</p>
      <p className="mb-2">Referencia Externa: {external_reference}</p> */}
      <p className="mt-4">Te enviaremos un correo con los detalles de tu pedido.</p>
      <div className="mt-6">
        <a href="/" className="text-blue-500 hover:underline">Volver al inicio</a>
      </div>
    </div>

  );
}