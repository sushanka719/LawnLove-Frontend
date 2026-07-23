"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { AgentTopbar, InitialsAvatar } from "@/components/agent/agent-topbar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAgentBookings } from "@/hooks/use-agent";
import type { AgentBookingItem } from "@/lib/api/agent";
import { formatCents, formatScheduleDate } from "@/lib/jobs";
import { cn } from "@/lib/utils";

const COLUMNS = [
  "Booking ID",
  "Service",
  "Customer",
  "Next Visit",
  "Amount",
  "Status",
] as const;

const STATUS_STYLES: Record<string, string> = {
  active: "bg-lawn-badge-bg text-lawn-primary",
  completed: "bg-lawn-badge-bg text-lawn-primary",
  pendingPayment: "bg-amber-100 text-amber-700",
  pastDue: "bg-red-100 text-red-700",
  cancelled: "bg-neutral-200 text-neutral-600",
};
const STATUS_LABELS: Record<string, string> = {
  active: "Active",
  completed: "Completed",
  pendingPayment: "Pending payment",
  pastDue: "Past due",
  cancelled: "Cancelled",
};

const AVATAR_COLORS = ["#195134", "#35ab6e", "#2563eb", "#b45309", "#7c3aed"];
function avatarColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

// Agent (crew owner) bookings — distinct bookings this agent services, live from
// /agent/bookings with server pagination.
export function AgentBookings() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useAgentBookings(page);

  const items = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="bg-lawn-bg-2 flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl shadow-[0px_0px_12px_2px_rgba(116,116,116,0.1)]">
      <AgentTopbar
        title="Bookings"
        subtitle="Every booking your crew services."
        showSearch={false}
        showAction={false}
      />

      <div className="flex flex-col gap-6 overflow-y-auto p-6 lg:p-8">
        <div className="overflow-x-auto rounded-xl border border-[#cecece]">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr>
                {COLUMNS.map((col) => (
                  <th
                    key={col}
                    className="text-lawn-text-tertiary border-b border-[#e1e1e1] px-5 py-4 text-base font-semibold tracking-tight whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading &&
                [0, 1, 2, 3].map((i) => (
                  <tr key={i}>
                    <td colSpan={COLUMNS.length} className="px-5 py-3">
                      <Skeleton className="h-10 w-full" />
                    </td>
                  </tr>
                ))}
              {!isLoading &&
                items.map((row) => <BookingTableRow key={row.id} row={row} />)}
            </tbody>
          </table>

          {isError && (
            <p className="text-lawn-text-secondary px-5 py-8 text-center">
              Couldn&apos;t load bookings.
            </p>
          )}
          {!isLoading && !isError && items.length === 0 && (
            <p className="text-lawn-text-secondary px-5 py-10 text-center">
              No bookings assigned to your crew yet.
            </p>
          )}
        </div>

        {data && data.total > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-lawn-text-secondary text-base tracking-tight">
              Page {data.page} of {totalPages} · {data.total} total
            </p>
            <nav aria-label="Pagination" className="flex items-center gap-2">
              <PageButton
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="size-5" />
                Previous
              </PageButton>
              <PageButton
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
                <ChevronRight className="size-5" />
              </PageButton>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}

function BookingTableRow({ row }: { row: AgentBookingItem }) {
  const customerName = row.customer?.name ?? "Customer";
  return (
    <tr className="h-20">
      <td className="text-lawn-text-primary border-b border-[#e1e1e1] px-5 py-4 text-base font-semibold tracking-tight whitespace-nowrap">
        {row.reference}
      </td>
      <td className="text-lawn-text-primary border-b border-[#e1e1e1] px-5 py-4 text-base font-semibold tracking-tight whitespace-nowrap">
        {row.title}
      </td>
      <td className="border-b border-[#e1e1e1] px-5 py-4">
        <div className="flex items-center gap-3">
          <InitialsAvatar name={customerName} color={avatarColor(customerName)} />
          <div className="min-w-0">
            <p className="text-lawn-text-primary text-base font-semibold tracking-tight whitespace-nowrap">
              {customerName}
            </p>
            {row.customer?.email && (
              <p className="text-lawn-text-tertiary text-base tracking-tight whitespace-nowrap">
                {row.customer.email}
              </p>
            )}
          </div>
        </div>
      </td>
      <td className="text-lawn-text-primary border-b border-[#e1e1e1] px-5 py-4 text-base tracking-tight whitespace-nowrap">
        {row.nextVisit ? formatScheduleDate(row.nextVisit) : "—"}
      </td>
      <td className="text-lawn-text-primary border-b border-[#e1e1e1] px-5 py-4 text-base font-semibold tracking-tight whitespace-nowrap tabular-nums">
        {formatCents(row.totalPerVisit * 100)}
      </td>
      <td className="border-b border-[#e1e1e1] px-5 py-4">
        <span
          className={cn(
            "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
            STATUS_STYLES[row.status] ?? "bg-neutral-200 text-neutral-600",
          )}
        >
          {STATUS_LABELS[row.status] ?? row.status}
        </span>
      </td>
    </tr>
  );
}

function PageButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="text-lawn-text-primary flex items-center gap-1.5 rounded-[10px] border border-[#cecece] px-3 py-2.5 text-base tracking-tight transition-colors hover:bg-black/[0.03] disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}
