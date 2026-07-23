"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import type { StripeElementsOptions } from "@stripe/stripe-js";
import { toast } from "sonner";

import { OrderSummarySidebar } from "@/components/booking/order-summary-sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/hooks/use-session";
import { useCreateBooking } from "@/hooks/use-booking";
import { ApiError } from "@/lib/api/http";
import { formatCents } from "@/lib/jobs";
import { FREQUENCY_LABELS, type Frequency } from "@/lib/pricing";
import { getStripe, STRIPE_PUBLISHABLE_KEY } from "@/lib/stripe";
import { useBookingStore } from "@/lib/store/booking-store";
import { useConfirmationStore } from "@/lib/store/confirmation-store";
import { TIME_WINDOW_RANGES } from "@/lib/time-windows";

const stripePromise = getStripe();

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

const CARD_SHELL =
  "bg-lawn-bg-2 flex w-full flex-col gap-6 rounded-xl p-8 shadow-[0px_4px_8px_0px_rgba(74,74,74,0.14)] lg:max-w-[1031px]";

function PaymentHeader() {
  return (
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
          Encrypted and secure. Your first payment is collected now to confirm your
          booking.
        </p>
      </div>
    </div>
  );
}

// Inner form — must live inside <Elements> so the Stripe hooks are available.
function PaymentFormBody() {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();

  const address = useBookingStore((state) => state.address);
  const property = useBookingStore((state) => state.property);
  const pricing = useBookingStore((state) => state.pricing);
  const plan = useBookingStore((state) => state.plan);
  const schedule = useBookingStore((state) => state.schedule);
  const promoCode = useBookingStore((state) => state.promoCode);
  const promoDiscountCents = useBookingStore((state) => state.promoDiscountCents);

  const setConfirmation = useConfirmationStore((state) => state.setConfirmation);

  const createBooking = useCreateBooking();
  const [submitting, setSubmitting] = useState(false);

  const frequency = (pricing.frequency || "oneTime") as Frequency;
  const timeRange = TIME_WINDOW_RANGES[schedule.timeSlot] ?? "";
  const timeSlotLabel = schedule.timeSlot
    ? `${capitalize(schedule.timeSlot)} (${timeRange})`
    : "";
  const netCents = Math.max(0, plan.amountCents - promoDiscountCents);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements || submitting) return;

    setSubmitting(true);
    try {
      // Validate the Element before creating the booking / payment intent.
      const { error: submitError } = await elements.submit();
      if (submitError) {
        toast.error(
          submitError.message ?? "Please check your card details and try again.",
        );
        return;
      }

      // Create the booking (pendingPayment) and get the client secret.
      const booking = await createBooking.mutateAsync({
        phone: address.phoneNumber,
        address: address.address,
        lat: address.lat,
        lng: address.lng,
        boundary: property.boundary,
        planId: plan.planId,
        date: schedule.date,
        timeSlot: schedule.timeSlot,
        promoCode: promoCode || undefined,
      });

      // Charge now. redirect:'if_required' keeps card/Link inline (no redirect).
      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        clientSecret: booking.clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/booking/confirmed`,
        },
        redirect: "if_required",
      });

      if (confirmError) {
        toast.error(
          confirmError.message ?? "We couldn't complete your payment. Please try again.",
        );
        return;
      }

      // Snapshot for the confirmation page. The booking store is cleared on the
      // confirmation page (not here) to avoid the route guard racing us back to
      // the address step before the navigation lands.
      setConfirmation({
        bookingId: `LL-${booking.bookingId.slice(-6).toUpperCase()}`,
        rawId: booking.bookingId,
        address: address.address,
        date: schedule.date,
        timeSlot: schedule.timeSlot,
      });

      router.push("/booking/confirmed");
    } catch (err) {
      toast.error(
        err instanceof ApiError
          ? err.message
          : "We couldn't complete your booking. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const disabled = !stripe || !elements || submitting;

  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full flex-col items-start gap-6 lg:flex-row"
    >
      <div className={CARD_SHELL}>
        <PaymentHeader />

        <div className="flex w-full flex-col gap-6 rounded-xl border border-[#cecece] p-6">
          <PaymentElement options={{ layout: "tabs" }} />
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
          disabled={disabled}
          className="lawn-gradient-btn w-full rounded-xl px-8 py-3 text-base font-semibold text-white shadow-[0px_5px_10px_0px_rgba(0,0,0,0.25)] hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Processing..." : `Pay ${formatCents(netCents)}`}
        </button>
      </OrderSummarySidebar>
    </form>
  );
}

function PaymentStatePanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full flex-col items-start gap-6 lg:flex-row">
      <div className={CARD_SHELL}>
        <PaymentHeader />
        {children}
      </div>
    </div>
  );
}

export function PaymentForm() {
  const router = useRouter();
  const { data: session, isLoading: sessionLoading } = useSession();
  const plan = useBookingStore((state) => state.plan);
  const promoDiscountCents = useBookingStore((state) => state.promoDiscountCents);

  // Booking submission requires a signed-in session — bounce guests to login
  // and bring them back to this step afterwards.
  useEffect(() => {
    if (!sessionLoading && !session) {
      router.replace("/login?next=/booking/payment");
    }
  }, [sessionLoading, session, router]);

  // A plan must have been chosen at the schedule step to build the Payment
  // Element (its mode + amount come from the selection).
  useEffect(() => {
    if (!plan.planId || plan.amountCents <= 0) {
      router.replace("/booking/schedule");
    }
  }, [plan.planId, plan.amountCents, router]);

  if (sessionLoading || !session) {
    return (
      <PaymentStatePanel>
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </PaymentStatePanel>
    );
  }

  if (!STRIPE_PUBLISHABLE_KEY) {
    return (
      <PaymentStatePanel>
        <p className="text-destructive text-base">
          Payments aren&apos;t configured yet. Please set
          NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY and try again.
        </p>
      </PaymentStatePanel>
    );
  }

  if (!plan.planId || plan.amountCents <= 0) {
    return (
      <PaymentStatePanel>
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </PaymentStatePanel>
    );
  }

  const options: StripeElementsOptions = {
    mode: plan.billingType === "recurring" ? "subscription" : "payment",
    // Reflect any applied promo discount; the server is still authoritative.
    amount: Math.max(0, plan.amountCents - promoDiscountCents),
    currency: "usd",
    // Card + Link only — matches the server-side payment_method_types so nothing
    // else can be entered. The server list is authoritative.
    paymentMethodTypes: ["card", "link"],
    appearance: { theme: "stripe" },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentFormBody />
    </Elements>
  );
}
