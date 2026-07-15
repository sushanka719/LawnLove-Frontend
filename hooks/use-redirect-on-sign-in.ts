"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { sessionQueryKey } from "@/hooks/use-session";
import { getSession } from "@/lib/api/auth";
import { subscribeAuthSignal } from "@/lib/auth-channel";

// While `enabled`, watch for the current user completing sign-in in another tab
// and move this tab to the dashboard. Used by the signup "check your email"
// screen so it doesn't keep showing stale actions (Resend link / Open email)
// after the user verifies and signs in from the tab opened by the email link.
//
// Two triggers cover the cases:
//  - an instant BroadcastChannel signal from the tab that just signed in, and
//  - a session re-check when this tab regains focus/visibility, which handles
//    browsers without BroadcastChannel and the case where the other tab was
//    already closed by the time the user comes back.
export function useRedirectToDashboardOnSignIn(enabled: boolean) {
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled) return;

    let redirected = false;
    const goToDashboard = () => {
      if (redirected) return;
      redirected = true;
      // Drop the cached (signed-out) session so the destination reads the fresh
      // one; the proxy re-validates server-side on the navigation regardless.
      queryClient.invalidateQueries({ queryKey: sessionQueryKey });
      router.replace("/dashboard");
    };

    const recheckSession = async () => {
      if (redirected) return;
      const session = await getSession();
      if (session) goToDashboard();
    };

    const unsubscribe = subscribeAuthSignal((signal) => {
      if (signal === "signed-in") goToDashboard();
    });

    const onFocus = () => void recheckSession();
    const onVisibility = () => {
      if (document.visibilityState === "visible") void recheckSession();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      unsubscribe();
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [enabled, router, queryClient]);
}
