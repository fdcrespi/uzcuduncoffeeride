// En app/checkout/success/page.tsx (o similar)
import { useSearchParams, useRouter } from 'next/navigation';
import { use, useEffect } from 'react';

export default function SuccessPage() {

  const searchParams = useSearchParams();
  const payment_id = searchParams.get('payment_id');
  const status = searchParams.get('status');
  const external_reference = searchParams.get('external_reference');

  console.log("Payment ID:", payment_id);
  console.log("Status:", status);
  console.log("External Reference:", external_reference);


  return (
    <div>
      <h1>Pago Exitoso</h1>
      <p>Gracias por tu compra. Tu pago ha sido procesado exitosamente.</p>
    </div>
  );
}