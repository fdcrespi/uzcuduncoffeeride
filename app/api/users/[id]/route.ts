import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const userId = parseInt(params.id, 10);
    if (isNaN(userId)) {
      return NextResponse.json({ message: 'ID de usuario inválido.' }, { status: 400 });
    }

    const { nombre, apellido, email, rol_id, pass } = await request.json();

    if (!nombre || !apellido || !email || !rol_id || !pass) {
      return NextResponse.json({ message: 'Faltan datos obligatorios.' }, { status: 400 });
    }

    const hashedPass = await hashPassword(pass);

    const { rows } = await db.query(
      `
      UPDATE usuario
      SET nombre = $1, apellido = $2, email = $3, rol_id = $4, pass = $5
      WHERE id = $6
      RETURNING *`,
      [nombre, apellido, email, rol_id, hashedPass, userId]
    );

    if (rows.length === 0) {
      return NextResponse.json({ message: 'Usuario no encontrado.' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const userId = parseInt(params.id, 10);
    if (isNaN(userId)) {
      return NextResponse.json({ message: 'ID de usuario inválido.' }, { status: 400 });
    }

    const { rowCount } = await db.query('DELETE FROM usuario WHERE id = $1', [userId]);

    if (rowCount === 0) {
      return NextResponse.json({ message: 'Usuario no encontrado.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Usuario eliminado exitosamente.' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

async function hashPassword(pass: string): Promise<string> {
  const saltRounds = 10;
  return await hash(pass, saltRounds);
}
