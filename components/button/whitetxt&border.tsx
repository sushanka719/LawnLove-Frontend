import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const quoteButtonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-xl border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "border-[1.2px] border-[#FFFFFF] bg-transparent text-[#FFFFFF] shadow-sm hover:bg-white/10",
      },
      size: {
        default: "h-12 w-38.5 gap-2 px-8 py-3",
        sm: "h-8 gap-1 px-4 text-xs",
        lg: "h-12 w-38.5 gap-2 px-8 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function QuoteButton({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof quoteButtonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="quote-button"
      className={cn(quoteButtonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { QuoteButton, quoteButtonVariants };
