"use client";

import { Logo } from "@/components/auth/logo";
import { useCountdown } from "@/hooks/use-countdown";

interface CheckEmailCardProps {
  email: string;
  onResend: () => Promise<void> | void;
  mailAppUrl?: string;
}

export function CheckEmailCard({
  email,
  onResend,
  mailAppUrl = "https://mail.google.com",
}: CheckEmailCardProps) {
  const { secondsLeft, isDone, reset } = useCountdown(59);

  const handleResend = async () => {
    if (!isDone) return;
    await onResend();
    reset();
  };

  return (
    <div className="text-center">
      <div className="flex justify-center">
        <Logo />
      </div>
      <h1 className="mt-6 text-xl font-semibold text-neutral-900">Check Your Email</h1>
      <p className="mt-2 text-sm leading-relaxed text-neutral-600">
        We&apos;ve sent a verification link to{" "}
        <span className="font-medium text-neutral-800">{email}</span>. Click the link in
        the email to verify your account and continue.
      </p>

      <a
        href={mailAppUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-6 flex h-12 w-full items-center justify-center rounded-full bg-[#1F6B3A] text-sm font-medium text-white hover:bg-[#175229]"
      >
        Open Email
      </a>

      <button
        type="button"
        onClick={handleResend}
        disabled={!isDone}
        className="mt-4 text-xs text-neutral-500 disabled:cursor-not-allowed"
      >
        Not received yet?{" "}
        <span className={isDone ? "font-medium text-[#1F6B3A]" : ""}>
          {isDone ? "Resend" : `Resend after ${secondsLeft} seconds`}
        </span>
      </button>
    </div>
  );
}
