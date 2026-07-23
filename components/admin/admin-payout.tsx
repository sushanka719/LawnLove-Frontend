"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, CheckCircle2, Plus } from "lucide-react";

import { AdminPagination } from "@/components/admin/admin-pagination";
import { InviteAgentModal } from "@/components/admin/invite-agent-modal";
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";
import { avatarColor, getInitials } from "@/components/dashboard/user-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminPayouts, usePayoutJob } from "@/hooks/use-admin";
import type { AdminPayoutItem } from "@/lib/api/admin";
import { ApiError } from "@/lib/api/http";
import { formatCents, formatScheduleDate } from "@/lib/jobs";
import { cn } from "@/lib/utils";

/**
 * Super Admin → Payout screen. Live against GET /admin/payouts. Owed visits are
 * marked paid (deferred manual model — POST /admin/jobs/:id/payout); there is no
 * real Stripe transfer yet. The Invite agent flow is also live.
 */

const COLUMNS = ["Agent", "Service", "Amount", "Status", "Action"] as const;
const PAGE_SIZE = 8;

export function AdminPayout() {
  const [page, setPage] = useState(1);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [toast, setToast] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data, isLoading, isError } = useAdminPayouts();
  const payout = usePayoutJob();

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const showToast = (message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2600);
  };

  const items = data?.items ?? [];
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const start = (current - 1) * PAGE_SIZE;
  const rows = items.slice(start, start + PAGE_SIZE);

  const markPaid = async (p: AdminPayoutItem) => {
    try {
      await payout.mutateAsync({ id: p.jobId });
      showToast(`Payout marked paid for ${p.agent?.name ?? "agent"}`);
    } catch (err) {
      showToast(
        err instanceof ApiError ? err.message : "Couldn't mark that payout paid.",
      );
    }
  };

  const handleSent = (email: string) => {
    setInviteOpen(false);
    showToast(email ? `Invitation sent to ${email}` : "Invitation sent");
  };

  return (
    <DashboardPanel
      title="Payout"
      subtitle="Per-visit amounts owed to agents. Mark them paid once transferred."
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
      {/* Totals */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="border-border rounded-xl border p-5">
          <p className="text-muted-foreground text-sm">Owed to agents</p>
          <p className="mt-1 text-2xl font-extrabold tabular-nums">
            {data ? formatCents(data.totals.owedCents) : "—"}
          </p>
        </div>
        <div className="border-border rounded-xl border p-5">
          <p className="text-muted-foreground text-sm">Paid out</p>
          <p className="mt-1 text-2xl font-extrabold tabular-nums">
            {data ? formatCents(data.totals.paidCents) : "—"}
          </p>
        </div>
      </div>

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
            {isLoading &&
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-border border-b">
                  <td colSpan={COLUMNS.length} className="px-5 py-4">
                    <Skeleton className="h-10 w-full" />
                  </td>
                </tr>
              ))}
            {!isLoading &&
              rows.map((p, i) => (
                <tr
                  key={p.jobId}
                  className={cn(
                    "align-middle",
                    i !== rows.length - 1 && "border-border border-b",
                  )}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span
                        className="flex size-10 shrink-0 items-center justify-center rounded-full text-base font-medium text-white uppercase"
                        style={{ backgroundColor: avatarColor(p.agent?.id ?? p.jobId) }}
                      >
                        {getInitials(p.agent?.name ?? "", p.agent?.email ?? "?")}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold whitespace-nowrap">
                          {p.agent?.name ?? "Unassigned"}
                        </p>
                        <p className="text-muted-foreground text-sm whitespace-nowrap">
                          {p.agent?.email ?? p.address}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold whitespace-nowrap">
                    {p.serviceLabel}
                    <span className="text-muted-foreground ml-1 font-normal">
                      · visit {p.visitNumber}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold whitespace-nowrap tabular-nums">
                    {formatCents(p.amount)}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap",
                        p.paid ? "bg-accent text-primary" : "bg-[#ffedd5] text-[#ea580c]",
                      )}
                    >
                      {p.paid
                        ? `Paid${p.paidAt ? ` · ${formatScheduleDate(p.paidAt)}` : ""}`
                        : "Owed"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {p.paid ? (
                      <span className="text-muted-foreground text-sm">
                        {p.payoutRef ?? "—"}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => markPaid(p)}
                        disabled={payout.isPending}
                        className="lawn-gradient-btn rounded-xl px-5 py-2 text-sm font-medium text-white shadow-[0px_5px_10px_0px_rgba(25,81,52,0.25)] transition-transform active:scale-[0.98] disabled:opacity-60"
                      >
                        Mark paid
                      </button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {isError && (
          <p className="text-muted-foreground px-5 py-10 text-center text-sm">
            Couldn&apos;t load payouts.
          </p>
        )}
        {!isLoading && !isError && items.length === 0 && (
          <p className="text-muted-foreground px-5 py-10 text-center text-sm">
            No payouts recorded yet.
          </p>
        )}
      </div>

      {/* Footer: count + pagination */}
      {items.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-foreground text-sm">
            Showing {start + 1}-{start + rows.length} of {items.length} payouts
          </p>
          <AdminPagination
            page={current}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
          />
        </div>
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
