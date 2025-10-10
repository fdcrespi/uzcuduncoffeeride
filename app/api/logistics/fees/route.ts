import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/logistics/fees?q=7600
 * Lista tarifas. Si viene q, filtra por CP (con '*' permitido).
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim();

    if (q) {
      const { rows } = await db.query(
        `
        SELECT cp, costo AS fee, plazo_dias AS eta_days, activo, updated_at
        FROM logistica_tarifa_cp
        WHERE cp ILIKE $1
        ORDER BY
          CASE WHEN cp = '*' THEN 1 ELSE 0 END,
          (CASE WHEN cp ~ '^[0-9]+$' THEN LPAD(cp, 10, '0') ELSE cp END)
        `,
        [q]
      );
      return NextResponse.json(rows);
    }

    const { rows } = await db.query(
      `
      SELECT cp, costo AS fee, plazo_dias AS eta_days, activo, updated_at
      FROM logistica_tarifa_cp
      ORDER BY
        CASE WHEN cp = '*' THEN 1 ELSE 0 END,
        (CASE WHEN cp ~ '^[0-9]+$' THEN LPAD(cp, 10, '0') ELSE cp END)
      `
    );
    return NextResponse.json(rows);
  } catch (e) {
    console.error("GET logistics/fees error:", e);
    return NextResponse.json({ message: "Error al listar" }, { status: 500 });
  }
}

/**
 * POST /api/logistics/fees
 * body: { cp, fee, eta_days?, activo? }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const cp = String(body.cp ?? "").trim();
    const fee = Number(body.fee);
    const eta_days = body.eta_days == null ? null : Number(body.eta_days);
    const activo = body.activo === false ? false : true;

    if (!cp || Number.isNaN(fee)) {
      return NextResponse.json({ message: "cp y fee son requeridos" }, { status: 400 });
    }

    const { rows } = await db.query(
      `
      INSERT INTO logistica_tarifa_cp (cp, costo, plazo_dias, activo)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (cp)
      DO UPDATE SET costo = EXCLUDED.costo,
                    plazo_dias = EXCLUDED.plazo_dias,
                    activo = EXCLUDED.activo,
                    updated_at = now()
      RETURNING cp, costo AS fee, plazo_dias AS eta_days, activo, updated_at
      `,
      [cp, fee, eta_days, activo]
    );

    return NextResponse.json(rows[0], { status: 201 });
  } catch (e) {
    console.error("POST logistics/fees error:", e);
    return NextResponse.json({ message: "Error al crear/actualizar" }, { status: 500 });
  }
}

