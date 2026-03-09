import type { NextAuthConfig } from "next-auth";

// Edge-compatible auth config — no Node.js modules (bcrypt, mongoose, etc.)
// Used by proxy.ts (middleware) which runs in the Edge runtime
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
        token.avatar = (user as { avatar?: string }).avatar;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
        (session.user as { avatar?: string }).avatar = token.avatar as string;
      }
      return session;
    },
  },
  providers: [], // Providers are added in auth.ts, not here
} satisfies NextAuthConfig;
