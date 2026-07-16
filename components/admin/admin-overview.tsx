"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ClipboardList,
  DollarSign,
  HardHat,
  PiggyBank,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { useAdminStats } from "@/hooks/use-admin";
import { formatCents, JOB_STATUS_LABELS } from "@/lib/jobs";
import type { JobStatus } from "@/lib/api/agent";

type Tile = {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  href?: string;
  accent?: boolean;
};

export function AdminOverview() {
  const { data, isLoading, isError } = useAdminStats();

  if (isError) {
    return (
      <p className="text-destructive text-base">
        We couldn&apos;t load the dashboard. Please refresh and try again.
      </p>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  const tiles: Tile[] = [
    {
      label: "Total users",
      value: String(data.users.total),
      hint: `${data.users.customers} customers`,
      icon: Users,
      href: "/admin/users",
    },
    {
      label: "Agents",
      value: String(data.users.agents),
      hint: "Field crew",
      icon: HardHat,
      href: "/admin/agents",
    },
    {
      label: "Active jobs",
      value: String(data.jobs.active),
      hint: "Assigned · in progress · in review",
      icon: ClipboardList,
      href: "/admin/jobs",
    },
    {
      label: "Open disputes",
      value: String(data.jobs.disputed),
      hint: data.jobs.disputed > 0 ? "Needs attention" : "All clear",
      icon: AlertTriangle,
      href: "/admin/disputes",
      accent: data.jobs.disputed > 0,
    },
    {
      label: "Gross volume",
      value: formatCents(data.money.grossVolumeCents),
      hint: "All-time charged",
      icon: DollarSign,
    },
    {
      label: "Platform fees",
      value: formatCents(data.money.platformFeesCents),
      hint: "Your cut, all-time",
      icon: PiggyBank,
    },
    {
      label: "Pending payout",
      value: formatCents(data.money.pendingPayoutCents),
      hint: "Held in escrow",
      icon: Wallet,
    },
  ];

  const jobStatuses = Object.entries(data.jobs.byStatus) as [
    JobStatus,
    number,
  ][];

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {tiles.map((tile) => (
          <StatTile key={tile.label} tile={tile} />
        ))}
      </div>

      {jobStatuses.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-lawn-text-primary text-xl font-semibold tracking-tight">
            Jobs by status
          </h2>
          <div className="flex flex-wrap gap-3">
            {jobStatuses.map(([status, count]) => (
              <Link
                key={status}
                href={`/admin/jobs?status=${status}`}
                className="bg-lawn-bg-2 flex items-center gap-3 rounded-xl border border-[#cecece]/50 px-4 py-3 transition hover:border-lawn-primary/40"
              >
                <span className="text-lawn-text-primary text-2xl font-bold tracking-tight">
                  {count}
                </span>
                <span className="text-lawn-text-secondary text-sm font-medium tracking-tight">
                  {JOB_STATUS_LABELS[status]}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function StatTile({ tile }: { tile: Tile }) {
  const { label, value, hint, icon: Icon, href, accent } = tile;
  const inner = (
    <div
      className={
        "bg-lawn-bg-2 flex h-full items-start justify-between gap-3 rounded-2xl border px-5 py-5 shadow-[0px_4px_16px_0px_rgba(74,74,74,0.08)] transition " +
        (accent
          ? "border-red-300"
          : "border-[#cecece]/50 " + (href ? "hover:border-lawn-primary/40" : ""))
      }
    >
      <div className="min-w-0">
        <p className="text-lawn-text-secondary text-sm font-medium tracking-tight">
          {label}
        </p>
        <p
          className={
            "mt-1 text-3xl font-bold tracking-tight " +
            (accent ? "text-red-600" : "text-lawn-text-primary")
          }
        >
          {value}
        </p>
        {hint && (
          <p className="text-lawn-text-tertiary mt-1 truncate text-sm tracking-tight">
            {hint}
          </p>
        )}
      </div>
      <span
        className={
          "flex size-10 shrink-0 items-center justify-center rounded-xl " +
          (accent ? "bg-red-100 text-red-600" : "bg-lawn-badge-bg text-lawn-primary")
        }
      >
        <Icon className="size-5" strokeWidth={1.75} />
      </span>
    </div>
  );

  return href ? (
    <Link href={href} className="group block">
      {inner}
    </Link>
  ) : (
    inner
  );
}
