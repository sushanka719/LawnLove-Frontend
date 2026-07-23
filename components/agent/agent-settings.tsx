"use client";

import { useState } from "react";
import { toast } from "sonner";

import { AgentTopbar } from "@/components/agent/agent-topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUpdateProfile } from "@/hooks/use-profile";
import { useSession } from "@/hooks/use-session";
import { ApiError } from "@/lib/api/http";

// Agent (crew owner) settings — wired to the shared profile (better-auth
// update-user). Business-level fields (service area, etc.) have no backend model
// yet, so only the modeled profile fields are editable here.
export function AgentSettings() {
  const { data: session } = useSession();
  const updateProfile = useUpdateProfile();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [seededId, setSeededId] = useState<string | null>(null);

  // Seed the form once the session loads (set-during-render, guarded by the
  // user id so it only runs when a new session arrives).
  const userId = session?.user.id ?? null;
  if (userId && seededId !== userId) {
    setSeededId(userId);
    setName(session?.user.name ?? "");
    setPhone(session?.user.phoneNumber ?? "");
  }

  const save = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      toast.error("Name is required.");
      return;
    }
    try {
      await updateProfile.mutateAsync({
        name: trimmedName,
        phoneNumber: phone.trim(),
      });
      toast.success("Profile updated.");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't save your profile.");
    }
  };

  return (
    <div className="bg-lawn-bg-2 flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl shadow-[0px_0px_12px_2px_rgba(116,116,116,0.1)]">
      <AgentTopbar
        title="Settings"
        subtitle="Your profile and contact details."
        showSearch={false}
        showAction={false}
      />

      <div className="overflow-y-auto p-6 lg:p-8">
        <section className="max-w-3xl rounded-xl border border-[#e5e5e5] p-6 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.06)]">
          <h2 className="text-lawn-text-primary text-lg font-semibold tracking-tight">
            Profile
          </h2>

          <div className="mt-5 flex flex-col gap-4">
            <label className="grid gap-1.5">
              <span className="text-lawn-text-primary text-sm font-medium">Name</span>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-lawn-text-primary text-sm font-medium">
                Phone number
              </span>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="555-123-4567"
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-lawn-text-primary text-sm font-medium">Email</span>
              <Input value={session?.user.email ?? ""} disabled readOnly />
            </label>
          </div>

          <Button className="mt-5" onClick={save} disabled={updateProfile.isPending}>
            {updateProfile.isPending ? "Saving…" : "Save changes"}
          </Button>
        </section>
      </div>
    </div>
  );
}
