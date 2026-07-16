// Where a signed-in user should land based on their role. Admins and agents
// have their own areas; everyone else uses the customer dashboard. Shared by the
// login flow, the OAuth forwarder, and the proxy so the "home" is defined once.
export function homeForRole(role?: string | null): string {
  if (role === "admin") return "/admin";
  if (role === "agent") return "/agent";
  return "/dashboard";
}

// Only allow same-origin relative redirects, to avoid open-redirect abuse.
// Returns null when there is no usable target so callers can fall back to a
// role-based home instead.
export function safeNext(next: string | null | undefined): string | null {
  if (next && next.startsWith("/") && !next.startsWith("//")) {
    return next;
  }
  return null;
}
