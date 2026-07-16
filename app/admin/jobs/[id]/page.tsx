import { AdminJobDetail } from "@/components/admin/admin-job-detail";
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";

export default function AdminJobDetailPage() {
  return (
    <DashboardPanel title="Job" subtitle="Visit detail, photos, and payout.">
      <AdminJobDetail />
    </DashboardPanel>
  );
}
