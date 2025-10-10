import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { metadata } from "@/app/layout";

export async function POST(req: NextRequest) {
  /* console.log("Reading environment variables...");
  console.log("MERCADOPAGO_ACCESS_TOKEN exists:", !!process.env.MERCADOPAGO_ACCESS_TOKEN);
  console.log("NEXT_PUBLIC_URL:", process.env.NEXT_PUBLIC_URL); */

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
    const { items, shippingData, shipping } = await req.json();

    //console.log("Received items:", items);
    //console.log("Received shippingData:", shippingData);


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
      title: item.product.nombre,
      quantity: item.quantity,
      unit_price: item.product.precio,
      currency_id: "ARS",
    }));

    if (shipping && shipping > 0) {
      preferenceItems.push({
        id: "envio",
        title: "Costo de envío",
        quantity: 1,
        unit_price: shipping,
        currency_id: "ARS",
      });
    }

    const preferenceBody = {
      items: preferenceItems,
      statement_descriptor: "Uzcudun Ride",
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
        success: `${process.env.NEXT_PUBLIC_URL}/checkout/success`, // Ruta para pago exitoso
        failure: `${process.env.NEXT_PUBLIC_URL}/checkout/failure`, // Ruta para pago fallido
        pending: `${process.env.NEXT_PUBLIC_URL}/checkout/pending`, // Ruta para pago pendiente
      },
      notification_url: process.env.MP_NOTIFICATION_URL, //Esto para cuando tengamos el endpoint del backend      
      auto_return: "approved",  // Descomentar si queremos que redirija automáticamente al usuario cuando el pago esté aprobado, hay que implementar el endpoint en el backend y la notification_url
      metadata: {
        cart: items.map((item: any) => ({
          id: item.product.id,
          nombre: item.product.nombre,
          cantidad: item.quantity,
          precio: item.product.precio,
        })),
        option: shippingData.option || "delivery", // "delivery" o "pickup"
        name: `${shippingData.firstName} ${shippingData.lastName}`,
        address: shippingData.address,
        phone: shippingData.phone,
        delivery_price: shipping || 0,
        zip: shippingData.zipCode
      },
      // Otros campos opcionales como "external_reference", "expires", etc., se pueden agregar aquí según sea necesario
    };

    //console.log("Creating preference with body:", JSON.stringify(preferenceBody, null, 2));
    const preference = new Preference(client);
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