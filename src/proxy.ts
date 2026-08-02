import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// NextAuth v4 stores JWT session in this cookie.
// The name differs between secure (HTTPS/production) and non-secure (HTTP/dev) contexts.
// We check both variants to handle all environments safely.
const SESSION_COOKIE_NAMES = [
  "__Secure-next-auth.session-token", // HTTPS / production (Vercel)
  "next-auth.session-token",          // HTTP / local development
];

/**
 * Lightweight session check based on cookie presence.
 *
 * This does NOT verify the JWT signature — that is handled by NextAuth
 * on the API/server side. The proxy's job is purely to gate the UI and
 * return early for unauthenticated requests before they reach render code.
 *
 * Always enforce proper server-side session verification inside each
 * API Route Handler as well (defense-in-depth).
 */
function hasSessionCookie(request: NextRequest): boolean {
  const allCookies = request.cookies.getAll();
  return allCookies.some((c) => c.name.includes("session-token"));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = hasSessionCookie(request);

  // ── Guard: /api/admin/* ────────────────────────────────────────────────────
  // API consumers expect JSON — never redirect, always return 401.
  if (pathname.startsWith("/api/admin/")) {
    if (!isAuthenticated) {
      return NextResponse.json(
        {
          success: false,
          message: "غير مصرح لك بالوصول. يرجى تسجيل الدخول أولاً.",
        },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  // ── Guard: /dashboard/* ───────────────────────────────────────────────────
  // Redirect unauthenticated users to /login, preserving the original
  // destination so they can be sent back after a successful login.
  if (pathname.startsWith("/dashboard")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", request.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // All other paths pass through unchanged.
  return NextResponse.next();
}

export const config = {
  matcher: [
    /**
     * Only run this proxy on the routes we explicitly protect:
     *   /dashboard/**  — Dashboard pages (redirect to /login if unauth)
     *   /api/admin/**  — Admin API routes  (401 JSON if unauth)
     *
     * Static files, images, and NextAuth's own /api/auth/* routes are
     * intentionally excluded to prevent accidental interference.
     */
    "/dashboard/:path*",
    "/api/admin/:path*",
  ],
};
