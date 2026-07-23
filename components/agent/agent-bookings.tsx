import { ChevronLeft, ChevronRight } from "lucide-react";

import { BOOKING_ROWS, type BookingRow } from "@/components/agent/agent-mock";
import { AgentStatusBadge } from "@/components/agent/agent-status-badge";
import { AgentTopbar, InitialsAvatar } from "@/components/agent/agent-topbar";
import { cn } from "@/lib/utils";

// Agent (crew owner) bookings list — Figma node 1126:10646.
//
// Visual mockup wired to static data (see `agent-mock.ts`). Every job and the
// crew member assigned to it; wire to the agent API once bookings + crew data
// are exposed.

const COLUMNS = [
  "Booking ID",
  "Service",
  "Customer",
  "Schedule Time",
  "Assigned To",
  "Amount",
  "Status",
] as const;

export function AgentBookings() {
  return (
    <div className="bg-lawn-bg-2 flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl shadow-[0px_0px_12px_2px_rgba(116,116,116,0.1)]">
      <AgentTopbar
        title="Bookings"
        subtitle="Every job and the employee assigned to it."
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
              {BOOKING_ROWS.map((row, i) => (
                <BookingTableRow key={i} row={row} />
              ))}
            </tbody>
          </table>
        </div>

        <Footer />
      </div>
    </div>
  );
}

function BookingTableRow({ row }: { row: BookingRow }) {
  return (
    <tr className="h-20">
      <td className="text-lawn-text-primary border-b border-[#e1e1e1] px-5 py-4 text-base font-semibold tracking-tight whitespace-nowrap">
        {row.id}
      </td>
      <td className="text-lawn-text-primary border-b border-[#e1e1e1] px-5 py-4 text-base font-semibold tracking-tight whitespace-nowrap">
        {row.service}
      </td>
      <td className="border-b border-[#e1e1e1] px-5 py-4">
        <div className="flex items-center gap-3">
          <InitialsAvatar name={row.customer.name} color={row.customer.color} />
          <div className="min-w-0">
            <p className="text-lawn-text-primary text-base font-semibold tracking-tight whitespace-nowrap">
              {row.customer.name}
            </p>
            <p className="text-lawn-text-tertiary text-base tracking-tight whitespace-nowrap">
              {row.customer.email}
            </p>
          </div>
        </div>
      </td>
      <td className="text-lawn-text-primary border-b border-[#e1e1e1] px-5 py-4 text-base font-semibold tracking-tight whitespace-nowrap">
        {row.scheduleTime}
      </td>
      <td className="border-b border-[#e1e1e1] px-5 py-4">
        <div className="flex items-center gap-3">
          <InitialsAvatar name={row.assignedTo.name} color={row.assignedTo.color} />
          <span className="text-lawn-text-primary text-base font-semibold tracking-tight whitespace-nowrap">
            {row.assignedTo.name}
          </span>
        </div>
      </td>
      <td className="text-lawn-text-primary border-b border-[#e1e1e1] px-5 py-4 text-base font-semibold tracking-tight whitespace-nowrap tabular-nums">
        {row.amount}
      </td>
      <td className="border-b border-[#e1e1e1] px-5 py-4">
        <AgentStatusBadge status={row.status} />
      </td>
    </tr>
  );
}

/* -------------------------------------------------------------------------- */
/* Footer — result count + pagination                                         */
/* -------------------------------------------------------------------------- */

function Footer() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <p className="text-lawn-text-secondary text-base tracking-tight">
        Showing 1-8 of 12 agents
      </p>

      <nav aria-label="Pagination" className="flex items-center gap-2">
        <PageButton>
          <ChevronLeft className="size-5" />
          Previous
        </PageButton>
        <PageButton active>1</PageButton>
        <PageButton>2</PageButton>
        <PageButton>3</PageButton>
        <span className="text-lawn-text-tertiary px-1">…</span>
        <PageButton>
          Next
          <ChevronRight className="size-5" />
        </PageButton>
      </nav>
    </div>
  );
}

function PageButton({
  children,
  active = false,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-1.5 rounded-[10px] border px-3 py-2.5 text-base tracking-tight transition-colors",
        active
          ? "border-lawn-primary-light bg-lawn-badge-bg text-lawn-primary font-semibold"
          : "text-lawn-text-primary border-[#cecece] hover:bg-black/[0.03]",
      )}
    >
      {children}
    </button>
  );
}
