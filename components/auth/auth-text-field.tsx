import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function AuthTextField({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <Input
      className={cn(
        "bg-lawn-bg-2 border-border text-lawn-text-secondary h-auto w-full rounded-[10px] px-4 py-3 text-base",
        className,
      )}
      {...props}
    />
  );
}
