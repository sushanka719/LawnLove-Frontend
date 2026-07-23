"use client";

import { Pie, PieChart } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminStats } from "@/hooks/use-admin";

// Booking states → donut, live from GET /admin/stats bookings.byStatus.
const chartConfig = {
  value: { label: "Bookings" },
  active: { label: "Active", color: "var(--chart-3)" },
  completed: { label: "Completed", color: "var(--chart-2)" },
  pendingPayment: { label: "Pending", color: "var(--chart-4)" },
  pastDue: { label: "Past due", color: "var(--chart-1)" },
  cancelled: { label: "Cancelled", color: "var(--destructive)" },
} satisfies ChartConfig;

const CATEGORIES = [
  { key: "active", label: "Active", color: "var(--chart-3)" },
  { key: "completed", label: "Completed", color: "var(--chart-2)" },
  { key: "pendingPayment", label: "Pending", color: "var(--chart-4)" },
  { key: "pastDue", label: "Past due", color: "var(--chart-1)" },
  { key: "cancelled", label: "Cancelled", color: "var(--destructive)" },
] as const;

export function BookingStatus() {
  const { data, isLoading } = useAdminStats();
  const byStatus = data?.bookings.byStatus ?? {};

  const chartData = CATEGORIES.map((c) => ({
    status: c.key,
    value: (byStatus as Record<string, number | undefined>)[c.key] ?? 0,
    fill: c.color,
  })).filter((d) => d.value > 0);

  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="bg-card flex flex-col rounded-xl p-6 shadow-[0px_4px_8px_0px_rgba(74,74,74,0.1)]">
      <div>
        <h2 className="text-lg font-bold tracking-[-0.01em]">Booking Status</h2>
        <p className="text-muted-foreground text-sm">
          {isLoading ? "…" : `${total.toLocaleString()} total`}
        </p>
      </div>

      {isLoading ? (
        <Skeleton className="mx-auto mt-6 aspect-square h-[240px] w-[240px] rounded-full" />
      ) : total === 0 ? (
        <p className="text-muted-foreground flex h-[240px] items-center justify-center text-sm">
          No bookings yet.
        </p>
      ) : (
        <ChartContainer
          config={chartConfig}
          className="mx-auto mt-6 aspect-square h-[240px]"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="status" hideLabel />} />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="status"
              innerRadius={68}
              outerRadius={100}
              paddingAngle={3}
              cornerRadius={7}
              strokeWidth={0}
              isAnimationActive={false}
            />
          </PieChart>
        </ChartContainer>
      )}

      <div className="mt-auto flex flex-wrap items-center justify-center gap-2.5 pt-4">
        {CATEGORIES.map((item) => (
          <span
            key={item.key}
            className="rounded-md px-3 py-1 text-xs font-medium text-white"
            style={{ backgroundColor: item.color }}
          >
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}
