"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { AuthCard } from "@/components/auth/auth-card";
import { AuthDivider } from "@/components/auth/auth-divider";
import { AuthTextField } from "@/components/auth/auth-text-field";
import { GoogleButton } from "@/components/auth/google-button";
import { SubmitButton } from "@/components/auth/submit-button";
import { LawnButton } from "@/components/landing/lawn-button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { AuthError, signInWithGoogle, signUpWithMagicLink } from "@/lib/auth-client";
import { getWebmailUrl, slugifyUsername } from "@/lib/utils";

const RESEND_COOLDOWN_SECONDS = 30;

const signUpSchema = z.object({
  name: z.string().min(2, "Enter your full name"),
  email: z.email("Enter a valid email address"),
  rememberMe: z.boolean(),
});

type SignUpValues = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const [sent, setSent] = useState<{
    email: string;
    name: string;
    username: string;
  } | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_COOLDOWN_SECONDS);
  const [isResending, setIsResending] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", rememberMe: false },
  });

  useEffect(() => {
    if (!sent || secondsLeft <= 0) return;
    const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [sent, secondsLeft]);

  const onSubmit = async (values: SignUpValues) => {
    setFormError(null);
    try {
      const username = slugifyUsername(values.name);
      await signUpWithMagicLink({
        email: values.email,
        name: values.name,
        username,
        callbackURL: `${window.location.origin}/set-password`,
      });
      setSent({ email: values.email, name: values.name, username });
      setSecondsLeft(RESEND_COOLDOWN_SECONDS);
    } catch (error) {
      setFormError(error instanceof AuthError ? error.message : "Something went wrong.");
    }
  };

  const handleGoogleSignUp = async () => {
    setFormError(null);
    try {
      await signInWithGoogle(`${window.location.origin}/`);
    } catch (error) {
      setFormError(error instanceof AuthError ? error.message : "Something went wrong.");
    }
  };

  const handleResend = async () => {
    if (!sent) return;
    setIsResending(true);
    setFormError(null);
    try {
      await signUpWithMagicLink({
        email: sent.email,
        name: sent.name,
        username: sent.username,
        callbackURL: `${window.location.origin}/set-password`,
      });
      setSecondsLeft(RESEND_COOLDOWN_SECONDS);
    } catch (error) {
      setFormError(error instanceof AuthError ? error.message : "Something went wrong.");
    } finally {
      setIsResending(false);
    }
  };

  if (sent) {
    return (
      <AuthCard title="Check your email">
        <p className="text-lawn-text-secondary text-center text-base">
          We&apos;ve sent a verification link to{" "}
          <span className="text-lawn-text-primary font-medium">{sent.email}</span>. Click
          the link in the email to verify your account and continue.
        </p>
        <LawnButton
          href={getWebmailUrl(sent.email)}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open Email
        </LawnButton>
        <p className="text-lawn-text-primary text-center text-xs">
          Not received yet?{" "}
          {secondsLeft > 0 ? (
            `Resend after ${secondsLeft} seconds`
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="text-lawn-primary underline disabled:opacity-50"
            >
              {isResending ? "Resending..." : "Resend"}
            </button>
          )}
        </p>
        {formError && <p className="text-destructive text-center text-sm">{formError}</p>}
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Create your account"
      footer={
        <>
          I have read and agree to our{" "}
          <Link href="/terms" className="underline">
            Terms of Use
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline">
            Privacy Policy.
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-4">
        <FieldGroup className="gap-3.5">
          <Field>
            <AuthTextField
              placeholder="Full Name"
              {...register("name")}
              aria-invalid={!!errors.name}
            />
            <FieldError>{errors.name?.message}</FieldError>
          </Field>
          <Field>
            <AuthTextField
              type="email"
              placeholder="Email address"
              {...register("email")}
              aria-invalid={!!errors.email}
            />
            <FieldError>{errors.email?.message}</FieldError>
          </Field>
        </FieldGroup>

        <FieldLabel htmlFor="remember-me" className="w-fit gap-2">
          <Controller
            control={control}
            name="rememberMe"
            render={({ field }) => (
              <Checkbox
                id="remember-me"
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
              />
            )}
          />
          <span className="text-lawn-text-primary text-sm">Remember me</span>
        </FieldLabel>

        {formError && <p className="text-destructive text-center text-sm">{formError}</p>}

        <SubmitButton disabled={isSubmitting}>
          {isSubmitting ? "Signing up..." : "Sign up"}
        </SubmitButton>
      </form>

      <p className="text-sm font-medium">
        <span className="text-lawn-text-primary">Already have an account? </span>
        <Link href="/login" className="text-lawn-primary">
          Sign in
        </Link>
      </p>

      <AuthDivider />

      <GoogleButton onClick={handleGoogleSignUp} disabled={isSubmitting} />
    </AuthCard>
  );
}
