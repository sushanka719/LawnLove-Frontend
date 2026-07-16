"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { getSession } from "@/lib/api/auth";
import { homeForRole, safeNext } from "@/lib/auth-routes";

// Post-OAuth forwarder. Social sign-in can't know the user's role before the
// redirect completes, so its callbackURL points here: we read the fresh session
// and send the user to the home that matches their role (admins → /admin,
// agents → /agent, customers → /dashboard), honoring an explicit ?next=.
function Continue() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    let active = true;
    void (async () => {
      const next = safeNext(searchParams.get("next"));
      if (next) {
        router.replace(next);
        return;
      }
      const session = await getSession();
      if (!active) return;
      router.replace(session ? homeForRole(session.user?.role) : "/login");
    })();
    return () => {
      active = false;
    };
  }, [router, searchParams]);

  return (
    <div className="bg-lawn-bg-2 flex min-h-screen items-center justify-center">
      <p className="text-lawn-text-secondary text-base tracking-tight">
        Signing you in…
      </p>
    </div>
  );
}

export default function ContinuePage() {
  return (
    <Suspense>
      <Continue />
    </Suspense>
  );
}
