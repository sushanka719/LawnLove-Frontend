import type { JobStatus } from "@/lib/api/agent";

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  assigned: "Assigned",
  started: "In progress",
  completed: "Completed",
  in_review: "Awaiting review",
  released: "Approved",
  paid: "Paid out",
  disputed: "Disputed",
  refunded: "Refunded",
};

// Tailwind classes for the pill background/text per status. Uses the lawn tokens
// where possible plus a couple of semantic accents.
export const JOB_STATUS_STYLES: Record<JobStatus, string> = {
  assigned: "bg-[#dbeafe] text-[#1d4ed8]",
  started: "bg-[#fef3c7] text-[#b45309]",
  completed: "bg-lawn-badge-bg text-lawn-primary",
  in_review: "bg-[#fef3c7] text-[#b45309]",
  released: "bg-lawn-badge-bg text-lawn-primary",
  paid: "bg-lawn-badge-bg text-lawn-primary",
  disputed: "bg-red-100 text-red-700",
  refunded: "bg-neutral-200 text-neutral-600",
};

export const TIME_SLOT_LABELS: Record<string, string> = {
  morning: "Morning (8:00 AM - 11:00 AM)",
  midday: "Midday (11:00 AM - 2:00 PM)",
  afternoon: "Afternoon (2:00 PM - 5:00 PM)",
  evening: "Evening (5:00 PM - 7:00 PM)",
};

export function formatScheduleDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

// Cents → "$xx.xx" (drops the cents when whole).
export function formatCents(cents: number): string {
  const dollars = cents / 100;
  return Number.isInteger(dollars) ? `$${dollars}` : `$${dollars.toFixed(2)}`;
}

// Short "time left" string for a review deadline, or null if elapsed/absent.
export function timeUntil(iso: string | null): string | null {
  if (!iso) return null;
  const ms = new Date(iso).getTime() - Date.now();
  if (Number.isNaN(ms) || ms <= 0) return null;
  const hours = Math.floor(ms / (1000 * 60 * 60));
  if (hours >= 1) {
    return `${hours}h left`;
  }
  const minutes = Math.max(1, Math.floor(ms / (1000 * 60)));
  return `${minutes}m left`;
}
