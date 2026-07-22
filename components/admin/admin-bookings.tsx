"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, CheckCircle2, Plus } from "lucide-react";

import { AdminPagination } from "@/components/admin/admin-pagination";
import { InviteAgentModal } from "@/components/admin/invite-agent-modal";
import {
  PaymentStatusBadge,
  type PaymentStatus,
} from "@/components/admin/payment-status-badge";
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";
import { cn } from "@/lib/utils";

/**
 * Super Admin → Bookings screen (Figma node 1021:3921).
 *
 * Visual mock — the table rows are placeholder data. Swap `BOOKINGS` for the
 * shape returned by the admin API (`getAdminBookings`) once wired. The Invite
 * agent flow IS live (wired to `InviteAgentModal` → `useInviteAgent`).
 */

type BookingRow = {
  id: string;
  reference: string;
  customer: string;
  email: string;
  initial: string;
  avatarColor: string;
  agent: string;
  service: string;
  schedule: string;
  amount: string;
  plan: string;
  payment: PaymentStatus;
};

const BOOKINGS: BookingRow[] = [
  {
    id: "1",
    reference: "#BK-9078",
    customer: "Gavrial Carter",
    email: "gavrial4@gmail.com",
    initial: "G",
    avatarColor: "#4f46e5",
    agent: "Green Blade Lawn",
    service: "Lawn Mowing",
    schedule: "Today-10:30 AM",
    amount: "$567",
    plan: "One-time",
    payment: "ongoing",
  },
  {
    id: "2",
    reference: "#BK-9078",
    customer: "Raymond Patel",
    email: "raymond@gmail.com",
    initial: "R",
    avatarColor: "#9333ea",
    agent: "Fresh Cut Service",
    service: "Lawn Mowing",
    schedule: "Today-1:30 PM",
    amount: "$110",
    plan: "One-time",
    payment: "ongoing",
  },
  {
    id: "3",
    reference: "#BK-9078",
    customer: "Monica Walsh",
    email: "monicaw@gmail.com",
    initial: "M",
    avatarColor: "#d97706",
    agent: "Yard Cleanup",
    service: "Fertilization",
    schedule: "Yesterday-5:30 PM",
    amount: "$67",
    plan: "Monthly",
    payment: "completed",
  },
  {
    id: "4",
    reference: "#BK-9078",
    customer: "Daniel Foster",
    email: "daniel@gmail.com",
    initial: "D",
    avatarColor: "#0d9488",
    agent: "Evergreen Yard Service",
    service: "Lawn Mowing",
    schedule: "Yesterday-12:30 PM",
    amount: "$305",
    plan: "One-time",
    payment: "ongoing",
  },
  {
    id: "5",
    reference: "#BK-9078",
    customer: "Ivary Bennett",
    email: "ivary@gmail.com",
    initial: "I",
    avatarColor: "#0e7490",
    agent: "Yard Cleanup",
    service: "Yard Cleanup",
    schedule: "Yesterday-10:30 AM",
    amount: "$60",
    plan: "Monthly",
    payment: "completed",
  },
  {
    id: "6",
    reference: "#BK-9078",
    customer: "Rachel Nguyen",
    email: "rachel@gmail.com",
    initial: "R",
    avatarColor: "#ca8a04",
    agent: "Green Blade Lawn",
    service: "Lawn Mowing",
    schedule: "Today-1:30 PM",
    amount: "$630",
    plan: "One-time",
    payment: "ongoing",
  },
  {
    id: "7",
    reference: "#BK-9078",
    customer: "Monica Walsh",
    email: "monicaw@gmail.com",
    initial: "M",
    avatarColor: "#d97706",
    agent: "Yard Cleanup",
    service: "Lawn Mowing",
    schedule: "Yesterday-09:30 AM",
    amount: "$630",
    plan: "One-time",
    payment: "ongoing",
  },
  {
    id: "8",
    reference: "#BK-9078",
    customer: "Raymond Patel",
    email: "raymond@gmail.com",
    initial: "R",
    avatarColor: "#9333ea",
    agent: "Green Blade Lawn",
    service: "Lawn Mowing",
    schedule: "Yesterday-2:30 PM",
    amount: "$630",
    plan: "Monthly",
    payment: "completed",
  },
  {
    id: "9",
    reference: "#BK-9078",
    customer: "Daniel Foster",
    email: "daniel@gmail.com",
    initial: "D",
    avatarColor: "#0d9488",
    agent: "Fresh Cut Service",
    service: "Fertilization",
    schedule: "Today-9:00 AM",
    amount: "$145",
    plan: "One-time",
    payment: "ongoing",
  },
  {
    id: "10",
    reference: "#BK-9078",
    customer: "Ivary Bennett",
    email: "ivary@gmail.com",
    initial: "I",
    avatarColor: "#0e7490",
    agent: "Evergreen Yard Service",
    service: "Yard Cleanup",
    schedule: "Yesterday-3:00 PM",
    amount: "$88",
    plan: "Monthly",
    payment: "completed",
  },
  {
    id: "11",
    reference: "#BK-9078",
    customer: "Gavrial Carter",
    email: "gavrial4@gmail.com",
    initial: "G",
    avatarColor: "#4f46e5",
    agent: "Green Blade Lawn",
    service: "Lawn Mowing",
    schedule: "Today-11:15 AM",
    amount: "$210",
    plan: "One-time",
    payment: "ongoing",
  },
  {
    id: "12",
    reference: "#BK-9078",
    customer: "Monica Walsh",
    email: "monicaw@gmail.com",
    initial: "M",
    avatarColor: "#d97706",
    agent: "Fresh Cut Service",
    service: "Fertilization",
    schedule: "Yesterday-1:00 PM",
    amount: "$72",
    plan: "Monthly",
    payment: "completed",
  },
];

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

  const totalPages = Math.max(1, Math.ceil(BOOKINGS.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const start = (current - 1) * PAGE_SIZE;
  const rows = BOOKINGS.slice(start, start + PAGE_SIZE);
  const rangeStart = BOOKINGS.length === 0 ? 0 : start + 1;
  const rangeEnd = start + rows.length;

  const handleSent = (email: string) => {
    setInviteOpen(false);
    setToast(email ? `Invitation sent to ${email}` : "Invitation sent");
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2600);
  };

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
            {rows.map((b, i) => (
              <tr
                key={b.id}
                className={cn(
                  "align-middle",
                  i !== rows.length - 1 && "border-border border-b",
                )}
              >
                <td className="px-5 py-4 text-sm font-semibold whitespace-nowrap">
                  {b.reference}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex size-10 shrink-0 items-center justify-center rounded-full text-base font-medium text-white"
                      style={{ backgroundColor: b.avatarColor }}
                    >
                      {b.initial}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold whitespace-nowrap">
                        {b.customer}
                      </p>
                      <p className="text-muted-foreground text-sm whitespace-nowrap">
                        {b.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm font-semibold whitespace-nowrap">
                  {b.agent}
                </td>
                <td className="px-5 py-4 text-sm font-semibold whitespace-nowrap">
                  {b.service}
                </td>
                <td className="px-5 py-4 text-sm font-semibold whitespace-nowrap">
                  {b.schedule}
                </td>
                <td className="px-5 py-4 text-sm font-semibold whitespace-nowrap tabular-nums">
                  {b.amount}
                </td>
                <td className="px-5 py-4 text-sm font-semibold whitespace-nowrap">
                  {b.plan}
                </td>
                <td className="px-5 py-4">
                  <PaymentStatusBadge payment={b.payment} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer: count + pagination */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-foreground text-sm">
          Showing {rangeStart}-{rangeEnd} of {BOOKINGS.length} bookings
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
