import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Not authenticated, trying to access protected routes
  if (!session && (pathname.startsWith("/client") || pathname.startsWith("/freelancer"))) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Authenticated but wrong role
  if (session) {
    const role = (session.user as { role?: string })?.role;

    if (pathname.startsWith("/client") && role !== "client") {
      return NextResponse.redirect(new URL(`/${role}`, req.url));
    }

    if (pathname.startsWith("/freelancer") && role !== "freelancer") {
      return NextResponse.redirect(new URL(`/${role}`, req.url));
    }

    // Redirect auth pages when already logged in
    if (pathname === "/login" || pathname === "/register") {
      return NextResponse.redirect(new URL(`/${role}`, req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};
