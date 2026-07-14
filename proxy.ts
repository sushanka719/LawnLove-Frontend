import { NextRequest, NextResponse } from "next/server";

import { env } from "@/config/env";

// Routes that require an authenticated session — unauthenticated visitors are
// sent to /login.
const PROTECTED_ROUTES = ["/dashboard"];

// Auth entry points that only make sense while signed out — authenticated
// visitors are bounced to the dashboard. Deliberately excludes /reset-password
// and /set-password: those are token/session-gated flows that are legitimately
// reached while a session already exists (e.g. /set-password is opened right
// after the magic link signs the user in), so redirecting away would break them.
const GUEST_ONLY_ROUTES = ["/login", "/signup", "/forgot-password"];

const matches = (pathname: string, route: string) =>
  pathname === route || pathname.startsWith(`${route}/`);

async function getSession(request: NextRequest) {
  const cookie = request.headers.get("cookie");

  return fetch(`${env.NEXT_PUBLIC_API_URL}/api/auth/get-session`, {
    headers: cookie ? { cookie } : undefined,
  })
    .then((res) => (res.ok ? res.json() : null))
    .catch(() => null);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_ROUTES.some((route) => matches(pathname, route));
  const isGuestOnly = GUEST_ONLY_ROUTES.some((route) => matches(pathname, route));

  const session = await getSession(request);

  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isGuestOnly && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup", "/forgot-password"],
};
