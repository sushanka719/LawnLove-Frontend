import { AdminDisputes } from "@/components/admin/admin-disputes";
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";

export default function AdminDisputesPage() {
  return (
    <DashboardPanel
      title="Disputes"
      subtitle="Resolve disputed jobs with a refund before payout."
    >
      <AdminDisputes />
    </DashboardPanel>
  );
}
