// app/api/products/[id]/images/[imageId]/route.ts
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

/**
 * PATCH /api/products/:id/images/:imageId
 * Body (uno o ambos):
 *  - { is_principal: boolean }
 *  - { orden: number }   // mueve la imagen a esa posición (1..N) y reajusta el resto
 */
export async function PATCH(
  req: Request,
  { params }: { params: { id: string; imageId: string } }
) {
  const productId = Number(params.id);
  const imageId = Number(params.imageId);
  if (Number.isNaN(productId) || Number.isNaN(imageId)) {
    return new NextResponse(JSON.stringify({ message: 'IDs inválidos' }), { status: 400 });
  }

  const body = await req.json().catch(() => ({}));
  const { is_principal, orden } = body as { is_principal?: boolean; orden?: number };

  if (typeof is_principal === 'undefined' && typeof orden === 'undefined') {
    return new NextResponse(JSON.stringify({ message: 'Nada para actualizar' }), { status: 400 });
  }

  const client = await db.connect();
  try {
    await client.query('BEGIN');

    // Validar que la imagen pertenezca al producto
    const exists = await client.query(
      `SELECT id FROM Producto_Imagen WHERE id = $1 AND producto_id = $2`,
      [imageId, productId]
    );
    if (exists.rowCount === 0) {
      await client.query('ROLLBACK');
      return new NextResponse(JSON.stringify({ message: 'Imagen no encontrada' }), { status: 404 });
    }

    // 1) Marcar/desmarcar principal
    if (typeof is_principal !== 'undefined') {
      // Si seteás TRUE, el trigger BEFORE UPDATE se encarga de desmarcar otras principales del mismo producto
      await client.query(
        `UPDATE Producto_Imagen SET is_principal = $1 WHERE id = $2`,
        [!!is_principal, imageId]
      );
    }

    // 2) Mover orden individual (reindexando de forma determinística 1..N)
    if (typeof orden !== 'undefined') {
      // Obtener todas las imágenes salvo la actual, en orden
      const imgsRes = await client.query(
        `SELECT id FROM Producto_Imagen
         WHERE producto_id = $1 AND id <> $2
         ORDER BY orden ASC`,
        [productId, imageId]
      );

      const others = imgsRes.rows.map((r: any) => r.id);
      const targetIndex = Math.max(0, Math.min(Number(orden) - 1, others.length));
      // Insertar la imagen actual en la posición solicitada
      others.splice(targetIndex, 0, imageId);

      // Aplicar orden 1..N
      for (let i = 0; i < others.length; i++) {
        await client.query(
          `UPDATE Producto_Imagen SET orden = $1 WHERE id = $2`,
          [i + 1, others[i]]
        );
      }
    }

    await client.query('COMMIT');
    return new NextResponse(null, { status: 204 });
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Error al actualizar imagen:', e);
    return new NextResponse(JSON.stringify({ message: 'Error al actualizar imagen' }), { status: 500 });
  } finally {
    client.release();
  }
}

/**
 * DELETE /api/products/:id/images/:imageId
 * Elimina la imagen. Si era principal, tu trigger AFTER DELETE en DB promueve la de menor 'orden'.
 */
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string; imageId: string } }
) {
  const productId = Number(params.id);
  const imageId = Number(params.imageId);
  if (Number.isNaN(productId) || Number.isNaN(imageId)) {
    return new NextResponse(JSON.stringify({ message: 'IDs inválidos' }), { status: 400 });
  }

  const client = await db.connect();
  try {
    await client.query('BEGIN');

    const del = await client.query(
      `DELETE FROM Producto_Imagen
       WHERE id = $1 AND producto_id = $2
       RETURNING id`,
      [imageId, productId]
    );

    if (del.rowCount === 0) {
      await client.query('ROLLBACK');
      return new NextResponse(JSON.stringify({ message: 'Imagen no encontrada' }), { status: 404 });
    }

    // Si fue la principal, el trigger AFTER DELETE ya deja otra como principal (menor orden)
    await client.query('COMMIT');
    return new NextResponse(null, { status: 204 });
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Error al borrar imagen:', e);
    return new NextResponse(JSON.stringify({ message: 'Error al borrar imagen' }), { status: 500 });
  } finally {
    client.release();
  }
}
