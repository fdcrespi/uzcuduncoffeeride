import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { rows } = await db.query(`
      SELECT
        *
      FROM rol
    `);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching roles:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}