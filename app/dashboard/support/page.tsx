import { DashboardPanel } from "@/components/dashboard/dashboard-panel";
import { SupportCards } from "@/components/dashboard/support-cards";

export default function SupportPage() {
  return (
    <DashboardPanel
      title="Support"
      subtitle="We're here to help - most questions are answered here."
    >
      <SupportCards />
    </DashboardPanel>
  );
}
