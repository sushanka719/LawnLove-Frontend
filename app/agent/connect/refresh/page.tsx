"use client";

import { useState } from "react";
import Link from "next/link";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { useStartConnectOnboarding } from "@/hooks/use-agent";
import { ApiError } from "@/lib/api/http";

// Stripe sends the agent here if the onboarding link expired before completion.
export default function ConnectRefreshPage() {
  const onboarding = useStartConnectOnboarding();
  const [redirecting, setRedirecting] = useState(false);

  const onRetry = async () => {
    try {
      setRedirecting(true);
      const { url } = await onboarding.mutateAsync();
      window.location.href = url;
    } catch (err) {
      setRedirecting(false);
      toast.error(err instanceof ApiError ? err.message : "Couldn't restart onboarding.");
    }
  };

  return (
    <div className="bg-lawn-bg-2 mx-auto flex max-w-md flex-col items-center gap-4 rounded-xl p-8 text-center shadow-[0px_4px_8px_0px_rgba(74,74,74,0.14)]">
      <RefreshCw className="text-lawn-primary size-10" />
      <p className="text-lawn-text-primary text-lg font-semibold">
        Your onboarding link expired
      </p>
      <p className="text-lawn-text-secondary text-base">
        No problem — start it again to finish setting up payouts.
      </p>
      <button
        type="button"
        onClick={onRetry}
        disabled={redirecting}
        className="lawn-gradient-btn rounded-xl px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
      >
        {redirecting ? "Redirecting..." : "Restart onboarding"}
      </button>
      <Link href="/agent" className="text-lawn-text-secondary text-sm font-medium">
        Back to jobs
      </Link>
    </div>
  );
}
