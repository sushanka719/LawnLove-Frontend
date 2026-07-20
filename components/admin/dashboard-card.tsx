import { cn } from "@/lib/utils";

/** Shared card shell for the admin dashboard panels. */
export function DashboardCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn("border-border bg-card rounded-[14px] border shadow-sm", className)}
    >
      {children}
    </div>
  );
}
