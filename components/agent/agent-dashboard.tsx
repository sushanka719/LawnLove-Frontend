"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { ChevronRight, Clock, Leaf, Plus, TrendingUp } from "lucide-react";

import { ConnectBanner } from "@/components/agent/connect-banner";
import {
  DashboardSearch,
  GradientButton,
  NotificationBell,
} from "@/components/dashboard/dashboard-actions";
import { JobStatusBadge } from "@/components/jobs/job-status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAgentJobs, useConnectStatus } from "@/hooks/use-agent";
import type { AgentJob, JobStatus } from "@/lib/api/agent";
import { formatCents, formatScheduleDate, TIME_SLOT_LABELS } from "@/lib/jobs";

// Active work the agent still has to do vs. everything already in the past.
const ACTIVE_STATUSES = new Set<JobStatus>(["assigned", "started"]);
// Statuses that count as a paid/earning visit for the "Completed" stat.
const EARNED_STATUSES = new Set<JobStatus>(["completed", "released", "paid"]);

export function AgentDashboard() {
  const { data: jobs, isLoading, isError } = useAgentJobs();
  const { data: connect } = useConnectStatus();
  const today = useTodayLabel();

  const active = jobs?.filter((j) => ACTIVE_STATUSES.has(j.status)) ?? [];
  const past = jobs?.filter((j) => !ACTIVE_STATUSES.has(j.status)) ?? [];
  const nextJob = active.reduce<AgentJob | undefined>((soonest, j) => {
    if (!soonest) return j;
    return new Date(j.booking.scheduleDate) < new Date(soonest.booking.scheduleDate)
      ? j
      : soonest;
  }, undefined);
  const earned = past.filter((j) => EARNED_STATUSES.has(j.status));
  const earnedTotalCents = earned.reduce(
    (sum, j) => sum + j.booking.totalPerVisit * 100,
    0,
  );

  return (
    <div className="bg-lawn-bg-2 flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl shadow-[0px_0px_12px_2px_rgba(116,116,116,0.1)]">
      {/* Topbar */}
      <header className="flex shrink-0 flex-col gap-4 border-b border-[#cecece]/40 px-6 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="min-w-0">
          <h1 className="text-lawn-primary text-2xl font-bold tracking-tight">
            Welcome Back!
          </h1>
          <p className="text-lawn-text-primary text-lg tracking-tight">{today}</p>
        </div>
        <div className="flex items-center gap-4 lg:gap-5">
          <DashboardSearch />
          <NotificationBell />
          <GradientButton icon={Plus}>Invite agent</GradientButton>
        </div>
      </header>

      {/* Content */}
      <div className="flex flex-col gap-8 p-6 lg:p-8">
        {connect && !connect.payoutsEnabled && <ConnectBanner />}

        {isError ? (
          <p className="text-destructive text-base">
            We couldn&apos;t load your dashboard. Please refresh and try again.
          </p>
        ) : (
          <>
            <StatCards
              isLoading={isLoading}
              nextJob={nextJob}
              activeCount={active.length}
              completedCount={earned.length}
              earnedTotalCents={earnedTotalCents}
            />
            <UpcomingSection isLoading={isLoading} jobs={active} />
            <PastVisitSection isLoading={isLoading} jobs={past} />
          </>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Stat cards                                                                 */
/* -------------------------------------------------------------------------- */

function StatCards({
  isLoading,
  nextJob,
  activeCount,
  completedCount,
  earnedTotalCents,
}: {
  isLoading: boolean;
  nextJob: AgentJob | undefined;
  activeCount: number;
  completedCount: number;
  earnedTotalCents: number;
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Skeleton className="h-[132px] w-full rounded-2xl" />
        <Skeleton className="h-[132px] w-full rounded-2xl" />
        <Skeleton className="h-[132px] w-full rounded-2xl sm:col-span-2 xl:col-span-1" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {/* Next visit */}
      <div className="relative overflow-hidden rounded-2xl border border-[#2d5a27]/10 bg-white p-6 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
        <div className="absolute -top-7 right-6 size-24 rounded-full bg-[#2d5a27] opacity-5" />
        <p className="text-lawn-text-secondary relative text-base tracking-tight">
          NEXT VISIT
        </p>
        <p className="text-lawn-text-primary relative mt-3 text-[32px] font-bold tracking-tight">
          {nextJob ? formatShortDate(nextJob.booking.scheduleDate) : "—"}
        </p>
        <div className="text-lawn-text-secondary relative mt-1.5 flex items-center gap-1.5 text-base tracking-tight">
          <Clock className="size-5 shrink-0" strokeWidth={1.75} />
          {nextJob ? daysUntil(nextJob.booking.scheduleDate) : "Nothing scheduled"}
        </div>
      </div>

      {/* Active jobs */}
      <div className="bg-lawn-primary relative overflow-hidden rounded-2xl p-6 text-white shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
        <div className="absolute top-13 right-6 size-28 rounded-full bg-white opacity-10" />
        <p className="relative text-base tracking-tight">ACTIVE JOBS</p>
        <p className="relative mt-3 text-[32px] font-bold tracking-tight">
          {activeCount}
        </p>
        <p className="relative mt-1.5 text-base tracking-tight">
          {activeCount === 1 ? "Job assigned to you" : "Jobs assigned to you"}
        </p>
      </div>

      {/* Completed / earnings */}
      <div className="relative overflow-hidden rounded-2xl border border-[#2d5a27]/10 bg-white p-6 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] sm:col-span-2 xl:col-span-1">
        <div className="absolute -top-7 right-6 size-24 rounded-full bg-[#4a8c3f] opacity-5" />
        <p className="text-lawn-text-secondary relative text-base tracking-tight">
          Completed
        </p>
        <p className="text-lawn-text-primary relative mt-3 text-[32px] font-bold tracking-tight">
          {completedCount}
        </p>
        <div className="text-lawn-text-secondary relative mt-1.5 flex items-center gap-1.5 text-base tracking-tight">
          <TrendingUp className="size-5 shrink-0" strokeWidth={1.75} />
          {formatCents(earnedTotalCents)} earned
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Upcoming                                                                   */
/* -------------------------------------------------------------------------- */

function UpcomingSection({ isLoading, jobs }: { isLoading: boolean; jobs: AgentJob[] }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lawn-text-primary text-xl font-semibold tracking-tight">
        Upcoming
      </h2>
      {isLoading ? (
        <Skeleton className="h-24 w-full rounded-xl" />
      ) : jobs.length === 0 ? (
        <EmptyState>No upcoming visits.</EmptyState>
      ) : (
        <div className="flex flex-col gap-3">
          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/agent/jobs/${job.id}`}
              className="bg-lawn-bg-2 flex items-center gap-4 rounded-xl p-5 drop-shadow-[0px_4px_8px_rgba(74,74,74,0.14)] transition hover:opacity-90"
            >
              <VisitLead job={job} />
              <VisitTrailing job={job} />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Past visits                                                                */
/* -------------------------------------------------------------------------- */

function PastVisitSection({ isLoading, jobs }: { isLoading: boolean; jobs: AgentJob[] }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lawn-text-primary text-xl font-semibold tracking-tight">
        Past Visit
      </h2>
      {isLoading ? (
        <Skeleton className="h-40 w-full rounded-xl" />
      ) : jobs.length === 0 ? (
        <EmptyState>No past visits yet.</EmptyState>
      ) : (
        <div className="bg-lawn-bg-2 overflow-hidden rounded-xl shadow-[0px_4px_16px_0px_rgba(74,74,74,0.14)]">
          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/agent/jobs/${job.id}`}
              className="flex items-center gap-4 border-b border-[#cecece]/40 px-6 py-5 transition last:border-b-0 hover:bg-black/[0.02]"
            >
              <VisitLead job={job} />
              <VisitTrailing job={job} />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Shared visit-row pieces                                                    */
/* -------------------------------------------------------------------------- */

function VisitLead({ job }: { job: AgentJob }) {
  const timeSlot =
    TIME_SLOT_LABELS[job.booking.timeSlot]?.split(" (")[0] ?? job.booking.timeSlot;
  return (
    <div className="flex min-w-0 flex-1 items-center gap-4">
      <div className="bg-lawn-badge-bg flex size-14 shrink-0 items-center justify-center rounded-xl">
        <Leaf className="text-lawn-primary size-6" strokeWidth={1.75} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-lawn-text-primary truncate text-lg font-semibold tracking-tight">
          {job.booking.address}
        </p>
        <p className="text-lawn-text-secondary truncate text-base">
          {formatScheduleDate(job.booking.scheduleDate)} · {timeSlot}
        </p>
      </div>
    </div>
  );
}

function VisitTrailing({ job }: { job: AgentJob }) {
  return (
    <div className="flex shrink-0 items-center gap-3 sm:gap-4">
      <JobStatusBadge status={job.status} />
      <span className="text-lawn-text-primary hidden text-lg font-semibold tracking-tight sm:inline">
        {formatCents(job.booking.totalPerVisit * 100)}
      </span>
      <ChevronRight className="text-lawn-text-secondary size-5 shrink-0" />
    </div>
  );
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-lawn-text-secondary rounded-xl border border-[#cecece]/60 px-5 py-8 text-center text-base">
      {children}
    </p>
  );
}

/* -------------------------------------------------------------------------- */
/* Date helpers                                                               */
/* -------------------------------------------------------------------------- */

// Today's date, resolved on the client only (empty on the server) so the user's
// local date renders without a hydration mismatch. Returning an equal string on
// every snapshot keeps useSyncExternalStore stable.
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

// "Jun 30" — short month + day, matching the stat-card treatment.
function formatShortDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

// Human relative day ("Today", "Tomorrow", "In 4 days", "2 days ago").
function daysUntil(iso: string): string {
  const target = new Date(iso);
  if (Number.isNaN(target.getTime())) return "";
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const startOfTarget = new Date(target);
  startOfTarget.setHours(0, 0, 0, 0);
  const diffDays = Math.round(
    (startOfTarget.getTime() - startOfToday.getTime()) / 86_400_000,
  );
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays > 1) return `In ${diffDays} days`;
  if (diffDays === -1) return "Yesterday";
  return `${Math.abs(diffDays)} days ago`;
}
