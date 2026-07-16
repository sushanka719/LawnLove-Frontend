"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { ProfileAvatar } from "@/components/dashboard/profile-avatar";
import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useUpdateProfile } from "@/hooks/use-profile";
import { useSession } from "@/hooks/use-session";
import { ApiError } from "@/lib/api/http";
import { profileSchema, type ProfileFormValues } from "@/lib/validation/profile-schemas";

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

function EditField({
  id,
  label,
  type = "text",
  autoComplete,
  inputMode,
  maxLength,
  error,
  registration,
}: {
  id: string;
  label: string;
  type?: string;
  autoComplete?: string;
  inputMode?: React.ComponentProps<typeof Input>["inputMode"];
  maxLength?: number;
  error?: string;
  registration: ReturnType<ReturnType<typeof useForm<ProfileFormValues>>["register"]>;
}) {
  const errorId = `${id}-error`;
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-lawn-text-secondary text-base font-medium tracking-tight"
      >
        {label}
      </label>
      <Input
        id={id}
        type={type}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className="text-lawn-text-primary bg-lawn-bg-1 h-11 rounded-lg text-lg font-semibold"
        {...registration}
      />
      <FieldError id={errorId}>{error}</FieldError>
    </div>
  );
}

export function ProfileContent() {
  const { data: session } = useSession();
  const user = session?.user;
  const updateProfile = useUpdateProfile();

  const [isEditing, setIsEditing] = useState(false);

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

  // Keep the form seeded with the latest session values whenever they arrive or
  // the user re-opens the editor (so a cancelled edit starts clean next time).
  useEffect(() => {
    if (!isEditing) {
      reset({ fullName: user?.name ?? "", phoneNumber: user?.phoneNumber ?? "" });
    }
  }, [isEditing, user?.name, user?.phoneNumber, reset]);

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      await updateProfile.mutateAsync({
        name: values.fullName,
        phoneNumber: values.phoneNumber,
      });
      toast.success("Profile updated.");
      setIsEditing(false);
    } catch (err) {
      toast.error(
        err instanceof ApiError
          ? err.message
          : "Couldn't save your changes. Please try again.",
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full max-w-[1271px] flex-col gap-10"
    >
      <div className="flex flex-col gap-8">
        {/* Identity row */}
        <ProfileAvatar name={name} email={user?.email} image={user?.image} />

        {/* Profile details */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <p className="text-lawn-text-primary flex-1 text-xl font-semibold tracking-tight">
              Profile Details
            </p>
            <button
              type="button"
              onClick={() => setIsEditing((editing) => !editing)}
              className="border-lawn-primary-light text-lawn-primary hover:bg-lawn-primary-light/10 shrink-0 rounded-xl border-[1.2px] px-8 py-3 text-base font-semibold tracking-tight whitespace-nowrap transition-colors"
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>
          </div>
          <div className="bg-lawn-bg-2 flex flex-col gap-6 rounded-xl p-6 drop-shadow-[0px_4px_8px_rgba(74,74,74,0.14)] lg:p-8">
            {isEditing ? (
              <EditField
                id="profile-full-name"
                label="Full Name"
                autoComplete="name"
                maxLength={100}
                error={errors.fullName?.message}
                registration={register("fullName")}
              />
            ) : (
              <DetailField label="Full Name" value={name} />
            )}

            <DetailField label="Email" value={email} />

            {isEditing ? (
              <EditField
                id="profile-phone"
                label="Phone Number"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                maxLength={16}
                error={errors.phoneNumber?.message}
                registration={register("phoneNumber")}
              />
            ) : (
              <DetailField label="Phone Number" value={phoneNumber || "Not added yet"} />
            )}
          </div>
        </div>
      </div>

      {isEditing && (
        <button
          type="submit"
          disabled={isSubmitting}
          className="lawn-gradient-btn w-fit rounded-xl px-8 py-3 text-base font-semibold tracking-tight text-white shadow-[0px_5px_10px_0px_rgba(0,0,0,0.25)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : "Save changes"}
        </button>
      )}
    </form>
  );
}
