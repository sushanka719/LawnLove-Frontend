"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, type SignUpValues } from "@/lib/validation/auth";
import { FloatingInput } from "@/components/ui/floating-input";
import { SubmitButton } from "@/components/auth/submit-button";
import { Logo } from "@/components/auth/logo";

interface SignUpFormProps {
  onSubmit: (values: SignUpValues) => Promise<void> | void;
  onGoogleSignUp?: () => void;
}

export function SignUpForm({ onSubmit, onGoogleSignUp }: SignUpFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
    defaultValues: { fullName: "", email: "", rememberMe: false },
  });

  return (
    <div>
      <Logo />
      <h1 className="mt-6 text-xl font-semibold text-neutral-900">Create your account</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-3">
        <FloatingInput
          label="Full Name"
          error={errors.fullName?.message}
          {...register("fullName")}
        />
        <FloatingInput
          label="Email address"
          type="email"
          error={errors.email?.message}
          {...register("email")}
        />

        <label className="flex items-center gap-2 pt-1 text-xs text-neutral-600">
          <input
            type="checkbox"
            {...register("rememberMe")}
            className="h-3.5 w-3.5 rounded border-neutral-300 accent-[#1F6B3A]"
          />
          Remember me
        </label>

        <div className="pt-2">
          <SubmitButton
            isValid={isValid}
            isSubmitting={isSubmitting}
            disabledLabel="Sign up"
            enabledLabel="Continue"
          />
        </div>

        <p className="text-center text-xs text-neutral-600">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-[#1F6B3A]">
            Sign in
          </Link>
        </p>

        <div className="flex items-center gap-3 py-1">
          <div className="h-px flex-1 bg-neutral-200" />
          <span className="text-xs text-neutral-400">or</span>
          <div className="h-px flex-1 bg-neutral-200" />
        </div>

        <button
          type="button"
          onClick={onGoogleSignUp}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white text-sm font-medium text-neutral-700 hover:bg-neutral-50"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <p className="pt-2 text-center text-[11px] leading-relaxed text-neutral-500">
          I have read and agree to our{" "}
          <Link href="/terms" className="underline">
            Terms of Use
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline">
            Privacy Policy
          </Link>
          .
        </p>
      </form>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.9v2.33A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.95 10.7a5.4 5.4 0 0 1 0-3.4V4.97H.9a9 9 0 0 0 0 8.06l3.05-2.33Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.9 11.43 0 9 0A9 9 0 0 0 .9 4.97L3.95 7.3C4.66 5.17 6.65 3.58 9 3.58Z"
      />
    </svg>
  );
}
