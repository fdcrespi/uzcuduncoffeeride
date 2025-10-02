import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { paymentId, status } = await req.json();

    if (!paymentId || !status) {
      return NextResponse.json(
        { error: "Se requieren paymentId y status" },
        { status: 400 }
      );
    }

    // Aquí deberías verificar el estado del pago con Mercado Pago usando su API
    // y asegurarte de que el pago fue realmente aprobado antes de crear el pedido.
    // Por simplicidad, asumimos que si recibimos 'approved', el pago es válido.

    if (status !== 'approved') {
      return NextResponse.json(
        { error: "El pago no fue aprobado" },
        { status: 400 }
      );
    }

    // Crear el pedido en la base de datos
    const result = await db.query(
      `INSERT INTO Pedido (payment_id, status) VALUES ($1, $2) RETURNING id`,
      [paymentId, status]
    );

    const orderId = result.rows[0].id;

    return NextResponse.json(
      { message: "Pedido creado exitosamente", orderId },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error al crear el pedido:", error);
    return NextResponse.json(
      { error: "Error al crear el pedido" },
      { status: 500 }
    );
  }  
}