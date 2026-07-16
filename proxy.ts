import { NextRequest, NextResponse } from "next/server";

import { env } from "@/config/env";
import { homeForRole } from "@/lib/auth-routes";

// Routes that require an authenticated session — unauthenticated visitors are
// sent to /login.
const PROTECTED_ROUTES = ["/dashboard"];

// Routes that additionally require role=agent. Signed-out visitors go to /login;
// signed-in non-agents are bounced to their dashboard.
const AGENT_ROUTES = ["/agent"];

// Routes that require role=admin. Signed-out visitors go to /login; signed-in
// non-admins are bounced to their dashboard.
const ADMIN_ROUTES = ["/admin"];

// Auth entry points that only make sense while signed out — authenticated
// visitors are bounced to the dashboard. Deliberately excludes /reset-password
// and /set-password: those are token/session-gated flows that are legitimately
// reached while a session already exists (e.g. /set-password is opened right
// after the magic link signs the user in), so redirecting away would break them.
const GUEST_ONLY_ROUTES = ["/login", "/signup", "/forgot-password"];

const matches = (pathname: string, route: string) =>
  pathname === route || pathname.startsWith(`${route}/`);

type SessionResponse = { user?: { role?: string | null } } | null;

async function getSession(request: NextRequest): Promise<SessionResponse> {
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
  const isAgent = AGENT_ROUTES.some((route) => matches(pathname, route));
  const isAdmin = ADMIN_ROUTES.some((route) => matches(pathname, route));
  const isGuestOnly = GUEST_ONLY_ROUTES.some((route) => matches(pathname, route));

  const session = await getSession(request);

  if ((isProtected || isAgent || isAdmin) && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Agent area is role-gated — anyone who isn't an agent is sent to their own
  // home (admins → /admin, customers → /dashboard) rather than seeing a 403.
  if (isAgent && session?.user?.role !== "agent") {
    return NextResponse.redirect(
      new URL(homeForRole(session?.user?.role), request.url),
    );
  }

  // Admin area is role-gated the same way.
  if (isAdmin && session?.user?.role !== "admin") {
    return NextResponse.redirect(
      new URL(homeForRole(session?.user?.role), request.url),
    );
  }

  // Already signed in but on a guest-only page (e.g. /login) — send them to
  // the home that matches their role instead of always the customer dashboard.
  if (isGuestOnly && session) {
    return NextResponse.redirect(
      new URL(homeForRole(session.user?.role), request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/agent/:path*",
    "/admin/:path*",
    "/login",
    "/signup",
    "/forgot-password",
  ],
};
