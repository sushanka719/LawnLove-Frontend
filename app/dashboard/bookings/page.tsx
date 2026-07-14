import {
  NewBookingButton,
  NotificationBell,
} from "@/components/dashboard/dashboard-actions";
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";
import { PastVisitSection, UpcomingSection } from "@/components/dashboard/visit-list";

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
      <UpcomingSection />
      <PastVisitSection />
    </DashboardPanel>
  );
}
