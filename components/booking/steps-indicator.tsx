"use client";

import { usePathname } from "next/navigation";
import { Check } from "lucide-react";

import { BOOKING_STEPS } from "@/lib/booking-steps";
import { cn } from "@/lib/utils";

export function StepsIndicator() {
  const pathname = usePathname();
  const activeIndex = BOOKING_STEPS.findIndex((step) => step.path === pathname);

  // Hide the step tracker on booking pages that aren't one of the flow steps
  // (e.g. the confirmation page).
  if (activeIndex === -1) {
    return null;
  }

  const currentStep = activeIndex + 1;

  return (
    <ol className="flex w-full items-start justify-between gap-2 px-4 py-6 sm:px-6 lg:px-10 xl:px-16 2xl:px-[240px]">
      {BOOKING_STEPS.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;
        const isLast = index === BOOKING_STEPS.length - 1;

        return (
          <li key={step.slug} className="flex flex-1 items-start last:flex-none">
            <div className="flex flex-col items-center gap-3">
              <div
                className={cn(
                  "bg-lawn-bg-1 flex size-10 shrink-0 items-center justify-center rounded-full",
                  isActive && "border-lawn-primary-light border",
                  isCompleted &&
                    "lawn-gradient-btn shadow-[0px_0px_4px_4px_rgba(43,180,109,0.4)]",
                )}
              >
                {isCompleted ? (
                  <Check className="size-5 text-white" />
                ) : (
                  <span className="text-lawn-primary font-heading text-base font-semibold">
                    {stepNumber}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  "font-heading text-base font-semibold whitespace-nowrap",
                  isActive || isCompleted
                    ? "text-lawn-text-primary"
                    : "text-lawn-text-tertiary",
                )}
              >
                {step.label}
              </span>
            </div>

            {!isLast && (
              <div
                aria-hidden
                className="border-lawn-badge-border mt-5 ml-2 h-0 flex-1 border-t border-dashed"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
