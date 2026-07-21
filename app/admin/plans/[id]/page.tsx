import { AdminPlanDetail } from "@/components/admin/admin-plan-detail";
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";

export default function AdminPlanDetailPage() {
  return (
    <DashboardPanel title="Plan" subtitle="Edit or remove this plan.">
      <AdminPlanDetail />
    </DashboardPanel>
  );
}
