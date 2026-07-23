export const RATE_PER_SQFT = 0.0123;
export const MIN_PRICE = 40;
export const ESTIMATED_AREA_FACTOR = 0.95;

export type Frequency = "weekly" | "biweekly" | "monthly" | "oneTime";

export const FREQUENCY_DISCOUNTS: Record<Frequency, number> = {
  weekly: 0.15,
  biweekly: 0.1,
  monthly: 0.05,
  oneTime: 0,
};

export const FREQUENCY_LABELS: Record<Frequency, { title: string; subtitle: string }> = {
  weekly: { title: "Weekly", subtitle: "Save 15%" },
  biweekly: { title: "Bi-weekly", subtitle: "Save 10%" },
  monthly: { title: "Monthly", subtitle: "Save 5%" },
  oneTime: { title: "One-time", subtitle: "No commit" },
};

export function computeBasePrice(areaSqFt: number): number {
  return Math.max(MIN_PRICE, Math.round(areaSqFt * RATE_PER_SQFT));
}

export function computeQuote(areaSqFt: number, frequency: Frequency) {
  const subtotal = computeBasePrice(areaSqFt);
  const discountPct = FREQUENCY_DISCOUNTS[frequency];
  const totalPerVisit = Math.round(subtotal * (1 - discountPct));
  return { subtotal, discountPct, totalPerVisit };
}

// ---- Plan-based pricing (base + area surcharge) --------------------------
// Mirror of LawnBackend/src/booking/pricing.ts. All amounts here are in CENTS.
// The area surcharge ladder + maximum serviceable area are GLOBAL now (fetched
// from /pricing-settings), not per-plan. The server recomputes and is
// authoritative; this is display-only. Keep in sync with the backend copy.

type PlanTier = { minSqFt: number; maxSqFt: number | null; surcharge: number };

// Surcharge (cents) for the half-open bracket [minSqFt, maxSqFt) the area falls
// into; the top tier has maxSqFt === null. 0 if below the first bracket.
export function surchargeForArea(tiers: PlanTier[], areaSqFt: number): number {
  const match = [...tiers]
    .sort((a, b) => a.minSqFt - b.minSqFt)
    .find((t) => areaSqFt >= t.minSqFt && (t.maxSqFt == null || areaSqFt < t.maxSqFt));
  return match ? match.surcharge : 0;
}

// Whether a lawn is larger than the business will service. maxAreaSqFt === null
// means "no maximum" — nothing is ever rejected for size.
export function isOverMaxArea(maxAreaSqFt: number | null, areaSqFt: number): boolean {
  return maxAreaSqFt != null && areaSqFt > maxAreaSqFt;
}

// Final per-visit quote in CENTS: a plan's base price + the global area
// surcharge bracket for the (estimated) measured area.
export function computePlanQuote(
  basePrice: number,
  tiers: PlanTier[],
  estimatedAreaSqFt: number,
) {
  const areaSurcharge = surchargeForArea(tiers, estimatedAreaSqFt);
  return { basePrice, areaSurcharge, totalPerVisit: basePrice + areaSurcharge };
}
