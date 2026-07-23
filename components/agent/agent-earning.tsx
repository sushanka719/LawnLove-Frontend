import { DollarSign } from "lucide-react";

import {
  EARNING_STATS,
  PAYOUT_REQUESTS,
  type PayoutRequest,
} from "@/components/agent/agent-mock";
import { AgentStatusBadge } from "@/components/agent/agent-status-badge";
import { AgentTopbar } from "@/components/agent/agent-topbar";

// Agent (crew owner) earnings — Figma node 1142:12170.
//
// Visual mockup wired to static data (see `agent-mock.ts`): balance summary
// cards plus a payout-request history table. Wire to the payout/earnings API
// once exposed.

const COLUMNS = ["Request ID", "Requested Time", "Amount", "Status"] as const;

export function AgentEarning() {
  return (
    <div className="bg-lawn-bg-2 flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl shadow-[0px_0px_12px_2px_rgba(116,116,116,0.1)]">
      <AgentTopbar
        title="Earnings"
        subtitle="Your balance, payout history, and requests."
        showSearch={false}
        actionLabel="Request Payout"
        actionIcon={DollarSign}
      />

      <div className="flex flex-col gap-6 overflow-y-auto p-6 lg:p-8">
        {/* Balance summary */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {EARNING_STATS.map((card, i) => (
            <div
              key={i}
              className="bg-lawn-bg-2 flex flex-col gap-1.5 rounded-xl p-6 drop-shadow-[0px_4px_8px_rgba(74,74,74,0.14)]"
            >
              <p className="text-lawn-text-tertiary text-base tracking-tight">
                {card.label}
              </p>
              <p className="text-lawn-text-primary text-2xl font-semibold tracking-tight">
                {card.value}
              </p>
              <p className="text-lawn-text-tertiary text-base tracking-tight">
                {card.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Payout requests */}
        <section className="bg-lawn-bg-2 flex flex-col gap-8 rounded-xl p-6 drop-shadow-[0px_4px_8px_rgba(74,74,74,0.14)]">
          <div className="flex flex-col gap-2">
            <h2 className="text-lawn-text-primary text-xl font-semibold tracking-tight">
              Payout Requests
            </h2>
            <p className="text-lawn-text-tertiary text-lg tracking-tight">
              Your withdrawal history and pending requests.
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
                {PAYOUT_REQUESTS.map((row, i) => (
                  <PayoutRow key={i} row={row} />
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

function PayoutRow({ row }: { row: PayoutRequest }) {
  return (
    <tr className="h-20">
      <td className="text-lawn-text-primary border-b border-[#e1e1e1] px-5 py-4 text-base font-semibold tracking-tight whitespace-nowrap">
        {row.id}
      </td>
      <td className="text-lawn-text-primary border-b border-[#e1e1e1] px-5 py-4 text-base font-semibold tracking-tight whitespace-nowrap">
        {row.requestedTime}
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
