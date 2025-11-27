import { getProducts } from '@/lib/queries';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured') === 'true';
    const category = searchParams.get('category') || undefined;
    const subcategory = searchParams.get('subcategory') || undefined;
    
    const visibleParam = searchParams.get('visible');
    const visible = visibleParam === 'true' ? true : visibleParam === 'false' ? false : undefined;

    // nuevos parámetros de paginación
    const pageParam = searchParams.get('page');
    const limitParam = searchParams.get('limit');
    const page = pageParam ? Math.max(1, parseInt(pageParam, 10)) : undefined;
    const limit = limitParam ? Math.max(1, parseInt(limitParam, 10)) : undefined;

    const products = await getProducts({ featured, category, subcategory, visible, page, limit });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    return new NextResponse('Error Interno del Servidor', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { nombre, descripcion, subrubro_id, precio, stock, exhibicion, moneda, precio_alternativo } = await request.json();
    const sucursalId = 1; // Asumimos la sucursal principal

    // Validación básica
    if (!nombre || !subrubro_id) {
      return new NextResponse(JSON.stringify({ message: 'Faltan campos requeridos' }), { status: 400 });
    }

    const client = await db.connect();

    try {
      await client.query('BEGIN');

      // 1. Insertar en la tabla Producto
      const productRes = await client.query(
        `INSERT INTO Producto (nombre, descripcion, subrubro_id, exhibicion)
        VALUES ($1, $2, $3, $4)
        RETURNING id;`,
        [nombre, descripcion, parseInt(subrubro_id, 10), exhibicion ?? true]
      );
      const newProductId = productRes.rows[0].id;


      // 2. Insertar en la tabla Sucursal_Productos
      await client.query(
        `INSERT INTO Sucursal_Productos (producto_id, sucursal_id, precio, stock, moneda, precio_alternativo)
        VALUES ($1, $2, $3, $4, $5, $6);`,
        [newProductId, sucursalId, precio ?? 0, stock ?? 0, moneda ?? 'ARS', precio_alternativo ?? 0]
      );

      await client.query('COMMIT');


      const newProduct = {
        id: newProductId,
        nombre,
        descripcion,
        subrubro_id,        
        precio,
        stock,
        exhibicion,
        moneda,
        precio_alternativo,
      };
      
      return new NextResponse(JSON.stringify(newProduct), { status: 201 });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error al crear el producto:', error);
    return new NextResponse(JSON.stringify({ message: 'Error Interno del Servidor' }), { status: 500 });
  }
}
