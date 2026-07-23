// Single source of truth for the booking time-slot windows. Previously these
// were hardcoded (and formatted inconsistently) across schedule-form,
// review-summary, payment-form and booking-confirmed.

export type TimeSlot = "morning" | "midday" | "afternoon" | "evening";

export const TIME_WINDOWS: {
  value: TimeSlot;
  title: string;
  range: string;
}[] = [
  { value: "morning", title: "Morning", range: "8:00 AM - 11:00 AM" },
  { value: "midday", title: "Midday", range: "11:00 AM - 2:00 PM" },
  { value: "afternoon", title: "Afternoon", range: "2:00 PM - 5:00 PM" },
  { value: "evening", title: "Evening", range: "5:00 PM - 7:00 PM" },
];

// slot → "8:00 AM - 11:00 AM"
export const TIME_WINDOW_RANGES: Record<string, string> = Object.fromEntries(
  TIME_WINDOWS.map((w) => [w.value, w.range]),
);

// slot → "Morning (8:00 AM - 11:00 AM)"
export function timeSlotLabel(slot: string): string {
  const w = TIME_WINDOWS.find((x) => x.value === slot);
  return w ? `${w.title} (${w.range})` : "";
}
