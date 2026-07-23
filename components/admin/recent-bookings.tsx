"use client";

import Link from "next/link";
import { CalendarRange } from "lucide-react";

import { BookingStatusBadge } from "@/components/dashboard/booking-status-badge";
import { avatarColor, getInitials } from "@/components/dashboard/user-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminBookings } from "@/hooks/use-admin";
import type { AdminBookingListItem } from "@/lib/api/admin";
import { formatCents, formatScheduleDate } from "@/lib/jobs";
import { FREQUENCY_LABELS, type Frequency } from "@/lib/pricing";
import { cn } from "@/lib/utils";

/**
 * Recent Bookings table for the Super Admin dashboard (Figma node 986:5611).
 *
 * Wired to the live admin API (`useAdminBookings` → `GET /admin/bookings`), which
 * returns rows ordered by `createdAt` desc — i.e. the latest activity. We show
 * the most recent {@link ROWS_SHOWN} and link to the full paged list.
 *
 * Booking ID, Customer, Schedule Time, Amount, Plan and Payment (booking status)
 * come from the API. Service is a constant ("Lawn Mowing") and Agent is not
 * exposed by the list endpoint yet — both mirror the "View all" page
 * (`admin-bookings.tsx`).
 */

const COLUMNS = [
  "Booking ID",
  "Customer",
  "Agent",
  "Service",
  "Schedule Time",
  "Amount",
  "Plan",
  "Payment Status",
] as const;

// How many of the most recent bookings the dashboard card shows.
const ROWS_SHOWN = 6;

// Placeholder for a column whose data the backend doesn't expose yet.
const Empty = () => <span className="text-muted-foreground">—</span>;

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function planLabel(frequency: string) {
  return FREQUENCY_LABELS[frequency as Frequency]?.title ?? capitalize(frequency);
}

export function RecentBookings() {
  const { data, isLoading, isError, refetch } = useAdminBookings({
    page: 1,
    pageSize: ROWS_SHOWN,
  });

  const bookings = data?.items ?? [];
  const isEmpty = !isLoading && !isError && bookings.length === 0;

  return (
    <section className="bg-card flex flex-col gap-6 rounded-xl p-6 shadow-[0px_4px_8px_0px_rgba(74,74,74,0.1)]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-[-0.01em]">Recent Bookings</h2>
          <p className="text-muted-foreground text-sm">
            Latest activity across the platform
          </p>
        </div>
        <Link
          href="/admin/bookings"
          className="text-primary inline-flex items-center rounded-[10px] border-[1.2px] border-[#35ab6e] px-6 py-2.5 text-sm font-semibold transition-colors hover:bg-[#35ab6e]/10"
        >
          View all
        </Link>
      </div>

      {isError ? (
        <div className="border-border flex flex-col items-center gap-3 rounded-xl border px-6 py-14 text-center">
          <p className="text-foreground text-sm font-semibold">
            We couldn&apos;t load recent bookings.
          </p>
          <p className="text-muted-foreground text-sm">
            Please check your connection and try again.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="border-border bg-background hover:bg-accent mt-1 h-10 rounded-lg border px-4 text-sm font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      ) : isEmpty ? (
        <div className="border-border flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-14 text-center">
          <span className="bg-accent text-muted-foreground flex size-14 items-center justify-center rounded-full">
            <CalendarRange className="size-7" />
          </span>
          <p className="text-foreground text-base font-semibold">No bookings yet</p>
          <p className="text-muted-foreground max-w-sm text-sm">
            Bookings will appear here as customers schedule lawn services on the platform.
          </p>
        </div>
      ) : (
        <div className="border-border overflow-x-auto rounded-xl border">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-border border-b">
                {COLUMNS.map((col) => (
                  <th
                    key={col}
                    className="text-muted-foreground px-5 py-4 text-[13px] font-semibold whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: ROWS_SHOWN }).map((_, i) => (
                    <tr
                      key={i}
                      className={cn(
                        "align-middle",
                        i !== ROWS_SHOWN - 1 && "border-border border-b",
                      )}
                    >
                      <td className="px-5 py-4">
                        <Skeleton className="h-3.5 w-20" />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Skeleton className="size-10 shrink-0 rounded-full" />
                          <div className="flex flex-col gap-1.5">
                            <Skeleton className="h-3.5 w-28" />
                            <Skeleton className="h-3 w-36" />
                          </div>
                        </div>
                      </td>
                      {Array.from({ length: COLUMNS.length - 2 }).map((_, j) => (
                        <td key={j} className="px-5 py-4">
                          <Skeleton className="h-3.5 w-16" />
                        </td>
                      ))}
                    </tr>
                  ))
                : bookings.map((b, i) => (
                    <BookingRow key={b.id} booking={b} last={i === bookings.length - 1} />
                  ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function BookingRow({ booking, last }: { booking: AdminBookingListItem; last: boolean }) {
  const { customer } = booking;
  return (
    <tr className={cn("align-middle", !last && "border-border border-b")}>
      <td className="px-5 py-4 text-sm font-semibold whitespace-nowrap">
        {booking.reference}
      </td>
      <td className="px-5 py-4">
        {customer ? (
          <div className="flex items-center gap-3">
            <span
              className="flex size-10 shrink-0 items-center justify-center rounded-full text-base font-medium text-white uppercase"
              style={{ backgroundColor: avatarColor(customer.id) }}
            >
              {getInitials(customer.name, customer.email)}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold whitespace-nowrap">
                {customer.name || "Unnamed customer"}
              </p>
              <p className="text-muted-foreground text-sm whitespace-nowrap">
                {customer.email}
              </p>
            </div>
          </div>
        ) : (
          <Empty />
        )}
      </td>
      {/* Agent — not exposed by the bookings list API yet. */}
      <td className="px-5 py-4 text-sm whitespace-nowrap">
        <Empty />
      </td>
      {/* Service — the app only sells lawn mowing; cadence lives in the Plan column. */}
      <td className="px-5 py-4 text-sm font-semibold whitespace-nowrap">Lawn Mowing</td>
      <td className="px-5 py-4 text-sm font-semibold whitespace-nowrap">
        {formatScheduleDate(booking.scheduleDate)} · {capitalize(booking.timeSlot)}
      </td>
      <td className="px-5 py-4 text-sm font-semibold whitespace-nowrap tabular-nums">
        {formatCents(booking.totalPerVisit * 100)}
      </td>
      <td className="px-5 py-4 text-sm font-semibold whitespace-nowrap">
        {planLabel(booking.frequency)}
      </td>
      <td className="px-5 py-4">
        <BookingStatusBadge status={booking.status} />
      </td>
    </tr>
  );
}
