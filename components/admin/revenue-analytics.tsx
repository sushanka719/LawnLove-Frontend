"use client";

import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  type TooltipProps,
} from "recharts";

import { ChartContainer, ChartTooltip, type ChartConfig } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminRevenue } from "@/hooks/use-admin";
import { formatCents } from "@/lib/jobs";
import { cn } from "@/lib/utils";

const RANGES = [
  { key: "7d", label: "7 days" },
  { key: "30d", label: "30 days" },
  { key: "12m", label: "12 months" },
] as const;

const chartConfig = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
} satisfies ChartConfig;

function shortLabel(date: string, granularity: "day" | "month"): string {
  // date is YYYY-MM-DD (day) or YYYY-MM (month).
  if (granularity === "month") {
    const d = new Date(`${date}-01T00:00:00`);
    return d.toLocaleDateString(undefined, { month: "short" });
  }
  const d = new Date(`${date}T00:00:00`);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function RevenueTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  const point = payload[0];
  const raw = point.payload as { label: string; revenueCents: number };
  return (
    <div className="border-border bg-card rounded-xl border px-3.5 py-2.5 shadow-lg">
      <p className="text-muted-foreground text-[11px]">{raw.label}</p>
      <p className="text-foreground text-base font-bold tabular-nums">
        {formatCents(raw.revenueCents)}
      </p>
    </div>
  );
}

export function RevenueAnalytics() {
  const [range, setRange] = useState<"7d" | "30d" | "12m">("30d");
  const { data, isLoading } = useAdminRevenue(range);

  const points = data?.points ?? [];
  const granularity = data?.granularity ?? "day";
  const chartData = points.map((p) => ({
    label: shortLabel(p.date, granularity),
    revenue: p.revenueCents / 100,
    revenueCents: p.revenueCents,
  }));
  const totalCents = points.reduce((sum, p) => sum + p.revenueCents, 0);

  return (
    <div className="bg-card rounded-xl p-6 shadow-[0px_4px_8px_0px_rgba(74,74,74,0.1)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-[-0.01em]">Revenue Analysis</h2>
          <p className="text-muted-foreground text-sm">
            {isLoading ? "…" : `${formatCents(totalCents)} over the selected range`}
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-[var(--border)] p-0.5">
          {RANGES.map((r) => (
            <button
              key={r.key}
              type="button"
              onClick={() => setRange(r.key)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                range === r.key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <Skeleton className="mt-6 h-[300px] w-full" />
      ) : (
        <ChartContainer
          config={chartConfig}
          className="mt-4 aspect-auto h-[300px] w-full"
        >
          <LineChart data={chartData} margin={{ top: 8, right: 12, bottom: 0, left: 4 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              minTickGap={24}
            />
            <YAxis
              tickFormatter={(v) => `$${v >= 1000 ? `${Math.round(v / 1000)}k` : v}`}
              tickLine={false}
              axisLine={false}
              width={44}
            />
            <ChartTooltip
              cursor={{ stroke: "var(--chart-1)", strokeDasharray: "4 4" }}
              content={<RevenueTooltip />}
            />
            <Line
              dataKey="revenue"
              type="natural"
              stroke="var(--color-revenue)"
              strokeWidth={3}
              dot={false}
              activeDot={{
                r: 5,
                fill: "var(--chart-1)",
                stroke: "#ffffff",
                strokeWidth: 3,
              }}
              isAnimationActive={false}
            />
          </LineChart>
        </ChartContainer>
      )}
    </div>
  );
}
