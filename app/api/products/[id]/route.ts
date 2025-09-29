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