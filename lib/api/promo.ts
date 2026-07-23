import { http } from "@/lib/api/http";

// Public promo preview — backend PromoController POST /promo/validate. The server
// recomputes the discount on POST /bookings, so this is display-only.

export type PromoEvaluation = {
  valid: boolean;
  code: string;
  message: string;
  discountCents: number;
  type?: "percent" | "fixed";
  value?: number;
};

export function validatePromo(code: string, subtotalCents: number) {
  return http.post<PromoEvaluation>("/promo/validate", { code, subtotalCents });
}
