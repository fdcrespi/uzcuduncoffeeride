import { NextResponse } from 'next/server';
import { createCheckoutLink } from '@/lib/payway';

export async function POST(request: Request) {
  const body = await request.json();
  const { amount } = body;

  try {
    const result: any = await createCheckoutLink({
      total_price: amount,
      //site_transaction_id: orderId,
      products: body.products,
      shippingData: body.shippingData,
      shippingPrice: body.shippingPrice,
      success_url: `${process.env.NEXT_PUBLIC_URL}/api/checkout/status`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/products`
    });
    
    // El resultado puede tener id o hash dependiendo de la versión del SDK/API
    const paymentHash = result;

    return NextResponse.json({ url: `${paymentHash}`, paymentHash: paymentHash }, { status: 200});
  } catch (error) {
    console.error("Error al generar link de pago:", error);
    return NextResponse.json({ error: "Error al generar link de pago" }, { status: 500 });
  }
}