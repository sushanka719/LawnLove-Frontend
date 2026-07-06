import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SubmitButton({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      type="submit"
      className={cn(
        "lawn-gradient-btn h-auto w-full rounded-xl px-8 py-3 text-base font-semibold text-white shadow-[0px_5px_10px_0px_rgba(0,0,0,0.25)] hover:opacity-90",
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
