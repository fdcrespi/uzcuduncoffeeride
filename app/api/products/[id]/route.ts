import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { rows } = await db.query(`
      SELECT
        p.id,
        p.nombre,
        p.descripcion,
        p.image,
        p.subrubro_id,
        s.nombre as subrubro_nombre,
        sp.precio,
        sp.stock
      FROM producto p
      LEFT JOIN subrubro s ON p.subrubro_id = s.id
      LEFT JOIN sucursal_productos sp ON p.id = sp.producto_id
      WHERE p.id = $1 AND sp.sucursal_id = 1
    `, [params.id]);

    if (rows.length === 0) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const client = await db.connect();
  try {
    const { nombre, descripcion, image, subrubro_id, precio, stock } = await request.json();

    await client.query('BEGIN');

    await client.query(
      'UPDATE producto SET nombre = $1, descripcion = $2, image = $3, subrubro_id = $4 WHERE id = $5',
      [nombre, descripcion, image, subrubro_id, params.id]
    );

    await client.query(
      'UPDATE sucursal_productos SET precio = $1, stock = $2 WHERE producto_id = $3 AND sucursal_id = $4',
      [precio, stock, params.id, 1]
    );

    await client.query('COMMIT');

    return NextResponse.json({ id: params.id, nombre, descripcion, image, subrubro_id, precio, stock });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating product:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await db.query('DELETE FROM producto WHERE id = $1', [params.id]);
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    if (error.code === '23503') { // foreign_key_violation
      return NextResponse.json({ message: 'No se puede eliminar el producto porque está asociado a uno o más pedidos.' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
