import { AdminBookingDetail } from "@/components/admin/admin-booking-detail";
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";

export default function AdminBookingDetailPage() {
  return (
    <DashboardPanel title="Booking" subtitle="Booking detail and visits.">
      <AdminBookingDetail />
    </DashboardPanel>
  );
}
