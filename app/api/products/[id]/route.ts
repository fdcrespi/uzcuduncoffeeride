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

    const result = await db.query<ProductFromDB>(
      `
      SELECT 
        p.id, 
        p.nombre, 
        p.descripcion, 
        p.image,
        sp.precio, 
        sp.stock,
        r.nombre as category
      FROM Producto p
      INNER JOIN Sucursal_Productos sp ON p.id = sp.producto_id
      INNER JOIN Subrubro sr ON p.subrubro_id = sr.id
      INNER JOIN Rubro r ON sr.rubro_id = r.id
      WHERE p.id = $1 AND sp.sucursal_id = $2
      `,
      [productId, sucursalId]
    );

    if (result.rows.length === 0) {
      return new NextResponse('Producto no encontrado', { status: 404 });
    }

    const p = result.rows[0];

    // Mapeamos al formato que espera el frontend
    const product = {
      id: String(p.id),
      name: p.nombre,
      description: p.descripcion,
      price: p.precio,
      image: p.image || '/placeholder.svg',
      category: p.category,
      inStock: p.stock > 0,
      stock: p.stock, // También pasamos el número de stock
    };

    return NextResponse.json(product);
  } catch (error) {
    console.error(`Error al obtener el producto ${params.id}:`, error);
    return new NextResponse('Error Interno del Servidor', { status: 500 });
  }
}