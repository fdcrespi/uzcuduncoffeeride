import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { NextApiRequest } from 'next';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rubroId = searchParams.get('rubroId');

  try {
    if (rubroId) {
      const { rows } = await db.query('SELECT * FROM Subrubro WHERE rubro_id = $1', [rubroId]);
      return NextResponse.json(rows);
    } else {
      const { rows } = await db.query('SELECT * FROM Subrubro');
      return NextResponse.json(rows);
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { nombre, rubro_id } = await request.json();
    const { rows } = await db.query('INSERT INTO Subrubro (nombre, rubro_id) VALUES ($1, $2) RETURNING *', [nombre, rubro_id]);
    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
