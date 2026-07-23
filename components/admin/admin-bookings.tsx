"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, CalendarRange, CheckCircle2, Plus } from "lucide-react";

import { AdminPagination } from "@/components/admin/admin-pagination";
import { InviteAgentModal } from "@/components/admin/invite-agent-modal";
import { BookingStatusBadge } from "@/components/dashboard/booking-status-badge";
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";
import { avatarColor, getInitials } from "@/components/dashboard/user-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminBookings } from "@/hooks/use-admin";
import { formatCents, formatScheduleDate } from "@/lib/jobs";
import { FREQUENCY_LABELS, type Frequency } from "@/lib/pricing";
import { cn } from "@/lib/utils";

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function planLabel(frequency: string) {
  return FREQUENCY_LABELS[frequency as Frequency]?.title ?? capitalize(frequency);
}

/**
 * Super Admin → Bookings screen (Figma node 1021:3921).
 *
 * Wired to the live admin API (`useAdminBookings` → `GET /admin/bookings`), paged
 * server-side. Booking ID and Customer come from the API; Service defaults to
 * "Lawn Mowing". Agent, Schedule Time, Amount, Plan and Payment Status are not
 * wired yet — their columns render as empty placeholders until the backend
 * exposes those fields.
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
const PAGE_SIZE = 8;

// Placeholder for a column whose data the backend doesn't expose yet.
const Empty = () => <span className="text-muted-foreground">—</span>;

export function AdminBookings() {
  const [page, setPage] = useState(1);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [toast, setToast] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const { data, isLoading, isError, isPlaceholderData, refetch } = useAdminBookings({
    page,
    pageSize: PAGE_SIZE,
  });

  const bookings = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;
  const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = (page - 1) * PAGE_SIZE + bookings.length;

  const handleSent = (email: string) => {
    setInviteOpen(false);
    setToast(email ? `Invitation sent to ${email}` : "Invitation sent");
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2600);
  };

  const isEmpty = !isLoading && !isError && total === 0;

  return (
    <DashboardPanel
      title="Bookings"
      subtitle="Every job booked across the marketplace, in one place."
      actions={
        <>
          <button
            type="button"
            aria-label="Notifications"
            className="text-muted-foreground hover:text-foreground flex shrink-0 transition-colors"
          >
            <Bell className="size-[26px]" />
          </button>
          <button
            type="button"
            onClick={() => setInviteOpen(true)}
            className="lawn-gradient-btn inline-flex h-12 shrink-0 items-center gap-2 rounded-xl px-6 text-sm font-semibold text-white shadow-[0px_5px_10px_0px_rgba(25,81,52,0.25)] transition-transform active:scale-[0.98]"
          >
            <Plus className="size-[18px]" />
            Invite agent
          </button>
        </>
      }
    >
      {isError ? (
        <div className="border-border flex flex-col items-center gap-3 rounded-xl border px-6 py-16 text-center">
          <p className="text-foreground text-sm font-semibold">
            We couldn&apos;t load bookings.
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
        <div className="border-border flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-16 text-center">
          <span className="bg-accent text-muted-foreground flex size-14 items-center justify-center rounded-full">
            <CalendarRange className="size-7" />
          </span>
          <p className="text-foreground text-base font-semibold">No bookings yet</p>
          <p className="text-muted-foreground max-w-sm text-sm">
            Bookings will appear here as customers schedule lawn services on the platform.
          </p>
        </div>
      ) : (
        <>
          {/* Table */}
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
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <tr
                        key={i}
                        className={cn(
                          "align-middle",
                          i !== 5 && "border-border border-b",
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
                      <tr
                        key={b.id}
                        className={cn(
                          "align-middle",
                          i !== bookings.length - 1 && "border-border border-b",
                        )}
                      >
                        <td className="px-5 py-4 text-sm font-semibold whitespace-nowrap">
                          {b.reference}
                        </td>
                        <td className="px-5 py-4">
                          {b.customer ? (
                            <div className="flex items-center gap-3">
                              <span
                                className="flex size-10 shrink-0 items-center justify-center rounded-full text-base font-medium text-white uppercase"
                                style={{ backgroundColor: avatarColor(b.customer.id) }}
                              >
                                {getInitials(b.customer.name, b.customer.email)}
                              </span>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold whitespace-nowrap">
                                  {b.customer.name || "Unnamed customer"}
                                </p>
                                <p className="text-muted-foreground text-sm whitespace-nowrap">
                                  {b.customer.email}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <Empty />
                          )}
                        </td>
                        {/* Agent — the agent on the earliest visit. */}
                        <td className="px-5 py-4 text-sm whitespace-nowrap">
                          {b.agent ? (
                            b.agent.name || b.agent.email
                          ) : (
                            <span className="text-muted-foreground">Unassigned</span>
                          )}
                        </td>
                        {/* Service — the app only sells lawn mowing. */}
                        <td className="px-5 py-4 text-sm font-semibold whitespace-nowrap">
                          Lawn Mowing
                        </td>
                        <td className="px-5 py-4 text-sm font-semibold whitespace-nowrap">
                          {formatScheduleDate(b.scheduleDate)} · {capitalize(b.timeSlot)}
                        </td>
                        <td className="px-5 py-4 text-sm font-semibold whitespace-nowrap tabular-nums">
                          {formatCents(b.amountCharged ?? b.totalPerVisit * 100)}
                        </td>
                        <td className="px-5 py-4 text-sm font-semibold whitespace-nowrap">
                          {b.planName ?? planLabel(b.frequency)}
                        </td>
                        <td className="px-5 py-4">
                          <BookingStatusBadge status={b.status} />
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          {/* Footer: count + pagination */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p
              className={cn("text-foreground text-sm", isPlaceholderData && "opacity-60")}
            >
              {isLoading
                ? "Loading bookings…"
                : `Showing ${rangeStart}-${rangeEnd} of ${total} booking${
                    total === 1 ? "" : "s"
                  }`}
            </p>
            <AdminPagination
              page={page}
              totalPages={totalPages}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        </>
      )}

      <InviteAgentModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onSent={handleSent}
      />

      {toast && (
        <div className="bg-primary text-primary-foreground fixed bottom-6 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2 rounded-[10px] px-5 py-3 text-sm font-medium shadow-lg">
          <CheckCircle2 className="size-4" />
          {toast}
        </div>
      )}
    </DashboardPanel>
  );
}
