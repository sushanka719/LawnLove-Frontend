"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const AuthTextField = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof Input>
>(function AuthTextField({ className, placeholder, id, ...props }, ref) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;

  return (
    <div className="relative w-full">
      <Input
        id={inputId}
        ref={ref}
        placeholder=" "
        className={cn(
          "bg-lawn-bg-2 border-border text-lawn-text-primary peer h-auto w-full rounded-[10px] px-4 pt-4 pb-1.5 text-base",
          className,
        )}
        {...props}
      />
      {placeholder && (
        <label
          htmlFor={inputId}
          className="text-lawn-text-secondary bg-lawn-bg-2 peer-focus:text-lawn-primary pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 rounded px-1 text-base transition-all duration-150 ease-out peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:-translate-y-1/2 peer-not-placeholder-shown:text-xs peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs"
        >
          {placeholder}
        </label>
      )}
    </div>
  );
});
