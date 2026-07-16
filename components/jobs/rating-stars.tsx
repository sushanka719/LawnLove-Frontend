"use client";

import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

// Read-only display or interactive selector depending on whether onChange is set.
export function RatingStars({
  value,
  onChange,
  size = "md",
}: {
  value: number;
  onChange?: (value: number) => void;
  size?: "sm" | "md";
}) {
  const interactive = !!onChange;
  const starSize = size === "sm" ? "size-4" : "size-7";

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= value;
        const StarEl = (
          <Star
            className={cn(
              starSize,
              filled
                ? "fill-[#f5b301] text-[#f5b301]"
                : "fill-transparent text-[#d1d1d1]",
            )}
            strokeWidth={1.75}
          />
        );
        return interactive ? (
          <button
            key={star}
            type="button"
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
            onClick={() => onChange?.(star)}
            className="transition hover:scale-110"
          >
            {StarEl}
          </button>
        ) : (
          <span key={star}>{StarEl}</span>
        );
      })}
    </div>
  );
}
