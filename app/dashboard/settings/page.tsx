import { DashboardPanel } from "@/components/dashboard/dashboard-panel";
import { SettingsContent } from "@/components/dashboard/settings-content";

export default function SettingsPage() {
  return (
    <DashboardPanel title="Settings" subtitle="Manage notifications, plan, and security.">
      <SettingsContent />
    </DashboardPanel>
  );
}
