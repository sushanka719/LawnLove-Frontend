import { cn } from "@/lib/utils";

export function SectionBadge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-lawn-badge-bg border-lawn-badge-border inline-flex shrink-0 items-center justify-center rounded-2xl border px-4.5 py-1",
        className,
      )}
    >
      <span className="text-lawn-primary text-base leading-6 font-medium tracking-tight uppercase">
        {children}
      </span>
    </div>
  );
}
