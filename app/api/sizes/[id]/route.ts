import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id)
    if (Number.isNaN(id)) {
      return new NextResponse(JSON.stringify({ message: 'ID inválido' }), { status: 400 })
    }

    const body = await request.json().catch(() => ({}))
    const nombre = String(body?.nombre ?? '').trim()
    const tipoRaw = body?.tipo
    const tipo = tipoRaw == null || String(tipoRaw).trim() === '' ? null : String(tipoRaw).trim()

    if (!nombre) {
      return new NextResponse(JSON.stringify({ message: 'Nombre es requerido' }), { status: 400 })
    }

    const { rows } = await db.query(
      `UPDATE Talle
       SET nombre = $1, tipo = $2
       WHERE id = $3
       RETURNING id, nombre, tipo`,
      [nombre, tipo, id]
    )

    if (rows.length === 0) {
      return new NextResponse(JSON.stringify({ message: 'Talle no encontrado' }), { status: 404 })
    }

    return NextResponse.json(rows[0])
  } catch (e: any) {
    console.error('Error al actualizar talle:', e)
    // Violación de única (uq_talle)
    if (e?.code === '23505') {
      return NextResponse.json({ message: 'Ya existe un talle con ese nombre y tipo' }, { status: 409 })
    }
    return new NextResponse('Error Interno del Servidor', { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id)
    if (Number.isNaN(id)) {
      return new NextResponse(JSON.stringify({ message: 'ID inválido' }), { status: 400 })
    }

    // Pre-chequeo: si está en uso por algún producto, no permitir eliminar
    const refs = await db.query(`SELECT 1 FROM Producto_Talle WHERE talle_id = $1 LIMIT 1`, [id])
    if (refs.rowCount && refs.rowCount > 0) {
      return NextResponse.json({ message: 'No se puede eliminar: el talle está asociado a productos.' }, { status: 409 })
    }

    const result = await db.query(`DELETE FROM Talle WHERE id = $1`, [id])
    if (result.rowCount === 0) {
      return new NextResponse(JSON.stringify({ message: 'Talle no encontrado' }), { status: 404 })
    }

    return new NextResponse(null, { status: 204 })
  } catch (e: any) {
    console.error('Error al eliminar talle:', e)
    if (e?.code === '23503') {
      // FK violation (referenciado)
      return NextResponse.json({ message: 'No se puede eliminar: el talle está asociado a productos.' }, { status: 409 })
    }
    return new NextResponse('Error Interno del Servidor', { status: 500 })
  }
}