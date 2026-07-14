"use client";

import { useRouter } from "next/navigation";
import { Tractor } from "lucide-react";

import { BookingStepCard } from "@/components/booking/booking-step-card";
import { BOOKING_STEPS } from "@/lib/booking-steps";
import { useBookingStore } from "@/lib/store/booking-store";

export function ServicesSummary() {
  const router = useRouter();
  const property = useBookingStore((state) => state.property);

  const onContinue = () => {
    router.push(BOOKING_STEPS[3].path);
  };

  return (
    <BookingStepCard
      eyebrow="Step 3 - SERVICES"
      eyebrowDot
      title="Your service"
      description="Lawn mowing, priced to your measured lawn. Here's what every visit includes."
      className="w-full max-w-[708px]"
    >
      <div className="bg-lawn-bg-1 flex w-full items-start gap-6 rounded-xl p-6 shadow-[0px_4px_8px_0px_rgba(74,74,74,0.14)]">
        <div className="flex flex-1 items-start gap-4">
          <div className="lawn-gradient-btn flex items-center rounded-md p-3">
            <Tractor className="size-6 text-white" />
          </div>
          <div className="flex flex-1 flex-col">
            <p className="text-lawn-text-primary font-heading text-2xl leading-8 font-semibold">
              Lawn Mowing
            </p>
            <p className="text-lawn-text-secondary text-base leading-6">
              {property.areaSqFt.toLocaleString(undefined, { maximumFractionDigits: 0 })}{" "}
              sq ft
            </p>
          </div>
        </div>
        <p className="text-lawn-text-primary font-heading text-2xl font-semibold">
          ${property.totalPrice}
          <span className="text-lawn-text-secondary text-base font-medium">/visit</span>
        </p>
      </div>

      <p className="text-lawn-text-secondary text-base leading-6">
        More services- fertilization, weed control, and seasonal cleanups are coming soon.
      </p>

      <div className="flex w-full gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="border-lawn-primary-light text-lawn-primary bg-lawn-bg-2 flex-1 rounded-xl border-[1.2px] px-8 py-3 text-base font-semibold"
        >
          Go back
        </button>
        <button
          type="button"
          onClick={onContinue}
          className="lawn-gradient-btn flex-1 rounded-xl px-8 py-3 text-base font-semibold text-white shadow-[0px_5px_10px_0px_rgba(0,0,0,0.25)] hover:opacity-90"
        >
          Continue
        </button>
      </div>
    </BookingStepCard>
  );
}
