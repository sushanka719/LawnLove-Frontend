"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { z } from "zod";

import { AuthCard } from "@/components/auth/auth-card";
import { AuthTextField } from "@/components/auth/auth-text-field";
import { ExpiredLinkCard } from "@/components/auth/expired-link-card";
import { SubmitButton } from "@/components/auth/submit-button";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import {
  buildResetPasswordCallbackURL,
  requestPasswordReset,
  resetPassword,
} from "@/lib/api/auth";
import { ApiError } from "@/lib/api/http";
import { newPasswordSchema } from "@/lib/validation/auth-schemas";

const resetPasswordSchema = z
  .object({
    newPassword: newPasswordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const [formError, setFormError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
      setFormError(error instanceof ApiError ? error.message : "Something went wrong.");
    }
  };

  if (searchParams.get("error") === "INVALID_TOKEN") {
    return (
      <ExpiredLinkCard
        title="Reset Link Expired"
        description="Your password reset link has expired. Request a new link to reset your password."
        email={email}
        canResend={!!email}
        onResend={() =>
          requestPasswordReset({
            email: email!,
            redirectTo: buildResetPasswordCallbackURL(email!),
          })
        }
        backHref="/login"
        backLabel="Back to Sign In"
      />
    );
  }

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
            <div className="relative">
              <AuthTextField
                type={showNewPassword ? "text" : "password"}
                placeholder="New password"
                className="pr-10"
                {...register("newPassword")}
                aria-invalid={!!errors.newPassword}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="text-lawn-text-secondary hover:text-lawn-text-primary absolute top-1/2 right-3 -translate-y-1/2"
                tabIndex={-1}
                aria-label={showNewPassword ? "Hide password" : "Show password"}
              >
                {showNewPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            <FieldError>{errors.newPassword?.message}</FieldError>
          </Field>
          <Field>
            <div className="relative">
              <AuthTextField
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                className="pr-10"
                {...register("confirmPassword")}
                aria-invalid={!!errors.confirmPassword}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="text-lawn-text-secondary hover:text-lawn-text-primary absolute top-1/2 right-3 -translate-y-1/2"
                tabIndex={-1}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
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
