import {
  DashboardSearch,
  NewBookingButton,
  NotificationBell,
} from "@/components/dashboard/dashboard-actions";
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";
import { ServicesSection } from "@/components/dashboard/services-section";
import { StatCards } from "@/components/dashboard/stat-cards";

export default function DashboardPage() {
  return (
    <DashboardPanel
      title="Welcome Back!"
      subtitle="Track upcoming visits and review past services."
      actions={
        <>
          <DashboardSearch />
          <NotificationBell />
          <NewBookingButton />
        </>
      }
    >
      <StatCards />
      <ServicesSection />
    </DashboardPanel>
  );
}
