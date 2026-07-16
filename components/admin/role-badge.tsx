import type { AdminRole } from "@/lib/api/admin";
import { cn } from "@/lib/utils";

const LABELS: Record<AdminRole, string> = {
  user: "Customer",
  agent: "Agent",
  admin: "Admin",
};

const STYLES: Record<AdminRole, string> = {
  user: "bg-neutral-200 text-neutral-700",
  agent: "bg-[#dbeafe] text-[#1d4ed8]",
  admin: "bg-lawn-badge-bg text-lawn-primary",
};

export function RoleBadge({
  role,
  className,
}: {
  role: AdminRole;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-tight",
        STYLES[role] ?? STYLES.user,
        className,
      )}
    >
      {LABELS[role] ?? role}
    </span>
  );
}
