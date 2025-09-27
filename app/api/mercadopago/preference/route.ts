import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";

export async function POST(req: NextRequest) {
  console.log("Reading environment variables...");
  console.log("MERCADOPAGO_ACCESS_TOKEN exists:", !!process.env.MERCADOPAGO_ACCESS_TOKEN);
  console.log("NEXT_PUBLIC_URL:", process.env.NEXT_PUBLIC_URL);

  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

  if (!accessToken) {
    console.error("Mercado Pago access token is not set.");
    return NextResponse.json(
      { error: "El servidor no está configurado para procesar pagos." },
      { status: 500 }
    );
  }

  const client = new MercadoPagoConfig({ accessToken });

  const backUrl = process.env.NEXT_PUBLIC_URL;
  if (!backUrl) {
    console.error("NEXT_PUBLIC_URL environment variable is not set.");
    return NextResponse.json(
      { error: "La URL de retorno del servidor no está configurada." },
      { status: 500 }
    );
  }

  try {
    const { items, shippingData } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Se requieren artículos en el carrito" },
        { status: 400 }
      );
    }

    if (!shippingData) {
      return NextResponse.json(
        { error: "Se requieren datos de envío" },
        { status: 400 }
      );
    }

    const preferenceItems = items.map((item: any) => ({
      id: item.product.id,
      title: item.product.name,
      quantity: item.quantity,
      unit_price: item.product.price,
      currency_id: "ARS", // Assuming Argentinian Peso
    }));

    const preference = new Preference(client);

    const preferenceBody = {
      items: preferenceItems,
      payer: {
        name: shippingData.firstName,
        surname: shippingData.lastName,
        email: shippingData.email,
        phone: {
          area_code: "",
          number: shippingData.phone.toString(),
        },
        address: {
          street_name: shippingData.address,
          street_number: "",
          zip_code: shippingData.zipCode,
        },
      },
      back_urls: {
        success: backUrl,
        failure: backUrl,
        pending: backUrl,
      },
    };

    console.log("Creating preference with body:", JSON.stringify(preferenceBody, null, 2));

    const result = await preference.create({ body: preferenceBody });

    return NextResponse.json({ id: result.id });
  } catch (error) {
    console.error("Error al crear la preferencia de Mercado Pago:", error);
    return NextResponse.json(
      { error: "Error al crear la preferencia de Mercado Pago" },
      { status: 500 }
    );
  }
}