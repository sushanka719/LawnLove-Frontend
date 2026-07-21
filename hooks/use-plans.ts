"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  type CreatePlanInput,
  type UpdatePlanInput,
  createPlan,
  deletePlan,
  getAdminPlan,
  getAdminPlans,
  getPlans,
  updatePlan,
} from "@/lib/api/plans";

export const planKeys = {
  // Public catalogue consumed by the booking flow.
  public: ["plans"] as const,
  // Admin views (include inactive plans).
  adminAll: ["admin", "plans"] as const,
  admin: (id: string) => ["admin", "plans", id] as const,
};

// ---- Public (booking flow) ----

export function usePlans() {
  return useQuery({ queryKey: planKeys.public, queryFn: getPlans });
}

// ---- Admin ----

export function useAdminPlans() {
  return useQuery({ queryKey: planKeys.adminAll, queryFn: getAdminPlans });
}

export function useAdminPlan(id: string) {
  return useQuery({
    queryKey: planKeys.admin(id),
    queryFn: () => getAdminPlan(id),
    enabled: !!id,
  });
}

export function useCreatePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreatePlanInput) => createPlan(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "plans"] });
      qc.invalidateQueries({ queryKey: planKeys.public });
    },
  });
}

export function useUpdatePlan(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdatePlanInput) => updatePlan(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: planKeys.admin(id) });
      qc.invalidateQueries({ queryKey: ["admin", "plans"] });
      qc.invalidateQueries({ queryKey: planKeys.public });
    },
  });
}

export function useDeletePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePlan(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "plans"] });
      qc.invalidateQueries({ queryKey: planKeys.public });
    },
  });
}
