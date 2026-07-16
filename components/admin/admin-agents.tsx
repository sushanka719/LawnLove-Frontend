"use client";

import Link from "next/link";
import { CheckCircle2, ClipboardList, XCircle } from "lucide-react";

import { UserAvatar } from "@/components/dashboard/user-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminAgents } from "@/hooks/use-admin";

export function AdminAgents() {
  const { data: agents, isLoading, isError } = useAdminAgents();

  if (isError) {
    return (
      <p className="text-destructive text-base">
        We couldn&apos;t load agents. Please refresh and try again.
      </p>
    );
  }

  if (isLoading || !agents) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-36 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (agents.length === 0) {
    return (
      <p className="text-lawn-text-secondary rounded-xl border border-[#cecece]/60 px-5 py-10 text-center text-base">
        No agents yet. Promote a user to agent from the Users tab.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {agents.map((a) => (
        <div
          key={a.id}
          className="bg-lawn-bg-2 flex flex-col gap-4 rounded-2xl border border-[#cecece]/50 p-5 shadow-[0px_4px_16px_0px_rgba(74,74,74,0.08)]"
        >
          <div className="flex items-center gap-3">
            <UserAvatar
              name={a.name}
              email={a.email}
              className="size-11"
              textClassName="text-lg"
              sizes="44px"
            />
            <div className="min-w-0 flex-1">
              <p className="text-lawn-text-primary truncate text-base font-semibold tracking-tight">
                {a.name || "—"}
              </p>
              <p className="text-lawn-text-secondary truncate text-sm tracking-tight">
                {a.email}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {a.payoutsEnabled ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-lawn-badge-bg px-2.5 py-0.5 text-xs font-semibold text-lawn-primary">
                <CheckCircle2 className="size-3.5" /> Payouts enabled
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-neutral-200 px-2.5 py-0.5 text-xs font-semibold text-neutral-600">
                <XCircle className="size-3.5" />
                {a.onboarded ? "Onboarding incomplete" : "Not onboarded"}
              </span>
            )}
            <span className="text-lawn-text-tertiary inline-flex items-center gap-1 text-xs font-medium tracking-tight">
              <ClipboardList className="size-3.5" />
              {a.activeJobs} active · {a.totalJobs} total
            </span>
          </div>

          <div className="mt-auto flex gap-2">
            <Link
              href={`/admin/jobs?agentId=${a.id}`}
              className="text-lawn-primary hover:bg-lawn-badge-bg rounded-lg border border-lawn-primary/30 px-3 py-1.5 text-sm font-medium tracking-tight transition-colors"
            >
              View jobs
            </Link>
            <Link
              href={`/admin/users/${a.id}`}
              className="text-lawn-text-secondary rounded-lg border border-[#cecece]/70 px-3 py-1.5 text-sm font-medium tracking-tight transition-colors hover:bg-black/[0.03]"
            >
              Manage
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
