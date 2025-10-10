// app/api/shipping/quote/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/shipping/quote?cp=7600
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cp = (searchParams.get("cp") || "").trim();

  if (!cp) {
    return NextResponse.json({ error: "cp requerido" }, { status: 400 });
  }

  try {
    const { rows } = await db.query(
      `
      SELECT cp, costo AS fee, plazo_dias AS eta_days
      FROM Logistica_Tarifa_CP
      WHERE activo = TRUE AND (cp = $1 OR cp = '*')
      ORDER BY (cp = $1) DESC, (cp = '*') DESC
      LIMIT 1
      `,
      [cp]
    );

    if (rows.length === 0) {
      // Sin match: informo que no hay tarifa
      return NextResponse.json({ cpMatched: null, fee: null, etaDays: null });
    }

    const r = rows[0];
    return NextResponse.json({
      cpMatched: r.cp,
      fee: Number(r.fee),
      etaDays: r.eta_days != null ? Number(r.eta_days) : null,
    });
  } catch (err) {
    console.error("GET /api/shipping/quote error:", err);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}





/* Pruebas rápidas (Thunder Client/Postman)
Match exacto:
GET /api/shipping/quote?cp=7600 → { cp: "7600", costo: 1200, ... }

Fallback:
GET /api/shipping/quote?cp=0000 → { cp: "*", costo: 0, ... , source: "fallback" }

Sin cp:
GET /api/shipping/quote → 400 { message: "cp requerido" }

Sin tarifa:
(si no hay * y no hay match) → 404 { message: "Sin tarifa para ese CP" } */