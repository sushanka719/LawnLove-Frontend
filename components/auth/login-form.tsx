"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginValues } from "@/lib/validation/auth";
import { FloatingInput } from "@/components/ui/floating-input";
import { FloatingPasswordInput } from "@/components/ui/floating-pw-input";
import { SubmitButton } from "@/components/auth/submit-button";
import { Logo } from "@/components/auth/logo";

interface LoginFormProps {
  onSubmit: (values: LoginValues) => Promise<void> | void;
  onGoogleLogin?: () => void;
}

export function LoginForm({ onSubmit, onGoogleLogin }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: { fullName: "", password: "", rememberMe: false },
  });

  return (
    <div>
      <Logo />
      <h1 className="mt-6 text-xl font-semibold text-neutral-900">Welcome Back!</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-3">
        <FloatingInput
          label="Full Name"
          error={errors.fullName?.message}
          {...register("fullName")}
        />
        <FloatingPasswordInput
          label="Password"
          error={errors.password?.message}
          {...register("password")}
        />

        <div className="flex items-center justify-between pt-1 text-xs">
          <label className="flex items-center gap-2 text-neutral-600">
            <input
              type="checkbox"
              {...register("rememberMe")}
              className="h-3.5 w-3.5 rounded border-neutral-300 accent-[#1F6B3A]"
            />
            Remember me
          </label>
          <Link href="/forgot-password" className="font-medium text-[#1F6B3A]">
            Forgot Password
          </Link>
        </div>

        <div className="pt-2">
          <SubmitButton
            isValid={isValid}
            isSubmitting={isSubmitting}
            disabledLabel="Continue"
            enabledLabel="Login"
          />
        </div>

        <p className="text-center text-xs text-neutral-600">
          Don&apos;t have account{" "}
          <Link href="/signup" className="font-medium text-[#1F6B3A]">
            Sign up
          </Link>
        </p>

        <div className="flex items-center gap-3 py-1">
          <div className="h-px flex-1 bg-neutral-200" />
          <span className="text-xs text-neutral-400">or</span>
          <div className="h-px flex-1 bg-neutral-200" />
        </div>

        <button
          type="button"
          onClick={onGoogleLogin}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white text-sm font-medium text-neutral-700 hover:bg-neutral-50"
        >
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
