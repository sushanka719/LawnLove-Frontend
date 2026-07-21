import { http } from "@/lib/api/http";

// Booking plans. `GET /plans` is public (booking flow); the `/admin/plans` CRUD
// routes are served by the backend AdminPlansController (@Roles(['admin'])).
// All money fields are in CENTS.

export type PlanBillingType = "recurring" | "oneTime";
export type PlanInterval = "weekly" | "biweekly" | "monthly";

export type PlanAreaTier = {
  id: string;
  minSqFt: number;
  maxSqFt: number | null; // null = open-ended top bracket
  surcharge: number; // cents added to basePrice for this bracket
};

export type Plan = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  billingType: PlanBillingType;
  interval: PlanInterval | null; // null for one-time plans
  basePrice: number; // cents
  features: string[];
  active: boolean;
  sortOrder: number;
  stripeProductId: string | null;
  createdAt: string;
  updatedAt: string;
  areaTiers: PlanAreaTier[];
};

// ---- Public (booking flow) ----

export function getPlans() {
  return http.get<Plan[]>("/plans");
}

// ---- Admin CRUD ----

export type PlanAreaTierInput = {
  minSqFt: number;
  maxSqFt?: number | null;
  surcharge: number;
};

export type CreatePlanInput = {
  name: string;
  slug?: string;
  description?: string;
  billingType: PlanBillingType;
  interval?: PlanInterval | null;
  basePrice: number;
  features?: string[];
  active?: boolean;
  sortOrder?: number;
  areaTiers?: PlanAreaTierInput[];
};

export type UpdatePlanInput = Partial<CreatePlanInput>;

export function getAdminPlans() {
  return http.get<Plan[]>("/admin/plans");
}

export function getAdminPlan(id: string) {
  return http.get<Plan>(`/admin/plans/${id}`);
}

export function createPlan(body: CreatePlanInput) {
  return http.post<Plan>("/admin/plans", body);
}

export function updatePlan(id: string, body: UpdatePlanInput) {
  return http.patch<Plan>(`/admin/plans/${id}`, body);
}

export function deletePlan(id: string) {
  return http.delete<{ id: string; deleted: boolean }>(`/admin/plans/${id}`);
}
