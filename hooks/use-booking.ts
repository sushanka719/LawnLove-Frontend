"use client";

import { useMutation } from "@tanstack/react-query";

import { createBooking, type CreateBookingPayload } from "@/lib/api/booking";

// Creates the booking and starts its payment — returns { bookingId, clientSecret,
// amount }. The payment step confirms the clientSecret with Stripe.
export function useCreateBooking() {
  return useMutation({
    mutationFn: (payload: CreateBookingPayload) => createBooking(payload),
  });
}
