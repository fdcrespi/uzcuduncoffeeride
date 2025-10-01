import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

type ReorderItem = { id: number; orden: number };

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const productId = Number(params.id);
  if (Number.isNaN(productId)) {
    return new NextResponse(JSON.stringify({ message: 'ID inválido' }), { status: 400 });
  }

  const body = await req.json().catch(() => ({}));
  const { order } = body as { order: ReorderItem[] };

  if (!Array.isArray(order) || order.length === 0) {
    return new NextResponse(JSON.stringify({ message: 'Formato inválido: se espera order[]' }), { status: 400 });
  }

  const client = await db.connect();
  try {
    await client.query('BEGIN');

    // Validar que todos pertenezcan al producto
    const ids = order.map(o => o.id);
    const check = await client.query(
      `SELECT id FROM Producto_Imagen WHERE producto_id = $1 AND id = ANY($2::int[])`,
      [productId, ids]
    );
    if (check.rowCount !== ids.length) {
      await client.query('ROLLBACK');
      return new NextResponse(JSON.stringify({ message: 'Alguna imagen no pertenece al producto' }), { status: 400 });
    }

    // Normalizar y aplicar (1..N)
    const normalized = [...order]
      .sort((a, b) => a.orden - b.orden)
      .map((o, idx) => ({ id: o.id, orden: idx + 1 }));

    for (const item of normalized) {
      await client.query(
        `UPDATE Producto_Imagen SET orden = $1 WHERE id = $2`,
        [item.orden, item.id]
      );
    }

    await client.query('COMMIT');
    return new NextResponse(null, { status: 204 });
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Error en reorder imágenes:', e);
    return new NextResponse(JSON.stringify({ message: 'Error al reordenar' }), { status: 500 });
  } finally {
    client.release();
  }
}
