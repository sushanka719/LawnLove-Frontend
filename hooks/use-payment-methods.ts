"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { ApiError } from "@/lib/api/http";
import {
  deletePaymentMethod,
  getPaymentMethods,
  setDefaultPaymentMethod,
} from "@/lib/api/payment-methods";

export const paymentMethodsQueryKey = ["payment-methods"] as const;

function errorMessage(error: unknown, fallback: string) {
  return error instanceof ApiError ? error.message : fallback;
}

export function usePaymentMethods() {
  return useQuery({
    queryKey: paymentMethodsQueryKey,
    queryFn: getPaymentMethods,
  });
}

export function useSetDefaultPaymentMethod() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => setDefaultPaymentMethod(id),
    onSuccess: () => {
      toast.success("Default card updated.");
      queryClient.invalidateQueries({ queryKey: paymentMethodsQueryKey });
    },
    onError: (error) => {
      toast.error(errorMessage(error, "We couldn't update your default card."));
    },
  });
}

export function useDeletePaymentMethod() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePaymentMethod(id),
    onSuccess: () => {
      toast.success("Card removed.");
      queryClient.invalidateQueries({ queryKey: paymentMethodsQueryKey });
    },
    onError: (error) => {
      toast.error(errorMessage(error, "We couldn't remove this card."));
    },
  });
}
