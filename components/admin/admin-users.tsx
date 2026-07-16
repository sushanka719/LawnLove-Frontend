"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Search, Ban } from "lucide-react";

import { Pagination } from "@/components/dashboard/pagination";
import { RoleBadge } from "@/components/admin/role-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminUsers } from "@/hooks/use-admin";
import type { AdminRole } from "@/lib/api/admin";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;

const ROLE_FILTERS: { label: string; value: AdminRole | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Customers", value: "user" },
  { label: "Agents", value: "agent" },
  { label: "Admins", value: "admin" },
];

export function AdminUsers() {
  const [rawQuery, setRawQuery] = useState("");
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<AdminRole | "all">("all");
  const [page, setPage] = useState(1);

  // Debounce the search box so we don't fire a request per keystroke.
  useEffect(() => {
    const t = setTimeout(() => {
      setQuery(rawQuery.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [rawQuery]);

  const { data, isLoading, isError, isPlaceholderData } = useAdminUsers({
    query: query || undefined,
    role: role === "all" ? undefined : role,
    page,
    pageSize: PAGE_SIZE,
  });

  const users = data?.items ?? [];

  return (
    <section className="flex flex-col gap-5">
      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="text-lawn-text-tertiary absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <input
            value={rawQuery}
            onChange={(e) => setRawQuery(e.target.value)}
            placeholder="Search name or email"
            className="text-lawn-text-primary w-full rounded-xl border border-[#cecece]/70 bg-white py-2.5 pr-3 pl-9 text-sm outline-none focus:border-lawn-primary/50"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {ROLE_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => {
                setRole(f.value);
                setPage(1);
              }}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm font-medium tracking-tight transition-colors",
                role === f.value
                  ? "bg-lawn-primary text-white"
                  : "text-lawn-text-secondary bg-black/[0.04] hover:bg-black/[0.07]",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {isError ? (
        <p className="text-destructive text-base">
          We couldn&apos;t load users. Please refresh and try again.
        </p>
      ) : isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <p className="text-lawn-text-secondary rounded-xl border border-[#cecece]/60 px-5 py-10 text-center text-base">
          No users match your filters.
        </p>
      ) : (
        <div className="bg-lawn-bg-2 overflow-hidden rounded-xl shadow-[0px_4px_16px_0px_rgba(74,74,74,0.1)]">
          {users.map((u, i) => (
            <Link
              key={u.id}
              href={`/admin/users/${u.id}`}
              className={cn(
                "flex items-center gap-4 px-5 py-4 transition hover:bg-black/[0.02]",
                i !== users.length - 1 && "border-b border-[#cecece]/40",
              )}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-lawn-text-primary truncate text-base font-semibold tracking-tight">
                    {u.name || "—"}
                  </p>
                  <RoleBadge role={u.role} />
                  {u.banned && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                      <Ban className="size-3" /> Banned
                    </span>
                  )}
                </div>
                <p className="text-lawn-text-secondary truncate text-sm tracking-tight">
                  {u.email}
                </p>
              </div>
              <div className="text-lawn-text-tertiary hidden shrink-0 text-right text-sm tracking-tight sm:block">
                <p>{u.bookingsCount} bookings</p>
                {u.role === "agent" && <p>{u.jobsCount} jobs</p>}
              </div>
              <ChevronRight
                className="text-lawn-text-secondary size-5 shrink-0"
                strokeWidth={1.75}
              />
            </Link>
          ))}
        </div>
      )}

      <Pagination
        page={page}
        totalPages={data?.totalPages ?? 1}
        onPageChange={setPage}
        disabled={isPlaceholderData}
      />
    </section>
  );
}
