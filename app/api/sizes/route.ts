import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { rows } = await db.query(
      `SELECT id, nombre, tipo
       FROM Talle
       ORDER BY tipo NULLS LAST, nombre ASC`
    )
    return NextResponse.json(rows)
  } catch (e) {
    console.error('Error al obtener talles:', e)
    return new NextResponse('Error Interno del Servidor', { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { nombre, tipo } = await request.json()
    if (!nombre) {
      return new NextResponse(JSON.stringify({ message: 'Nombre es requerido' }), { status: 400 })
    }

    const { rows } = await db.query(
      `INSERT INTO Talle (nombre, tipo)
       VALUES ($1, $2)
       ON CONFLICT (nombre, tipo) DO NOTHING
       RETURNING id, nombre, tipo`,
      [String(nombre), tipo ? String(tipo) : null]
    )

    if (rows.length === 0) {
      // Ya existía
      const existing = await db.query(
        `SELECT id, nombre, tipo FROM Talle WHERE nombre = $1 AND (tipo IS NOT DISTINCT FROM $2)`,
        [String(nombre), tipo ? String(tipo) : null]
      )
      return NextResponse.json(existing.rows[0], { status: 200 })
    }

    return NextResponse.json(rows[0], { status: 201 })
  } catch (e) {
    console.error('Error al crear talle:', e)
    return new NextResponse('Error Interno del Servidor', { status: 500 })
  }
}