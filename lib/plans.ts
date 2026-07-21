import type { Plan, PlanInterval } from "@/lib/api/plans";

export const PLAN_INTERVAL_LABELS: Record<PlanInterval, string> = {
  weekly: "Weekly",
  biweekly: "Bi-weekly",
  monthly: "Monthly",
};

// Human label for a plan's billing cadence, e.g. "Weekly" or "One-time".
export function planBillingLabel(
  plan: Pick<Plan, "billingType" | "interval">,
): string {
  if (plan.billingType === "oneTime") return "One-time";
  return plan.interval ? PLAN_INTERVAL_LABELS[plan.interval] : "Recurring";
}

// Dollars entered in a form → integer cents for the API.
export function dollarsToCents(value: string | number): number {
  const n = typeof value === "number" ? value : parseFloat(value);
  return Math.round((Number.isFinite(n) ? n : 0) * 100);
}

// Integer cents from the API → a dollar string for a form input ("32", "32.50").
export function centsToDollarString(cents: number): string {
  const dollars = cents / 100;
  return Number.isInteger(dollars) ? String(dollars) : dollars.toFixed(2);
}
