"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  type CreateServiceInput,
  type UpdateServiceInput,
  createService,
  deleteService,
  getServices,
  updateService,
} from "@/lib/api/services";

export const serviceKeys = {
  all: ["services"] as const,
};

export function useServices() {
  return useQuery({ queryKey: serviceKeys.all, queryFn: getServices });
}

export function useCreateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateServiceInput) => createService(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: serviceKeys.all }),
  });
}

export function useUpdateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateServiceInput }) =>
      updateService(id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: serviceKeys.all }),
  });
}

export function useDeleteService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteService(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: serviceKeys.all }),
  });
}
