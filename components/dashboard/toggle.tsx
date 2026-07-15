"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

/** Presentational switch. Toggles its own local state on click (no persistence
 * yet) so the control feels live in the static dashboard. */
export function Toggle({
  defaultOn = false,
  label,
}: {
  defaultOn?: boolean;
  label?: string;
}) {
  const [on, setOn] = useState(defaultOn);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => setOn((v) => !v)}
      className={cn(
        "relative h-[31px] w-[51px] shrink-0 rounded-full transition-colors",
        on ? "bg-lawn-primary-light" : "bg-[#cecece]",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 size-[27px] rounded-full bg-white shadow-sm transition-transform",
          on && "translate-x-[20px]",
        )}
      />
    </button>
  );
}
