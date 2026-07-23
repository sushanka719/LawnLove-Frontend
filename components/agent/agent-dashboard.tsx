"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";

import { AgentStatusBadge } from "@/components/agent/agent-status-badge";
import {
  SCHEDULE_ROWS,
  STAT_CARDS,
  type ScheduleRow,
} from "@/components/agent/agent-mock";
import { AgentTopbar, InitialsAvatar } from "@/components/agent/agent-topbar";

// Agent (crew owner) dashboard — Figma node 1111:8359.
//
// Visual mockup wired to static data (see `agent-mock.ts`): the agent backend
// does not yet expose crew, per-booking customers, or payout figures. Only the
// header date is real.
export function AgentDashboard() {
  const today = useTodayLabel();

  return (
    <div className="bg-lawn-bg-2 flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl shadow-[0px_0px_12px_2px_rgba(116,116,116,0.1)]">
      <AgentTopbar title="Welcome Back!" subtitle={today} />

      <div className="flex flex-col gap-6 overflow-y-auto p-6 lg:p-8">
        <StatCards />
        <TodaysSchedule />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Stat cards                                                                 */
/* -------------------------------------------------------------------------- */

function StatCards() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {STAT_CARDS.map((card, i) => (
        <div
          key={i}
          className="bg-lawn-bg-2 flex flex-col gap-1.5 rounded-xl p-6 drop-shadow-[0px_4px_8px_rgba(74,74,74,0.14)]"
        >
          <p className="text-lawn-text-tertiary text-base tracking-tight">{card.label}</p>
          <p className="text-lawn-text-primary text-2xl font-semibold tracking-tight">
            {card.value}
          </p>
          <p className="text-lawn-text-tertiary text-base tracking-tight">{card.sub}</p>
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Today's Schedule table                                                     */
/* -------------------------------------------------------------------------- */

const COLUMNS = [
  "Schedule Time",
  "Service",
  "Customer",
  "Assigned To",
  "Status",
] as const;

function TodaysSchedule() {
  return (
    <section className="bg-lawn-bg-2 flex flex-col gap-8 rounded-xl p-6 drop-shadow-[0px_4px_8px_rgba(74,74,74,0.14)]">
      <div className="flex flex-wrap items-center justify-between gap-5">
        <div className="flex flex-col gap-2">
          <h2 className="text-lawn-text-primary text-xl font-semibold tracking-tight">
            Today&apos;s Schedule
          </h2>
          <p className="text-lawn-text-tertiary text-lg tracking-tight">
            Jobs assigned across your crew.
          </p>
        </div>
        <Link
          href="/agent/bookings"
          className="border-lawn-primary-light text-lawn-primary hover:bg-lawn-primary-light/10 shrink-0 rounded-xl border-[1.2px] px-8 py-3 text-base font-semibold tracking-tight whitespace-nowrap transition-colors"
        >
          View all bookings
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#cecece]">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr>
              {COLUMNS.map((col) => (
                <th
                  key={col}
                  className="text-lawn-text-tertiary border-b border-[#e1e1e1] px-5 py-4 text-base font-semibold tracking-tight whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SCHEDULE_ROWS.map((row, i) => (
              <ScheduleTableRow key={i} row={row} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ScheduleTableRow({ row }: { row: ScheduleRow }) {
  return (
    <tr className="h-20">
      <td className="text-lawn-text-primary border-b border-[#e1e1e1] px-5 py-4 text-base font-semibold tracking-tight whitespace-nowrap">
        {row.time}
      </td>
      <td className="text-lawn-text-primary border-b border-[#e1e1e1] px-5 py-4 text-base font-semibold tracking-tight whitespace-nowrap">
        {row.service}
      </td>
      <td className="border-b border-[#e1e1e1] px-5 py-4">
        <div className="flex items-center gap-3">
          <InitialsAvatar name={row.customer.name} color={row.customer.color} />
          <div className="min-w-0">
            <p className="text-lawn-text-primary text-base font-semibold tracking-tight whitespace-nowrap">
              {row.customer.name}
            </p>
            <p className="text-lawn-text-tertiary text-base tracking-tight whitespace-nowrap">
              {row.customer.email}
            </p>
          </div>
        </div>
      </td>
      <td className="border-b border-[#e1e1e1] px-5 py-4">
        <div className="flex items-center gap-3">
          <InitialsAvatar name={row.assignedTo.name} color={row.assignedTo.color} />
          <span className="text-lawn-text-primary text-base font-semibold tracking-tight whitespace-nowrap">
            {row.assignedTo.name}
          </span>
        </div>
      </td>
      <td className="border-b border-[#e1e1e1] px-5 py-4">
        <div className="flex justify-center">
          <AgentStatusBadge status={row.status} />
        </div>
      </td>
    </tr>
  );
}

/* -------------------------------------------------------------------------- */
/* Date helper                                                                */
/* -------------------------------------------------------------------------- */

// Today's date, resolved on the client only (empty on the server) so the user's
// local date renders without a hydration mismatch.
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
