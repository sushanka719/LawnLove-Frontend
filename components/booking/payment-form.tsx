"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { CreditCard } from "lucide-react";
import { toast } from "sonner";

import { OrderSummarySidebar } from "@/components/booking/order-summary-sidebar";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/hooks/use-session";
import { useCreateBooking, useSetupIntent } from "@/hooks/use-booking";
import { ApiError } from "@/lib/api/http";
import { FREQUENCY_LABELS, type Frequency } from "@/lib/pricing";
import { getStripe, STRIPE_PUBLISHABLE_KEY } from "@/lib/stripe";
import { useBookingStore } from "@/lib/store/booking-store";
import { useConfirmationStore } from "@/lib/store/confirmation-store";

const stripePromise = getStripe();

const TIME_WINDOW_RANGES: Record<string, string> = {
  morning: "8:00 AM - 11:00 AM",
  midday: "11:00 AM - 2:00 PM",
  afternoon: "2:00 PM - 5:00 PM",
  evening: "5:00 PM - 7:00 PM",
};

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
          Encrypted and secure. You won&apos;t be charged until your first visit.
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
  const schedule = useBookingStore((state) => state.schedule);
  const storedPayment = useBookingStore((state) => state.payment);
  const setStoredPayment = useBookingStore((state) => state.setPayment);

  const setConfirmation = useConfirmationStore((state) => state.setConfirmation);

  const createBooking = useCreateBooking();
  const [saveCard, setSaveCard] = useState(storedPayment.saveCard);
  const [submitting, setSubmitting] = useState(false);

  const frequency = (pricing.frequency || "oneTime") as Frequency;
  const timeRange = TIME_WINDOW_RANGES[schedule.timeSlot] ?? "";
  const timeSlotLabel = schedule.timeSlot
    ? `${capitalize(schedule.timeSlot)} (${timeRange})`
    : "";

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements || submitting) return;

    setSubmitting(true);
    setStoredPayment({ saveCard });

    try {
      const { error, setupIntent } = await stripe.confirmSetup({
        elements,
        redirect: "if_required",
        confirmParams: {
          return_url: `${window.location.origin}/booking/confirmed`,
        },
      });

      if (error) {
        toast.error(error.message ?? "We couldn't verify your card. Please try again.");
        return;
      }

      const paymentMethod = setupIntent?.payment_method;
      const paymentMethodId =
        typeof paymentMethod === "string" ? paymentMethod : paymentMethod?.id;

      if (!paymentMethodId) {
        toast.error("We couldn't confirm your card. Please try again.");
        return;
      }

      const booking = await createBooking.mutateAsync({
        phone: address.phoneNumber,
        address: address.address,
        lat: address.lat,
        lng: address.lng,
        boundary: property.boundary,
        frequency,
        date: schedule.date,
        timeSlot: schedule.timeSlot,
        paymentMethodId,
        saveCard,
      });

      // Snapshot the details for the confirmation page. The booking store is
      // cleared on the confirmation page (see BookingConfirmed), not here: if we
      // reset it now, the route guard would see an empty store while we're still
      // on /booking/payment and race us back to the address step before the
      // navigation below lands.
      setConfirmation({
        bookingId: `LL-${booking.id.slice(-6).toUpperCase()}`,
        rawId: booking.id,
        address: address.address,
        date: schedule.date,
        timeSlot: schedule.timeSlot,
      });

      router.push("/booking/confirmed");
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "We couldn't complete your booking. Please try again.";
      toast.error(message);
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
            <PaymentElement
              options={{
                layout: "tabs",
                // Card only: the SetupIntent is restricted to `card`, so Link is
                // already excluded; suppress the remaining wallets so nothing
                // but a card can be entered/saved.
                wallets: { applePay: "never", googlePay: "never" },
              }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-lawn-text-primary flex items-center gap-2 text-base font-medium">
            <Checkbox
              checked={saveCard}
              onCheckedChange={(checked) => setSaveCard(checked === true)}
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
          disabled={disabled}
          className="lawn-gradient-btn w-full rounded-xl px-8 py-3 text-base font-semibold text-white shadow-[0px_5px_10px_0px_rgba(0,0,0,0.25)] hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Processing..." : `Pay $${pricing.totalPerVisit}`}
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
  const authenticated = !!session;

  const setupIntent = useSetupIntent(authenticated);

  // Booking submission requires a signed-in session — bounce guests to login
  // and bring them back to this step afterwards.
  useEffect(() => {
    if (!sessionLoading && !session) {
      router.replace("/login?next=/booking/payment");
    }
  }, [sessionLoading, session, router]);

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

  if (setupIntent.isLoading) {
    return (
      <PaymentStatePanel>
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </PaymentStatePanel>
    );
  }

  if (setupIntent.isError || !setupIntent.data?.clientSecret) {
    return (
      <PaymentStatePanel>
        <p className="text-destructive text-base">
          We couldn&apos;t start a secure payment session. Please refresh and try again.
        </p>
      </PaymentStatePanel>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret: setupIntent.data.clientSecret,
        appearance: { theme: "stripe" },
      }}
    >
      <PaymentFormBody />
    </Elements>
  );
}
