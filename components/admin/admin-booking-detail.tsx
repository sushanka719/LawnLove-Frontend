"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, MapPin } from "lucide-react";
import { toast } from "sonner";

import { JobStatusBadge } from "@/components/admin/job-status-badge";
import { BookingStatusBadge } from "@/components/dashboard/booking-status-badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminBooking, useCancelBooking } from "@/hooks/use-admin";
import { ApiError } from "@/lib/api/http";
import { TIME_SLOT_LABELS, formatCents, formatScheduleDate } from "@/lib/jobs";

function errMessage(err: unknown, fallback: string) {
  return err instanceof ApiError ? err.message : fallback;
}

export function AdminBookingDetail() {
  const params = useParams<{ id: string }>();
  const bookingId = params.id;
  const { data: booking, isLoading, isError } = useAdminBooking(bookingId);
  const cancel = useCancelBooking(bookingId);
  const [confirming, setConfirming] = useState(false);

  if (isError) {
    return (
      <p className="text-destructive text-base">
        We couldn&apos;t load this booking.
      </p>
    );
  }

  if (isLoading || !booking) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  const handleCancel = () => {
    cancel.mutate(undefined, {
      onSuccess: () => {
        toast.success("Booking cancelled.");
        setConfirming(false);
      },
      onError: (e) => toast.error(errMessage(e, "Couldn't cancel booking.")),
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/admin/bookings"
        className="text-lawn-text-secondary hover:text-lawn-primary inline-flex w-fit items-center gap-1.5 text-sm font-medium tracking-tight"
      >
        <ArrowLeft className="size-4" /> Back to bookings
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-lawn-text-primary text-2xl font-bold tracking-tight">
              {booking.title}
            </h2>
            <span className="text-lawn-text-tertiary text-sm tracking-tight">
              {booking.reference}
            </span>
          </div>
          <p className="text-lawn-text-secondary mt-1 flex items-center gap-1.5 text-base tracking-tight">
            <MapPin className="size-4" /> {booking.address}
          </p>
        </div>
        <BookingStatusBadge status={booking.status} />
      </div>

      <div className="bg-lawn-bg-2 flex flex-col gap-2.5 rounded-2xl border border-[#cecece]/50 p-5 shadow-[0px_4px_16px_0px_rgba(74,74,74,0.08)]">
        <Row label="Customer" value={booking.user?.name || "—"} />
        <Row label="Email" value={booking.user?.email || "—"} />
        <Row label="Phone" value={booking.phone || "—"} />
        <Row label="Frequency" value={booking.frequency} />
        <Row
          label="Scheduled"
          value={`${formatScheduleDate(booking.scheduleDate)} · ${
            TIME_SLOT_LABELS[booking.timeSlot] ?? booking.timeSlot
          }`}
        />
        <Row
          label="Est. area"
          value={`${booking.estimatedAreaSqFt.toLocaleString()} sq ft`}
        />
        <Row
          label="Price / visit"
          value={formatCents(booking.totalPerVisit * 100)}
        />
        <Row
          label="Created"
          value={new Date(booking.createdAt).toLocaleString()}
        />
      </div>

      {/* Visits */}
      <section className="flex flex-col gap-3">
        <h3 className="text-lawn-text-primary text-lg font-semibold tracking-tight">
          Visits ({booking.jobs.length})
        </h3>
        {booking.jobs.length === 0 ? (
          <p className="text-lawn-text-secondary rounded-xl border border-[#cecece]/60 px-5 py-8 text-center text-sm">
            No visits yet.
          </p>
        ) : (
          <div className="bg-lawn-bg-2 overflow-hidden rounded-xl border border-[#cecece]/50">
            {booking.jobs.map((job, i) => (
              <Link
                key={job.id}
                href={`/admin/jobs/${job.id}`}
                className={
                  "flex items-center justify-between gap-4 px-5 py-3.5 transition hover:bg-black/[0.02] " +
                  (i !== booking.jobs.length - 1
                    ? "border-b border-[#cecece]/40"
                    : "")
                }
              >
                <span className="text-lawn-text-secondary text-sm tracking-tight">
                  {job.completedAt
                    ? `Completed ${new Date(job.completedAt).toLocaleDateString()}`
                    : job.agentId
                      ? "Assigned"
                      : "Unassigned"}
                </span>
                <div className="flex items-center gap-3">
                  {job.amount != null && (
                    <span className="text-lawn-text-primary text-sm font-semibold tracking-tight">
                      {formatCents(job.amount)}
                    </span>
                  )}
                  <JobStatusBadge status={job.status} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Cancel */}
      {booking.status !== "cancelled" && (
        <div className="border-t border-[#cecece]/40 pt-4">
          {confirming ? (
            <div className="flex gap-2">
              <Button
                variant="destructive"
                size="lg"
                onClick={handleCancel}
                disabled={cancel.isPending}
              >
                {cancel.isPending ? "Cancelling…" : "Confirm cancel"}
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => setConfirming(false)}
                disabled={cancel.isPending}
              >
                Keep booking
              </Button>
            </div>
          ) : (
            <Button
              variant="destructive"
              size="lg"
              onClick={() => setConfirming(true)}
            >
              Cancel booking
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-lawn-text-tertiary shrink-0 text-sm tracking-tight">
        {label}
      </span>
      <span className="text-lawn-text-primary min-w-0 truncate text-right text-sm font-medium tracking-tight capitalize">
        {value}
      </span>
    </div>
  );
}
