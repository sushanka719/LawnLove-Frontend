"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getSession, signOut } from "@/lib/api/auth";

export const sessionQueryKey = ["session"] as const;

export function useSession() {
  return useQuery({
    queryKey: sessionQueryKey,
    queryFn: getSession,
  });
}

export function useSignOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.setQueryData(sessionQueryKey, null);
      queryClient.invalidateQueries({ queryKey: sessionQueryKey });
    },
  });
}
