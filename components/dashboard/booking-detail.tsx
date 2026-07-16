"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ChevronRight, Leaf, Star } from "lucide-react";

import { BookingStatusBadge } from "@/components/dashboard/booking-status-badge";
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";
import { JobStatusBadge } from "@/components/jobs/job-status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useBooking } from "@/hooks/use-bookings";
import type { BookingJobSummary } from "@/lib/api/booking";
import { FREQUENCY_LABELS } from "@/lib/pricing";
import { formatCents, formatScheduleDate, TIME_SLOT_LABELS } from "@/lib/jobs";

function DetailRow({
  label,
  value,
  emphasize,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <p className="text-lawn-text-tertiary shrink-0 text-base font-medium tracking-tight">
        {label}
      </p>
      <p
        className={
          emphasize
            ? "text-lawn-text-primary text-right text-lg font-bold tracking-tight"
            : "text-lawn-text-secondary text-right text-base font-semibold tracking-tight"
        }
      >
        {value}
      </p>
    </div>
  );
}

export function BookingDetail() {
  const params = useParams<{ id: string }>();
  const bookingId = params.id;
  const { data: booking, isLoading, isError } = useBooking(bookingId);

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
          <Skeleton className="h-56 w-full rounded-xl" />
        </div>
      ) : isError || !booking ? (
        <p className="text-destructive text-base">
          We couldn&apos;t load this booking. Please refresh and try again.
        </p>
      ) : (
        <div className="flex max-w-[720px] flex-col gap-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-lawn-text-primary text-2xl font-bold tracking-tight">
                {booking.title}
              </h2>
              <p className="text-lawn-text-tertiary text-sm font-medium tracking-tight">
                {booking.reference} · Booked {formatScheduleDate(booking.createdAt)}
              </p>
            </div>
            <BookingStatusBadge status={booking.status} />
          </div>

          {/* Summary */}
          <div className="bg-lawn-bg-2 flex flex-col divide-y divide-[#cecece]/40 rounded-xl px-6 py-2 shadow-[0px_4px_16px_0px_rgba(74,74,74,0.14)]">
            <DetailRow label="Address" value={booking.address} />
            <DetailRow label="Phone" value={booking.phone} />
            <DetailRow
              label="First visit"
              value={`${formatScheduleDate(booking.scheduleDate)} · ${
                TIME_SLOT_LABELS[booking.timeSlot] ?? booking.timeSlot
              }`}
            />
            <DetailRow
              label="Frequency"
              value={FREQUENCY_LABELS[booking.frequency]?.title ?? booking.frequency}
            />
            <DetailRow
              label="Estimated lawn area"
              value={`${booking.estimatedAreaSqFt.toLocaleString()} sq ft`}
            />
          </div>

          {/* Pricing */}
          <div className="bg-lawn-bg-2 flex flex-col divide-y divide-[#cecece]/40 rounded-xl px-6 py-2 shadow-[0px_4px_16px_0px_rgba(74,74,74,0.14)]">
            <DetailRow label="Base price" value={formatCents(booking.subtotal * 100)} />
            {booking.discountPct > 0 && (
              <DetailRow
                label="Frequency discount"
                value={`${Math.round(booking.discountPct * 100)}% off`}
              />
            )}
            <DetailRow
              label="Per visit"
              value={formatCents(booking.totalPerVisit * 100)}
              emphasize
            />
          </div>

          <p className="text-lawn-text-tertiary -mt-2 text-sm tracking-tight">
            Your card on file is charged after each completed visit, once the before &amp;
            after photos are ready.
          </p>

          {/* Visits */}
          <section className="flex flex-col gap-3">
            <h3 className="text-lawn-text-primary text-lg font-semibold tracking-tight">
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
        </div>
      )}
    </DashboardPanel>
  );
}

function VisitRow({ job }: { job: BookingJobSummary }) {
  return (
    <Link
      href={`/dashboard/jobs/${job.id}`}
      className="bg-lawn-bg-2 flex items-center gap-4 rounded-xl p-5 drop-shadow-[0px_4px_8px_rgba(74,74,74,0.14)] transition hover:opacity-90"
    >
      <div className="bg-lawn-badge-bg flex size-11 shrink-0 items-center justify-center rounded-xl">
        <Leaf className="text-lawn-primary size-5" strokeWidth={1.75} />
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
        {job.amount != null && (
          <span className="text-lawn-text-primary hidden text-base font-semibold sm:inline">
            {formatCents(job.amount)}
          </span>
        )}
        <ChevronRight className="text-lawn-text-secondary size-5" />
      </div>
    </Link>
  );
}
