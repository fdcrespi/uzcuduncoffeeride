import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const productId = Number(params.id)
    if (Number.isNaN(productId)) {
      return new NextResponse(JSON.stringify({ message: 'ID inválido' }), { status: 400 })
    }
    const { rows } = await db.query(
      `SELECT t.id, t.nombre, t.tipo, pt.stock
       FROM Producto_Talle pt
       JOIN Talle t ON t.id = pt.talle_id
       WHERE pt.producto_id = $1
       ORDER BY t.tipo NULLS LAST, t.nombre ASC`,
      [productId]
    )
    return NextResponse.json(rows)
  } catch (e) {
    console.error('Error al obtener talles de producto:', e)
    return new NextResponse('Error Interno del Servidor', { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const productId = Number(params.id)
  if (Number.isNaN(productId)) {
    return new NextResponse(JSON.stringify({ message: 'ID inválido' }), { status: 400 })
  }

  try {
    const body = await request.json().catch(() => ({}))
    const sizeIds: number[] = Array.isArray(body?.sizeIds) ? body.sizeIds.map((n: any) => Number(n)).filter((n: any) => !Number.isNaN(n)) : []
    const items: Array<{ talle_id: number; stock?: number }> = Array.isArray(body?.items)
      ? body.items
          .map((it: any) => ({ talle_id: Number(it?.talle_id), stock: it?.stock != null ? Number(it.stock) : undefined }))
          .filter((it: any) => !Number.isNaN(it.talle_id))
      : []

    const client = await db.connect()
    try {
      await client.query('BEGIN')

      await client.query(`DELETE FROM Producto_Talle WHERE producto_id = $1`, [productId])

      if (items.length > 0) {
        // Inserta con stock por talle
        const columns = ['producto_id', 'talle_id', 'stock']
        const valuesPlaceholders = items.map((_, idx) => `($1, $${idx * 2 + 2}, $${idx * 2 + 3})`).join(', ')
        const values: any[] = [productId]
        items.forEach((it) => {
          values.push(it.talle_id, Number(it.stock ?? 0))
        })
        await client.query(
          `INSERT INTO Producto_Talle (${columns.join(', ')}) VALUES ${valuesPlaceholders}`,
          values
        )
      } else if (sizeIds.length > 0) {
        // Backward-compatible: inserta sin stock (0 por defecto)
        const values = sizeIds.map((id, idx) => `($1, $${idx + 2})`).join(', ')
        await client.query(
          `INSERT INTO Producto_Talle (producto_id, talle_id)
           VALUES ${values}`,
          [productId, ...sizeIds]
        )
      }

      await client.query('COMMIT')
      return new NextResponse(null, { status: 204 })
    } catch (e) {
      await client.query('ROLLBACK')
      console.error('Error al asignar talles:', e)
      return new NextResponse(JSON.stringify({ message: 'Error al asignar talles' }), { status: 500 })
    } finally {
      client.release()
    }
  } catch (e) {
    console.error('Error en PUT talles:', e)
    return new NextResponse('Error Interno del Servidor', { status: 500 })
  }
}