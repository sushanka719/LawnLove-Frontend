"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { BOOKING_STEPS } from "@/lib/booking-steps";
import { useBookingStore } from "@/lib/store/booking-store";
import { useConfirmationStore } from "@/lib/store/confirmation-store";

const CONFIRMED_PATH = "/booking/confirmed";

// The minimal slice of a persisted zustand store the hydration hook needs.
type PersistedStore = {
  persist: {
    onFinishHydration: (onChange: () => void) => () => void;
    hasHydrated: () => boolean;
  };
};

// `true` once the given persisted store has rehydrated from sessionStorage on
// the client. Built on useSyncExternalStore so it reads `false` during SSR and
// the hydration render (matching the server), then flips to `true` — no
// hydration mismatch, and no setState-in-effect.
function useStoreHydrated(store: PersistedStore): boolean {
  return useSyncExternalStore(
    (onChange) => store.persist.onFinishHydration(onChange),
    () => store.persist.hasHydrated(),
    () => false,
  );
}

// Stripe appends these to `return_url` when a payment method redirects the
// browser out to the provider and back (bank/wallet redirects). In that flow
// the payment succeeded but the page we left never reached setConfirmation() —
// so the snapshot is empty yet the arrival at /booking/confirmed is legitimate.
function hasPaymentReturn(params: URLSearchParams): boolean {
  return params.has("redirect_status") || params.has("payment_intent");
}

// The furthest step index the user has actually EARNED, derived from the data
// present in the store — not from which page they navigated from. Anything past
// this index is off-limits (e.g. typing /booking/payment straight into the URL)
// and gets bounced back to the last legitimate step.
//
// Steps: 0 address · 1 property · 2 services · 3 schedule · 4 review · 5 payment
// `services` (2) and `review` (4) collect no data of their own, so they unlock
// alongside the data step next to them: services with property, review/payment
// with schedule.
function furthestAllowedIndex(state: {
  address: { phoneNumber: string; address: string };
  property: { areaSqFt: number };
  schedule: { date: string; timeSlot: string };
}): number {
  const { address, property, schedule } = state;
  if (!address.address.trim() || !address.phoneNumber.trim()) return 0; // address
  if (!(property.areaSqFt > 0)) return 1; // property (services unlocks with it)
  if (!schedule.date.trim() || !schedule.timeSlot.trim()) return 3; // schedule
  return BOOKING_STEPS.length - 1; // schedule done → review + payment unlock
}

export function BookingGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const address = useBookingStore((state) => state.address);
  const property = useBookingStore((state) => state.property);
  const schedule = useBookingStore((state) => state.schedule);
  const confirmation = useConfirmationStore((state) => state.confirmation);

  // Both persisted stores rehydrate from sessionStorage on the client only, so
  // on the server (and the hydration render) they hold empty values. Deciding
  // before hydration would bounce a user who genuinely has data, so we gate
  // every decision on both being ready.
  const bookingReady = useStoreHydrated(useBookingStore);
  const confirmationReady = useStoreHydrated(useConfirmationStore);
  const ready = bookingReady && confirmationReady;

  const currentIndex = BOOKING_STEPS.findIndex((step) => step.path === pathname);
  const maxIndex = furthestAllowedIndex({ address, property, schedule });

  let allowed: boolean;
  if (pathname === CONFIRMED_PATH) {
    // The confirmation page is a post-booking success view, not a flow step, so
    // the maxIndex cap doesn't apply. It's legitimate only when a booking just
    // completed: either we snapshotted its details (inline payment) or Stripe
    // redirected the browser back to it. Any other arrival — typing the URL, or
    // landing mid-flow — must be bounced, both to stop skip-ahead and because
    // the page's mount effect resets the draft (which would wipe a booking in
    // progress).
    allowed = confirmation !== null || hasPaymentReturn(searchParams);
  } else {
    // Other non-flow pages (currentIndex === -1) are never gated; flow steps
    // are capped at the furthest step the user's data has earned.
    allowed = currentIndex === -1 || currentIndex <= maxIndex;
  }

  useEffect(() => {
    if (ready && !allowed) {
      router.replace(BOOKING_STEPS[maxIndex].path);
    }
  }, [ready, allowed, maxIndex, router]);

  // Render nothing until hydrated, and for a disallowed step keep rendering
  // nothing until the redirect above lands — so the gated page never flashes.
  if (!ready || !allowed) {
    return null;
  }

  return <>{children}</>;
}
