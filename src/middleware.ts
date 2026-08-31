import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

// Routes that require a signed-in session. Everything under these prefixes
// lives inside the (crm) route group / AppShell.
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/emails",
  "/calendar",
  "/tasks",
  "/insights",
  "/chat",
  "/uploads",
];

export default auth((req) => {
  const { nextUrl } = req;
  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => nextUrl.pathname === prefix || nextUrl.pathname.startsWith(`${prefix}/`)
  );

  if (isProtected && !req.auth?.user) {
    const loginUrl = new URL("/login", nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname + nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/emails/:path*",
    "/calendar/:path*",
    "/tasks/:path*",
    "/insights/:path*",
    "/chat/:path*",
    "/uploads/:path*",
  ],
};
