import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { rows } = await db.query('SELECT * FROM rubro');
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { nombre } = await request.json();
    const { rows } = await db.query('INSERT INTO Rubro (nombre) VALUES ($1) RETURNING *', [nombre]);
    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
