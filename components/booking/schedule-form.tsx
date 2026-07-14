"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";

import { Calendar } from "@/components/booking/calendar";
import { MeasuredAreaCard } from "@/components/booking/measured-area-card";
import { BOOKING_STEPS } from "@/lib/booking-steps";
import { cn } from "@/lib/utils";
import { computeQuote, FREQUENCY_LABELS, type Frequency } from "@/lib/pricing";
import { useBookingStore } from "@/lib/store/booking-store";

const TIME_WINDOWS = [
  { value: "morning", title: "Morning", range: "8:00 AM - 11:00 AM" },
  { value: "midday", title: "Midday", range: "11:00 AM - 2:00 PM" },
  { value: "afternoon", title: "Afternoon", range: "2:00 PM - 5:00 PM" },
  { value: "evening", title: "Evening", range: "5:00 PM - 7:00 PM" },
] as const;

const FREQUENCY_ORDER: Frequency[] = ["weekly", "biweekly", "monthly", "oneTime"];

export function ScheduleForm() {
  const router = useRouter();
  const property = useBookingStore((state) => state.property);
  const schedule = useBookingStore((state) => state.schedule);
  const setSchedule = useBookingStore((state) => state.setSchedule);
  const pricing = useBookingStore((state) => state.pricing);
  const setPricing = useBookingStore((state) => state.setPricing);

  const frequency = (pricing.frequency || "oneTime") as Frequency;
  const { date, timeSlot } = schedule;

  const quote = useMemo(
    () => computeQuote(property.estimatedAreaSqFt, frequency),
    [property.estimatedAreaSqFt, frequency],
  );

  const setFrequency = (next: Frequency) => {
    setPricing({ ...computeQuote(property.estimatedAreaSqFt, next), frequency: next });
  };

  const canContinue = Boolean(frequency && date && timeSlot);

  const handleContinue = () => {
    setPricing({ ...quote, frequency });
    router.push(BOOKING_STEPS[4].path);
  };

  return (
    <div className="flex w-full flex-col items-start gap-6 lg:flex-row">
      <div className="flex w-full flex-col gap-6 lg:max-w-[1031px]">
        <div className="bg-lawn-bg-2 flex w-full flex-col gap-6 rounded-xl p-8 shadow-[0px_4px_8px_0px_rgba(74,74,74,0.14)]">
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className="bg-lawn-primary-light size-2 shrink-0 rounded-full"
              />
              <p className="text-lawn-primary font-heading text-sm font-semibold">
                Step 4 - SCHEDULE
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-lawn-text-primary font-heading text-2xl leading-8 font-semibold">
                When should we come?
              </h1>
              <p className="text-lawn-text-secondary text-base leading-6">
                Pick how often, then choose your first visit.
              </p>
            </div>
          </div>

          <div className="flex w-full gap-6">
            {FREQUENCY_ORDER.map((option) => {
              const isSelected = frequency === option;
              const label = FREQUENCY_LABELS[option];
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFrequency(option)}
                  className={cn(
                    "flex flex-1 flex-col items-center rounded-xl border px-6 py-4",
                    isSelected
                      ? "bg-lawn-bg-1 border-lawn-primary text-lawn-primary shadow-[0_0_0_4px_rgba(25,81,52,0.2)]"
                      : "text-lawn-text-secondary border-[#cecece]",
                  )}
                >
                  <p className="text-xl font-semibold">{label.title}</p>
                  <p className="text-lg font-medium">{label.subtitle}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-start">
          <Calendar
            selectedDate={date}
            onSelectDate={(dateKey) => setSchedule({ ...schedule, date: dateKey })}
          />

          <div className="flex flex-1 flex-col gap-4">
            <p className="text-lawn-text-tertiary font-heading text-lg font-semibold">
              TIME WINDOW
            </p>
            <div className="grid grid-cols-2 gap-4">
              {TIME_WINDOWS.map((option) => {
                const isSelected = timeSlot === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSchedule({ ...schedule, timeSlot: option.value })}
                    className={cn(
                      "flex flex-col items-start gap-0.5 rounded-xl border px-6 py-4 text-left",
                      isSelected
                        ? "bg-lawn-bg-1 border-lawn-primary text-lawn-primary shadow-[0_0_0_4px_rgba(25,81,52,0.2)]"
                        : "border-[#cecece]",
                    )}
                  >
                    <p
                      className={cn(
                        "text-xl font-semibold",
                        !isSelected && "text-lawn-text-primary",
                      )}
                    >
                      {option.title}
                    </p>
                    <p
                      className={cn(
                        "text-lg font-medium",
                        !isSelected && "text-lawn-text-secondary",
                      )}
                    >
                      {option.range}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col gap-6 lg:max-w-[449px]">
        <MeasuredAreaCard
          areaSqFt={property.areaSqFt}
          estimatedAreaSqFt={property.estimatedAreaSqFt}
          totalPrice={property.totalPrice}
        />

        <div className="flex w-full flex-col gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="border-lawn-primary-light text-lawn-primary bg-lawn-bg-2 w-full rounded-xl border-[1.2px] px-8 py-3 text-base font-semibold"
          >
            Go back
          </button>
          <button
            type="button"
            disabled={!canContinue}
            onClick={handleContinue}
            className="lawn-gradient-btn w-full rounded-xl px-8 py-3 text-base font-semibold text-white shadow-[0px_5px_10px_0px_rgba(0,0,0,0.25)] hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continue to review
          </button>
        </div>
      </div>
    </div>
  );
}
