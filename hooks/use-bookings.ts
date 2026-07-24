"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  cancelSubscription,
  getBooking,
  getBookings,
  getCurrentPlans,
  getInvoices,
} from "@/lib/api/booking";

export const bookingsQueryKey = (page: number, pageSize: number) =>
  ["bookings", "list", page, pageSize] as const;
export const bookingQueryKey = (id: string) => ["bookings", id] as const;
export const currentPlansQueryKey = ["bookings", "current-plans"] as const;
export const invoicesQueryKey = (page: number, pageSize: number) =>
  ["invoices", "list", page, pageSize] as const;

// Paginated bookings list. keepPreviousData keeps the current page visible while
// the next one loads, so paging doesn't flash an empty/skeleton state.
export function useBookings(page: number, pageSize: number) {
  return useQuery({
    queryKey: bookingsQueryKey(page, pageSize),
    queryFn: () => getBookings(page, pageSize),
    placeholderData: keepPreviousData,
  });
}

// The customer's current recurring plans (active/past-due subscriptions).
export function useCurrentPlans() {
  return useQuery({
    queryKey: currentPlansQueryKey,
    queryFn: getCurrentPlans,
  });
}

// Cancel a recurring plan. Invalidates the current-plans + bookings queries so
// the cancelled plan drops off once the webhook has flipped its status.
export function useCancelSubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cancelSubscription(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: currentPlansQueryKey });
      qc.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

export function useBooking(id: string) {
  return useQuery({
    queryKey: bookingQueryKey(id),
    queryFn: () => getBooking(id),
    enabled: !!id,
  });
}

export function useInvoices(page: number, pageSize: number) {
  return useQuery({
    queryKey: invoicesQueryKey(page, pageSize),
    queryFn: () => getInvoices(page, pageSize),
    placeholderData: keepPreviousData,
  });
}
