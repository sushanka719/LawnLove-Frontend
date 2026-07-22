"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2 } from "lucide-react";

import { DashboardPanel } from "@/components/dashboard/dashboard-panel";
import { cn } from "@/lib/utils";

/**
 * Super Admin → Profile screen (Figma node 1071:2776).
 *
 * Visual mock — field edits and photo upload only hold local state; "Save
 * changes" toasts. Wire to the account/session API when going live. Reached via
 * the sidebar account card (no nav item).
 */

const MEMBER_SINCE = "2026 May 13";

const outlineBtn =
  "text-primary rounded-xl border-[1.2px] border-[#35ab6e] px-6 py-2.5 text-sm font-semibold transition-colors hover:bg-[#35ab6e]/10";
const inputClass =
  "border-border text-foreground w-full rounded-[10px] border bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary/50";

type Field = { key: "fullName" | "email" | "phone"; label: string };

const FIELDS: Field[] = [
  { key: "fullName", label: "Full Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone Number" },
];

export function AdminProfile() {
  const [values, setValues] = useState({
    fullName: "Jordan Rivera",
    email: "jordan@gmail.com",
    phone: "(512) 123 4324",
  });
  const [draft, setDraft] = useState(values);
  const [editing, setEditing] = useState(false);
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

  const initials = values.fullName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const startEdit = () => {
    setDraft(values);
    setEditing(true);
  };

  const cancelEdit = () => {
    setDraft(values);
    setEditing(false);
  };

  const save = () => {
    setValues(draft);
    setEditing(false);
    showToast("Profile saved");
  };

  return (
    <DashboardPanel title="Profile" subtitle="Your personal details and contact info.">
      {/* Identity */}
      <div className="border-border flex flex-wrap items-center gap-6 border-b pb-6">
        <span className="bg-primary text-primary-foreground flex size-[88px] shrink-0 items-center justify-center rounded-full text-2xl font-semibold">
          {initials}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-lg font-bold tracking-[-0.01em]">{values.fullName}</p>
          <p className="text-muted-foreground text-sm">Member since : {MEMBER_SINCE}</p>
        </div>
        <button
          type="button"
          onClick={() => showToast("Photo upload coming soon")}
          className={outlineBtn}
        >
          Upload photo
        </button>
      </div>

      {/* Profile details */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold tracking-[-0.01em]">Profile Details</h2>
          <button
            type="button"
            onClick={editing ? cancelEdit : startEdit}
            className={outlineBtn}
          >
            {editing ? "Cancel" : "Edit"}
          </button>
        </div>

        <div className="bg-card border-border rounded-xl border p-6 shadow-[0px_4px_16px_0px_rgba(74,74,74,0.08)]">
          <div className="flex flex-col gap-6">
            {FIELDS.map((f) => (
              <div key={f.key} className="flex flex-col gap-1">
                <p className="text-muted-foreground text-sm font-medium">{f.label}</p>
                {editing ? (
                  <input
                    className={inputClass}
                    value={draft[f.key]}
                    onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))}
                    aria-label={f.label}
                  />
                ) : (
                  <p className="text-[15px] font-semibold">{values[f.key]}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <button
          type="button"
          onClick={save}
          className={cn(
            "lawn-gradient-btn inline-flex items-center justify-center rounded-xl px-8 py-3 text-sm font-semibold text-white shadow-[0px_5px_10px_0px_rgba(25,81,52,0.25)] transition-transform active:scale-[0.98]",
            !editing && "cursor-not-allowed opacity-60",
          )}
          disabled={!editing}
        >
          Save changes
        </button>
      </div>

      {toast && (
        <div className="bg-primary text-primary-foreground fixed bottom-6 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2 rounded-[10px] px-5 py-3 text-sm font-medium shadow-lg">
          <CheckCircle2 className="size-4" />
          {toast}
        </div>
      )}
    </DashboardPanel>
  );
}
