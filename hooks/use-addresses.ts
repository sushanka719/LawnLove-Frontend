"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  createAddress,
  deleteAddress,
  getAddresses,
  setDefaultAddress,
  updateAddress,
  type AddressPayload,
} from "@/lib/api/addresses";
import { ApiError } from "@/lib/api/http";

export const addressesQueryKey = ["addresses"] as const;

function errorMessage(error: unknown, fallback: string) {
  return error instanceof ApiError ? error.message : fallback;
}

export function useAddresses(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: addressesQueryKey,
    queryFn: getAddresses,
    enabled: options?.enabled ?? true,
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AddressPayload) => createAddress(payload),
    onSuccess: () => {
      toast.success("Address saved.");
      queryClient.invalidateQueries({ queryKey: addressesQueryKey });
    },
    onError: (error) => {
      toast.error(errorMessage(error, "We couldn't save this address."));
    },
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<AddressPayload>;
    }) => updateAddress(id, payload),
    onSuccess: () => {
      toast.success("Address updated.");
      queryClient.invalidateQueries({ queryKey: addressesQueryKey });
    },
    onError: (error) => {
      toast.error(errorMessage(error, "We couldn't update this address."));
    },
  });
}

export function useSetDefaultAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => setDefaultAddress(id),
    onSuccess: () => {
      toast.success("Default address updated.");
      queryClient.invalidateQueries({ queryKey: addressesQueryKey });
    },
    onError: (error) => {
      toast.error(
        errorMessage(error, "We couldn't update your default address."),
      );
    },
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAddress(id),
    onSuccess: () => {
      toast.success("Address removed.");
      queryClient.invalidateQueries({ queryKey: addressesQueryKey });
    },
    onError: (error) => {
      toast.error(errorMessage(error, "We couldn't remove this address."));
    },
  });
}
