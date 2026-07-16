import {
  NewBookingButton,
  NotificationBell,
} from "@/components/dashboard/dashboard-actions";
import { BookingList } from "@/components/dashboard/booking-list";
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";

export default function BookingsPage() {
  return (
    <DashboardPanel
      title="Bookings"
      subtitle="Track upcoming visits and review past services."
      actions={
        <>
          <NotificationBell />
          <NewBookingButton />
        </>
      }
    >
      <BookingList />
    </DashboardPanel>
  );
}
