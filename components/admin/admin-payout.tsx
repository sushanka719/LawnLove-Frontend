"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, CheckCircle2, Plus } from "lucide-react";

import { AdminPagination } from "@/components/admin/admin-pagination";
import { InviteAgentModal } from "@/components/admin/invite-agent-modal";
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";
import { cn } from "@/lib/utils";

/**
 * Super Admin → Payout screen (Figma node 1034:5854).
 *
 * Visual mock — the rows are placeholder data. Approve/Reject only mutate local
 * state (and toast); wire them to the payouts API when it exists. The Invite
 * agent flow IS live (wired to `InviteAgentModal` → `useInviteAgent`).
 */

type PayoutStatus = "processing" | "pending" | "completed";

type Payout = {
  id: string;
  agent: string;
  email: string;
  initial: string;
  avatarColor: string;
  jobs: string;
  amount: string;
  status: PayoutStatus;
};

const PAYOUTS: Payout[] = [
  {
    id: "1",
    agent: "Gavrial Carter",
    email: "gavrial4@gmail.com",
    initial: "G",
    avatarColor: "#4f46e5",
    jobs: "Green Blade Lawn",
    amount: "$567",
    status: "processing",
  },
  {
    id: "2",
    agent: "Raymond Patel",
    email: "raymond@gmail.com",
    initial: "R",
    avatarColor: "#9333ea",
    jobs: "Fresh Cut Service",
    amount: "$110",
    status: "pending",
  },
  {
    id: "3",
    agent: "Monica Walsh",
    email: "monicaw@gmail.com",
    initial: "M",
    avatarColor: "#d97706",
    jobs: "Yard Cleanup",
    amount: "$67",
    status: "completed",
  },
  {
    id: "4",
    agent: "Daniel Foster",
    email: "daniel@gmail.com",
    initial: "D",
    avatarColor: "#0d9488",
    jobs: "Evergreen Yard Service",
    amount: "$305",
    status: "processing",
  },
  {
    id: "5",
    agent: "Ivary Bennett",
    email: "ivary@gmail.com",
    initial: "I",
    avatarColor: "#0e7490",
    jobs: "Yard Cleanup",
    amount: "$60",
    status: "completed",
  },
  {
    id: "6",
    agent: "Rachel Nguyen",
    email: "rachel@gmail.com",
    initial: "R",
    avatarColor: "#ca8a04",
    jobs: "Green Blade Lawn",
    amount: "$630",
    status: "processing",
  },
  {
    id: "7",
    agent: "Monica Walsh",
    email: "monicaw@gmail.com",
    initial: "M",
    avatarColor: "#d97706",
    jobs: "Yard Cleanup",
    amount: "$630",
    status: "pending",
  },
  {
    id: "8",
    agent: "Raymond Patel",
    email: "raymond@gmail.com",
    initial: "R",
    avatarColor: "#9333ea",
    jobs: "Green Blade Lawn",
    amount: "$630",
    status: "completed",
  },
  {
    id: "9",
    agent: "Daniel Foster",
    email: "daniel@gmail.com",
    initial: "D",
    avatarColor: "#0d9488",
    jobs: "Fresh Cut Service",
    amount: "$145",
    status: "processing",
  },
  {
    id: "10",
    agent: "Ivary Bennett",
    email: "ivary@gmail.com",
    initial: "I",
    avatarColor: "#0e7490",
    jobs: "Evergreen Yard Service",
    amount: "$88",
    status: "pending",
  },
  {
    id: "11",
    agent: "Gavrial Carter",
    email: "gavrial4@gmail.com",
    initial: "G",
    avatarColor: "#4f46e5",
    jobs: "Green Blade Lawn",
    amount: "$210",
    status: "completed",
  },
  {
    id: "12",
    agent: "Rachel Nguyen",
    email: "rachel@gmail.com",
    initial: "R",
    avatarColor: "#ca8a04",
    jobs: "Yard Cleanup",
    amount: "$72",
    status: "processing",
  },
];

const COLUMNS = ["Agent", "Jobs", "Amount", "Status", "Action"] as const;
const PAGE_SIZE = 8;

