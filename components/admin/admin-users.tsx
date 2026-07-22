"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Bell, CheckCircle2, MoreHorizontal, Plus, Search } from "lucide-react";

import { AdminPagination } from "@/components/admin/admin-pagination";
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";
import { InviteAgentModal } from "@/components/admin/invite-agent-modal";
import { cn } from "@/lib/utils";

/**
 * Super Admin → Customer screen (Figma node 1021:2083).
 *
 * Visual mock — the table rows are placeholder data. The admin API
 * (`getAdminUsers`) does not yet expose Location / Total Spend / Last Booking,
 * so swap `CUSTOMERS` for the real shape once those fields exist. The Invite
 * agent flow IS live (wired to `InviteAgentModal` → `useInviteAgent`).
 */

type Customer = {
  id: string;
  name: string;
  email: string;
  initial: string;
  avatarColor: string;
  location: string;
  bookings: string;
  totalSpend: string;
  lastBooking: string;
  joined: string;
};

const CUSTOMERS: Customer[] = [
  {
    id: "1",
    name: "Gavrial Carter",
    email: "gavrial4@gmail.com",
    initial: "G",
    avatarColor: "#4f46e5",
    location: "Austin Metro, TX",
    bookings: "32",
    totalSpend: "$5675",
    lastBooking: "Today",
    joined: "January 14, 2026",
  },
  {
    id: "2",
    name: "Raymond Patel",
    email: "raymond@gmail.com",
    initial: "R",
    avatarColor: "#9333ea",
    location: "Dallas Metro, TX",
    bookings: "03",
    totalSpend: "$110",
    lastBooking: "1 week ago",
    joined: "March 09, 2026",
  },
  {
    id: "3",
    name: "Monica Walsh",
    email: "monicaw@gmail.com",
    initial: "M",
    avatarColor: "#d97706",
    location: "Phoenix Metro, AZ",
    bookings: "12",
    totalSpend: "$67",
    lastBooking: "Yesterday",
    joined: "January 02, 2026",
  },
  {
    id: "4",
    name: "Daniel Foster",
    email: "daniel@gmail.com",
    initial: "D",
    avatarColor: "#0d9488",
    location: "Tampa Metro, FL",
    bookings: "10",
    totalSpend: "$789",
    lastBooking: "4 days ago",
    joined: "June 12, 2026",
  },
  {
    id: "5",
    name: "Ivary Bennett",
    email: "ivary@gmail.com",
    initial: "I",
    avatarColor: "#0e7490",
    location: "Columbus Metro, OH",
    bookings: "11",
    totalSpend: "$600",
    lastBooking: "3 days ago",
    joined: "July 14, 2026",
  },
  {
    id: "6",
    name: "Rachel Nguyen",
    email: "rachel@gmail.com",
    initial: "R",
    avatarColor: "#ca8a04",
    location: "Denver Metro, CO",
    bookings: "18",
    totalSpend: "$630",
    lastBooking: "1 week ago",
    joined: "March 09, 2026",
  },
  {
    id: "7",
    name: "Rachel Nguyen",
    email: "rachel@gmail.com",
    initial: "R",
    avatarColor: "#ca8a04",
    location: "Denver Metro, CO",
    bookings: "18",
    totalSpend: "$630",
    lastBooking: "1 week ago",
    joined: "June 08, 2026",
  },
  {
    id: "8",
    name: "Rachel Nguyen",
    email: "rachel@gmail.com",
    initial: "R",
    avatarColor: "#ca8a04",
    location: "Denver Metro, CO",
    bookings: "18",
    totalSpend: "$630",
    lastBooking: "Yesterday",
    joined: "June 12, 2026",
  },
  {
    id: "9",
    name: "Marcus Lee",
    email: "marcus@gmail.com",
    initial: "M",
    avatarColor: "#4f46e5",
    location: "Seattle Metro, WA",
    bookings: "24",
    totalSpend: "$1240",
    lastBooking: "2 days ago",
    joined: "February 20, 2026",
  },
  {
    id: "10",
    name: "Priya Nair",
    email: "priya@gmail.com",
    initial: "P",
    avatarColor: "#9333ea",
    location: "Charlotte Metro, NC",
    bookings: "15",
    totalSpend: "$980",
    lastBooking: "5 days ago",
    joined: "April 11, 2026",
  },
  {
    id: "11",
    name: "Andre Willis",
    email: "andre@gmail.com",
    initial: "A",
    avatarColor: "#0d9488",
    location: "Atlanta Metro, GA",
    bookings: "27",
    totalSpend: "$2115",
    lastBooking: "Today",
    joined: "May 03, 2026",
  },
  {
    id: "12",
    name: "Sofia Ramos",
    email: "sofia@gmail.com",
    initial: "S",
    avatarColor: "#d97706",
    location: "Miami Metro, FL",
    bookings: "09",
    totalSpend: "$540",
    lastBooking: "1 week ago",
    joined: "June 27, 2026",
  },
];

const COLUMNS = [
  "Customer",
  "Location",
  "Bookings",
  "Total Spend",
  "Last Booking",
  "Joined",
] as const;
const PAGE_SIZE = 8;

export function AdminUsers() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [toast, setToast] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CUSTOMERS;
    return CUSTOMERS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q),
    );
  }, [query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const start = (current - 1) * PAGE_SIZE;
  const rows = filtered.slice(start, start + PAGE_SIZE);
  const rangeStart = filtered.length === 0 ? 0 : start + 1;
  const rangeEnd = start + rows.length;

  const handleSent = (email: string) => {
    setInviteOpen(false);
    setToast(email ? `Invitation sent to ${email}` : "Invitation sent");
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2600);
  };

  return (
    <DashboardPanel
      title="Customer"
      subtitle="View and manage everyone booking lawn services on the platform."
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
      {/* Search */}
      <div>
        <div className="border-border relative w-full max-w-[432px] rounded-[10px] border">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search customers.."
            className="text-foreground placeholder:text-muted-foreground h-12 w-full rounded-[10px] bg-transparent pr-4 pl-11 text-sm outline-none"
          />
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
              <th className="w-16 px-5 py-4" aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={COLUMNS.length + 1}
                  className="text-muted-foreground px-5 py-12 text-center text-sm"
                >
                  No customers match your search.
                </td>
              </tr>
            ) : (
              rows.map((c, i) => (
                <tr
                  key={c.id}
                  className={cn(
                    "align-middle",
                    i !== rows.length - 1 && "border-border border-b",
                  )}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span
                        className="flex size-10 shrink-0 items-center justify-center rounded-full text-base font-medium text-white"
                        style={{ backgroundColor: c.avatarColor }}
                      >
                        {c.initial}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold whitespace-nowrap">
                          {c.name}
                        </p>
                        <p className="text-muted-foreground text-sm whitespace-nowrap">
                          {c.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold whitespace-nowrap">
                    {c.location}
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold whitespace-nowrap tabular-nums">
                    {c.bookings}
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold whitespace-nowrap tabular-nums">
                    {c.totalSpend}
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold whitespace-nowrap">
                    {c.lastBooking}
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold whitespace-nowrap">
                    {c.joined}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      aria-label={`Actions for ${c.name}`}
                      className="text-muted-foreground hover:bg-accent/60 hover:text-foreground inline-flex size-8 items-center justify-center rounded-md transition-colors"
                    >
                      <MoreHorizontal className="size-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer: count + pagination */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-foreground text-sm">
          Showing {rangeStart}-{rangeEnd} of {filtered.length} customers
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
