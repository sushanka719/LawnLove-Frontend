"use client";

import { useMutation, useQuery } from "@tanstack/react-query";

import {
  createBooking,
  createSetupIntent,
  type CreateBookingPayload,
} from "@/lib/api/booking";

export const setupIntentQueryKey = ["booking", "setup-intent"] as const;

// Fetch a Stripe SetupIntent client secret once the user is authenticated.
// staleTime: Infinity + no refetch so we don't churn intents on re-render.
export function useSetupIntent(enabled: boolean) {
  return useQuery({
    queryKey: setupIntentQueryKey,
    queryFn: createSetupIntent,
    enabled,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    retry: false,
  });
}

export function useCreateBooking() {
  return useMutation({
    mutationFn: (payload: CreateBookingPayload) => createBooking(payload),
  });
}
