"use client";

import Link from "next/link";
import { ChevronRight, Leaf } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { useAdminPlans } from "@/hooks/use-plans";
import { formatCents } from "@/lib/jobs";
import { planBillingLabel } from "@/lib/plans";
import { cn } from "@/lib/utils";

export function AdminPlans() {
  const { data: plans, isLoading, isError } = useAdminPlans();

  return (
    <section className="flex flex-col gap-5">
      {isError ? (
        <p className="text-destructive text-base">
          We couldn&apos;t load plans. Please refresh and try again.
        </p>
      ) : isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : !plans || plans.length === 0 ? (
        <p className="text-lawn-text-secondary rounded-xl border border-[#cecece]/60 px-5 py-10 text-center text-base">
          No plans yet. Create your first plan to populate the booking flow.
        </p>
      ) : (
        <div className="bg-lawn-bg-2 overflow-hidden rounded-xl shadow-[0px_4px_16px_0px_rgba(74,74,74,0.1)]">
          {plans.map((plan, i) => (
            <Link
              key={plan.id}
              href={`/admin/plans/${plan.id}`}
              className={cn(
                "flex items-center gap-4 px-5 py-4 transition hover:bg-black/[0.02]",
                i !== plans.length - 1 && "border-b border-[#cecece]/40",
              )}
            >
              <div className="bg-lawn-badge-bg flex size-11 shrink-0 items-center justify-center rounded-xl">
                <Leaf className="text-lawn-primary size-5" strokeWidth={1.75} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-lawn-text-primary truncate text-base font-semibold tracking-tight">
                    {plan.name}
                  </p>
                  <span className="text-lawn-text-tertiary shrink-0 text-xs tracking-tight">
                    {plan.slug}
                  </span>
                </div>
                <p className="text-lawn-text-secondary truncate text-sm tracking-tight">
                  {planBillingLabel(plan)} · {formatCents(plan.basePrice)} base
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-medium",
                    plan.active
                      ? "bg-lawn-badge-bg text-lawn-primary"
                      : "bg-neutral-200 text-neutral-600",
                  )}
                >
                  {plan.active ? "Active" : "Inactive"}
                </span>
                <span className="text-lawn-text-primary hidden text-sm font-semibold tracking-tight sm:inline">
                  {formatCents(plan.basePrice)}
                </span>
                <ChevronRight
                  className="text-lawn-text-secondary size-5 shrink-0"
                  strokeWidth={1.75}
                />
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
