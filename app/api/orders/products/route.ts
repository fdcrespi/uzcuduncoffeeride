import { db } from "@/lib/db";
import { NextResponse } from "next/server";

/* Se obtienen los productos más vendidos */
export async function GET(req: Request) {
  try {
    const { rows } = await db.query(
      `SELECT 
        p.id,
        p.nombre,
        p.descripcion,
        sp.precio,
        sp.moneda,
        sp.stock,
        sr.nombre AS category,
        SUM(pp.cantidad) AS total_vendidos
      FROM pedido_productos pp
      JOIN producto p ON p.id = pp.producto_id
      JOIN sucursal_productos sp ON sp.producto_id = p.id
      JOIN subrubro sr ON sr.id = p.subrubro_id
      GROUP BY p.id, p.nombre, p.descripcion, sp.precio, sp.moneda, sp.stock, sr.nombre
      ORDER BY total_vendidos DESC
      LIMIT 4`
    );
    if (rows.length === 0) {
      return new NextResponse('No se encontraron productos pedidos', { status: 404 });
    }
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching order:', error);
    return new NextResponse('Error Interno del Servidor', { status: 500 });
  }
}