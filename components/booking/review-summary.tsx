"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { OrderSummarySidebar } from "@/components/booking/order-summary-sidebar";
import { BOOKING_STEPS } from "@/lib/booking-steps";
import { FREQUENCY_LABELS, type Frequency } from "@/lib/pricing";
import { useBookingStore } from "@/lib/store/booking-store";

const TIME_WINDOW_RANGES: Record<string, string> = {
  morning: "8:00 AM - 11:00 AM",
  midday: "11:00 AM - 2:00 PM",
  afternoon: "2:00 PM - 5:00 PM",
  evening: "5:00 PM - 7:00 PM",
};

function formatDate(dateKey: string) {
  if (!dateKey) return "";
  const date = new Date(`${dateKey}T00:00:00`);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function ReviewSummary() {
  const router = useRouter();
  const address = useBookingStore((state) => state.address);
  const property = useBookingStore((state) => state.property);
  const pricing = useBookingStore((state) => state.pricing);
  const schedule = useBookingStore((state) => state.schedule);

  const [promoCode, setPromoCode] = useState("");

  const frequency = (pricing.frequency || "oneTime") as Frequency;
  const timeRange = TIME_WINDOW_RANGES[schedule.timeSlot] ?? "";
  const timeSlotLabel = schedule.timeSlot
    ? `${capitalize(schedule.timeSlot)} (${timeRange})`
    : "";

  const onContinue = () => {
    router.push(BOOKING_STEPS[5].path);
  };

  return (
    <div className="flex w-full flex-col items-start gap-6 lg:flex-row">
      <div className="bg-lawn-bg-2 flex w-full flex-col gap-6 rounded-xl p-8 shadow-[0px_4px_8px_0px_rgba(74,74,74,0.14)] lg:max-w-[1031px]">
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className="bg-lawn-primary-light size-2 shrink-0 rounded-full"
            />
            <p className="text-lawn-primary font-heading text-sm font-semibold">
              Step 5 - REVIEW
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-lawn-text-primary font-heading text-2xl leading-8 font-semibold">
              Review your order
            </h1>
            <p className="text-lawn-text-secondary text-base leading-6">
              Everything looks right? You can still make changes.
            </p>
          </div>
        </div>

        <div className="bg-lawn-bg-2 flex w-full flex-col gap-6 rounded-xl p-6 shadow-[0px_4px_8px_0px_rgba(74,74,74,0.14)]">
          <div className="flex flex-col gap-1.5 border-b border-[#cecece] pb-4">
            <p className="text-lawn-text-tertiary text-base font-medium">Property</p>
            <div className="text-lawn-text-secondary flex items-center justify-between">
              <p className="text-lg font-medium">{address.address}</p>
              <p className="text-xl font-medium">
                {property.areaSqFt.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}{" "}
                sq ft
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 border-b border-[#cecece] pb-4">
            <p className="text-lawn-text-tertiary text-base font-medium">
              Services &bull; {FREQUENCY_LABELS[frequency].title}
            </p>
            <div className="flex items-center justify-between">
              <p className="text-lawn-text-secondary text-lg font-medium">Lawn mowing</p>
              <p className="text-lawn-text-primary text-xl font-semibold">
                ${pricing.subtotal}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="text-lawn-text-tertiary text-base font-medium">First visit</p>
            <div className="text-lawn-text-secondary flex items-center justify-between">
              <p className="text-lg font-medium">{formatDate(schedule.date)}</p>
              <p className="text-xl font-medium">{timeSlotLabel}</p>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col gap-5">
          <p className="text-lawn-text-primary font-heading text-2xl font-semibold">
            Apply promo code
          </p>
          <div className="bg-lawn-bg-2 flex items-center gap-4 rounded-xl p-6 shadow-[0px_4px_8px_0px_rgba(74,74,74,0.14)]">
            <input
              value={promoCode}
              onChange={(event) => setPromoCode(event.target.value)}
              placeholder="TXY-&HJK"
              className="text-lawn-text-tertiary flex-1 rounded-xl border border-[#cecece] px-3 py-2.5 text-lg"
            />
            <button
              type="button"
              className="border-lawn-primary-light text-lawn-primary rounded-xl border-[1.2px] px-8 py-3 text-base font-semibold"
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      <OrderSummarySidebar
        address={address.address}
        areaSqFt={property.estimatedAreaSqFt}
        timeSlotLabel={timeSlotLabel}
        subtotal={pricing.subtotal}
        frequencyLabel={FREQUENCY_LABELS[frequency].title}
        discountPct={pricing.discountPct}
        totalPerVisit={pricing.totalPerVisit}
        cadenceLabel={`$${pricing.totalPerVisit}/${FREQUENCY_LABELS[frequency].title.toLowerCase()}`}
      >
        <button
          type="button"
          onClick={() => router.back()}
          className="border-lawn-primary-light text-lawn-primary bg-lawn-bg-2 w-full rounded-xl border-[1.2px] px-8 py-3 text-base font-semibold"
        >
          Go back
        </button>
        <button
          type="button"
          onClick={onContinue}
          className="lawn-gradient-btn w-full rounded-xl px-8 py-3 text-base font-semibold text-white shadow-[0px_5px_10px_0px_rgba(0,0,0,0.25)] hover:opacity-90"
        >
          Continue to payment
        </button>
      </OrderSummarySidebar>
    </div>
  );
}
