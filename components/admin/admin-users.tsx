"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  CheckCircle2,
  MapPin,
  MoreHorizontal,
  Plus,
  Search,
  UserRound,
  Users,
} from "lucide-react";

import { AdminPagination } from "@/components/admin/admin-pagination";
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";
import { InviteAgentModal } from "@/components/admin/invite-agent-modal";
import { avatarColor, getInitials } from "@/components/dashboard/user-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminUsers } from "@/hooks/use-admin";
import type { AdminUserListItem } from "@/lib/api/admin";
import { cn } from "@/lib/utils";

/**
 * Super Admin → Customer screen (Figma node 1021:2083).
 *
 * Wired to the live admin API (`useAdminUsers` → `GET /admin/users`) filtered to
 * customers (role "user"). Search and paging are server-side. "Location" shows
 * the customer's default saved address. Total Spend and Last Booking are
 * designed columns the API doesn't expose yet, so they render an empty "—"
 * placeholder. The row actions and the Invite agent flow are both live.
 */

const COLUMNS = [
  "Customer",
  "Location",
  "Status",
  "Bookings",
  "Total Spend",
  "Last Booking",
  "Joined",
] as const;
const PAGE_SIZE = 8;

// Placeholder for a designed column whose data the API doesn't expose yet.
const Empty = () => <span className="text-muted-foreground">—</span>;

// A saved address can be a long free-text line, so cap it in the table cell and
// keep the full value in a title tooltip.
const MAX_LOCATION_CHARS = 28;

function truncateLocation(value: string): string {
  return value.length > MAX_LOCATION_CHARS
    ? `${value.slice(0, MAX_LOCATION_CHARS).trimEnd()}…`
    : value;
}

function formatJoined(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Derive a human status from the account flags the API exposes.
function customerStatus(u: AdminUserListItem): { label: string; className: string } {
  if (u.banned) {
    return { label: "Banned", className: "bg-red-100 text-red-700" };
  }
  if (u.deletionScheduledAt) {
    return { label: "Deletion pending", className: "bg-[#fef3c7] text-[#b45309]" };
  }
  return { label: "Active", className: "bg-lawn-badge-bg text-lawn-primary" };
}

export function AdminUsers() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [toast, setToast] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  // Debounce the search so we don't fire a request on every keystroke; a new
  // search always resets to page 1.
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedQuery(query.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const { data, isLoading, isError, isPlaceholderData, refetch } = useAdminUsers({
    query: debouncedQuery || undefined,
    role: "user",
    page,
    pageSize: PAGE_SIZE,
  });

  const users = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;
  const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = (page - 1) * PAGE_SIZE + users.length;

  const handleSent = (email: string) => {
    setInviteOpen(false);
    setToast(email ? `Invitation sent to ${email}` : "Invitation sent");
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2600);
  };

  // No customers exist at all (not just filtered out by a search).
  const isEmpty = !isLoading && !isError && !debouncedQuery && total === 0;

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
      {isError ? (
        <div className="border-border flex flex-col items-center gap-3 rounded-xl border px-6 py-16 text-center">
          <p className="text-foreground text-sm font-semibold">
            We couldn&apos;t load customers.
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
            <Users className="size-7" />
          </span>
          <p className="text-foreground text-base font-semibold">No customers yet</p>
          <p className="text-muted-foreground max-w-sm text-sm">
            Customers will appear here once people sign up and start booking lawn
            services.
          </p>
        </div>
      ) : (
        <>
          {/* Search */}
          <div>
            <div className="border-border relative w-full max-w-[432px] rounded-[10px] border">
              <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
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
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr
                      key={i}
                      className={cn("align-middle", i !== 5 && "border-border border-b")}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Skeleton className="size-10 shrink-0 rounded-full" />
                          <div className="flex flex-col gap-1.5">
                            <Skeleton className="h-3.5 w-32" />
                            <Skeleton className="h-3 w-40" />
                          </div>
                        </div>
                      </td>
                      {Array.from({ length: COLUMNS.length - 1 }).map((_, j) => (
                        <td key={j} className="px-5 py-4">
                          <Skeleton className="h-3.5 w-16" />
                        </td>
                      ))}
                      <td className="px-5 py-4" />
                    </tr>
                  ))
                ) : users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={COLUMNS.length + 1}
                      className="text-muted-foreground px-5 py-12 text-center text-sm"
                    >
                      No customers match your search.
                    </td>
                  </tr>
                ) : (
                  users.map((u, i) => {
                    const status = customerStatus(u);
                    return (
                      <tr
                        key={u.id}
                        className={cn(
                          "align-middle",
                          i !== users.length - 1 && "border-border border-b",
                        )}
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <span
                              className="flex size-10 shrink-0 items-center justify-center rounded-full text-base font-medium text-white uppercase"
                              style={{ backgroundColor: avatarColor(u.id) }}
                            >
                              {getInitials(u.name, u.email)}
                            </span>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold whitespace-nowrap">
                                {u.name || "Unnamed customer"}
                              </p>
                              <p className="text-muted-foreground text-sm whitespace-nowrap">
                                {u.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm whitespace-nowrap">
                          {u.location ? (
                            <span
                              title={u.location}
                              className="text-foreground inline-flex items-center gap-1.5 font-semibold"
                            >
                              <MapPin className="text-muted-foreground size-4 shrink-0" />
                              {truncateLocation(u.location)}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">
                              No address on file
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={cn(
                              "inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-tight",
                              status.className,
                            )}
                          >
                            {status.label}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm font-semibold whitespace-nowrap tabular-nums">
                          {u.bookingsCount}
                        </td>
                        {/* Total Spend — not exposed by the users API yet. */}
                        <td className="px-5 py-4 text-sm whitespace-nowrap tabular-nums">
                          <Empty />
                        </td>
                        {/* Last Booking — not exposed by the users API yet. */}
                        <td className="px-5 py-4 text-sm whitespace-nowrap">
                          <Empty />
                        </td>
                        <td className="px-5 py-4 text-sm font-semibold whitespace-nowrap">
                          {formatJoined(u.createdAt)}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              aria-label={`Actions for ${u.name || u.email}`}
                              className="text-muted-foreground hover:bg-accent/60 hover:text-foreground inline-flex size-8 items-center justify-center rounded-md transition-colors outline-none"
                            >
                              <MoreHorizontal className="size-5" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => router.push(`/admin/users/${u.id}`)}
                              >
                                <UserRound />
                                View profile
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer: count + pagination */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p
              className={cn("text-foreground text-sm", isPlaceholderData && "opacity-60")}
            >
              {isLoading
                ? "Loading customers…"
                : `Showing ${rangeStart}-${rangeEnd} of ${total} customer${
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
