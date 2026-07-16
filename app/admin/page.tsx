import { AdminOverview } from "@/components/admin/admin-overview";
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";

export default function AdminOverviewPage() {
  return (
    <DashboardPanel
      title="Overview"
      subtitle="Marketplace health at a glance."
    >
      <AdminOverview />
    </DashboardPanel>
  );
}
