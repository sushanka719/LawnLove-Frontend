"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AuthCard } from "@/components/auth/auth-card";
import { AuthTextField } from "@/components/auth/auth-text-field";
import { SubmitButton } from "@/components/auth/submit-button";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { AuthError, resetPassword } from "@/lib/auth-client";

const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [formError, setFormError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const onSubmit = async (values: ResetPasswordValues) => {
    if (!token) {
      setFormError("This reset link is invalid or has expired.");
      return;
    }
    setFormError(null);
    try {
      await resetPassword({ newPassword: values.newPassword, token });
      setDone(true);
      setTimeout(() => router.push("/login"), 1500);
    } catch (error) {
      setFormError(error instanceof AuthError ? error.message : "Something went wrong.");
    }
  };

  if (done) {
    return (
      <AuthCard title="Password reset">
        <p className="text-lawn-text-secondary text-center text-base">
          Your password has been reset. Redirecting you to sign in...
        </p>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Reset your password">
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
          {isSubmitting ? "Saving..." : "Reset password"}
        </SubmitButton>
      </form>
    </AuthCard>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
