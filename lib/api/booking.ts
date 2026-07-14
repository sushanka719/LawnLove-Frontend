import { env } from "@/config/env";
import type { Frequency } from "@/lib/pricing";

export class BookingApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "BookingApiError";
  }
}

// Booking endpoints are session-protected, so every request must carry the
// better-auth cookie — the shared apiClient doesn't set credentials by default.
async function bookingRequest<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}${path}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      (data as { message?: string } | null)?.message ??
      "Something went wrong. Please try again.";
    throw new BookingApiError(message, res.status);
  }

  return data as T;
}

export type SetupIntentResponse = {
  clientSecret: string;
  customerId: string;
};

export function createSetupIntent() {
  return bookingRequest<SetupIntentResponse>("/bookings/setup-intent");
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
  return bookingRequest<CreateBookingResponse>("/bookings", payload);
}
