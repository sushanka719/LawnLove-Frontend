import { AdminUsers } from "@/components/admin/admin-users";
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";

export default function AdminUsersPage() {
  return (
    <DashboardPanel
      title="Users"
      subtitle="Search accounts, change roles, and manage bans."
    >
      <AdminUsers />
    </DashboardPanel>
  );
}
