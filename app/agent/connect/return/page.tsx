"use client";

import Link from "next/link";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

import { useConnectStatus } from "@/hooks/use-agent";

export default function ConnectReturnPage() {
  const { data, isLoading, isError } = useConnectStatus();

  return (
    <div className="bg-lawn-bg-2 mx-auto flex max-w-md flex-col items-center gap-4 rounded-xl p-8 text-center shadow-[0px_4px_8px_0px_rgba(74,74,74,0.14)]">
      {isLoading ? (
        <>
          <Loader2 className="text-lawn-primary size-10 animate-spin" />
          <p className="text-lawn-text-secondary text-base">
            Checking your payout status...
          </p>
        </>
      ) : isError ? (
        <>
          <XCircle className="size-10 text-red-600" />
          <p className="text-lawn-text-primary text-base font-semibold">
            We couldn&apos;t verify your payout status.
          </p>
        </>
      ) : data?.payoutsEnabled ? (
        <>
          <CheckCircle2 className="text-lawn-primary size-10" />
          <p className="text-lawn-text-primary text-lg font-semibold">
            Payouts are enabled
          </p>
          <p className="text-lawn-text-secondary text-base">
            You&apos;re all set to receive transfers after each job.
          </p>
        </>
      ) : (
        <>
          <XCircle className="size-10 text-[#b45309]" />
          <p className="text-lawn-text-primary text-lg font-semibold">Almost there</p>
          <p className="text-lawn-text-secondary text-base">
            Stripe still needs a few more details before payouts can be enabled. You can
            finish this from your jobs page.
          </p>
        </>
      )}

      <Link
        href="/agent"
        className="lawn-gradient-btn mt-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white"
      >
        Back to jobs
      </Link>
    </div>
  );
}
