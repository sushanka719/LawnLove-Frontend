import { NextRequest, NextResponse } from "next/server";

import { env } from "@/config/env";

export async function proxy(request: NextRequest) {
  const cookie = request.headers.get("cookie");

  const session = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/auth/get-session`, {
    headers: cookie ? { cookie } : undefined,
  })
    .then((res) => (res.ok ? res.json() : null))
    .catch(() => null);

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
