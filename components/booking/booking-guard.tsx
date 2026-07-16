"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";

import { BOOKING_STEPS } from "@/lib/booking-steps";
import { useBookingStore } from "@/lib/store/booking-store";

// `true` once the persisted store has rehydrated from sessionStorage on the
// client. Built on useSyncExternalStore so it reads `false` during SSR and the
// hydration render (matching the server), then flips to `true` — no hydration
// mismatch, and no setState-in-effect.
function useBookingStoreHydrated(): boolean {
  return useSyncExternalStore(
    (onChange) => useBookingStore.persist.onFinishHydration(onChange),
    () => useBookingStore.persist.hasHydrated(),
    () => false,
  );
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

  const address = useBookingStore((state) => state.address);
  const property = useBookingStore((state) => state.property);
  const schedule = useBookingStore((state) => state.schedule);

  // The persisted store rehydrates from sessionStorage on the client only, so
  // on the server (and the hydration render) it holds empty values. Deciding
  // before hydration would bounce a user who genuinely has data, so we gate
  // every decision on this flag.
  const ready = useBookingStoreHydrated();

  const currentIndex = BOOKING_STEPS.findIndex((step) => step.path === pathname);
  const maxIndex = furthestAllowedIndex({ address, property, schedule });
  // Non-flow pages (currentIndex === -1, e.g. /booking/confirmed) are never gated.
  const allowed = currentIndex === -1 || currentIndex <= maxIndex;

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
