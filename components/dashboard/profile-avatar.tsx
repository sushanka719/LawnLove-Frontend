"use client";

import { useRef } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { UserAvatar } from "@/components/dashboard/user-avatar";
import { useUpdateAvatar } from "@/hooks/use-profile";
import { ApiError } from "@/lib/api/http";
import {
  ACCEPTED_AVATAR_TYPES,
  AVATAR_ERROR_MESSAGE,
  MAX_AVATAR_BYTES,
} from "@/lib/validation/profile-schemas";

// Avatar + "Upload photo" control. The photo/initials-fallback rendering lives
// in the shared UserAvatar; this adds the upload flow and in-progress overlay.
export function ProfileAvatar({
  name,
  email,
  image,
}: {
  name: string;
  email?: string;
  image?: string | null;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutateAsync, isPending } = useUpdateAvatar();

  const onFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Reset so re-selecting the same file still fires onChange.
    event.target.value = "";
    if (!file) return;

    if (
      !ACCEPTED_AVATAR_TYPES.includes(
        file.type as (typeof ACCEPTED_AVATAR_TYPES)[number],
      ) ||
      file.size > MAX_AVATAR_BYTES
    ) {
      toast.error(AVATAR_ERROR_MESSAGE);
      return;
    }

    try {
      await mutateAsync(file);
      toast.success("Profile photo updated.");
    } catch (err) {
      toast.error(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Upload failed. Please try again.",
      );
    }
  };

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-6">
        <div className="relative size-22 shrink-0">
          <UserAvatar
            name={name}
            email={email}
            image={image}
            className="size-full"
            textClassName="text-3xl"
            sizes="88px"
          />
          {isPending && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
              <Loader2 className="size-6 animate-spin text-white" />
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-col gap-1">
          <p className="text-lawn-text-primary truncate text-xl font-bold tracking-tight">
            {name}
          </p>
          <p className="text-lawn-text-secondary text-lg font-medium tracking-tight">
            Manage your personal details and contact info.
          </p>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={onFile}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isPending}
        className="border-lawn-primary-light text-lawn-primary hover:bg-lawn-primary-light/10 flex shrink-0 items-center gap-2 rounded-xl border-[1.2px] px-8 py-3 text-base font-semibold tracking-tight whitespace-nowrap transition-colors disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending && <Loader2 className="size-4 animate-spin" />}
        {isPending ? "Uploading..." : "Upload photo"}
      </button>
    </div>
  );
}
