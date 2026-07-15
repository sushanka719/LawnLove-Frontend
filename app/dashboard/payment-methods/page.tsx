import { Plus } from "lucide-react";

import {
  GradientButton,
  NotificationBell,
} from "@/components/dashboard/dashboard-actions";
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";
import { PaymentMethodsList } from "@/components/dashboard/payment-methods-list";

export default function PaymentMethodsPage() {
  return (
    <DashboardPanel
      title="Payment Methods"
      subtitle="Cards on file for your bookings."
      actions={
        <>
          <NotificationBell />
          <GradientButton icon={Plus}>Add card</GradientButton>
        </>
      }
    >
      <PaymentMethodsList />
    </DashboardPanel>
  );
}
