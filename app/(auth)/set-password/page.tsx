"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AuthCard } from "@/components/auth/auth-card";
import { AuthTextField } from "@/components/auth/auth-text-field";
import { ExpiredLinkCard } from "@/components/auth/expired-link-card";
import { SubmitButton } from "@/components/auth/submit-button";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { setPassword } from "@/lib/api/auth";
import { broadcastAuthSignal } from "@/lib/auth-channel";
import { ApiError } from "@/lib/api/http";
import { newPasswordSchema } from "@/lib/validation/auth-schemas";

const setPasswordSchema = z
  .object({
    newPassword: newPasswordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type SetPasswordValues = z.infer<typeof setPasswordSchema>;

function SetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
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
      // Signup often starts in another tab (the "check your email" screen); tell
      // it we're signed in now so it can leave that stale screen for the dashboard.
      broadcastAuthSignal("signed-in");
      setDone(true);
      setTimeout(() => router.push("/login"), 1500);
    } catch (error) {
      setFormError(
        error instanceof ApiError
          ? error.message
          : "Could not set your password. Please sign in again to retry.",
      );
    }
  };

  if (searchParams.get("error") === "INVALID_TOKEN") {
    return (
      <ExpiredLinkCard
        email={searchParams.get("email")}
        name={searchParams.get("name")}
        username={searchParams.get("username")}
      />
    );
  }

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

export default function SetPasswordPage() {
  return (
    <Suspense>
      <SetPasswordForm />
    </Suspense>
  );
}
