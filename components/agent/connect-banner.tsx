"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { useConnectStatus, useStartConnectOnboarding } from "@/hooks/use-agent";
import { ApiError } from "@/lib/api/http";

// Shows payout-onboarding state. When payouts aren't enabled the agent can't be
// paid, so we surface a clear CTA to finish Stripe Connect onboarding.
export function ConnectBanner() {
  const { data, isLoading } = useConnectStatus();
  const onboarding = useStartConnectOnboarding();
  const [redirecting, setRedirecting] = useState(false);

  if (isLoading || data?.payoutsEnabled) {
    if (data?.payoutsEnabled) {
      return (
        <div className="border-lawn-badge-border bg-lawn-badge-bg flex items-center gap-2 rounded-xl border px-4 py-3">
          <CheckCircle2 className="text-lawn-primary size-5 shrink-0" />
          <p className="text-lawn-primary text-sm font-medium">
            Payouts enabled — you&apos;ll be paid automatically after each job&apos;s
            review window.
          </p>
        </div>
      );
    }
    return null;
  }

  const onOnboard = async () => {
    try {
      setRedirecting(true);
      const { url } = await onboarding.mutateAsync();
      window.location.href = url;
    } catch (err) {
      setRedirecting(false);
      toast.error(
        err instanceof ApiError
          ? err.message
          : "Couldn't start payout onboarding. Please try again.",
      );
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-[#f5c469] bg-[#fef3c7] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-2">
        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-[#b45309]" />
        <p className="text-sm font-medium text-[#7c4a03]">
          Set up payouts to get paid. Connect your bank via Stripe to receive transfers
          after each job.
        </p>
      </div>
      <button
        type="button"
        onClick={onOnboard}
        disabled={redirecting}
        className="lawn-gradient-btn shrink-0 rounded-xl px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
      >
        {redirecting ? "Redirecting..." : "Set up payouts"}
      </button>
    </div>
  );
}
