"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, DollarSign } from "lucide-react";
import { toast } from "sonner";

import { AgentTopbar } from "@/components/agent/agent-topbar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAgentEarnings } from "@/hooks/use-agent";
import type { AgentEarningItem } from "@/lib/api/agent";
import { formatCents, formatScheduleDate } from "@/lib/jobs";

const COLUMNS = ["Payout ID", "Service", "Serviced On", "Amount", "Status"] as const;

// Agent (crew owner) earnings — live per-visit payout ledger from /agent/earnings.
// Payouts are issued manually by admin (deferred model), so "Request Payout" is
// informational.
export function AgentEarning() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useAgentEarnings(page);

  const items = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;
  const owed = data?.totals.owedCents ?? 0;
  const paid = data?.totals.paidCents ?? 0;

  const cards = [
    { label: "Balance owed", value: formatCents(owed), sub: "Awaiting payout" },
    { label: "Paid out", value: formatCents(paid), sub: "Received to date" },
    {
      label: "Lifetime earnings",
      value: formatCents(owed + paid),
      sub: "Owed + paid",
    },
  ];

  return (
    <div className="bg-lawn-bg-2 flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl shadow-[0px_0px_12px_2px_rgba(116,116,116,0.1)]">
      <AgentTopbar
        title="Earnings"
        subtitle="Your per-visit payout ledger."
        showSearch={false}
        actionLabel="Request Payout"
        actionIcon={DollarSign}
        onAction={() =>
          toast.info("Payouts are issued by the LawnLove team — no action needed.")
        }
      />

      <div className="flex flex-col gap-6 overflow-y-auto p-6 lg:p-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.label}
              className="bg-lawn-bg-2 flex flex-col gap-1.5 rounded-xl p-6 drop-shadow-[0px_4px_8px_rgba(74,74,74,0.14)]"
            >
              <p className="text-lawn-text-tertiary text-base tracking-tight">
                {card.label}
              </p>
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <p className="text-lawn-text-primary text-2xl font-semibold tracking-tight tabular-nums">
                  {card.value}
                </p>
              )}
              <p className="text-lawn-text-tertiary text-base tracking-tight">
                {card.sub}
              </p>
            </div>
          ))}
        </div>

        <section className="bg-lawn-bg-2 flex flex-col gap-6 rounded-xl p-6 drop-shadow-[0px_4px_8px_rgba(74,74,74,0.14)]">
          <div className="flex flex-col gap-1">
            <h2 className="text-lawn-text-primary text-xl font-semibold tracking-tight">
              Payout history
            </h2>
            <p className="text-lawn-text-tertiary text-lg tracking-tight">
              Per-visit amounts owed and paid.
            </p>
          </div>

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
                  [0, 1, 2].map((i) => (
                    <tr key={i}>
                      <td colSpan={COLUMNS.length} className="px-5 py-3">
                        <Skeleton className="h-10 w-full" />
                      </td>
                    </tr>
                  ))}
                {!isLoading && items.map((row) => <PayoutRow key={row.id} row={row} />)}
              </tbody>
            </table>

            {isError && (
              <p className="text-lawn-text-secondary px-5 py-8 text-center">
                Couldn&apos;t load earnings.
              </p>
            )}
            {!isLoading && !isError && items.length === 0 && (
              <p className="text-lawn-text-secondary px-5 py-10 text-center">
                No payouts recorded yet.
              </p>
            )}
          </div>

          {data && data.total > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-lawn-text-secondary text-base tracking-tight">
                Page {data.page} of {totalPages} · {data.total} total
              </p>
              <nav aria-label="Pagination" className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="text-lawn-text-primary flex items-center gap-1.5 rounded-[10px] border border-[#cecece] px-3 py-2.5 text-base transition-colors hover:bg-black/[0.03] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="size-5" /> Previous
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="text-lawn-text-primary flex items-center gap-1.5 rounded-[10px] border border-[#cecece] px-3 py-2.5 text-base transition-colors hover:bg-black/[0.03] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next <ChevronRight className="size-5" />
                </button>
              </nav>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function PayoutRow({ row }: { row: AgentEarningItem }) {
  return (
    <tr className="h-20">
      <td className="text-lawn-text-primary border-b border-[#e1e1e1] px-5 py-4 text-base font-semibold tracking-tight whitespace-nowrap">
        {row.reference}
      </td>
      <td className="text-lawn-text-primary border-b border-[#e1e1e1] px-5 py-4 text-base tracking-tight whitespace-nowrap">
        {row.serviceLabel}
      </td>
      <td className="text-lawn-text-primary border-b border-[#e1e1e1] px-5 py-4 text-base tracking-tight whitespace-nowrap">
        {row.servicedOn ? formatScheduleDate(row.servicedOn) : "—"}
      </td>
      <td className="text-lawn-text-primary border-b border-[#e1e1e1] px-5 py-4 text-base font-semibold tracking-tight whitespace-nowrap tabular-nums">
        {formatCents(row.amount)}
      </td>
      <td className="border-b border-[#e1e1e1] px-5 py-4">
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
            row.paid
              ? "bg-lawn-badge-bg text-lawn-primary"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {row.paid ? "Paid" : "Pending"}
        </span>
      </td>
    </tr>
  );
}
