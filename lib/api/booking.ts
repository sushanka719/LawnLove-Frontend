import { http } from "@/lib/api/http";
import type { Frequency } from "@/lib/pricing";

export type SetupIntentResponse = {
  clientSecret: string;
  customerId: string;
};

export function createSetupIntent() {
  return http.post<SetupIntentResponse>("/bookings/setup-intent");
}

export type CreateBookingPayload = {
  phone: string;
  address: string;
  lat: number | null;
  lng: number | null;
  boundary: { lat: number; lng: number }[];
  frequency: Frequency;
  date: string;
  timeSlot: string;
  paymentMethodId: string;
  saveCard: boolean;
};

export type CreateBookingResponse = {
  id: string;
  estimatedAreaSqFt: number;
  subtotal: number;
  discountPct: number;
  totalPerVisit: number;
  frequency: Frequency;
  scheduleDate: string;
  timeSlot: string;
};

export function createBooking(payload: CreateBookingPayload) {
  return http.post<CreateBookingResponse>("/bookings", payload);
}
