"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  paymentMethodsQueryKey,
  usePaymentMethods,
} from "@/hooks/use-payment-methods";
import { ApiError } from "@/lib/api/http";
import {
  createPaymentMethodSetupIntent,
  setDefaultPaymentMethod,
} from "@/lib/api/payment-methods";
import { getStripe, STRIPE_PUBLISHABLE_KEY } from "@/lib/stripe";

const stripePromise = getStripe();

const gradientButtonClasses =
  "lawn-gradient-btn flex shrink-0 items-center gap-2 rounded-xl px-6 py-3 text-base font-semibold tracking-tight whitespace-nowrap text-white shadow-[0px_5px_10px_0px_rgba(0,0,0,0.25)] transition-opacity hover:opacity-90";

// Inner form — lives inside <Elements> so the Stripe hooks are available.
function AddCardForm({
  isFirstCard,
  onSaved,
}: {
  isFirstCard: boolean;
  onSaved: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const queryClient = useQueryClient();

  // A customer's first saved card is forced to be their default; after that,
  // making the new card the default is opt-in.
  const [makeDefault, setMakeDefault] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements || submitting) return;

    setSubmitting(true);
    try {
      const { error, setupIntent } = await stripe.confirmSetup({
        elements,
        redirect: "if_required",
        confirmParams: {
          return_url: `${window.location.origin}/dashboard/payment-methods`,
        },
      });

      if (error) {
        toast.error(
          error.message ?? "We couldn't save your card. Please try again.",
        );
        return;
      }

      const paymentMethod = setupIntent?.payment_method;
      const paymentMethodId =
        typeof paymentMethod === "string" ? paymentMethod : paymentMethod?.id;

      // First card, or the user opted in → mark it the default for charges.
      if (paymentMethodId && (isFirstCard || makeDefault)) {
        try {
          await setDefaultPaymentMethod(paymentMethodId);
        } catch {
          // Non-fatal: the card is saved even if setting the default fails.
        }
      }

      await queryClient.invalidateQueries({ queryKey: paymentMethodsQueryKey });
      toast.success("Card saved.");
      onSaved();
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "We couldn't save your card. Please try again.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const disabled = !stripe || !elements || submitting;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="rounded-xl border border-[#cecece] p-4">
        <PaymentElement options={{ layout: "tabs" }} />
      </div>

      {isFirstCard ? (
        <p className="text-lawn-text-secondary text-sm">
          This will be saved as your default payment method.
        </p>
      ) : (
        <label className="text-lawn-text-primary flex items-center gap-2 text-sm font-medium">
          <Checkbox
            checked={makeDefault}
            onCheckedChange={(checked) => setMakeDefault(checked === true)}
          />
          Set as default payment method
        </label>
      )}

      <button
        type="submit"
        disabled={disabled}
        className="lawn-gradient-btn w-full rounded-xl px-8 py-3 text-base font-semibold text-white shadow-[0px_5px_10px_0px_rgba(0,0,0,0.25)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Saving..." : "Save card"}
      </button>
    </form>
  );
}

export function AddCardButton() {
  const [open, setOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [intentError, setIntentError] = useState(false);

  const { data: cards } = usePaymentMethods();
  const isFirstCard = (cards?.length ?? 0) === 0;

  // Create a fresh SetupIntent when the dialog opens (a SetupIntent can be
  // confirmed only once). Done in the click handler — not an effect — so all
  // state updates happen in event/async callbacks.
  const openDialog = () => {
    setOpen(true);
    if (!STRIPE_PUBLISHABLE_KEY || clientSecret) return;
    setIntentError(false);
    createPaymentMethodSetupIntent()
      .then((res) => setClientSecret(res.clientSecret))
      .catch(() => setIntentError(true));
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    // Drop the used SetupIntent on close so the next open starts a fresh one.
    if (!next) {
      setClientSecret(null);
      setIntentError(false);
    }
  };

  return (
    <>
      <button type="button" onClick={openDialog} className={gradientButtonClasses}>
        <Plus className="size-6" strokeWidth={2} />
        Add card
      </button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="bg-lawn-bg-2 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lawn-primary text-xl font-bold">
              Add a card
            </DialogTitle>
            <DialogDescription className="text-lawn-text-secondary">
              Your card is encrypted by Stripe and can be removed anytime.
            </DialogDescription>
          </DialogHeader>

          {!STRIPE_PUBLISHABLE_KEY ? (
            <p className="text-destructive text-sm">
              Payments aren&apos;t configured yet. Please set
              NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY and try again.
            </p>
          ) : intentError ? (
            <p className="text-destructive text-sm">
              We couldn&apos;t start a secure session. Please close and try again.
            </p>
          ) : clientSecret ? (
            <Elements
              stripe={stripePromise}
              options={{ clientSecret, appearance: { theme: "stripe" } }}
            >
              <AddCardForm
                isFirstCard={isFirstCard}
                onSaved={() => setOpen(false)}
              />
            </Elements>
          ) : (
            <div className="flex flex-col gap-4">
              <Skeleton className="h-28 w-full rounded-xl" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
