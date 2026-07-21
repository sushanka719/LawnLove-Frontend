"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

/**
 * A switch that works either controlled or uncontrolled.
 *
 * - Pass `checked` + `onChange` to control it (persisted preferences).
 * - Omit both and it manages its own state, seeded from `defaultOn`.
 * - `disabled` dims the control and blocks interaction (e.g. a not-yet-shipped
 *   channel).
 */
export function Toggle({
  defaultOn = false,
  checked,
  onChange,
  disabled = false,
  label,
}: {
  defaultOn?: boolean;
  checked?: boolean;
  onChange?: (next: boolean) => void;
  disabled?: boolean;
  label?: string;
}) {
  const isControlled = checked !== undefined;
  const [internalOn, setInternalOn] = useState(defaultOn);
  const on = isControlled ? checked : internalOn;

  const handleClick = () => {
    if (disabled) return;
    const next = !on;
    if (!isControlled) setInternalOn(next);
    onChange?.(next);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        "relative h-[31px] w-[51px] shrink-0 rounded-full transition-colors",
        on ? "bg-lawn-primary-light" : "bg-[#cecece]",
        disabled && "cursor-not-allowed opacity-50",
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
