import { cn } from "@/lib/utils";

// Job / booking / payout status pills used across the agent screens. Colors
// come straight from the Figma design (nodes 1111:8359 / 1126:10646 /
// 1142:12170): "On going"/"In progress" read blue, "Completed"/"Paid" read
// green (the lawn badge tint), and "Scheduled"/"Pending" read orange.
export type AgentJobStatus =
  "ongoing" | "inProgress" | "completed" | "scheduled" | "paid" | "pending";

const LABELS: Record<AgentJobStatus, string> = {
  ongoing: "On going",
  inProgress: "In progress",
  completed: "Completed",
  scheduled: "Scheduled",
  paid: "Paid",
  pending: "Pending",
};

const STYLES: Record<AgentJobStatus, string> = {
  ongoing: "bg-[#dbeafe] text-[#1d4ed8]",
  inProgress: "bg-[#dbeafe] text-[#1d4ed8]",
  completed: "bg-lawn-badge-bg text-lawn-primary",
  scheduled: "bg-[#ffedd5] text-[#ea580c]",
  paid: "bg-lawn-badge-bg text-lawn-primary",
  pending: "bg-[#ffedd5] text-[#ea580c]",
};

export function AgentStatusBadge({
  status,
  className,
}: {
  status: AgentJobStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-1.5 text-base font-medium tracking-tight whitespace-nowrap",
        STYLES[status],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {LABELS[status]}
    </span>
  );
}
