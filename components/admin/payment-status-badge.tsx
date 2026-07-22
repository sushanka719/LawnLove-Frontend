import { cn } from "@/lib/utils";

/**
 * Payment pill used in the admin booking tables (Figma): soft-blue "On going"
 * and soft-green "Completed", each with a leading status dot.
 */

export type PaymentStatus = "ongoing" | "completed";

export function PaymentStatusBadge({ payment }: { payment: PaymentStatus }) {
  const ongoing = payment === "ongoing";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap",
        ongoing ? "bg-[#dbeafe] text-[#1d4ed8]" : "bg-[#d1fae5] text-[#047857]",
      )}
    >
      <span
        className="size-1.5 rounded-full"
        style={{ backgroundColor: ongoing ? "#1d4ed8" : "#047857" }}
      />
      {ongoing ? "On going" : "Completed"}
    </span>
  );
}
