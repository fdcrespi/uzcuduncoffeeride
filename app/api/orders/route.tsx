import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { rows } = await db.query('SELECT * FROM pedido ORDER BY fecha_emision DESC');
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching orders" }, { status: 500 });
  }
}