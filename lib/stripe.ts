import { loadStripe, type Stripe } from "@stripe/stripe-js";

export const STRIPE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";

let stripePromise: Promise<Stripe | null> | null = null;

// Lazily create a single Stripe instance shared across the app. Returns null if
// the publishable key isn't configured, so callers can surface a clear message
// instead of crashing.
export function getStripe(): Promise<Stripe | null> {
  if (!STRIPE_PUBLISHABLE_KEY) {
    return Promise.resolve(null);
  }
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
}
