"use client";

import { useState } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

export function getInitials(name?: string, email?: string) {
  if (name) {
    const parts = name.trim().split(/\s+/);
    return (
      parts
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("") || "?"
    );
  }
  return email?.[0]?.toUpperCase() ?? "?";
}

// A small fixed palette so an initials avatar keeps a stable, distinct color
// without the API having to supply one. Chosen deterministically from a seed
// (e.g. the user id), so the same person always gets the same color.
const AVATAR_COLORS = ["#4f46e5", "#9333ea", "#d97706", "#0d9488", "#0e7490", "#ca8a04"];

export function avatarColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

// Round user avatar that renders the uploaded photo when present and always
// falls back to the initials circle when there's no image OR the image fails to
// load (broken/expired URL, network error). Shared by the sidebar card and the
// profile page so the fallback behavior stays consistent.
export function UserAvatar({
  name,
  email,
  image,
  className,
  textClassName,
  sizes,
}: {
  name?: string;
  email?: string;
  image?: string | null;
  // Sizing/shape of the avatar container (e.g. "size-10", "size-22").
  className?: string;
  // Font size for the initials fallback (e.g. "text-[19px]", "text-3xl").
  textClassName?: string;
  // next/image `sizes` hint matching the rendered pixel size (e.g. "40px").
  sizes?: string;
}) {
  // Track the specific URL that failed rather than a boolean, so a new upload
  // (a different URL) automatically gets another chance without an effect.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = !!image && failedSrc !== image;

  return (
    <div className={cn("relative shrink-0 overflow-hidden rounded-full", className)}>
      {showImage ? (
        <Image
          src={image}
          alt={name ? `${name}'s profile photo` : "Profile photo"}
          fill
          sizes={sizes}
          className="object-cover"
          unoptimized
          onError={() => setFailedSrc(image)}
        />
      ) : (
        <div
          className={cn(
            "flex size-full items-center justify-center bg-[#fecd03] font-medium text-white uppercase",
            textClassName,
          )}
        >
          {getInitials(name, email)}
        </div>
      )}
    </div>
  );
}
