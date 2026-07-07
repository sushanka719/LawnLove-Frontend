import { forwardRef, useId, useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

interface FloatingPasswordInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label: string;
  error?: string;
}

export const FloatingPasswordInput = forwardRef<
  HTMLInputElement,
  FloatingPasswordInputProps
>(({ label, error, id, className = "", onFocus, onBlur, ...props }, ref) => {
  const autoId = useId();
  const inputId = id ?? autoId;
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
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
          type={visible ? "text" : "password"}
          placeholder={showLabel ? "" : label}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          className={`h-14 w-full rounded-xl border bg-white px-4 pr-11 text-sm text-neutral-900 placeholder:text-neutral-400 focus:ring-2 focus:ring-[#1F6B3A]/30 focus:outline-none ${showLabel ? "pt-4" : ""} ${error ? "border-red-400" : "border-neutral-200 focus:border-[#1F6B3A]"}`}
          {...props}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setVisible((v) => !v)}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
});
FloatingPasswordInput.displayName = "FloatingPasswordInput";
