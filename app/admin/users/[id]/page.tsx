import { AdminUserDetail } from "@/components/admin/admin-user-detail";
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";

export default function AdminUserDetailPage() {
  return (
    <DashboardPanel title="User" subtitle="Account detail and controls.">
      <AdminUserDetail />
    </DashboardPanel>
  );
}
