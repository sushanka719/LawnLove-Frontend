"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import {
  AuthError,
  buildSetPasswordCallbackURL,
  signUpWithMagicLink,
} from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const RESEND_COOLDOWN_SECONDS = 60;

export function ExpiredLinkCard({
  email,
  name,
  username,
}: {
  email: string | null;
  name: string | null;
  username: string | null;
}) {
  const canResend = !!email && !!name && !!username;
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);
  const [resent, setResent] = useState(false);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const handleResend = async () => {
    if (!canResend || secondsLeft > 0) return;
    setIsResending(true);
    setResendError(null);
    try {
      await signUpWithMagicLink({
        email: email!,
        name: name!,
        username: username!,
        callbackURL: buildSetPasswordCallbackURL(email!, name!, username!),
      });
      setResent(true);
      setSecondsLeft(RESEND_COOLDOWN_SECONDS);
    } catch (error) {
      setResendError(
        error instanceof AuthError ? error.message : "Something went wrong.",
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthCard title="Verification Link Expired">
      <p className="text-lawn-text-secondary text-center text-base">
        Your verification link has expired. Request a new link to continue creating your
        account.
      </p>

      {resent && (
        <p className="text-lawn-text-primary text-center text-sm">
          A new link has been sent to <span className="font-medium">{email}</span>.
        </p>
      )}
      {resendError && (
        <p className="text-destructive text-center text-sm">{resendError}</p>
      )}

      <div className="flex w-full gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleResend}
          disabled={!canResend || isResending || secondsLeft > 0}
          className={cn(
            "h-auto flex-1 rounded-xl border-[1.2px] px-8 py-3 text-base font-semibold",
            "border-lawn-primary-light text-lawn-primary bg-transparent hover:bg-transparent",
          )}
        >
          {isResending
            ? "Resending..."
            : secondsLeft > 0
              ? `Resend in ${secondsLeft}s`
              : "Resend Link"}
        </Button>
        <Button
          render={<Link href="/signup" />}
          className="lawn-gradient-btn h-auto flex-1 rounded-xl px-8 py-3 text-base font-semibold text-white shadow-[0px_5px_10px_0px_rgba(0,0,0,0.25)] hover:opacity-90"
        >
          Back to Sign Up
        </Button>
      </div>
    </AuthCard>
  );
}
