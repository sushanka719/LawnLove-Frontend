"use client";

import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

import { Calendar } from "@/components/booking/calendar";
import { MeasuredAreaCard } from "@/components/booking/measured-area-card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePlans } from "@/hooks/use-plans";
import { usePricingSettings } from "@/hooks/use-pricing-settings";
import type { Plan } from "@/lib/api/plans";
import { BOOKING_STEPS } from "@/lib/booking-steps";
import { formatCents } from "@/lib/jobs";
import { computePlanQuote, isOverMaxArea, type Frequency } from "@/lib/pricing";
import { planBillingLabel } from "@/lib/plans";
import { useBookingStore } from "@/lib/store/booking-store";
import { TIME_WINDOWS } from "@/lib/time-windows";
import { cn } from "@/lib/utils";

export function ScheduleForm() {
  const router = useRouter();
  const property = useBookingStore((state) => state.property);
  const schedule = useBookingStore((state) => state.schedule);
  const setSchedule = useBookingStore((state) => state.setSchedule);
  const plan = useBookingStore((state) => state.plan);
  const setPlan = useBookingStore((state) => state.setPlan);
  const setPricing = useBookingStore((state) => state.setPricing);
  const selectedPricing = useBookingStore((state) => state.pricing);

  const { data: plans, isLoading: plansLoading, isError: plansError } = usePlans();
  const {
    data: pricing,
    isLoading: pricingLoading,
    isError: pricingError,
  } = usePricingSettings();

  const isLoading = plansLoading || pricingLoading;
  const isError = plansError || pricingError;
  const tiers = pricing?.areaTiers ?? [];

  // Global maximum serviceable area — a lawn beyond it can't be booked (the
  // server rejects it too). Block the whole step with a clear message.
  const overMaxArea = isOverMaxArea(
    pricing?.maxAreaSqFt ?? null,
    property.estimatedAreaSqFt,
  );

  const { date, timeSlot } = schedule;
  const canContinue = Boolean(plan.planId && date && timeSlot) && !overMaxArea;

  const selectPlan = (selected: Plan) => {
    const { basePrice, totalPerVisit } = computePlanQuote(
      selected.basePrice,
      tiers,
      property.estimatedAreaSqFt,
    );
    setPlan({
      planId: selected.id,
      billingType: selected.billingType,
      amountCents: totalPerVisit,
    });
    const frequency: Frequency =
      selected.billingType === "oneTime" ? "oneTime" : (selected.interval ?? "oneTime");
    setPricing({
      subtotal: Math.round(basePrice / 100),
      frequency,
      discountPct: 0,
      totalPerVisit: Math.round(totalPerVisit / 100),
    });
  };

  const handleContinue = () => {
    if (!canContinue) return;
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
                Pick a plan, then choose your first visit.
              </p>
            </div>
          </div>

          {isError ? (
            <p className="text-destructive text-base">
              We couldn&apos;t load plans. Please refresh and try again.
            </p>
          ) : isLoading || !plans ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-40 w-full rounded-xl" />
              ))}
            </div>
          ) : overMaxArea ? (
            <div className="border-destructive/30 bg-destructive/5 flex flex-col gap-1 rounded-xl border p-5">
              <p className="text-destructive text-base font-semibold">
                This lawn is larger than we currently service.
              </p>
              <p className="text-lawn-text-secondary text-sm">
                Please contact us for a custom quote — we&apos;d still love to help with a
                property this size.
              </p>
            </div>
          ) : plans.length === 0 ? (
            <p className="text-lawn-text-secondary text-base">
              No plans are available right now. Please check back soon.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {plans.map((option) => {
                const isSelected = plan.planId === option.id;
                const { totalPerVisit } = computePlanQuote(
                  option.basePrice,
                  tiers,
                  property.estimatedAreaSqFt,
                );
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => selectPlan(option)}
                    className={cn(
                      "flex flex-col items-start gap-2 rounded-xl border p-5 text-left transition",
                      isSelected
                        ? "bg-lawn-bg-1 border-lawn-primary shadow-[0_0_0_4px_rgba(25,81,52,0.2)]"
                        : "hover:border-lawn-primary/50 border-[#cecece]",
                    )}
                  >
                    <div className="flex w-full items-start justify-between gap-2">
                      <div>
                        <p
                          className={cn(
                            "text-xl font-semibold",
                            isSelected ? "text-lawn-primary" : "text-lawn-text-primary",
                          )}
                        >
                          {option.name}
                        </p>
                        <p className="text-lawn-text-secondary text-sm font-medium">
                          {planBillingLabel(option)}
                        </p>
                      </div>
                      <p className="text-lawn-primary shrink-0 text-lg font-semibold">
                        {formatCents(totalPerVisit)}
                        {option.billingType === "recurring" ? (
                          <span className="text-lawn-text-tertiary text-sm font-medium">
                            {" "}
                            /visit
                          </span>
                        ) : null}
                      </p>
                    </div>
                    {option.features.length > 0 && (
                      <ul className="flex flex-col gap-1">
                        {option.features.map((feature) => (
                          <li
                            key={feature}
                            className="text-lawn-text-secondary flex items-center gap-1.5 text-sm"
                          >
                            <Check className="text-lawn-primary size-3.5 shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}
                  </button>
                );
              })}
            </div>
          )}
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
          totalPrice={plan.planId ? selectedPricing.totalPerVisit : undefined}
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
