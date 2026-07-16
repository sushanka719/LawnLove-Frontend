"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  completeJob,
  getConnectStatus,
  getJobDetail,
  getMyJobs,
  startConnectOnboarding,
  startJob,
} from "@/lib/api/agent";

export const agentJobsQueryKey = ["agent", "jobs"] as const;
export const agentJobQueryKey = (id: string) => ["agent", "jobs", id] as const;
export const connectStatusQueryKey = ["agent", "connect", "status"] as const;

export function useAgentJobs() {
  return useQuery({
    queryKey: agentJobsQueryKey,
    queryFn: getMyJobs,
  });
}

export function useAgentJob(jobId: string) {
  return useQuery({
    queryKey: agentJobQueryKey(jobId),
    queryFn: () => getJobDetail(jobId),
    enabled: !!jobId,
  });
}

export function useConnectStatus(enabled = true) {
  return useQuery({
    queryKey: connectStatusQueryKey,
    queryFn: getConnectStatus,
    enabled,
    refetchOnWindowFocus: false,
  });
}

export function useStartConnectOnboarding() {
  return useMutation({ mutationFn: startConnectOnboarding });
}

function useInvalidateJob(jobId: string) {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: agentJobQueryKey(jobId) });
    queryClient.invalidateQueries({ queryKey: agentJobsQueryKey });
  };
}

export function useStartJob(jobId: string) {
  const invalidate = useInvalidateJob(jobId);
  return useMutation({
    mutationFn: (coords: { lat: number; lng: number }) => startJob(jobId, coords),
    onSuccess: invalidate,
  });
}

export function useCompleteJob(jobId: string) {
  const invalidate = useInvalidateJob(jobId);
  return useMutation({
    mutationFn: () => completeJob(jobId),
    onSuccess: invalidate,
  });
}
