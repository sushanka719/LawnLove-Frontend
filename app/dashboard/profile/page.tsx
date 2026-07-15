import { DashboardPanel } from "@/components/dashboard/dashboard-panel";
import { ProfileContent } from "@/components/dashboard/profile-content";

export default function ProfilePage() {
  return (
    <DashboardPanel title="Profile" subtitle="Your personal details and contact info.">
      <ProfileContent />
    </DashboardPanel>
  );
}
