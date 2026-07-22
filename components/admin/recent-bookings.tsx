import Link from "next/link";

import {
  PaymentStatusBadge,
  type PaymentStatus,
} from "@/components/admin/payment-status-badge";
import { cn } from "@/lib/utils";

/**
 * Recent Bookings table for the Super Admin dashboard (Figma node 986:5611).
 *
 * Static visual mock — swap `ROWS` for the shape returned by the admin API
 * (see `lib/api/admin.ts` / `hooks/use-admin.ts`) when wiring to real data.
 */

type BookingRow = {
  id: string;
  customer: string;
  email: string;
  /** Single-letter avatar fallback + its background color. */
  initial: string;
  avatarColor: string;
  agent: string;
  service: string;
  schedule: string;
  amount: string;
  plan: string;
  payment: PaymentStatus;
};

const ROWS: BookingRow[] = [
  {
    id: "#BK-9078",
    customer: "Gavrial Carter",
    email: "gavrial4@gmail.com",
    initial: "G",
    avatarColor: "#22a35a",
    agent: "Green Blade Lawn",
    service: "Lawn Mowing",
    schedule: "Today-10:30 AM",
    amount: "$567",
    plan: "One-time",
    payment: "ongoing",
  },
  {
    id: "#BK-9078",
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
    id: "#BK-9078",
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
    id: "#BK-9078",
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
    id: "#BK-9078",
    customer: "Ivary Bennett",
    email: "ivary@gmail.com",
    initial: "I",
    avatarColor: "#2563eb",
    agent: "Yard Cleanup",
    service: "Yard Cleanup",
    schedule: "Yesterday-10:30 AM",
    amount: "$60",
    plan: "Monthly",
    payment: "completed",
  },
  {
    id: "#BK-9078",
    customer: "Rachel Nguyen",
    email: "rachel@gmail.com",
    initial: "R",
    avatarColor: "#ca8a04",
    agent: "Green Blade Lawn",
    service: "Fertilization",
    schedule: "Yesterday-2:30 PM",
    amount: "$630",
    plan: "One-time",
    payment: "ongoing",
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

export function RecentBookings() {
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
            {ROWS.map((row, i) => (
              <tr
                key={i}
                className={cn(
                  "align-middle",
                  i !== ROWS.length - 1 && "border-border border-b",
                )}
              >
                <td className="px-5 py-4 text-sm font-semibold whitespace-nowrap">
                  {row.id}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex size-10 shrink-0 items-center justify-center rounded-full text-base font-medium text-white"
                      style={{ backgroundColor: row.avatarColor }}
                    >
                      {row.initial}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold whitespace-nowrap">
                        {row.customer}
                      </p>
                      <p className="text-muted-foreground text-sm whitespace-nowrap">
                        {row.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm font-semibold whitespace-nowrap">
                  {row.agent}
                </td>
                <td className="px-5 py-4 text-sm font-semibold whitespace-nowrap">
                  {row.service}
                </td>
                <td className="px-5 py-4 text-sm font-semibold whitespace-nowrap">
                  {row.schedule}
                </td>
                <td className="px-5 py-4 text-sm font-semibold whitespace-nowrap tabular-nums">
                  {row.amount}
                </td>
                <td className="px-5 py-4 text-sm font-semibold whitespace-nowrap">
                  {row.plan}
                </td>
                <td className="px-5 py-4">
                  <PaymentStatusBadge payment={row.payment} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
