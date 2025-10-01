import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const productId = parseInt(params.id, 10);
    if (isNaN(productId)) {
      return new NextResponse('ID de producto inválido', { status: 400 });
    }

    const sucursalId = 1; // Asumimos una única sucursal

    const result = await db.query(
      `
      SELECT 
        p.id, 
        p.nombre, 
        p.descripcion, 
        p.subrubro_id,
        sp.precio, 
        sp.stock,
        pp.cover_url,
      COALESCE(
          (
            SELECT json_agg(json_build_object('id', pi.id, 'url', pi.url, 'is_principal', pi.is_principal, 'orden', pi.orden)
                            ORDER BY pi.orden ASC)
            FROM Producto_Imagen pi 
            WHERE pi.producto_id = p.id
          ), '[]'::json
        ) AS images
      FROM Producto p
      LEFT JOIN Sucursal_Productos sp 
        ON p.id = sp.producto_id AND sp.sucursal_id = $2
      LEFT JOIN Producto_Portada pp 
        ON pp.producto_id = p.id
      WHERE p.id = $1
      `,
      [productId, sucursalId]
    );


    if (result.rows.length === 0) {
      return new NextResponse('Producto no encontrado', { status: 404 });
    }

    const row = result.rows[0];

    const product = {
      id: String(row.id),
      nombre: row.nombre,
      descripcion: row.descripcion,
      precio: row.precio !== null ? Number(row.precio) : 0,
      stock: row.stock !== null ? Number(row.stock) : 0,
      subrubro_id: String(row.subrubro_id),
      image: row.cover_url || '/placeholder.svg', // compat con admin/table
      images: row.images, // array de { id, url, is_principal, orden }
    };


    return NextResponse.json(product);
  } catch (error) {
    console.error(`Error al obtener el producto ${params.id}:`, error);
    return new NextResponse('Error Interno del Servidor', { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const productId = parseInt(params.id, 10);
    if (isNaN(productId)) {
      return new NextResponse(JSON.stringify({ message: 'ID de producto inválido' }), { status: 400 });
    }

    const { nombre, descripcion, subrubro_id, precio, stock } = await request.json();
    const sucursalId = 1; // Asumimos la sucursal principal

    if (!nombre || !subrubro_id) {
      return new NextResponse(JSON.stringify({ message: 'Faltan campos requeridos' }), { status: 400 });
    }

    const client = await db.connect();

    try {
      await client.query('BEGIN');

      // 1. Actualizar la tabla Producto
      const productQuery = `
        UPDATE Producto
        SET nombre = $1, descripcion = $2, subrubro_id = $3
        WHERE id = $4;
      `;
      await client.query(productQuery, [nombre, descripcion, parseInt(subrubro_id), productId]);

      // 2. UPSERT en la tabla Sucursal_Productos
      const sucursalProductQuery = `
        INSERT INTO Sucursal_Productos (producto_id, sucursal_id, precio, stock)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (producto_id, sucursal_id)
        DO UPDATE SET precio = EXCLUDED.precio, stock = EXCLUDED.stock;
      `;
      await client.query(sucursalProductQuery, [productId, sucursalId, precio, stock]);

      await client.query('COMMIT');

      const updatedProduct = { id: productId, nombre, descripcion, subrubro_id, precio, stock };
   
      return new NextResponse(JSON.stringify(updatedProduct), { status: 200 });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error(`Error al actualizar el producto ${params.id}:`, error);
    return new NextResponse(JSON.stringify({ message: 'Error Interno del Servidor' }), { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const productId = parseInt(params.id, 10);
    if (isNaN(productId)) {
      return new NextResponse(JSON.stringify({ message: 'ID de producto inválido' }), { status: 400 });
    }

    const result = await db.query('DELETE FROM Producto WHERE id = $1 RETURNING id', [productId]);

    if (result.rowCount === 0) {
      return new NextResponse(JSON.stringify({ message: 'Producto no encontrado' }), { status: 404 });
    }

    return new NextResponse(null, { status: 204 }); // 204 No Content

  } catch (error) {
    console.error(`Error al eliminar el producto ${params.id}:`, error);
    return new NextResponse(JSON.stringify({ message: 'Error Interno del Servidor' }), { status: 500 });
  }
}
