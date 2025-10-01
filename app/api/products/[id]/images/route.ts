import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const productId = Number(params.id);
  if (Number.isNaN(productId)) return new NextResponse('ID inválido', { status: 400 });

  const res = await db.query(
    `SELECT id, url, is_principal, orden
     FROM Producto_Imagen
     WHERE producto_id = $1
     ORDER BY orden ASC`,
    [productId]
  );
  return NextResponse.json(res.rows);
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const productId = Number(params.id);
  if (Number.isNaN(productId)) return new NextResponse('ID inválido', { status: 400 });

  const body = await request.json();
  // body.images: string[] (urls)
  const images: string[] = Array.isArray(body.images) ? body.images : [];
  if (images.length === 0) {
    return new NextResponse(JSON.stringify({ message: 'No hay imágenes para insertar' }), { status: 400 });
  }

  const client = await db.connect();
  try {
    await client.query('BEGIN');

    for (let i = 0; i < images.length; i++) {
      await client.query(
        `INSERT INTO Producto_Imagen (producto_id, url, orden)
         VALUES ($1, $2, (
            SELECT COALESCE(MAX(orden)+1, 1) FROM Producto_Imagen WHERE producto_id = $1
         ))`,
        [productId, images[i]]
      );
    }

    await client.query('COMMIT');
    return new NextResponse(null, { status: 201 });
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Error insertando imágenes:', e);
    return new NextResponse(JSON.stringify({ message: 'Error al insertar imágenes' }), { status: 500 });
  } finally {
    client.release();
  }
}

