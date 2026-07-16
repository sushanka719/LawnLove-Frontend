"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  approveJob,
  disputeJob,
  getJob,
  getMyJobs,
  submitReview,
} from "@/lib/api/customer-jobs";

export const customerJobsQueryKey = ["customer", "jobs"] as const;
export const customerJobQueryKey = (id: string) => ["customer", "jobs", id] as const;

export function useCustomerJobs() {
  return useQuery({
    queryKey: customerJobsQueryKey,
    queryFn: getMyJobs,
  });
}

export function useCustomerJob(jobId: string) {
  return useQuery({
    queryKey: customerJobQueryKey(jobId),
    queryFn: () => getJob(jobId),
    enabled: !!jobId,
  });
}

function useJobMutation<TArgs = void>(
  jobId: string,
  fn: (args: TArgs) => Promise<unknown>,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerJobQueryKey(jobId) });
      queryClient.invalidateQueries({ queryKey: customerJobsQueryKey });
    },
  });
}

export function useSubmitReview(jobId: string) {
  return useJobMutation(jobId, (body: { rating: number; comment?: string }) =>
    submitReview(jobId, body),
  );
}

export function useApproveJob(jobId: string) {
  return useJobMutation(jobId, () => approveJob(jobId));
}

export function useDisputeJob(jobId: string) {
  return useJobMutation(jobId, () => disputeJob(jobId));
}
