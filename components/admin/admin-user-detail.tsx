"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Ban, Clock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { RoleBadge } from "@/components/admin/role-badge";
import { BookingStatusBadge } from "@/components/dashboard/booking-status-badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAdminUser,
  useBanUser,
  useSetUserRole,
  useUnbanUser,
} from "@/hooks/use-admin";
import type { AdminRole } from "@/lib/api/admin";
import { ApiError } from "@/lib/api/http";
import { formatCents } from "@/lib/jobs";

const ROLES: { value: AdminRole; label: string }[] = [
  { value: "user", label: "Customer" },
  { value: "agent", label: "Agent" },
  { value: "admin", label: "Admin" },
];

function errMessage(err: unknown, fallback: string) {
  return err instanceof ApiError ? err.message : fallback;
}

export function AdminUserDetail() {
  const params = useParams<{ id: string }>();
  const userId = params.id;
  const { data: user, isLoading, isError } = useAdminUser(userId);

  const setRole = useSetUserRole(userId);
  const banUser = useBanUser(userId);
  const unbanUser = useUnbanUser(userId);

  const [showBanForm, setShowBanForm] = useState(false);
  const [banReason, setBanReason] = useState("");
  const [banDays, setBanDays] = useState("");

  if (isError) {
    return (
      <p className="text-destructive text-base">
        We couldn&apos;t load this user.
      </p>
    );
  }

  if (isLoading || !user) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-28 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  const handleRoleChange = (role: AdminRole) => {
    if (role === user.role) return;
    setRole.mutate(role, {
      onSuccess: () => toast.success(`Role updated to ${role}.`),
      onError: (e) => toast.error(errMessage(e, "Couldn't update role.")),
    });
  };

  const handleBan = () => {
    const days = banDays.trim() ? Number(banDays) : undefined;
    if (days !== undefined && (!Number.isInteger(days) || days < 1)) {
      toast.error("Duration must be a whole number of days.");
      return;
    }
    banUser.mutate(
      { reason: banReason.trim() || undefined, durationDays: days },
      {
        onSuccess: () => {
          toast.success("User banned.");
          setShowBanForm(false);
          setBanReason("");
          setBanDays("");
        },
        onError: (e) => toast.error(errMessage(e, "Couldn't ban user.")),
      },
    );
  };

  const handleUnban = () => {
    unbanUser.mutate(undefined, {
      onSuccess: () => toast.success("User unbanned."),
      onError: (e) => toast.error(errMessage(e, "Couldn't unban user.")),
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/admin/users"
        className="text-lawn-text-secondary hover:text-lawn-primary inline-flex w-fit items-center gap-1.5 text-sm font-medium tracking-tight"
      >
        <ArrowLeft className="size-4" /> Back to users
      </Link>

      {/* Identity + actions */}
      <div className="bg-lawn-bg-2 flex flex-col gap-5 rounded-2xl border border-[#cecece]/50 p-6 shadow-[0px_4px_16px_0px_rgba(74,74,74,0.08)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lawn-text-primary text-2xl font-bold tracking-tight">
                {user.name || "—"}
              </h2>
              <RoleBadge role={user.role} />
              {user.banned && (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">
                  <Ban className="size-3" /> Banned
                </span>
              )}
              {user.deletionScheduledAt && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                  <Clock className="size-3" /> Scheduled for deletion
                </span>
              )}
            </div>
            <p className="text-lawn-text-secondary mt-1 text-base tracking-tight">
              {user.email}
            </p>
            <p className="text-lawn-text-tertiary mt-0.5 text-sm tracking-tight">
              Joined {new Date(user.createdAt).toLocaleDateString()}
            </p>
            {user.deletionScheduledAt && (
              <p className="mt-1 text-sm font-medium tracking-tight text-amber-700">
                Deletion requested
                {user.deletionRequestedAt
                  ? ` ${new Date(user.deletionRequestedAt).toLocaleDateString()}`
                  : ""}
                {" · "}permanently deletes{" "}
                {new Date(user.deletionScheduledAt).toLocaleDateString()}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <label className="text-lawn-text-secondary text-sm font-medium tracking-tight">
              Role
            </label>
            <select
              value={user.role}
              disabled={setRole.isPending}
              onChange={(e) => handleRoleChange(e.target.value as AdminRole)}
              className="text-lawn-text-primary rounded-lg border border-[#cecece]/70 bg-white px-3 py-1.5 text-sm outline-none focus:border-lawn-primary/50 disabled:opacity-50"
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Agent payout status */}
        {user.role === "agent" && (
          <div className="flex items-center gap-2 rounded-xl bg-black/[0.03] px-4 py-3">
            <ShieldCheck
              className={
                user.payoutsEnabled ? "text-lawn-primary size-5" : "text-lawn-text-tertiary size-5"
              }
            />
            <p className="text-lawn-text-secondary text-sm tracking-tight">
              {user.payoutsEnabled
                ? "Payouts enabled — Stripe Connect onboarding complete."
                : user.stripeConnectAccountId
                  ? "Connect account created, payouts not yet enabled."
                  : "Not onboarded for payouts yet."}
            </p>
          </div>
        )}

        {/* Ban controls */}
        <div className="border-t border-[#cecece]/40 pt-4">
          {user.banned ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-lawn-text-secondary text-sm tracking-tight">
                {user.banReason && <p>Reason: {user.banReason}</p>}
                {user.banExpires ? (
                  <p>Expires {new Date(user.banExpires).toLocaleString()}</p>
                ) : (
                  <p>Permanent ban</p>
                )}
              </div>
              <Button
                variant="outline"
                size="lg"
                onClick={handleUnban}
                disabled={unbanUser.isPending}
              >
                {unbanUser.isPending ? "Unbanning…" : "Unban user"}
              </Button>
            </div>
          ) : user.role === "admin" ? (
            <p className="text-lawn-text-tertiary text-sm tracking-tight">
              Admins cannot be banned.
            </p>
          ) : showBanForm ? (
            <div className="flex flex-col gap-3">
              <input
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="Reason (optional)"
                className="text-lawn-text-primary w-full rounded-lg border border-[#cecece]/70 bg-white px-3 py-2 text-sm outline-none focus:border-lawn-primary/50"
              />
              <div className="flex flex-wrap items-center gap-3">
                <input
                  value={banDays}
                  onChange={(e) => setBanDays(e.target.value)}
                  inputMode="numeric"
                  placeholder="Days (blank = permanent)"
                  className="text-lawn-text-primary w-56 rounded-lg border border-[#cecece]/70 bg-white px-3 py-2 text-sm outline-none focus:border-lawn-primary/50"
                />
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    size="lg"
                    onClick={handleBan}
                    disabled={banUser.isPending}
                  >
                    {banUser.isPending ? "Banning…" : "Confirm ban"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={() => setShowBanForm(false)}
                    disabled={banUser.isPending}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <Button
              variant="destructive"
              size="lg"
              onClick={() => setShowBanForm(true)}
            >
              <Ban className="size-4" /> Ban user
            </Button>
          )}
        </div>
      </div>

      {/* Recent bookings */}
      <section className="flex flex-col gap-3">
        <h3 className="text-lawn-text-primary text-lg font-semibold tracking-tight">
          Recent bookings
        </h3>
        {user.bookings.length === 0 ? (
          <p className="text-lawn-text-secondary rounded-xl border border-[#cecece]/60 px-5 py-8 text-center text-sm">
            No bookings.
          </p>
        ) : (
          <div className="bg-lawn-bg-2 overflow-hidden rounded-xl border border-[#cecece]/50">
            {user.bookings.map((b, i) => (
              <Link
                key={b.id}
                href={`/admin/bookings/${b.id}`}
                className={
                  "flex items-center gap-4 px-5 py-3.5 transition hover:bg-black/[0.02] " +
                  (i !== user.bookings.length - 1
                    ? "border-b border-[#cecece]/40"
                    : "")
                }
              >
                <div className="min-w-0 flex-1">
                  <p className="text-lawn-text-primary truncate text-sm font-semibold tracking-tight">
                    {b.title}{" "}
                    <span className="text-lawn-text-tertiary font-normal">
                      {b.reference}
                    </span>
                  </p>
                  <p className="text-lawn-text-secondary truncate text-sm tracking-tight">
                    {b.address}
                  </p>
                </div>
                <span className="text-lawn-text-primary hidden text-sm font-semibold tracking-tight sm:inline">
                  {formatCents(b.totalPerVisit * 100)}
                </span>
                <BookingStatusBadge status={b.status} />
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
