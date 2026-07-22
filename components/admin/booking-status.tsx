"use client";

import { Pie, PieChart } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

// Four booking states from the Figma donut (node 967:1739). Colors map to the
// admin chart tokens; Cancelled uses the destructive red so all four arcs read
// distinctly. Static mock — swap for the admin API.
const chartConfig = {
  value: { label: "Bookings" },
  completed: { label: "Completed", color: "var(--chart-2)" },
  scheduled: { label: "Scheduled", color: "var(--chart-3)" },
  inProgress: { label: "In Progress", color: "var(--chart-4)" },
  cancelled: { label: "Cancelled", color: "var(--destructive)" },
} satisfies ChartConfig;

const DATA = [
  { status: "completed", value: 1840, fill: "var(--color-completed)" },
  { status: "scheduled", value: 642, fill: "var(--color-scheduled)" },
  { status: "inProgress", value: 318, fill: "var(--color-inProgress)" },
  { status: "cancelled", value: 682, fill: "var(--color-cancelled)" },
];

const LEGEND = [
  { key: "completed", label: "Completed", color: "var(--chart-2)" },
  { key: "scheduled", label: "Scheduled", color: "var(--chart-3)" },
  { key: "inProgress", label: "In Progress", color: "var(--chart-4)" },
  { key: "cancelled", label: "Cancelled", color: "var(--destructive)" },
] as const;

export function BookingStatus() {
  return (
    <div className="bg-card flex flex-col rounded-xl p-6 shadow-[0px_4px_8px_0px_rgba(74,74,74,0.1)]">
      <div>
        <h2 className="text-lg font-bold tracking-[-0.01em]">Booking Status</h2>
        <p className="text-muted-foreground text-sm">3,482 total this month</p>
      </div>

      <ChartContainer
        config={chartConfig}
        className="mx-auto mt-6 aspect-square h-[240px]"
      >
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent nameKey="status" hideLabel />} />
          <Pie
            data={DATA}
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

      <div className="mt-auto flex flex-wrap items-center justify-center gap-2.5 pt-4">
        {LEGEND.map((item) => (
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
