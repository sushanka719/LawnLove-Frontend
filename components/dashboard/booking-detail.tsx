"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ChevronRight, Leaf, Star } from "lucide-react";

import { BookingStatusBadge } from "@/components/dashboard/booking-status-badge";
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";
import { JobStatusBadge } from "@/components/jobs/job-status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useBooking } from "@/hooks/use-bookings";
import type { BookingJobSummary } from "@/lib/api/booking";
import type { JobPhoto } from "@/lib/api/customer-jobs";
import { FREQUENCY_LABELS } from "@/lib/pricing";
import { formatCents, formatScheduleDate } from "@/lib/jobs";

// "morning" -> "Morning", for the compact schedule line in the header.
function shortTimeSlot(slot: string) {
  return slot ? `${slot.charAt(0).toUpperCase()}${slot.slice(1)}` : "";
}

// "July 05, 2026" for the First visit row.
function formatFullDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });
}

// "Jun 30 · 10:45 AM" for the Completed time row.
function formatCompletedAt(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const day = date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
  const time = date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
  return `${day} · ${time}`;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <p className="text-lawn-text-tertiary shrink-0 text-base font-medium tracking-tight">
        {label}
      </p>
      <p className="text-lawn-text-primary text-right text-base font-semibold tracking-tight">
        {value}
      </p>
    </div>
  );
}

