import { AdminPlanForm } from "@/components/admin/admin-plan-form";
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";

export default function AdminNewPlanPage() {
  return (
    <DashboardPanel title="New plan" subtitle="Create a booking plan.">
      <AdminPlanForm />
    </DashboardPanel>
  );
}
