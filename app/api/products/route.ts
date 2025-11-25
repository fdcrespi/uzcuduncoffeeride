import { getProducts } from '@/lib/queries';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured') === 'true';
    const category = searchParams.get('category') || undefined;
    
    const visibleParam = searchParams.get('visible');
    const visible = visibleParam === 'true' ? true : visibleParam === 'false' ? false : undefined;

    const products = await getProducts({ featured, category, visible });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    return new NextResponse('Error Interno del Servidor', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { nombre, descripcion, subrubro_id, precio, stock, exhibicion } = await request.json();
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
        `INSERT INTO Sucursal_Productos (producto_id, sucursal_id, precio, stock)
        VALUES ($1, $2, $3, $4);`,
        [newProductId, sucursalId, precio ?? 0, stock ?? 0]
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