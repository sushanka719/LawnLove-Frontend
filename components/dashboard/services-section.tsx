"use client";

import Link from "next/link";
import { ChevronRight, Leaf } from "lucide-react";

import { JobStatusBadge } from "@/components/jobs/job-status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCustomerJobs } from "@/hooks/use-customer-jobs";
import type { CustomerJobListItem } from "@/lib/api/customer-jobs";
import { formatCents, formatScheduleDate, timeUntil } from "@/lib/jobs";

// Real customer jobs, replacing the static demo lists once bookings exist.
export function ServicesSection() {
  const { data: jobs, isLoading, isError } = useCustomerJobs();

  if (isError) return null;

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lawn-text-primary text-xl font-semibold tracking-tight">
        Your Services
      </h2>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
        </div>
      ) : !jobs || jobs.length === 0 ? (
        <p className="text-lawn-text-secondary rounded-xl border border-[#cecece]/60 px-5 py-8 text-center text-base">
          No services yet. Book a visit to get started.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {jobs.map((job) => (
            <ServiceRow key={job.id} job={job} />
          ))}
        </div>
      )}
    </section>
  );
}

function ServiceRow({ job }: { job: CustomerJobListItem }) {
  const needsReview = job.status === "in_review";
  const timeLeft = needsReview ? timeUntil(job.reviewDeadline) : null;

  return (
    <Link
      href={`/dashboard/jobs/${job.id}`}
      className="bg-lawn-bg-2 flex items-center gap-4 rounded-xl p-5 drop-shadow-[0px_4px_8px_rgba(74,74,74,0.14)] transition hover:opacity-90"
    >
      <div className="bg-lawn-badge-bg flex size-12 shrink-0 items-center justify-center rounded-xl">
        <Leaf className="text-lawn-primary size-5" strokeWidth={1.75} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-lawn-text-primary truncate text-base font-semibold tracking-tight">
          {job.booking.address}
        </p>
        <p className="text-lawn-text-secondary truncate text-sm">
          {formatScheduleDate(job.booking.scheduleDate)}
          {needsReview && timeLeft ? ` · ${timeLeft} to review` : ""}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <JobStatusBadge status={job.status} />
        <span className="text-lawn-text-primary hidden text-base font-semibold sm:inline">
          {formatCents(job.booking.totalPerVisit * 100)}
        </span>
        <ChevronRight className="text-lawn-text-secondary size-5" />
      </div>
    </Link>
  );
}
