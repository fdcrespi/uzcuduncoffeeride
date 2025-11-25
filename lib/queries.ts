import { db } from "./db";
import { unstable_noStore as noStore } from 'next/cache';
import { Product } from "./types";

export async function getCategories() {
  noStore();
  try {
    const { rows } = await db.query(`SELECT id, nombre FROM Rubro ORDER BY nombre ASC`);
    return rows;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

interface GetProductsOptions {
  category?: string;
  featured?: boolean;
  visible?: boolean;
  page?: number;
  limit?: number;
}

export async function getProducts(options: GetProductsOptions = {}): Promise<Product[]> {
  noStore();
  try {
    const { category, featured, visible, page = 1, limit = 10 } = options;
    const sucursalId = 1; // Asumimos la sucursal principal
    const params: any[] = [sucursalId];
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        p.id, 
        p.nombre, 
        p.descripcion, 
        p.destacado,
        p.visible,
        p.exhibicion,
        sp.precio, 
        sp.moneda,
        sp.precio_alternativo,
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

    if (visible !== undefined) {
      params.push(visible);
      query += ` AND p.visible = $${params.length}`;
    }

    if (featured) {
      params.push(true);
      query += ` AND p.destacado = $${params.length}`;
    }
    
    if (category) {
      params.push(category);
      query += ` AND r.nombre = $${params.length}`;
    }

    query += ` ORDER BY p.id DESC`;
    params.push(limit);
    query += ` LIMIT $${params.length}`;
    params.push(offset);
    query += ` OFFSET $${params.length}`;

    const result = await db.query(query, params);

    const products = result.rows.map(p => ({
      id: String(p.id),
      nombre: p.nombre,
      descripcion: p.descripcion,
      precio: p.precio !== null ? Number(p.precio) : 0,
      precio_alternativo: p.precio_alternativo !== null ? Number(p.precio_alternativo) : 0,
      moneda: p.moneda || 'ARS',
      image: p.cover_url || '/placeholder.svg',
      stock: p.stock !== null ? Number(p.stock) : 0,
      subrubro_id: String(p.subrubro_id),
      subrubro_nombre: p.subrubro_nombre,
      category: p.category,
      destacado: p.destacado,
      visible: p.visible,
      exhibicion: p.exhibicion,
    }));

    return products;

  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}
