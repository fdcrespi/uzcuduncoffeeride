import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { nombre } = await request.json();
    const { rows } = await db.query('UPDATE Rubro SET nombre = $1 WHERE id = $2 RETURNING *', [nombre, params.id]);
    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Check for subcategories
    const subcategoryCheck = await db.query('SELECT COUNT(*) FROM subrubro WHERE rubro_id = $1', [params.id]);
    if (parseInt(subcategoryCheck.rows[0].count) > 0) {
      return NextResponse.json(
        { message: 'No se puede eliminar la categoría porque tiene subcategorías asociadas.' },
        { status: 409 }
      );
    }

    // Proceed with deletion
    await db.query('DELETE FROM rubro WHERE id = $1', [params.id]);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Failed to delete category:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
