"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Briefcase,
  CheckCircle2,
  MoreHorizontal,
  Plus,
  Search,
  UserPlus,
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
import { useAdminAgents } from "@/hooks/use-admin";
import type { AdminAgent } from "@/lib/api/admin";
import { cn } from "@/lib/utils";

/**
 * Super Admin → Agent screen (Figma node 1089:3891).
 *
 * Wired to the live admin API (`useAdminAgents` → `GET /admin/agents`). The list
 * is returned unpaginated, so search and paging happen client-side. Status, job
 * counts and joined date come from the API; Contact, Service Area and Revenue
 * are designed columns the API doesn't expose yet, so they render an empty "—"
 * placeholder. The row actions and the Invite agent flow are both live.
 */

const COLUMNS = [
  "Agent",
  "Contact",
  "Service Area",
  "Status",
  "Active Jobs",
  "Total Jobs",
  "Revenue",
  "Joined",
] as const;
const PAGE_SIZE = 8;

// Placeholder for a designed column whose data the API doesn't expose yet.
const Empty = () => <span className="text-muted-foreground">—</span>;

function formatJoined(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Derive a human status from the two onboarding booleans the API exposes.
function agentStatus(agent: AdminAgent): { label: string; className: string } {
  if (agent.payoutsEnabled) {
    return { label: "Active", className: "bg-lawn-badge-bg text-lawn-primary" };
  }
  if (agent.onboarded) {
    return { label: "Onboarding", className: "bg-[#fef3c7] text-[#b45309]" };
  }
  return { label: "Invited", className: "bg-[#dbeafe] text-[#1d4ed8]" };
}

export function AdminAgents() {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useAdminAgents();

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

  const agents = useMemo(() => data ?? [], [data]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return agents;
    return agents.filter(
      (a) => a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q),
    );
  }, [agents, query]);

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

  // No agents exist at all (not just filtered out) — show the onboarding CTA.
  const isEmpty = !isLoading && !isError && agents.length === 0;

  return (
    <DashboardPanel
      title="Agent"
      subtitle="Manage all registered service providers across the marketplace."
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
            We couldn&apos;t load agents.
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
          <p className="text-foreground text-base font-semibold">No agents yet</p>
          <p className="text-muted-foreground max-w-sm text-sm">
            Invite your first lawn care agent to start assigning jobs and building out the
            marketplace.
          </p>
          <button
            type="button"
            onClick={() => setInviteOpen(true)}
            className="lawn-gradient-btn mt-2 inline-flex h-11 items-center gap-2 rounded-xl px-5 text-sm font-semibold text-white shadow-[0px_5px_10px_0px_rgba(25,81,52,0.25)] transition-transform active:scale-[0.98]"
          >
            <UserPlus className="size-[18px]" />
            Invite agent
          </button>
        </div>
      ) : (
        <>
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
                placeholder="Search agents.."
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
                ) : rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={COLUMNS.length + 1}
                      className="text-muted-foreground px-5 py-12 text-center text-sm"
                    >
                      No agents match your search.
                    </td>
                  </tr>
                ) : (
                  rows.map((a, i) => {
                    const status = agentStatus(a);
                    return (
                      <tr
                        key={a.id}
                        className={cn(
                          "align-middle",
                          i !== rows.length - 1 && "border-border border-b",
                        )}
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <span
                              className="flex size-10 shrink-0 items-center justify-center rounded-full text-base font-medium text-white uppercase"
                              style={{ backgroundColor: avatarColor(a.id) }}
                            >
                              {getInitials(a.name, a.email)}
                            </span>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold whitespace-nowrap">
                                {a.name || "Unnamed agent"}
                              </p>
                              <p className="text-muted-foreground text-sm whitespace-nowrap">
                                {a.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        {/* Contact — not exposed by the agents API yet. */}
                        <td className="px-5 py-4 text-sm whitespace-nowrap">
                          <Empty />
                        </td>
                        {/* Service Area — not exposed by the agents API yet. */}
                        <td className="px-5 py-4 text-sm whitespace-nowrap">
                          <Empty />
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
                          {a.activeJobs}
                        </td>
                        <td className="px-5 py-4 text-sm font-semibold whitespace-nowrap tabular-nums">
                          {a.totalJobs}
                        </td>
                        {/* Revenue — not exposed by the agents API yet. */}
                        <td className="px-5 py-4 text-sm whitespace-nowrap tabular-nums">
                          <Empty />
                        </td>
                        <td className="px-5 py-4 text-sm font-semibold whitespace-nowrap">
                          {formatJoined(a.createdAt)}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              aria-label={`Actions for ${a.name || a.email}`}
                              className="text-muted-foreground hover:bg-accent/60 hover:text-foreground inline-flex size-8 items-center justify-center rounded-md transition-colors outline-none"
                            >
                              <MoreHorizontal className="size-5" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => router.push(`/admin/users/${a.id}`)}
                              >
                                <UserRound />
                                View profile
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => router.push(`/admin/jobs?agentId=${a.id}`)}
                              >
                                <Briefcase />
                                View jobs
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
            <p className="text-foreground text-sm">
              {isLoading
                ? "Loading agents…"
                : `Showing ${rangeStart}-${rangeEnd} of ${filtered.length} agent${
                    filtered.length === 1 ? "" : "s"
                  }`}
            </p>
            <AdminPagination
              page={current}
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
