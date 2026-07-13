import { cn } from "@/lib/utils";

export function BookingStepCard({
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-lawn-bg-2 flex w-full flex-col gap-6 rounded-xl p-8 shadow-[0px_4px_8px_0px_rgba(74,74,74,0.14)]",
        className,
      )}
    >
      <div className="flex flex-col gap-2.5">
        <p className="text-lawn-primary font-heading text-sm font-semibold">{eyebrow}</p>
        <div className="flex flex-col gap-2">
          <h1 className="text-lawn-text-primary font-heading text-2xl leading-8 font-semibold">
            {title}
          </h1>
          <p className="text-lawn-text-secondary text-base leading-6">{description}</p>
        </div>
      </div>

      {children}
    </div>
  );
}
