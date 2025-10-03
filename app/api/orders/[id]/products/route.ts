import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: number } }) {
  try {
    const orderId = params.id
    if (isNaN(orderId)) {
      return new NextResponse('ID de pedido inválido', { status: 400 });
    }
    const { rows } = await db.query(
      `SELECT *
       FROM Pedido_Productos op
        JOIN Producto p ON op.producto_id = p.id
        WHERE op.pedido_id = $1`,
      [orderId]
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching order products:', error);
    return new NextResponse('Error Interno del Servidor', { status: 500 });
  }
}