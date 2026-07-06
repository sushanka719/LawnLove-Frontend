"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AuthCard } from "@/components/auth/auth-card";
import { AuthTextField } from "@/components/auth/auth-text-field";
import { SubmitButton } from "@/components/auth/submit-button";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { AuthError, setPassword } from "@/lib/auth-client";

const setPasswordSchema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SetPasswordValues = z.infer<typeof setPasswordSchema>;

export default function SetPasswordPage() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SetPasswordValues>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const onSubmit = async (values: SetPasswordValues) => {
    setFormError(null);
    try {
      await setPassword(values.newPassword);
      setDone(true);
      setTimeout(() => router.push("/login"), 1500);
    } catch (error) {
      setFormError(
        error instanceof AuthError
          ? error.message
          : "Could not set your password. Please sign in again to retry.",
      );
    }
  };

  if (done) {
    return (
      <AuthCard title="Password set">
        <p className="text-lawn-text-secondary text-center text-base">
          Your password has been set. Redirecting you to sign in...
        </p>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Set your password">
      <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-4">
        <FieldGroup className="gap-3.5">
          <Field>
            <AuthTextField
              type="password"
              placeholder="New password"
              {...register("newPassword")}
              aria-invalid={!!errors.newPassword}
            />
            <FieldError>{errors.newPassword?.message}</FieldError>
          </Field>
          <Field>
            <AuthTextField
              type="password"
              placeholder="Confirm password"
              {...register("confirmPassword")}
              aria-invalid={!!errors.confirmPassword}
            />
            <FieldError>{errors.confirmPassword?.message}</FieldError>
          </Field>
        </FieldGroup>

        {formError && <p className="text-destructive text-center text-sm">{formError}</p>}

        <SubmitButton disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Set password"}
        </SubmitButton>
      </form>
    </AuthCard>
  );
}
