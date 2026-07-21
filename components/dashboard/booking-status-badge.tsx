import { cn } from "@/lib/utils";
import type { BookingStatus } from "@/lib/api/booking";

const LABELS: Record<BookingStatus, string> = {
  pendingPayment: "Pending payment",
  active: "Active",
  pastDue: "Past due",
  completed: "Completed",
  cancelled: "Cancelled",
};

const STYLES: Record<BookingStatus, string> = {
  pendingPayment: "bg-[#fef3c7] text-[#b45309]",
  active: "bg-[#dbeafe] text-[#1d4ed8]",
  pastDue: "bg-red-100 text-red-700",
  completed: "bg-lawn-badge-bg text-lawn-primary",
  cancelled: "bg-neutral-200 text-neutral-600",
};

export function BookingStatusBadge({
  status,
  className,
}: {
  status: BookingStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium tracking-tight",
        STYLES[status],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      {LABELS[status]}
    </span>
  );
}
