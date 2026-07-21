"use client";

import { useState } from "react";
import Link from "next/link";
import { Leaf } from "lucide-react";

import { BookingStatusBadge } from "@/components/dashboard/booking-status-badge";
import { ChangePasswordDialog } from "@/components/dashboard/change-password-dialog";
import { DeleteAccountDialog } from "@/components/dashboard/delete-account-dialog";
import { Toggle } from "@/components/dashboard/toggle";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAccountSettings,
  useCancelAccountDeletion,
  useUpdateNotifications,
} from "@/hooks/use-account";
import { useCurrentPlans } from "@/hooks/use-bookings";
import type { NotificationPreferences } from "@/lib/api/account";
import type { CurrentPlan } from "@/lib/api/booking";
import { formatCents } from "@/lib/jobs";

function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lawn-text-primary text-xl font-semibold tracking-tight">
        {title}
      </h2>
      <div className="flex flex-col gap-6">{children}</div>
    </section>
  );
}

function SettingRow({
  title,
  description,
  badge,
  control,
}: {
  title: string;
  description: string;
  badge?: React.ReactNode;
  control: React.ReactNode;
}) {
  return (
    <div className="bg-lawn-bg-2 flex items-center gap-6 rounded-xl p-6 drop-shadow-[0px_4px_8px_rgba(74,74,74,0.14)] lg:p-8">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-lawn-text-primary text-lg font-semibold tracking-tight">
            {title}
          </p>
          {badge}
        </div>
        <p className="text-lawn-text-secondary text-base font-medium tracking-tight">
          {description}
        </p>
      </div>
      {control}
    </div>
  );
}

// ---- Notifications -------------------------------------------------------

function NotificationsSection() {
  const { data, isLoading, isError } = useAccountSettings();
  const update = useUpdateNotifications();
  const prefs = data?.notifications;

  const setPref = (key: keyof NotificationPreferences) => (next: boolean) =>
    update.mutate({ [key]: next });

  return (
    <SettingsSection title="Notifications">
      {isError && (
        <p className="text-destructive text-sm">
          We couldn&apos;t load your notification preferences. Please refresh.
        </p>
      )}
      <SettingRow
        title="Email reminders"
        description="Get a note before each scheduled visit"
        control={
          <Toggle
            label="Email reminders"
            checked={prefs?.emailReminders ?? false}
            onChange={setPref("emailReminders")}
            disabled={isLoading || isError}
          />
        }
      />
      <SettingRow
        title={'SMS "on the way" alerts'}
        description="Text me when my pro is en route"
        badge={
          <span className="rounded-full bg-black/[0.06] px-2 py-0.5 text-xs font-semibold tracking-tight text-lawn-text-tertiary">
            Coming soon
          </span>
        }
        control={
          <Toggle
            label="SMS on the way alerts"
            checked={prefs?.smsOnTheWayAlerts ?? false}
            disabled
          />
        }
      />
      <SettingRow
        title="Promotions & offers"
        description="Occasional deals and seasonal tips"
        control={
          <Toggle
            label="Promotions and offers"
            checked={prefs?.promotionalEmails ?? false}
            onChange={setPref("promotionalEmails")}
            disabled={isLoading || isError}
          />
        }
      />
    </SettingsSection>
  );
}

// ---- Plan ----------------------------------------------------------------

function PlanCard({ plan }: { plan: CurrentPlan }) {
  return (
    <div className="bg-lawn-bg-2 flex items-center gap-6 rounded-xl p-6 drop-shadow-[0px_4px_8px_rgba(74,74,74,0.14)] lg:p-8">
      <div className="bg-lawn-badge-bg hidden size-12 shrink-0 items-center justify-center rounded-xl sm:flex">
        <Leaf className="text-lawn-primary size-5" strokeWidth={1.75} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-lawn-text-primary text-lg font-semibold tracking-tight">
            {plan.title}
          </p>
          <span className="text-lawn-text-tertiary text-xs font-medium tracking-tight">
            {plan.reference}
          </span>
          <BookingStatusBadge status={plan.status} />
        </div>
        <p className="text-lawn-text-secondary text-base font-medium tracking-tight">
          {formatCents(plan.totalPerVisit * 100)} per visit
        </p>
        <p className="text-lawn-text-tertiary truncate text-sm tracking-tight">
          {plan.address}
        </p>
      </div>
      <Link
        href={`/dashboard/bookings/${plan.id}`}
        className="border-lawn-primary-light text-lawn-primary hover:bg-lawn-primary-light/10 shrink-0 rounded-xl border-[1.2px] px-8 py-3 text-base font-semibold tracking-tight whitespace-nowrap transition-colors"
      >
        Manage
      </Link>
    </div>
  );
}

