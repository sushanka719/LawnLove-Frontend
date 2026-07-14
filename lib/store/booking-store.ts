import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { Frequency } from "@/lib/pricing";

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

export type PricingData = {
  subtotal: number;
  frequency: Frequency | "";
  discountPct: number;
  totalPerVisit: number;
};

export type ScheduleData = {
  date: string;
  timeSlot: string;
};

export type PaymentData = {
  cardNumber: string;
  expiry: string;
  cvc: string;
  zip: string;
  saveCard: boolean;
};

type BookingState = {
  address: AddressData;
  property: PropertyData;
  pricing: PricingData;
  schedule: ScheduleData;
  payment: PaymentData;
  setAddress: (data: AddressData) => void;
  setProperty: (data: PropertyData) => void;
  setPricing: (data: PricingData) => void;
  setSchedule: (data: ScheduleData) => void;
  setPayment: (data: PaymentData) => void;
  reset: () => void;
};

const initialState = {
  address: { phoneNumber: "", address: "", lat: null, lng: null },
  property: { boundary: [], areaSqFt: 0, estimatedAreaSqFt: 0, totalPrice: 0 },
  pricing: { subtotal: 0, frequency: "", discountPct: 0, totalPerVisit: 0 },
  schedule: { date: "", timeSlot: "" },
  payment: { cardNumber: "", expiry: "", cvc: "", zip: "", saveCard: false },
} satisfies Omit<
  BookingState,
  "setAddress" | "setProperty" | "setPricing" | "setSchedule" | "setPayment" | "reset"
>;

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      ...initialState,
      setAddress: (data) => set({ address: data }),
      setProperty: (data) => set({ property: data }),
      setPricing: (data) => set({ pricing: data }),
      setSchedule: (data) => set({ schedule: data }),
      setPayment: (data) => set({ payment: data }),
      reset: () => set(initialState),
    }),
    {
      name: "lawnhate-booking",
      storage: createJSONStorage(() => sessionStorage),
      version: 2,
      migrate: (_persisted, version) =>
        version === 2 ? (_persisted as BookingState) : initialState,
    },
  ),
);
