import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const orderId = parseInt(params.id, 10);
    if (isNaN(orderId)) {
      return new NextResponse('ID de pedido inválido', { status: 400 });
    }
    const { rows } = await db.query(
      `SELECT p.id, p.nombre, p.descripcion, op.cantidad, op.precio_unitario
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