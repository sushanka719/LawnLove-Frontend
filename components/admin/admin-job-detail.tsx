"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, MapPin, UserCheck } from "lucide-react";
import { toast } from "sonner";

import { JobStatusBadge } from "@/components/admin/job-status-badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAdminAgents,
  useAdminJob,
  useAssignJob,
  useRefundJob,
} from "@/hooks/use-admin";
import type { AdminJobPhoto } from "@/lib/api/admin";
import { ApiError } from "@/lib/api/http";
import { TIME_SLOT_LABELS, formatCents, formatScheduleDate } from "@/lib/jobs";

function errMessage(err: unknown, fallback: string) {
  return err instanceof ApiError ? err.message : fallback;
}

// Jobs that can still be (re)assigned — mirrors the backend guard.
const ASSIGNABLE = new Set(["assigned", "started"]);

export function AdminJobDetail() {
  const params = useParams<{ id: string }>();
  const jobId = params.id;
  const { data: job, isLoading, isError } = useAdminJob(jobId);

  if (isError) {
    return (
      <p className="text-destructive text-base">
        We couldn&apos;t load this job.
      </p>
    );
  }

  if (isLoading || !job) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  const canRefund = job.status === "disputed" && !!job.stripePaymentIntentId;

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/admin/jobs"
        className="text-lawn-text-secondary hover:text-lawn-primary inline-flex w-fit items-center gap-1.5 text-sm font-medium tracking-tight"
      >
        <ArrowLeft className="size-4" /> Back to jobs
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-lawn-text-primary text-2xl font-bold tracking-tight">
              {job.booking.title}
            </h2>
            <span className="text-lawn-text-tertiary text-sm tracking-tight">
              {job.reference}
            </span>
          </div>
          <p className="text-lawn-text-secondary mt-1 flex items-center gap-1.5 text-base tracking-tight">
            <MapPin className="size-4" /> {job.booking.address}
          </p>
        </div>
        <JobStatusBadge status={job.status} className="text-base" />
      </div>

      {/* Assignment */}
      <AssignmentCard job={job} />

      {/* Service + escrow */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <InfoCard title="Service">
          <Row label="Customer" value={job.booking.customer?.name || "—"} />
          <Row label="Email" value={job.booking.customer?.email || "—"} />
          <Row
            label="Scheduled"
            value={`${formatScheduleDate(job.booking.scheduleDate)} · ${
              TIME_SLOT_LABELS[job.booking.timeSlot] ?? job.booking.timeSlot
            }`}
          />
          <Row
            label="Est. area"
            value={`${job.booking.estimatedAreaSqFt.toLocaleString()} sq ft`}
          />
          <Row
            label="Price / visit"
            value={formatCents(job.booking.totalPerVisit * 100)}
          />
        </InfoCard>

        <InfoCard title="Escrow">
          <Row
            label="Charged"
            value={job.amount != null ? formatCents(job.amount) : "Not yet"}
          />
          <Row
            label="Platform fee"
            value={job.platformFee != null ? formatCents(job.platformFee) : "—"}
          />
          <Row
            label="Charged at"
            value={
              job.chargedAt ? new Date(job.chargedAt).toLocaleString() : "—"
            }
          />
          <Row
            label="Review deadline"
            value={
              job.reviewDeadline
                ? new Date(job.reviewDeadline).toLocaleString()
                : "—"
            }
          />
          <Row
            label="Paid out"
            value={
              job.releasedAt ? new Date(job.releasedAt).toLocaleString() : "—"
            }
          />
        </InfoCard>
      </div>

      {/* Photos */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <PhotoGallery title="Before" photos={job.photos.before} />
        <PhotoGallery title="After" photos={job.photos.after} />
      </div>

      {/* Review */}
      {job.review && (
        <InfoCard title="Customer review">
          <p className="text-lawn-text-primary text-base font-semibold tracking-tight">
            {"★".repeat(job.review.rating)}
            <span className="text-lawn-text-tertiary">
              {"★".repeat(Math.max(0, 5 - job.review.rating))}
            </span>
          </p>
          {job.review.comment && (
            <p className="text-lawn-text-secondary text-sm tracking-tight">
              {job.review.comment}
            </p>
          )}
        </InfoCard>
      )}

      {/* Refund (disputed jobs, before payout) */}
      {canRefund && <RefundCard jobId={job.id} />}
    </div>
  );
}

function AssignmentCard({
  job,
}: {
  job: NonNullable<ReturnType<typeof useAdminJob>["data"]>;
}) {
  const assignable = ASSIGNABLE.has(job.status);
  const { data: agents } = useAdminAgents();
  const assign = useAssignJob(job.id);
  const [selected, setSelected] = useState("");

  const handleAssign = () => {
    if (!selected) return;
    assign.mutate(selected, {
      onSuccess: () => {
        toast.success("Job assigned.");
        setSelected("");
      },
      onError: (e) => toast.error(errMessage(e, "Couldn't assign job.")),
    });
  };

  return (
    <div className="bg-lawn-bg-2 flex flex-col gap-4 rounded-2xl border border-[#cecece]/50 p-5 shadow-[0px_4px_16px_0px_rgba(74,74,74,0.08)]">
      <div className="flex items-center gap-2">
        <UserCheck className="text-lawn-primary size-5" />
        <p className="text-lawn-text-primary text-base font-semibold tracking-tight">
          Assignment
        </p>
      </div>
      <p className="text-lawn-text-secondary text-sm tracking-tight">
        {job.agent ? (
          <>
            Assigned to{" "}
            <span className="text-lawn-text-primary font-semibold">
              {job.agent.name || job.agent.email}
            </span>
          </>
        ) : (
          "No agent assigned yet."
        )}
      </p>

      {assignable ? (
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="text-lawn-text-primary min-w-56 rounded-lg border border-[#cecece]/70 bg-white px-3 py-2 text-sm outline-none focus:border-lawn-primary/50"
          >
            <option value="">
              {job.agent ? "Reassign to…" : "Choose an agent…"}
            </option>
            {(agents ?? []).map((a) => (
              <option key={a.id} value={a.id}>
                {(a.name || a.email) +
                  (a.payoutsEnabled ? "" : " (payouts off)")}
              </option>
            ))}
          </select>
          <Button
            size="lg"
            onClick={handleAssign}
            disabled={!selected || assign.isPending}
          >
            {assign.isPending
              ? "Assigning…"
              : job.agent
                ? "Reassign"
                : "Assign"}
          </Button>
        </div>
      ) : (
        <p className="text-lawn-text-tertiary text-sm tracking-tight">
          This job can no longer be reassigned (work is in progress or complete).
        </p>
      )}
    </div>
  );
}

function RefundCard({ jobId }: { jobId: string }) {
  const refund = useRefundJob();
  const [confirming, setConfirming] = useState(false);

  const handleRefund = () => {
    refund.mutate(jobId, {
      onSuccess: () => {
        toast.success("Charge refunded.");
        setConfirming(false);
      },
      onError: (e) => toast.error(errMessage(e, "Couldn't refund.")),
    });
  };

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50/60 p-5">
      <p className="text-lawn-text-primary text-base font-semibold tracking-tight">
        Disputed job
      </p>
      <p className="text-lawn-text-secondary text-sm tracking-tight">
        Refund the customer&apos;s charge. Only possible before payout has been
        transferred to the agent.
      </p>
      {confirming ? (
        <div className="flex gap-2">
          <Button
            variant="destructive"
            size="lg"
            onClick={handleRefund}
            disabled={refund.isPending}
          >
            {refund.isPending ? "Refunding…" : "Confirm refund"}
          </Button>
          <Button
            variant="ghost"
            size="lg"
            onClick={() => setConfirming(false)}
            disabled={refund.isPending}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <Button
          variant="destructive"
          size="lg"
          className="w-fit"
          onClick={() => setConfirming(true)}
        >
          Refund charge
        </Button>
      )}
    </div>
  );
}

function InfoCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-lawn-bg-2 flex flex-col gap-2.5 rounded-2xl border border-[#cecece]/50 p-5 shadow-[0px_4px_16px_0px_rgba(74,74,74,0.08)]">
      <p className="text-lawn-text-primary text-base font-semibold tracking-tight">
        {title}
      </p>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-lawn-text-tertiary shrink-0 text-sm tracking-tight">
        {label}
      </span>
      <span className="text-lawn-text-primary min-w-0 truncate text-right text-sm font-medium tracking-tight">
        {value}
      </span>
    </div>
  );
}

function PhotoGallery({
  title,
  photos,
}: {
  title: string;
  photos: AdminJobPhoto[];
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-lawn-text-primary text-base font-semibold tracking-tight">
        {title}
      </p>
      {photos.length === 0 ? (
        <div className="text-lawn-text-tertiary flex h-32 items-center justify-center rounded-xl border border-[#cecece]/60 text-sm">
          No {title.toLowerCase()} photos
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="relative aspect-square overflow-hidden rounded-lg bg-neutral-100"
            >
              <Image
                src={photo.url}
                alt={`${title} photo`}
                fill
                sizes="(max-width: 640px) 50vw, 220px"
                className="object-cover"
                unoptimized
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
