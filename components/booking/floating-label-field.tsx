"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type FloatingLabelFieldProps = React.ComponentProps<typeof Input> & {
  label: string;
  icon?: React.ReactNode;
};

export const FloatingLabelField = React.forwardRef<
  HTMLInputElement,
  FloatingLabelFieldProps
>(
  (
    { label, icon, className, defaultValue, onChange, onFocus, onBlur, id, ...props },
    ref,
  ) => {
    const generatedId = React.useId();
    const fieldId = id ?? generatedId;
    const [focused, setFocused] = React.useState(false);
    const [filled, setFilled] = React.useState(Boolean(defaultValue));
    const floated = focused || filled;

    return (
      <div
        className={cn(
          "border-input focus-within:border-lawn-text-secondary has-aria-[invalid=true]:border-destructive relative flex h-12 w-full items-center gap-2 rounded-[10px] border bg-transparent px-4",
          className,
        )}
      >
        {floated && icon}
        <Input
          {...props}
          id={fieldId}
          ref={ref}
          defaultValue={defaultValue}
          placeholder={floated ? undefined : label}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          onChange={(event) => {
            setFilled(event.target.value.length > 0);
            onChange?.(event);
          }}
          className="text-lawn-text-primary h-auto flex-1 border-0 bg-transparent p-0 text-base focus-visible:ring-0"
        />
        {floated && (
          <label
            htmlFor={fieldId}
            className="bg-lawn-bg-2 text-lawn-text-primary pointer-events-none absolute -top-2.5 left-4 px-1.5 text-sm font-medium"
          >
            {label}
          </label>
        )}
      </div>
    );
  },
);
FloatingLabelField.displayName = "FloatingLabelField";