function PlanSection() {
  const { data: plans, isLoading, isError } = useCurrentPlans();

  return (
    <SettingsSection title="Plan">
      {isError ? (
        <p className="text-destructive text-sm">
          We couldn&apos;t load your plan. Please refresh and try again.
        </p>
      ) : isLoading ? (
        <Skeleton className="h-28 w-full rounded-xl" />
      ) : !plans || plans.length === 0 ? (
        <div className="border-lawn-primary-light/40 flex flex-col items-start gap-3 rounded-xl border border-dashed bg-lawn-bg-2 p-6 lg:p-8">
          <div>
            <p className="text-lawn-text-primary text-lg font-semibold tracking-tight">
              No active plan
            </p>
            <p className="text-lawn-text-secondary text-base font-medium tracking-tight">
              You don&apos;t have a recurring plan yet. Book a visit to get
              started.
            </p>
          </div>
          <Link
            href="/booking/address"
            className="lawn-gradient-btn rounded-xl px-8 py-3 text-base font-semibold tracking-tight whitespace-nowrap text-white shadow-[0px_5px_10px_0px_rgba(0,0,0,0.25)] transition-opacity hover:opacity-90"
          >
            Browse plans
          </Link>
        </div>
      ) : (
        plans.map((plan) => <PlanCard key={plan.id} plan={plan} />)
      )}
    </SettingsSection>
  );
}

// ---- Security ------------------------------------------------------------

function SecuritySection() {
  const { data } = useAccountSettings();
  const cancelDeletion = useCancelAccountDeletion();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const deletion = data?.deletion;
  const scheduledAt = deletion?.scheduledAt ?? null;

  return (
    <SettingsSection title="Security">
      <SettingRow
        title="Password"
        description="Update the password you use to sign in"
        control={
          <button
            type="button"
            onClick={() => setShowPasswordDialog(true)}
            className="border-lawn-primary-light text-lawn-primary hover:bg-lawn-primary-light/10 shrink-0 rounded-xl border-[1.2px] px-8 py-3 text-base font-semibold tracking-tight whitespace-nowrap transition-colors"
          >
            Change password
          </button>
        }
      />

      {scheduledAt ? (
        <div className="flex flex-col gap-3 rounded-xl border border-[#e02929] bg-[#fee2e2] p-6 lg:p-8">
          <div className="text-[#e02929]">
            <p className="text-lg font-semibold tracking-tight">
              Account scheduled for deletion
            </p>
            <p className="text-base font-medium tracking-tight">
              Your account and data will be permanently removed on{" "}
              {new Date(scheduledAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              . Cancel below to keep your account.
            </p>
          </div>
          <button
            type="button"
            onClick={() => cancelDeletion.mutate()}
            disabled={cancelDeletion.isPending}
            className="w-fit rounded-xl bg-white px-8 py-3 text-base font-semibold tracking-tight whitespace-nowrap text-[#e02929] shadow-[0px_5px_5px_0px_rgba(0,0,0,0.1)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelDeletion.isPending ? "Cancelling..." : "Cancel deletion"}
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-6 rounded-xl border border-[#e02929] bg-[#fee2e2] p-6 lg:p-8">
          <div className="min-w-0 flex-1 text-[#e02929]">
            <p className="text-lg font-semibold tracking-tight">Delete account</p>
            <p className="text-base font-medium tracking-tight">
              Permanently remove your account and data
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowDeleteDialog(true)}
            className="shrink-0 rounded-xl bg-[#e02929] px-8 py-3 text-base font-semibold tracking-tight whitespace-nowrap text-white shadow-[0px_5px_5px_0px_rgba(0,0,0,0.25)] transition-opacity hover:opacity-90"
          >
            Delete
          </button>
        </div>
      )}

      <ChangePasswordDialog
        open={showPasswordDialog}
        onOpenChange={setShowPasswordDialog}
      />
      <DeleteAccountDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        graceDays={deletion?.graceDays ?? 30}
      />
    </SettingsSection>
  );
}

export function SettingsContent() {
  return (
    <>
      <NotificationsSection />
      <PlanSection />
      <SecuritySection />
    </>
  );
}
