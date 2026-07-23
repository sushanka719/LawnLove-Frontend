"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useAdminStats } from "@/hooks/use-admin";
import { formatCents } from "@/lib/jobs";

// Live KPI cards driven by GET /admin/stats. (The design's sparklines/deltas need
// a time series the stats endpoint doesn't provide, so they're omitted here — the
// Revenue Analysis chart below carries the trend.)
export function KpiCards() {
  const { data, isLoading } = useAdminStats();

  const bookingsTotal = data
    ? Object.values(data.bookings.byStatus).reduce((sum, n) => sum + (n ?? 0), 0)
    : 0;

  const cards = [
    {
      label: "Total revenue",
      value: data ? formatCents(data.money.grossVolumeCents) : null,
      sub: data ? `${formatCents(data.money.platformFeesCents)} in platform fees` : "",
    },
    {
      label: "Bookings",
      value: data ? bookingsTotal.toLocaleString() : null,
      sub: data ? `${data.bookings.byStatus.active ?? 0} active` : "",
    },
    {
      label: "Agents",
      value: data ? data.users.agents.toLocaleString() : null,
      sub: data ? `${data.jobs.active} active jobs` : "",
    },
    {
      label: "Customers",
      value: data ? data.users.customers.toLocaleString() : null,
      sub: data ? `${data.users.total.toLocaleString()} total users` : "",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-card rounded-xl p-6 shadow-[0px_4px_8px_0px_rgba(74,74,74,0.1)]"
        >
          <span className="text-[15px] font-semibold">{card.label}</span>
          <div className="mt-2">
            {isLoading || card.value === null ? (
              <Skeleton className="h-8 w-28" />
            ) : (
              <span className="text-[26px] font-extrabold tracking-[-0.02em] tabular-nums">
                {card.value}
              </span>
            )}
          </div>
          <p className="text-muted-foreground mt-1 text-xs">{card.sub}</p>
        </div>
      ))}
    </div>
  );
}
