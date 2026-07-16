import { AdminAgents } from "@/components/admin/admin-agents";
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";

export default function AdminAgentsPage() {
  return (
    <DashboardPanel
      title="Agents"
      subtitle="Field crew and their payout onboarding status."
    >
      <AdminAgents />
    </DashboardPanel>
  );
}
