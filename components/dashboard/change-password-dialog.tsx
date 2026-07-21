"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { changePassword } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/http";
import {
  changePasswordSchema,
  type ChangePasswordValues,
} from "@/lib/validation/settings-schemas";

type ChangePasswordDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function PasswordField({
  id,
  label,
  autoComplete,
  error,
  registration,
}: {
  id: string;
  label: string;
  autoComplete: string;
  error?: string;
  registration: ReturnType<ReturnType<typeof useForm<ChangePasswordValues>>["register"]>;
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
        type="password"
        autoComplete={autoComplete}
        maxLength={64}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className="text-lawn-text-primary bg-lawn-bg-1 h-11 rounded-lg text-lg font-semibold"
        {...registration}
      />
      <FieldError id={errorId}>{error}</FieldError>
    </div>
  );
}

export function ChangePasswordDialog({
  open,
  onOpenChange,
}: ChangePasswordDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onTouched",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Clear the fields whenever the dialog closes so they never linger.
  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const mutation = useMutation({
    mutationFn: (values: ChangePasswordValues) =>
      changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        // Sign out other devices — a password change usually means the old one
        // may be compromised.
        revokeOtherSessions: true,
      }),
  });

  const onSubmit = async (values: ChangePasswordValues) => {
    try {
      await mutation.mutateAsync(values);
      toast.success("Password updated.");
      onOpenChange(false);
    } catch (err) {
      toast.error(
        err instanceof ApiError
          ? err.message
          : "We couldn't update your password. Please try again.",
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-lawn-bg-2 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lawn-text-primary text-xl font-bold tracking-tight">
            Change password
          </DialogTitle>
          <DialogDescription className="text-lawn-text-secondary text-base">
            Enter your current password, then choose a new one. You&apos;ll stay
            signed in here; other devices will be signed out.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <PasswordField
            id="current-password"
            label="Current password"
            autoComplete="current-password"
            error={errors.currentPassword?.message}
            registration={register("currentPassword")}
          />
          <PasswordField
            id="new-password"
            label="New password"
            autoComplete="new-password"
            error={errors.newPassword?.message}
            registration={register("newPassword")}
          />
          <PasswordField
            id="confirm-password"
            label="Confirm new password"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            registration={register("confirmPassword")}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="lawn-gradient-btn w-full rounded-xl px-8 py-3 text-base font-semibold text-white shadow-[0px_5px_10px_0px_rgba(0,0,0,0.25)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Updating..." : "Update password"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
