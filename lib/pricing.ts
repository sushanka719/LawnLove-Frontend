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
// Mirror of LawnBackend/src/booking/pricing.ts. All amounts here are in CENTS
// (matching the Plan model). The server recomputes and is authoritative; this
// is display-only. Keep in sync with the backend copy.

type PlanTier = { minSqFt: number; maxSqFt: number | null; surcharge: number };

// Surcharge (cents) for the half-open bracket [minSqFt, maxSqFt) the area falls
// into; the top tier has maxSqFt === null. 0 if below the first bracket.
export function surchargeForArea(tiers: PlanTier[], areaSqFt: number): number {
  const match = [...tiers]
    .sort((a, b) => a.minSqFt - b.minSqFt)
    .find(
      (t) =>
        areaSqFt >= t.minSqFt && (t.maxSqFt == null || areaSqFt < t.maxSqFt),
    );
  return match ? match.surcharge : 0;
}

// Final per-visit quote in CENTS for a plan at a given (estimated) area.
export function computePlanQuote(
  plan: { basePrice: number; areaTiers: PlanTier[] },
  estimatedAreaSqFt: number,
) {
  const basePrice = plan.basePrice;
  const areaSurcharge = surchargeForArea(plan.areaTiers, estimatedAreaSqFt);
  return { basePrice, areaSurcharge, totalPerVisit: basePrice + areaSurcharge };
}
