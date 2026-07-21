"use client";

import { useEffect, useState } from "react";
import { Send, X } from "lucide-react";

import { INVITE_REGIONS } from "@/components/admin/dashboard-mock";
import { cn } from "@/lib/utils";

const FIELD =
  "border-input bg-background focus:border-ring h-10 w-full rounded-lg border px-3 text-sm outline-none";

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
  const [region, setRegion] = useState<string>("Texas");

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

  const handleSend = () => {
    onSent(email.trim());
    setEmail("");
    setBusiness("");
    setRegion("Texas");
  };

  return (
    <div
      onClick={onClose}
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
            onClick={onClose}
            aria-label="Close"
            className="text-muted-foreground hover:bg-accent flex rounded-lg p-1.5 transition-colors"
          >
            <X className="size-[18px]" />
          </button>
        </div>

        <div className="mt-5">
          <label className="mb-1.5 block text-[13px] font-medium">Email address</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="agent@example.com"
            className={FIELD}
          />
        </div>

        <div className="mt-4">
          <label className="mb-1.5 block text-[13px] font-medium">Business name</label>
          <input
            value={business}
            onChange={(e) => setBusiness(e.target.value)}
            placeholder="e.g. GreenBlade Lawn Care"
            className={FIELD}
          />
        </div>

        <div className="mt-4">
          <label className="mb-1.5 block text-[13px] font-medium">Service region</label>
          <div className="flex flex-wrap gap-2">
            {INVITE_REGIONS.map((option) => {
              const active = option === region;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setRegion(option)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors",
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground hover:bg-accent",
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="border-border bg-background hover:bg-accent h-10 rounded-lg border px-4 text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSend}
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center gap-2 rounded-lg px-[18px] text-sm font-medium transition-colors"
          >
            <Send className="size-[15px]" />
            Send Invite
          </button>
        </div>
      </div>
    </div>
  );
}
