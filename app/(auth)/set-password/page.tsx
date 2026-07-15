"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AuthCard } from "@/components/auth/auth-card";
import { AuthTextField } from "@/components/auth/auth-text-field";
import { ExpiredLinkCard } from "@/components/auth/expired-link-card";
import { SubmitButton } from "@/components/auth/submit-button";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import {
  buildSetPasswordCallbackURL,
  setPassword,
  signUpWithMagicLink,
} from "@/lib/api/auth";
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
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SetPasswordValues>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const newPassword = watch("newPassword");
  const confirmPassword = watch("confirmPassword");
  const isFormFilled = Boolean(newPassword) && Boolean(confirmPassword);

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
    const email = searchParams.get("email");
    const name = searchParams.get("name");
    const username = searchParams.get("username");
    return (
      <ExpiredLinkCard
        title="Verification Link Expired"
        description="Your verification link has expired. Request a new link to continue creating your account."
        email={email}
        canResend={!!email && !!name && !!username}
        onResend={() =>
          signUpWithMagicLink({
            email: email!,
            name: name!,
            username: username!,
            callbackURL: buildSetPasswordCallbackURL(email!, name!, username!),
          })
        }
        backHref="/signup"
        backLabel="Back to Sign Up"
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
            <div className="relative">
              <AuthTextField
                type={showNewPassword ? "text" : "password"}
                placeholder="New password"
                maxLength={16}
                {...register("newPassword")}
                aria-invalid={!!errors.newPassword}
                className="pr-10"
              />

              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="text-lawn-text-secondary hover:text-lawn-text-primary absolute top-1/2 right-3 -translate-y-1/2"
                tabIndex={-1}
                aria-label={showNewPassword ? "Hide password" : "Show password"}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
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
                maxLength={16}
                {...register("confirmPassword")}
                aria-invalid={!!errors.confirmPassword}
                className="pr-10"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="text-lawn-text-secondary hover:text-lawn-text-primary absolute top-1/2 right-3 -translate-y-1/2"
                tabIndex={-1}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <FieldError>{errors.confirmPassword?.message}</FieldError>
          </Field>
        </FieldGroup>

        {formError && <p className="text-destructive text-center text-sm">{formError}</p>}

        <SubmitButton disabled={isSubmitting || !isFormFilled}>
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
