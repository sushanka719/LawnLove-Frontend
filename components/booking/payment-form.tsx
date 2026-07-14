"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { FloatingLabelField } from "@/components/booking/floating-label-field";
import { OrderSummarySidebar } from "@/components/booking/order-summary-sidebar";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldError } from "@/components/ui/field";
import { FREQUENCY_LABELS, type Frequency } from "@/lib/pricing";
import { useBookingStore } from "@/lib/store/booking-store";
import {
  paymentStepSchema,
  type PaymentStepValues,
} from "@/lib/validation/booking-schemas";

const TIME_WINDOW_RANGES: Record<string, string> = {
  morning: "8:00 AM - 11:00 AM",
  midday: "11:00 AM - 2:00 PM",
  afternoon: "2:00 PM - 5:00 PM",
  evening: "5:00 PM - 7:00 PM",
};

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function PaymentForm() {
  const router = useRouter();
  const address = useBookingStore((state) => state.address);
  const property = useBookingStore((state) => state.property);
  const pricing = useBookingStore((state) => state.pricing);
  const schedule = useBookingStore((state) => state.schedule);
  const storedPayment = useBookingStore((state) => state.payment);
  const setStoredPayment = useBookingStore((state) => state.setPayment);
  const reset = useBookingStore((state) => state.reset);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<PaymentStepValues>({
    resolver: zodResolver(paymentStepSchema),
    defaultValues: storedPayment,
  });

  const frequency = (pricing.frequency || "oneTime") as Frequency;
  const timeRange = TIME_WINDOW_RANGES[schedule.timeSlot] ?? "";
  const timeSlotLabel = schedule.timeSlot
    ? `${capitalize(schedule.timeSlot)} (${timeRange})`
    : "";

  const onSubmit = (values: PaymentStepValues) => {
    setStoredPayment(values);

    console.log("Booking submitted", {
      address,
      property,
      pricing,
      schedule,
      payment: values,
    });

    toast.success("Booking confirmed! Check the console for the submitted details.");
    reset();
    router.push("/");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col items-start gap-6 lg:flex-row"
    >
      <div className="bg-lawn-bg-2 flex w-full flex-col gap-6 rounded-xl p-8 shadow-[0px_4px_8px_0px_rgba(74,74,74,0.14)] lg:max-w-[1031px]">
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className="bg-lawn-primary-light size-2 shrink-0 rounded-full"
            />
            <p className="text-lawn-primary font-heading text-sm font-semibold">
              Step 6 - PAYMENT
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-lawn-text-primary font-heading text-2xl leading-8 font-semibold">
              Secure Payment
            </h1>
            <p className="text-lawn-text-secondary text-base leading-6">
              Encrypted and secure. You won&apos;t be charged until your first visit.
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col gap-4">
          <div className="bg-lawn-bg-2 flex w-full items-center justify-between rounded-xl p-6 shadow-[0px_4px_8px_0px_rgba(74,74,74,0.14)]">
            <div className="flex items-center gap-3">
              <span className="border-lawn-primary flex size-5 items-center justify-center rounded-full border">
                <span className="bg-lawn-primary size-2.5 rounded-full" />
              </span>
              <CreditCard className="text-lawn-text-secondary size-6" />
              <p className="text-lawn-text-secondary text-xl font-medium">
                Credit or debit card
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-7 w-14 rounded-md bg-[#191f77]" />
              <div className="h-7 w-14 rounded-md bg-red-600" />
            </div>
          </div>

          <div className="flex w-full flex-col gap-6 rounded-xl border border-[#cecece] p-6">
            <div>
              <FloatingLabelField
                label="Card Number"
                inputMode="numeric"
                placeholder="1234 5678 9012 3456"
                {...register("cardNumber")}
                aria-invalid={!!errors.cardNumber}
                className="border-lawn-text-primary"
              />
              <FieldError>{errors.cardNumber?.message}</FieldError>
            </div>

            <div className="flex w-full gap-4">
              <div className="flex-1">
                <FloatingLabelField
                  label="Expiry Date"
                  placeholder="MM/YY"
                  {...register("expiry")}
                  aria-invalid={!!errors.expiry}
                  className="border-lawn-text-primary"
                />
                <FieldError>{errors.expiry?.message}</FieldError>
              </div>
              <div className="flex-1">
                <FloatingLabelField
                  label="CVC"
                  inputMode="numeric"
                  placeholder="123"
                  {...register("cvc")}
                  aria-invalid={!!errors.cvc}
                  className="border-lawn-text-primary"
                />
                <FieldError>{errors.cvc?.message}</FieldError>
              </div>
              <div className="flex-1">
                <FloatingLabelField
                  label="ZIP"
                  inputMode="numeric"
                  placeholder="52342"
                  {...register("zip")}
                  aria-invalid={!!errors.zip}
                  className="border-lawn-text-primary"
                />
                <FieldError>{errors.zip?.message}</FieldError>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-lawn-text-primary flex items-center gap-2 text-base font-medium">
            <Controller
              control={control}
              name="saveCard"
              render={({ field }) => (
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
            Save this card securely for faster checkout next time.
          </label>
          <p className="text-lawn-text-primary text-base font-medium">
            Your card is encrypted and can be removed anytime.
          </p>
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
          type="submit"
          disabled={isSubmitting}
          className="lawn-gradient-btn w-full rounded-xl px-8 py-3 text-base font-semibold text-white shadow-[0px_5px_10px_0px_rgba(0,0,0,0.25)] hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Pay ${pricing.totalPerVisit}
        </button>
      </OrderSummarySidebar>
    </form>
  );
}
