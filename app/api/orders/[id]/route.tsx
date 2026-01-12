import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const orderId = parseInt(params.id, 10);
    if (isNaN(orderId)) {
      return new NextResponse('ID de pedido inválido', { status: 400 });
    }
    const { rows } = await db.query(
      'SELECT * FROM pedido WHERE id = $1',
      [orderId]
    );
    if (rows.length === 0) {
      return new NextResponse('Pedido no encontrado', { status: 404 });
    }
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error fetching order:', error);
    return new NextResponse('Error Interno del Servidor', { status: 500 });
  }
}


export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const orderId = parseInt(params.id, 10);
    if (isNaN(orderId)) {
      return new NextResponse('ID de pedido inválido', { status: 400 });
    }
    const {
  rows } = await db.query(
      'DELETE FROM pedido WHERE id = $1 RETURNING *',
      [orderId]
    );
    if (rows.length === 0) {
      return new NextResponse('Pedido no encontrado', { status: 404 });
    }
    return NextResponse.json({ message: 'Pedido eliminado exitosamente', order: rows[0] });
  } catch (error) {
    console.error('Error deleting order:', error);
    return new NextResponse('Error Interno del Servidor', { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const orderId = parseInt(params.id, 10);
    if (isNaN(orderId)) {
      return new NextResponse('ID de pedido inválido', { status: 400 });
    }
    const { status } = await req.json();
    if (!['pending', 'shipped', 'delivered', 'canceled', 'paid'].includes(status)) {
      return new NextResponse('Estado de pedido inválido', { status: 400 });
    }
    const { rows } = await db.query(
      'UPDATE pedido SET status = $1 WHERE id = $2 RETURNING *',
      [status, orderId]
    );
    if (rows.length === 0) {
      return new NextResponse('Pedido no encontrado', { status: 404 });
    }
    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error('Error updating order:', error);
    return new NextResponse('Error Interno del Servidor', { status: 500 });
  }
}