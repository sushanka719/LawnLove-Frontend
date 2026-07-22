"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AuthCard } from "@/components/auth/auth-card";
import { AuthTextField } from "@/components/auth/auth-text-field";
import { SubmitButton } from "@/components/auth/submit-button";
import { LawnButton } from "@/components/landing/lawn-button";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { buildResetPasswordCallbackURL, requestPasswordReset } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/http";
import { emailSchema } from "@/lib/validation/auth-schemas";
import { getWebmailUrl } from "@/lib/utils";

const forgotPasswordSchema = z.object({
  email: emailSchema,
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

const RESEND_COOLDOWN_SECONDS = 59;

export default function ForgotPasswordPage() {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const sendResetLink = async (email: string) => {
    await requestPasswordReset({
      email,
      redirectTo: buildResetPasswordCallbackURL(email),
    });
  };

  const onSubmit = async (values: ForgotPasswordValues) => {
    setFormError(null);
    try {
      await sendResetLink(values.email);
      setSentTo(values.email);
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (error) {
      setFormError(error instanceof ApiError ? error.message : "Something went wrong.");
    }
  };

  const handleResend = async () => {
    const email = sentTo ?? getValues("email");
    if (!email || cooldown > 0 || isResending) return;
    setIsResending(true);
    setFormError(null);
    try {
      await sendResetLink(email);
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (error) {
      setFormError(error instanceof ApiError ? error.message : "Something went wrong.");
    } finally {
      setIsResending(false);
    }
  };

  if (sentTo) {
    return (
      <AuthCard title="Check Your Email">
        <p className="text-lawn-text-secondary text-center text-base">
          We&apos;ve emailed you a secure link to reset your password. Click the link to
          create a new one.
        </p>

        <LawnButton
          href={getWebmailUrl(sentTo)}
          target="_blank"
          rel="noopener noreferrer"
          className="lawn-gradient-btn h-auto rounded-xl px-8 py-3 text-base font-semibold text-white shadow-[0px_5px_10px_0px_rgba(0,0,0,0.25)] hover:opacity-90"
        >
          Open Email
        </LawnButton>

        <p className="text-lawn-text-secondary text-center text-sm">
          Not received yet? <br />
          {cooldown > 0 ? (
            <span>Resend after {cooldown} seconds</span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="text-lawn-primary underline disabled:opacity-50"
            >
              {isResending ? "Resending..." : "Resend"}
            </button>
          )}{" "}
          or{" "}
          <Link href="/login" className="text-lawn-primary underline">
            Back to Sign in
          </Link>
        </p>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Forgot your password?">
      <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-4">
        <Field>
          <AuthTextField
            type="email"
            placeholder="Email address"
            {...register("email")}
            aria-invalid={!!errors.email}
          />
          <FieldError>{errors.email?.message}</FieldError>
        </Field>

        {formError && <p className="text-destructive text-center text-sm">{formError}</p>}

        <SubmitButton disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send reset link"}
        </SubmitButton>
      </form>

      <p className="text-sm font-medium">
        <Link href="/login" className="text-lawn-primary">
          Back to sign in
        </Link>
      </p>
    </AuthCard>
  );
}
