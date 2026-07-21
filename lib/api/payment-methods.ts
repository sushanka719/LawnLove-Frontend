import { http } from "@/lib/api/http";

export type SavedCard = {
  id: string;
  brand: string;
  last4: string;
  expMonth: number | null;
  expYear: number | null;
  isDefault: boolean;
};

export function getPaymentMethods() {
  return http.get<SavedCard[]>("/payment-methods");
}

export type PaymentMethodSetupIntentResponse = {
  clientSecret: string;
};

// SetupIntent for saving a new card from the dashboard (no booking attached).
export function createPaymentMethodSetupIntent() {
  return http.post<PaymentMethodSetupIntentResponse>(
    "/payment-methods/setup-intent",
  );
}

export function setDefaultPaymentMethod(id: string) {
  return http.post<{ success: boolean }>(`/payment-methods/${id}/default`);
}

export function deletePaymentMethod(id: string) {
  return http.delete<{ success: boolean }>(`/payment-methods/${id}`);
}
