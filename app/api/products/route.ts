import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

// Este tipo define la estructura de los productos que devolverá nuestra API.
// Corresponde a lo que necesita el componente ProductCard, pero sin rating/reviews.
type ProductCategory = "motorcycle" | "electric" | "accessory" | "coffee";

interface ProductFromDB {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  image: string;
  category: ProductCategory;
  stock: number;
}

export async function GET() {
  try {
    const sucursalId = 1; // Asumimos la sucursal principal
    
    const result = await db.query(`
      SELECT 
        p.id, 
        p.nombre, 
        p.descripcion, 
        p.image,
        sp.precio, 
        sp.stock,
        sr.id as subrubro_id,
        sr.nombre as subrubro_nombre,
        r.nombre as category
      FROM Producto p
      LEFT JOIN Sucursal_Productos sp ON p.id = sp.producto_id
      LEFT JOIN Subrubro sr ON p.subrubro_id = sr.id
      LEFT JOIN Rubro r ON sr.rubro_id = r.id
      WHERE sp.sucursal_id = $1 OR sp.sucursal_id IS NULL
      ORDER BY p.id DESC
    `, [sucursalId]);

    const products = result.rows.map(p => ({
      id: String(p.id),
      nombre: p.nombre,
      descripcion: p.descripcion,
      precio: p.precio !== null ? Number(p.precio) : 0,
      image: p.image || '/placeholder.svg',
      stock: p.stock !== null ? Number(p.stock) : 0,
      subrubro_id: String(p.subrubro_id),
      subrubro_nombre: p.subrubro_nombre,
      category: p.category,
    }));

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    return new NextResponse('Error Interno del Servidor', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { nombre, descripcion, subrubro_id, image, precio, stock } = await request.json();
    const sucursalId = 1; // Asumimos la sucursal principal

    // Validación básica
    if (!nombre || !subrubro_id || !image) {
      return new NextResponse(JSON.stringify({ message: 'Faltan campos requeridos' }), { status: 400 });
    }

    const client = await db.connect();

    try {
      await client.query('BEGIN');

      // 1. Insertar en la tabla Producto
      const productQuery = `
        INSERT INTO Producto (nombre, descripcion, subrubro_id, image)
        VALUES ($1, $2, $3, $4)
        RETURNING id;
      `;
      const productResult = await client.query(productQuery, [nombre, descripcion, parseInt(subrubro_id), image]);
      const newProductId = productResult.rows[0].id;

      // 2. Insertar en la tabla Sucursal_Productos
      const sucursalProductQuery = `
        INSERT INTO Sucursal_Productos (producto_id, sucursal_id, precio, stock)
        VALUES ($1, $2, $3, $4);
      `;
      await client.query(sucursalProductQuery, [newProductId, sucursalId, precio, stock]);

      await client.query('COMMIT');

      const newProduct = {
        id: newProductId,
        nombre,
        descripcion,
        subrubro_id,
        image,
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
