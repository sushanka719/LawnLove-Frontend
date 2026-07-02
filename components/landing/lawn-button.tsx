import Link from "next/link";

import { cn } from "@/lib/utils";

type LawnButtonProps = {
  children: React.ReactNode;
  href?: string;
  variant?: "solid" | "outline" | "outline-light";
  className?: string;
};

export function LawnButton({
  children,
  href = "#",
  variant = "solid",
  className,
}: LawnButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-xl px-8 py-3 text-base font-semibold tracking-tight whitespace-nowrap transition-opacity hover:opacity-90",
        variant === "solid" &&
          "lawn-gradient-btn text-white shadow-[0px_5px_10px_0px_rgba(0,0,0,0.25)]",
        variant === "outline" &&
          "border-lawn-primary-light text-lawn-primary border-[1.2px] shadow-[0px_5px_10px_0px_rgba(0,0,0,0.25)]",
        variant === "outline-light" && "border-[1.2px] border-white text-white",
        className,
      )}
    >
      {children}
    </Link>
  );
}
