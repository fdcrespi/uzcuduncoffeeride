import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import path from 'path';
import { unlink } from 'fs/promises';


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
        p.exhibicion,
        sp.precio, 
        sp.stock,
        sp.moneda,
        sp.precio_alternativo,
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
      precio_alternativo: row.precio_alternativo !== null ? Number(row.precio_alternativo) : 0,
      moneda: row.moneda || 'ARS',
      stock: row.stock !== null ? Number(row.stock) : 0,
      subrubro_id: String(row.subrubro_id),
      exhibicion: row.exhibicion,
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

    const { nombre, descripcion, subrubro_id, precio, stock, exhibicion, moneda, precio_alternativo } = await request.json();
    const sucursalId = 1; // Asumimos la sucursal principal

    if (!nombre || !subrubro_id) {
      return new NextResponse(JSON.stringify({ message: 'Faltan campos requeridos' }), { status: 400 });
    }

    const client = await db.connect();

    try {
      await client.query('BEGIN');

      await client.query(
        `UPDATE Producto
         SET nombre = $1, descripcion = $2, subrubro_id = $3, exhibicion = $5
         WHERE id = $4;`,
        [nombre, descripcion, parseInt(subrubro_id, 10), productId, exhibicion]
      );

      await client.query(
        `INSERT INTO Sucursal_Productos (producto_id, sucursal_id, precio, stock, moneda, precio_alternativo)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (producto_id, sucursal_id)
         DO UPDATE SET precio = EXCLUDED.precio, stock = EXCLUDED.stock, moneda = EXCLUDED.moneda, precio_alternativo = EXCLUDED.precio_alternativo;`,
        [productId, sucursalId, precio ?? 0, stock ?? 0, moneda ?? 'ARS', precio_alternativo ?? 0]
      );

      await client.query('COMMIT');

      const updatedProduct = { id: productId, nombre, descripcion, subrubro_id, precio, stock, exhibicion, moneda, precio_alternativo };
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

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const productId = parseInt(params.id, 10);
    if (isNaN(productId)) {
      return new NextResponse(JSON.stringify({ message: 'ID de producto inválido' }), { status: 400 });
    }

    const body = await request.json();
    const { destacado, visible, exhibicion } = body;

    let updateField = '';
    let updateValue;

    if (typeof destacado === 'boolean') {
      updateField = 'destacado';
      updateValue = destacado;
    } else if (typeof visible === 'boolean') {
      updateField = 'visible';
      updateValue = visible;
    } else if (typeof exhibicion === 'boolean') {
      updateField = 'exhibicion';
      updateValue = exhibicion;
    } else {
      return new NextResponse(JSON.stringify({ message: 'Cuerpo de la solicitud inválido' }), { status: 400 });
    }

    const result = await db.query(
      `UPDATE Producto SET ${updateField} = $1 WHERE id = $2 RETURNING id, ${updateField}`,
      [updateValue, productId]
    );

    if (result.rowCount === 0) {
      return new NextResponse(JSON.stringify({ message: 'Producto no encontrado' }), { status: 404 });
    }

    return new NextResponse(JSON.stringify(result.rows[0]), { status: 200 });

  } catch (error) {
    console.error(`Error al actualizar parcialmente el producto ${params.id}:`, error);
    return new NextResponse(JSON.stringify({ message: 'Error Interno del Servidor' }), { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const productId = parseInt(params.id, 10);
  if (isNaN(productId)) {
    return new NextResponse(JSON.stringify({ message: 'ID de producto inválido' }), { status: 400 });
  }

  // helpers locales (podés moverlos arriba del archivo si preferís)
  const isLocalUploadUrl = (url?: string | null) => typeof url === 'string' && url.startsWith('/uploads/');
  const toAbsolutePathFromPublic = (url: string) => {
    const rel = url.replace(/^\//, '');
    return path.join(process.cwd(), 'public', rel);
  };

  const client = await db.connect();
  try {
    await client.query('BEGIN');

    // 1) Traer URLs de imágenes antes de borrar el producto
    const imgs = await client.query(
      `SELECT url FROM Producto_Imagen WHERE producto_id = $1`,
      [productId]
    );
    const urls: string[] = imgs.rows.map((r: any) => r.url).filter((u: any) => typeof u === 'string');

    // 2) Borrar el producto (activará CASCADE para Producto_Imagen y Portada)
    const result = await client.query('DELETE FROM Producto WHERE id = $1 RETURNING id', [productId]);

    if (result.rowCount === 0) {
      await client.query('ROLLBACK');
      return new NextResponse(JSON.stringify({ message: 'Producto no encontrado' }), { status: 404 });
    }

    await client.query('COMMIT');

    // 3) Borrar archivos físicos locales de forma no-bloqueante
    for (const url of urls) {
      if (isLocalUploadUrl(url)) {
        const filePath = toAbsolutePathFromPublic(url);
        unlink(filePath).catch((e: any) => {
          if (e?.code !== 'ENOENT') {
            console.warn('No se pudo eliminar archivo del producto:', filePath, e);
          }
        });
      }
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(`Error al eliminar el producto ${params.id}:`, error);
    return new NextResponse(JSON.stringify({ message: 'Error Interno del Servidor' }), { status: 500 });
  } finally {
    client.release();
  }
}
