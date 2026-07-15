"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api/http";
import { cn } from "@/lib/utils";

const RESEND_COOLDOWN_SECONDS = 60;

// Shared expired-link screen for the email flows that land back here with
// `?error=INVALID_TOKEN` (signup magic link → /set-password, password reset →
// /reset-password). Each flow supplies its own copy, resend action, and the
// destination for the "back" button; the cooldown/resend/error state machine
// lives here so both stay in sync.
export function ExpiredLinkCard({
  title,
  description,
  email,
  canResend,
  onResend,
  backHref,
  backLabel,
}: {
  title: string;
  description: string;
  email: string | null;
  canResend: boolean;
  onResend: () => Promise<unknown>;
  backHref: string;
  backLabel: string;
}) {
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
      await onResend();
      setResent(true);
      setSecondsLeft(RESEND_COOLDOWN_SECONDS);
    } catch (error) {
      setResendError(error instanceof ApiError ? error.message : "Something went wrong.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthCard title={title}>
      <p className="text-lawn-text-secondary text-center text-base">{description}</p>

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
          render={<Link href={backHref} />}
          className="lawn-gradient-btn h-auto flex-1 rounded-xl px-8 py-3 text-base font-semibold text-white shadow-[0px_5px_10px_0px_rgba(0,0,0,0.25)] hover:opacity-90"
        >
          {backLabel}
        </Button>
      </div>
    </AuthCard>
  );
}
