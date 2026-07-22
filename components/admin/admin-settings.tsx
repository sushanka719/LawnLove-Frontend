"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, CheckCircle2, ChevronDown, Plus } from "lucide-react";

import { InviteAgentModal } from "@/components/admin/invite-agent-modal";
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";
import { cn } from "@/lib/utils";

/**
 * Super Admin → Settings screen (Figma nodes 1071:1249 + 1080:4471).
 *
 * Visual mock — form fields, the payouts toggle, and the schedule dropdown only
 * hold local state; "Save and continue" toasts. Wire to a settings API when it
 * exists. The Invite agent flow IS live (`InviteAgentModal` → `useInviteAgent`).
 */

type Tab = "general" | "payments";

const TABS: { id: Tab; label: string }[] = [
  { id: "general", label: "General" },
  { id: "payments", label: "Payments" },
];

const SCHEDULES = ["Daily", "Weekly", "Monthly"] as const;

const inputClass =
  "border-border text-foreground placeholder:text-muted-foreground w-full rounded-[10px] border bg-transparent px-4 py-3 text-sm outline-none focus:border-primary/50";

/** 51×31 pill switch — ON is forest green with the knob to the right. */
function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-[31px] w-[51px] shrink-0 rounded-full transition-colors",
        checked ? "bg-primary" : "bg-muted-foreground/40",
      )}
    >
      <span
        className={cn(
          "absolute top-[2px] size-[27px] rounded-full bg-white shadow-sm transition-all",
          checked ? "left-[22px]" : "left-[2px]",
        )}
      />
    </button>
  );
}

export function AdminSettings() {
  const [tab, setTab] = useState<Tab>("general");
  const [autoPayouts, setAutoPayouts] = useState(true);
  const [schedule, setSchedule] = useState<(typeof SCHEDULES)[number]>("Weekly");
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

  const handleSent = (email: string) => {
    setInviteOpen(false);
    showToast(email ? `Invitation sent to ${email}` : "Invitation sent");
  };

  const SaveButton = (
    <button
      type="button"
      onClick={() => showToast("Settings saved")}
      className="lawn-gradient-btn inline-flex items-center justify-center rounded-xl px-8 py-3 text-sm font-semibold text-white shadow-[0px_5px_10px_0px_rgba(25,81,52,0.25)] transition-transform active:scale-[0.98]"
    >
      Save and continue
    </button>
  );

  return (
    <DashboardPanel
      title="Settings"
      subtitle="Manage your platform configuration, payments, and team."
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
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        {/* Tab rail */}
        <nav className="flex shrink-0 flex-row gap-2 lg:w-[280px] lg:flex-col">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              aria-current={tab === t.id ? "page" : undefined}
              className={cn(
                "rounded-lg px-3 py-3 text-left text-sm font-medium transition-colors",
                tab === t.id
                  ? "bg-accent text-primary"
                  : "text-foreground/80 hover:bg-accent/50",
              )}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {/* Panel */}
        <div className="border-border flex-1 rounded-xl border p-6 lg:p-8">
          {tab === "general" ? (
            <div className="flex flex-col gap-6">
              <h2 className="text-lg font-semibold tracking-[-0.01em]">General</h2>
              <div className="flex flex-col gap-3.5">
                <input className={inputClass} placeholder="Platform Name" />
                <input className={inputClass} placeholder="Support Email" />
              </div>
              <div>{SaveButton}</div>
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              {/* Commission & Fees */}
              <div className="border-border flex flex-col gap-6 border-b pb-8">
                <div className="flex flex-col gap-1.5">
                  <h2 className="text-lg font-semibold tracking-[-0.01em]">
                    Commission &amp; Fees
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    The platform&apos;s cut on every completed booking.
                  </p>
                </div>
                <div className="flex flex-col gap-3.5">
                  <input className={inputClass} placeholder="Platform Name" />
                  <input className={inputClass} placeholder="Support Email" />
                </div>
              </div>

              {/* Payouts */}
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-1.5">
                  <h2 className="text-lg font-semibold tracking-[-0.01em]">Payouts</h2>
                  <p className="text-muted-foreground text-sm">
                    How and when agents get paid.
                  </p>
                </div>

                <div className="flex flex-col gap-5">
                  <div className="flex items-center gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] font-semibold">Automatic payouts</p>
                      <p className="text-muted-foreground text-sm">
                        Release earnings on a fixed schedule without manual review.
                      </p>
                    </div>
                    <Toggle
                      checked={autoPayouts}
                      onChange={setAutoPayouts}
                      label="Automatic payouts"
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] font-semibold">Payout schedule</p>
                      <p className="text-muted-foreground text-sm">
                        Frequency for automatic transfers.
                      </p>
                    </div>
                    <div className="relative shrink-0">
                      <select
                        value={schedule}
                        onChange={(e) =>
                          setSchedule(e.target.value as (typeof SCHEDULES)[number])
                        }
                        aria-label="Payout schedule"
                        className="text-foreground appearance-none rounded-xl border-[1.2px] border-[#525252]/60 bg-transparent py-2.5 pr-11 pl-6 text-sm font-semibold outline-none"
                      >
                        {SCHEDULES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="text-muted-foreground pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2" />
                    </div>
                  </div>
                </div>
              </div>

              <div>{SaveButton}</div>
            </div>
          )}
        </div>
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
