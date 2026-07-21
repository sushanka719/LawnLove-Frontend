"use client";

import { CalendarDays } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  type TooltipProps,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart";

// Two smooth 30-day series (values in whole visits). "current" = this month
// (gold), "previous" = last month (gray). Static mock — swap for the admin API.
const CURRENT = [
  150, 152, 156, 150, 148, 150, 156, 164, 172, 178, 182, 188, 196, 206, 214, 222, 230,
  238, 244, 246, 244, 238, 230, 222, 214, 208, 200, 196, 190, 186,
];
const PREVIOUS = [
  176, 182, 188, 200, 210, 214, 212, 206, 198, 190, 182, 176, 172, 168, 164, 160, 156,
  152, 150, 152, 156, 162, 168, 172, 176, 178, 180, 180, 178, 176,
];

const DATA = CURRENT.map((c, i) => ({
  day: i + 1,
  current: c * 1_000_000,
  previous: PREVIOUS[i] * 1_000_000,
}));

const chartConfig = {
  current: { label: "This Month", color: "var(--chart-1)" },
  previous: { label: "Previous Month", color: "#c9c9c9" },
} satisfies ChartConfig;

function RevenueTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  const current = payload.find((p) => p.dataKey === "current") ?? payload[0];
  return (
    <div className="border-border bg-card rounded-xl border px-3.5 py-2.5 shadow-lg">
      <p className="text-muted-foreground text-[11px]">This Month</p>
      <p className="text-foreground text-base font-bold tabular-nums">
        {Number(current.value).toLocaleString()}
      </p>
      <p className="text-muted-foreground text-[11px]">Day {label}</p>
    </div>
  );
}

export function RevenueAnalytics() {
  return (
    <div className="bg-card rounded-xl p-6 shadow-[0px_4px_8px_0px_rgba(74,74,74,0.1)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-[-0.01em]">Revenue Analysis</h2>
          <p className="text-muted-foreground text-sm">Platform performance over time</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground hidden text-xs sm:inline">
            Previous Month
          </span>
          <button
            type="button"
            className="border-border bg-card text-foreground inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium"
          >
            March 2020
            <CalendarDays className="text-muted-foreground size-4" />
          </button>
        </div>
      </div>

      <p className="text-muted-foreground mt-6 text-sm font-medium">Total visits</p>

      <ChartContainer config={chartConfig} className="mt-2 aspect-auto h-[300px] w-full">
        <LineChart data={DATA} margin={{ top: 8, right: 12, bottom: 0, left: 4 }}>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis
            dataKey="day"
            type="number"
            domain={[1, 30]}
            ticks={[1, 5, 10, 15, 20, 25, 30]}
            tickLine={false}
            axisLine={false}
            tickMargin={10}
          />
          <YAxis
            domain={[140_000_000, 260_000_000]}
            ticks={[140_000_000, 180_000_000, 220_000_000, 260_000_000]}
            tickFormatter={(v) => `${v / 1_000_000}M`}
            tickLine={false}
            axisLine={false}
            width={44}
          />
          <ChartTooltip
            cursor={{ stroke: "var(--chart-1)", strokeDasharray: "4 4" }}
            content={<RevenueTooltip />}
          />
          <Line
            dataKey="previous"
            type="natural"
            stroke="var(--color-previous)"
            strokeWidth={3}
            dot={false}
            isAnimationActive={false}
          />
          <Line
            dataKey="current"
            type="natural"
            stroke="var(--color-current)"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 5, fill: "var(--chart-1)", stroke: "#ffffff", strokeWidth: 3 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}
