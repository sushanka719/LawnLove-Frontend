import {
  CalendarCheck,
  DollarSign,
  TrendingUp,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";

import { ACCENT } from "@/components/admin/dashboard-mock";
import { DashboardCard } from "@/components/admin/dashboard-card";

function CardHeader({
  icon: Icon,
  label,
  delta,
}: {
  icon: LucideIcon;
  label: string;
  delta: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-muted-foreground flex items-center gap-2 text-[13px] font-medium">
        <Icon className="size-4" />
        {label}
      </div>
      <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-green-600">
        <TrendingUp className="size-[13px]" />
        {delta}
      </span>
    </div>
  );
}

function Value({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-3 text-[32px] font-semibold tracking-[-0.02em]">{children}</div>
  );
}

function MiniStat({
  value,
  label,
  color,
}: {
  value: string;
  label: string;
  color?: string;
}) {
  return (
    <div>
      <div className="text-lg font-semibold" style={color ? { color } : undefined}>
        {value}
      </div>
      <div className="text-muted-foreground text-xs">{label}</div>
    </div>
  );
}

function Sparkline({ d }: { d: string }) {
  return (
    <svg width="72" height="30" viewBox="0 0 72 30" fill="none">
      <path
        d={d}
        stroke={ACCENT.green}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function KpiCards() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {/* Total Revenue */}
      <DashboardCard className="p-[22px]">
        <CardHeader icon={DollarSign} label="Total Revenue" delta="12.4%" />
        <Value>$284,750</Value>
        <div className="flex items-end justify-between gap-2">
          <span className="text-muted-foreground text-xs">vs $253,200 last period</span>
          <Sparkline d="M2 26 L14 22 L26 24 L38 16 L50 18 L62 8 L70 4" />
        </div>
      </DashboardCard>

      {/* Bookings */}
      <DashboardCard className="p-[22px]">
        <CardHeader icon={CalendarCheck} label="Bookings" delta="8.1%" />
        <Value>3,482</Value>
        <div className="flex gap-7">
          <MiniStat value="64" label="Today" />
          <MiniStat value="94.2%" label="Completion" />
        </div>
      </DashboardCard>

      {/* Agents */}
      <DashboardCard className="p-[22px]">
        <CardHeader icon={Users} label="Agents" delta="5.6%" />
        <Value>218</Value>
        <div className="flex gap-7">
          <MiniStat value="47" label="Working" color={ACCENT.green} />
          <MiniStat value="9" label="Pending" color={ACCENT.orange} />
        </div>
      </DashboardCard>

      {/* Active Users */}
      <DashboardCard className="p-[22px]">
        <CardHeader icon={UserRound} label="Active Users" delta="2.3%" />
        <Value>12,840</Value>
        <div className="flex items-end justify-between gap-2">
          <span className="text-muted-foreground text-xs">
            +1,204 new · 76% retention
          </span>
          <Sparkline d="M2 24 L14 20 L26 22 L38 14 L50 12 L62 6 L70 5" />
        </div>
      </DashboardCard>
    </div>
  );
}
