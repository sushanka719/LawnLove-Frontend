import type { ReactNode } from "react";
import { Home } from "lucide-react";

type OrderSummarySidebarProps = {
  address: string;
  areaSqFt: number;
  timeSlotLabel: string;
  subtotal: number;
  frequencyLabel: string;
  discountPct: number;
  totalPerVisit: number;
  cadenceLabel: string;
  children: ReactNode;
};

export function OrderSummarySidebar({
  address,
  areaSqFt,
  timeSlotLabel,
  subtotal,
  frequencyLabel,
  discountPct,
  totalPerVisit,
  cadenceLabel,
  children,
}: OrderSummarySidebarProps) {
  return (
    <div className="bg-lawn-bg-2 flex w-full flex-col gap-4 rounded-b-xl p-6 shadow-[0px_4px_16px_0px_rgba(74,74,74,0.14)] lg:max-w-[449px]">
      <div className="flex items-start gap-3 border-b border-[#cecece] pb-6">
        <div className="bg-lawn-bg-1 flex items-center rounded-md p-3">
          <Home className="text-lawn-text-secondary size-6" />
        </div>
        <div className="text-lawn-text-secondary flex flex-1 flex-col">
          <p className="truncate text-lg font-semibold">{address || "Your address"}</p>
          <p className="text-sm">
            {areaSqFt.toLocaleString(undefined, { maximumFractionDigits: 0 })} sq ft lawn
          </p>
        </div>
      </div>

      <p className="text-lawn-text-secondary font-heading text-xl font-semibold">
        ORDER SUMMARY
      </p>

      <div className="flex items-center justify-between border-b border-[#cecece] pb-4">
        <div className="text-lawn-text-tertiary flex flex-col gap-1">
          <p>Lawn Mowing</p>
          <p>{timeSlotLabel || "Time to be selected"}</p>
        </div>
        <p className="text-lawn-text-secondary text-lg font-semibold">${subtotal}</p>
      </div>

      <div className="flex flex-col gap-2 border-b border-[#cecece] pb-4">
        <div className="flex items-center justify-between">
          <p className="text-lawn-text-tertiary text-lg">Subtotal</p>
          <p className="text-lawn-text-secondary text-lg font-semibold">${subtotal}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-lawn-text-tertiary text-lg">
            {frequencyLabel || "Frequency"}
          </p>
          <p className="text-lawn-text-secondary text-lg font-semibold">
            -{Math.round(discountPct * 100)}%
          </p>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <p className="text-lawn-text-primary text-lg font-medium">Total per visit</p>
          <p className="text-lawn-primary text-2xl font-semibold">${totalPerVisit}</p>
        </div>
        <p className="text-lawn-text-tertiary w-full text-right text-sm">
          {cadenceLabel}
        </p>
      </div>

      <div className="flex w-full flex-col gap-4">{children}</div>
    </div>
  );
}
