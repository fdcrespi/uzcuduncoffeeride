import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Normaliza param cp
function norm(cpParam: string) {
  return String(cpParam ?? "").trim();
}

/** GET /api/logistics/fees/:cp */
export async function GET(_: Request, { params }: { params: { cp: string } }) {
  try {
    const cp = norm(params.cp);
    const { rows } = await db.query(
      `
      SELECT cp, costo AS fee, plazo_dias AS eta_days, activo, updated_at
      FROM logistica_tarifa_cp
      WHERE TRIM(cp) = TRIM($1)
      `,
      [cp]
    );
    if (rows.length === 0) return NextResponse.json({ message: "NotFound" }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (e) {
    console.error("GET logistics/fees/:cp error:", e);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

/** PUT /api/logistics/fees/:cp  body: { fee, eta_days?, activo? } */
export async function PUT(req: Request, { params }: { params: { cp: string } }) {
  try {
    const cp = norm(params.cp);
    const body = await req.json().catch(() => ({}));

    const fee = Number(body.fee);
    const eta_days = body.eta_days == null ? null : Number(body.eta_days);
    const activo = body.activo === false ? false : true;

    if (Number.isNaN(fee)) {
      return NextResponse.json({ message: "fee requerido (número)" }, { status: 400 });
    }

    const { rows } = await db.query(
      `
      UPDATE logistica_tarifa_cp
      SET costo = $2,
          plazo_dias = $3,
          activo = $4,
          updated_at = now()
      WHERE TRIM(cp) = TRIM($1)
      RETURNING cp, costo AS fee, plazo_dias AS eta_days, activo, updated_at
      `,
      [cp, fee, eta_days, activo]
    );

    if (rows.length === 0) return NextResponse.json({ message: "NotFound" }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (e) {
    console.error("PUT logistics/fees/:cp error:", e);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

/** DELETE /api/logistics/fees/:cp */
export async function DELETE(_: Request, { params }: { params: { cp: string } }) {
  try {
    const cp = norm(params.cp);
    const { rowCount } = await db.query(
      `DELETE FROM logistica_tarifa_cp WHERE TRIM(cp) = TRIM($1)`,
      [cp]
    );
    if (rowCount === 0) return NextResponse.json({ message: "NotFound" }, { status: 404 });
    return new NextResponse(null, { status: 204 });
  } catch (e) {
    console.error("DELETE logistics/fees/:cp error:", e);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}