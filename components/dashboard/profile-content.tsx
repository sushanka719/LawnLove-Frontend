"use client";

import { OutlineButton } from "@/components/dashboard/dashboard-actions";
import { useSession } from "@/hooks/use-session";

function getInitials(name?: string, email?: string) {
  if (name) {
    const parts = name.trim().split(/\s+/);
    return (
      parts
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("") || "?"
    );
  }
  return email?.[0]?.toUpperCase() ?? "?";
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-lawn-text-secondary text-base font-medium tracking-tight">
        {label}
      </p>
      <p className="text-lawn-text-primary text-lg font-semibold tracking-tight">
        {value}
      </p>
    </div>
  );
}

export function ProfileContent() {
  const { data: session } = useSession();
  const user = session?.user;

  const name = user?.name || "Your account";
  const email = user?.email || "—";

  return (
    <div className="flex w-full max-w-[1271px] flex-col gap-10">
      <div className="flex flex-col gap-8">
        {/* Identity row */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex min-w-0 flex-1 items-center gap-6">
            <div className="flex size-22 shrink-0 items-center justify-center rounded-full bg-[#fecd03] text-3xl font-medium text-white uppercase">
              {getInitials(user?.name, user?.email)}
            </div>
            <div className="flex min-w-0 flex-col gap-1">
              <p className="text-lawn-text-primary truncate text-xl font-bold tracking-tight">
                {name}
              </p>
              <p className="text-lawn-text-secondary text-lg font-medium tracking-tight">
                Manage your personal details and contact info.
              </p>
            </div>
          </div>
          <OutlineButton>Upload photo</OutlineButton>
        </div>

        {/* Profile details */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <p className="text-lawn-text-primary flex-1 text-xl font-semibold tracking-tight">
              Profile Details
            </p>
            <OutlineButton>Edit</OutlineButton>
          </div>
          <div className="bg-lawn-bg-2 flex flex-col gap-6 rounded-xl p-6 drop-shadow-[0px_4px_8px_rgba(74,74,74,0.14)] lg:p-8">
            <DetailField label="Full Name" value={name} />
            <DetailField label="Email" value={email} />
            <DetailField label="Phone Number" value="Not added yet" />
          </div>
        </div>
      </div>

      <button
        type="button"
        className="lawn-gradient-btn w-fit rounded-xl px-8 py-3 text-base font-semibold tracking-tight text-white shadow-[0px_5px_10px_0px_rgba(0,0,0,0.25)] transition-opacity hover:opacity-90"
      >
        Save changes
      </button>
    </div>
  );
}
