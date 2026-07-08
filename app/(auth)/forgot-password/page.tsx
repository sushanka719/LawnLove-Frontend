"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AuthCard } from "@/components/auth/auth-card";
import { AuthTextField } from "@/components/auth/auth-text-field";
import { SubmitButton } from "@/components/auth/submit-button";
import { Field, FieldError } from "@/components/ui/field";
import { AuthError, requestPasswordReset } from "@/lib/auth-client";
import { emailSchema } from "@/lib/validation/auth-schemas";

const forgotPasswordSchema = z.object({
  email: emailSchema,
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: ForgotPasswordValues) => {
    setFormError(null);
    try {
      await requestPasswordReset({
        email: values.email,
        redirectTo: `${window.location.origin}/reset-password`,
      });
      setSentTo(values.email);
    } catch (error) {
      setFormError(error instanceof AuthError ? error.message : "Something went wrong.");
    }
  };

  if (sentTo) {
    return (
      <AuthCard title="Check your email">
        <p className="text-lawn-text-secondary text-center text-base">
          If an account exists for{" "}
          <span className="text-lawn-text-primary font-medium">{sentTo}</span>, we sent a
          link to reset your password.
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
