"use client";

import { useEffect, useState } from "react";
import { Send, X } from "lucide-react";

import { useInviteAgent } from "@/hooks/use-admin";
import { ApiError } from "@/lib/api/http";
import { emailSchema } from "@/lib/validation/auth-schemas";

const FIELD =
  "border-input bg-background focus:border-ring h-10 w-full rounded-lg border px-3 text-sm outline-none disabled:opacity-60";

export function InviteAgentModal({
  open,
  onClose,
  onSent,
}: {
  open: boolean;
  onClose: () => void;
  onSent: (email: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [business, setBusiness] = useState("");
  const [error, setError] = useState<string | null>(null);
  const invite = useInviteAgent();

  // Close on Escape while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const reset = () => {
    setEmail("");
    setBusiness("");
    setError(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSend = async () => {
    setError(null);
    // Validate against the same email rule the backend enforces.
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please enter a valid email address.");
      return;
    }
    const businessName = business.trim();
    try {
      await invite.mutateAsync({
        email: parsed.data,
        businessName: businessName || undefined,
      });
      const sentEmail = parsed.data;
      reset();
      onSent(sentEmail);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Could not send the invite. Please try again.",
      );
    }
  };

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Invite Agent"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-card w-full max-w-[460px] rounded-[14px] p-[26px] shadow-2xl"
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="text-lg font-semibold tracking-[-0.01em]">Invite Agent</div>
            <div className="text-muted-foreground mt-[3px] text-[13px]">
              Send an invitation to onboard a new lawn care agent.
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="text-muted-foreground hover:bg-accent flex rounded-lg p-1.5 transition-colors"
          >
            <X className="size-[18px]" />
          </button>
        </div>

        <div className="mt-5">
          <label className="mb-1.5 block text-[13px] font-medium">Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") void handleSend();
            }}
            placeholder="agent@example.com"
            disabled={invite.isPending}
            className={FIELD}
          />
        </div>

        <div className="mt-4">
          <label className="mb-1.5 block text-[13px] font-medium">Business name</label>
          <input
            value={business}
            onChange={(e) => setBusiness(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") void handleSend();
            }}
            placeholder="e.g. GreenBlade Lawn Care"
            disabled={invite.isPending}
            className={FIELD}
          />
        </div>

        {error && (
          <p className="text-destructive mt-4 text-[13px]" role="alert">
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={handleClose}
            className="border-border bg-background hover:bg-accent h-10 rounded-lg border px-4 text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void handleSend()}
            disabled={invite.isPending}
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center gap-2 rounded-lg px-[18px] text-sm font-medium transition-colors disabled:opacity-60"
          >
            <Send className="size-[15px]" />
            {invite.isPending ? "Sending..." : "Send Invite"}
          </button>
        </div>
      </div>
    </div>
  );
}
