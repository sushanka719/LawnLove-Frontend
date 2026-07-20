import { DashboardCard } from "@/components/admin/dashboard-card";
import {
  BOOKING_STATUS,
  BOOKING_STATUS_GRADIENT,
} from "@/components/admin/dashboard-mock";

export function BookingStatus() {
  return (
    <DashboardCard className="p-6">
      <div className="text-[17px] font-semibold tracking-[-0.01em]">Booking Status</div>
      <div className="text-muted-foreground mt-0.5 text-[13px]">
        3,482 total this month
      </div>

      {/* Donut */}
      <div className="my-5 flex justify-center">
        <div
          className="flex size-[170px] items-center justify-center rounded-full"
          style={{ background: BOOKING_STATUS_GRADIENT }}
        >
          <div className="bg-card flex size-28 flex-col items-center justify-center rounded-full">
            <div className="text-[26px] font-semibold tracking-[-0.02em]">3,482</div>
            <div className="text-muted-foreground text-xs">Bookings</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      {BOOKING_STATUS.map((slice) => (
        <div
          key={slice.label}
          className="border-border flex items-center gap-2.5 border-t py-[7px] text-[13px]"
        >
          <span className="size-2.5 rounded-full" style={{ background: slice.color }} />
          <span className="flex-1">{slice.label}</span>
          <span className="font-semibold tabular-nums">{slice.count}</span>
          <span className="text-muted-foreground w-[38px] text-right tabular-nums">
            {slice.pct}
          </span>
        </div>
      ))}
    </DashboardCard>
  );
}
