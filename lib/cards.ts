// Presentation helpers for saved Stripe cards. Stripe returns lowercase brand
// slugs (e.g. "visa", "mastercard", "amex"); map them to a display label and a
// solid brand color for the network-logo chip.

const BRAND_LABELS: Record<string, string> = {
  visa: "Visa",
  mastercard: "Mastercard",
  amex: "American Express",
  discover: "Discover",
  diners: "Diners Club",
  jcb: "JCB",
  unionpay: "UnionPay",
};

const BRAND_COLORS: Record<string, string> = {
  visa: "#1a1f71",
  mastercard: "#eb001b",
  amex: "#016fd0",
  discover: "#ff6000",
  diners: "#0079be",
  jcb: "#0b4ea2",
  unionpay: "#e21836",
};

const FALLBACK_COLOR = "#4a4a4a";

export function cardBrandLabel(brand: string): string {
  return BRAND_LABELS[brand] ?? "Card";
}

export function cardBrandColor(brand: string): string {
  return BRAND_COLORS[brand] ?? FALLBACK_COLOR;
}

// "08/27" from month 8 / year 2027. Returns "" when the card has no expiry.
export function formatCardExpiry(
  month: number | null,
  year: number | null,
): string {
  if (!month || !year) return "";
  const mm = String(month).padStart(2, "0");
  const yy = String(year).slice(-2);
  return `${mm}/${yy}`;
}
