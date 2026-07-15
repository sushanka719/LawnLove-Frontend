"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { z } from "zod";

import { AuthCard } from "@/components/auth/auth-card";
import { AuthDivider } from "@/components/auth/auth-divider";
import { AuthTextField } from "@/components/auth/auth-text-field";
import { GoogleButton } from "@/components/auth/google-button";
import { SubmitButton } from "@/components/auth/submit-button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { sessionQueryKey } from "@/hooks/use-session";
import { signInWithEmail, signInWithGoogle } from "@/lib/api/auth";
import { broadcastAuthSignal } from "@/lib/auth-channel";
import { ApiError } from "@/lib/api/http";
import { emailSchema, loginPasswordSchema } from "@/lib/validation/auth-schemas";

const signInSchema = z.object({
  email: emailSchema,
  password: loginPasswordSchema,
  rememberMe: z.boolean(),
});

type SignInValues = z.infer<typeof signInSchema>;

// Only allow same-origin relative redirects to avoid open-redirect abuse.
function safeNext(next: string | null): string {
  if (next && next.startsWith("/") && !next.startsWith("//")) {
    return next;
  }
  return "/dashboard";
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = safeNext(searchParams.get("next"));
  const queryClient = useQueryClient();
  const [formError, setFormError] = useState<string | null>(null);
  // `router.push` returns immediately, so `isSubmitting` alone would clear the
  // loading state before the dashboard finishes loading — leaving the button
  // clickable again. Hold `redirecting` from the push until this component
  // unmounts on navigation so the button stays disabled through the redirect.
  const [redirecting, setRedirecting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const isBusy = isSubmitting || redirecting;

  const onSubmit = async (values: SignInValues) => {
    setFormError(null);
    try {
      await signInWithEmail(values);
      await queryClient.invalidateQueries({ queryKey: sessionQueryKey });
      // Let any other tab still parked on a pre-auth screen follow us in.
      broadcastAuthSignal("signed-in");
      setRedirecting(true);
      router.push(redirectTo);
    } catch (error) {
      setFormError(error instanceof ApiError ? error.message : "Something went wrong.");
    }
  };

  const handleGoogleSignIn = async () => {
    setFormError(null);
    try {
      await signInWithGoogle(`${window.location.origin}${redirectTo}`);
    } catch (error) {
      setFormError(error instanceof ApiError ? error.message : "Something went wrong.");
    }
  };

  return (
    <AuthCard title="Sign in to your account">
      <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-4">
        <FieldGroup className="gap-3.5">
          <Field>
            <AuthTextField
              type="email"
              placeholder="Email address"
              {...register("email")}
              aria-invalid={!!errors.email}
            />
            <FieldError>{errors.email?.message}</FieldError>
          </Field>
          <Field>
            <div className="relative">
              <AuthTextField
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="pr-10"
                {...register("password")}
                aria-invalid={!!errors.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-lawn-text-secondary hover:text-lawn-text-primary absolute top-1/2 right-3 -translate-y-1/2"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <FieldError>{errors.password?.message}</FieldError>
          </Field>
        </FieldGroup>

        <div className="flex w-full items-center justify-between">
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
          <Link href="/forgot-password" className="text-lawn-primary text-sm font-medium">
            Forgot password?
          </Link>
        </div>

        {formError && <p className="text-destructive text-center text-sm">{formError}</p>}

        <SubmitButton disabled={isBusy}>
          {isBusy ? "Signing in..." : "Sign in"}
        </SubmitButton>
      </form>

      <p className="text-sm font-medium">
        <span className="text-lawn-text-primary">Don&apos;t have an account? </span>
        <Link href="/signup" className="text-lawn-primary">
          Sign up
        </Link>
      </p>

      <AuthDivider />

      <GoogleButton onClick={handleGoogleSignIn} disabled={isBusy} />
    </AuthCard>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
