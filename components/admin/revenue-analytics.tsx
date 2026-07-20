"use client";

import { useMemo, useState } from "react";

import { DashboardCard } from "@/components/admin/dashboard-card";
import { Segmented } from "@/components/admin/segmented";
import {
  CHART_MAX,
  CHART_PERIODS,
  CHART_SERIES,
  MONTHS,
  SERIES_NAMES,
  type SeriesName,
} from "@/components/admin/dashboard-mock";
import { cn } from "@/lib/utils";

// Plot geometry (matches the source design's 800×300 viewBox).
const X0 = 50;
const X1 = 790;
const Y0 = 20;
const Y1 = 270;

function buildChart(series: SeriesName) {
  const { color, values } = CHART_SERIES[series];
  const points = values.map((v, i) => ({
    x: X0 + (i * (X1 - X0)) / 11,
    y: Y1 - (v / CHART_MAX) * (Y1 - Y0),
  }));
  const line = points
    .map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");
  const area = `${line} L${X1} ${Y1} L${X0} ${Y1} Z`;
  return { color, points, line, area };
}

const GRID_LINES = [20, 82, 145, 207, 270];
const Y_LABELS = ["$341k", "$256k", "$170k", "$85k", "$0"];

export function RevenueAnalytics() {
  const [period, setPeriod] = useState<(typeof CHART_PERIODS)[number]>("Monthly");
  const [series, setSeries] = useState<SeriesName>("Revenue");
  const chart = useMemo(() => buildChart(series), [series]);

  return (
    <DashboardCard className="p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-[17px] font-semibold tracking-[-0.01em]">
            Revenue Analytics
          </div>
          <div className="text-muted-foreground mt-0.5 text-[13px]">
            Platform performance over time
          </div>
        </div>
        <Segmented
          options={CHART_PERIODS}
          value={period}
          onChange={setPeriod}
          size="sm"
        />
      </div>

      {/* Series legend / toggles */}
      <div className="mt-[18px] mb-2 flex flex-wrap gap-2.5">
        {SERIES_NAMES.map((name) => {
          const active = name === series;
          const color = CHART_SERIES[name].color;
          return (
            <button
              key={name}
              type="button"
              onClick={() => setSeries(name)}
              className={cn(
                "inline-flex cursor-pointer items-center gap-[7px] rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                !active && "border-border bg-card text-muted-foreground",
              )}
              style={
                active
                  ? { borderColor: color, background: color, color: "#fff" }
                  : undefined
              }
            >
              <span
                className="size-2 rounded-full"
                style={{ background: active ? "#fff" : color }}
              />
              {name}
            </button>
          );
        })}
      </div>

      <svg
        viewBox="0 0 800 300"
        width="100%"
        height="300"
        className="block overflow-visible"
      >
        {GRID_LINES.map((y) => (
          <line key={y} x1={X0} y1={y} x2={X1} y2={y} stroke="var(--border)" />
        ))}
        {Y_LABELS.map((label, i) => (
          <text
            key={label}
            x="0"
            y={GRID_LINES[i] + 4}
            fill="var(--muted-foreground)"
            fontSize="11"
          >
            {label}
          </text>
        ))}

        <path d={chart.area} fill={chart.color} opacity="0.1" />
        <path
          d={chart.line}
          fill="none"
          stroke={chart.color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {chart.points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="3.5"
            fill="var(--card)"
            stroke={chart.color}
            strokeWidth="2"
          />
        ))}

        {MONTHS.map((label, i) => (
          <text
            key={label}
            x={(X0 + (i * 740) / 11).toFixed(1)}
            y="292"
            fill="var(--muted-foreground)"
            fontSize="11"
            textAnchor="middle"
          >
            {label}
          </text>
        ))}
      </svg>
    </DashboardCard>
  );
}
