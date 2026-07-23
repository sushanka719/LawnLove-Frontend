"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  type UpdatePricingSettingsInput,
  getAdminPricingSettings,
  getPricingSettings,
  updatePricingSettings,
} from "@/lib/api/pricing-settings";

export const pricingSettingsKeys = {
  // Public config consumed by the booking flow.
  public: ["pricing-settings"] as const,
  // Admin view (same data; separate key so admin edits don't fight the
  // booking-flow cache lifecycle).
  admin: ["admin", "pricing-settings"] as const,
};

// ---- Public (booking flow) ----

export function usePricingSettings() {
  return useQuery({
    queryKey: pricingSettingsKeys.public,
    queryFn: getPricingSettings,
  });
}

// ---- Admin ----

export function useAdminPricingSettings() {
  return useQuery({
    queryKey: pricingSettingsKeys.admin,
    queryFn: getAdminPricingSettings,
  });
}

export function useUpdatePricingSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdatePricingSettingsInput) => updatePricingSettings(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: pricingSettingsKeys.admin });
      qc.invalidateQueries({ queryKey: pricingSettingsKeys.public });
    },
  });
}
