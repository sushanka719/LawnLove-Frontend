import { cn } from "@/lib/utils";
import { SectionBadge } from "@/components/landing/section-badge";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      <SectionBadge>{eyebrow}</SectionBadge>
      <div className="flex flex-col gap-3 sm:gap-6">
        <h2 className="text-lawn-text-primary text-2xl leading-tight font-bold tracking-tight text-balance sm:text-3xl sm:leading-[1.2] lg:text-4xl">
          {title}
        </h2>
        {description ? (
          <p className="text-lawn-text-secondary text-base leading-6 text-balance sm:text-xl sm:leading-7">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}
