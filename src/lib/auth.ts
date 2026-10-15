import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(raw) {
        const email = String(raw?.email || "").toLowerCase();
        const password = String(raw?.password || "");
        if (!email || !password) return null;
        const user = await db.user.findUnique({ where: { email } });
        if (!user || user.status !== "ACTIVE") return null;
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;
        await db.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
        await db.activityLog.create({
          data: { userId: user.id, event: "LOGIN", description: "User logged in", status: "SUCCESS" },
        });
        return { id: user.id, email: user.email, name: user.name, role: user.role, accountId: user.accountId } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.uid = (user as any).id;
        token.role = (user as any).role;
        token.accountId = (user as any).accountId;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).user.id = token.uid;
      (session as any).user.role = token.role;
      (session as any).user.accountId = token.accountId;
      return session;
    },
  },
});
