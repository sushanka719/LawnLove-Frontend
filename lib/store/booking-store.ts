import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { Frequency } from "@/lib/pricing";
import type { PlanBillingType } from "@/lib/api/plans";

export type AddressData = {
  phoneNumber: string;
  address: string;
  lat: number | null;
  lng: number | null;
};

export type PropertyData = {
  boundary: { lat: number; lng: number }[];
  areaSqFt: number;
  estimatedAreaSqFt: number;
  totalPrice: number;
};

// Display pricing (WHOLE DOLLARS) shown in the order summary / review. Derived
// from the selected plan at schedule time. `frequency` labels the cadence.
export type PricingData = {
  subtotal: number;
  frequency: Frequency | "";
  discountPct: number;
  totalPerVisit: number;
};

// The chosen plan and the exact amount (CENTS) to charge — drives the payment
// step's Payment Element (mode + amount) and the POST /bookings body.
export type PlanSelection = {
  planId: string;
  billingType: PlanBillingType | "";
  amountCents: number;
};

export type ScheduleData = {
  date: string;
  timeSlot: string;
};

type BookingState = {
  address: AddressData;
  property: PropertyData;
  pricing: PricingData;
  plan: PlanSelection;
  schedule: ScheduleData;
  setAddress: (data: AddressData) => void;
  setProperty: (data: PropertyData) => void;
  setPricing: (data: PricingData) => void;
  setPlan: (data: PlanSelection) => void;
  setSchedule: (data: ScheduleData) => void;
  reset: () => void;
};

const initialState = {
  address: { phoneNumber: "", address: "", lat: null, lng: null },
  property: { boundary: [], areaSqFt: 0, estimatedAreaSqFt: 0, totalPrice: 0 },
  pricing: { subtotal: 0, frequency: "", discountPct: 0, totalPerVisit: 0 },
  plan: { planId: "", billingType: "", amountCents: 0 },
  schedule: { date: "", timeSlot: "" },
} satisfies Omit<
  BookingState,
  | "setAddress"
  | "setProperty"
  | "setPricing"
  | "setPlan"
  | "setSchedule"
  | "reset"
>;

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      ...initialState,
      setAddress: (data) => set({ address: data }),
      setProperty: (data) => set({ property: data }),
      setPricing: (data) => set({ pricing: data }),
      setPlan: (data) => set({ plan: data }),
      setSchedule: (data) => set({ schedule: data }),
      reset: () => set(initialState),
    }),
    {
      name: "lawnhate-booking",
      storage: createJSONStorage(() => sessionStorage),
      // v4: replaced the saved-card `payment` slice with a `plan` selection.
      version: 4,
      migrate: (persisted, version) =>
        version === 4 ? (persisted as BookingState) : initialState,
    },
  ),
);
