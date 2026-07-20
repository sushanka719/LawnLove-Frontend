import Link from "next/link";
import { Star } from "lucide-react";

import { DashboardCard } from "@/components/admin/dashboard-card";
import { ACCENT, TOP_AGENTS } from "@/components/admin/dashboard-mock";

const COLS = "grid-cols-[2.4fr_1.2fr_0.9fr_1.3fr_0.9fr_1fr]";

export function TopAgents() {
  return (
    <DashboardCard className="overflow-hidden">
      <div className="flex items-start justify-between px-6 pt-[22px] pb-3.5">
        <div>
          <div className="text-[17px] font-semibold tracking-[-0.01em]">
            Top Performing Agents
          </div>
          <div className="text-muted-foreground mt-0.5 text-[13px]">
            Ranked by revenue this month
          </div>
        </div>
        <Link href="#" className="text-[13px] font-medium">
          View all
        </Link>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[640px]">
          {/* Column headers */}
          <div
            className={`text-muted-foreground grid ${COLS} gap-2 px-6 pb-2.5 text-[11px] font-semibold tracking-[0.04em]`}
          >
            <div>AGENT</div>
            <div>CITY</div>
            <div>BOOKINGS</div>
            <div>COMPLETION</div>
            <div>RATING</div>
            <div className="text-right">REVENUE</div>
          </div>

          {TOP_AGENTS.map((agent) => (
            <div
              key={agent.name}
              className={`border-border hover:bg-muted grid ${COLS} items-center gap-2 border-t px-6 py-3 text-[13px] transition-colors`}
            >
              <div className="flex min-w-0 items-center gap-[11px]">
                <span
                  className="flex size-[34px] shrink-0 items-center justify-center rounded-full text-xs font-semibold"
                  style={{
                    background: agent.avatarBg,
                    color: agent.avatarColor,
                  }}
                >
                  {agent.initials}
                </span>
                <div className="min-w-0">
                  <div className="truncate font-semibold">{agent.name}</div>
                  <div className="text-muted-foreground text-xs">{agent.owner}</div>
                </div>
              </div>
              <div className="text-muted-foreground">{agent.city}</div>
              <div className="tabular-nums">{agent.bookings}</div>
              <div className="flex items-center gap-2">
                <span className="bg-muted h-1.5 flex-1 overflow-hidden rounded-full">
                  <span
                    className="block h-full rounded-full"
                    style={{
                      width: agent.completion,
                      background: ACCENT.green,
                    }}
                  />
                </span>
                <span className="text-muted-foreground w-8 text-xs">
                  {agent.completion}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Star
                  className="size-[13px]"
                  style={{ color: ACCENT.yellow, fill: ACCENT.yellow }}
                />
                {agent.rating}
              </div>
              <div className="text-right font-semibold tabular-nums">{agent.revenue}</div>
            </div>
          ))}
        </div>
      </div>
    </DashboardCard>
  );
}
