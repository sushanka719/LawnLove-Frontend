import { AdminPricingSettings } from "@/components/admin/admin-pricing-settings";
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";

export default function AdminPricingPage() {
  return (
    <DashboardPanel
      title="Pricing"
      subtitle="Area surcharge tiers and the maximum serviceable area — shared across every plan."
    >
      <AdminPricingSettings />
    </DashboardPanel>
  );
}
