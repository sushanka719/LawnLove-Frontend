"use client";

import { cn } from "@/lib/utils";

/** Pill-style segmented control (the "Today / This Week / …" toggles). */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  size = "md",
}: {
  options: readonly T[];
  value: T;
  onChange: (next: T) => void;
  size?: "sm" | "md";
}) {
  return (
    <div className="bg-muted inline-flex rounded-[10px] p-[3px]">
      {options.map((option) => {
        const active = option === value;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              "cursor-pointer rounded-lg font-medium transition-colors",
              size === "sm" ? "px-3 py-1 text-xs" : "px-3.5 py-1.5 text-[13px]",
              active ? "bg-card text-foreground shadow-xs" : "text-muted-foreground",
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
