"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, MapPin, PlayCircle } from "lucide-react";
import { toast } from "sonner";

import { PhotoCapture } from "@/components/agent/photo-capture";
import { JobStatusBadge } from "@/components/jobs/job-status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAgentJob, useCompleteJob, useStartJob } from "@/hooks/use-agent";
import { ApiError } from "@/lib/api/http";
import { getCurrentPosition } from "@/lib/geolocation";
import { formatCents, formatScheduleDate, TIME_SLOT_LABELS } from "@/lib/jobs";

export function AgentJobDetail() {
  const params = useParams<{ id: string }>();
  const jobId = params.id;
  const { data: job, isLoading, isError } = useAgentJob(jobId);

  const startJob = useStartJob(jobId);
  const completeJob = useCompleteJob(jobId);
  const [starting, setStarting] = useState(false);

  const onStart = async () => {
    setStarting(true);
    try {
      const coords = await getCurrentPosition();
      const result = await startJob.mutateAsync(coords);
      if (result.farFromProperty) {
        toast.warning("You appear to be far from the property.");
      } else {
        toast.success("Job started.");
      }
    } catch (err) {
      toast.error(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Couldn't start the job. Please try again.",
      );
    } finally {
      setStarting(false);
    }
  };

  const onComplete = async () => {
    try {
      await completeJob.mutateAsync();
      toast.success("Job completed — the customer has been charged and notified.");
    } catch (err) {
      toast.error(
        err instanceof ApiError
          ? err.message
          : "Couldn't complete the job. Please try again.",
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-40 rounded" />
        <Skeleton className="h-28 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="flex flex-col gap-4">
        <BackLink />
        <p className="text-destructive text-base">
          We couldn&apos;t load this job. Please refresh and try again.
        </p>
      </div>
    );
  }

  const hasBefore = job.photos.before.length > 0;
  const hasAfter = job.photos.after.length > 0;
  const canComplete = hasBefore && hasAfter;
  const isStarted = job.status === "started";
  const isAssigned = job.status === "assigned";

  return (
    <div className="flex flex-col gap-5">
      <BackLink />

      {/* Summary */}
      <div className="bg-lawn-bg-2 flex flex-col gap-3 rounded-xl p-5 shadow-[0px_4px_8px_0px_rgba(74,74,74,0.14)]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <MapPin className="text-lawn-primary size-5 shrink-0" />
            <h1 className="text-lawn-text-primary text-xl font-semibold tracking-tight">
              {job.booking.address}
            </h1>
          </div>
          <JobStatusBadge status={job.status} />
        </div>
        <div className="text-lawn-text-secondary flex flex-wrap gap-x-4 gap-y-1 text-sm">
          <span>{formatScheduleDate(job.booking.scheduleDate)}</span>
          <span>{TIME_SLOT_LABELS[job.booking.timeSlot] ?? job.booking.timeSlot}</span>
          <span>~{job.booking.estimatedAreaSqFt.toLocaleString()} sq ft</span>
          <span className="text-lawn-text-primary font-semibold">
            Payout base {formatCents(job.booking.totalPerVisit * 100)}
          </span>
        </div>
      </div>

      {/* Step 1 — start */}
      {isAssigned && (
        <div className="bg-lawn-bg-2 flex flex-col gap-3 rounded-xl p-5 shadow-[0px_4px_8px_0px_rgba(74,74,74,0.14)]">
          <p className="text-lawn-text-primary text-base font-semibold">Start the job</p>
          <p className="text-lawn-text-secondary text-sm">
            We&apos;ll record your location to confirm you&apos;re on site.
          </p>
          <button
            type="button"
            onClick={onStart}
            disabled={starting || startJob.isPending}
            className="lawn-gradient-btn flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-base font-semibold text-white disabled:opacity-50"
          >
            <PlayCircle className="size-5" />
            {starting || startJob.isPending ? "Starting..." : "Start job"}
          </button>
        </div>
      )}

      {/* Step 2 — photos (available once started) */}
      {isStarted && (
        <div className="flex flex-col gap-3">
          <p className="text-lawn-text-primary text-base font-semibold">
            Capture before &amp; after photos
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <PhotoCapture jobId={jobId} type="before" photos={job.photos.before} />
            <PhotoCapture jobId={jobId} type="after" photos={job.photos.after} />
          </div>
        </div>
      )}

      {/* Step 3 — complete */}
      {isStarted && (
        <div className="bg-lawn-bg-2 flex flex-col gap-3 rounded-xl p-5 shadow-[0px_4px_8px_0px_rgba(74,74,74,0.14)]">
          <button
            type="button"
            onClick={onComplete}
            disabled={!canComplete || completeJob.isPending}
            className="lawn-gradient-btn rounded-xl px-6 py-3 text-base font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {completeJob.isPending ? "Completing..." : "Complete job"}
          </button>
          {!canComplete && (
            <p className="text-lawn-text-tertiary text-center text-sm">
              Add at least one before and one after photo to complete.
            </p>
          )}
        </div>
      )}

      {/* Done states */}
      {!isAssigned && !isStarted && (
        <div className="bg-lawn-badge-bg flex flex-col gap-3 rounded-xl p-5">
          <p className="text-lawn-primary text-base font-semibold">
            This job is {job.status === "paid" ? "paid out" : "complete"}.
          </p>
          {(job.photos.before.length > 0 || job.photos.after.length > 0) && (
            <div className="grid gap-3 sm:grid-cols-2">
              <PhotoCapture
                jobId={jobId}
                type="before"
                photos={job.photos.before}
                disabled
              />
              <PhotoCapture
                jobId={jobId}
                type="after"
                photos={job.photos.after}
                disabled
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function BackLink() {
  return (
    <Link
      href="/agent"
      className="text-lawn-text-secondary hover:text-lawn-primary inline-flex w-fit items-center gap-1.5 text-sm font-medium"
    >
      <ArrowLeft className="size-4" />
      Back to jobs
    </Link>
  );
}
