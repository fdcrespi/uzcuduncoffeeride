import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

// La estructura del producto que esperamos de la base de datos
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

import io from 'socket.io-client';
const socket = io(process.env.NEXT_PUBLIC_URL!);

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
        p.image,
        p.subrubro_id,
        sp.precio, 
        sp.stock
      FROM Producto p
      LEFT JOIN Sucursal_Productos sp ON p.id = sp.producto_id
      WHERE p.id = $1 AND (sp.sucursal_id = $2 OR sp.sucursal_id IS NULL)
      `,
      [productId, sucursalId]
    );

    if (result.rows.length === 0) {
      return new NextResponse('Producto no encontrado', { status: 404 });
    }

    const p = result.rows[0];

    const product = {
      id: String(p.id),
      nombre: p.nombre,
      descripcion: p.descripcion,
      precio: p.precio !== null ? Number(p.precio) : 0,
      image: p.image || '/placeholder.svg',
      stock: p.stock !== null ? Number(p.stock) : 0,
      subrubro_id: String(p.subrubro_id),
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

    const { nombre, descripcion, subrubro_id, image, precio, stock } = await request.json();
    const sucursalId = 1; // Asumimos la sucursal principal

    if (!nombre || !subrubro_id || !image) {
      return new NextResponse(JSON.stringify({ message: 'Faltan campos requeridos' }), { status: 400 });
    }

    const client = await db.connect();

    try {
      await client.query('BEGIN');

      // 1. Actualizar la tabla Producto
      const productQuery = `
        UPDATE Producto
        SET nombre = $1, descripcion = $2, subrubro_id = $3, image = $4
        WHERE id = $5;
      `;
      await client.query(productQuery, [nombre, descripcion, parseInt(subrubro_id), image, productId]);

      // 2. UPSERT en la tabla Sucursal_Productos
      const sucursalProductQuery = `
        INSERT INTO Sucursal_Productos (producto_id, sucursal_id, precio, stock)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (producto_id, sucursal_id)
        DO UPDATE SET precio = EXCLUDED.precio, stock = EXCLUDED.stock;
      `;
      await client.query(sucursalProductQuery, [productId, sucursalId, precio, stock]);

      await client.query('COMMIT');

      const updatedProduct = { id: productId, nombre, descripcion, subrubro_id, image, precio, stock };
      socket.emit('updateProducto', 'producto actualizado');
   
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
