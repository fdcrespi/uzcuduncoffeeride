import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { db } from "@/lib/db";

const handler = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {}
      },
      async authorize(credentials) {
        try {
          const email = credentials?.email;
          const password = credentials?.password;
          console.log("email", email);
          console.log("password", password);
          const { rows } = await db.query(
            `SELECT u.*, r.descripcion FROM Usuario u 
             JOIN Rol r ON u.rol_id = r.id 
             WHERE email = $1`,
            [email]
          );
          console.log("rows", rows);
          
          const user = rows[0];
          if (!user) return null;

          const passwordCorrect = await compare(password || "", user.pass);
          if (!passwordCorrect) return null;

          return {
            id: user.id,
            email: user.email,
            rol_id: user.rol_id,
            descripcion: user.descripcion,
          };
        } catch (error) {
          console.error("Error en la autorización:", error);
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

export { handler as GET, handler as POST };
