"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  cancelAccountDeletion,
  getAccountSettings,
  scheduleAccountDeletion,
  updateNotifications,
  type AccountSettings,
  type NotificationPreferences,
} from "@/lib/api/account";
import { ApiError } from "@/lib/api/http";

export const accountSettingsQueryKey = ["account", "settings"] as const;

function errorMessage(error: unknown, fallback: string) {
  return error instanceof ApiError ? error.message : fallback;
}

export function useAccountSettings() {
  return useQuery({
    queryKey: accountSettingsQueryKey,
    queryFn: getAccountSettings,
  });
}

// Toggling a notification preference. Optimistically flips the cached value so
// the switch feels instant, then rolls back if the request fails.
export function useUpdateNotifications() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Partial<NotificationPreferences>) =>
      updateNotifications(input),
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: accountSettingsQueryKey });
      const previous = queryClient.getQueryData<AccountSettings>(
        accountSettingsQueryKey,
      );
      if (previous) {
        queryClient.setQueryData<AccountSettings>(accountSettingsQueryKey, {
          ...previous,
          notifications: { ...previous.notifications, ...input },
        });
      }
      return { previous };
    },
    onError: (error, _input, context) => {
      if (context?.previous) {
        queryClient.setQueryData(accountSettingsQueryKey, context.previous);
      }
      toast.error(errorMessage(error, "We couldn't save that preference."));
    },
    onSuccess: (data) => {
      queryClient.setQueryData(accountSettingsQueryKey, data);
    },
  });
}

export function useScheduleAccountDeletion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: scheduleAccountDeletion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountSettingsQueryKey });
    },
    onError: (error) => {
      toast.error(
        errorMessage(error, "We couldn't schedule your account deletion."),
      );
    },
  });
}

export function useCancelAccountDeletion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelAccountDeletion,
    onSuccess: () => {
      toast.success("Account deletion cancelled.");
      queryClient.invalidateQueries({ queryKey: accountSettingsQueryKey });
    },
    onError: (error) => {
      toast.error(
        errorMessage(error, "We couldn't cancel your account deletion."),
      );
    },
  });
}
