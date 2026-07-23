import { http } from "@/lib/api/http";

// Global pricing configuration shared by every plan: the area surcharge ladder
// and the maximum serviceable lawn area. `GET /pricing-settings` is public (the
// booking flow reads it to quote); the admin GET/PUT routes are served by the
// backend AdminPricingSettingsController (@Roles(['admin'])). Money in CENTS.

export type AreaTier = {
  id: string;
  minSqFt: number;
  maxSqFt: number | null; // null = open-ended top bracket
  surcharge: number; // cents added to a plan's basePrice for this bracket
};

export type PricingSettings = {
  maxAreaSqFt: number | null; // null = no maximum serviceable area
  updatedAt: string;
  areaTiers: AreaTier[];
};

export type AreaTierInput = {
  minSqFt: number;
  maxSqFt?: number | null;
  surcharge: number;
};

export type UpdatePricingSettingsInput = {
  maxAreaSqFt?: number | null;
  areaTiers: AreaTierInput[];
};

// ---- Public (booking flow) ----

export function getPricingSettings() {
  return http.get<PricingSettings>("/pricing-settings");
}

// ---- Admin ----

export function getAdminPricingSettings() {
  return http.get<PricingSettings>("/admin/pricing-settings");
}

export function updatePricingSettings(body: UpdatePricingSettingsInput) {
  return http.put<PricingSettings>("/admin/pricing-settings", body);
}
