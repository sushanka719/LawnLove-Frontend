"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Leaf } from "lucide-react";

import { BookingStatusBadge } from "@/components/dashboard/booking-status-badge";
import { Pagination } from "@/components/dashboard/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { useBookings } from "@/hooks/use-bookings";
import type { BookingListItem } from "@/lib/api/booking";
import { cn } from "@/lib/utils";
import { formatCents, formatScheduleDate } from "@/lib/jobs";

const PAGE_SIZE = 10;

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function BookingList() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, isPlaceholderData } = useBookings(page, PAGE_SIZE);

  if (isError) {
    return (
      <p className="text-destructive text-base">
        We couldn&apos;t load your bookings. Please refresh and try again.
      </p>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    );
  }

  const bookings = data?.items ?? [];

  if (bookings.length === 0) {
    return (
      <p className="text-lawn-text-secondary rounded-xl border border-[#cecece]/60 px-5 py-10 text-center text-base">
        No bookings yet. Book a visit to get started.
      </p>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="bg-lawn-bg-2 overflow-hidden rounded-xl shadow-[0px_4px_16px_0px_rgba(74,74,74,0.14)]">
        {bookings.map((booking, i) => (
          <BookingRow
            key={booking.id}
            booking={booking}
            last={i === bookings.length - 1}
          />
        ))}
      </div>
      <Pagination
        page={page}
        totalPages={data?.totalPages ?? 1}
        onPageChange={setPage}
        disabled={isPlaceholderData}
      />
    </section>
  );
}

function BookingRow({ booking, last }: { booking: BookingListItem; last: boolean }) {
  return (
    <Link
      href={`/dashboard/bookings/${booking.id}`}
      className={cn(
        "flex items-center gap-4 px-6 py-5 transition hover:bg-black/[0.02]",
        !last && "border-b border-[#cecece]/40",
      )}
    >
      <div className="bg-lawn-badge-bg flex size-12 shrink-0 items-center justify-center rounded-xl">
        <Leaf className="text-lawn-primary size-5" strokeWidth={1.75} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-lawn-text-primary truncate text-lg font-semibold tracking-tight">
            {booking.title}
          </p>
          <span className="text-lawn-text-tertiary shrink-0 text-xs font-medium tracking-tight">
            {booking.reference}
          </span>
        </div>
        <p className="text-lawn-text-secondary truncate text-base font-medium tracking-tight">
          {booking.address}
        </p>
        <p className="text-lawn-text-tertiary truncate text-sm tracking-tight">
          {formatScheduleDate(booking.scheduleDate)} · {capitalize(booking.timeSlot)}
          {booking.visitsCount > 1 ? ` · ${booking.visitsCount} visits` : ""}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <BookingStatusBadge status={booking.status} />
        <span className="text-lawn-text-primary hidden text-lg font-semibold tracking-tight sm:inline">
          {formatCents(booking.totalPerVisit * 100)}
        </span>
        <ChevronRight
          className="text-lawn-text-secondary size-5 shrink-0"
          strokeWidth={1.75}
        />
      </div>
    </Link>
  );
}
