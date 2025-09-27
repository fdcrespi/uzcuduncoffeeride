import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
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
      WHERE sp.sucursal_id = 1
      ORDER BY p.id DESC
    `);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const client = await db.connect();
  try {
    const { nombre, descripcion, image, subrubro_id, precio, stock } = await request.json();

    await client.query('BEGIN');

    const productResult = await client.query(
      'INSERT INTO producto (nombre, descripcion, image, subrubro_id) VALUES ($1, $2, $3, $4) RETURNING id, nombre, descripcion, image, subrubro_id',
      [nombre, descripcion, image, subrubro_id]
    );
    const newProduct = productResult.rows[0];

    const stockPriceResult = await client.query(
      'INSERT INTO sucursal_productos (producto_id, sucursal_id, precio, stock) VALUES ($1, $2, $3, $4) RETURNING precio, stock',
      [newProduct.id, 1, precio, stock]
    );
    const newStockPrice = stockPriceResult.rows[0];

    await client.query('COMMIT');

    const result = {
      ...newProduct,
      precio: newStockPrice.precio,
      stock: newStockPrice.stock,
      subrubro_nombre: '' // Sub-category name is not available here, the client will have to fetch it or handle it
    };

    return NextResponse.json(result, { status: 201 });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating product:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  } finally {
    client.release();
  }
}
