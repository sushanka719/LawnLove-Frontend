import { AdminBookings } from "@/components/admin/admin-bookings";
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";

export default function AdminBookingsPage() {
  return (
    <DashboardPanel
      title="Bookings"
      subtitle="Every booking across all customers."
    >
      <AdminBookings />
    </DashboardPanel>
  );
}