export function BookingDetail() {
  const params = useParams<{ id: string }>();
  const bookingId = params.id;
  const { data: booking, isLoading, isError } = useBooking(bookingId);

  const resultsJobs =
    booking?.jobs.filter(
      (job) => job.photos.before.length > 0 || job.photos.after.length > 0,
    ) ?? [];

  return (
    <DashboardPanel
      title="Booking details"
      subtitle="Your service plan, schedule, and visits."
    >
      <Link
        href="/dashboard/bookings"
        className="text-lawn-text-secondary hover:text-lawn-primary inline-flex w-fit items-center gap-1.5 text-sm font-medium"
      >
        <ArrowLeft className="size-4" />
        Back to bookings
      </Link>

      {isLoading ? (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-72 w-full rounded-xl" />
        </div>
      ) : isError || !booking ? (
        <p className="text-destructive text-base">
          We couldn&apos;t load this booking. Please refresh and try again.
        </p>
      ) : (
        <div className="flex max-w-[900px] flex-col gap-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <h2 className="text-lawn-text-primary text-xl font-semibold tracking-tight">
                  {booking.title}
                </h2>
                <span className="text-lawn-text-secondary text-base font-medium tracking-tight">
                  {booking.reference}
                </span>
              </div>
              <p className="text-lawn-text-secondary text-base font-medium tracking-tight">
                {formatScheduleDate(booking.scheduleDate)} ·{" "}
                {shortTimeSlot(booking.timeSlot)}
              </p>
            </div>
            <BookingStatusBadge status={booking.status} />
          </div>

          {/* Details */}
          <div className="bg-lawn-bg-2 flex flex-col divide-y divide-[#cecece]/40 rounded-xl px-6 py-2 shadow-[0px_4px_16px_0px_rgba(74,74,74,0.14)]">
            <DetailRow label="Address" value={booking.address} />
            <DetailRow label="Phone number" value={booking.phone} />
            <DetailRow label="First visit" value={formatFullDate(booking.scheduleDate)} />
            <DetailRow
              label="Frequency"
              value={FREQUENCY_LABELS[booking.frequency]?.title ?? booking.frequency}
            />
            <DetailRow
              label="Estimated lawn area"
              value={`${booking.estimatedAreaSqFt.toLocaleString()} sq ft`}
            />
            <DetailRow
              label="Total price"
              value={formatCents(booking.totalPerVisit * 100)}
            />
          </div>

          {/* Visits */}
          <section className="flex flex-col gap-4">
            <h3 className="text-lawn-text-primary text-xl font-semibold tracking-tight">
              Visits
            </h3>
            {booking.jobs.length === 0 ? (
              <p className="text-lawn-text-secondary rounded-xl border border-[#cecece]/60 px-5 py-6 text-center text-base">
                No visits scheduled yet.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {booking.jobs.map((job) => (
                  <VisitRow key={job.id} job={job} />
                ))}
              </div>
            )}
          </section>

          {/* Results */}
          {resultsJobs.length > 0 ? (
            <section className="flex flex-col gap-4">
              <h3 className="text-lawn-text-primary text-xl font-semibold tracking-tight">
                Results
              </h3>
              <div className="flex flex-col gap-6">
                {resultsJobs.map((job) => (
                  <ResultCard
                    key={job.id}
                    job={job}
                    showVisitLabel={resultsJobs.length > 1}
                  />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      )}
    </DashboardPanel>
  );
}

function VisitRow({ job }: { job: BookingJobSummary }) {
  return (
    <Link
      href={`/dashboard/jobs/${job.id}`}
      className="bg-lawn-bg-2 flex items-center gap-4 rounded-xl p-6 drop-shadow-[0px_4px_8px_rgba(74,74,74,0.14)] transition hover:opacity-90"
    >
      <div className="bg-lawn-badge-bg flex size-14 shrink-0 items-center justify-center rounded-xl">
        <Leaf className="text-lawn-primary size-6" strokeWidth={1.75} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-lawn-text-primary text-base font-semibold tracking-tight">
          {job.completedAt
            ? `Serviced ${formatScheduleDate(job.completedAt)}`
            : "Upcoming visit"}
        </p>
        {job.review ? (
          <span className="text-lawn-text-secondary inline-flex items-center gap-1 text-sm">
            <Star className="size-3.5 fill-current text-[#eab308]" />
            {job.review.rating}/5
          </span>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <JobStatusBadge status={job.status} />
        <ChevronRight className="text-lawn-text-secondary size-5" />
      </div>
    </Link>
  );
}

function ResultCard({
  job,
  showVisitLabel,
}: {
  job: BookingJobSummary;
  showVisitLabel: boolean;
}) {
  return (
    <div className="bg-lawn-bg-2 flex flex-col gap-6 rounded-xl p-6 drop-shadow-[0px_4px_8px_rgba(74,74,74,0.14)] sm:p-8">
      {showVisitLabel ? (
        <p className="text-lawn-text-primary text-base font-semibold tracking-tight">
          Visit {job.visitNumber}
        </p>
      ) : null}

      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-6">
          <p className="text-lawn-text-primary text-center text-base font-semibold tracking-tight">
            Before
          </p>
          <p className="text-lawn-text-primary text-center text-base font-semibold tracking-tight">
            After
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <PhotoColumn label="before" photos={job.photos.before} />
          <PhotoColumn label="after" photos={job.photos.after} />
        </div>
      </div>

      <div className="flex flex-col divide-y divide-[#cecece]/40">
        <DetailRow label="Completed by" value={job.completedBy ?? "—"} />
        <DetailRow
          label="Completed time"
          value={job.completedAt ? formatCompletedAt(job.completedAt) : "—"}
        />
      </div>
    </div>
  );
}

function PhotoColumn({ label, photos }: { label: string; photos: JobPhoto[] }) {
  if (photos.length === 0) {
    return (
      <div className="text-lawn-text-tertiary flex aspect-[3/2] items-center justify-center rounded-xl border border-[#cecece]/60 text-sm">
        No {label} photo
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-3">
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="relative aspect-[3/2] overflow-hidden rounded-xl bg-neutral-200"
        >
          <Image
            src={photo.url}
            alt={`${label} photo`}
            fill
            sizes="(max-width: 640px) 50vw, 440px"
            className="object-cover"
            unoptimized
          />
        </div>
      ))}
    </div>
  );
}
