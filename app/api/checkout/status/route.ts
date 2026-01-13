// endpoint de recibir los datos del pago exitoso desde payway
import { getPaymentStatus } from '@/lib/payway';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // get params result from url
  const { searchParams } = new URL(request.url);
  const result = searchParams.get('result');
  console.log('Payment result:', result);

  // Consulta estado de resultado de pago si es necesario
  if (result) {
    const paymentStatus = await getPaymentStatus(result);
    console.log('Payment status details:', paymentStatus); // Aquí puedes procesar el estado del pago si es necesario
  }

  // redirect to checkout success page
  const redirectUrl = `${process.env.NEXT_PUBLIC_URL}/checkout/success`;
  return NextResponse.redirect(redirectUrl);
}