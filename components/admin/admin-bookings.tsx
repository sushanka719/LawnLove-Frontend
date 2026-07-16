"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Leaf } from "lucide-react";

import { BookingStatusBadge } from "@/components/dashboard/booking-status-badge";
import { Pagination } from "@/components/dashboard/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminBookings } from "@/hooks/use-admin";
import type { BookingStatus } from "@/lib/api/booking";
import { formatCents, formatScheduleDate } from "@/lib/jobs";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;

const FILTERS: { label: string; value: BookingStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

export function AdminBookings() {
  const [status, setStatus] = useState<BookingStatus | "all">("all");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, isPlaceholderData } = useAdminBookings({
    status: status === "all" ? undefined : status,
    page,
    pageSize: PAGE_SIZE,
  });

  const bookings = data?.items ?? [];

  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => {
              setStatus(f.value);
              setPage(1);
            }}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-medium tracking-tight transition-colors",
              status === f.value
                ? "bg-lawn-primary text-white"
                : "text-lawn-text-secondary bg-black/[0.04] hover:bg-black/[0.07]",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isError ? (
        <p className="text-destructive text-base">
          We couldn&apos;t load bookings. Please refresh and try again.
        </p>
      ) : isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <p className="text-lawn-text-secondary rounded-xl border border-[#cecece]/60 px-5 py-10 text-center text-base">
          No bookings match this filter.
        </p>
      ) : (
        <div className="bg-lawn-bg-2 overflow-hidden rounded-xl shadow-[0px_4px_16px_0px_rgba(74,74,74,0.1)]">
          {bookings.map((b, i) => (
            <Link
              key={b.id}
              href={`/admin/bookings/${b.id}`}
              className={cn(
                "flex items-center gap-4 px-5 py-4 transition hover:bg-black/[0.02]",
                i !== bookings.length - 1 && "border-b border-[#cecece]/40",
              )}
            >
              <div className="bg-lawn-badge-bg flex size-11 shrink-0 items-center justify-center rounded-xl">
                <Leaf className="text-lawn-primary size-5" strokeWidth={1.75} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-lawn-text-primary truncate text-base font-semibold tracking-tight">
                    {b.title}
                  </p>
                  <span className="text-lawn-text-tertiary shrink-0 text-xs tracking-tight">
                    {b.reference}
                  </span>
                </div>
                <p className="text-lawn-text-secondary truncate text-sm tracking-tight">
                  {b.customer?.name || b.customer?.email || "Customer"} ·{" "}
                  {b.address}
                </p>
                <p className="text-lawn-text-tertiary truncate text-sm tracking-tight">
                  {formatScheduleDate(b.scheduleDate)}
                  {b.visitsCount > 0 ? ` · ${b.visitsCount} visits` : ""}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <BookingStatusBadge status={b.status} />
                <span className="text-lawn-text-primary hidden text-sm font-semibold tracking-tight sm:inline">
                  {formatCents(b.totalPerVisit * 100)}
                </span>
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
