"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronRight, MapPin, User } from "lucide-react";

import { JobStatusBadge } from "@/components/admin/job-status-badge";
import { Pagination } from "@/components/dashboard/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminJobs } from "@/hooks/use-admin";
import type { JobStatus } from "@/lib/api/agent";
import { JOB_STATUS_LABELS, formatCents, formatScheduleDate } from "@/lib/jobs";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;

const STATUS_VALUES = Object.keys(JOB_STATUS_LABELS) as JobStatus[];

function isJobStatus(value: string | null): value is JobStatus {
  return !!value && (STATUS_VALUES as string[]).includes(value);
}

export function AdminJobs() {
  const searchParams = useSearchParams();
  const initial = searchParams.get("status");
  const agentId = searchParams.get("agentId") || undefined;

  const [status, setStatus] = useState<JobStatus | "all">(
    isJobStatus(initial) ? initial : "all",
  );
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, isPlaceholderData } = useAdminJobs({
    status: status === "all" ? undefined : status,
    agentId,
    page,
    pageSize: PAGE_SIZE,
  });

  const jobs = data?.items ?? [];

  return (
    <section className="flex flex-col gap-5">
      {/* Status filter */}
      <div className="flex flex-wrap gap-2">
        <FilterPill
          active={status === "all"}
          onClick={() => {
            setStatus("all");
            setPage(1);
          }}
        >
          All
        </FilterPill>
        {STATUS_VALUES.map((s) => (
          <FilterPill
            key={s}
            active={status === s}
            onClick={() => {
              setStatus(s);
              setPage(1);
            }}
          >
            {JOB_STATUS_LABELS[s]}
          </FilterPill>
        ))}
      </div>

      {isError ? (
        <p className="text-destructive text-base">
          We couldn&apos;t load jobs. Please refresh and try again.
        </p>
      ) : isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <p className="text-lawn-text-secondary rounded-xl border border-[#cecece]/60 px-5 py-10 text-center text-base">
          No jobs match this filter.
        </p>
      ) : (
        <div className="bg-lawn-bg-2 overflow-hidden rounded-xl shadow-[0px_4px_16px_0px_rgba(74,74,74,0.1)]">
          {jobs.map((job, i) => (
            <Link
              key={job.id}
              href={`/admin/jobs/${job.id}`}
              className={cn(
                "flex items-center gap-4 px-5 py-4 transition hover:bg-black/[0.02]",
                i !== jobs.length - 1 && "border-b border-[#cecece]/40",
              )}
            >
              <div className="min-w-0 flex-1">
                <p className="text-lawn-text-primary flex items-center gap-1.5 truncate text-base font-semibold tracking-tight">
                  <MapPin className="text-lawn-text-tertiary size-4 shrink-0" />
                  {job.address}
                </p>
                <p className="text-lawn-text-secondary truncate text-sm tracking-tight">
                  {job.customer?.name || job.customer?.email || "Customer"} ·{" "}
                  {formatScheduleDate(job.scheduleDate)}
                </p>
                <p className="text-lawn-text-tertiary mt-0.5 flex items-center gap-1 truncate text-sm tracking-tight">
                  <User className="size-3.5 shrink-0" />
                  {job.agent
                    ? job.agent.name || job.agent.email
                    : "Unassigned"}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                {job.amount != null && (
                  <span className="text-lawn-text-primary hidden text-sm font-semibold tracking-tight sm:inline">
                    {formatCents(job.amount)}
                  </span>
                )}
                <JobStatusBadge status={job.status} />
                <ChevronRight
                  className="text-lawn-text-secondary size-5 shrink-0"
                  strokeWidth={1.75}
                />
              </div>
            </Link>
          ))}
        </div>
      )}

      <Pagination
        page={page}
        totalPages={data?.totalPages ?? 1}
        onPageChange={setPage}
        disabled={isPlaceholderData}
      />
    </section>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-3.5 py-1.5 text-sm font-medium tracking-tight transition-colors",
        active
          ? "bg-lawn-primary text-white"
          : "text-lawn-text-secondary bg-black/[0.04] hover:bg-black/[0.07]",
      )}
    >
      {children}
    </button>
  );
}
