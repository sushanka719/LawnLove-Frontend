"use client";

import Link from "next/link";
import { ChevronRight, MapPin } from "lucide-react";

import { ConnectBanner } from "@/components/agent/connect-banner";
import { JobStatusBadge } from "@/components/jobs/job-status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAgentJobs } from "@/hooks/use-agent";
import type { AgentJob } from "@/lib/api/agent";
import { formatCents, formatScheduleDate, TIME_SLOT_LABELS } from "@/lib/jobs";

// Active work first, then everything else — both already date-sorted server-side.
const ACTIVE_STATUSES = new Set(["assigned", "started"]);

function JobCard({ job }: { job: AgentJob }) {
  const payout = job.booking.totalPerVisit * 100;
  return (
    <Link
      href={`/agent/jobs/${job.id}`}
      className="bg-lawn-bg-2 flex items-center gap-4 rounded-xl p-5 shadow-[0px_4px_8px_0px_rgba(74,74,74,0.14)] transition hover:opacity-90"
    >
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex items-center gap-2">
          <MapPin className="text-lawn-primary size-4 shrink-0" />
          <p className="text-lawn-text-primary truncate text-base font-semibold tracking-tight">
            {job.booking.address}
          </p>
        </div>
        <p className="text-lawn-text-secondary text-sm">
          {formatScheduleDate(job.booking.scheduleDate)} ·{" "}
          {TIME_SLOT_LABELS[job.booking.timeSlot]?.split(" (")[0] ?? job.booking.timeSlot}{" "}
          · ~{job.booking.estimatedAreaSqFt.toLocaleString()} sq ft
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <JobStatusBadge status={job.status} />
        <span className="text-lawn-text-primary hidden text-base font-semibold sm:inline">
          {formatCents(payout)}
        </span>
        <ChevronRight className="text-lawn-text-secondary size-5" />
      </div>
    </Link>
  );
}

export function AgentJobs() {
  const { data: jobs, isLoading, isError } = useAgentJobs();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lawn-primary text-2xl font-bold tracking-tight">Your Jobs</h1>
        <p className="text-lawn-text-secondary text-base">
          Start a job on site, capture before &amp; after photos, then complete it.
        </p>
      </div>

      <ConnectBanner />

      {isLoading ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
        </div>
      ) : isError ? (
        <p className="text-destructive text-base">
          We couldn&apos;t load your jobs. Please refresh and try again.
        </p>
      ) : !jobs || jobs.length === 0 ? (
        <p className="text-lawn-text-secondary rounded-xl border border-[#cecece]/60 px-5 py-8 text-center text-base">
          No jobs assigned to you yet.
        </p>
      ) : (
        <>
          <Section
            title="Active"
            jobs={jobs.filter((j) => ACTIVE_STATUSES.has(j.status))}
          />
          <Section
            title="History"
            jobs={jobs.filter((j) => !ACTIVE_STATUSES.has(j.status))}
          />
        </>
      )}
    </div>
  );
}

function Section({ title, jobs }: { title: string; jobs: AgentJob[] }) {
  if (jobs.length === 0) return null;
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lawn-text-primary text-lg font-semibold tracking-tight">
        {title}
      </h2>
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </section>
  );
}
