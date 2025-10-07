import { db } from "./db";
import { unstable_noStore as noStore } from 'next/cache';

export async function getCategories() {
  noStore();
  try {
    const { rows } = await db.query(`SELECT id, nombre FROM Rubro ORDER BY nombre ASC`);
    return rows;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories.');
  }
}

export async function getProducts(category?: string) {
  noStore();
  try {
    const sucursalId = 1; // Asumimos la sucursal principal
    const params: any[] = [sucursalId];

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
      WHERE (sp.sucursal_id = $1 OR sp.sucursal_id IS NULL) AND p.visible = true
    `;

    if (category) {
      params.push(category);
      query += ` AND r.nombre = ${params.length}`;
    }

    query += ` ORDER BY p.id DESC`;

    const result = await db.query(query, params);

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

    return products;

  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products.');
  }
}