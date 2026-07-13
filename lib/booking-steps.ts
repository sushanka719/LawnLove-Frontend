export type BookingStep = {
  slug: string;
  label: string;
  path: string;
};

export const BOOKING_STEPS: BookingStep[] = [
  { slug: "address", label: "Address", path: "/booking/address" },
  { slug: "property", label: "Property", path: "/booking/property" },
  { slug: "services", label: "Services", path: "/booking/services" },
  { slug: "schedule", label: "Schedule", path: "/booking/schedule" },
  { slug: "review", label: "Review", path: "/booking/review" },
  { slug: "payment", label: "Payment", path: "/booking/payment" },
];
