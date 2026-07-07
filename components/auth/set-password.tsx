"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { setPasswordSchema, type SetPasswordValues } from "@/lib/validation/auth";
import { FloatingPasswordInput } from "@/components/ui/floating-pw-input";
import { AuthSubmitButton } from "@/components/auth/submit-button";
import { Logo } from "@/components/auth/logo";

interface SetPasswordCardProps {
  onSubmit: (values: SetPasswordValues) => Promise<void> | void;
}

export function SetPasswordCard({ onSubmit }: SetPasswordCardProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<SetPasswordValues>({
    resolver: zodResolver(setPasswordSchema),
    mode: "onChange",
    defaultValues: { password: "", confirmPassword: "" },
  });

  return (
    <div>
      <Logo />
      <h1 className="mt-6 text-xl font-semibold text-neutral-900">Set Password</h1>
      <p className="mt-2 text-sm leading-relaxed text-neutral-600">
        Password requires a minimum of 8 characters and contains a mix of letters,
        numbers, and symbols.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-3">
        <FloatingPasswordInput
          label="Password"
          error={errors.password?.message}
          {...register("password")}
        />
        <FloatingPasswordInput
          label="Confirm Password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <div className="pt-2">
          <AuthSubmitButton
            isValid={isValid}
            isSubmitting={isSubmitting}
            disabledLabel="Continue"
            enabledLabel="Continue"
          />
        </div>
      </form>
    </div>
  );
}
