"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { ProfileAvatar } from "@/components/dashboard/profile-avatar";
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";
import { FieldError } from "@/components/ui/field";
import { useUpdateProfile } from "@/hooks/use-profile";
import { useSession } from "@/hooks/use-session";
import { ApiError } from "@/lib/api/http";
import { profileSchema, type ProfileFormValues } from "@/lib/validation/profile-schemas";

/**
 * Super Admin → Profile screen (Figma node 1071:2776).
 *
 * Wired to the live session: edits persist via `useUpdateProfile`, the photo
 * uploads via `ProfileAvatar` (`useUpdateAvatar`). Reached from the sidebar
 * account card (no nav item).
 */

const inputClass =
  "border-border text-foreground w-full rounded-[10px] border bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary/50 aria-[invalid=true]:border-destructive";

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-muted-foreground text-sm font-medium">{label}</p>
      <p className="text-[15px] font-semibold">{value}</p>
    </div>
  );
}

function memberSinceLabel(createdAt?: string | null): string | undefined {
  if (!createdAt) return undefined;
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return undefined;
  return `Member since : ${date.getFullYear()} ${date.toLocaleString("en-US", {
    month: "long",
  })} ${date.getDate()}`;
}

export function AdminProfile() {
  const { data: session } = useSession();
  const user = session?.user;
  const updateProfile = useUpdateProfile();

  const [editing, setEditing] = useState(false);

  const name = user?.name || "Your account";
  const email = user?.email || "—";
  const phoneNumber = user?.phoneNumber || "";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    mode: "onTouched",
    defaultValues: { fullName: user?.name ?? "", phoneNumber },
  });

  // Re-seed the form from the session whenever those values arrive or the editor
  // is closed, so a cancelled edit starts clean next time.
  useEffect(() => {
    if (!editing) {
      reset({ fullName: user?.name ?? "", phoneNumber: user?.phoneNumber ?? "" });
    }
  }, [editing, user?.name, user?.phoneNumber, reset]);

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      await updateProfile.mutateAsync({
        name: values.fullName,
        phoneNumber: values.phoneNumber,
      });
      toast.success("Profile updated.");
      setEditing(false);
    } catch (err) {
      toast.error(
        err instanceof ApiError
          ? err.message
          : "Couldn't save your changes. Please try again.",
      );
    }
  };

  return (
    <DashboardPanel title="Profile" subtitle="Your personal details and contact info.">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
        {/* Identity + photo upload */}
        <div className="border-border border-b pb-6">
          <ProfileAvatar
            name={name}
            email={user?.email}
            image={user?.image}
            subtitle={memberSinceLabel(user?.createdAt) ?? `${email}`}
          />
        </div>

        {/* Profile details */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-bold tracking-[-0.01em]">Profile Details</h2>
            <button
              type="button"
              onClick={() => setEditing((v) => !v)}
              className="text-primary rounded-xl border-[1.2px] border-[#35ab6e] px-6 py-2.5 text-sm font-semibold transition-colors hover:bg-[#35ab6e]/10"
            >
              {editing ? "Cancel" : "Edit"}
            </button>
          </div>

          <div className="bg-card border-border rounded-xl border p-6 shadow-[0px_4px_16px_0px_rgba(74,74,74,0.08)]">
            <div className="flex flex-col gap-6">
              {editing ? (
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="profile-full-name"
                    className="text-muted-foreground text-sm font-medium"
                  >
                    Full Name
                  </label>
                  <input
                    id="profile-full-name"
                    autoComplete="name"
                    maxLength={100}
                    aria-invalid={!!errors.fullName}
                    className={inputClass}
                    {...register("fullName")}
                  />
                  <FieldError id="profile-full-name-error">
                    {errors.fullName?.message}
                  </FieldError>
                </div>
              ) : (
                <DetailField label="Full Name" value={name} />
              )}

              <DetailField label="Email" value={email} />

              {editing ? (
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="profile-phone"
                    className="text-muted-foreground text-sm font-medium"
                  >
                    Phone Number
                  </label>
                  <input
                    id="profile-phone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    maxLength={16}
                    aria-invalid={!!errors.phoneNumber}
                    className={inputClass}
                    {...register("phoneNumber")}
                  />
                  <FieldError id="profile-phone-error">
                    {errors.phoneNumber?.message}
                  </FieldError>
                </div>
              ) : (
                <DetailField
                  label="Phone Number"
                  value={phoneNumber || "Not added yet"}
                />
              )}
            </div>
          </div>
        </div>

        {editing && (
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="lawn-gradient-btn inline-flex items-center justify-center rounded-xl px-8 py-3 text-sm font-semibold text-white shadow-[0px_5px_10px_0px_rgba(25,81,52,0.25)] transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Saving..." : "Save changes"}
            </button>
          </div>
        )}
      </form>
    </DashboardPanel>
  );
}
