"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { agentJobQueryKey } from "@/hooks/use-agent";
import {
  createPhotoUploadUrl,
  registerPhoto,
  uploadFileToR2,
  type AgentJobPhoto,
  type PhotoType,
} from "@/lib/api/agent";
import { ApiError } from "@/lib/api/http";
import { getCurrentPosition } from "@/lib/geolocation";

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

// One before/after capture group: shows already-uploaded thumbnails and a
// capture button that runs the presign → PUT-to-R2 → register-metadata flow.
export function PhotoCapture({
  jobId,
  type,
  photos,
  disabled,
}: {
  jobId: string;
  type: PhotoType;
  photos: AgentJobPhoto[];
  disabled?: boolean;
}) {
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const label = type === "before" ? "Before" : "After";

  const onFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Reset so re-selecting the same file still fires onChange.
    event.target.value = "";
    if (!file) return;

    if (!ACCEPTED.includes(file.type)) {
      toast.error("Please use a JPEG, PNG, or WebP image.");
      return;
    }

    setUploading(true);
    try {
      // Best-effort geo-stamp — don't block the upload if the agent declines.
      let coords: { lat?: number; lng?: number } = {};
      try {
        coords = await getCurrentPosition();
      } catch {
        coords = {};
      }

      const { uploadUrl, key } = await createPhotoUploadUrl(jobId, {
        type,
        contentType: file.type,
      });
      await uploadFileToR2(uploadUrl, file);
      await registerPhoto(jobId, {
        type,
        key,
        lat: coords.lat,
        lng: coords.lng,
        takenAt: new Date().toISOString(),
      });
      await queryClient.invalidateQueries({ queryKey: agentJobQueryKey(jobId) });
      toast.success(`${label} photo added.`);
    } catch (err) {
      toast.error(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Upload failed. Please try again.",
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-[#cecece]/60 p-4">
      <div className="flex items-center justify-between">
        <p className="text-lawn-text-primary text-base font-semibold">{label} photos</p>
        <span className="text-lawn-text-tertiary text-sm">{photos.length} added</span>
      </div>

      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="relative aspect-square overflow-hidden rounded-lg bg-neutral-100"
            >
              <Image
                src={photo.url}
                alt={`${label} photo`}
                fill
                sizes="120px"
                className="object-cover"
                unoptimized
              />
            </div>
          ))}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={onFile}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled || uploading}
        className="border-lawn-primary-light text-lawn-primary flex items-center justify-center gap-2 rounded-xl border-[1.2px] px-4 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
      >
        {uploading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Camera className="size-4" />
        )}
        {uploading ? "Uploading..." : `Add ${label.toLowerCase()} photo`}
      </button>
    </div>
  );
}
