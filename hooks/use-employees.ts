"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  type CreateEmployeeInput,
  type UpdateEmployeeInput,
  createEmployee,
  deleteEmployee,
  getEmployees,
  updateEmployee,
} from "@/lib/api/employees";

export const employeeKeys = {
  all: ["employees"] as const,
};

export function useEmployees() {
  return useQuery({ queryKey: employeeKeys.all, queryFn: getEmployees });
}

// Silent mutations — the form/component toasts at the call site (mirrors the
// admin CRUD hooks).
export function useCreateEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateEmployeeInput) => createEmployee(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: employeeKeys.all }),
  });
}

export function useUpdateEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateEmployeeInput }) =>
      updateEmployee(id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: employeeKeys.all }),
  });
}

export function useDeleteEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteEmployee(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: employeeKeys.all }),
  });
}
