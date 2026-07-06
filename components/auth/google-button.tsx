"use client";

import Image from "next/image";

export function GoogleButton({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="border-border text-lawn-text-primary flex h-11 w-full items-center justify-center gap-2 rounded-lg border text-sm font-medium transition-colors hover:bg-black/[0.02] disabled:pointer-events-none disabled:opacity-50"
    >
      <Image src="/auth/google-icon.svg" alt="" width={24} height={24} />
      Continue with Google
    </button>
  );
}