const STATUS_STYLES: Record<
  PayoutStatus,
  { className: string; dot: string; label: string }
> = {
  processing: {
    className: "bg-[#dbeafe] text-[#1d4ed8]",
    dot: "#1d4ed8",
    label: "Processing",
  },
  pending: { className: "bg-[#ffedd5] text-[#ea580c]", dot: "#ea580c", label: "Pending" },
  completed: { className: "bg-accent text-primary", dot: "#195134", label: "Completed" },
};

function StatusPill({ status }: { status: PayoutStatus }) {
  const s = STATUS_STYLES[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap",
        s.className,
      )}
    >
      <span className="size-1.5 rounded-full" style={{ backgroundColor: s.dot }} />
      {s.label}
    </span>
  );
}

export function AdminPayout() {
  const [page, setPage] = useState(1);
  const [statuses, setStatuses] = useState<Record<string, PayoutStatus>>(() =>
    Object.fromEntries(PAYOUTS.map((p) => [p.id, p.status])),
  );
  const [actioned, setActioned] = useState<Set<string>>(
    () => new Set(PAYOUTS.filter((p) => p.status === "completed").map((p) => p.id)),
  );
  const [inviteOpen, setInviteOpen] = useState(false);
  const [toast, setToast] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const totalPages = Math.max(1, Math.ceil(PAYOUTS.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const start = (current - 1) * PAGE_SIZE;
  const rows = PAYOUTS.slice(start, start + PAGE_SIZE);
  const rangeStart = PAYOUTS.length === 0 ? 0 : start + 1;
  const rangeEnd = start + rows.length;

  const approve = (p: Payout) => {
    setStatuses((s) => ({ ...s, [p.id]: "completed" }));
    setActioned((a) => new Set(a).add(p.id));
    showToast(`Payout approved for ${p.agent}`);
  };

  const reject = (p: Payout) => {
    setActioned((a) => new Set(a).add(p.id));
    showToast(`Payout rejected for ${p.agent}`);
  };

  const handleSent = (email: string) => {
    setInviteOpen(false);
    showToast(email ? `Invitation sent to ${email}` : "Invitation sent");
  };

  return (
    <DashboardPanel
      title="Payout"
      subtitle="Agents awaiting for their next payment transfer."
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
            {rows.map((p, i) => {
              const status = statuses[p.id];
              const isActioned = actioned.has(p.id);
              return (
                <tr
                  key={p.id}
                  className={cn(
                    "align-middle",
                    i !== rows.length - 1 && "border-border border-b",
                  )}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span
                        className="flex size-10 shrink-0 items-center justify-center rounded-full text-base font-medium text-white"
                        style={{ backgroundColor: p.avatarColor }}
                      >
                        {p.initial}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold whitespace-nowrap">
                          {p.agent}
                        </p>
                        <p className="text-muted-foreground text-sm whitespace-nowrap">
                          {p.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold whitespace-nowrap">
                    {p.jobs}
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold whitespace-nowrap tabular-nums">
                    {p.amount}
                  </td>
                  <td className="px-5 py-4">
                    <StatusPill status={status} />
                  </td>
                  <td className="px-5 py-4">
                    {isActioned ? (
                      <span className="text-sm font-semibold">-</span>
                    ) : (
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => reject(p)}
                          className="text-primary rounded-xl border-[1.2px] border-[#35ab6e] px-5 py-2 text-sm font-medium transition-colors hover:bg-[#35ab6e]/10"
                        >
                          Reject
                        </button>
                        <button
                          type="button"
                          onClick={() => approve(p)}
                          className="lawn-gradient-btn rounded-xl px-5 py-2 text-sm font-medium text-white shadow-[0px_5px_10px_0px_rgba(25,81,52,0.25)] transition-transform active:scale-[0.98]"
                        >
                          Approve
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer: count + pagination */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-foreground text-sm">
          Showing {rangeStart}-{rangeEnd} of {PAYOUTS.length} payouts
        </p>
        <AdminPagination
          page={current}
          totalPages={totalPages}
          onPageChange={(p) => setPage(p)}
        />
      </div>

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
