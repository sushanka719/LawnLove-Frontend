"use client";

import { Area, AreaChart } from "recharts";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { ChartContainer } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

type Kpi = {
  id: string;
  label: string;
  value: string;
  sub: string;
  delta: string;
  up: boolean;
  color: string;
  data: number[];
};

const KPIS: Kpi[] = [
  {
    id: "revenue",
    label: "Total revenue",
    value: "$248,222",
    sub: "vs $222,124 last period",
    delta: "0.45%",
    up: true,
    color: "var(--chart-1)",
    data: [18, 12, 20, 14, 22, 16, 26, 20, 30],
  },
  {
    id: "bookings",
    label: "Bookings",
    value: "3,854",
    sub: "64 completed today",
    delta: "8.1%",
    up: true,
    color: "var(--chart-5)",
    data: [10, 16, 12, 22, 18, 26, 20, 28, 24],
  },
  {
    id: "agents",
    label: "Agents",
    value: "218",
    sub: "47 working · 9 pending",
    delta: "5.6%",
    up: true,
    color: "var(--chart-2)",
    data: [24, 20, 26, 18, 22, 16, 20, 14, 18],
  },
  {
    id: "users",
    label: "Active Users",
    value: "12,840",
    sub: "76% retention",
    delta: "0.45%",
    up: false,
    color: "var(--chart-4)",
    data: [14, 20, 16, 24, 18, 26, 22, 28, 20],
  },
];

function Sparkline({ id, color, data }: { id: string; color: string; data: number[] }) {
  const chartData = data.map((v, i) => ({ i, v }));
  const gradId = `spark-${id}`;
  return (
    <ChartContainer
      config={{ v: { label: "Value", color } }}
      className="aspect-auto h-[64px] w-full"
    >
      <AreaChart data={chartData} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          dataKey="v"
          type="natural"
          stroke={color}
          strokeWidth={2.5}
          fill={`url(#${gradId})`}
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ChartContainer>
  );
}

function KpiCard({ kpi }: { kpi: Kpi }) {
  const Arrow = kpi.up ? ArrowUpRight : ArrowDownRight;
  return (
    <div className="bg-card rounded-xl p-6 shadow-[0px_4px_8px_0px_rgba(74,74,74,0.1)]">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[15px] font-semibold">{kpi.label}</span>
        <span className="text-[22px] font-extrabold tracking-[-0.02em]">
          {kpi.value}
        </span>
      </div>
      <div className="mt-1 flex items-center justify-between gap-3">
        <span className="text-muted-foreground text-xs">{kpi.sub}</span>
        <span
          className={cn(
            "inline-flex items-center gap-0.5 text-xs font-semibold",
            kpi.up ? "text-[#15803d]" : "text-destructive",
          )}
        >
          +{kpi.delta}
          <Arrow className="size-3.5" />
        </span>
      </div>
      <div className="mt-3">
        <Sparkline id={kpi.id} color={kpi.color} data={kpi.data} />
      </div>
    </div>
  );
}

export function KpiCards() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {KPIS.map((kpi) => (
        <KpiCard key={kpi.id} kpi={kpi} />
      ))}
    </div>
  );
}
