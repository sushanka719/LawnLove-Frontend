import { forwardRef, useId, useState, type InputHTMLAttributes } from "react";

interface FloatingInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const FloatingInput = forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ label, error, id, className = "", onFocus, onBlur, ...props }, ref) => {
    const autoId = useId();
    const inputId = id ?? autoId;
    const [focused, setFocused] = useState(false);
    const hasValue = Boolean(props.value ?? props.defaultValue);
    const showLabel = focused || hasValue;

    return (
      <div className={className}>
        <div className="relative">
          {showLabel && (
            <label
              htmlFor={inputId}
              className="absolute top-1.5 left-4 text-xs font-medium text-neutral-500"
            >
              {label}
            </label>
          )}
          <input
            id={inputId}
            ref={ref}
            placeholder={showLabel ? "" : label}
            onFocus={(e) => {
              setFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              onBlur?.(e);
            }}
            className={`h-14 w-full rounded-xl border bg-white px-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:ring-2 focus:ring-[#1F6B3A]/30 focus:outline-none ${showLabel ? "pt-4" : ""} ${error ? "border-red-400" : "border-neutral-200 focus:border-[#1F6B3A]"}`}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  },
);
FloatingInput.displayName = "FloatingInput";
