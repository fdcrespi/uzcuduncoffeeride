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