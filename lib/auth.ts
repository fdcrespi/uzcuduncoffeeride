import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export type AuthResult =
  | { mode: "user"; user: { id?: number; email?: string; rol_id?: number; role?: string } }
  | { mode: "external" };

function getExternalToken(req: Request): string | null {
  const authHeader = req.headers.get("authorization");
  const xToken = req.headers.get("x-external-token");
  if (xToken) return xToken.trim();
  if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    return authHeader.slice(7).trim();
  }
  return null;
}

export async function authorizeApi(req: Request, opts: { allowExternal?: boolean } = {}): Promise<AuthResult | null> {
  const allowExternal = !!opts.allowExternal;

  // Try external token first
  const extToken = getExternalToken(req);
  const expected = process.env.EXTERNAL_API_TOKEN;
  if (extToken && expected) {
    if (extToken === expected) {
      return allowExternal ? { mode: "external" } : null;
    }
  }

  // Fall back to session token (NextAuth)
  const token = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET });
  if (token) {
    return {
      mode: "user",
      user: {
        id: typeof token.id === "number" ? token.id : Number(token.id ?? undefined),
        email: typeof token.email === "string" ? token.email : undefined,
        rol_id: typeof (token as any).rol_id === "number" ? (token as any).rol_id : undefined,
        role: (token as any).descripcion as string | undefined,
      },
    };
  }

  return null;
}

export function unauthorized(message = "Unauthorized") {
  return new NextResponse(JSON.stringify({ message }), { status: 401 });
}