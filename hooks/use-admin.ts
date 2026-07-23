"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  type AdminRole,
  type UpdateSettingsInput,
  assignJob,
  banUser,
  cancelBooking,
  getAdminAgents,
  getAdminBooking,
  getAdminBookings,
  getAdminDisputes,
  getAdminJob,
  getAdminJobs,
  getAdminPayouts,
  getAdminRevenue,
  getAdminSettings,
  getAdminStats,
  getAdminUser,
  getAdminUsers,
  inviteAgent,
  payoutJob,
  reassignJob,
  refundJob,
  setUserRole,
  unbanUser,
  updateAdminSettings,
} from "@/lib/api/admin";
import type { BookingStatus } from "@/lib/api/booking";
import type { JobStatus } from "@/lib/api/agent";

export const adminKeys = {
  stats: ["admin", "stats"] as const,
  revenue: (range?: string) => ["admin", "stats", "revenue", range ?? "30d"] as const,
  users: (params: unknown) => ["admin", "users", params] as const,
  user: (id: string) => ["admin", "users", id] as const,
  agents: ["admin", "agents"] as const,
  bookings: (params: unknown) => ["admin", "bookings", params] as const,
  booking: (id: string) => ["admin", "bookings", id] as const,
  jobs: (params: unknown) => ["admin", "jobs", params] as const,
  job: (id: string) => ["admin", "jobs", id] as const,
  disputes: ["admin", "disputes"] as const,
  payouts: ["admin", "payouts"] as const,
  settings: ["admin", "settings"] as const,
};

// ---- Overview ----

export function useAdminStats() {
  return useQuery({ queryKey: adminKeys.stats, queryFn: getAdminStats });
}

export function useAdminRevenue(range?: string) {
  return useQuery({
    queryKey: adminKeys.revenue(range),
    queryFn: () => getAdminRevenue(range),
  });
}

// ---- Users ----

export function useAdminUsers(params: {
  query?: string;
  role?: AdminRole;
  page?: number;
  pageSize?: number;
}) {
  return useQuery({
    queryKey: adminKeys.users(params),
    queryFn: () => getAdminUsers(params),
    placeholderData: keepPreviousData,
  });
}

export function useAdminUser(id: string) {
  return useQuery({
    queryKey: adminKeys.user(id),
    queryFn: () => getAdminUser(id),
    enabled: !!id,
  });
}

export function useSetUserRole(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (role: AdminRole) => setUserRole(id, role),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.user(id) });
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
      qc.invalidateQueries({ queryKey: adminKeys.agents });
    },
  });
}

export function useBanUser(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { reason?: string; durationDays?: number }) => banUser(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.user(id) });
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

export function useUnbanUser(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => unbanUser(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.user(id) });
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

// ---- Agents ----

export function useAdminAgents() {
  return useQuery({ queryKey: adminKeys.agents, queryFn: getAdminAgents });
}

export function useInviteAgent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { email: string; businessName?: string }) => inviteAgent(body),
    onSuccess: () => {
      // A new/promoted agent may now show up in the agents list.
      qc.invalidateQueries({ queryKey: adminKeys.agents });
    },
  });
}

// ---- Bookings ----

export function useAdminBookings(params: {
  status?: BookingStatus;
  page?: number;
  pageSize?: number;
}) {
  return useQuery({
    queryKey: adminKeys.bookings(params),
    queryFn: () => getAdminBookings(params),
    placeholderData: keepPreviousData,
  });
}

export function useAdminBooking(id: string) {
  return useQuery({
    queryKey: adminKeys.booking(id),
    queryFn: () => getAdminBooking(id),
    enabled: !!id,
  });
}

export function useCancelBooking(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => cancelBooking(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.booking(id) });
      qc.invalidateQueries({ queryKey: ["admin", "bookings"] });
    },
  });
}

// ---- Jobs ----

export function useAdminJobs(params: {
  status?: JobStatus;
  agentId?: string;
  page?: number;
  pageSize?: number;
}) {
  return useQuery({
    queryKey: adminKeys.jobs(params),
    queryFn: () => getAdminJobs(params),
    placeholderData: keepPreviousData,
  });
}

export function useAdminJob(id: string) {
  return useQuery({
    queryKey: adminKeys.job(id),
    queryFn: () => getAdminJob(id),
    enabled: !!id,
  });
}

export function useAssignJob(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (agentId: string) => assignJob(id, agentId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.job(id) });
      qc.invalidateQueries({ queryKey: ["admin", "jobs"] });
    },
  });
}

export function useReassignJob(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { employeeId?: string | null; auto?: boolean }) =>
      reassignJob(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.job(id) });
      qc.invalidateQueries({ queryKey: ["admin", "jobs"] });
    },
  });
}

// ---- Payouts ----

export function useAdminPayouts() {
  return useQuery({ queryKey: adminKeys.payouts, queryFn: getAdminPayouts });
}

export function usePayoutJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ref }: { id: string; ref?: string }) => payoutJob(id, ref),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.payouts });
      qc.invalidateQueries({ queryKey: adminKeys.stats });
      qc.invalidateQueries({ queryKey: ["admin", "jobs"] });
    },
  });
}

// ---- Settings ----

export function useAdminSettings() {
  return useQuery({ queryKey: adminKeys.settings, queryFn: getAdminSettings });
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateSettingsInput) => updateAdminSettings(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.settings });
      qc.invalidateQueries({ queryKey: adminKeys.stats });
    },
  });
}

// ---- Disputes ----

export function useAdminDisputes() {
  return useQuery({ queryKey: adminKeys.disputes, queryFn: getAdminDisputes });
}

export function useRefundJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => refundJob(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: adminKeys.disputes });
      qc.invalidateQueries({ queryKey: adminKeys.job(id) });
      qc.invalidateQueries({ queryKey: ["admin", "jobs"] });
    },
  });
}
