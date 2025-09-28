import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';

export async function GET() {
  try {
    const { rows } = await db.query(`
      SELECT
        u.id,
        u.email,
        u.nombre,
        u.apellido,
        u.rol_id,
        u.pass,
        r.descripcion AS rol_name
      FROM usuario u JOIN rol r ON u.rol_id = r.id
    `);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { nombre, apellido, email, rol_id, pass } = await request.json();

    if (!nombre || !apellido || !email || !rol_id || !pass) {
      return NextResponse.json({ message: 'Faltan datos obligatorios.' }, { status: 400 });
    }

    if (pass.length < 6) {
      return NextResponse.json({ message: 'La contraseña debe tener al menos 6 caracteres.' }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ message: 'El formato del email es inválido.' }, { status: 400 });
    }
    // Optionally, check if the email already exists
    const emailCheck = await db.query('SELECT id FROM usuario WHERE email = $1', [email]);
    if (emailCheck.rows.length > 0) {
      return NextResponse.json({ message: 'El email ya está en uso.' }, { status: 400 });
    }

    const hashedPass = await hashPassword(pass);

    const { rows } = await db.query(
      `
      INSERT INTO usuario (nombre, apellido, email, rol_id, pass, sucursal_id)
      VALUES ($1, $2, $3, $4, $5, 1)
      RETURNING *`,
      [nombre, apellido, email, rol_id, hashedPass]
    );

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
async function hashPassword(pass: string): Promise<string> {
  const saltRounds = 10;
  return await hash(pass, saltRounds);
}

