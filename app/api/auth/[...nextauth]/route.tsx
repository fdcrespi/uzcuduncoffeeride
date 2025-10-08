import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { db } from "@/lib/db";

// Simple in-memory store for rate limiting
const loginAttempts = new Map<string, { count: number; expiry: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME_MS = 15 * 60 * 1000; // 15 minutes

const handler = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        const ip = (req.headers as any)?.["x-forwarded-for"];

        if (ip) {
          const attempt = loginAttempts.get(ip);
          if (attempt && attempt.expiry > Date.now()) {
            // If the IP is locked out, throw an error
            throw new Error("Too many failed login attempts. Please try again later.");
          }
        }
        
        try {
          const email = credentials?.email;
          const password = credentials?.password;
          
          const { rows } = await db.query(
            `SELECT u.*, r.descripcion FROM Usuario u 
             JOIN Rol r ON u.rol_id = r.id 
             WHERE email = $1`,
            [email]
          );
          
          const user = rows[0];
          
          if (!user) {
            if (ip) handleFailedAttempt(ip);
            return null;
          }

          const passwordCorrect = await compare(password || "", user.pass);
          
          if (!passwordCorrect) {
            if (ip) handleFailedAttempt(ip);
            return null;
          }

          // On successful login, clear attempts for this IP
          if (ip) loginAttempts.delete(ip);

          return {
            id: user.id,
            email: user.email,
            rol_id: user.rol_id,
            descripcion: user.descripcion,
          };
        } catch (error) {
          console.error("Error en la autorización:", error);
          // Don't count database errors as login attempts
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = Number(user.id);
        // token.rol_id = Number(user.rol_id!);
        // token.descripcion = user.descripcion;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
        };
        // session.user.rol_id = Number(token.rol_id);
        // session.user.descripcion = token.descripcion as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl + "/admin";
    },
  },
});

function handleFailedAttempt(ip: string) {
  let attempt = loginAttempts.get(ip) || { count: 0, expiry: 0 };
  
  attempt.count++;
  
  if (attempt.count >= MAX_ATTEMPTS) {
    attempt.expiry = Date.now() + LOCKOUT_TIME_MS;
    console.log(`IP ${ip} has been locked out.`);
  }
  
  loginAttempts.set(ip, attempt);
}

export { handler as GET, handler as POST };
