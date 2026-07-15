import { cn } from "@/lib/utils";
import type { JobStatus } from "@/lib/api/agent";
import { JOB_STATUS_LABELS, JOB_STATUS_STYLES } from "@/lib/jobs";

export function JobStatusBadge({
  status,
  className,
}: {
  status: JobStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium tracking-tight",
        JOB_STATUS_STYLES[status],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      {JOB_STATUS_LABELS[status]}
    </span>
  );
}
