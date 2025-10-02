// En app/checkout/success/page.tsx (o similar)
"use client";

import { CheckCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function SuccessPage() {

  const searchParams = useSearchParams();
  const payment_id = searchParams.get('payment_id');
  const status = searchParams.get('status');
  const external_reference = searchParams.get('external_reference');

  console.log("Payment ID:", payment_id);
  console.log("Status:", status);
  console.log("External Reference:", external_reference);


  return (
    <div className="container mt-4 mx-auto p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">¡Gracias por tu compra!</h1>
      <div className="flex justify-center">
        <CheckCircle className="text-green-500 w-16 h-16 mb-4" />
      </div>
      <p className="mb-2">Tu pago ha sido procesado con éxito.</p>
      <p className="mb-2">ID de Pago: {payment_id}</p>
      <p className="mb-2">Estado: {status}</p>
      <p className="mb-2">Referencia Externa: {external_reference}</p>
      <p className="mt-4">Te enviaremos un correo con los detalles de tu pedido.</p>
      <div className="mt-6">
        <a href="/" className="text-blue-500 hover:underline">Volver al inicio</a>
      </div>
    </div>

  );
}