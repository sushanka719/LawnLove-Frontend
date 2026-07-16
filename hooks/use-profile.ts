"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { sessionQueryKey } from "@/hooks/use-session";
import { updateProfile, uploadAvatar, type UpdateProfileInput } from "@/lib/api/profile";

// Updates name / phone number, then refetches the session so the UI reflects
// the persisted values (better-auth also refreshes the session cookie).
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateProfileInput) => updateProfile(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionQueryKey });
    },
  });
}

// Upload the avatar through the backend (which validates + persists it on the
// user), then refetch the session so the new image shows.
export function useUpdateAvatar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => uploadAvatar(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionQueryKey });
    },
  });
}
