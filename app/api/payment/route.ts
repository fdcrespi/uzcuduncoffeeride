//Aqui recibiremos los avisos una vez que se concrete un pago en MERCADO PAGO
import type { NextRequest } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { db } from "@/lib/db";

const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

import io from "socket.io-client";
const SOCKET_URL =
  process.env.SOCKET_SERVER_URL ||           // opcional (server-only)
  process.env.NEXT_PUBLIC_SOCKET_URL ||      // si lo definiste
  "http://localhost:3000";                   // dev por defecto

const socket = io(SOCKET_URL, { transports: ["websocket"] });


export async function POST(request: NextRequest) {
  if (request.nextUrl.searchParams.get("topic") !== "payment")
    return Response.json({ success: true }); //Siempre informar a MP que recibi la notificacion.
  if (request.nextUrl.searchParams.get("source_news") !== "ipn")
    return Response.json({ success: true });

  const paymentId = request.nextUrl.searchParams.get("id");

  //console.log(paymentId);
  console.log("=== NOTIFICACION DE PAGO RECIBIDA DE MP ===");

  new Promise<void>(async (resolve, reject) => {
    try {
      const payment = await new Payment(mercadopago).get({
        id: parseFloat(paymentId!),
      });
      if (payment.status != "approved") {
        return Response.json({ success: true });
      }

      const pedido = {
        id: payment.id,
        amount: payment.transaction_amount,
        net_amount: payment.transaction_details?.net_received_amount,
        message: payment.description,
        status: payment.status,
        /* payer_email: payment.payer?.email, */
        payer_first_name: payment.metadata?.name,
        /* payer_last_name: payment.payer?.last_name,
        payer_dni: payment.payer?.identification?.number,
        payer_phone:
          payment.payer?.phone?.area_code + "-" + payment.payer?.phone?.number, */
        cart: payment.metadata.cart,
        option: payment.metadata?.option,
        name: payment.metadata?.name,
        address: payment.metadata?.address,
        phone: payment.metadata?.phone,
        delivery_price: payment.metadata?.delivery_price,
        payerZip: payment.metadata?.zip,
        //y demas info que sea necesaria
      };
      /* console.log("===== PAYMENT=======");
      console.log(payment); 
      console.log("===== PEDIDO=======");
      console.log(pedido);*/

      try {
        //Insertar el pedido en la base de datos
        //console.log("Insertando pedido en la base de datos...", pedido);
        const resultPedido = await db.query(
          `INSERT INTO Pedido (pago, modo_entrega_id, mp_id, payer_name, payer_address, payer_phone, total, delivery, payer_zip) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          RETURNING id`,
          [
            true,
            pedido.option === "delivery" ? 1 : 2,
            pedido.id,
            pedido.payer_first_name,
            pedido.address,
            pedido.phone,
            pedido.amount,
            pedido.delivery_price,
            pedido.payerZip,
          ]
        );
        //const resultPedido = ;
        //console.log("Pedido insertado en la base de datos:", resultPedido);
        //console.log("Id.", resultPedido.rows[0].id,);

        const pedidoCart = pedido.cart;
        for (const item of pedidoCart) {
          await db.query(
            `INSERT INTO Pedido_Productos (pedido_id, producto_id, cantidad, precio, talle_id) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [resultPedido.rows[0].id, parseInt(item.id), item.cantidad, item.precio, item.talle_id ?? null]
          );
        }
        socket.emit('addPedido', 'Sync Process Completed');
      } catch (error) {
        console.error("Error al insertar pedido en la base de datos:", error);
        return Response.json({ success: false });
      }
    } catch (error) {
      console.error("Error al obtener el pago de MP:", error);
      return Response.json({ success: false });
    }
  });

  //Es importante que en paralelo a la promise que se ejecuta arriba se le envie a MP el response OK, ya que hay un tiempo limite para informarles que recibimos la notificacion
  return Response.json({ success: true });
}
