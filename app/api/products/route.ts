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
    // Por ahora, asumimos que siempre trabajamos con la sucursal principal (ID 1).
    const sucursalId = 1; 
    
    const result = await db.query<ProductFromDB>(`
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
      WHERE sp.sucursal_id = $1
    `, [sucursalId]);

    // Mapeamos el resultado de la base de datos a la estructura que espera el frontend.
    const products = result.rows.map(p => ({
      id: String(p.id),
      name: p.nombre,
      description: p.descripcion,
      price: p.precio,
      image: p.image || '/placeholder.svg', // Usamos una imagen por defecto si no hay una.
      category: p.category,
      inStock: p.stock > 0, // El stock se convierte en un booleano 'inStock'.
    }));

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    // En caso de un error, devolvemos una respuesta con código 500.
    return new NextResponse('Error Interno del Servidor', { status: 500 });
  }
}