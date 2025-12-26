import { NextResponse } from 'next/server';
import { paywayClient } from '@/lib/payway';

export async function POST(request: Request) {
  const notification = await request.json();
  
  // Consultar el estado real del pago para mayor seguridad [14]
  paywayClient.paymentInfo(notification.id, (result: any, err: any) => {
    if (result && result.status === 'approved') {
      // AQUÍ: Lógica para actualizar el pedido en tu BD PostgreSQL [15]
      console.log("Pago aprobado para el ID:", result.id);
    }
  });

  return NextResponse.json({ status: "received" });
}