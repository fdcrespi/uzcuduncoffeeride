import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface ProductFromDB {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  image: string;
  category: string;
  stock: number;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const sucursalId = 1; // Asumimos la sucursal principal

    let query = `
      SELECT 
        p.id, 
        p.nombre, 
        p.descripcion, 
        p.destacado,
        p.visible,
        sp.precio, 
        sp.stock,
        sr.id as subrubro_id,
        sr.nombre as subrubro_nombre,
        r.nombre as category,
        pp.cover_url
      FROM Producto p
      LEFT JOIN Sucursal_Productos sp ON p.id = sp.producto_id
      LEFT JOIN Subrubro sr ON p.subrubro_id = sr.id
      LEFT JOIN Rubro r ON sr.rubro_id = r.id
      LEFT JOIN Producto_Portada pp ON pp.producto_id = p.id
      WHERE (sp.sucursal_id = $1 OR sp.sucursal_id IS NULL)
    `;

    const queryParams: any[] = [sucursalId];

    if (featured === 'true') {
      query += ` AND p.destacado = true`;
    }

    query += ` ORDER BY p.id DESC`;

    const result = await db.query(query, queryParams);

    const products = result.rows.map(p => ({
      id: String(p.id),
      nombre: p.nombre,
      descripcion: p.descripcion,
      precio: p.precio !== null ? Number(p.precio) : 0,
      image: p.cover_url || '/placeholder.svg',
      stock: p.stock !== null ? Number(p.stock) : 0,
      subrubro_id: String(p.subrubro_id),
      subrubro_nombre: p.subrubro_nombre,
      category: p.category,
      destacado: p.destacado,
      visible: p.visible,
    }));

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    return new NextResponse('Error Interno del Servidor', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { nombre, descripcion, subrubro_id, precio, stock } = await request.json();
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
        `INSERT INTO Producto (nombre, descripcion, subrubro_id)
        VALUES ($1, $2, $3)
        RETURNING id;`,
        [nombre, descripcion, parseInt(subrubro_id, 10)]
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
