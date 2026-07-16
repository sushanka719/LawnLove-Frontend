"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink, MapPin } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminDisputes, useRefundJob } from "@/hooks/use-admin";
import type { AdminDispute } from "@/lib/api/admin";
import { ApiError } from "@/lib/api/http";
import { formatCents } from "@/lib/jobs";

function errMessage(err: unknown, fallback: string) {
  return err instanceof ApiError ? err.message : fallback;
}

export function AdminDisputes() {
  const { data: disputes, isLoading, isError } = useAdminDisputes();

  if (isError) {
    return (
      <p className="text-destructive text-base">
        We couldn&apos;t load disputes. Please refresh and try again.
      </p>
    );
  }

  if (isLoading || !disputes) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (disputes.length === 0) {
    return (
      <p className="text-lawn-text-secondary rounded-xl border border-[#cecece]/60 px-5 py-12 text-center text-base">
        No open disputes. 🎉
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {disputes.map((d) => (
        <DisputeCard key={d.id} dispute={d} />
      ))}
    </div>
  );
}

function DisputeCard({ dispute: d }: { dispute: AdminDispute }) {
  const refund = useRefundJob();
  const [confirming, setConfirming] = useState(false);

  const handleRefund = () => {
    refund.mutate(d.id, {
      onSuccess: () => {
        toast.success("Charge refunded.");
        setConfirming(false);
      },
      onError: (e) => toast.error(errMessage(e, "Couldn't refund.")),
    });
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-red-200 bg-red-50/50 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-lawn-text-primary flex items-center gap-1.5 text-base font-semibold tracking-tight">
            <MapPin className="text-lawn-text-tertiary size-4 shrink-0" />
            {d.address}
          </p>
          <p className="text-lawn-text-secondary mt-1 text-sm tracking-tight">
            Customer: {d.customer?.name || d.customer?.email || "—"}
          </p>
          <p className="text-lawn-text-secondary text-sm tracking-tight">
            Agent: {d.agent ? d.agent.name || d.agent.email : "Unassigned"}
          </p>
          {d.completedAt && (
            <p className="text-lawn-text-tertiary text-sm tracking-tight">
              Completed {new Date(d.completedAt).toLocaleString()}
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-lawn-text-primary text-lg font-bold tracking-tight">
            {d.amount != null ? formatCents(d.amount) : "—"}
          </p>
          <p className="text-lawn-text-tertiary text-xs tracking-tight">
            held in escrow
          </p>
        </div>
      </div>

      {d.review && (
        <div className="rounded-xl bg-white/70 px-4 py-3">
          <p className="text-lawn-text-primary text-sm font-semibold tracking-tight">
            {"★".repeat(d.review.rating)}
            <span className="text-lawn-text-tertiary">
              {"★".repeat(Math.max(0, 5 - d.review.rating))}
            </span>
          </p>
          {d.review.comment && (
            <p className="text-lawn-text-secondary mt-1 text-sm tracking-tight">
              “{d.review.comment}”
            </p>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={`/admin/jobs/${d.id}`}
          className="text-lawn-text-secondary hover:text-lawn-primary inline-flex items-center gap-1.5 text-sm font-medium tracking-tight"
        >
          View job <ExternalLink className="size-3.5" />
        </Link>
        <div className="ml-auto">
          {!d.canRefund ? (
            <p className="text-lawn-text-tertiary text-sm tracking-tight">
              No charge to refund.
            </p>
          ) : confirming ? (
            <div className="flex gap-2">
              <Button
                variant="destructive"
                size="lg"
                onClick={handleRefund}
                disabled={refund.isPending}
              >
                {refund.isPending ? "Refunding…" : "Confirm refund"}
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => setConfirming(false)}
                disabled={refund.isPending}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              variant="destructive"
              size="lg"
              onClick={() => setConfirming(true)}
            >
              Refund customer
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
