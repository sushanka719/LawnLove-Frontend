import Link from "next/link";
import { MoreHorizontal } from "lucide-react";

import { DashboardCard } from "@/components/admin/dashboard-card";
import { RECENT_BOOKINGS } from "@/components/admin/dashboard-mock";

const COLS = "grid-cols-[1fr_1.3fr_1.6fr_1.3fr_1.4fr_0.8fr_1fr_1.1fr_40px]";

function Dot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="size-[7px] rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

export function RecentBookings() {
  return (
    <DashboardCard className="overflow-hidden">
      <div className="flex items-start justify-between px-6 pt-[22px] pb-3.5">
        <div>
          <div className="text-[17px] font-semibold tracking-[-0.01em]">
            Recent Bookings
          </div>
          <div className="text-muted-foreground mt-0.5 text-[13px]">
            Latest activity across the platform
          </div>
        </div>
        <Link href="#" className="text-[13px] font-medium">
          View all
        </Link>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[880px]">
          <div
            className={`text-muted-foreground grid ${COLS} gap-2 px-6 pb-2.5 text-[11px] font-semibold tracking-[0.04em]`}
          >
            <div>BOOKING ID</div>
            <div>CUSTOMER</div>
            <div>AGENT</div>
            <div>SERVICE</div>
            <div>SCHEDULED</div>
            <div>AMOUNT</div>
            <div>PAYMENT</div>
            <div>STATUS</div>
            <div />
          </div>

          {RECENT_BOOKINGS.map((booking) => (
            <div
              key={booking.id}
              className={`border-border hover:bg-muted grid ${COLS} items-center gap-2 border-t px-6 py-3.5 text-[13px] transition-colors`}
            >
              <div className="text-muted-foreground font-mono text-xs">{booking.id}</div>
              <div className="font-medium">{booking.customer}</div>
              <div className="text-muted-foreground">{booking.agent}</div>
              <div>{booking.service}</div>
              <div className="text-muted-foreground">{booking.scheduled}</div>
              <div className="font-semibold tabular-nums">{booking.amount}</div>
              <div>
                <Dot color={booking.paymentColor} label={booking.payment} />
              </div>
              <div>
                <Dot color={booking.statusColor} label={booking.status} />
              </div>
              <div className="text-right">
                <button
                  type="button"
                  aria-label="Booking actions"
                  className="text-muted-foreground hover:bg-muted inline-flex rounded-md p-1 transition-colors"
                >
                  <MoreHorizontal className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardCard>
  );
}
