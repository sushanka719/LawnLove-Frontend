"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";

import { AgentTopbar } from "@/components/agent/agent-topbar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAgentSchedule, useAgentStats } from "@/hooks/use-agent";
import type { AgentScheduleVisit } from "@/lib/api/agent";
import {
  JOB_STATUS_LABELS,
  JOB_STATUS_STYLES,
  TIME_SLOT_LABELS,
  formatCents,
} from "@/lib/jobs";

// Agent (crew owner) dashboard — live stat cards + a grouped-day schedule of the
// agent's upcoming visits (this is the agent's view of the scheduler).
export function AgentDashboard() {
  const today = useTodayLabel();

  return (
    <div className="bg-lawn-bg-2 flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl shadow-[0px_0px_12px_2px_rgba(116,116,116,0.1)]">
      <AgentTopbar
        title="Welcome Back!"
        subtitle={today}
        showSearch={false}
        showAction={false}
      />

      <div className="flex flex-col gap-6 overflow-y-auto p-6 lg:p-8">
        <StatCards />
        <ScheduleList />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Stat cards                                                                 */
/* -------------------------------------------------------------------------- */

function StatCards() {
  const { data, isLoading } = useAgentStats();

  const cards = [
    { label: "Today's visits", value: data?.todayVisits },
    { label: "Unassigned", value: data?.unassigned },
    { label: "Completed this week", value: data?.weekCompleted },
    { label: "Active crew", value: data?.activeCrew },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-lawn-bg-2 flex flex-col gap-1.5 rounded-xl p-6 drop-shadow-[0px_4px_8px_rgba(74,74,74,0.14)]"
        >
          <p className="text-lawn-text-tertiary text-base tracking-tight">{card.label}</p>
          {isLoading ? (
            <Skeleton className="h-8 w-12" />
          ) : (
            <p className="text-lawn-text-primary text-2xl font-semibold tracking-tight">
              {card.value ?? 0}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Grouped-day schedule                                                       */
/* -------------------------------------------------------------------------- */

function ScheduleList() {
  const { data, isLoading, isError } = useAgentSchedule();

  const groups = groupByDay(data ?? []);

  return (
    <section className="bg-lawn-bg-2 flex flex-col gap-6 rounded-xl p-6 drop-shadow-[0px_4px_8px_rgba(74,74,74,0.14)]">
      <div className="flex flex-wrap items-center justify-between gap-5">
        <div className="flex flex-col gap-1">
          <h2 className="text-lawn-text-primary text-xl font-semibold tracking-tight">
            Schedule
          </h2>
          <p className="text-lawn-text-tertiary text-lg tracking-tight">
            Upcoming visits across your crew.
          </p>
        </div>
        <Link
          href="/agent/jobs"
          className="border-lawn-primary-light text-lawn-primary hover:bg-lawn-primary-light/10 shrink-0 rounded-xl border-[1.2px] px-8 py-3 text-base font-semibold tracking-tight whitespace-nowrap transition-colors"
        >
          View all jobs
        </Link>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-lawn-text-secondary py-6 text-center">
          Couldn&apos;t load the schedule.
        </p>
      )}

      {data && data.length === 0 && (
        <p className="text-lawn-text-secondary py-10 text-center">
          No upcoming visits scheduled.
        </p>
      )}

      {groups.map((group) => (
        <div key={group.key} className="flex flex-col gap-2">
          <h3 className="text-lawn-primary text-base font-semibold tracking-tight">
            {group.label}
          </h3>
          <div className="overflow-hidden rounded-xl border border-[#cecece]">
            {group.visits.map((visit, i) => (
              <VisitRow
                key={visit.id}
                visit={visit}
                last={i === group.visits.length - 1}
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

function VisitRow({ visit, last }: { visit: AgentScheduleVisit; last: boolean }) {
  return (
    <Link
      href={`/agent/jobs/${visit.id}`}
      className={`flex flex-wrap items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-black/[0.02] ${
        last ? "" : "border-b border-[#e1e1e1]"
      }`}
    >
      <div className="min-w-0">
        <p className="text-lawn-text-primary text-base font-semibold tracking-tight">
          {visit.booking.address}
        </p>
        <p className="text-lawn-text-tertiary text-sm tracking-tight">
          {TIME_SLOT_LABELS[visit.booking.timeSlot] ?? visit.booking.timeSlot}
          {visit.booking.customerName ? ` · ${visit.booking.customerName}` : ""}
          {" · "}
          {formatCents(visit.booking.totalPerVisit * 100)}
        </p>
      </div>
      <div className="flex items-center gap-3">
        {visit.employee ? (
          <span className="text-lawn-text-secondary text-sm font-medium">
            {visit.employee.name}
          </span>
        ) : (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
            Unassigned
          </span>
        )}
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${JOB_STATUS_STYLES[visit.status]}`}
        >
          {JOB_STATUS_LABELS[visit.status]}
        </span>
      </div>
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/* Grouping helpers                                                           */
/* -------------------------------------------------------------------------- */

type DayGroup = { key: string; label: string; visits: AgentScheduleVisit[] };

function groupByDay(visits: AgentScheduleVisit[]): DayGroup[] {
  const groups = new Map<string, AgentScheduleVisit[]>();
  for (const v of visits) {
    const key = v.scheduledDate ? v.scheduledDate.slice(0, 10) : "unscheduled";
    const arr = groups.get(key) ?? [];
    arr.push(v);
    groups.set(key, arr);
  }
  return Array.from(groups.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, v]) => ({ key, label: dayLabel(key), visits: v }));
}

function dayLabel(key: string): string {
  if (key === "unscheduled") return "Unscheduled";
  const date = new Date(`${key}T00:00:00`);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const same = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
  if (same(date, today)) return "Today";
  if (same(date, tomorrow)) return "Tomorrow";
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

/* -------------------------------------------------------------------------- */
/* Date helper                                                                */
/* -------------------------------------------------------------------------- */

const noopSubscribe = () => () => {};

function useTodayLabel(): string {
  return useSyncExternalStore(
    noopSubscribe,
    () =>
      new Date().toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    () => "",
  );
}
